import { orm } from '../shared/db/orm.js'
import { Publisher } from './publisher.entity.js'
import { mapDbError } from '../shared/errors/mapDbError.js'

async function withDbError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    return mapDbError(error)
  }
}

const POPULATE = ['locality'] as const

export class PublisherDao {
  findAll() {
    return withDbError(() => orm.em.find(Publisher, {}, { populate: POPULATE }))
  }

  findOne(id: number) {
    return withDbError(() => orm.em.findOne(Publisher, { id }, { populate: POPULATE }))
  }

  // Recibe los datos ya procesados (con el password hasheado por el service).
  create(data: any) {
    return withDbError(async () => {
      const publisher = orm.em.create(Publisher, data)
      await orm.em.flush()
      await orm.em.populate(publisher, POPULATE)
      return publisher
    })
  }

  update(publisher: Publisher, data: any) {
    return withDbError(async () => {
      orm.em.assign(publisher, data)
      await orm.em.flush()
      await orm.em.populate(publisher, POPULATE)
      return publisher
    })
  }

  delete(publisher: Publisher) {
    return withDbError(async () => {
      orm.em.remove(publisher)
      await orm.em.flush()
      return publisher
    })
  }
}

export const publisherDao = new PublisherDao()