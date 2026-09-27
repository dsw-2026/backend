import { provinceDao } from './province.dao.js'
import { NotFoundError } from '../shared/errors/app.error.js'
import type { CreateProvinceDto, UpdateProvinceDto } from './schemas/province.schema.js'

export class ProvinceService {
  async findAll() {
    return await provinceDao.findAll()
  }

  async findOne(id: number) {
    const province = await provinceDao.findOne(id)
    if (!province) {
      throw new NotFoundError(`Province with ID ${id} not found`)
    }
    return province
  }

  async create(dto: CreateProvinceDto) {
    return await provinceDao.create(dto)
  }

  async update(id: number, dto: UpdateProvinceDto) {
    const province = await this.findOne(id)
    return await provinceDao.update(province, dto)
  }

  async remove(id: number) {
    const province = await this.findOne(id)
    return await provinceDao.delete(province)
  }
}

export const provinceService = new ProvinceService()