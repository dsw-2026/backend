import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createSpeciesSchema, updateSpeciesSchema } from './schemas/species.schema.js'
import { speciesController } from './species.controller.js'

export const speciesRouter = Router()

// Public read: anyone can see the species catalog.
speciesRouter.get('/', speciesController.findAll)
speciesRouter.get('/:id', speciesController.findOne)

// Write: only Admin. validate() checks the body against the Zod schema
// before reaching the controller.
speciesRouter.post('/', verificarToken, verificarTipo('Admin'), validate(createSpeciesSchema), speciesController.create)
speciesRouter.put('/:id', verificarToken, verificarTipo('Admin'), validate(updateSpeciesSchema), speciesController.update)
speciesRouter.patch('/:id', verificarToken, verificarTipo('Admin'), validate(updateSpeciesSchema), speciesController.update)
speciesRouter.delete('/:id', verificarToken, verificarTipo('Admin'), speciesController.remove)