import { applicationDao as defaultApplicationDao } from './application.dao.js'
import { PetService } from '../pet/pet.service.js'
import { NotFoundError, ConflictError, ForbiddenError } from '../shared/errors/app.error.js'
import { ApplicationStatus } from './application.enums.js'
import { PetStatus } from '../pet/pet.enums.js'
import type { CreateApplicationDto } from './schemas/application.schema.js'

// Tipos mínimos de las dependencias, para poder inyectar mocks en los tests.
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
  // Las dependencias se reciben por constructor. Por defecto usa las reales,
  // pero en los tests se pueden inyectar mocks. (Inyección de dependencias.)
  constructor(
    private petService: PetServiceLike = new PetService(),
    private applicationDao: ApplicationDaoLike = defaultApplicationDao,
  ) {}

  async findAll(userId: number, userType: string, statusFilter?: string) {
    const filter: any = {}
    if (statusFilter) filter.status = statusFilter

    if (userType === 'Adopter') {
      filter.adopter = userId
    } else if (userType === 'Publisher') {
      filter.pet = { publisher: userId }
    } else if (userType === 'Admin') {
      // ve todas
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

  // EPIC A: crear solicitud. Valida disponibilidad y evita duplicados.
  async create(dto: CreateApplicationDto, adopterId: number) {
    const pet = await this.petService.findOne(dto.pet)

    if (pet.status !== PetStatus.AVAILABLE) {
      throw new ConflictError('La mascota no está disponible para adopción')
    }

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
    application.pet.status = PetStatus.ADOPTED

    const others = await this.applicationDao.findPendingByPet(
      application.pet.id, application.id, ApplicationStatus.PENDING
    )
    others.forEach((o) => { o.status = ApplicationStatus.REJECTED })

    await this.applicationDao.flush()
    return application
  }

  async reject(id: number, publisherId: number) {
    const application = await this.findOne(id)

    if (application.pet.publisher.id !== publisherId) {
      throw new ForbiddenError('No estás autorizado para gestionar esta solicitud')
    }
    if (application.status !== ApplicationStatus.PENDING) {
      throw new ConflictError('La solicitud ya fue evaluada')
    }

    application.status = ApplicationStatus.REJECTED
    await this.applicationDao.flush()
    return application
  }

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