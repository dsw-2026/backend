import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Localidad } from './localidad.entity.js'
import { removeNullish } from '../shared/utils/removeNullish.js'

// Del body recibido, solo conservamos los campos permitidos para Localidad.
function sanitizeLocalidadInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    codigoPostal: req.body.codigoPostal,
    provincia: req.body.provincia,
  }
  removeNullish(req.body.sanitizedInput)
  next()
}

// Devuelve todas las localidades con su provincia poblada.
async function findAll(req: Request, res: Response) {
  try {
    const localidades = await orm.em.find(Localidad, {}, { populate: ['provincia'] })
    res.status(200).json({ message: 'Localidades encontradas', data: localidades })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar localidades' })
  }
}

// Busca una localidad por ID. Devuelve 404 si no existe.
async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const localidad = await orm.em.findOne(Localidad, { id }, { populate: ['provincia'] })
    if (!localidad) {
      return res.status(404).json({ message: 'Localidad no encontrada' })
    }
    res.status(200).json({ message: 'Localidad encontrada', data: localidad })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar la localidad' })
  }
}

// La provincia se recibe como referencia y luego se carga con populate
// para incluir sus datos completos en la respuesta.
async function create(req: Request, res: Response) {
  try {
    const localidad = orm.em.create(Localidad, req.body.sanitizedInput)
    await orm.em.flush()
    await orm.em.populate(localidad, ['provincia'])
    res.status(201).json({ message: 'Localidad creada', data: localidad })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear la localidad' })
  }
}

// Se verifica que la localidad exista antes de modificarla.
async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const localidad = await orm.em.findOne(Localidad, { id })
    if (!localidad) {
      return res.status(404).json({ message: 'Localidad no encontrada' })
    }
    orm.em.assign(localidad, req.body.sanitizedInput)
    await orm.em.flush()
    // Carga la provincia para incluir sus datos completos en la respuesta.
    await orm.em.populate(localidad, ['provincia'])
    res.status(200).json({ message: 'Localidad actualizada', data: localidad })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar la localidad' })
  }
}

// Se verifica que la localidad exista antes de eliminarla.
async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const localidad = await orm.em.findOne(Localidad, { id })
    if (!localidad) {
      return res.status(404).json({ message: 'Localidad no encontrada' })
    }
    orm.em.remove(localidad)
    await orm.em.flush()
    res.status(200).json({ message: 'Localidad eliminada exitosamente' })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar la localidad' })
  }
}

export { sanitizeLocalidadInput, findAll, findOne, create, update, remove }