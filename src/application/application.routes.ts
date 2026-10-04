import { Router } from 'express'
import { authenticate } from '../shared/middlewares/auth.middleware.js'
import { authorize } from '../shared/middlewares/role.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createApplicationSchema, idParamSchema } from './schemas/application.schema.js'
import { applicationController } from './application.controller.js'

export const applicationRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Solicitudes de adopción (Epic A y B)
 */

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Lista las solicitudes según el rol (cada uno ve las suyas)
 *     tags: [Applications]
 *     parameters:
 *       - { in: query, name: status, schema: { type: string }, description: "Filtra por estado (PENDING, APPROVED, REJECTED)" }
 *     responses:
 *       200: { description: Lista de solicitudes }
 */
applicationRouter.get('/', authenticate, authorize('Adopter', 'Publisher', 'Admin'), applicationController.findAll)

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Obtiene una solicitud por ID
 *     tags: [Applications]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Solicitud encontrada }
 *       404: { description: No encontrada }
 */
applicationRouter.get('/:id', authenticate, authorize('Adopter', 'Publisher', 'Admin'), validate(idParamSchema), applicationController.findOne)

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: "Epic A: solicitar adopción (solo Adopter). Valida disponibilidad y evita duplicados."
 *     tags: [Applications]
 *     responses:
 *       201: { description: Solicitud creada }
 *       409: { description: Mascota no disponible o solicitud duplicada }
 */
applicationRouter.post('/', authenticate, authorize('Adopter'), validate(createApplicationSchema), applicationController.create)

/**
 * @swagger
 * /applications/{id}/approve:
 *   patch:
 *     summary: "Epic B: aprobar una solicitud (solo Publisher dueño). Marca la mascota como adoptada y rechaza las demás."
 *     tags: [Applications]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Solicitud aprobada }
 *       403: { description: No sos el publicador dueño }
 *       409: { description: La solicitud ya fue evaluada }
 */
applicationRouter.patch('/:id/approve', authenticate, authorize('Publisher'), validate(idParamSchema), applicationController.approve)

/**
 * @swagger
 * /applications/{id}/reject:
 *   patch:
 *     summary: "Epic B: rechazar una solicitud (solo Publisher dueño)."
 *     tags: [Applications]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Solicitud rechazada }
 */
applicationRouter.patch('/:id/reject', authenticate, authorize('Publisher'), validate(idParamSchema), applicationController.reject)

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: Elimina una solicitud (el adoptante o el publicador dueño)
 *     tags: [Applications]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Solicitud eliminada }
 */
applicationRouter.delete('/:id', authenticate, authorize('Adopter', 'Publisher'), validate(idParamSchema), applicationController.remove)