import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Provincia } from './provincia.entity.js'

function sanitizeProvinciaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    codigo: req.body.codigo,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] == null) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const provincias = await orm.em.find(Provincia, {})
    res.status(200).json({ message: 'Provincias encontradas', data: provincias })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const provincia = await orm.em.findOne(Provincia, { id })
    if (!provincia) {
      return res.status(404).json({ message: 'Provincia no encontrada' })
    }
    res.status(200).json({ message: 'Provincia encontrada', data: provincia })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function create(req: Request, res: Response) {
  try {
    const provincia = orm.em.create(Provincia, req.body.sanitizedInput)
    await orm.em.flush()
    res.status(201).json({ message: 'Provincia creada', data: provincia })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const provincia = await orm.em.findOne(Provincia, { id })
    if (!provincia) {
      return res.status(404).json({ message: 'Provincia no encontrada' })
    }
    orm.em.assign(provincia, req.body.sanitizedInput)
    await orm.em.flush()
    res.status(200).json({ message: 'Provincia actualizada', data: provincia })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const provincia = await orm.em.findOne(Provincia, { id })
    if (!provincia) {
      return res.status(404).json({ message: 'Provincia no encontrada' })
    }
    orm.em.remove(provincia)
    await orm.em.flush()
    res.status(200).json({ message: 'Provincia eliminada exitosamente' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeProvinciaInput, findAll, findOne, create, update, remove }