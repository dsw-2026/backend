import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { Species } from '../../../species/species.entity.js'
import { Province } from '../../../province/province.entity.js'
import { Locality } from '../../../locality/locality.entity.js'
import { Publisher } from '../../../publisher/publisher.entity.js'
import { Adopter } from '../../../adopter/adopter.entity.js'
import { Pet } from '../../../pet/pet.entity.js'
import { Characteristic } from '../../../characteristic/characteristic.entity.js'
import { Application } from '../../../application/application.entity.js'
import { SpeciesSeeder } from './SpeciesSeeder.js'
import { ProvinceSeeder } from './ProvinceSeeder.js'
import { LocalitySeeder } from './LocalitySeeder.js'
import { PublisherSeeder } from './PublisherSeeder.js'
import { AdopterSeeder } from './AdopterSeeder.js'
import { PetSeeder } from './PetSeeder.js'
import { ApplicationSeeder } from './ApplicationSeeder.js'

// Orquestador de los datos de prueba. Limpia la base (sin tocar Admin) y
// llama a cada seeder en orden de dependencias mediante this.call(), que
// comparte un context entre ellos para pasar las entidades relacionadas.
// ADVERTENCIA: borra datos — solo para desarrollo.
export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Limpieza en orden inverso a las dependencias.
    await em.nativeDelete(Application, {})
    await em.nativeDelete(Pet, {})
    await em.nativeDelete(Characteristic, {})
    await em.nativeDelete(Publisher, {})
    await em.nativeDelete(Adopter, {})
    await em.nativeDelete(Locality, {})
    await em.nativeDelete(Species, {})
    await em.nativeDelete(Province, {})

    // Ejecuta los seeders en orden (comparten el context automáticamente).
    return this.call(em, [
      SpeciesSeeder,
      ProvinceSeeder,
      LocalitySeeder,
      PublisherSeeder,
      AdopterSeeder,
      PetSeeder,
      ApplicationSeeder,
    ])
  }
}