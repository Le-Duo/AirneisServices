/**
 * J'ai choisi d'utiliser Express, Typegoose et bcryptjs pour construire cette API REST car ils offrent une excellente compatibilité avec TypeScript.
 * Ce fichier, 'userRouter.ts', gère les routes pour les utilisateurs. Il contient deux routes principales : une pour la connexion des utilisateurs et une autre pour l'inscription des utilisateurs.
 * La route 'POST /signin' permet aux utilisateurs de se connecter en utilisant leur email et leur mot de passe. Si les informations sont correctes, un token est généré et renvoyé avec les informations de l'utilisateur.
 * La route 'POST /signup' permet aux nouveaux utilisateurs de s'inscrire en fournissant leur nom, email et mot de passe. Un nouveau utilisateur est créé dans la base de données et un token est généré et renvoyé avec les informations de l'utilisateur.
 */
import express, { Request, Response } from "express";
import { User, UserModel } from "../models/user";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  generateToken,
  generatePasswordResetToken,
  sendPasswordResetEmail,
} from "../utils";
import rateLimit from "express-rate-limit";
import { ParamsDictionary } from "express-serve-static-core";
import dotenv from "dotenv";
import {isAdmin, isAuth} from "../utils";

dotenv.config();

export const userRouter = express.Router();

const passwordResetRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "Too many password reset requests from this IP, please try again after 15 minutes.",
});

interface UserRequestBody {
  name?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
}

const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string
) => {
  res.status(statusCode).send({ message });
};

userRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const users = await UserModel.find({});
    res.json(users);
  })
);

userRouter.put(
  "/:id",
  isAdmin,
  isAuth,
  asyncHandler(
    async (req: Request<ParamsDictionary, UserRequestBody>, res: Response) => {
      try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
          return sendErrorResponse(res, 404, "Utilisateur non trouvé");
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(req.body.password, salt);
        }
        if (req.body.isAdmin !== undefined) {
          user.isAdmin = req.body.isAdmin;
        }
        const updatedUser = await user.save();
        res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser),
        });
      } catch (error) {
        sendErrorResponse(
          res,
          500,
          "Erreur lors de la mise à jour de l’utilisateur"
        );
      }
    }
  )
);

userRouter.delete(
  "/:id",
  asyncHandler(async (req: Request<ParamsDictionary>, res: Response) => {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      if (!user) {
        return sendErrorResponse(res, 404, "Utilisateur non trouvé");
      }
      res.json({ message: "Utilisateur supprimé" });
    } catch (error) {
      sendErrorResponse(
        res,
        500,
        "Erreur lors de la suppression de l’utilisateur"
      );
    }
  })
);

userRouter.post(
  "/signin",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
    } else {
      sendErrorResponse(res, 401, "Invalid email or password");
    }
  })
);

userRouter.post(
  "/signup",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
      });
      const newUser = await user.save();
      res.json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: generateToken(newUser),
      });
    } catch (error) {
      sendErrorResponse(
        res,
        500,
        "Erreur lors de la création de l’utilisateur"
      );
    }
  })
);

userRouter.post(
  "/password-reset-request",
  passwordResetRequestLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return sendErrorResponse(
          res,
          404,
          "No account with this email address exists."
        );
      }
      const { token, jti } = generatePasswordResetToken(user);
      user.passwordResetTokenJti = jti;
      await user.save();
      await sendPasswordResetEmail(user, token);
      res.status(200).send({ message: "Password reset email sent." });
    } catch (error) {
      sendErrorResponse(res, 500, "Error sending password reset email.");
    }
  })
);

userRouter.post(
  "/password-reset",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return sendErrorResponse(
          res,
          400,
          "Token and new password must be provided"
        );
      }
      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findOne({
        _id: decoded._id,
        email: decoded.email,
      });
      if (!user || user.passwordResetTokenJti !== decoded.jti) {
        return sendErrorResponse(res, 401, "Invalid or expired token");
      }
      const salt = await bcrypt.genSalt(10);
      user.password = bcrypt.hashSync(newPassword, salt);
      user.passwordResetTokenJti = undefined;
      await user.save();
      res.send({ message: "Password reset successful" });
    } catch (error) {
      sendErrorResponse(res, 500, "Error resetting password");
    }
  })
);
