/**
 * J'ai choisi d'utiliser Express et Typegoose pour construire cette API REST car ils offrent une excellente compatibilité avec TypeScript.
 * Ce fichier, 'seedRouter.ts', est utilisé pour peupler la base de données avec des données d'échantillon pour les produits et les utilisateurs.
 * Il contient une seule route 'GET /' qui supprime toutes les données existantes et insère les données d'échantillon dans la base de données.
 */

import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel } from '../models/product'
import { UserModel } from '../models/user'
import { sampleProducts } from '../data'
import { sampleUsers } from '../data'

export const seedRouter = express.Router()

seedRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    await ProductModel.deleteMany({})
    const createdProducts = await ProductModel.insertMany(sampleProducts)

    await UserModel.deleteMany({})
    const createdUsers = await UserModel.insertMany(sampleUsers)
    res.json({ createdProducts, createdUsers })
  })
)
