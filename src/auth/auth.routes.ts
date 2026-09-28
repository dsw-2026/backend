import { Router } from 'express'
import { login, obtenerPerfil } from './auth.controller.js'
import { verificarToken } from '../auth/auth.middleware.js'

export const authRouter = Router()

authRouter.post('/login', login)

authRouter.get('/me', verificarToken, obtenerPerfil)