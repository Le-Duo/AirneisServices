
import { Request, Response, NextFunction } from 'express'
import { User } from './models/user'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const generateToken = (user: User) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  )
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.slice(7, authorization.length);
    if (token) {
      try {
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET is not set');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded as User;
        next();
      } catch (error) {
        console.error(error);
        res.status(401).send({ message: 'Invalid Token' });
      }
    } else {
      res.status(401).send({ message: 'Token not found' });
    }
  } else {
    res.status(401).send({ message: 'No Token or Bearer prefix missing' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Not authorized as admin' });
  }
};

export const generatePasswordResetToken = (user: User) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }
  const jti = new Date().getTime().toString()
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      jti: jti,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  )
  return { token, jti }
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
  });

  const appDeepLink = `airneisapp://reset-password/${token}`;
  const webLink = `https://airneiswebapp.onrender.com/password-reset/${token}`;

  const mailOptions = {
    from: '"Àirneis Support" <support@airneis.com>',
    to: user.email,
    subject: 'Password Reset Request',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link to reset your password in the mobile app:\n\n${appDeepLink}\n\nOr, you can use the following link to reset your password on the website:\n\n${webLink}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
}
