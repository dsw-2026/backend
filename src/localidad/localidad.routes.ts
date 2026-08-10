import { Router } from 'express'
import { sanitizeLocalidadInput, findAll, findOne, create, update, remove } from './localidad.controller.js'

export const localidadRouter = Router()

localidadRouter.get('/', findAll)
localidadRouter.get('/:id', findOne)
localidadRouter.post('/', sanitizeLocalidadInput, create)
localidadRouter.put('/:id', sanitizeLocalidadInput, update)
localidadRouter.patch('/:id', sanitizeLocalidadInput, update)
localidadRouter.delete('/:id', remove)