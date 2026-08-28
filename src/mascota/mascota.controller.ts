import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Mascota } from './mascota.entity.js'
import { Caracteristica } from '../caracteristica/caracteristica.entity.js'
import { Publicador } from '../publicador/publicador.entity.js'
import { Especie } from '../especie/especie.entity.js'
import { removeNullish } from '../shared/utils/removeNullish.js'
import { Solicitud } from '../solicitud/solicitud.entity.js'

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
    // publicador ya no se toma del body: sale de req.usuario!.id en create
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
// Lectura pública: no requiere autenticación (listado de mascotas en adopción).
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


// Lectura pública: no requiere autenticación (ficha de una mascota puntual).
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
    const { id: publicadorId, tipo } = req.usuario!

    const publicador = await orm.em.findOne(Publicador, { id: publicadorId })
    if (!publicador) {
      return res.status(404).json({ message: 'Publicador no encontrado' })
    }

    const especieId = Number(req.body.sanitizedInput.especie)
    const especie = await orm.em.findOne(Especie, { id: especieId })
    if (!especie) {
      return res.status(404).json({ message: 'Especie no encontrada' })
    }

    const caracteristica = orm.em.create(Caracteristica, req.body.sanitizedCaracteristica)
    const mascota = orm.em.create(Mascota, {
      ...req.body.sanitizedInput,
      publicador,
      especie,
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

    // El permiso se arma en forma POSITIVA (quién sí puede) en vez de
    // enumerar motivos de bloqueo unidos por ||. Con la forma negativa,
    // el cortocircuito del || corta en la primera condición verdadera:
    // si mañana se suma otro rol habilitado, la excepción que se agregue
    // en la segunda condición nunca llega a evaluarse y queda muerta,
    // sin dar error. Así, en cambio, sumar un rol es sumar una variable.
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

// La Caracteristica se elimina automáticamente junto con la Mascota
// mediante la cascada configurada en la relación.
async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const mascota = await orm.em.findOne(Mascota, { id }, { populate: ['publicador'] })
    if (!mascota) {
      return res.status(404).json({ message: 'Mascota no encontrada' })
    }

    // Forma positiva, mismo criterio que en update (ver comentario allá).
    const { id: userId, tipo } = req.usuario!
    const esElPublicador = tipo === 'Publicador' && mascota.publicador.id === userId
    const esAdmin = tipo === 'Admin'

    if (!esElPublicador && !esAdmin) {
      return res.status(403).json({ message: 'No tenés permiso para eliminar esta mascota' })
    }

    // Chequeo explícito ANTES de intentar el delete: si hay solicitudes
    // asociadas, se bloquea con un 409 claro en vez de dejar que la FK
    // constraint tire un error crudo de MySQL (500 genérico).
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