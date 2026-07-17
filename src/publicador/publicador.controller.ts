import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { orm } from '../shared/db/orm.js'
import { Publicador } from './publicador.entity.js'

function sanitizePublicadorInput(req: Request, res: Response, next: NextFunction) {
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
    tipo: req.body.tipo,
    sitioWeb: req.body.sitioWeb,
    redesSociales: req.body.redesSociales,
    horariosAtencion: req.body.horariosAtencion,
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
    const publicadores = await orm.em.find(Publicador, {})
    res.status(200).json({ message: 'Publicadores encontrados', data: publicadores })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar publicadores' })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const publicador = await orm.em.findOne(Publicador, { id })
    if (!publicador) {
      return res.status(404).json({ message: 'Publicador no encontrado' })
    }
    res.status(200).json({ message: 'Publicador encontrado', data: publicador })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar el publicador' })
  }
}

async function create(req: Request, res: Response) {
  try {
    const contrasenaHasheada = await bcrypt.hash(req.body.sanitizedInput.contrasena, 10)
    const publicador = orm.em.create(Publicador, {
      ...req.body.sanitizedInput,
      contrasena: contrasenaHasheada,
      verificacion: false,
    })
    await orm.em.flush()
    res.status(201).json({ message: 'Publicador creado', data: publicador })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear el publicador' })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const publicador = await orm.em.findOne(Publicador, { id })
    if (!publicador) {
      return res.status(404).json({ message: 'Publicador no encontrado' })
    }
    if (req.body.sanitizedInput.contrasena) {
      req.body.sanitizedInput.contrasena = await bcrypt.hash(req.body.sanitizedInput.contrasena, 10)
    }
    orm.em.assign(publicador, req.body.sanitizedInput)
    await orm.em.flush()
    res.status(200).json({ message: 'Publicador actualizado', data: publicador })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar el publicador' })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const publicador = await orm.em.findOne(Publicador, { id })
    if (!publicador) {
      return res.status(404).json({ message: 'Publicador no encontrado' })
    }
    orm.em.remove(publicador)
    await orm.em.flush()
    res.status(200).json({ message: 'Publicador eliminado exitosamente' })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar el publicador' })
  }
}

export { sanitizePublicadorInput, findAll, findOne, create, update, remove }