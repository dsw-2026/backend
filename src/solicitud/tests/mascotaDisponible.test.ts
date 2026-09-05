import { describe, it, expect } from 'vitest'
import { mascotaDisponibleParaSolicitud } from '../mascotaDisponible.js'
import { EstadoMascota } from '../../mascota/mascota.entity.js'

describe('mascotaDisponibleParaSolicitud', () => {
  it('devuelve true si la mascota está DISPONIBLE', () => {
    const mascota: any = { estado: EstadoMascota.DISPONIBLE }
    expect(mascotaDisponibleParaSolicitud(mascota)).toBe(true)
  })

  it('devuelve false si la mascota está EN_PROCESO', () => {
    const mascota: any = { estado: EstadoMascota.EN_PROCESO }
    expect(mascotaDisponibleParaSolicitud(mascota)).toBe(false)
  })

  it('devuelve false si la mascota está ADOPTADA', () => {
    const mascota: any = { estado: EstadoMascota.ADOPTADA }
    expect(mascotaDisponibleParaSolicitud(mascota)).toBe(false)
  })

  it('devuelve false si la mascota está NO_DISPONIBLE', () => {
    const mascota: any = { estado: EstadoMascota.NO_DISPONIBLE }
    expect(mascotaDisponibleParaSolicitud(mascota)).toBe(false)
  })
})