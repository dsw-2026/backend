import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import * as z from 'zod'
import 'dotenv/config'
import { RequestContext } from '@mikro-orm/core'
import { orm, syncSchema } from './config/orm.js'
import { errorHandler } from './shared/middlewares/errorHandler.middlewares.js'
import swaggerUi from 'swagger-ui-express'
// Routers
import { speciesRouter } from './species/species.routes.js'
import { provinceRouter } from './province/province.routes.js'
import { characteristicRouter } from './characteristic/characteristic.routes.js'
import { localityRouter } from './locality/locality.routes.js'
import { userRouter } from './user/user.routes.js'
import { publisherRouter } from './publisher/publisher.routes.js'
import { adopterRouter } from './adopter/adopter.routes.js'
import { adminRouter } from './admin/admin.routes.js'
import { petRouter } from './pet/pet.routes.js'
import { applicationRouter } from './application/application.routes.js'
import { uploadRouter } from './upload/upload.routes.js'
import { authRouter } from './auth/auth.routes.js'
import { swaggerSpec } from './shared/swagger.js'

// Zod: Spanish locale for validation messages
z.config(z.locales.es())

export const app = express()

// CORS: allow the frontend (different origin/port) to consume this API
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}))

// Body parser
app.use(express.json())

// Cookie parser: needed to read the httpOnly auth token cookie
app.use(cookieParser())

// Static files: serves the uploads/ folder (pet and profile photos)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// MikroORM RequestContext: isolated EntityManager per HTTP request
app.use((req, res, next) => {
  RequestContext.create(orm.em, () => next())
})

// Routes
app.use('/api/species', speciesRouter)
app.use('/api/provinces', provinceRouter)
app.use('/api/characteristics', characteristicRouter)
app.use('/api/localities', localityRouter)
app.use('/api/users', userRouter)
app.use('/api/publishers', publisherRouter)
app.use('/api/adopters', adopterRouter)
app.use('/api/admins', adminRouter)
app.use('/api/pets', petRouter)
app.use('/api/applications', applicationRouter)
app.use('/api/uploads', uploadRouter)
app.use('/api/auth', authRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Catch-all: unmatched routes return 404 as JSON
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso no encontrado' })
})

// Global error handler (must be last)
app.use(errorHandler)

// Schema sync (development only, see orm.ts)
await syncSchema()

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
