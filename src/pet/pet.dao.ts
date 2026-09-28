import { orm } from '../shared/db/orm.js'
import { Pet } from './pet.entity.js'
import { Characteristic } from '../characteristic/characteristic.entity.js'
import { mapDbError } from '../shared/errors/mapDbError.js'

async function withDbError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    return mapDbError(error)
  }
}

const POPULATE = ['species', 'publisher', 'characteristic'] as const

export class PetDao {
  findAll(filter: any) {
    return withDbError(() => orm.em.find(Pet, filter, { populate: POPULATE }))
  }

  findOne(id: number) {
    return withDbError(() => orm.em.findOne(Pet, { id }, { populate: POPULATE }))
  }

  create(petData: any, characteristicData: any) {
    return withDbError(async () => {
      const characteristic = orm.em.create(Characteristic, characteristicData)
      const pet = orm.em.create(Pet, { ...petData, characteristic })
      await orm.em.flush()
      await orm.em.populate(pet, POPULATE)
      return pet
    })
  }

  update(pet: Pet, petData: any, characteristicData: any) {
    return withDbError(async () => {
      orm.em.assign(pet, petData)
      orm.em.assign(pet.characteristic, characteristicData)
      await orm.em.flush()
      return pet
    })
  }

  delete(pet: Pet) {
    return withDbError(async () => {
      orm.em.remove(pet)
      await orm.em.flush()
      return pet
    })
  }

  countByStatus(id: number) {
    return withDbError(() => orm.em.count(Pet, { id }))
  }
}

export const petDao = new PetDao()