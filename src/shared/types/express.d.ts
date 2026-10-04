import type { TokenPayload } from './auth.types.js'

// Extends Express's Request type to add req.user, which the authenticate
// middleware sets with the JWT payload.
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export {}