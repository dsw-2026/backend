import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createPetSchema, updatePetSchema, idParamSchema } from './schemas/pet.schema.js'
import { petController } from './pet.controller.js'

export const petRouter = Router()

petRouter.get('/', petController.findAll)
petRouter.get('/:id', validate(idParamSchema), petController.findOne)

petRouter.post('/', verificarToken, verificarTipo('Publisher'), validate(createPetSchema), petController.create)

petRouter.put('/:id', verificarToken, verificarTipo('Publisher', 'Admin'), validate(updatePetSchema), petController.update)
petRouter.patch('/:id', verificarToken, verificarTipo('Publisher', 'Admin'), validate(updatePetSchema), petController.update)
petRouter.delete('/:id', verificarToken, verificarTipo('Publisher', 'Admin'), validate(idParamSchema), petController.remove)