import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createPublisherSchema, updatePublisherSchema, idParamSchema } from './schemas/publisher.schema.js'
import { publisherController } from './publisher.controller.js'

export const publisherRouter = Router()

publisherRouter.get('/', publisherController.findAll)
publisherRouter.get('/:id', validate(idParamSchema), publisherController.findOne)

publisherRouter.post('/', validate(createPublisherSchema), publisherController.create)

publisherRouter.put('/:id', verificarToken, validate(updatePublisherSchema), publisherController.update)
publisherRouter.patch('/:id', verificarToken, validate(updatePublisherSchema), publisherController.update)
publisherRouter.delete('/:id', verificarToken, publisherController.remove)