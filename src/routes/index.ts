import { Router } from 'express'
import roomRoutes from './room/room.routes'
import authRoutes from './auth/auth.routes'

const routes = Router()

routes.use('/room', roomRoutes)
routes.use('/auth', authRoutes)

export default routes