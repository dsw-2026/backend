import { describe, it, expect } from 'vitest'
import { ApplicationService } from '../application.service.js'
import { ConflictError } from '../../shared/errors/app.error.js'

// Example DTO to create an application (the data doesn't matter much for
// these tests, except for the pet ID).
const dtoEjemplo = {
  message: 'Quiero adoptar',
  pet: 1,
  desiredEnergyLevel: 'MEDIUM',
  desiredSize: 'MEDIUM',
  desiredToleratesChildren: 'YES',
  desiredToleratesOtherAnimals: 'YES',
  desiredToleratesConfinement: 'NO',
} as any

describe('ApplicationService.create (Epic A)', () => {
  it('crea la solicitud si la mascota está disponible y no hay duplicados', async () => {
    // PetService mock: returns an AVAILABLE pet.
    const petServiceMock = {
      findOne: async () => ({ id: 1, status: 'AVAILABLE' }),
    }
    // DAO mock: no previous application exists, and create returns the application.
    const daoMock = {
      findExisting: async () => null,
      create: async (data: any) => ({ id: 99, ...data }),
    } as any

    const service = new ApplicationService(petServiceMock, daoMock)
    const resultado = await service.create(dtoEjemplo, 5)

    // Should create the application with PENDING status.
    expect(resultado.id).toBe(99)
    expect(resultado.status).toBe('PENDING')
    expect(resultado.adopter).toBe(5)
  })

  it('lanza ConflictError si la mascota NO está disponible', async () => {
    // Mock: ADOPTED pet (not available).
    const petServiceMock = {
      findOne: async () => ({ id: 1, status: 'ADOPTED' }),
    }
    const daoMock = {} as any

    const service = new ApplicationService(petServiceMock, daoMock)

    // Should reject with ConflictError.
    await expect(service.create(dtoEjemplo, 5)).rejects.toThrow(ConflictError)
    await expect(service.create(dtoEjemplo, 5)).rejects.toThrow('no está disponible')
  })

  it('lanza ConflictError si el adoptante ya solicitó esa mascota', async () => {
    // Mock: pet available, BUT a previous application already exists.
    const petServiceMock = {
      findOne: async () => ({ id: 1, status: 'AVAILABLE' }),
    }
    const daoMock = {
      findExisting: async () => ({ id: 50 }), // an application already exists
    } as any

    const service = new ApplicationService(petServiceMock, daoMock)

    await expect(service.create(dtoEjemplo, 5)).rejects.toThrow(ConflictError)
    await expect(service.create(dtoEjemplo, 5)).rejects.toThrow('Ya tenés una solicitud')
  })
})