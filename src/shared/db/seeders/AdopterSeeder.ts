import type { EntityManager, Dictionary } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import bcrypt from 'bcrypt'
import { Adopter } from '../../../adopter/adopter.entity.js'

export class AdopterSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const passwordJuan = await bcrypt.hash('juan123', 10)
    const passwordMaria = await bcrypt.hash('maria123', 10)
    const passwordCarlos = await bcrypt.hash('carlos123', 10)
    const passwordLucia = await bcrypt.hash('lucia123', 10)
    const passwordMartin = await bcrypt.hash('martin123', 10)

    context.juan = em.create(Adopter, {
      username: 'juanadopta',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@fluffy.com',
      password: passwordJuan,
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
      password: passwordMaria,
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

    context.carlos = em.create(Adopter, {
      username: 'carlosadopta',
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      email: 'carlos@fluffy.com',
      password: passwordCarlos,
      verified: true,
      createdAt: new Date(),
      locality: context.laPlata,
      occupation: 'Ingeniero de Software',
      housingType: 'HOUSE',
      hasYard: true,
      hasOtherAnimals: true,
      otherAnimalsDetail: 'Dos perros mestizos medianos.',
      hasChildren: false,
    })

    context.lucia = em.create(Adopter, {
      username: 'luciaadopta',
      firstName: 'Lucía',
      lastName: 'Fernández',
      email: 'lucia@fluffy.com',
      password: passwordLucia,
      verified: true,
      createdAt: new Date(),
      locality: context.santaFeCapital,
      occupation: 'Contadora',
      housingType: 'APARTMENT',
      hasYard: false,
      hasOtherAnimals: false,
      hasChildren: false,
    })

    context.martin = em.create(Adopter, {
      username: 'martinadopta',
      firstName: 'Martín',
      lastName: 'López',
      email: 'martin@fluffy.com',
      password: passwordMartin,
      verified: true,
      createdAt: new Date(),
      locality: context.santaFeCapital,
      occupation: 'Veterinario',
      housingType: 'HOUSE',
      hasYard: true,
      hasOtherAnimals: false,
      hasChildren: true,
    })
  }
}