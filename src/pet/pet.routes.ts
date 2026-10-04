import { Router } from 'express'
import { authenticate } from '../shared/middlewares/auth.middleware.js'
import { authorize } from '../shared/middlewares/role.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createPetSchema, updatePetSchema, idParamSchema } from './schemas/pet.schema.js'
import { petController } from './pet.controller.js'

export const petRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Catálogo de mascotas en adopción
 */

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Lista las mascotas (filtrable por estado y especie)
 *     tags: [Pets]
 *     parameters:
 *       - { in: query, name: status, schema: { type: string }, description: "Filtra por estado (AVAILABLE, ADOPTED, etc.)" }
 *       - { in: query, name: species, schema: { type: integer }, description: "Filtra por id de especie" }
 *     responses:
 *       200: { description: Lista de mascotas }
 */
petRouter.get('/', petController.findAll)

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Obtiene una mascota por ID
 *     tags: [Pets]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Mascota encontrada }
 *       404: { description: No encontrada }
 */
petRouter.get('/:id', validate(idParamSchema), petController.findOne)

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Publica una mascota (solo Publisher). Crea la mascota y su característica juntas.
 *     tags: [Pets]
 *     responses:
 *       201: { description: Mascota creada }
 *       403: { description: Solo un Publisher puede publicar }
 */
petRouter.post('/', authenticate, authorize('Publisher'), validate(createPetSchema), petController.create)

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Actualiza una mascota (el Publisher dueño o un Admin)
 *     tags: [Pets]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Mascota actualizada }
 *       403: { description: No sos el dueño }
 */
petRouter.put('/:id', authenticate, authorize('Publisher', 'Admin'), validate(updatePetSchema), petController.update)
petRouter.patch('/:id', authenticate, authorize('Publisher', 'Admin'), validate(updatePetSchema), petController.update)

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Elimina una mascota (el Publisher dueño o un Admin)
 *     tags: [Pets]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Mascota eliminada }
 */
petRouter.delete('/:id', authenticate, authorize('Publisher', 'Admin'), validate(idParamSchema), petController.remove)