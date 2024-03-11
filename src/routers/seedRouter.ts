/**
 * J'ai choisi d'utiliser Express et Typegoose pour construire cette API REST car ils offrent une excellente compatibilité avec TypeScript.
 * Ce fichier, 'seedRouter.ts', est utilisé pour peupler la base de données avec des données d'échantillon pour les produits et les utilisateurs.
 * Il contient une seule route 'GET /' qui supprime toutes les données existantes et insère les données d'échantillon dans la base de données.
 */

import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel } from '../models/product'
import { UserModel } from '../models/user'
import { CategoryModel } from '../models/category'
import { CarouselItemModel } from '../models/carouselItem'
import { StockModel } from '../models/stock'
import { sampleProducts } from '../data'
import { sampleUsers } from '../data'
import { sampleCategories } from '../data'
import { sampleCarouselItems } from '../data'
import { sampleStocks } from '../data'

export const seedRouter = express.Router()

seedRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    // Supprimez toutes les données existantes
    await ProductModel.deleteMany({});
    await UserModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await CarouselItemModel.deleteMany({}); // Ajout pour supprimer les éléments existants du carrousel
    await StockModel.deleteMany({}); // Ajout pour supprimer les stocks existants

    // Insérez d'abord les catégories
    const createdCategories = await CategoryModel.insertMany(sampleCategories);

    // Ensuite, mettez à jour les produits avec les catégories créées
    const updatedSampleProducts = sampleProducts.map(product => {
      const categoryDoc = createdCategories.find(c => c.name === product.category.name);
      if (!categoryDoc) {
        throw new Error(`Category ${product.category.name} not found`);
      }
      return { ...product, category: categoryDoc };
    });

    // Insérez les produits mis à jour
    const createdProducts = await ProductModel.insertMany(updatedSampleProducts);

    // Insérez les utilisateurs
    const createdUsers = await UserModel.insertMany(sampleUsers);

    // Insérez les éléments du carrousel
    const createdCarouselItems = await CarouselItemModel.insertMany(sampleCarouselItems);

    // Pour les stocks, mettez à jour les références de produits avec les produits créés
    const updatedSampleStocks = sampleStocks.map(stock => {
      const productDoc = createdProducts.find(p => p.slug === stock.product.slug);
      if (!productDoc) {
        throw new Error(`Product ${stock.product.slug} not found`);
      }
      return { ...stock, product: productDoc };
    });

    // Insérez les stocks mis à jour
    const createdStocks = await StockModel.insertMany(updatedSampleStocks);

    // Envoyez la réponse avec toutes les données créées
    res.json({ createdCategories, createdProducts, createdUsers, createdCarouselItems, createdStocks });
  })
);
