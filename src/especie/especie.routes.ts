import { Router } from 'express'
import { Especie } from './especie.entity.js'

export const especieRouter = Router()

const especies = [
  new Especie('Perro', 'Mamífero doméstico de cuatro patas'),
  new Especie('Gato', 'Felino doméstico independiente'),
]

especieRouter.get('/', (req, res) => {
  res.status(200).json(especies)
})

especieRouter.get('/:id', (req, res) => {
  const especie = especies.find((e) => e.id === req.params.id)
  if (!especie) {
    return res.status(404).json({ message: 'Especie no encontrada' })
  }
  res.status(200).json(especie)
})