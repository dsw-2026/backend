import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Especie } from './especie.entity.js'
import { removeNullish } from '../shared/utils/removeNullish.js'

// Del body recibido, solo conservamos los campos permitidos para Especie.
// En este caso, únicamente "nombre".
function sanitizeEspecieInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
  }
  removeNullish(req.body.sanitizedInput)
  next()
}

// Devuelve todas las especies.
async function findAll(req: Request, res: Response) {
  try {
    const especies = await orm.em.find(Especie, {})
    res.status(200).json({ message: 'Especies encontradas', data: especies })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar especies' })
  }
}

// Crea una nueva especie y persiste los cambios en la base de datos.
async function create(req: Request, res: Response) {
  try {
    const especie = orm.em.create(Especie, req.body.sanitizedInput)
    await orm.em.flush()
    res.status(201).json({ message: 'Especie creada', data: especie })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear la especie' })
  }
}

// Busca una especie por su ID. Devuelve 404 si no existe.
async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const especie = await orm.em.findOne(Especie, { id })
    if (!especie) {
      return res.status(404).json({ message: 'Especie no encontrada' })
    }
    res.status(200).json({ message: 'Especie encontrada', data: especie })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar la especie' })
  }
}

// Se verifica que la especie exista antes de modificarla.
async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const especie = await orm.em.findOne(Especie, { id })
    if (!especie) {
      return res.status(404).json({ message: 'Especie no encontrada' })
    }
    orm.em.assign(especie, req.body.sanitizedInput)
    await orm.em.flush()
    res.status(200).json({ message: 'Especie actualizada', data: especie })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar la especie' })
  }
}

// Se verifica que la especie exista antes de eliminarla.
async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const especie = await orm.em.findOne(Especie, { id })
    if (!especie) {
      return res.status(404).json({ message: 'Especie no encontrada' })
    }
    orm.em.remove(especie)
    await orm.em.flush()
    res.status(200).json({ message: 'Especie eliminada exitosamente' })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar la especie' })
  }
}
// Exportamos el middleware y las funciones del controller.
export { sanitizeEspecieInput, findAll, findOne, create, update, remove }