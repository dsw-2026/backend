export const HousingType = {
  HOUSE: 'HOUSE',
  APARTMENT: 'APARTMENT',
  OTHER: 'OTHER',
} as const
export type HousingType = (typeof HousingType)[keyof typeof HousingType]