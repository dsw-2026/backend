import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createCharacteristicSchema, updateCharacteristicSchema } from './schemas/characteristic.schema.js'
import { characteristicController } from './characteristic.controller.js'

export const characteristicRouter = Router()

// Public read.
characteristicRouter.get('/', characteristicController.findAll)
characteristicRouter.get('/:id', characteristicController.findOne)

// Write: only Admin.
characteristicRouter.post('/', verificarToken, verificarTipo('Admin'), validate(createCharacteristicSchema), characteristicController.create)
characteristicRouter.put('/:id', verificarToken, verificarTipo('Admin'), validate(updateCharacteristicSchema), characteristicController.update)
characteristicRouter.patch('/:id', verificarToken, verificarTipo('Admin'), validate(updateCharacteristicSchema), characteristicController.update)
characteristicRouter.delete('/:id', verificarToken, verificarTipo('Admin'), characteristicController.remove)