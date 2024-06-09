import express, { Request, Response } from 'express'
import { UserModel, UserAddress, UserAddressModel } from '../models/user'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateToken, generatePasswordResetToken, sendPasswordResetEmail } from '../utils'
import dotenv from 'dotenv'
import { isAdmin, isAuth } from '../utils'
import rateLimit from 'express-rate-limit'
import { ParamsDictionary } from 'express-serve-static-core'
import { PaymentCard, PaymentCardModel } from '../models/payment'
import { ObjectId } from 'mongodb'

dotenv.config()

export const userRouter = express.Router()

const passwordResetRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password reset requests from this IP, please try again after 15 minutes.',
})

interface UserRequestBody {
  name?: string
  email?: string
  phoneNumber?:string
  password?: string
  isAdmin?: boolean
  addresses?: UserAddress[]
  paymentCards?: PaymentCard[]
  _id?: string;
}

interface AddressRequestBody {
  street: string
  city: string
  postalCode: string
  country: string
}

interface PaymentCardRequestBody {
  bankName: string
  number: string
  fullName: string
  monthExpiration: number
  yearExpiration: number
}

const sendErrorResponse = (res: Response, statusCode: number, message: string) => {
  res.status(statusCode).send({ message })
}

userRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const users = await UserModel.find({})
    res.json(users)
  })
)

userRouter.get(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request<ParamsDictionary, UserRequestBody>, res: Response) => {
    const user = await UserModel.findById(req.params.id)
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  })
)

userRouter.put(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request<ParamsDictionary, UserRequestBody>, res: Response) => {
    try {
      const user = await UserModel.findById(req.params.id)
      if (!user) {
        return sendErrorResponse(res, 404, 'Utilisateur non trouvé')
      }
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.phoneNumber = req.body.phoneNumber|| user.phoneNumber
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(req.body.password, salt)
      }
      if (req.body.isAdmin !== undefined) {
        user.isAdmin = req.body.isAdmin
      }
      user.addresses = req.body.addresses || user.addresses

      user.paymentCards = req.body.paymentCards || user.paymentCards

      const updatedUser = await user.save()
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        isAdmin: updatedUser.isAdmin,
        addresses: updatedUser.addresses,
        paymentCards: updatedUser.paymentCards,
        token: generateToken(updatedUser),
      })
    } catch (error) {
      sendErrorResponse(res, 500, 'Erreur lors de la mise à jour de l\'utilisateur')
    }
  })
)

userRouter.post(
  '/:id/address/add',
  asyncHandler(async (req: Request<ParamsDictionary, AddressRequestBody>, res: Response) => {
    const user = await UserModel.findById(req.params.id)
    if (user) {
      if (!user.addresses) {
        user.addresses = [];
      }

      const newAddress = new UserAddressModel({
        street: req.body.street,
        city: req.body.city,
        postalCode: req.body.postalCode,
        country: req.body.country,
        isDefault: false
      });

      user.addresses.push(newAddress);
      await user.save();
      res.send({ newAddress: newAddress });
    } else {
      res.status(404).send({ message: 'Utilisateur non trouvé' });
    }
  })
);

userRouter.put(
  '/:id/address/:idAddress/default',
  asyncHandler(async (req: Request<ParamsDictionary, AddressRequestBody>, res: Response) => {
    const user = await UserModel.findById(req.params.id);
    if (user && user.addresses) {
      user.addresses.forEach(addr => {
        addr.isDefault = (addr._id == req.params.idAddress);
      });

      await user.save();
      res.json({ message: 'Default address updated' });
    } else {
      res.status(404).send({ message: 'Utilisateur non trouvé' });
    }
  })
);

userRouter.put(
  '/:id/address/:addressId',
  isAuth,
  asyncHandler(async (req: Request<ParamsDictionary, AddressRequestBody>, res: Response) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      if (!user.addresses) {
        user.addresses = [];
      }

      let addressFound = false;
      const indexAddress = user.addresses.findIndex(addr => addr._id == req.params.addressId);

      if (indexAddress !== -1) {
        addressFound = true;
        const address = user.addresses[indexAddress];
        address.city = req.body.city || address.city;
        address.country = req.body.country || address.country;
        address.postalCode = req.body.postalCode || address.postalCode;
        address.street = req.body.street || address.street;
      }

      if (!addressFound) {
        return sendErrorResponse(res, 400, "Adresse non trouvée");
      }

      const updatedUser = await user.save();
      if (updatedUser.addresses && updatedUser.addresses.length > indexAddress) {
        res.json({ updatedAddress: updatedUser.addresses[indexAddress] });
      } else {
        sendErrorResponse(res, 500, "Erreur lors de la mise à jour de l'adresse");
      }
    } else {
      sendErrorResponse(res, 400, "Utilisateur non trouvé");
    }
  })
);

userRouter.post(
  '/:id/payment/card/add',
  asyncHandler(async (req: Request<ParamsDictionary, PaymentCardRequestBody>, res: Response) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      if (!user.paymentCards) {
        user.paymentCards = [];
      }

      const newCard = new PaymentCardModel({
        bankName: req.body.bankName,
        number: req.body.number,
        fullName: req.body.fullName,
        monthExpiration: req.body.monthExpiration,
        yearExpiration: req.body.yearExpiration,
        isDefault: false
      });

      user.paymentCards.push(newCard);
      await user.save();
      res.send({ newCard: newCard });
    } else {
      res.status(404).send({ message: 'Utilisateur non trouvé' });
    }
  })
);

userRouter.put(
  '/:id/payment/card/:idCard/default',
  asyncHandler(async (req: Request<ParamsDictionary, PaymentCardRequestBody>, res: Response) => {
    const user = await UserModel.findById(req.params.id);
    if (user && user.paymentCards) {
      user.paymentCards.forEach(card => {
        card.isDefault = (card._id == req.params.idCard);
      });

      await user.save();
      res.json({ message: 'Default card updated' });
    } else {
      res.status(404).send({ message: 'Utilisateur non trouvé' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request<ParamsDictionary>, res: Response) => {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id)
      if (!user) {
        return sendErrorResponse(res, 404, 'Utilisateur non trouvé')
      }
      res.json({ message: 'Utilisateur supprimé' })
    } catch (error) {
      sendErrorResponse(res, 500, 'Erreur lors de la suppression de l\'utilisateur')
    }
  })
)

userRouter.post(
  '/signin',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email })
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phoneNumber: user.phoneNumber,
        token: generateToken(user),
      })
    } else {
      sendErrorResponse(res, 401, 'Invalid email or password')
    }
  })
)

userRouter.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      console.log('Received signup request with data:', { name, email });

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        console.log('Email already exists:', email);
        return sendErrorResponse(res, 400, 'Email already exists');
      }
      console.log('Email is unique, proceeding with user creation...');

      console.log('Generating salt for password hashing...');
      const salt = await bcrypt.genSalt(10);
      console.log('Salt generated:', salt);
      const user = new UserModel({
        _id: new ObjectId(),
        name,
        email,
        password: bcrypt.hashSync(password, salt),
        isAdmin: false
      });
      console.log('User object created:', user);

      console.log('Saving user to the database...');
      const newUser = await user.save();
      console.log('User saved successfully:', newUser);
      res.json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: generateToken(newUser),
      });
      console.log('Signup response sent:', {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });
    } catch (error: any) {
      console.error('Error during user creation:', error);
      console.error('Error details:', error.stack);
      sendErrorResponse(res, 500, 'Erreur lors de la création de l\'utilisateur');
      console.log('Error response sent:', 'Erreur lors de la création de l\'utilisateur');
    }
  })
)

userRouter.post(
  '/password-reset-request',
  passwordResetRequestLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email })
      if (!user) {
        return sendErrorResponse(res, 404, 'No account with this email address exists.')
      }
      const { token, jti } = generatePasswordResetToken(user)
      user.passwordResetTokenJti = jti
      await user.save()
      await sendPasswordResetEmail(user, token)
      res.status(200).send({ message: 'Password reset email sent.' })
    } catch (error) {
      sendErrorResponse(res, 500, 'Error sending password reset email.')
    }
  })
)

userRouter.post(
  '/password-reset',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body
      if (!token || !newPassword) {
        return sendErrorResponse(res, 400, 'Token and new password must be provided')
      }
      if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined')
      interface DecodedToken {
        _id: string;
        email: string;
        jti?: string;
      }

      const decoded: DecodedToken = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
      const user = await UserModel.findOne({
        _id: decoded._id,
        email: decoded.email,
      })
      if (!user || user.passwordResetTokenJti !== decoded.jti) {
        return sendErrorResponse(res, 401, 'Invalid or expired token')
      }
      const salt = await bcrypt.genSalt(10)
      user.password = bcrypt.hashSync(newPassword, salt)
      user.passwordResetTokenJti = undefined
      await user.save()
      res.send({ message: 'Password reset successful' })
    } catch (error) {
      sendErrorResponse(res, 500, 'Error resetting password')
    }
  })
)
