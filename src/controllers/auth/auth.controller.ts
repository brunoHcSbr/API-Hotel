import { Request, Response } from 'express'
import User from '../../models/user.entity'
import Token from '../../models/token.entity'
import bcrypt from 'bcrypt'

export default class AuthController {
  static async store (req: Request, res: Response) {
    const { name, userNick, password, job } = req.body

    if (!name) return res.status(400).json({ error: 'O nome é obrigatório' })
    if (!userNick) return res.status(400).json({ error: 'O nome de usuário é obrigatório' })
    if (!job) return res.status(400).json({ error: 'O nome de usuário é obrigatório' })
    if (!password) return res.status(400).json({ error: 'A senha é obrigatória' })

    
    const userCheck = await User.findOneBy({ userNick })
    if (userCheck) return res.status(400).json({ error: 'Nome de usuário já cadastrado' })


    const user = new User()
    user.name = name
    user.userNick = userNick
    user.job = job
   
    user.password = bcrypt.hashSync(password, 10)
    await user.save()

    
    return res.status(201).json({
      id: user.id,
      name: user.name,
      userNick: user.userNick,
      job: user.job
    })
  }

  static async login (req: Request, res: Response) {
    const { userNick, password } = req.body

    if (!userNick) return res.status(400).json({ error: 'O nome de usuário é obrigatório' })
    if (!password) return res.status(400).json({ error: 'A senha é obrigatória' })

    const user = await User.findOneBy({ userNick })
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })

    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) return res.status(401).json({ error: 'Senha inválida' })

    
    await Token.delete(
      { user: { id: user.id } }
    )

    const token = new Token()
    
    token.token = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
   
    token.expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    
    token.refreshToken = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)

    token.user = user
    await token.save()

    return res.json({
      token: token.token,
      expiresAt: token.expiresAt,
      refreshToken: token.refreshToken
    })
  }

  static async refresh (req: Request, res: Response) {
    const { authorization } = req.headers

    if (!authorization) return res.status(400).json({ error: 'O refresh token é obrigatório' })

    const token = await Token.findOneBy({ refreshToken: authorization })
    if (!token) return res.status(401).json({ error: 'Refresh token inválido' })

    
    if (token.expiresAt < new Date()) {
      await token.remove()
      return res.status(401).json({ error: 'Refresh token expirado' })
    }

    
    token.token = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
    token.refreshToken = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
    token.expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    await token.save()

    return res.json({
      token: token.token,
      expiresAt: token.expiresAt,
      refreshToken: token.refreshToken
    })
  }

  static async logout (req: Request, res: Response) {
    const { authorization } = req.headers
    
    if (!authorization) return res.status(400).json({ error: 'O token é obrigatório' })

   
    const userToken = await Token.findOneBy({ token: authorization })
    if (!userToken) return res.status(401).json({ error: 'Token inválido' })

    
    await userToken.remove()

    
    return res.status(204).json()
  }
}