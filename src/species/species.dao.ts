import { orm } from '../config/orm.js'
import { Species } from './species.entity.js'
import { mapDbError } from '../shared/errors/mapDbError.js'
import type { CreateSpeciesDto, UpdateSpeciesDto } from './schemas/species.schema.js'

async function withDbError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    return mapDbError(error)
  }
}

export class SpeciesDao {
  findAll() {
    return withDbError(() => orm.em.find(Species, {}))
  }

  findOne(id: number) {
    return withDbError(() => orm.em.findOne(Species, { id }))
  }

  create(data: CreateSpeciesDto) {
    return withDbError(async () => {
      const species = orm.em.create(Species, data)
      await orm.em.flush()
      return species
    })
  }

  update(species: Species, data: UpdateSpeciesDto) {
    return withDbError(async () => {
      orm.em.assign(species, data)
      await orm.em.flush()
      return species
    })
  }

  delete(species: Species) {
    return withDbError(async () => {
      orm.em.remove(species)
      await orm.em.flush()
      return species
    })
  }
}

export const speciesDao = new SpeciesDao()