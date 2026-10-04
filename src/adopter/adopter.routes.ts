import { Router } from 'express'
import { authenticate } from '../shared/middlewares/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createAdopterSchema, updateAdopterSchema, idParamSchema } from './schemas/adopter.schema.js'
import { adopterController } from './adopter.controller.js'

export const adopterRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Adopters
 *   description: Personas que buscan adoptar
 */

/**
 * @swagger
 * /adopters:
 *   post:
 *     summary: Registra un adoptante (público)
 *     tags: [Adopters]
 *     responses:
 *       201: { description: Adoptante creado }
 *       400: { description: Datos inválidos }
 */
adopterRouter.post('/', validate(createAdopterSchema), adopterController.create)

/**
 * @swagger
 * /adopters:
 *   get:
 *     summary: Lista todos los adoptantes (autenticado)
 *     tags: [Adopters]
 *     responses:
 *       200: { description: Lista de adoptantes }
 */
adopterRouter.get('/', authenticate, adopterController.findAll)

/**
 * @swagger
 * /adopters/{id}:
 *   get:
 *     summary: Obtiene un adoptante por ID (autenticado)
 *     tags: [Adopters]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Adoptante encontrado }
 *       404: { description: No encontrado }
 */
adopterRouter.get('/:id', authenticate, validate(idParamSchema), adopterController.findOne)

/**
 * @swagger
 * /adopters/{id}:
 *   put:
 *     summary: Actualiza un adoptante (autenticado)
 *     tags: [Adopters]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Adoptante actualizado }
 */
adopterRouter.put('/:id', authenticate, validate(updateAdopterSchema), adopterController.update)
adopterRouter.patch('/:id', authenticate, validate(updateAdopterSchema), adopterController.update)

/**
 * @swagger
 * /adopters/{id}:
 *   delete:
 *     summary: Elimina un adoptante (autenticado)
 *     tags: [Adopters]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Adoptante eliminado }
 */
adopterRouter.delete('/:id', authenticate, validate(idParamSchema), adopterController.remove)