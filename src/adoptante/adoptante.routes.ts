import { Router } from 'express'
import { sanitizeAdoptanteInput, findAll, findOne, create, update, remove } from './adoptante.controller.js'

export const adoptanteRouter = Router()

adoptanteRouter.get('/', findAll)
adoptanteRouter.get('/:id', findOne)
adoptanteRouter.post('/', sanitizeAdoptanteInput, create)
adoptanteRouter.put('/:id', sanitizeAdoptanteInput, update)
adoptanteRouter.patch('/:id', sanitizeAdoptanteInput, update)
adoptanteRouter.delete('/:id', remove)