// Elimina las claves con valor null o undefined de un objeto.
// Se usa en todos los sanitizadores para permitir actualizaciones parciales
// (PATCH) sin sobrescribir campos existentes con valores vacíos.
export function removeNullish(obj: Record<string, any>) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) {
      delete obj[key]
    }
  })
}