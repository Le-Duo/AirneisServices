/**
 * J'ai choisi d'utiliser TypeScript, Express et jsonwebtoken pour construire cette API REST car ils offrent une excellente compatibilité et des fonctionnalités robustes.
 * Ce fichier, 'utils.ts', contient des fonctions utilitaires pour générer et vérifier les tokens JWT.
 * La fonction 'generateToken' prend un utilisateur comme argument et génère un token JWT qui est ensuite renvoyé.
 * La fonction 'isAuth' est un middleware qui vérifie si un token est fourni dans les en-têtes de la requête. Si un token est présent, il est vérifié et les informations de l'utilisateur sont extraites et attachées à la requête.
 * La fonction 'generatePasswordResetToken' génère un token unique pour la réinitialisation du mot de passe.
 * La fonction 'sendPasswordResetEmail' envoie un e-mail à l'utilisateur avec un lien pour réinitialiser le mot de passe.
 */

import { Request, Response, NextFunction } from 'express'
import { User } from './models/user'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer' // Import nodemailer for sending emails
import dotenv from 'dotenv' // Import dotenv for environment variables
dotenv.config() // Load environment variables

const secret = process.env.JWT_SECRET
export const generateToken = (user: User) => {
  
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    secret as string,
    {
      expiresIn: '30d',
    }
  )
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (authorization) {
    console.log(`Authorization Header: ${authorization}`); // Log the full authorization header for debugging
    if (!authorization.startsWith('Bearer ')) {
      return res.status(401).send({ message: 'Token must be prefixed with "Bearer "' });
    }
    const token = authorization.slice(7, authorization.length); // Bearer XXXXX
    if (!token) {
      console.log('Token not found after Bearer prefix');
      return res.status(401).send({ message: 'Token not found' });
    }
    try {
      const decode = jwt.verify(
        token,
        secret as string
      );
      req.user = decode as User;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).send({ message: 'Invalid Token' });
    }
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

export const generatePasswordResetToken = (user: User) => {
  const jti = new Date().getTime().toString() // Generate jti as a string
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      jti: jti, // Use the generated jti
    },
    secret as string,
    {
      expiresIn: '1h',
    }
  )
  return { token, jti } // Return both the token and jti
}

export const sendPasswordResetEmail = async (user: User, token: string) => {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
    secure: false,
  })

  const mailOptions = {
    from: '"Airneis Support" <support@airneis.com>',
    to: user.email,
    subject: 'Password Reset Request',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://localhost:5173/password-reset/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error(error)
  }
}
