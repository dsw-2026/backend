import { Router } from 'express'
import { sanitizeSolicitudInput, findAll, findOne, create, remove } from './solicitud.controller.js'

export const solicitudRouter = Router()

solicitudRouter.get('/', findAll)
solicitudRouter.get('/:id', findOne)
solicitudRouter.post('/', sanitizeSolicitudInput, create)
solicitudRouter.delete('/:id', remove)