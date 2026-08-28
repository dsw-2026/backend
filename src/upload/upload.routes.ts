import { Router } from 'express'
import { middlewareSubida, subirImagen } from './upload.controller.js'
import { verificarToken } from '../auth/auth.middleware.js'

export const uploadRouter = Router()

uploadRouter.post('/', verificarToken, middlewareSubida, subirImagen)
