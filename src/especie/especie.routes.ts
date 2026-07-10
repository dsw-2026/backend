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