export const PublisherType = {
  SHELTER: 'SHELTER',
  INDEPENDENT_RESCUER: 'INDEPENDENT_RESCUER',
  FOSTER_HOME: 'FOSTER_HOME',
} as const
export type PublisherType = (typeof PublisherType)[keyof typeof PublisherType]