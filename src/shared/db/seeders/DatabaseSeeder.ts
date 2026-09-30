import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { Species } from '../../../species/species.entity.js'
import { Province } from '../../../province/province.entity.js'

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Limpia las tablas antes de sembrar, para poder correr el seeder
    // varias veces sin conflictos de duplicados.
    await em.nativeDelete(Species, {})
    await em.nativeDelete(Province, {})

    const especies = ['Perro', 'Gato', 'Conejo', 'Ave', 'Hámster']
    for (const nombre of especies) {
      em.create(Species, { name: nombre })
    }

    const provincias = [
      { name: 'Santa Fe', code: 'SF' },
      { name: 'Buenos Aires', code: 'BA' },
      { name: 'Córdoba', code: 'CB' },
    ]
    for (const prov of provincias) {
      em.create(Province, prov)
    }
  }
}