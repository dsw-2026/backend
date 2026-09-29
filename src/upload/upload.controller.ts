import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { uploadFileSchema } from './schemas/upload.schema.js'
import { ValidationError } from '../shared/errors/app.error.js'
import { ApiResponse } from '../shared/errors/api.response.js'

const UPLOADS_FOLDER = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')

try {
  if (!fs.existsSync(UPLOADS_FOLDER)) {
    fs.mkdirSync(UPLOADS_FOLDER, { recursive: true })
  }
} catch (error) {
  console.error('Error crítico en el almacenamiento de archivos:', error)
  process.exit(1)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase()
    cb(null, `${crypto.randomUUID()}${extension}`)
  },
})

const upload = multer({
  storage,
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
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
      const firstError = validation.error.issues[0]?.message || 'Archivo inválido'
      return next(new ValidationError(firstError))
    }

    next()
  })
}

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file!
    const url = `/uploads/${file.filename}`
    return res.status(201).json(new ApiResponse('Imagen subida exitosamente', url ? { url } : null))
  } catch (error) {
    next(error)
  }
}