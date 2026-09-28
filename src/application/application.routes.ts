import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createApplicationSchema, idParamSchema } from './schemas/application.schema.js'
import { applicationController } from './application.controller.js'

export const applicationRouter = Router()

applicationRouter.get('/', verificarToken, verificarTipo('Adopter', 'Publisher', 'Admin'), applicationController.findAll)
applicationRouter.get('/:id', verificarToken, verificarTipo('Adopter', 'Publisher', 'Admin'), validate(idParamSchema), applicationController.findOne)

applicationRouter.post('/', verificarToken, verificarTipo('Adopter'), validate(createApplicationSchema), applicationController.create)

applicationRouter.patch('/:id/approve', verificarToken, verificarTipo('Publisher'), validate(idParamSchema), applicationController.approve)
applicationRouter.patch('/:id/reject', verificarToken, verificarTipo('Publisher'), validate(idParamSchema), applicationController.reject)

applicationRouter.delete('/:id', verificarToken, verificarTipo('Adopter', 'Publisher'), validate(idParamSchema), applicationController.remove)