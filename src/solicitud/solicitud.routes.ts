import { Router } from 'express'
import { sanitizeSolicitudInput, findAll, findOne, create, aprobar, rechazar, remove } from './solicitud.controller.js'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'

export const solicitudRouter = Router()

solicitudRouter.get('/', verificarToken, findAll)
solicitudRouter.get('/:id', verificarToken, findOne)
solicitudRouter.post('/', verificarToken, verificarTipo('Adoptante'), sanitizeSolicitudInput, create)
solicitudRouter.patch('/:id/aprobar', verificarToken, verificarTipo('Publicador'), aprobar)
solicitudRouter.patch('/:id/rechazar', verificarToken, verificarTipo('Publicador'), rechazar)
solicitudRouter.delete('/:id', verificarToken, remove)