import { orm } from '../shared/db/orm.js'
import { Locality } from './locality.entity.js'
import { mapDbError } from '../shared/errors/mapDbError.js'
import type { CreateLocalityDto, UpdateLocalityDto } from './schemas/locality.schema.js'

async function withDbError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    return mapDbError(error)
  }
}

const POPULATE = ['province'] as const

export class LocalityDao {
  findAll() {
    return withDbError(() => orm.em.find(Locality, {}, { populate: POPULATE }))
  }

  findOne(id: number) {
    return withDbError(() => orm.em.findOne(Locality, { id }, { populate: POPULATE }))
  }

  create(data: CreateLocalityDto) {
    return withDbError(async () => {
      const locality = orm.em.create(Locality, data)
      await orm.em.flush()
      await orm.em.populate(locality, POPULATE)
      return locality
    })
  }

  update(locality: Locality, data: UpdateLocalityDto) {
    return withDbError(async () => {
      orm.em.assign(locality, data)
      await orm.em.flush()
      await orm.em.populate(locality, POPULATE)
      return locality
    })
  }

  delete(locality: Locality) {
    return withDbError(async () => {
      orm.em.remove(locality)
      await orm.em.flush()
      return locality
    })
  }
}

export const localityDao = new LocalityDao()