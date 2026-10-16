import type { EntityManager, Dictionary } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { Province } from '../../../province/province.entity.js'

export class ProvinceSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    context.santaFe = em.create(Province, { name: 'Santa Fe', code: 'SF' })
    context.buenosAires = em.create(Province, { name: 'Buenos Aires', code: 'BA' })
    context.cordoba = em.create(Province, { name: 'Córdoba', code: 'CB' })
    context.entreRios = em.create(Province, { name: 'Entre Ríos', code: 'ER' })
    context.mendoza = em.create(Province, { name: 'Mendoza', code: 'MZ' })

    em.persist([
      context.santaFe,
      context.buenosAires,
      context.cordoba,
      context.entreRios,
      context.mendoza,
    ])
  }
}