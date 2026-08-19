import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/base.entity.js'

@Entity()
export class Provincia extends BaseEntity {
  // unique: true → no puede haber dos provincias con el mismo nombre.
  @Property({ nullable: false, unique: true })
  nombre!: string

  // Código/abreviatura de la provincia (ej: "CBA"), no confundir con
  // código postal (ese pertenece a Localidad).
  @Property({ nullable: false, unique: true })
  codigo!: string
}