import type { TokenPayload } from './auth.types.js'

// Extiende el tipo Request de Express para agregar req.usuario,
// que el middleware verificarToken setea con el payload del JWT.
declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload
    }
  }
}

export {}