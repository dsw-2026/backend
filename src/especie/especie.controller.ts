import { Request, Response, NextFunction } from 'express'
import { EspecieRepository } from './especie.repository.js'
import { Especie } from './especie.entity.js'

const repository = new EspecieRepository()

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

function findAll(req: Request, res: Response) {
  res.status(200).json({ message: 'Especies encontradas', data: repository.findAll() })
}

function findOne(req: Request, res: Response) {
  const especie = repository.findOne({ id: req.params.id })
  if (!especie) {
    return res.status(404).json({ message: 'Especie no encontrada' })
  }
  res.status(200).json({ message: 'Especie encontrada', data: especie })
}

function create(req: Request, res: Response) {
  const especie = new Especie(req.body.sanitizedInput.nombre, req.body.sanitizedInput.descripcion)
  const especieCreada = repository.add(especie)
  res.status(201).json({ message: 'Especie creada', data: especieCreada })
}

function update(req: Request, res: Response) {
  const especie = repository.update({ id: req.params.id, ...req.body.sanitizedInput })
  if (!especie) {
    return res.status(404).json({ message: 'Especie no encontrada' })
  }
  res.status(200).json({ message: 'Especie actualizada', data: especie })
}

function remove(req: Request, res: Response) {
  const especie = repository.delete({ id: req.params.id })
  if (!especie) {
    return res.status(404).json({ message: 'Especie no encontrada' })
  }
  res.status(200).json({ message: 'Especie eliminada exitosamente' })
}

export { sanitizeEspecieInput, findAll, findOne, create, update, remove }