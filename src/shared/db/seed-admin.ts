import 'reflect-metadata'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { orm } from './orm.js'
import { Usuario } from '../../usuario/usuario.entity.js'
import { Admin } from '../../admin/admin.entity.js'

// Crea la PRIMERA cuenta Admin.
// De ahí en adelante, un Admin logueado podrá crear otros desde la app.

// Se ejecuta con: pnpm seed:admin
async function seedAdmin() {
  const nombreUsuario = process.env.ADMIN_USERNAME
  const email = process.env.ADMIN_EMAIL
  const contrasena = process.env.ADMIN_PASSWORD

  if (!nombreUsuario || !email || !contrasena) {
    console.error(
      'Faltan variables en el .env: ADMIN_USERNAME, ADMIN_EMAIL y ADMIN_PASSWORD son obligatorias.'
    )
    process.exit(1)
  }

  // fork() crea un EntityManager propio para este script. En la app eso lo
  // hace el middleware RequestContext por cada petición HTTP, pero acá no hay
  // peticiones: es un proceso suelto.
  const em = orm.em.fork()

  // Idempotente: si ya existe un usuario con ese email o nombre de usuario, no
  // hace nada. Así el script se puede correr dos veces sin romper nada ni
  // duplicar cuentas.
  const yaExiste = await em.findOne(Usuario, { $or: [{ email }, { nombreUsuario }] })
  if (yaExiste) {
    console.log('Ya existe un usuario con ese email o nombre de usuario. No se creó nada.')
    return
  }

  em.create(Admin, {
    nombreUsuario,
    nombre: process.env.ADMIN_NOMBRE ?? 'Admin',
    apellido: process.env.ADMIN_APELLIDO ?? 'Fluffy',
    email,
    contrasena: await bcrypt.hash(contrasena, 10),
    verificacion: true,
    fechaCreacion: new Date(),
  })

  await em.flush()
  console.log(`Admin creado correctamente: ${email}`)
}

await seedAdmin()
// Sin esto el proceso queda colgado con la conexión a la base abierta.
await orm.close()