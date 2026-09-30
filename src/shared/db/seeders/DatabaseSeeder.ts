import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import bcrypt from 'bcrypt'
import { Species } from '../../../species/species.entity.js'
import { Province } from '../../../province/province.entity.js'
import { Locality } from '../../../locality/locality.entity.js'
import { Publisher } from '../../../publisher/publisher.entity.js'
import { Adopter } from '../../../adopter/adopter.entity.js'
import { Pet } from '../../../pet/pet.entity.js'
import { Characteristic } from '../../../characteristic/characteristic.entity.js'
import { Application } from '../../../application/application.entity.js'

// Seeder de datos de PRUEBA para desarrollo. Borra y recrea los datos de
// ejemplo (NO toca la cuenta Admin, que la gestiona seed-admin.ts).
// ADVERTENCIA: borra datos — usar solo en desarrollo, nunca en producción.
// Se ejecuta con: pnpm seed:run
export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Limpieza en orden inverso a las dependencias (para no violar las FK).
    await em.nativeDelete(Application, {})
    await em.nativeDelete(Pet, {})
    await em.nativeDelete(Characteristic, {})
    await em.nativeDelete(Publisher, {})
    await em.nativeDelete(Adopter, {})
    await em.nativeDelete(Locality, {})
    await em.nativeDelete(Species, {})
    await em.nativeDelete(Province, {})

    const passwordHash = await bcrypt.hash('password123', 10)

    // ---------- Especies ----------
    const especiesNombres = ['Perro', 'Gato', 'Conejo', 'Ave', 'Hámster', 'Tortuga']
    const especies: Record<string, Species> = {}
    for (const nombre of especiesNombres) {
      especies[nombre] = em.create(Species, { name: nombre })
    }

    // ---------- Provincias ----------
    const santaFe = em.create(Province, { name: 'Santa Fe', code: 'SF' })
    const buenosAires = em.create(Province, { name: 'Buenos Aires', code: 'BA' })
    const cordoba = em.create(Province, { name: 'Córdoba', code: 'CB' })

    // ---------- Localidades ----------
    const rosario = em.create(Locality, { name: 'Rosario', postalCode: '2000', province: santaFe })
    const santaFeCapital = em.create(Locality, { name: 'Santa Fe', postalCode: '3000', province: santaFe })
    const laPlata = em.create(Locality, { name: 'La Plata', postalCode: '1900', province: buenosAires })
    const cordobaCapital = em.create(Locality, { name: 'Córdoba', postalCode: '5000', province: cordoba })

    // ---------- Publishers (refugios / rescatistas) ----------
    const refugioAmigos = em.create(Publisher, {
      username: 'refugioamigos',
      firstName: 'Refugio',
      lastName: 'Amigos',
      email: 'refugio@fluffy.com',
      password: passwordHash,
      verified: true,
      createdAt: new Date(),
      type: 'SHELTER',
      locality: rosario,
      description: 'Refugio dedicado al rescate de perros y gatos.',
    })

    const patitasFelices = em.create(Publisher, {
      username: 'patitasfelices',
      firstName: 'Patitas',
      lastName: 'Felices',
      email: 'patitas@fluffy.com',
      password: passwordHash,
      verified: true,
      createdAt: new Date(),
      type: 'INDEPENDENT_RESCUER',
      locality: cordobaCapital,
      description: 'Rescatista independiente de animales en situación de calle.',
    })

    // ---------- Adopters ----------
    const juan = em.create(Adopter, {
      username: 'juanadopta',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@fluffy.com',
      password: passwordHash,
      verified: true,
      createdAt: new Date(),
      locality: laPlata,
      occupation: 'Docente',
      housingType: 'HOUSE',
      hasYard: true,
      hasOtherAnimals: false,
    })

    const maria = em.create(Adopter, {
      username: 'mariaadopta',
      firstName: 'María',
      lastName: 'González',
      email: 'maria@fluffy.com',
      password: passwordHash,
      verified: true,
      createdAt: new Date(),
      locality: santaFeCapital,
      occupation: 'Diseñadora',
      housingType: 'APARTMENT',
      hasYard: false,
      hasOtherAnimals: true,
      otherAnimalsDetail: 'Un gato adulto castrado.',
    })

    // ---------- Mascotas (cada una con su característica) ----------
    const firulais = em.create(Pet, {
      name: 'Firulais',
      sex: 'MALE',
      age: 2,
      ageUnit: 'YEARS',
      status: 'AVAILABLE',
      admissionDate: new Date(),
      species: especies['Perro'],
      publisher: refugioAmigos,
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

    const michi = em.create(Pet, {
      name: 'Michi',
      sex: 'FEMALE',
      age: 6,
      ageUnit: 'MONTHS',
      status: 'AVAILABLE',
      admissionDate: new Date(),
      species: especies['Gato'],
      publisher: refugioAmigos,
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

    em.create(Pet, {
      name: 'Rocky',
      sex: 'MALE',
      age: 4,
      ageUnit: 'YEARS',
      status: 'AVAILABLE',
      admissionDate: new Date(),
      species: especies['Perro'],
      publisher: patitasFelices,
      characteristic: em.create(Characteristic, {
        energyLevel: 'HIGH',
        temperament: 'Enérgico, ideal para casa con patio',
        size: 'LARGE',
        vaccinated: true,
        neutered: true,
        toleratesChildren: 'YES',
        toleratesOtherAnimals: 'NO',
        toleratesConfinement: 'NO',
      }),
    })

    const tomas = em.create(Pet, {
      name: 'Tomás',
      sex: 'MALE',
      age: 1,
      ageUnit: 'YEARS',
      status: 'ADOPTED',
      admissionDate: new Date(),
      species: especies['Conejo'],
      publisher: patitasFelices,
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

    // ---------- Solicitudes de adopción (Applications) ----------
    // Juan solicita a Firulais (pendiente).
    em.create(Application, {
      status: 'PENDING',
      applicationDate: new Date(),
      message: 'Tengo casa con patio y experiencia con perros.',
      pet: firulais,
      adopter: juan,
      desiredEnergyLevel: 'MEDIUM',
      desiredSize: 'MEDIUM',
      desiredToleratesChildren: 'YES',
      desiredToleratesOtherAnimals: 'YES',
      desiredToleratesConfinement: 'NO',
    })

    // María solicita a Michi (pendiente).
    em.create(Application, {
      status: 'PENDING',
      applicationDate: new Date(),
      message: 'Vivo en departamento pero tengo mucho tiempo para dedicarle.',
      pet: michi,
      adopter: maria,
      desiredEnergyLevel: 'HIGH',
      desiredSize: 'SMALL',
      desiredToleratesChildren: 'YES',
      desiredToleratesOtherAnimals: 'UNKNOWN',
      desiredToleratesConfinement: 'YES',
    })

    // Una solicitud ya aprobada (la de Tomás, que quedó como ADOPTED).
    em.create(Application, {
      status: 'APPROVED',
      applicationDate: new Date(),
      message: 'Me encantaría darle un hogar tranquilo.',
      pet: tomas,
      adopter: maria,
      desiredEnergyLevel: 'LOW',
      desiredSize: 'SMALL',
      desiredToleratesChildren: 'YES',
      desiredToleratesOtherAnimals: 'YES',
      desiredToleratesConfinement: 'YES',
    })
  }
}