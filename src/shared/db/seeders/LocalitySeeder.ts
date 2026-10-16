import type { EntityManager, Dictionary } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { Locality } from '../../../locality/locality.entity.js'

export class LocalitySeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    context.rosario = em.create(Locality, { name: 'Rosario', postalCode: '2000', province: context.santaFe })
    context.santaFeCapital = em.create(Locality, { name: 'Santa Fe', postalCode: '3000', province: context.santaFe })
    context.laPlata = em.create(Locality, { name: 'La Plata', postalCode: '1900', province: context.buenosAires })
    context.cordobaCapital = em.create(Locality, { name: 'Córdoba', postalCode: '5000', province: context.cordoba })
    context.sanLorenzo = em.create(Locality, { name: 'San Lorenzo', postalCode: '2200', province: context.santaFe })
    context.marDelPlata = em.create(Locality, { name: 'Mar del Plata', postalCode: '7600', province: context.buenosAires })
    context.villaCarlosPaz = em.create(Locality, { name: 'Villa Carlos Paz', postalCode: '5152', province: context.cordoba })
    context.rafaela = em.create(Locality, { name: 'Rafaela', postalCode: '2300', province: context.santaFe })

    em.persist([
      context.rosario,
      context.santaFeCapital,
      context.laPlata,
      context.cordobaCapital,
      context.sanLorenzo,
      context.marDelPlata,
      context.villaCarlosPaz,
      context.rafaela,
    ])
  }
}