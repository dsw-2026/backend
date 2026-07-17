import { Router } from 'express'
import { sanitizePublicadorInput, findAll, findOne, create, update, remove } from './publicador.controller.js'

export const publicadorRouter = Router()

publicadorRouter.get('/', findAll)
publicadorRouter.get('/:id', findOne)
publicadorRouter.post('/', sanitizePublicadorInput, create)
publicadorRouter.put('/:id', sanitizePublicadorInput, update)
publicadorRouter.patch('/:id', sanitizePublicadorInput, update)
publicadorRouter.delete('/:id', remove)