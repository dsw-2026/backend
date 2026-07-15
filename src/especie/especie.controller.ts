import { Request, Response } from 'express'

function findAll(req: Request, res: Response) {
  res.status(501).json({ message: 'No implementado (migrando a MikroORM)' })
}

function findOne(req: Request, res: Response) {
  res.status(501).json({ message: 'No implementado (migrando a MikroORM)' })
}

function create(req: Request, res: Response) {
  res.status(501).json({ message: 'No implementado (migrando a MikroORM)' })
}

function update(req: Request, res: Response) {
  res.status(501).json({ message: 'No implementado (migrando a MikroORM)' })
}

function remove(req: Request, res: Response) {
  res.status(501).json({ message: 'No implementado (migrando a MikroORM)' })
}

export { findAll, findOne, create, update, remove }