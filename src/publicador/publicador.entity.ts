import { Entity, Property, Enum } from '@mikro-orm/decorators/legacy'
import { Usuario } from '../usuario/usuario.entity.js'

/// Define los tipos de Publicador permitidos.
export const TipoPublicador = {
  REFUGIO: 'REFUGIO',
  RESCATISTA_INDEPENDIENTE: 'RESCATISTA_INDEPENDIENTE',
  HOGAR_DE_TRANSITO: 'HOGAR_DE_TRANSITO',
} as const
export type TipoPublicador = (typeof TipoPublicador)[keyof typeof TipoPublicador]

// Publicador hereda de Usuario y utiliza la misma tabla en la base de datos.
// El valor "publicador" identifica qué registros corresponden a esta subclase.
@Entity({ discriminatorValue: 'publicador' })
export class Publicador extends Usuario {
  // Deben ser 'nullable: true' porque comparten la misma tabla con otros usuarios (ej. Adoptante),
  // por lo que en las filas de esos otros roles estas columnas quedan vacías (NULL).
  @Enum({ items: () => Object.values(TipoPublicador), nullable: true })
  tipo?: TipoPublicador

  @Property({ nullable: true })
  sitioWeb?: string

  // JSON simple para enlaces de contacto, evitando una tabla extra en la bd.
  @Property({ nullable: true, columnType: 'json' })
  redesSociales?: Record<string, string>

  @Property({ nullable: true })
  horariosAtencion?: string
}