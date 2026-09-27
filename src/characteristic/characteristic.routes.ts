import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createCharacteristicSchema, updateCharacteristicSchema, idParamSchema } from './schemas/characteristic.schema.js'
import { characteristicController } from './characteristic.controller.js'

export const characteristicRouter = Router()

characteristicRouter.get('/', characteristicController.findAll)
characteristicRouter.get('/:id', validate(idParamSchema), characteristicController.findOne)

characteristicRouter.post('/', verificarToken, verificarTipo('Admin'), validate(createCharacteristicSchema), characteristicController.create)
characteristicRouter.put('/:id', verificarToken, verificarTipo('Admin'), validate(updateCharacteristicSchema), characteristicController.update)
characteristicRouter.patch('/:id', verificarToken, verificarTipo('Admin'), validate(updateCharacteristicSchema), characteristicController.update)
characteristicRouter.delete('/:id', verificarToken, verificarTipo('Admin'), validate(idParamSchema), characteristicController.remove)