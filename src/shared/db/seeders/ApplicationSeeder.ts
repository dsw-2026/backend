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

    em.create(Application, {
      status: 'APPROVED',
      applicationDate: new Date(Date.now() - 10 * 86400000),
      resolutionDate: new Date(Date.now() - 6 * 86400000),
      message: 'Tenemos patio amplio y salimos a pasear todas las tardes.',
      pet: context.milo,
      adopter: context.juan,
      desiredEnergyLevel: 'MEDIUM',
      desiredSize: 'MEDIUM',
      desiredToleratesChildren: 'YES',
      desiredToleratesOtherAnimals: 'YES',
      desiredToleratesConfinement: 'NO',
    })

    em.create(Application, {
      status: 'APPROVED',
      applicationDate: new Date(Date.now() - 8 * 86400000),
      resolutionDate: new Date(Date.now() - 4 * 86400000),
      message: 'Buscamos un gato tranquilo y dócil para convivir en departamento.',
      pet: context.simon,
      adopter: context.maria,
      desiredEnergyLevel: 'LOW',
      desiredSize: 'SMALL',
      desiredToleratesChildren: 'YES',
      desiredToleratesOtherAnimals: 'YES',
      desiredToleratesConfinement: 'YES',
    })

    em.create(Application, {
      status: 'PENDING',
      applicationDate: new Date(),
      message: 'Nos gustaría adoptar un cachorro activo para que crezca con la familia.',
      pet: context.rocky,
      adopter: context.juan,
      desiredEnergyLevel: 'HIGH',
      desiredSize: 'MEDIUM',
      desiredToleratesChildren: 'YES',
      desiredToleratesOtherAnimals: 'YES',
      desiredToleratesConfinement: 'NO',
    })

    em.create(Application, {
      status: 'REJECTED',
      applicationDate: new Date(Date.now() - 20 * 86400000),
      resolutionDate: new Date(Date.now() - 18 * 86400000),
      message: 'Queremos sumarla para convivir con nuestros otros tres perros.',
      pet: context.luna,
      adopter: context.juan,
      desiredEnergyLevel: 'HIGH',
      desiredSize: 'LARGE',
      desiredToleratesChildren: 'YES',
      desiredToleratesOtherAnimals: 'YES',
      desiredToleratesConfinement: 'NO',
    })

    em.create(Application, {
      status: 'REJECTED',
      applicationDate: new Date(Date.now() - 15 * 86400000),
      resolutionDate: new Date(Date.now() - 12 * 86400000),
      message: 'Es para vivir dentro de un departamento monoambiente sin balcón.',
      pet: context.luna,
      adopter: context.maria,
      desiredEnergyLevel: 'LOW',
      desiredSize: 'SMALL',
      desiredToleratesChildren: 'NO',
      desiredToleratesOtherAnimals: 'NO',
      desiredToleratesConfinement: 'YES',
    })

    em.create(Application, {
      status: 'REJECTED',
      applicationDate: new Date(Date.now() - 25 * 86400000),
      resolutionDate: new Date(Date.now() - 22 * 86400000),
      message: 'Busco un gato para dejar suelto en un taller mecánico para control de plagas.',
      pet: context.cleo,
      adopter: context.juan,
      desiredEnergyLevel: 'HIGH',
      desiredSize: 'SMALL',
      desiredToleratesChildren: 'NO',
      desiredToleratesOtherAnimals: 'NO',
      desiredToleratesConfinement: 'NO',
    })
  }
}