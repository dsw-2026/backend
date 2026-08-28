import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { orm } from '../shared/db/orm.js'
import { Publicador } from './publicador.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { removeNullish } from '../shared/utils/removeNullish.js'
import { assertUnico, ConflictoUnicidadError } from '../shared/utils/assertUnico.js'

// Del body recibido, solo conservamos los campos permitidos para Publicador,
// incluyendo tanto los heredados de Usuario como los propios de esta subclase.
//
// "verificacion" NO está en la lista, a propósito: si estuviera, cualquier
// Publicador podría mandar verificacion:true en el PATCH de su propia cuenta
// y darse solo la insignia de confianza. Ese campo se cambia únicamente por
// PATCH /api/usuarios/:id/verificar, que está protegido para Admin.
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
    localidad: req.body.localidad,
  }
  removeNullish(req.body.sanitizedInput)
  next()
}

// Devuelve solo los registros de tipo Publicador.
// MikroORM los identifica mediante la columna "tipoUsuario",
// definida en Usuario como columna discriminadora.
async function findAll(req: Request, res: Response) {
  try {
    const publicadores = await orm.em.find(Publicador, {}, { populate: ['localidad'] })
    res.status(200).json({ message: 'Publicadores encontrados', data: publicadores })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar publicadores' })
  }
}

// Busca un Publicador por ID. Devuelve 404 si no existe.
async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const publicador = await orm.em.findOne(Publicador, { id }, { populate: ['localidad'] })
    if (!publicador) {
      return res.status(404).json({ message: 'Publicador no encontrado' })
    }
    res.status(200).json({ message: 'Publicador encontrado', data: publicador })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar el publicador' })
  }
}

/// La contraseña se guarda como hash y la verificación comienza en false.
async function create(req: Request, res: Response) {
  try {
    // Se valida contra Usuario (no contra Publicador): nombreUsuario y
    // email son únicos para TODA la tabla compartida por herencia
    // (Publicador + Adoptante), no solo entre publicadores.
    await assertUnico(
      orm.em,
      Usuario,
      { nombreUsuario: req.body.sanitizedInput.nombreUsuario, email: req.body.sanitizedInput.email },
      undefined,
      { nombreUsuario: 'Ese nombre de usuario ya está en uso', email: 'Ya existe una cuenta con ese email' }
    )

    const contrasenaHasheada = await bcrypt.hash(req.body.sanitizedInput.contrasena, 10)
    const publicador = orm.em.create(Publicador, {
      ...req.body.sanitizedInput,
      contrasena: contrasenaHasheada,
      verificacion: false,
    })
    await orm.em.flush()
    res.status(201).json({ message: 'Publicador creado', data: publicador })
  } catch (error: any) {
    if (error instanceof ConflictoUnicidadError) {
      return res.status(409).json({ message: error.message, field: error.field })
    }
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

    // Solo puede editar esta cuenta su propio dueño, o un Admin moderando.
    // Acá el id del recurso ES el id del usuario, porque la cuenta y la
    // persona son lo mismo (a diferencia de una Mascota, donde el dueño está
    // en otro campo).
    const { id: userId, tipo } = req.usuario!
    const esElDuenio = tipo === 'Publicador' && id === userId
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

    // Solo se re-hashea si viene una contraseña nueva; si no, se conserva la actual.
    if (req.body.sanitizedInput.contrasena) {
      req.body.sanitizedInput.contrasena = await bcrypt.hash(req.body.sanitizedInput.contrasena, 10)
    }
    orm.em.assign(publicador, req.body.sanitizedInput)
    await orm.em.flush()
    res.status(200).json({ message: 'Publicador actualizado', data: publicador })
  } catch (error: any) {
    if (error instanceof ConflictoUnicidadError) {
      return res.status(409).json({ message: error.message, field: error.field })
    }
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar el publicador' })
  }
}

// Se verifica que el Publicador exista antes de eliminarlo.
async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const publicador = await orm.em.findOne(Publicador, { id })
    if (!publicador) {
      return res.status(404).json({ message: 'Publicador no encontrado' })
    }

    // Mismo criterio que en update: el dueño de la cuenta, o un Admin.
    const { id: userId, tipo } = req.usuario!
    const esElDuenio = tipo === 'Publicador' && id === userId
    const esAdmin = tipo === 'Admin'

    if (!esElDuenio && !esAdmin) {
      return res.status(403).json({ message: 'No tenés permiso para eliminar esta cuenta' })
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