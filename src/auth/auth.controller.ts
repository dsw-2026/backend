import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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

export { login }