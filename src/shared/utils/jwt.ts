import jwt from 'jsonwebtoken'
import type { TokenPayload } from '../types/auth.types.js'   

export function generateToken(payload: { id: number; type: string }): string {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' })
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
}