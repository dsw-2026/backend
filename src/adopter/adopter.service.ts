import { adopterDao } from './adopter.dao.js'
import { userService } from '../user/user.service.js'
import { NotFoundError } from '../shared/errors/app.error.js'
import type { CreateAdopterDto, UpdateAdopterDto } from './schemas/adopter.schema.js'

export class AdopterService {
  async findAll() {
    return await adopterDao.findAll()
  }

  async findOne(id: number) {
    const adopter = await adopterDao.findOne(id)
    if (!adopter) {
      throw new NotFoundError(`No se encontró el adoptante con ID ${id}`)
    }
    return adopter
  }

  async create(dto: CreateAdopterDto) {
    const hashedPassword = await userService.hashPassword(dto.password)
    return await adopterDao.create({ ...dto, password: hashedPassword, verified: false })
  }

  async update(id: number, dto: UpdateAdopterDto) {
    const adopter = await this.findOne(id)
    const data = { ...dto }
    if (dto.password) {
      data.password = await userService.hashPassword(dto.password)
    }
    return await adopterDao.update(adopter, data)
  }

  async remove(id: number) {
    const adopter = await this.findOne(id)
    return await adopterDao.delete(adopter)
  }
}

export const adopterService = new AdopterService()