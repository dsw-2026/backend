import { describe, it, expect } from 'vitest'
import { ApplicationService } from '../application.service.js'
import { ApplicationStatus } from '../application.enums.js'
import { PetStatus } from '../../pet/pet.enums.js'
import { ConflictError, ForbiddenError, NotFoundError } from '../../shared/errors/app.error.js'

// Builds a fresh application each time, since approve() mutates the object.
const crearSolicitud = (overrides: any = {}) => ({
  id: 99,
  status: ApplicationStatus.PENDING,
  pet: {
    id: 1,
    status: PetStatus.AVAILABLE,
    publisher: { id: 10 },
  },
  ...overrides,
})

// DAO mock: findOne returns the given application, findPendingByPet the "others".
const crearDao = (application: any, others: any[] = []) => {
  const dao = {
    flushLlamado: false,
    findOne: async () => application,
    findPendingByPet: async () => others,
    flush: async () => { dao.flushLlamado = true },
  }
  return dao
}

describe('ApplicationService.approve (Epic B)', () => {
  it('aprueba la solicitud, marca la mascota como adoptada y rechaza las demás pendientes', async () => {
    const solicitud = crearSolicitud()
    const otra = { id: 100, status: ApplicationStatus.PENDING }
    const dao = crearDao(solicitud, [otra])

    const service = new ApplicationService({ findOne: async () => ({}) }, dao as any)
    const resultado = await service.approve(99, 10)

    expect(resultado.status).toBe(ApplicationStatus.APPROVED)
    expect(resultado.pet.status).toBe(PetStatus.ADOPTED)
    expect(resultado.resolutionDate).toBeInstanceOf(Date)
    expect(otra.status).toBe(ApplicationStatus.REJECTED) // cascade rejection
    expect(dao.flushLlamado).toBe(true)
  })

  it('lanza ForbiddenError si quien aprueba no es el publicador de la mascota', async () => {
    const dao = crearDao(crearSolicitud())
    const service = new ApplicationService({ findOne: async () => ({}) }, dao as any)

    await expect(service.approve(99, 77)).rejects.toThrow(ForbiddenError)
  })

  it('lanza ConflictError si la solicitud ya fue evaluada', async () => {
    const dao = crearDao(crearSolicitud({ status: ApplicationStatus.REJECTED }))
    const service = new ApplicationService({ findOne: async () => ({}) }, dao as any)

    await expect(service.approve(99, 10)).rejects.toThrow(ConflictError)
    await expect(service.approve(99, 10)).rejects.toThrow('ya fue evaluada')
  })

  it('lanza ConflictError si la mascota ya no está disponible', async () => {
    const solicitud = crearSolicitud()
    solicitud.pet.status = PetStatus.ADOPTED
    const dao = crearDao(solicitud)
    const service = new ApplicationService({ findOne: async () => ({}) }, dao as any)

    await expect(service.approve(99, 10)).rejects.toThrow(ConflictError)
    await expect(service.approve(99, 10)).rejects.toThrow('ya no está disponible')
  })

  it('lanza NotFoundError si la solicitud no existe', async () => {
    const dao = { ...crearDao(null), findOne: async () => null }
    const service = new ApplicationService({ findOne: async () => ({}) }, dao as any)

    await expect(service.approve(999, 10)).rejects.toThrow(NotFoundError)
  })
})