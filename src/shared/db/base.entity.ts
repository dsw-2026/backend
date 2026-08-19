import { PrimaryKey } from '@mikro-orm/decorators/legacy'

// Clase base abstracta: define el id (clave primaria autoincremental) que
// heredan todas las entidades del proyecto, evitando repetirlo en cada una.
export abstract class BaseEntity {
  @PrimaryKey()
  id!: number
}