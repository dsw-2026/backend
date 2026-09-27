import { characteristicDao } from './characteristic.dao.js'
import { NotFoundError } from '../shared/errors/app.error.js'
import type { CreateCharacteristicDto, UpdateCharacteristicDto } from './schemas/characteristic.schema.js'

export class CharacteristicService {
  async findAll() {
    return await characteristicDao.findAll()
  }

  async findOne(id: number) {
    const characteristic = await characteristicDao.findOne(id)
    if (!characteristic) {
      throw new NotFoundError(`No se encontró la característica con ID ${id}`)
    }
    return characteristic
  }

  async create(dto: CreateCharacteristicDto) {
    return await characteristicDao.create(dto)
  }

  async update(id: number, dto: UpdateCharacteristicDto) {
    const characteristic = await this.findOne(id)
    return await characteristicDao.update(characteristic, dto)
  }

  async remove(id: number) {
    const characteristic = await this.findOne(id)
    return await characteristicDao.delete(characteristic)
  }
}

export const characteristicService = new CharacteristicService()