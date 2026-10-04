import { Router } from 'express'
import { uploadMiddleware, uploadImage } from './upload.controller.js'
import { authenticate } from '../shared/middlewares/auth.middleware.js'

export const uploadRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Subida de imágenes
 */

/**
 * @swagger
 * /uploads:
 *   post:
 *     summary: Sube una imagen (JPG, PNG, WEBP o GIF, máx 5MB). Requiere login.
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen a subir.
 *     responses:
 *       201: { description: Imagen subida (devuelve la URL) }
 *       400: { description: Tamaño excedido, formato incorrecto o falta el archivo }
 *       401: { description: No autenticado }
 */
uploadRouter.post('/', authenticate, uploadMiddleware, uploadImage)