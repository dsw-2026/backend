import { Entity } from '@mikro-orm/decorators/legacy'
import { Usuario } from '../usuario/usuario.entity.js'
 
// Admin extiende Usuario y comparte la misma tabla.
// El valor "admin" identifica los registros de esta subclase.
@Entity({ discriminatorValue: 'admin' })
export class Admin extends Usuario {}