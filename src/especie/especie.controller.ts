import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Especie } from './especie.entity.js'

function sanitizeEspecieInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
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
    const especies = await orm.em.find(Especie, {})
    res.status(200).json({ message: 'Especies encontradas', data: especies })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function create(req: Request, res: Response) {
  try {
    const especie = orm.em.create(Especie, req.body.sanitizedInput)
    await orm.em.flush()
    res.status(201).json({ message: 'Especie creada', data: especie })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

function findOne(req: Request, res: Response) {
  res.status(501).json({ message: 'No implementado (próximo bloque)' })
}

function update(req: Request, res: Response) {
  res.status(501).json({ message: 'No implementado (próximo bloque)' })
}

function remove(req: Request, res: Response) {
  res.status(501).json({ message: 'No implementado (próximo bloque)' })
}

export { sanitizeEspecieInput, findAll, findOne, create, update, remove }