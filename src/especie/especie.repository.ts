import { Repository } from '../shared/repository.js'
import { Especie } from './especie.entity.js'

const especies: Especie[] = [
  new Especie('Perro', 'Mamífero doméstico de cuatro patas'),
  new Especie('Gato', 'Felino doméstico independiente'),
]

export class EspecieRepository implements Repository<Especie> {
  findAll(): Especie[] | undefined {
    return especies
  }

  findOne(item: { id: string }): Especie | undefined {
    return especies.find((especie) => especie.id === item.id)
  }

  add(item: Especie): Especie | undefined {
    especies.push(item)
    return item
  }

  update(item: { id: string } & Partial<Especie>): Especie | undefined {
    const especieIndex = especies.findIndex((especie) => especie.id === item.id)
    if (especieIndex === -1) {
      return undefined
    }
    especies[especieIndex] = { ...especies[especieIndex], ...item }
    return especies[especieIndex]
  }

  delete(item: { id: string }): Especie | undefined {
    const especieIndex = especies.findIndex((especie) => especie.id === item.id)
    if (especieIndex === -1) {
      return undefined
    }
    const especieEliminada = especies[especieIndex]
    especies.splice(especieIndex, 1)
    return especieEliminada
  }
}