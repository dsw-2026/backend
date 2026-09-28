import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createLocalitySchema, updateLocalitySchema, idParamSchema } from './schemas/locality.schema.js'
import { localityController } from './locality.controller.js'

export const localityRouter = Router()

localityRouter.get('/', localityController.findAll)
localityRouter.get('/:id', validate(idParamSchema), localityController.findOne)

localityRouter.post('/', verificarToken, verificarTipo('Admin'), validate(createLocalitySchema), localityController.create)
localityRouter.put('/:id', verificarToken, verificarTipo('Admin'), validate(updateLocalitySchema), localityController.update)
localityRouter.patch('/:id', verificarToken, verificarTipo('Admin'), validate(updateLocalitySchema), localityController.update)
localityRouter.delete('/:id', verificarToken, verificarTipo('Admin'), validate(idParamSchema), localityController.remove)