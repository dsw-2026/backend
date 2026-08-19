import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Provincia } from './provincia.entity.js'
import { removeNullish } from '../shared/utils/removeNullish.js'

// Del body recibido, solo conservamos los campos permitidos para Provincia.
function sanitizeProvinciaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    codigo: req.body.codigo,
  }
  removeNullish(req.body.sanitizedInput)
  next()
}

// Devuelve todas las provincias.
async function findAll(req: Request, res: Response) {
  try {
    const provincias = await orm.em.find(Provincia, {})
    res.status(200).json({ message: 'Provincias encontradas', data: provincias })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar provincias' })
  }
}

// Busca una provincia por id. 404 si no existe.
async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const provincia = await orm.em.findOne(Provincia, { id })
    if (!provincia) {
      return res.status(404).json({ message: 'Provincia no encontrada' })
    }
    res.status(200).json({ message: 'Provincia encontrada', data: provincia })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar la provincia' })
  }
}

// Crea una nueva provincia. La unicidad de nombre y código se controla a nivel de base de datos.
async function create(req: Request, res: Response) {
  try {
    const provincia = orm.em.create(Provincia, req.body.sanitizedInput)
    await orm.em.flush()
    res.status(201).json({ message: 'Provincia creada', data: provincia })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear la provincia' })
  }
}

// Se busca primero con findOne para verificar que la provincia exista
// antes de realizar la actualización.
async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const provincia = await orm.em.findOne(Provincia, { id })
    if (!provincia) {
      return res.status(404).json({ message: 'Provincia no encontrada' })
    }
    orm.em.assign(provincia, req.body.sanitizedInput)
    await orm.em.flush()
    res.status(200).json({ message: 'Provincia actualizada', data: provincia })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar la provincia' })
  }
}

// Se verifica que la provincia exista antes de eliminarla.
async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const provincia = await orm.em.findOne(Provincia, { id })
    if (!provincia) {
      return res.status(404).json({ message: 'Provincia no encontrada' })
    }
    orm.em.remove(provincia)
    await orm.em.flush()
    res.status(200).json({ message: 'Provincia eliminada exitosamente' })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar la provincia' })
  }
}

export { sanitizeProvinciaInput, findAll, findOne, create, update, remove }