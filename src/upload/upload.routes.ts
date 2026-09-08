import { Router } from 'express'
import { middlewareSubida, subirImagen } from './upload.controller.js'

export const uploadRouter = Router()

uploadRouter.post('/', middlewareSubida, subirImagen)
