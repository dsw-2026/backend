import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.json({ message: 'Hello World', proyecto: 'Adopción de Mascotas' })
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})