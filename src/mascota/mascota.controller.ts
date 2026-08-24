import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Mascota } from './mascota.entity.js'
import { Caracteristica } from '../caracteristica/caracteristica.entity.js'
import { removeNullish } from '../shared/utils/removeNullish.js'

// Separa el body en dos objetos: campos de Mascota y de Caracteristica.
// Se crean juntas en la misma petición (ver create más abajo).
function sanitizeMascotaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    sexo: req.body.sexo,
    edad: req.body.edad,
    unidadEdad: req.body.unidadEdad,
    estado: req.body.estado,
    foto: req.body.foto,
    especie: req.body.especie,
    publicador: req.body.publicador,
  }

  req.body.sanitizedCaracteristica = {
    energia: req.body.energia,
    caracter: req.body.caracter,
    tamanio: req.body.tamanio,
    vacunacion: req.body.vacunacion,
    castracion: req.body.castracion,
    toleraNinos: req.body.toleraNinos,
    toleraAnimales: req.body.toleraAnimales,
    toleraEncierro: req.body.toleraEncierro,
    observacionesAdicionales: req.body.observacionesAdicionales,
  }

  removeNullish(req.body.sanitizedInput)
  removeNullish(req.body.sanitizedCaracteristica)

  next()
}

// Relaciones que se cargan junto con la Mascota.
const POPULATE = ['especie', 'publicador', 'caracteristica'] as const

// Permite filtrar las mascotas por estado (?estado=) y/o por especie (?especie=).
// Sin filtros, trae todas. El listado de mascotas disponibles para adoptar
// (filtrado por especie) es el mismo endpoint, solo cambia el query param.
async function findAll(req: Request, res: Response) {
  try {
    const filtro: any = {}
    if (req.query.estado) {
      filtro.estado = req.query.estado
    }
    if (req.query.especie) {
      filtro.especie = Number(req.query.especie)
    }
    const mascotas = await orm.em.find(Mascota, filtro, { populate: POPULATE })
    res.status(200).json({ message: 'Mascotas encontradas', data: mascotas })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar mascotas' })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const mascota = await orm.em.findOne(Mascota, { id }, { populate: POPULATE })
    if (!mascota) {
      return res.status(404).json({ message: 'Mascota no encontrada' })
    }
    res.status(200).json({ message: 'Mascota encontrada', data: mascota })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar la mascota' })
  }
}

// Crea y persiste la Mascota y su Caracteristica en la misma operación.
// (no existe una Caracteristica sin su mascota).
async function create(req: Request, res: Response) {
  try {
    const caracteristica = orm.em.create(Caracteristica, req.body.sanitizedCaracteristica)
    const mascota = orm.em.create(Mascota, {
      ...req.body.sanitizedInput,
      caracteristica,
    })
    await orm.em.flush()
    await orm.em.populate(mascota, POPULATE)
    res.status(201).json({ message: 'Mascota creada', data: mascota })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear la mascota' })
  }
}

// Actualiza tanto los datos de Mascota como los de su Caracteristica.
async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const mascota = await orm.em.findOne(Mascota, { id }, { populate: POPULATE })
    if (!mascota) {
      return res.status(404).json({ message: 'Mascota no encontrada' })
    }
    orm.em.assign(mascota, req.body.sanitizedInput)
    orm.em.assign(mascota.caracteristica, req.body.sanitizedCaracteristica)
    await orm.em.flush()
    res.status(200).json({ message: 'Mascota actualizada', data: mascota })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar la mascota' })
  }
}

// La Caracteristica se elimina automáticamente junto con la Mascota
// mediante la cascada configurada en la relación.
async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const mascota = await orm.em.findOne(Mascota, { id })
    if (!mascota) {
      return res.status(404).json({ message: 'Mascota no encontrada' })
    }
    orm.em.remove(mascota)
    await orm.em.flush()
    res.status(200).json({ message: 'Mascota eliminada exitosamente' })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar la mascota' })
  }
}

export { sanitizeMascotaInput, findAll, findOne, create, update, remove }