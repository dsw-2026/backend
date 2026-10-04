import { Router } from 'express'
import { login, getProfile } from './auth.controller.js'
import { authenticate } from '../shared/middlewares/auth.middleware.js'

export const authRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y sesión
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión y devuelve una cookie de sesión
 *     tags: [Auth]
 *     responses:
 *       200: { description: Login exitoso }
 *       401: { description: Credenciales incorrectas }
 */
authRouter.post('/login', login)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Devuelve los datos del usuario logueado
 *     tags: [Auth]
 *     responses:
 *       200: { description: Perfil del usuario }
 *       401: { description: No autenticado }
 */
authRouter.get('/me', authenticate, getProfile)