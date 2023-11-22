/**
 * J'ai choisi d'utiliser Express, Typegoose et bcryptjs pour construire cette API REST car ils offrent une excellente compatibilité avec TypeScript.
 * Ce fichier, 'userRouter.ts', gère les routes pour les utilisateurs. Il contient deux routes principales : une pour la connexion des utilisateurs et une autre pour l'inscription des utilisateurs.
 * La route 'POST /signin' permet aux utilisateurs de se connecter en utilisant leur email et leur mot de passe. Si les informations sont correctes, un token est généré et renvoyé avec les informations de l'utilisateur.
 * La route 'POST /signup' permet aux nouveaux utilisateurs de s'inscrire en fournissant leur nom, email et mot de passe. Un nouveau utilisateur est créé dans la base de données et un token est généré et renvoyé avec les informations de l'utilisateur.
 */
import express, { Request, Response } from 'express'
import { User, UserModel } from '../models/user'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils'

export const userRouter = express.Router()
userRouter.post(
  '/signin',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email })
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        })
        return
      }
    }
    res.status(401).send({ message: 'Invalid email or password' })
  })
)

userRouter.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    } as User)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    })
  })
)
