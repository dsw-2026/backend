import { Router } from 'express'
import { authenticate } from '../shared/middlewares/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createPublisherSchema, updatePublisherSchema, idParamSchema } from './schemas/publisher.schema.js'
import { publisherController } from './publisher.controller.js'

export const publisherRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Publishers
 *   description: Refugios, rescatistas y hogares de tránsito
 */

/**
 * @swagger
 * /publishers:
 *   get:
 *     summary: Lista todos los publicadores
 *     tags: [Publishers]
 *     responses:
 *       200: { description: Lista de publicadores }
 */
publisherRouter.get('/', publisherController.findAll)

/**
 * @swagger
 * /publishers/{id}:
 *   get:
 *     summary: Obtiene un publicador por ID
 *     tags: [Publishers]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Publicador encontrado }
 *       404: { description: No encontrado }
 */
publisherRouter.get('/:id', validate(idParamSchema), publisherController.findOne)

/**
 * @swagger
 * /publishers:
 *   post:
 *     summary: Registra un publicador (público)
 *     tags: [Publishers]
 *     responses:
 *       201: { description: Publicador creado }
 *       400: { description: Datos inválidos }
 */
publisherRouter.post('/', validate(createPublisherSchema), publisherController.create)

/**
 * @swagger
 * /publishers/{id}:
 *   put:
 *     summary: Actualiza un publicador (autenticado)
 *     tags: [Publishers]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Publicador actualizado }
 */
publisherRouter.put('/:id', authenticate, validate(updatePublisherSchema), publisherController.update)
publisherRouter.patch('/:id', authenticate, validate(updatePublisherSchema), publisherController.update)

/**
 * @swagger
 * /publishers/{id}:
 *   delete:
 *     summary: Elimina un publicador (autenticado)
 *     tags: [Publishers]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Publicador eliminado }
 */
publisherRouter.delete('/:id', authenticate, publisherController.remove)