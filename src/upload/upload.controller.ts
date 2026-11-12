import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { uploadFileSchema } from './schemas/upload.schema.js'
import { ValidationError } from '../shared/errors/app.error.js'
import { ApiResponse } from '../shared/errors/api.response.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024, files: 1 },
})

export function uploadMiddleware(req: Request, res: Response, next: NextFunction): void {
  upload.single('foto')(req, res, (error: unknown) => {
    if (error) {
      if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        return next(new ValidationError('La imagen supera el límite de 5 MB'))
      }
      return next(new ValidationError('Error al procesar la transferencia del archivo'))
    }

    if (!req.file) {
      return next(new ValidationError('No se recibió ningún archivo en el campo "foto"'))
    }

    const validation = uploadFileSchema.safeParse(req.file)
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Archivo inválido'
      return next(new ValidationError(firstError))
    }

    next()
  })
}

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file!
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'fluffy' }, (err, r) => (err || !r ? reject(err) : resolve(r)))
        .end(file.buffer)
    })
    return res.status(201).json(new ApiResponse('Imagen subida exitosamente', { url: result.secure_url }))
  } catch (error) {
    next(error)
  }
}