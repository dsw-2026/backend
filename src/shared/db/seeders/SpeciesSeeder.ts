import type { EntityManager, Dictionary } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { Species } from '../../../species/species.entity.js'

export class SpeciesSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const nombres = ['Perro', 'Gato', 'Conejo', 'Ave', 'Hámster', 'Tortuga']
    context.species = {}
    for (const name of nombres) {
      context.species[name] = em.create(Species, { name })
    }
  }
}