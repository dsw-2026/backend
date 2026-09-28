import { Router } from 'express'
import { verificarToken } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createAdopterSchema, updateAdopterSchema, idParamSchema } from './schemas/adopter.schema.js'
import { adopterController } from './adopter.controller.js'

export const adopterRouter = Router()

adopterRouter.post('/', validate(createAdopterSchema), adopterController.create)

adopterRouter.get('/', verificarToken, adopterController.findAll)
adopterRouter.get('/:id', verificarToken, validate(idParamSchema), adopterController.findOne)
adopterRouter.put('/:id', verificarToken, validate(updateAdopterSchema), adopterController.update)
adopterRouter.patch('/:id', verificarToken, validate(updateAdopterSchema), adopterController.update)
adopterRouter.delete('/:id', verificarToken, validate(idParamSchema), adopterController.remove)