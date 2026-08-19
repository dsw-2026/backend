import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { orm } from '../shared/db/orm.js'
import { Adoptante } from './adoptante.entity.js'
import { removeNullish } from '../shared/utils/removeNullish.js'

// Del body recibido, solo conservamos los campos permitidos para Adoptante,
// tanto los heredados de Usuario como los propios de esta subclase.
function sanitizeAdoptanteInput(req: Request, res: Response, next: NextFunction) {
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
    localidad: req.body.localidad,
    occupation: req.body.occupation,
    tipoVivienda: req.body.tipoVivienda,
    tienePatio: req.body.tienePatio,
    tieneOtrosAnimales: req.body.tieneOtrosAnimales,
    otrosAnimalesDetalle: req.body.otrosAnimalesDetalle,
  }
  // Elimina los campos null o undefined para permitir actualizaciones parciales.
  removeNullish(req.body.sanitizedInput)
  next()
}

// Devuelve todos los Adoptantes.
async function findAll(req: Request, res: Response) {
  try {
    const adoptantes = await orm.em.find(Adoptante, {}, { populate: ['localidad'] })
    res.status(200).json({ message: 'Adoptantes encontrados', data: adoptantes })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar adoptantes' })
  }
}

// Busca un Adoptante por ID. Devuelve 404 si no existe.
async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const adoptante = await orm.em.findOne(Adoptante, { id }, { populate: ['localidad'] })
    if (!adoptante) {
      return res.status(404).json({ message: 'Adoptante no encontrado' })
    }
    res.status(200).json({ message: 'Adoptante encontrado', data: adoptante })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar el adoptante' })
  }
}

// La contraseña se guarda como hash y la verificación comienza en false.
async function create(req: Request, res: Response) {
  try {
    const contrasenaHasheada = await bcrypt.hash(req.body.sanitizedInput.contrasena, 10)
    const adoptante = orm.em.create(Adoptante, {
      ...req.body.sanitizedInput,
      contrasena: contrasenaHasheada,
      verificacion: false,
    })
    await orm.em.flush()
    // Carga la localidad para incluir sus datos completos en la respuesta.
    await orm.em.populate(adoptante, ['localidad'])
    res.status(201).json({ message: 'Adoptante creado', data: adoptante })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear el adoptante' })
  }
}
 
async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const adoptante = await orm.em.findOne(Adoptante, { id })
    if (!adoptante) {
      return res.status(404).json({ message: 'Adoptante no encontrado' })
    }
    // Solo se re-hashea si viene contraseña nueva (mismo criterio que Usuario).
    if (req.body.sanitizedInput.contrasena) {
      req.body.sanitizedInput.contrasena = await bcrypt.hash(req.body.sanitizedInput.contrasena, 10)
    }
    orm.em.assign(adoptante, req.body.sanitizedInput)
    await orm.em.flush()
    // Carga la localidad para incluir sus datos completos en la respuesta.
    await orm.em.populate(adoptante, ['localidad'])
    res.status(200).json({ message: 'Adoptante actualizado', data: adoptante })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar el adoptante' })
  }
}

// Se verifica que el Adoptante exista antes de eliminarlo.
async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const adoptante = await orm.em.findOne(Adoptante, { id })
    if (!adoptante) {
      return res.status(404).json({ message: 'Adoptante no encontrado' })
    }
    orm.em.remove(adoptante)
    await orm.em.flush()
    res.status(200).json({ message: 'Adoptante eliminado exitosamente' })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar el adoptante' })
  }
}
// Exportamos el middleware y las funciones del controller.
export { sanitizeAdoptanteInput, findAll, findOne, create, update, remove }