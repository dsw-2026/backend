import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'node:fs'

// Carpeta donde quedan los archivos subidos. process.cwd() apunta a la
// raíz del proyecto (backend/) cuando se corre "node ./dist/app.js" desde
// ahí (ver package.json), así que "uploads" queda en backend/uploads —
// al mismo nivel que src/ y dist/, no adentro de ninguna de las dos.
const CARPETA_UPLOADS = path.join(process.cwd(), 'uploads')
fs.mkdirSync(CARPETA_UPLOADS, { recursive: true })

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const TAMANIO_MAXIMO_BYTES = 5 * 1024 * 1024 // 5 MB

const storage = multer.diskStorage({
  destination: CARPETA_UPLOADS,
  filename: (req, file, cb) => {
    // Nombre único (no el nombre original del archivo): evita que dos
    // personas subiendo "foto.jpg" el mismo día se pisen entre sí.
    const extension = path.extname(file.originalname)
    const nombreUnico = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${extension}`
    cb(null, nombreUnico)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: TAMANIO_MAXIMO_BYTES },
  fileFilter: (req, file, cb) => {
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
      cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes JPG, PNG, WEBP o GIF.'))
      return
    }
    cb(null, true)
  },
})

// Multer, por defecto, si falla (archivo muy grande, tipo no permitido)
// deja que el error caiga en el manejador de errores por defecto de
// Express, que devuelve HTML — no el JSON {message} que espera el resto
// de la API. Este wrapper intercepta ese error y responde consistente.
function middlewareSubida(req: Request, res: Response, next: NextFunction) {
  upload.single('foto')(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'La imagen supera el tamaño máximo permitido (5 MB)' })
    }
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    next()
  })
}

async function subirImagen(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ningún archivo' })
    }
    // La URL es relativa: el frontend ya sabe a qué host pegarle
    // (VITE_API_URL), acá solo se devuelve la parte del path servida por
    // express.static (ver app.ts).
    const url = `/uploads/${req.file.filename}`
    res.status(201).json({ message: 'Imagen subida', data: { url } })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al subir la imagen' })
  }
}

export { middlewareSubida, subirImagen }
