import { orm } from '../config/orm.js'
import { Characteristic } from './characteristic.entity.js'
import { mapDbError } from '../shared/errors/mapDbError.js'
import type { CreateCharacteristicDto, UpdateCharacteristicDto } from './schemas/characteristic.schema.js'

async function withDbError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    return mapDbError(error)
  }
}

export class CharacteristicDao {
  findAll() {
    return withDbError(() => orm.em.find(Characteristic, {}))
  }

  findOne(id: number) {
    return withDbError(() => orm.em.findOne(Characteristic, { id }))
  }

  create(data: CreateCharacteristicDto) {
    return withDbError(async () => {
      const characteristic = orm.em.create(Characteristic, data)
      await orm.em.flush()
      return characteristic
    })
  }

  update(characteristic: Characteristic, data: UpdateCharacteristicDto) {
    return withDbError(async () => {
      orm.em.assign(characteristic, data)
      await orm.em.flush()
      return characteristic
    })
  }

  delete(characteristic: Characteristic) {
    return withDbError(async () => {
      orm.em.remove(characteristic)
      await orm.em.flush()
      return characteristic
    })
  }
}

export const characteristicDao = new CharacteristicDao()