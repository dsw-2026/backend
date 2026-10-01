import type { EntityManager, Dictionary } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { Locality } from '../../../locality/locality.entity.js'

export class LocalitySeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    context.rosario = em.create(Locality, { name: 'Rosario', postalCode: '2000', province: context.santaFe })
    context.santaFeCapital = em.create(Locality, { name: 'Santa Fe', postalCode: '3000', province: context.santaFe })
    context.laPlata = em.create(Locality, { name: 'La Plata', postalCode: '1900', province: context.buenosAires })
    context.cordobaCapital = em.create(Locality, { name: 'Córdoba', postalCode: '5000', province: context.cordoba })
  }
}