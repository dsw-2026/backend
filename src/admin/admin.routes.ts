import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { adminController } from './admin.controller.js'

export const adminRouter = Router()

adminRouter.get('/', verificarToken, verificarTipo('Admin'), adminController.findAll)
adminRouter.get('/:id', verificarToken, verificarTipo('Admin'), adminController.findOne)