import { Entity, Property, Enum } from '@mikro-orm/decorators/legacy'
import { Usuario } from '../usuario/usuario.entity.js'

export enum TipoPublicador {
  REFUGIO = 'REFUGIO',
  RESCATISTA_INDEPENDIENTE = 'RESCATISTA_INDEPENDIENTE',
  HOGAR_DE_TRANSITO = 'HOGAR_DE_TRANSITO',
}

@Entity({ discriminatorValue: 'publicador' })
export class Publicador extends Usuario {
  @Enum({ items: () => TipoPublicador, nullable: true })
  tipo?: TipoPublicador

  @Property({ nullable: true })
  sitioWeb?: string

  @Property({ nullable: true, columnType: 'json' })
  redesSociales?: Record<string, string>

  @Property({ nullable: true })
  horariosAtencion?: string
}