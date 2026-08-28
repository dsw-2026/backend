import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { wrap } from '@mikro-orm/core'
import { orm } from '../shared/db/orm.js'
import { Usuario } from '../usuario/usuario.entity.js'

async function login(req: Request, res: Response) {
  try {
    const { email, contrasena } = req.body

    // Buscamos por email (dato heredado de Usuario, común a Publicador y Adoptante).
    const usuario = await orm.em.findOne(Usuario, { email })

    // Mensaje genérico a propósito: no decimos si falló el email o la
    // contraseña, para no darle pistas a quien intente adivinar cuentas.
    if (!usuario) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' })
    }

    // No comparamos texto plano contra texto plano: bcrypt.compare
    // rehashea la contraseña recibida y la compara contra el hash guardado.
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena)
    if (!contrasenaValida) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' })
    }

    // Usamos constructor.name para obtener "Publicador" o "Adoptante"
    // y determinar la clase real de la instancia; se usará para los niveles de acceso.
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.constructor.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    )

    res.status(200).json({
      message: 'Login exitoso',
      data: { token, id: usuario.id, nombreUsuario: usuario.nombreUsuario },
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al iniciar sesión' })
  }
}

// Devuelve los datos completos del usuario dueño del token 
//
// Por qué hace falta, si el token ya trae el id: porque el token trae SOLO
// id y tipo . No trae el nombre, ni el email, ni la foto de perfil.
//  Cuando alguien recarga la página, el frontend se reinicia y lo único que sobrevive 
// es el token guardado: sin esta ruta no tendría con qué llenar el header ni la pantalla de perfil.
//
// El valor de seguridad está en de dónde sale el id. Acá se usa
// req.usuario!.id, que viene del token FIRMADO por el backend, no de un
// parámetro de la URL que el usuario podría cambiar a mano. Por eso esta es
// la ruta correcta para que alguien edite su propia cuenta: el id lo pone el
// sistema, no el navegador.
async function obtenerPerfil(req: Request, res: Response) {
  try {

    const usuario = await orm.em.findOne(Usuario, { id: req.usuario!.id }, { populate: ['localidad'] })
 
    // Caso raro pero posible: el token es válido y está bien firmado, pero la
    // cuenta ya no existe (la borró un Admin, o el propio usuario). El token
    // sigue vivo hasta que expire, así que hay que contemplarlo.
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
 
    // La contraseña no viaja: está marcada como hidden:true en la entidad
    // Usuario, así que MikroORM no la incluye al serializar a JSON.
    //
    // tipoUsuario se agrega a mano: la columna discriminadora no está
    // declarada como @Property, así que no se serializa sola. Sin ella el
    // frontend no sabe si tiene enfrente a un Publicador, un Adoptante o un
    // Admin. Se usa constructor.name, la misma fuente que el token de login.
    res.status(200).json({
      message: 'Perfil obtenido',
      data: { ...wrap(usuario).toJSON(), tipoUsuario: usuario.constructor.name },
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener el perfil' })
  }
}
 
export { login, obtenerPerfil }