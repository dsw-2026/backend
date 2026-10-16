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
      photo: '/uploads/firulais.jpg',
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
      photo: '/uploads/michi.jpg',
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
      photo: '/uploads/tomas.jpg',
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

    context.chicho = em.create(Pet, {
      name: 'Chicho',
      sex: 'MALE',
      age: 8,
      ageUnit: 'MONTHS',
      status: 'AVAILABLE',
      photo: '/uploads/chicho.jpg',
      admissionDate: new Date(),
      species: context.species['Hámster'],
      publisher: context.patitasFelices,
      characteristic: em.create(Characteristic, {
        energyLevel: 'MEDIUM',
        temperament: 'Activo por las noches, dócil',
        size: 'SMALL',
        vaccinated: false,
        neutered: false,
        toleratesChildren: 'YES',
        toleratesOtherAnimals: 'NO',
        toleratesConfinement: 'YES',
      }),
    })

    context.manuelita = em.create(Pet, {
      name: 'Manuelita',
      sex: 'FEMALE',
      age: 5,
      ageUnit: 'YEARS',
      status: 'AVAILABLE',
      photo: '/uploads/manuelita.jpg',
      admissionDate: new Date(),
      species: context.species['Tortuga'],
      publisher: context.almaAnimal ?? context.refugioAmigos,
      characteristic: em.create(Characteristic, {
        energyLevel: 'LOW',
        temperament: 'Muy tranquila e independiente',
        size: 'SMALL',
        vaccinated: false,
        neutered: false,
        toleratesChildren: 'YES',
        toleratesOtherAnimals: 'YES',
        toleratesConfinement: 'YES',
      }),
    })

    context.luna = em.create(Pet, {
      name: 'Luna',
      sex: 'FEMALE',
      age: 3,
      ageUnit: 'YEARS',
      status: 'AVAILABLE',
      photo: '/uploads/luna.jpg',
      admissionDate: new Date(Date.now() - 30 * 86400000),
      species: context.species['Perro'],
      publisher: context.hogarHuellitas ?? context.refugioAmigos,
      characteristic: em.create(Characteristic, {
        energyLevel: 'HIGH',
        temperament: 'Protectora, activa y leal',
        size: 'LARGE',
        vaccinated: true,
        neutered: true,
        toleratesChildren: 'YES',
        toleratesOtherAnimals: 'NO',
        toleratesConfinement: 'NO',
      }),
    })

    context.simon = em.create(Pet, {
      name: 'Simón',
      sex: 'MALE',
      age: 4,
      ageUnit: 'YEARS',
      status: 'ADOPTED',
      photo: '/uploads/simon.jpg',
      admissionDate: new Date(Date.now() - 45 * 86400000),
      species: context.species['Gato'],
      publisher: context.almaAnimal ?? context.patitasFelices,
      characteristic: em.create(Characteristic, {
        energyLevel: 'LOW',
        temperament: 'Dormilón, cariñoso y tranquilo',
        size: 'SMALL',
        vaccinated: true,
        neutered: true,
        toleratesChildren: 'YES',
        toleratesOtherAnimals: 'YES',
        toleratesConfinement: 'YES',
      }),
    })

    context.rocky = em.create(Pet, {
      name: 'Rocky',
      sex: 'MALE',
      age: 5,
      ageUnit: 'MONTHS',
      status: 'AVAILABLE',
      photo: '/uploads/rocky.jpg',
      admissionDate: new Date(Date.now() - 10 * 86400000),
      species: context.species['Perro'],
      publisher: context.refugioAmigos,
      characteristic: em.create(Characteristic, {
        energyLevel: 'HIGH',
        temperament: 'Cachorro enérgico y juguetón',
        size: 'MEDIUM',
        vaccinated: false,
        neutered: false,
        toleratesChildren: 'YES',
        toleratesOtherAnimals: 'YES',
        toleratesConfinement: 'NO',
      }),
    })

    context.cleo = em.create(Pet, {
      name: 'Cleo',
      sex: 'FEMALE',
      age: 7,
      ageUnit: 'YEARS',
      status: 'AVAILABLE',
      photo: '/uploads/cleo.jpg',
      admissionDate: new Date(Date.now() - 60 * 86400000),
      species: context.species['Gato'],
      publisher: context.patitasFelices,
      characteristic: em.create(Characteristic, {
        energyLevel: 'LOW',
        temperament: 'Senior, muy tranquila e independiente',
        size: 'SMALL',
        vaccinated: true,
        neutered: true,
        toleratesChildren: 'NO',
        toleratesOtherAnimals: 'NO',
        toleratesConfinement: 'YES',
      }),
    })

    context.milo = em.create(Pet, {
      name: 'Milo',
      sex: 'MALE',
      age: 2,
      ageUnit: 'YEARS',
      status: 'ADOPTED',
      photo: '/uploads/milo.jpg',
      admissionDate: new Date(Date.now() - 25 * 86400000),
      species: context.species['Perro'],
      publisher: context.hogarHuellitas ?? context.refugioAmigos,
      characteristic: em.create(Characteristic, {
        energyLevel: 'MEDIUM',
        temperament: 'Sociable, equilibrado y obediente',
        size: 'MEDIUM',
        vaccinated: true,
        neutered: true,
        toleratesChildren: 'YES',
        toleratesOtherAnimals: 'YES',
        toleratesConfinement: 'NO',
      }),
    })
  }
}