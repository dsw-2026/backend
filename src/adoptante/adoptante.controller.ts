import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { orm } from '../shared/db/orm.js'
import { Adoptante } from './adoptante.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { removeNullish } from '../shared/utils/removeNullish.js'
import { assertUnico, ConflictoUnicidadError } from '../shared/utils/assertUnico.js'
import { Solicitud } from '../solicitud/solicitud.entity.js'

// Del body recibido, solo conservamos los campos permitidos para Adoptante,
// tanto los heredados de Usuario como los propios de esta subclase.
//
// "verificacion" NO está en la lista, mismo criterio que en Publicador: solo
// se cambia por PATCH /api/usuarios/:id/verificar, protegido para Admin.
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

    const { id: userId, tipo } = req.usuario!
    const esElDuenio = tipo === 'Adoptante' && id === userId
    const esAdmin = tipo === 'Admin'

    // Regla de negocio: un Publicador accede a los datos de un Adoptante
    // únicamente si ese adoptante le mandó una solicitud por alguna de SUS
    // mascotas. El vínculo es lo que habilita el acceso al contacto (teléfono,
    // dirección): sin solicitud de por medio, no hay motivo para verlo.
    //
    // Se resuelve con count() y no con find(): solo interesa si existe al
    // menos una, no cuáles son.
    let esPublicadorConSolicitud = false
    if (tipo === 'Publicador') {
      const solicitudes = await orm.em.count(Solicitud, {
        adoptante: id,
        mascota: { publicador: userId },
      })
      esPublicadorConSolicitud = solicitudes > 0
    }

    if (!esElDuenio && !esAdmin && !esPublicadorConSolicitud) {
      return res.status(403).json({ message: 'No tenés acceso a los datos de este adoptante' })
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
    // Se valida contra Usuario (no contra Adoptante): nombreUsuario y
    // email son únicos para TODA la tabla compartida por herencia
    // (Publicador + Adoptante), no solo entre adoptantes.
    await assertUnico(
      orm.em,
      Usuario,
      { nombreUsuario: req.body.sanitizedInput.nombreUsuario, email: req.body.sanitizedInput.email },
      undefined,
      { nombreUsuario: 'Ese nombre de usuario ya está en uso', email: 'Ya existe una cuenta con ese email' }
    )

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
    if (error instanceof ConflictoUnicidadError) {
      return res.status(409).json({ message: error.message, field: error.field })
    }
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

    // Solo puede editar esta cuenta su propio dueño, o un Admin moderando.
    // Acá el id del recurso ES el id del usuario, porque la cuenta y la
    // persona son lo mismo (a diferencia de una Mascota, donde el dueño está
    // en otro campo).
    const { id: userId, tipo } = req.usuario!
    const esElDuenio = tipo === 'Adoptante' && id === userId
    const esAdmin = tipo === 'Admin'

    if (!esElDuenio && !esAdmin) {
      return res.status(403).json({ message: 'No tenés permiso para editar esta cuenta' })
    }

    // idExcluir: id evita que choque contra sí mismo si no cambió su
    // propio nombreUsuario/email.
    await assertUnico(
      orm.em,
      Usuario,
      { nombreUsuario: req.body.sanitizedInput.nombreUsuario, email: req.body.sanitizedInput.email },
      id,
      { nombreUsuario: 'Ese nombre de usuario ya está en uso', email: 'Ya existe una cuenta con ese email' }
    )

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
    if (error instanceof ConflictoUnicidadError) {
      return res.status(409).json({ message: error.message, field: error.field })
    }
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

    // Mismo criterio que en update: el dueño de la cuenta, o un Admin.
    const { id: userId, tipo } = req.usuario!
    const esElDuenio = tipo === 'Adoptante' && id === userId
    const esAdmin = tipo === 'Admin'

    if (!esElDuenio && !esAdmin) {
      return res.status(403).json({ message: 'No tenés permiso para eliminar esta cuenta' })
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