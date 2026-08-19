import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { orm } from '../shared/db/orm.js'
import { Usuario } from './usuario.entity.js'
import { removeNullish } from '../shared/utils/removeNullish.js'

// Del body recibido, solo conservamos los campos permitidos para Usuario.
function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
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
  }
  removeNullish(req.body.sanitizedInput)
  next()
}

// Devuelve todos los usuarios, con su localidad poblada si la tienen asignada.
async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await orm.em.find(Usuario, {}, { populate: ['localidad'] })
    res.status(200).json({ message: 'Usuarios encontrados', data: usuarios })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar usuarios' })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const usuario = await orm.em.findOne(Usuario, { id }, { populate: ['localidad'] })
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.status(200).json({ message: 'Usuario encontrado', data: usuario })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar el usuario' })
  }
}

// La contraseña nunca se guarda en texto plano: se genera un hash
// con bcrypt antes de persistirla.
// El valor 10 indica el nivel de dificultad utilizado por bcrypt.
// La verificación comienza en false para que el usuario no pueda
// registrarse como verificado desde el body.
async function create(req: Request, res: Response) {
  try {
    const contrasenaHasheada = await bcrypt.hash(req.body.sanitizedInput.contrasena, 10)
    const usuario = orm.em.create(Usuario, {
      ...req.body.sanitizedInput,
      contrasena: contrasenaHasheada,
      verificacion: false,
    })
    await orm.em.flush()
    res.status(201).json({ message: 'Usuario creado', data: usuario })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear el usuario' })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const usuario = await orm.em.findOne(Usuario, { id })
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    // Solo se re-hashea la contraseña si vino una nueva en la petición.
    // Si no se envía, se conserva la que ya estaba guardada.
    if (req.body.sanitizedInput.contrasena) {
      req.body.sanitizedInput.contrasena = await bcrypt.hash(req.body.sanitizedInput.contrasena, 10)
    }
    orm.em.assign(usuario, req.body.sanitizedInput)
    await orm.em.flush()
    res.status(200).json({ message: 'Usuario actualizado', data: usuario })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar el usuario' })
  }
}

// Se verifica que el usuario exista antes de eliminarlo.
async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const usuario = await orm.em.findOne(Usuario, { id })
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    orm.em.remove(usuario)
    await orm.em.flush()
    res.status(200).json({ message: 'Usuario eliminado exitosamente' })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar el usuario' })
  }
}

// Marca al usuario como verificado.
// En una versión más completa, la verificación se realizaría
// mediante un enlace enviado por email.
async function verificar(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const usuario = await orm.em.findOne(Usuario, { id })

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    usuario.verificacion = true
    await orm.em.flush()

    res.status(200).json({
      message: 'Usuario verificado exitosamente',
      data: usuario
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al verificar el usuario' })
  }
}

export { sanitizeUsuarioInput, findAll, findOne, create, update, remove, verificar }