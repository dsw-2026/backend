import { Router } from 'express'
import { sanitizeMascotaInput, findAll, findOne, create, update, remove } from './mascota.controller.js'

export const mascotaRouter = Router()

mascotaRouter.get('/', findAll)
mascotaRouter.get('/:id', findOne)
mascotaRouter.post('/', sanitizeMascotaInput, create)
mascotaRouter.put('/:id', sanitizeMascotaInput, update)
mascotaRouter.patch('/:id', sanitizeMascotaInput, update)
mascotaRouter.delete('/:id', remove)