import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createCharacteristicSchema, updateCharacteristicSchema, idParamSchema } from './schemas/characteristic.schema.js'
import { characteristicController } from './characteristic.controller.js'

export const characteristicRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Characteristics
 *   description: Características de las mascotas
 */

/**
 * @swagger
 * /characteristics:
 *   get:
 *     summary: Lista todas las características
 *     tags: [Characteristics]
 *     responses:
 *       200: { description: Lista de características }
 */
characteristicRouter.get('/', characteristicController.findAll)

/**
 * @swagger
 * /characteristics/{id}:
 *   get:
 *     summary: Obtiene una característica por ID
 *     tags: [Characteristics]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Característica encontrada }
 *       404: { description: No encontrada }
 */
characteristicRouter.get('/:id', validate(idParamSchema), characteristicController.findOne)

/**
 * @swagger
 * /characteristics:
 *   post:
 *     summary: Crea una característica (solo Admin)
 *     tags: [Characteristics]
 *     responses:
 *       201: { description: Característica creada }
 *       403: { description: Sin permisos }
 */
characteristicRouter.post('/', verificarToken, verificarTipo('Admin'), validate(createCharacteristicSchema), characteristicController.create)

/**
 * @swagger
 * /characteristics/{id}:
 *   put:
 *     summary: Actualiza una característica (solo Admin)
 *     tags: [Characteristics]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Característica actualizada }
 */
characteristicRouter.put('/:id', verificarToken, verificarTipo('Admin'), validate(updateCharacteristicSchema), characteristicController.update)
characteristicRouter.patch('/:id', verificarToken, verificarTipo('Admin'), validate(updateCharacteristicSchema), characteristicController.update)

/**
 * @swagger
 * /characteristics/{id}:
 *   delete:
 *     summary: Elimina una característica (solo Admin)
 *     tags: [Characteristics]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Característica eliminada }
 */
characteristicRouter.delete('/:id', verificarToken, verificarTipo('Admin'), validate(idParamSchema), characteristicController.remove)