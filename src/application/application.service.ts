import { applicationDao as defaultApplicationDao } from './application.dao.js'
import { PetService } from '../pet/pet.service.js'
import { NotFoundError, ConflictError, ForbiddenError } from '../shared/errors/app.error.js'
import { ApplicationStatus } from './application.enums.js'
import { PetStatus } from '../pet/pet.enums.js'
import type { CreateApplicationDto } from './schemas/application.schema.js'

// Minimal dependency types, so mocks can be injected in tests.
interface PetServiceLike {
  findOne(id: number): Promise<any>
}
interface ApplicationDaoLike {
  findAll(filter: any): Promise<any[]>
  findOne(id: number): Promise<any>
  findExisting(petId: number, adopterId: number): Promise<any>
  create(data: any): Promise<any>
  flush(): Promise<void>
  delete(application: any): Promise<any>
  findPendingByPet(petId: number, excludeId: number, status: ApplicationStatus): Promise<any[]>
}
 
export class ApplicationService {
  // Dependencies are injected via the constructor (defaults to the real
  // ones, mocks can be passed in tests).
  constructor(
    private petService: PetServiceLike = new PetService(),
    private applicationDao: ApplicationDaoLike = defaultApplicationDao,
  ) {}

  // Filters applications by role: an Adopter sees their own, a Publisher
  // sees the ones for their pets, an Admin sees all.
  async findAll(userId: number, userType: string, statusFilter?: string) {
    const filter: any = {}
    if (statusFilter) filter.status = statusFilter

    if (userType === 'Adopter') {
      filter.adopter = userId
    } else if (userType === 'Publisher') {
      filter.pet = { publisher: userId }
    } else if (userType === 'Admin') {
      // sees all
    } else {
      throw new ForbiddenError('Rol no autorizado')
    }

    return await this.applicationDao.findAll(filter)
  }

  async findOne(id: number) {
    const application = await this.applicationDao.findOne(id)
    if (!application) {
      throw new NotFoundError(`No se encontró la solicitud con ID ${id}`)
    }
    return application
  }

  // EPIC A: create an application. Validates availability and prevents duplicates.
  async create(dto: CreateApplicationDto, adopterId: number) {
    const pet = await this.petService.findOne(dto.pet)

    // Business rule: only available pets can be requested.
    if (pet.status !== PetStatus.AVAILABLE) {
      throw new ConflictError('La mascota no está disponible para adopción')
    }

    // An adopter can't request the same pet twice.
    const existing = await this.applicationDao.findExisting(dto.pet, adopterId)
    if (existing) {
      throw new ConflictError('Ya tenés una solicitud registrada para esta mascota')
    }

    return await this.applicationDao.create({
      message: dto.message,
      pet: dto.pet,
      adopter: adopterId,
      status: ApplicationStatus.PENDING,
      applicationDate: new Date(),
      desiredEnergyLevel: dto.desiredEnergyLevel,
      desiredSize: dto.desiredSize,
      desiredToleratesChildren: dto.desiredToleratesChildren,
      desiredToleratesOtherAnimals: dto.desiredToleratesOtherAnimals,
      desiredToleratesConfinement: dto.desiredToleratesConfinement,
    })
  }

  // EPIC B: approve. Marks the pet as adopted and rejects the other applications.
  async approve(id: number, publisherId: number) {
    const application = await this.findOne(id)

    if (application.pet.publisher.id !== publisherId) {
      throw new ForbiddenError('No estás autorizado para gestionar esta solicitud')
    }
    if (application.status !== ApplicationStatus.PENDING) {
      throw new ConflictError('La solicitud ya fue evaluada')
    }
    if (application.pet.status !== PetStatus.AVAILABLE) {
      throw new ConflictError('La mascota ya no está disponible')
    }

    application.status = ApplicationStatus.APPROVED
    application.resolutionDate = new Date()
    application.pet.status = PetStatus.ADOPTED

    // Cascade-reject the other pending applications for that pet.
    const others = await this.applicationDao.findPendingByPet(
      application.pet.id, application.id, ApplicationStatus.PENDING
    )
    others.forEach((o) => { o.status = ApplicationStatus.REJECTED })

    await this.applicationDao.flush()
    return application
  }

  // EPIC B: reject. Simple status change.
  async reject(id: number, publisherId: number) {
    const application = await this.findOne(id)

    if (application.pet.publisher.id !== publisherId) {
      throw new ForbiddenError('No estás autorizado para gestionar esta solicitud')
    }
    if (application.status !== ApplicationStatus.PENDING) {
      throw new ConflictError('La solicitud ya fue evaluada')
    }

    application.status = ApplicationStatus.REJECTED
    application.resolutionDate = new Date()
    await this.applicationDao.flush()
    return application
  }

  // Removes an application (only the owner adopter or the owner publisher).
  async remove(id: number, userId: number, userType: string) {
    const application = await this.findOne(id)

    const isOwnerAdopter = userType === 'Adopter' && application.adopter.id === userId
    const isOwnerPublisher = userType === 'Publisher' && application.pet.publisher.id === userId
    if (!isOwnerAdopter && !isOwnerPublisher) {
      throw new ForbiddenError('No tenés permiso para eliminar esta solicitud')
    }

    return await this.applicationDao.delete(application)
  }
}

export const applicationService = new ApplicationService()