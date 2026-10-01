import type { EntityManager, Dictionary } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { Pet } from '../../../pet/pet.entity.js'
import { Characteristic } from '../../../characteristic/characteristic.entity.js'

export class PetSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    context.firulais = em.create(Pet, {
      name: 'Firulais',
      sex: 'MALE',
      age: 2,
      ageUnit: 'YEARS',
      status: 'AVAILABLE',
      admissionDate: new Date(),
      species: context.species['Perro'],
      publisher: context.refugioAmigos,
      characteristic: em.create(Characteristic, {
        energyLevel: 'MEDIUM',
        temperament: 'Tranquilo y cariñoso',
        size: 'MEDIUM',
        vaccinated: true,
        neutered: true,
        toleratesChildren: 'YES',
        toleratesOtherAnimals: 'YES',
        toleratesConfinement: 'NO',
      }),
    })

    context.michi = em.create(Pet, {
      name: 'Michi',
      sex: 'FEMALE',
      age: 6,
      ageUnit: 'MONTHS',
      status: 'AVAILABLE',
      admissionDate: new Date(),
      species: context.species['Gato'],
      publisher: context.refugioAmigos,
      characteristic: em.create(Characteristic, {
        energyLevel: 'HIGH',
        temperament: 'Juguetona y curiosa',
        size: 'SMALL',
        vaccinated: true,
        neutered: false,
        toleratesChildren: 'YES',
        toleratesOtherAnimals: 'UNKNOWN',
        toleratesConfinement: 'YES',
      }),
    })

    context.tomas = em.create(Pet, {
      name: 'Tomás',
      sex: 'MALE',
      age: 1,
      ageUnit: 'YEARS',
      status: 'ADOPTED',
      admissionDate: new Date(),
      species: context.species['Conejo'],
      publisher: context.patitasFelices,
      characteristic: em.create(Characteristic, {
        energyLevel: 'LOW',
        temperament: 'Tímido pero muy dócil',
        size: 'SMALL',
        vaccinated: true,
        neutered: false,
        toleratesChildren: 'YES',
        toleratesOtherAnimals: 'YES',
        toleratesConfinement: 'YES',
      }),
    })
  }
}