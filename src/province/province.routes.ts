import { Router } from 'express'
import { verificarToken, verificarTipo } from '../shared/middlewares/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createProvinceSchema, updateProvinceSchema, idParamSchema } from './schemas/province.schema.js'
import { provinceController } from './province.controller.js'

export const provinceRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Provinces
 *   description: Gestión de provincias
 */

/**
 * @swagger
 * /provinces:
 *   get:
 *     summary: Lista todas las provincias
 *     tags: [Provinces]
 *     responses:
 *       200: { description: Lista de provincias }
 */
provinceRouter.get('/', provinceController.findAll)

/**
 * @swagger
 * /provinces/{id}:
 *   get:
 *     summary: Obtiene una provincia por ID
 *     tags: [Provinces]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Provincia encontrada }
 *       404: { description: No encontrada }
 */
provinceRouter.get('/:id', validate(idParamSchema), provinceController.findOne)

/**
 * @swagger
 * /provinces:
 *   post:
 *     summary: Crea una provincia (solo Admin)
 *     tags: [Provinces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Santa Fe" }
 *               code: { type: string, example: "SF" }
 *     responses:
 *       201: { description: Provincia creada }
 *       403: { description: Sin permisos }
 */
provinceRouter.post('/', verificarToken, verificarTipo('Admin'), validate(createProvinceSchema), provinceController.create)

/**
 * @swagger
 * /provinces/{id}:
 *   put:
 *     summary: Actualiza una provincia (solo Admin)
 *     tags: [Provinces]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Provincia actualizada }
 */
provinceRouter.put('/:id', verificarToken, verificarTipo('Admin'), validate(updateProvinceSchema), provinceController.update)
provinceRouter.patch('/:id', verificarToken, verificarTipo('Admin'), validate(updateProvinceSchema), provinceController.update)

/**
 * @swagger
 * /provinces/{id}:
 *   delete:
 *     summary: Elimina una provincia (solo Admin)
 *     tags: [Provinces]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: Provincia eliminada }
 */
provinceRouter.delete('/:id', verificarToken, verificarTipo('Admin'), validate(idParamSchema), provinceController.remove)