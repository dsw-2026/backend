import 'reflect-metadata'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { orm } from './orm.js'
import { User } from '../../user/user.entity.js'
import { Admin } from '../../admin/admin.entity.js'

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!username || !email || !password) {
    console.error(
      'Faltan variables en el .env: ADMIN_USERNAME, ADMIN_EMAIL y ADMIN_PASSWORD son obligatorias.'
    )
    process.exit(1)
  }

  const em = orm.em.fork()

  const alreadyExists = await em.findOne(User, { $or: [{ email }, { username }] })
  if (alreadyExists) {
    console.log('Ya existe un usuario con ese email o nombre de usuario. No se creó nada.')
    return
  }

  em.create(Admin, {
    username,
    firstName: process.env.ADMIN_NOMBRE ?? 'Admin',
    lastName: process.env.ADMIN_APELLIDO ?? 'Fluffy',
    email,
    password: await bcrypt.hash(password, 10),
    verified: true,
    createdAt: new Date(),
  })

  await em.flush()
  console.log(`Admin creado correctamente: ${email}`)
}

await seedAdmin()
await orm.close()