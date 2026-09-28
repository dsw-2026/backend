import { publisherDao } from './publisher.dao.js'
import { userService } from '../user/user.service.js'
import { NotFoundError } from '../shared/errors/app.error.js'
import type { CreatePublisherDto, UpdatePublisherDto } from './schemas/publisher.schema.js'

export class PublisherService {
  async findAll() {
    return await publisherDao.findAll()
  }

  async findOne(id: number) {
    const publisher = await publisherDao.findOne(id)
    if (!publisher) {
      throw new NotFoundError(`No se encontró el publicador con ID ${id}`)
    }
    return publisher
  }

  async create(dto: CreatePublisherDto) {
    const hashedPassword = await userService.hashPassword(dto.password)
    return await publisherDao.create({ ...dto, password: hashedPassword, verified: false })
  }

  async update(id: number, dto: UpdatePublisherDto) {
    const publisher = await this.findOne(id)
    const data = { ...dto }
    if (dto.password) {
      data.password = await userService.hashPassword(dto.password)
    }
    return await publisherDao.update(publisher, data)
  }

  async remove(id: number) {
    const publisher = await this.findOne(id)
    return await publisherDao.delete(publisher)
  }
}

export const publisherService = new PublisherService()