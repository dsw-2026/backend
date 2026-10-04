import { Router } from 'express'
import { authenticate } from '../shared/middlewares/auth.middleware.js'
import { authorize } from '../shared/middlewares/role.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createSpeciesSchema, updateSpeciesSchema, idParamSchema } from './schemas/species.schema.js'
import { speciesController } from './species.controller.js'

export const speciesRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Species
 *   description: Gestión de especies de mascotas
 */

/**
 * @swagger
 * /species:
 *   get:
 *     summary: Lista todas las especies
 *     tags: [Species]
 *     responses:
 *       200:
 *         description: Lista de especies obtenida exitosamente
 */
speciesRouter.get('/', speciesController.findAll)

/**
 * @swagger
 * /species/{id}:
 *   get:
 *     summary: Obtiene una especie por ID
 *     tags: [Species]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: La especie fue encontrada
 *       404:
 *         description: Especie no encontrada
 */
speciesRouter.get('/:id', validate(idParamSchema), speciesController.findOne)

/**
 * @swagger
 * /species:
 *   post:
 *     summary: Crea una nueva especie (solo Admin)
 *     tags: [Species]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Perro" }
 *     responses:
 *       201:
 *         description: Especie creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Rol de usuario no autorizado
 */
speciesRouter.post('/', authenticate, authorize('Admin'), validate(createSpeciesSchema), speciesController.create)

/**
 * @swagger
 * /species/{id}:
 *   put:
 *     summary: Actualiza una especie existente (solo Admin)
 *     tags: [Species]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Gato Doméstico" }
 *     responses:
 *       200:
 *         description: Especie actualizada exitosamente
 *       400:
 *         description: ID o datos de formulario inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Especie no encontrada
 */
speciesRouter.put('/:id', authenticate, authorize('Admin'), validate(updateSpeciesSchema), speciesController.update)
speciesRouter.patch('/:id', authenticate, authorize('Admin'), validate(updateSpeciesSchema), speciesController.update)

/**
 * @swagger
 * /species/{id}:
 *   delete:
 *     summary: Elimina una especie del sistema (solo Admin)
 *     tags: [Species]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Especie eliminada exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Especie no encontrada
 */
speciesRouter.delete('/:id', authenticate, authorize('Admin'), validate(idParamSchema), speciesController.remove)
