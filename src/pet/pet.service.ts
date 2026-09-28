import { petDao } from './pet.dao.js'
import { NotFoundError } from '../shared/errors/app.error.js'
import type { CreatePetDto, UpdatePetDto } from './schemas/pet.schema.js'

function splitPetData(dto: any) {
  const {
    energyLevel, temperament, size, vaccinated, neutered,
    toleratesChildren, toleratesOtherAnimals, toleratesConfinement, additionalNotes,
    ...petFields
  } = dto

  const characteristicData = {
    energyLevel, temperament, size, vaccinated, neutered,
    toleratesChildren, toleratesOtherAnimals, toleratesConfinement, additionalNotes,
  }

  return { petFields, characteristicData }
}

export class PetService {
  async findAll(filter: { status?: string; species?: number }) {
    const query: any = {}
    if (filter.status) query.status = filter.status
    if (filter.species) query.species = filter.species
    return await petDao.findAll(query)
  }

  async findOne(id: number) {
    const pet = await petDao.findOne(id)
    if (!pet) {
      throw new NotFoundError(`No se encontró la mascota con ID ${id}`)
    }
    return pet
  }

  async create(dto: CreatePetDto, publisherId: number) {
    const { petFields, characteristicData } = splitPetData(dto)
    return await petDao.create({ ...petFields, publisher: publisherId }, characteristicData)
  }

  async update(id: number, dto: UpdatePetDto) {
    const pet = await this.findOne(id)
    const { petFields, characteristicData } = splitPetData(dto)
    return await petDao.update(pet, petFields, characteristicData)
  }

  async remove(id: number) {
    const pet = await this.findOne(id)
    return await petDao.delete(pet)
  }
}

export const petService = new PetService()