import type { EntityManager, EntityClass } from '@mikro-orm/core'

// Error tipado: además del mensaje, indica qué campo específico causó el
// conflicto, para que el controller pueda devolvérselo al frontend y el
// frontend pueda marcar ese campo puntual en vez de mostrar un error genérico.
export class ConflictoUnicidadError extends Error {
  field: string
  constructor(field: string, message: string) {
    super(message)
    this.field = field
  }
}

// Antes de crear/actualizar, verifica que ningún OTRO registro ya tenga
// alguno de los valores dados en un campo marcado unique: true en la
// entidad. Se le pasa idExcluir al editar, para no chocar contra el
// propio registro que se está editando.
//
// Por qué se valida ANTES en vez de capturar el error de MySQL: el error
// crudo de una violación de UNIQUE (ER_DUP_ENTRY) no distingue de forma
// simple y confiable cuál de varios campos únicos fue el que chocó —
// parsear el mensaje de MySQL para adivinarlo es frágil. Consultar antes
// es más código pero es explícito y confiable.
export async function assertUnico<T extends object>(
  em: EntityManager,
  entidad: EntityClass<T>,
  campos: Partial<Record<keyof T, unknown>>,
  idExcluir?: number,
  mensajes?: Partial<Record<keyof T, string>>
): Promise<void> {
  for (const campo in campos) {
    const valor = campos[campo]
    if (valor === undefined || valor === null || valor === '') continue

    const filtro: Record<string, unknown> = { [campo]: valor }
    if (idExcluir !== undefined) {
      filtro.id = { $ne: idExcluir }
    }

    const existente = await em.findOne(entidad, filtro as any)
    if (existente) {
      const mensaje = mensajes?.[campo] ?? `Ya existe un registro con ese valor en "${String(campo)}"`
      throw new ConflictoUnicidadError(String(campo), mensaje)
    }
  }
}
