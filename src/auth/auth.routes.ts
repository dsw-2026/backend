import { Router } from 'express'
import { login, obtenerPerfil } from './auth.controller.js'
import { verificarToken } from '../auth/auth.middleware.js'

export const authRouter = Router()

// Login: pública por definición. Es la única forma de conseguir un token
authRouter.post('/login', login)

// Perfil propio: pide token y nada más. No lleva verificarTipo porque los tres
// roles necesitan saber quién son
authRouter.get('/me', verificarToken, obtenerPerfil)