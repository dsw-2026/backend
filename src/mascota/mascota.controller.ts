import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Mascota } from './mascota.entity.js'
import { Caracteristica } from '../caracteristica/caracteristica.entity.js'
import { Publicador } from '../publicador/publicador.entity.js'
import { Species } from '../species/species.entity.js'
import { removeNullish } from '../shared/utils/removeNullish.js'
import { Solicitud } from '../solicitud/solicitud.entity.js'

function sanitizeMascotaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    sexo: req.body.sexo,
    edad: req.body.edad,
    unidadEdad: req.body.unidadEdad,
    estado: req.body.estado,
    foto: req.body.foto,
    species: req.body.species,
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

const POPULATE = ['species', 'publicador', 'caracteristica'] as const

async function findAll(req: Request, res: Response) {
  try {
    const filtro: any = {}
    if (req.query.estado) {
      filtro.estado = req.query.estado
    }
    if (req.query.species) {
      filtro.species = Number(req.query.species)
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
    const { id: publicadorId, tipo } = req.usuario!

    const publicador = await orm.em.findOne(Publicador, { id: publicadorId })
    if (!publicador) {
      return res.status(404).json({ message: 'Publicador no encontrado' })
    }

    const speciesId = Number(req.body.sanitizedInput.species)
    const species = await orm.em.findOne(Species, { id: speciesId })
    if (!species) {
      return res.status(404).json({ message: 'Especie no encontrada' })
    }

    const caracteristica = orm.em.create(Caracteristica, req.body.sanitizedCaracteristica)
    const mascota = orm.em.create(Mascota, {
      ...req.body.sanitizedInput,
      publicador,
      species,
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

    const { id: userId, tipo } = req.usuario!
    const esElPublicador = tipo === 'Publicador' && mascota.publicador.id === userId
    const esAdmin = tipo === 'Admin'

    if (!esElPublicador && !esAdmin) {
      return res.status(403).json({ message: 'No tenés permiso para editar esta mascota' })
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
    const mascota = await orm.em.findOne(Mascota, { id }, { populate: ['publicador'] })
    if (!mascota) {
      return res.status(404).json({ message: 'Mascota no encontrada' })
    }

    const { id: userId, tipo } = req.usuario!
    const esElPublicador = tipo === 'Publicador' && mascota.publicador.id === userId
    const esAdmin = tipo === 'Admin'

    if (!esElPublicador && !esAdmin) {
      return res.status(403).json({ message: 'No tenés permiso para eliminar esta mascota' })
    }

    const tieneSolicitudes = await orm.em.count(Solicitud, { mascota: id })
    if (tieneSolicitudes > 0) {
      return res.status(409).json({
        message: 'No se puede eliminar la mascota: tiene solicitudes asociadas',
      })
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