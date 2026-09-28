import swaggerJSDoc from 'swagger-jsdoc'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fluffy API',
      version: '1.0.0',
      description: 'API REST del sistema de adopción de mascotas Fluffy (UTN FRRo - DSW).',
    },
    servers: [
      { url: 'http://localhost:3000/api', description: 'Servidor de desarrollo' },
    ],
  },
  // Dónde buscar los comentarios @swagger (los archivos de rutas compilados).
  apis: ['./dist/**/*.routes.js'],
}

export const swaggerSpec = swaggerJSDoc(options)