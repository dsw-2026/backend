import { adminDao } from './admin.dao.js'
import { NotFoundError } from '../shared/errors/app.error.js'

export class AdminService {
  async findAll() {
    return await adminDao.findAll()
  }
  
  async findOne(id: number) {
    const admin = await adminDao.findOne(id)
    if (!admin) {
      throw new NotFoundError(`No se encontró el administrador con ID ${id}`)
    }
    return admin
  }
}

export const adminService = new AdminService()