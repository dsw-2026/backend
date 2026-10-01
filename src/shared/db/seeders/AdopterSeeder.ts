import type { EntityManager, Dictionary } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import bcrypt from 'bcrypt'
import { Adopter } from '../../../adopter/adopter.entity.js'

export class AdopterSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const passwordHash = await bcrypt.hash('password123', 10)

    context.juan = em.create(Adopter, {
      username: 'juanadopta',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@fluffy.com',
      password: passwordHash,
      verified: true,
      createdAt: new Date(),
      locality: context.laPlata,
      occupation: 'Docente',
      housingType: 'HOUSE',
      hasYard: true,
      hasOtherAnimals: false,
      hasChildren: true,
    })

    context.maria = em.create(Adopter, {
      username: 'mariaadopta',
      firstName: 'María',
      lastName: 'González',
      email: 'maria@fluffy.com',
      password: passwordHash,
      verified: true,
      createdAt: new Date(),
      locality: context.santaFeCapital,
      occupation: 'Diseñadora',
      housingType: 'APARTMENT',
      hasYard: false,
      hasOtherAnimals: true,
      otherAnimalsDetail: 'Un gato adulto castrado.',
      hasChildren: false,
    })
  }
}