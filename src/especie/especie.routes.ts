import { Router } from 'express'
import { Especie } from './especie.entity.js'

export const especieRouter = Router()

const especies = [
  new Especie('Perro', 'Mamífero doméstico de cuatro patas'),
  new Especie('Gato', 'Felino doméstico independiente'),
]

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

especieRouter.post('/', (req, res) => {
  const especie = new Especie(req.body.nombre, req.body.descripcion)
  especies.push(especie)
  res.status(201).json({ message: 'Especie creada', data: especie })
})

especieRouter.put('/:id', (req, res) => {
  const especieIndex = especies.findIndex((e) => e.id === req.params.id)

  if (especieIndex === -1) {
    return res.status(404).json({ message: 'Especie no encontrada' })
  }

  especies[especieIndex] = {
    ...especies[especieIndex],
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
  }

  res.status(200).json({ message: 'Especie actualizada', data: especies[especieIndex] })
})