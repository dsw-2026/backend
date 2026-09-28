import bcrypt from 'bcrypt'
import { userDao } from './user.dao.js'
import { NotFoundError } from '../shared/errors/app.error.js'

export class UserService {
  async findAll() {
    return await userDao.findAll()
  }

  async findOne(id: number) {
    const user = await userDao.findOne(id)
    if (!user) {
      throw new NotFoundError(`No se encontró el usuario con ID ${id}`)
    }
    return user
  }

  async remove(id: number) {
    const user = await this.findOne(id)
    return await userDao.delete(user)
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, 10)
  }

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}

export const userService = new UserService()