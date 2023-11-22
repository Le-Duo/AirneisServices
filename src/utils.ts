/**
 * J'ai choisi d'utiliser TypeScript, Express et jsonwebtoken pour construire cette API REST car ils offrent une excellente compatibilité et des fonctionnalités robustes.
 * Ce fichier, 'utils.ts', contient des fonctions utilitaires pour générer et vérifier les tokens JWT.
 * La fonction 'generateToken' prend un utilisateur comme argument et génère un token JWT qui est ensuite renvoyé.
 * La fonction 'isAuth' est un middleware qui vérifie si un token est fourni dans les en-têtes de la requête. Si un token est présent, il est vérifié et les informations de l'utilisateur sont extraites et attachées à la requête.
 */

import { NextFunction, Request } from 'express'
import { User } from './models/user'
import jwt from 'jsonwebtoken'

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: '30d',
    }
  )
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  if (authorization) {
    const token = authorization.slice(7, authorization.length) // Bearer XXXXX
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret'
    )
    req.user = decode as {
      _id: string
      name: string
      email: string
      isAdmin: boolean
      token: string
    }
    next()
  } else {
    res.status(401).send({ message: 'No Token' })
  }
}
