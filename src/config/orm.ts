import { MikroORM } from '@mikro-orm/mysql'
import config from './mikro-orm.config.js'

export const orm = await MikroORM.init(config)

export const syncSchema = async () => {
  await orm.schema.update()
}