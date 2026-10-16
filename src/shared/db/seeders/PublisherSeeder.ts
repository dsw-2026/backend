import type { EntityManager, Dictionary } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import bcrypt from 'bcrypt'
import { Publisher } from '../../../publisher/publisher.entity.js'

export class PublisherSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const passwordRefugio = await bcrypt.hash('refugio123', 10)
    const passwordPatitas = await bcrypt.hash('patitas123', 10)
    const passwordHuellitas = await bcrypt.hash('huellitas123', 10)
    const passwordAlma = await bcrypt.hash('alma123', 10)

    context.refugioAmigos = em.create(Publisher, {
      username: 'refugioamigos',
      firstName: 'Refugio',
      lastName: 'Amigos',
      email: 'refugio@fluffy.com',
      password: passwordRefugio,
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
      password: passwordPatitas,
      verified: true,
      createdAt: new Date(),
      type: 'INDEPENDENT_RESCUER',
      locality: context.cordobaCapital,
      description: 'Rescatista independiente de animales en situación de calle.',
    })

    context.hogarHuellitas = em.create(Publisher, {
      username: 'hogarhuellitas',
      firstName: 'Hogar',
      lastName: 'Huellitas',
      email: 'huellitas@fluffy.com',
      password: passwordHuellitas,
      verified: true,
      createdAt: new Date(),
      type: 'SHELTER',
      locality: context.laPlata,
      description: 'Asociación civil orientada a la rehabilitación y adopción responsable.',
    })

    context.almaAnimal = em.create(Publisher, {
      username: 'almanimal',
      firstName: 'Alma',
      lastName: 'Animal',
      email: 'almanimal@fluffy.com',
      password: passwordAlma,
      verified: true,
      createdAt: new Date(),
      type: 'INDEPENDENT_RESCUER',
      locality: context.santaFeCapital,
      description: 'Red de tránsito y rescate para animales en urgencia.',
    })
  }
}