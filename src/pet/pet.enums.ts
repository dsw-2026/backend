export const Sex = { MALE: 'MALE', FEMALE: 'FEMALE' } as const
export type Sex = (typeof Sex)[keyof typeof Sex]

export const AgeUnit = { MONTHS: 'MONTHS', YEARS: 'YEARS' } as const
export type AgeUnit = (typeof AgeUnit)[keyof typeof AgeUnit]

export const PetStatus = {
  AVAILABLE: 'AVAILABLE',
  IN_PROCESS: 'IN_PROCESS',
  ADOPTED: 'ADOPTED',
  UNAVAILABLE: 'UNAVAILABLE',
} as const
export type PetStatus = (typeof PetStatus)[keyof typeof PetStatus]