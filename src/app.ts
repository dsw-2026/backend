import 'reflect-metadata'
import express from 'express'
import { RequestContext } from '@mikro-orm/core'
import { orm, syncSchema } from './shared/db/orm.js'
import { especieRouter } from './especie/especie.routes.js'
import { provinciaRouter } from './provincia/provincia.routes.js'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { publicadorRouter } from './publicador/publicador.routes.js'

import { solicitudRouter } from './solicitud/solicitud.routes.js'

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/especies', especieRouter)

app.use('/api/provincias', provinciaRouter)

app.use('/api/usuarios', usuarioRouter)

app.use('/api/publicadores', publicadorRouter)

app.use('/api/solicitudes', solicitudRouter)


app.use((req, res) => {
  res.status(404).json({ message: 'Recurso no encontrado' })
})

await syncSchema()

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})