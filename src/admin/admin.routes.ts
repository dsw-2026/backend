import { Router } from 'express'
import { verificarToken, verificarTipo } from '../shared/middlewares/auth.middleware.js'
import { adminController } from './admin.controller.js'

export const adminRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Administradores del sistema (solo Admin)
 */

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Lista todos los administradores (solo Admin)
 *     tags: [Admins]
 *     responses:
 *       200: { description: Lista de administradores }
 *       403: { description: Sin permisos }
 */
adminRouter.get('/', verificarToken, verificarTipo('Admin'), adminController.findAll)

/**
 * @swagger
 * /admins/{id}:
 *   get:
 *     summary: Obtiene un administrador por ID (solo Admin)
 *     tags: [Admins]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Administrador encontrado }
 */
adminRouter.get('/:id', verificarToken, verificarTipo('Admin'), adminController.findOne)