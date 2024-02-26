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
import jwt, { VerifyErrors } from 'jsonwebtoken'
import {
  generateToken,
  generatePasswordResetToken,
  sendPasswordResetEmail,
} from '../utils'
import rateLimit from 'express-rate-limit'
import { ParamsDictionary } from 'express-serve-static-core'

export const userRouter = express.Router()

const passwordResetRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    'Too many password reset requests from this IP, please try again after 15 minutes.',
})

interface UserRequestBody {
  name?: string
  email?: string
  password?: string
}

userRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const users = await UserModel.find({})
    res.json(users)
  })
)

userRouter.put(
  '/:id',
  asyncHandler(
    async (req: Request<ParamsDictionary, UserRequestBody>, res: Response) => {
      const user = await UserModel.findById(req.params.id)
      if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(req.body.password, salt);
        }
        const updatedUser = await user.save()
        res.send({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser),
        })
      } else {
        res.status(404).send({ message: 'Utilisateur non trouvé' })
      }
    }
  )
)

userRouter.delete(
  '/:id',
  asyncHandler(async (req: Request<ParamsDictionary>, res: Response) => {
    const user = await UserModel.findById(req.params.id)
    if (user) {
      await UserModel.deleteOne({ _id: req.params.id })
      res.send({ message: 'Utilisateur supprimé' })
    } else {
      res.status(404).send({ message: 'Utilisateur non trouvé' })
    }
  })
)

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
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
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

userRouter.post(
  '/password-reset-request',
  passwordResetRequestLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email })
    if (user) {
      const { token, jti } = generatePasswordResetToken(user)

      user.passwordResetTokenJti = jti
      await user.save()

      try {
        await sendPasswordResetEmail(user, token)
        res.status(200).send({ message: 'Password reset email sent.' })
      } catch (error) {
        res.status(500).send({ message: 'Error sending password reset email.' })
      }
    } else {
      res
        .status(404)
        .send({ message: 'No account with this email address exists.' })
    }
  })
)

interface DecodedToken {
  _id: string
  email: string
  jti: string
}

userRouter.post(
  '/password-reset',
  asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body
    if (!token || !newPassword) {
      res
        .status(400)
        .send({ message: 'Token and new password must be provided' })
      return
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          res.status(401).send({ message: 'Invalid or expired token' })
          return
        }
        const decodedToken = decoded as DecodedToken
        const user = await UserModel.findOne({
          _id: decodedToken._id,
          email: decodedToken.email,
        })
        if (user) {
          if (user.passwordResetTokenJti !== decodedToken.jti) {
            res.status(401).send({ message: 'Invalid or expired token' })
            return
          }
          user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))
          user.passwordResetTokenJti = undefined
          await user.save()
          res.send({ message: 'Password reset successful' })
        } else {
          res.status(404).send({ message: 'User not found' })
        }
      }
    )
  })
)
