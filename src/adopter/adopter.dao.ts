import { orm } from '../config/orm.js'
import { Adopter } from './adopter.entity.js'
import { mapDbError } from '../shared/errors/mapDbError.js'

async function withDbError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    return mapDbError(error)
  }
}

const POPULATE = ['locality'] as const

export class AdopterDao {
  findAll() {
    return withDbError(() => orm.em.find(Adopter, {}, { populate: POPULATE }))
  }

  findOne(id: number) {
    return withDbError(() => orm.em.findOne(Adopter, { id }, { populate: POPULATE }))
  }

  create(data: any) {
    return withDbError(async () => {
      const adopter = orm.em.create(Adopter, data)
      await orm.em.flush()
      await orm.em.populate(adopter, POPULATE)
      return adopter
    })
  }

  update(adopter: Adopter, data: any) {
    return withDbError(async () => {
      orm.em.assign(adopter, data)
      await orm.em.flush()
      await orm.em.populate(adopter, POPULATE)
      return adopter
    })
  }

  delete(adopter: Adopter) {
    return withDbError(async () => {
      orm.em.remove(adopter)
      await orm.em.flush()
      return adopter
    })
  }
}

export const adopterDao = new AdopterDao()