import { Entity, Property, Enum } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/base.entity.js'

export enum EstadoMascota {
  DISPONIBLE = 'DISPONIBLE',
  ADOPTADA = 'ADOPTADA'
}

@Entity()
export class Mascota extends BaseEntity {

  @Enum(() => EstadoMascota)
  estado!: EstadoMascota

}