import { Entity, Property, ManyToOne } from '@mikro-orm/decorators/legacy'
import { Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Province } from '../province/province.entity.js'

@Entity()
export class Localidad extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string

  // unique: true → no puede haber dos localidades con el mismo código postal.
  @Property({ nullable: false, unique: true })
  codigoPostal!: string

  // Sin cascada: no se puede borrar una Provincia mientras tenga
  // localidades asociadas.
  @ManyToOne(() => Province, { nullable: false })
  provincia!: Rel<Province>
}