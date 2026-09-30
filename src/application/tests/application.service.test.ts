import { describe, it, expect } from 'vitest'
import { ApplicationService } from '../application.service.js'
import { ConflictError } from '../../shared/errors/app.error.js'

// DTO de ejemplo para crear una solicitud (los datos no importan mucho para
// estos tests, salvo el id de la mascota).
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
    // Mock del PetService: devuelve una mascota DISPONIBLE.
    const petServiceMock = {
      findOne: async () => ({ id: 1, status: 'AVAILABLE' }),
    }
    // Mock del DAO: no hay solicitud previa, y create devuelve la solicitud.
    const daoMock = {
      findExisting: async () => null,
      create: async (data: any) => ({ id: 99, ...data }),
    } as any

    const service = new ApplicationService(petServiceMock, daoMock)
    const resultado = await service.create(dtoEjemplo, 5)

    // Debe crear la solicitud con estado PENDING.
    expect(resultado.id).toBe(99)
    expect(resultado.status).toBe('PENDING')
    expect(resultado.adopter).toBe(5)
  })

  it('lanza ConflictError si la mascota NO está disponible', async () => {
    // Mock: mascota ADOPTADA (no disponible).
    const petServiceMock = {
      findOne: async () => ({ id: 1, status: 'ADOPTED' }),
    }
    const daoMock = {} as any

    const service = new ApplicationService(petServiceMock, daoMock)

    // Debe rechazar con ConflictError.
    await expect(service.create(dtoEjemplo, 5)).rejects.toThrow(ConflictError)
    await expect(service.create(dtoEjemplo, 5)).rejects.toThrow('no está disponible')
  })

  it('lanza ConflictError si el adoptante ya solicitó esa mascota', async () => {
    // Mock: mascota disponible, PERO ya existe una solicitud previa.
    const petServiceMock = {
      findOne: async () => ({ id: 1, status: 'AVAILABLE' }),
    }
    const daoMock = {
      findExisting: async () => ({ id: 50 }), // ya existe una solicitud
    } as any

    const service = new ApplicationService(petServiceMock, daoMock)

    await expect(service.create(dtoEjemplo, 5)).rejects.toThrow(ConflictError)
    await expect(service.create(dtoEjemplo, 5)).rejects.toThrow('Ya tenés una solicitud')
  })
})