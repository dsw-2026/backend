import { randomUUID } from 'node:crypto'

export class Especie {
  constructor(
    public nombre: string,
    public descripcion: string,
    public id = randomUUID()
  ) {}
}