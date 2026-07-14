import { pool } from '../conn.js'

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS especies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion VARCHAR(255) NOT NULL
      )
    `)
    console.log('Tabla especies creada (o ya existía)')
  } catch (error) {
    console.error('Error creando tablas:', error)
  } finally {
    await pool.end()
  }
}

createTables()