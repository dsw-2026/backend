import { speciesDao } from './species.dao.js'
import { NotFoundError } from '../shared/errors/app.error.js'
import type { CreateSpeciesDto, UpdateSpeciesDto } from './schemas/species.schema.js'

export class SpeciesService {
  async findAll() {
    return await speciesDao.findAll()
  }

  async findOne(id: number) {
    const species = await speciesDao.findOne(id)
    if (!species) {
      throw new NotFoundError(`Species with ID ${id} not found`)
    }
    return species
  }

  async create(dto: CreateSpeciesDto) {
    return await speciesDao.create(dto)
  }

  async update(id: number, dto: UpdateSpeciesDto) {
    const species = await this.findOne(id)
    return await speciesDao.update(species, dto)
  }

  async remove(id: number) {
    const species = await this.findOne(id)
    return await speciesDao.delete(species)
  }
}

export const speciesService = new SpeciesService()