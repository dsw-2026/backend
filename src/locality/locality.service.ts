import { localityDao } from './locality.dao.js'
import { NotFoundError } from '../shared/errors/app.error.js'
import type { CreateLocalityDto, UpdateLocalityDto } from './schemas/locality.schema.js'

export class LocalityService {
  async findAll() {
    return await localityDao.findAll()
  }

  async findOne(id: number) {
    const locality = await localityDao.findOne(id)
    if (!locality) {
      throw new NotFoundError(`No se encontró la localidad con ID ${id}`)
    }
    return locality
  }

  async create(dto: CreateLocalityDto) {
    return await localityDao.create(dto)
  }

  async update(id: number, dto: UpdateLocalityDto) {
    const locality = await this.findOne(id)
    return await localityDao.update(locality, dto)
  }

  async remove(id: number) {
    const locality = await this.findOne(id)
    return await localityDao.delete(locality)
  }
}

export const localityService = new LocalityService()