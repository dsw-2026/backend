import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Mascota } from './mascota.entity.js'
import { Caracteristica } from '../caracteristica/caracteristica.entity.js'

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

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] == null) {
      delete req.body.sanitizedInput[key]
    }
  })

  Object.keys(req.body.sanitizedCaracteristica).forEach((key) => {
    if (req.body.sanitizedCaracteristica[key] == null) {
      delete req.body.sanitizedCaracteristica[key]
    }
  })

  next()
}

const POPULATE = ['especie', 'publicador', 'caracteristica'] as const

async function findAll(req: Request, res: Response) {
  try {
    const filtro: any = {}
    if (req.query.estado) {
      filtro.estado = req.query.estado
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