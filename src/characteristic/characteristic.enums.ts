export const EnergyLevel = { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' } as const
export type EnergyLevel = (typeof EnergyLevel)[keyof typeof EnergyLevel]

export const Size = { SMALL: 'SMALL', MEDIUM: 'MEDIUM', LARGE: 'LARGE', GIANT: 'GIANT' } as const
export type Size = (typeof Size)[keyof typeof Size]

export const Tolerance = { YES: 'YES', NO: 'NO', UNKNOWN: 'UNKNOWN' } as const
export type Tolerance = (typeof Tolerance)[keyof typeof Tolerance]