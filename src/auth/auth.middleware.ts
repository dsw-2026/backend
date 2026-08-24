import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Extendemos el tipo Request para que TypeScript sepa que, después de este
// middleware, req.usuario puede existir con el payload del token.
export interface TokenPayload {
  id: number
  tipo: string // 'Publicador' | 'Adoptante'
}

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload
    }
  }
}

function verificarToken(req: Request, res: Response, next: NextFunction) {
  // El estándar es mandar el token como "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
    // Colgamos el payload en req para que los controladores siguientes
    // sepan quién está haciendo la petición sin volver a tocar la DB.
    req.usuario = payload
    next()
  } catch (error) {
    // jwt.verify tira si el token expiró, está mal firmado o fue alterado.
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

// Middleware opcional para restringir por tipo de usuario (Publicador/Adoptante).
// Se usa DESPUÉS de verificarToken, porque necesita req.usuario ya seteado.
function verificarTipo(...tiposPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario || !tiposPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({ message: 'No tenés permisos para esta acción' })
    }
    next()
  }
}

export { verificarToken, verificarTipo }