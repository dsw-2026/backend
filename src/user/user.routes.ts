import { Router } from 'express'
import { authenticate } from '../shared/middlewares/auth.middleware.js'
import { authorize } from '../shared/middlewares/role.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { idParamSchema } from './schemas/user.schema.js'
import { userController } from './user.controller.js'

export const userRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios (solo Admin)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos los usuarios (solo Admin)
 *     tags: [Users]
 *     responses:
 *       200: { description: Lista de usuarios }
 *       403: { description: Sin permisos }
 */
userRouter.get('/', authenticate, authorize('Admin'), userController.findAll)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID (solo Admin)
 *     tags: [Users]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Usuario encontrado }
 *       404: { description: No encontrado }
 */
userRouter.get('/:id', authenticate, authorize('Admin'), validate(idParamSchema), userController.findOne)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Elimina un usuario (solo Admin)
 *     tags: [Users]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Usuario eliminado }
 */
userRouter.delete('/:id', authenticate, authorize('Admin'), validate(idParamSchema), userController.remove)