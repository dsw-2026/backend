import type { EntityManager, Dictionary } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import bcrypt from 'bcrypt'
import { Publisher } from '../../../publisher/publisher.entity.js'

export class PublisherSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const passwordHash = await bcrypt.hash('password123', 10)

    context.refugioAmigos = em.create(Publisher, {
      username: 'refugioamigos',
      firstName: 'Refugio',
      lastName: 'Amigos',
      email: 'refugio@fluffy.com',
      password: passwordHash,
      verified: true,
      createdAt: new Date(),
      type: 'SHELTER',
      locality: context.rosario,
      description: 'Refugio dedicado al rescate de perros y gatos.',
    })

    context.patitasFelices = em.create(Publisher, {
      username: 'patitasfelices',
      firstName: 'Patitas',
      lastName: 'Felices',
      email: 'patitas@fluffy.com',
      password: passwordHash,
      verified: true,
      createdAt: new Date(),
      type: 'INDEPENDENT_RESCUER',
      locality: context.cordobaCapital,
      description: 'Rescatista independiente de animales en situación de calle.',
    })
  }
}