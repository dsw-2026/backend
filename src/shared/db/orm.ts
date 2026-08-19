import { MikroORM } from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy'
import 'dotenv/config'

// Configuración de MikroORM.
// Las credenciales de la base de datos se obtienen desde las variables de entorno.
export const orm = await MikroORM.init({
  // Durante el desarrollo se leen las entidades directamente desde src (TypeScript).
  // En producción se utilizan las entidades compiladas en dist (JavaScript).
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],

  // Permite utilizar los decoradores legacy que usamos en las entidades.
  metadataProvider: ReflectMetadataProvider,

  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  highlighter: new SqlHighlighter(),

  // Muestra las consultas SQL en la consola durante el desarrollo.
  debug: true,

  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
})

// Sincroniza el esquema de la base de datos con las entidades.
// Se utiliza solo durante el desarrollo; en producción se usan migraciones.
export const syncSchema = async () => {
  await orm.schema.update()
}