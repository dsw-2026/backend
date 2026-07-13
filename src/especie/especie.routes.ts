import { Router } from 'express'
import { sanitizeEspecieInput, findAll, findOne, create, update, remove } from './especie.controller.js'

export const especieRouter = Router()

especieRouter.get('/', findAll)
especieRouter.get('/:id', findOne)
especieRouter.post('/', sanitizeEspecieInput, create)
especieRouter.put('/:id', sanitizeEspecieInput, update)
especieRouter.patch('/:id', sanitizeEspecieInput, update)
especieRouter.delete('/:id', remove)