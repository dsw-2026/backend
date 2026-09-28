import { Entity } from '@mikro-orm/decorators/legacy'
import { User } from '../user/user.entity.js'

@Entity({ discriminatorValue: 'admin' })
export class Admin extends User {}