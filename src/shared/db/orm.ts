import { MikroORM } from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import 'dotenv/config'

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
})

export const syncSchema = async () => {
  /* await orm.schema.drop()
  await orm.schema.create() */
  await orm.schema.update()
}