import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { idParamSchema } from './schemas/user.schema.js'
import { userController } from './user.controller.js'

export const userRouter = Router()

userRouter.get('/', verificarToken, verificarTipo('Admin'), userController.findAll)
userRouter.get('/:id', verificarToken, verificarTipo('Admin'), validate(idParamSchema), userController.findOne)

userRouter.delete('/:id', verificarToken, verificarTipo('Admin'), validate(idParamSchema), userController.remove)