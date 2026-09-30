import { defineConfig } from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy'
import { SeedManager } from '@mikro-orm/seeder'
import 'dotenv/config'

export default defineConfig({
  entities: ['dist/**/*.entity.js'],
 //entitiesTs: ['src/**/*.entity.ts'],

  metadataProvider: ReflectMetadataProvider,

  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  highlighter: new SqlHighlighter(),
  debug: true,

  extensions: [SeedManager],

  seeder: {
    path: 'dist/shared/db/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).js',
  },

  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
})