import { orm } from '../shared/db/orm.js'
import { Province } from './province.entity.js'
import { mapDbError } from '../shared/errors/mapDbError.js'
import type { CreateProvinceDto, UpdateProvinceDto } from './schemas/province.schema.js'

async function withDbError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    return mapDbError(error)
  }
}

export class ProvinceDao {
  findAll() {
    return withDbError(() => orm.em.find(Province, {}))
  }

  findOne(id: number) {
    return withDbError(() => orm.em.findOne(Province, { id }))
  }

  create(data: CreateProvinceDto) {
    return withDbError(async () => {
      const province = orm.em.create(Province, data)
      await orm.em.flush()
      return province
    })
  }

  update(province: Province, data: UpdateProvinceDto) {
    return withDbError(async () => {
      orm.em.assign(province, data)
      await orm.em.flush()
      return province
    })
  }

  delete(province: Province) {
    return withDbError(async () => {
      orm.em.remove(province)
      await orm.em.flush()
      return province
    })
  }
}

export const provinceDao = new ProvinceDao()