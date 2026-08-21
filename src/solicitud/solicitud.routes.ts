import { Router } from 'express'
import { sanitizeSolicitudInput, findAll, findOne, create, aprobar, rechazar, remove } from './solicitud.controller.js'

export const solicitudRouter = Router()

solicitudRouter.get('/', findAll)
solicitudRouter.get('/:id', findOne)
solicitudRouter.post('/', sanitizeSolicitudInput, create)
solicitudRouter.patch('/:id/aprobar', aprobar)
solicitudRouter.patch('/:id/rechazar', rechazar)
solicitudRouter.delete('/:id', remove)