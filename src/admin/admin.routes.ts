import { Router } from 'express'
import { authenticate } from '../shared/middlewares/auth.middleware.js'
import { authorize } from '../shared/middlewares/role.middleware.js'
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
adminRouter.get('/', authenticate, authorize('Admin'), adminController.findAll)

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
adminRouter.get('/:id', authenticate, authorize('Admin'), adminController.findOne)