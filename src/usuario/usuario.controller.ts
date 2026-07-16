import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { orm } from '../shared/db/orm.js'
import { Usuario } from './usuario.entity.js'

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombreUsuario: req.body.nombreUsuario,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    contrasena: req.body.contrasena,
    email: req.body.email,
    telefono: req.body.telefono,
    descripcion: req.body.descripcion,
    direccion: req.body.direccion,
    fotoPerfil: req.body.fotoPerfil,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] == null) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await orm.em.find(Usuario, {})
    res.status(200).json({ message: 'Usuarios encontrados', data: usuarios })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const usuario = await orm.em.findOne(Usuario, { id })
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.status(200).json({ message: 'Usuario encontrado', data: usuario })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function create(req: Request, res: Response) {
  try {
    const contrasenaHasheada = await bcrypt.hash(req.body.sanitizedInput.contrasena, 10)
    const usuario = orm.em.create(Usuario, {
      ...req.body.sanitizedInput,
      contrasena: contrasenaHasheada,
      verificacion: false,
    })
    await orm.em.flush()
    res.status(201).json({ message: 'Usuario creado', data: usuario })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const usuario = await orm.em.findOne(Usuario, { id })
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    if (req.body.sanitizedInput.contrasena) {
      req.body.sanitizedInput.contrasena = await bcrypt.hash(req.body.sanitizedInput.contrasena, 10)
    }
    orm.em.assign(usuario, req.body.sanitizedInput)
    await orm.em.flush()
    res.status(200).json({ message: 'Usuario actualizado', data: usuario })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const usuario = await orm.em.findOne(Usuario, { id })
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    orm.em.remove(usuario)
    await orm.em.flush()
    res.status(200).json({ message: 'Usuario eliminado exitosamente' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeUsuarioInput, findAll, findOne, create, update, remove }