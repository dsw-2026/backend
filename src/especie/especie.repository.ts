import { Repository } from '../shared/repository.js'
import { Especie } from './especie.entity.js'
import { pool } from '../shared/db/conn.js'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export class EspecieRepository implements Repository<Especie> {
  async findAll(): Promise<Especie[] | undefined> {
    const [especies] = await pool.query<RowDataPacket[]>('SELECT * FROM especies')
    return especies as Especie[]
  }

  async findOne(item: { id: string }): Promise<Especie | undefined> {
    const id = Number(item.id)
    const [especies] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM especies WHERE id = ?',
      [id]
    )
    if (especies.length === 0) {
      return undefined
    }
    return especies[0] as Especie
  }

  async add(item: Especie): Promise<Especie | undefined> {
    const { nombre, descripcion } = item
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO especies (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion]
    )
    return { ...item, id: result.insertId }
  }

  async update(item: { id: string } & Partial<Especie>): Promise<Especie | undefined> {
    const id = Number(item.id)
    const { nombre, descripcion } = item
    await pool.query('UPDATE especies SET nombre = COALESCE(?, nombre), descripcion = COALESCE(?, descripcion) WHERE id = ?', [
      nombre ?? null,
      descripcion ?? null,
      id,
    ])
    return this.findOne({ id: item.id })
  }

  async delete(item: { id: string }): Promise<Especie | undefined> {
    const id = Number(item.id)
    const especie = await this.findOne({ id: item.id })
    if (!especie) {
      return undefined
    }
    await pool.query('DELETE FROM especies WHERE id = ?', [id])
    return especie
  }
}