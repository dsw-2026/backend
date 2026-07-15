import { Router } from 'express'
import { findAll, findOne, create, update, remove } from './especie.controller.js'

export const especieRouter = Router()

especieRouter.get('/', findAll)
especieRouter.get('/:id', findOne)
especieRouter.post('/', create)
especieRouter.put('/:id', update)
especieRouter.patch('/:id', update)
especieRouter.delete('/:id', remove)