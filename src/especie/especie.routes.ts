import { Router } from 'express'
import { Especie } from './especie.entity.js'

export const especieRouter = Router()

const especies = [
  new Especie('Perro', 'Mamífero doméstico de cuatro patas'),
  new Especie('Gato', 'Felino doméstico independiente'),
]

function sanitizeEspecieInput(req: any, res: any, next: any) {
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

especieRouter.get('/', (req, res) => {
  res.status(200).json({ message: 'Especies encontradas', data: especies })
})

especieRouter.get('/:id', (req, res) => {
  const especie = especies.find((e) => e.id === req.params.id)
  if (!especie) {
    return res.status(404).json({ message: 'Especie no encontrada' })
  }
  res.status(200).json({ message: 'Especie encontrada', data: especie })
})

especieRouter.post('/', sanitizeEspecieInput, (req: any, res) => {
  const { nombre, descripcion } = req.body.sanitizedInput
  const especie = new Especie(nombre, descripcion)
  especies.push(especie)
  res.status(201).json({ message: 'Especie creada', data: especie })
})

especieRouter.put('/:id', sanitizeEspecieInput, (req: any, res) => {
  const especieIndex = especies.findIndex((e) => e.id === req.params.id)

  if (especieIndex === -1) {
    return res.status(404).json({ message: 'Especie no encontrada' })
  }

  especies[especieIndex] = {
    ...especies[especieIndex],
    ...req.body.sanitizedInput,
  }

  res.status(200).json({ message: 'Especie actualizada', data: especies[especieIndex] })
})

especieRouter.patch('/:id', sanitizeEspecieInput, (req: any, res) => {
  const especieIndex = especies.findIndex((e) => e.id === req.params.id)

  if (especieIndex === -1) {
    return res.status(404).json({ message: 'Especie no encontrada' })
  }

  especies[especieIndex] = {
    ...especies[especieIndex],
    ...req.body.sanitizedInput,
  }

  res.status(200).json({ message: 'Especie actualizada parcialmente', data: especies[especieIndex] })
})