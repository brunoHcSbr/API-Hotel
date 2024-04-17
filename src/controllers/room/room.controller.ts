import { Request, Response } from 'express'
import Room from '../../models/room.entity'

export default class TaskController {
  static async store (req: Request, res: Response) {
    const { toWalk, completed,statusRoom,bed,bath,outhers } = req.body
    const { userId } = req.headers

    //if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

    if (!toWalk) {
      return res.status(400).json({ error: 'O preenchimento do Andar é obrigatório' })
    }

    if (!statusRoom) {
      return res.status(400).json({ error: 'O preenchimento do Status é obrigatório' })
    }

    if (!bed) {
      return res.status(400).json({ error: 'O preenchimento da quantidade de camas é obrigatório' })
    }

    if (!bath) {
      return res.status(400).json({ error: 'O preenchimento da quantidade de banheiros é obrigatório' })
    }

    if (!outhers) {
      return res.status(400).json({ error: 'O preenchimento da quantidade de outros moveis é obrigatório' })
    }

    const room = new Room()
    room.toWalk = toWalk
    room.statusRoom = statusRoom
    room.bed = bed
    room.bath = bath
    room.outhers = outhers
    await room.save()

    return res.status(201).json(room)
  }

  static async index (req: Request, res: Response) {
    const { userId } = req.headers

   // if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

    const room = await Room.find()
    return res.json(room)
  }

 

  static async delete (req: Request, res: Response) {
    const { id } = req.params
    const { userId } = req.headers

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O id é obrigatório' })
    }

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

    const room = await Room.findOneBy({id: Number(id)})
    if (!room) {
      return res.status(404).json({ error: 'Quarto não encontrado' })
    }

    await room.remove()
    return res.status(204).json()
  }
  
  static async update (req: Request, res: Response) {
    const { id } = req.params
    const { toWalk } = req.body
    const { statusRoom } = req.body
    const { bed } = req.body
    const { bath } = req.body
    const { outhers } = req.body

    const { userId } = req.headers

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O id é obrigatório' })
    }

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

    const room = await Room.findOneBy({id: Number(id)})
    if (!room) {
      return res.status(404).json({ error: 'Quarto não encontrado' })
    }

    room.toWalk = toWalk ?? room.toWalk
    room.statusRoom = statusRoom ?? room.statusRoom
    room.bed = bed ?? room.bed
    room.bath = bath ?? room.bath
    room.outhers = outhers ?? room.outhers
    
    await room.save()

    return res.json(room)
  }
}
