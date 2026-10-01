import { orm } from '../config/orm.js'
import { Admin } from './admin.entity.js'
import { mapDbError } from '../shared/errors/mapDbError.js'

async function withDbError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    return mapDbError(error)
  }
}

export class AdminDao {
  findAll() {
    return withDbError(() => orm.em.find(Admin, {}))
  }

  findOne(id: number) {
    return withDbError(() => orm.em.findOne(Admin, { id }))
  }
}

export const adminDao = new AdminDao()