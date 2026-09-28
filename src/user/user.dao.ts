import { orm } from '../shared/db/orm.js'
import { User } from './user.entity.js'
import { mapDbError } from '../shared/errors/mapDbError.js'

async function withDbError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    return mapDbError(error)
  }
}

const POPULATE = ['locality'] as const

export class UserDao {
  findAll() {
    return withDbError(() => orm.em.find(User, {}, { populate: POPULATE }))
  }

  findOne(id: number) {
    return withDbError(() => orm.em.findOne(User, { id }, { populate: POPULATE }))
  }

  findByEmail(email: string) {
    return withDbError(() => orm.em.findOne(User, { email }))
  }

  delete(user: User) {
    return withDbError(async () => {
      orm.em.remove(user)
      await orm.em.flush()
      return user
    })
  }
}

export const userDao = new UserDao()