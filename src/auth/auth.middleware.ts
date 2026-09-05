import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Extendemos el tipo Request para que TypeScript sepa que, después de este
// middleware, req.usuario puede existir con el payload del token.
// Define la forma que tiene el contenido (payload) del JWT una vez decodificado
export interface TokenPayload {
  id: number
  tipo: string // 'Publicador' | 'Adoptante' | 'Admin'
}
// "agrega" esa propiedad al tipo Request de forma global
declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload
    }
  }
}

function verificarToken(req: Request, res: Response, next: NextFunction) {
  // El token viaja en una cookie httpOnly llamada 'auth.token', puesta por
  // el backend en el login. Es más seguro que el header Authorization,
  // porque el JavaScript del navegador no puede leer una cookie httpOnly,
  // lo que protege el token contra robo por ataques XSS.
  const token = req.cookies?.['auth.token']

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
    // guarda el payload que llega en req para que los controladores siguientes
    // sepan quién está haciendo la petición sin volver a tocar la DB.
    req.usuario = payload
    next()
  } catch (error) {
    // jwt.verify tira si el token expiró, está mal firmado o fue alterado.
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

// Middleware opcional para restringir por tipo de usuario (Publicador/Adoptante/Admin).
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