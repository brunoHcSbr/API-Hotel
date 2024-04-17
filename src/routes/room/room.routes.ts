import { Router } from 'express'
import RoomController from '../../controllers/room/room.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const roomRoutes = Router()

roomRoutes.post('/', authMiddleware, RoomController.store)
roomRoutes.get('/', authMiddleware, RoomController.index)
roomRoutes.delete('/:id', authMiddleware, RoomController.delete)
roomRoutes.put('/:id', authMiddleware, RoomController.update)

export default roomRoutes