import { Router } from 'express'
import { sanitizeProvinciaInput, findAll, findOne, create, update, remove } from './provincia.controller.js'

export const provinciaRouter = Router()

provinciaRouter.get('/', findAll)
provinciaRouter.get('/:id', findOne)
provinciaRouter.post('/', sanitizeProvinciaInput, create)
provinciaRouter.put('/:id', sanitizeProvinciaInput, update)
provinciaRouter.patch('/:id', sanitizeProvinciaInput, update)
provinciaRouter.delete('/:id', remove)