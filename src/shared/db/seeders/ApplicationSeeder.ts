import type { EntityManager, Dictionary } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { Application } from '../../../application/application.entity.js'

export class ApplicationSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    em.create(Application, {
      status: 'PENDING',
      applicationDate: new Date(),
      message: 'Tengo casa con patio y experiencia con perros.',
      pet: context.firulais,
      adopter: context.juan,
      desiredEnergyLevel: 'MEDIUM',
      desiredSize: 'MEDIUM',
      desiredToleratesChildren: 'YES',
      desiredToleratesOtherAnimals: 'YES',
      desiredToleratesConfinement: 'NO',
    })

    em.create(Application, {
      status: 'PENDING',
      applicationDate: new Date(),
      message: 'Vivo en departamento pero tengo mucho tiempo para dedicarle.',
      pet: context.michi,
      adopter: context.maria,
      desiredEnergyLevel: 'HIGH',
      desiredSize: 'SMALL',
      desiredToleratesChildren: 'YES',
      desiredToleratesOtherAnimals: 'UNKNOWN',
      desiredToleratesConfinement: 'YES',
    })

    em.create(Application, {
      status: 'APPROVED',
      applicationDate: new Date(),
      resolutionDate: new Date(),
      message: 'Me encantaría darle un hogar tranquilo.',
      pet: context.tomas,
      adopter: context.maria,
      desiredEnergyLevel: 'LOW',
      desiredSize: 'SMALL',
      desiredToleratesChildren: 'YES',
      desiredToleratesOtherAnimals: 'YES',
      desiredToleratesConfinement: 'YES',
    })
  }
}