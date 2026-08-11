import { Entity, Property, Enum } from '@mikro-orm/decorators/legacy'
import { Usuario } from '../usuario/usuario.entity.js'

export enum TipoVivienda {
  CASA = 'CASA',
  DEPARTAMENTO = 'DEPARTAMENTO',
  OTRO = 'OTRO',
}

@Entity({ discriminatorValue: 'adoptante' })
export class Adoptante extends Usuario {
  @Property({ nullable: true })
  occupation?: string

  @Enum({ items: () => TipoVivienda, nullable: true })
  tipoVivienda?: TipoVivienda

  @Property({ nullable: true })
  tienePatio?: boolean

  @Property({ nullable: true })
  tieneOtrosAnimales?: boolean

  @Property({ nullable: true })
  otrosAnimalesDetalle?: string
}