// Shape of the JWT payload once decoded.
export interface TokenPayload {
  id: number
  type: string // 'Publisher' | 'Adopter' | 'Admin'
}