import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createSpeciesSchema, updateSpeciesSchema, idParamSchema } from './schemas/species.schema.js'
import { speciesController } from './species.controller.js'

export const speciesRouter = Router()

speciesRouter.get('/', speciesController.findAll)
speciesRouter.get('/:id', validate(idParamSchema), speciesController.findOne)

speciesRouter.post('/', verificarToken, verificarTipo('Admin'), validate(createSpeciesSchema), speciesController.create)
speciesRouter.put('/:id', verificarToken, verificarTipo('Admin'), validate(updateSpeciesSchema), speciesController.update)
speciesRouter.patch('/:id', verificarToken, verificarTipo('Admin'), validate(updateSpeciesSchema), speciesController.update)
speciesRouter.delete('/:id', verificarToken, verificarTipo('Admin'), validate(idParamSchema), speciesController.remove)