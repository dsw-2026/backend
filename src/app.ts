import express from 'express'
import { especieRouter } from './especie/especie.routes.js'

const app = express()

app.use(express.json())

app.use('/api/especies', especieRouter)

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})