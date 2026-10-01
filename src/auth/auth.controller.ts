import { Request, Response } from 'express'
import { generateToken } from '../shared/utils/jwt.js'
import { wrap } from '@mikro-orm/core'
import { orm } from '../shared/db/orm.js'
import { User } from '../user/user.entity.js'
import { UserService } from '../user/user.service.js'
import { UnauthorizedError, NotFoundError } from '../shared/errors/app.error.js'
import { ApiResponse } from '../shared/errors/api.response.js'

const userService = new UserService()

async function login(req: Request, res: Response) {
  const { email, password } = req.body

  const user = await orm.em.findOne(User, { email })
  if (!user) {
    throw new UnauthorizedError('Email o contraseña incorrectos')
  }

  const validPassword = await userService.comparePassword(password, user.password)
  if (!validPassword) {
    throw new UnauthorizedError('Email o contraseña incorrectos')
  }

  const token = generateToken({ id: user.id, tipo: user.constructor.name })

  res.cookie('auth.token', token, { httpOnly: true })
  res.status(200).json(new ApiResponse('Login exitoso', { id: user.id, username: user.username }))
}

async function obtenerPerfil(req: Request, res: Response) {
  const user = await orm.em.findOne(User, { id: req.usuario!.id }, { populate: ['locality'] })
  if (!user) {
    throw new NotFoundError('Usuario no encontrado')
  }

  res.status(200).json(
    new ApiResponse('Perfil obtenido', { ...wrap(user).toJSON(), tipoUsuario: user.constructor.name })
  )
}

export { login, obtenerPerfil }