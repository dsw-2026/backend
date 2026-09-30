import { orm } from '../shared/db/orm.js'
import { Application } from './application.entity.js'
import { mapDbError } from '../shared/errors/mapDbError.js'
import type { RequiredEntityData } from '@mikro-orm/core'
import type { ApplicationStatus } from './application.enums.js'

async function withDbError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    return mapDbError(error)
  }
}

const POPULATE = [
  'pet',
  'pet.species',
  'pet.characteristic',
  'pet.publisher',
  'adopter',
  'adopter.locality',
  'adopter.locality.province',
] as const

export class ApplicationDao {
  findAll(filter: any): Promise<Application[]> {
    return withDbError(() =>
      orm.em.find(Application, filter, { populate: POPULATE as any, orderBy: { applicationDate: 'DESC' } })
    )
  }

  findOne(id: number): Promise<Application | null> {
    return withDbError(() => orm.em.findOne(Application, { id }, { populate: POPULATE as any }))
  }

  findExisting(petId: number, adopterId: number): Promise<Application | null> {
    return withDbError(() => orm.em.findOne(Application, { pet: petId, adopter: adopterId }))
  }

  create(data: RequiredEntityData<Application>): Promise<Application> {
    return withDbError(async () => {
      const application = orm.em.create(Application, data)
      await orm.em.flush()
      await orm.em.populate(application, POPULATE as any)
      return application
    })
  }

  flush(): Promise<void> {
    return withDbError(() => orm.em.flush())
  }

  delete(application: Application): Promise<Application> {
    return withDbError(async () => {
      orm.em.remove(application)
      await orm.em.flush()
      return application
    })
  }

  findPendingByPet(petId: number, excludeId: number, pendingStatus: ApplicationStatus): Promise<Application[]> {
    return withDbError(() =>
      orm.em.find(Application, { pet: petId, status: pendingStatus, id: { $ne: excludeId } })
    )
  }
}

export const applicationDao = new ApplicationDao()