import { especieDao } from './especie.dao.js'
import { EspecieDto } from './dto/especie.dto.js'
import { NotFoundError } from '../shared/errors/app.error.js'

export class EspecieService {
  async findAll() {
    return await especieDao.findAll()
  }

  async findOne(id: number) {
    const especie = await especieDao.findOne(id)
    if (!especie) {
      throw new NotFoundError(`La especie con ID ${id} no existe`)
    }
    return especie
  }

  async create(dto: EspecieDto) {
    return await especieDao.create({ nombre: dto.nombre })
  }

  async update(id: number, dto: EspecieDto) {
    const especie = await this.findOne(id)
    return await especieDao.update(especie, { nombre: dto.nombre })
  }

  async remove(id: number) {
    const especie = await this.findOne(id)
    return await especieDao.delete(especie)
  }
}

export const especieService = new EspecieService()