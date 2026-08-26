import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { RequestContext } from '@mikro-orm/core'
import { orm, syncSchema } from './shared/db/orm.js'
import { especieRouter } from './especie/especie.routes.js'
import { provinciaRouter } from './provincia/provincia.routes.js'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { publicadorRouter } from './publicador/publicador.routes.js'
import { adoptanteRouter } from './adoptante/adoptante.routes.js'
import { mascotaRouter } from './mascota/mascota.routes.js'
import { localidadRouter } from './localidad/localidad.routes.js'
import { solicitudRouter } from './solicitud/solicitud.routes.js'
import { uploadRouter } from './upload/upload.routes.js'
import { authRouter } from './auth/auth.routes.js'
import 'dotenv/config'


export const app = express()

// Habilita al frontend (otro origin: puerto distinto) a consultar esta API.
// Sin esto, el navegador bloquea toda respuesta del backend aunque el
// pedido haya llegado bien — CORS_ORIGIN se puede sobreescribir por .env
// si en el futuro el frontend corre en otra URL (ej: al deployar).
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }))

app.use(express.json())

// Sirve la carpeta uploads/ (raíz del proyecto) como archivos estáticos:
// una imagen guardada como uploads/xxxx.jpg queda accesible en
// http://localhost:3000/uploads/xxxx.jpg — esa es la URL que se persiste
// en los campos foto/fotoPerfil.
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Crea un EntityManager aislado por cada petición HTTP (Unit of Work
// independiente), evitando que peticiones concurrentes se interfieran
// entre sí. Debe ir después de los middlewares base y antes de las rutas.
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

// Cada router se monta bajo un prefijo /api/<recurso>, siguiendo la
// convención REST. El orden importa: deben ir antes del catch-all final.
app.use('/api/especies', especieRouter)
app.use('/api/provincias', provinciaRouter)
app.use('/api/usuarios', usuarioRouter)
app.use('/api/publicadores', publicadorRouter)
app.use('/api/adoptantes', adoptanteRouter)
app.use('/api/mascotas', mascotaRouter)
app.use('/api/localidades', localidadRouter)
app.use('/api/solicitudes', solicitudRouter)
app.use('/api/uploads', uploadRouter)
app.use('/api/auth', authRouter)

// Catch-all: atrapa cualquier petición que no coincidió con ninguna ruta
// anterior, devolviendo un 404 en JSON en vez del HTML por defecto de
// Express. Debe ser el último app.use().
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso no encontrado' })
})

// Genera/actualiza el esquema de la base según las entidades (solo
// apropiado en desarrollo, ver advertencia en orm.ts).
await syncSchema()

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})