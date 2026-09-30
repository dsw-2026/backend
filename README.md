# backend

Backend del TP DSW 2026

# 🐾 Fluffy — Backend

API REST del sistema de adopción de mascotas **Fluffy**, desarrollada para
la materia Desarrollo de Software (UTN FRRo).

Fluffy conecta refugios, rescatistas y hogares de tránsito con personas que
buscan adoptar una mascota: permite registrar usuarios, publicar animales
disponibles y gestionar el proceso de solicitud de adopción de forma
responsable.

---

## 📑 Índice

- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Modelo de dominio](#-modelo-de-dominio)
- [Decisiones de diseño](#-decisiones-de-diseño)
- [Requisitos previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
- [Datos iniciales (seeders)](#-datos-iniciales-seeders)
- [Documentación de la API (Swagger)](#-documentación-de-la-api-swagger)
- [Scripts disponibles](#-scripts-disponibles)
- [Autenticación y autorización](#-autenticación-y-autorización)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Manejo de errores](#-manejo-de-errores)

---

## 🛠 Tecnologías

| Categoría          | Herramienta                     |
| ------------------ | ------------------------------- |
| Runtime            | Node.js 20+                     |
| Lenguaje           | TypeScript                      |
| Framework web      | Express                         |
| ORM                | MikroORM                        |
| Base de datos      | MySQL                           |
| Validación         | Zod                             |
| Autenticación      | JWT + bcrypt (cookies httpOnly) |
| Documentación      | Swagger (OpenAPI 3.0)           |
| Gestor de paquetes | pnpm                            |

---

## 🏗 Arquitectura

El backend sigue una **arquitectura en capas**, con una carpeta por entidad.
Cada petición atraviesa las capas de la siguiente forma:

```
Petición HTTP
    │
    ▼
routes ──▶ middlewares (validación Zod, autenticación, autorización)
    │
    ▼
controller  ── solo maneja HTTP (request / response)
    │
    ▼
service     ── lógica de negocio (reglas, validaciones de dominio)
    │
    ▼
DAO         ── único acceso a la base de datos
    │
    ▼
entity      ── estructura de datos (MikroORM)
    │
    ▼
Base de datos (MySQL)
```

**Responsabilidad de cada capa:**

- **routes**: define los endpoints y encadena los middlewares (validación,
  autenticación, autorización) antes del controller.
- **controller**: recibe la petición, delega en el service y arma la
  respuesta. No contiene lógica de negocio ni accede a la base.
- **service**: contiene la lógica de negocio (reglas de dominio,
  validaciones, coordinación entre entidades, hash de contraseñas). No sabe
  de HTTP.
- **DAO** (Data Access Object): único lugar que habla con la base de datos.
  No contiene lógica de negocio.
- **entity**: define la estructura y las relaciones de los datos.

---

## 📊 Modelo de dominio

El sistema modela los siguientes conceptos principales:

- **User** (abstracto): datos comunes de las personas del sistema. Del él
  heredan, mediante **Single Table Inheritance**, tres tipos concretos:
  - **Publisher**: refugio, rescatista u hogar de tránsito que publica
    mascotas.
  - **Adopter**: persona que busca adoptar.
  - **Admin**: administrador del sistema.
- **Pet**: mascota en adopción (pertenece a un Publisher, tiene una Species
  y una Characteristic).
- **Characteristic**: características de una mascota (energía, tamaño,
  tolerancias, etc.).
- **Application**: solicitud de adopción (relaciona un Adopter con una Pet).
- **Species**, **Province**, **Locality**: catálogos de apoyo.

> El diagrama completo del modelo de dominio se encuentra en la
> [propuesta del proyecto](../docs/proposal.md).

---

## 💡 Decisiones de diseño

Esta sección documenta el _por qué_ de las decisiones técnicas principales.

### Arquitectura en capas (DAO / Service / Controller)

Se separan responsabilidades en capas para que el código sea mantenible y
testeable: el controller no sabe de la base de datos, el DAO no sabe de
reglas de negocio, y el service concentra la lógica. Esto permite, por
ejemplo, cambiar el motor de base de datos tocando solo el DAO, o testear la
lógica de negocio sin levantar un servidor HTTP.

### Validación con Zod

La validación de la entrada se hace con **schemas de Zod** aplicados por un
middleware, antes de que la petición llegue al controller. Ventajas:

- **Una sola fuente de verdad**: el schema define la forma y las reglas, y
  de él se infiere el tipo TypeScript automáticamente (`z.infer`).
- **Validación perimetral**: se validan `body`, `params` y `query` de forma
  unificada en la puerta de entrada.
- **Prevención de mass assignment**: se descartan los campos no declarados
  en el schema, evitando que un cliente inyecte campos no permitidos.
- **Errores por campo**: los errores de validación indican qué campo falló,
  facilitando su consumo por el frontend.

### Autenticación con cookie httpOnly

El token JWT se envía en una **cookie httpOnly** en lugar del body o el
header `Authorization`. Como el JavaScript del navegador no puede leer una
cookie httpOnly, el token queda protegido frente a ataques **XSS**
(Cross-Site Scripting). Esto es más seguro que guardar el token en
`localStorage`.

### Roles mediante herencia (no un atributo)

El "rol" de un usuario no se guarda como un atributo, sino que está
determinado por su **tipo concreto** (Publisher, Adopter o Admin), mediante
herencia. Así se evita duplicar información y el riesgo de inconsistencias
(una sola fuente de verdad: la clase real de la instancia).

### Manejo de errores centralizado

En lugar de un `try/catch` repetido en cada controller, los errores se
lanzan como **clases de error propias** (`NotFoundError`, `ConflictError`,
etc.) que "burbujean" hasta un **middleware global** que les asigna el
código HTTP correcto en un único lugar.

### Contraseñas hasheadas en el service

El hash de contraseñas (con bcrypt) se hace en la **capa de service**,
porque "guardar contraseñas hasheadas" es una regla de negocio de
seguridad. El DAO solo persiste datos, sin conocer detalles de seguridad.

### Idioma: código en inglés, mensajes en español

El código (entidades, atributos, variables, rutas) está en **inglés**,
siguiendo la convención de la industria. Los mensajes dirigidos al usuario
final (respuestas, errores de validación) están en **español**, porque la
aplicación está orientada a usuarios hispanohablantes. Los valores de enum
se mantienen en inglés (son códigos internos que el frontend traduce).

---

## ✅ Requisitos previos

- **Node.js** 20 o superior.
- **pnpm** — si no lo tenés: `npm install -g pnpm`
- Acceso a una base de datos **MySQL** (el proyecto usa una instancia en la
  nube; se necesitan las credenciales de conexión).

---

## ⚙️ Instalación

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar las variables de entorno

```bash
cp .env.example .env
```

Completá el `.env` con tus valores:

```
# Base de datos
DB_NAME=
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=

# Firma de los tokens de sesión (cadena larga y aleatoria)
JWT_SECRET=

# Origen del frontend habilitado para consultar la API
CORS_ORIGIN=http://localhost:5173

# Credenciales de la primera cuenta Admin (usadas por "pnpm seed:admin")
ADMIN_USERNAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NOMBRE=Admin
ADMIN_APELLIDO=Fluffy
```

Para generar un `JWT_SECRET` aleatorio:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ▶️ Ejecución

```bash
pnpm start:dev
```

El servidor queda corriendo en `http://localhost:3000`. Al arrancar,
MikroORM sincroniza el esquema de la base con las entidades.

---

## 🌱 Datos iniciales (seeders)

El proyecto tiene **dos seeders con roles separados**:

### 1. Cuenta Admin inicial (bootstrap)

Crea la primera cuenta administradora usando las credenciales `ADMIN_*` del
`.env`. Es **idempotente** (no duplica ni borra) y seguro de correr en
cualquier entorno, incluso producción:

```bash
pnpm seed:admin
```

> Es un seeder de _bootstrap_: la cuenta Admin no puede crearse por la API
> (requeriría estar logueado como Admin), así que se carga por script para
> romper ese círculo.

### 2. Datos de prueba (solo desarrollo)

Carga un conjunto completo de datos de ejemplo (especies, provincias,
localidades, publicadores, adoptantes, mascotas y solicitudes).

```bash
pnpm seed:run
```

> ⚠️ **Borra y recrea** los datos de prueba (no toca la cuenta Admin). Usar
> solo en desarrollo, nunca en producción.

Todas las cuentas de prueba usan la contraseña `password123`.

---

## 📖 Documentación de la API (Swagger)

Con el servidor corriendo, la documentación interactiva está en:

```
http://localhost:3000/api-docs
```

Permite ver todos los endpoints agrupados por recurso, con sus parámetros,
respuestas, y probarlos directamente desde el navegador.

---

## 📜 Scripts disponibles

| Comando           | Descripción                                                       |
| ----------------- | ----------------------------------------------------------------- |
| `pnpm start:dev`  | Levanta el servidor en desarrollo (con recompilación automática). |
| `pnpm build`      | Compila TypeScript a JavaScript (carpeta `dist/`).                |
| `pnpm test`       | Ejecuta los tests automatizados.                                  |
| `pnpm seed:admin` | Crea la cuenta Admin inicial (desde el `.env`).                   |
| `pnpm seed:run`   | Carga los datos de prueba (solo desarrollo).                      |

---

## 🔐 Autenticación y autorización

- **Login** (`POST /api/auth/login`): devuelve el token en una cookie
  **httpOnly**; el cliente no necesita manejar el token manualmente.
- **Perfil** (`GET /api/auth/me`): devuelve los datos del usuario logueado.
- **Autorización por rol**: las rutas protegidas verifican el token
  (middleware `verificarToken`) y, cuando corresponde, el rol del usuario
  (middleware `verificarTipo`). Por ejemplo, solo un Publisher puede
  publicar mascotas; solo un Adopter puede crear solicitudes.

---

## 📂 Estructura del proyecto

```
src/
├── <entidad>/                  # una carpeta por entidad
│   ├── schemas/                # schemas de validación (Zod)
│   ├── <entidad>.entity.ts     # entidad (MikroORM)
│   ├── <entidad>.dao.ts        # acceso a datos
│   ├── <entidad>.service.ts    # lógica de negocio
│   ├── <entidad>.controller.ts # manejo HTTP
│   └── <entidad>.routes.ts     # endpoints + middlewares + Swagger
├── auth/                       # login, perfil y middlewares de auth
├── shared/
│   ├── db/
│   │   ├── orm.ts              # inicialización de MikroORM
│   │   ├── seed-admin.ts       # seeder de bootstrap (Admin)
│   │   └── seeders/            # seeders de datos de prueba
│   ├── errors/                 # clases de error, traductor de errores de BD, ApiResponse
│   ├── middlewares/            # middleware de validación y de errores
│   └── swagger.ts              # configuración de Swagger
├── mikro-orm.config.ts         # configuración de MikroORM (usada por la CLI)
└── app.ts                      # punto de entrada
```

---

## 🚨 Manejo de errores

Los errores se manejan de forma **centralizada**:

1. Los services lanzan **errores de negocio** propios
   (`NotFoundError`, `ConflictError`, `ValidationError`, etc.).
2. El **DAO** traduce los errores crudos de la base de datos (violación de
   unicidad, clave foránea, etc.) a esos errores de negocio, con mensajes
   claros, mediante `mapDbError`.
3. Un **middleware global** captura cualquier error y responde con el código
   HTTP correcto y un formato estándar:

```json
{
  "success": false,
  "message": "Mensaje en español",
  "details": [{ "field": "campo", "message": "detalle del error" }]
}
```

Las respuestas exitosas siguen el mismo formato consistente:

```json
{
  "success": true,
  "message": "Mensaje en español",
  "data": {}
}
```
