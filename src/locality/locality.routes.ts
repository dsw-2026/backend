import { Router } from 'express'
import { verificarToken, verificarTipo } from '../shared/middlewares/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createLocalitySchema, updateLocalitySchema, idParamSchema } from './schemas/locality.schema.js'
import { localityController } from './locality.controller.js'

export const localityRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Localities
 *   description: Gestión de localidades
 */

/**
 * @swagger
 * /localities:
 *   get:
 *     summary: Lista todas las localidades
 *     tags: [Localities]
 *     responses:
 *       200: { description: Lista de localidades }
 */
localityRouter.get('/', localityController.findAll)

/**
 * @swagger
 * /localities/{id}:
 *   get:
 *     summary: Obtiene una localidad por ID
 *     tags: [Localities]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Localidad encontrada }
 *       404: { description: No encontrada }
 */
localityRouter.get('/:id', validate(idParamSchema), localityController.findOne)

/**
 * @swagger
 * /localities:
 *   post:
 *     summary: Crea una localidad (solo Admin)
 *     tags: [Localities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Rosario" }
 *               postalCode: { type: string, example: "2000" }
 *               province: { type: integer, example: 1 }
 *     responses:
 *       201: { description: Localidad creada }
 *       403: { description: Sin permisos }
 */
localityRouter.post('/', verificarToken, verificarTipo('Admin'), validate(createLocalitySchema), localityController.create)

/**
 * @swagger
 * /localities/{id}:
 *   put:
 *     summary: Actualiza una localidad (solo Admin)
 *     tags: [Localities]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Localidad actualizada }
 */
localityRouter.put('/:id', verificarToken, verificarTipo('Admin'), validate(updateLocalitySchema), localityController.update)
localityRouter.patch('/:id', verificarToken, verificarTipo('Admin'), validate(updateLocalitySchema), localityController.update)

/**
 * @swagger
 * /localities/{id}:
 *   delete:
 *     summary: Elimina una localidad (solo Admin)
 *     tags: [Localities]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Localidad eliminada }
 */
localityRouter.delete('/:id', verificarToken, verificarTipo('Admin'), validate(idParamSchema), localityController.remove)