import { orm } from '../shared/db/orm.js'
import { Especie } from './especie.entity.js'
import { mapDbError } from '../shared/errors/mapDbError.js'

async function withDbError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    return mapDbError(error)
  }
}

export const especieDao = {
  findAll: () => withDbError(() => orm.em.find(Especie, {})),

  findOne: (id: number) => withDbError(() => orm.em.findOne(Especie, { id })),

  create: (data: { nombre: string }) =>
    withDbError(async () => {
      const especie = orm.em.create(Especie, data)
      await orm.em.flush()
      return especie
    }),

  update: (especie: Especie, data: { nombre?: string }) =>
    withDbError(async () => {
      orm.em.assign(especie, data)
      await orm.em.flush()
      return especie
    }),

  delete: (especie: Especie) => 
    withDbError(async () => {
      orm.em.remove(especie)
      await orm.em.flush()
      return especie
    }),
}
