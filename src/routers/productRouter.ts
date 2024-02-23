/**
 * J'ai choisi d'utiliser Express et Typegoose pour construire cette API REST car ils offrent une excellente compatibilité avec TypeScript.
 * Ce fichier, 'productRouter.ts', gère les routes pour les produits. Il contient deux routes principales : une pour obtenir tous les produits et une autre pour obtenir un produit spécifique par son slug.
 * La route 'GET /' renvoie tous les produits.
 * La route 'GET /slug/:slug' renvoie les détails d'un produit spécifique.
 */

import express, { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel } from '../models/product'
import { CategoryModel } from '../models/category'
import { isAuth, isAdmin } from '../utils'
import { Types } from 'mongoose'

const productRouter = express.Router()

productRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductModel.find()
    res.json(products)
  })
)

productRouter.get(
  '/slug/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findOne({ slug: req.params.slug })
    product
      ? res.json(product)
      : res.status(404).json({ message: 'Product not found' })
  })
)

productRouter.post(
  '/search',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      searchText,
      minPrice,
      maxPrice,
      categories,
      inStock,
      materials,
      sortBy,
      sortOrder,
    } = req.body;

    let searchStage = searchText ? {
      $search: {
        index: 'searchIndex',
        compound: {
          should: [
            {
              text: {
                query: searchText,
                path: ['name', 'description'],
                score: { boost: { value: 4 } },
              },
            },
            {
              text: {
                query: searchText,
                path: ['name', 'description'],
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 0,
                },
                score: { boost: { value: 3 } },
              },
            },
            {
              text: {
                query: searchText,
                path: ['name', 'description'],
                fuzzy: {
                  maxEdits: 2,
                  prefixLength: 3,
                },
                score: { boost: { value: 1 } },
              },
            },
          ],
        },
      },
    } : {};

    let matchStage = {
      $match: {
        ...(minPrice && { price: { $gte: Number(minPrice) } }),
        ...(maxPrice && { price: { $lte: Number(maxPrice) } }),
        ...(categories && { 'category.name': { $in: categories } }),
        ...(inStock && { 'stock.quantity': { $gt: 0 } }),
        ...(materials && { materials: { $in: materials } }),
      },
    };

    let sortStage = sortBy ? {
      $sort: {
        ...(sortBy === 'price' && { price: sortOrder === 'asc' ? 1 : -1 }),
        ...(sortBy === 'dateAdded' && { createdAt: sortOrder === 'asc' ? 1 : -1 }),
        ...(sortBy === 'inStock' && { 'stock.quantity': sortOrder === 'asc' ? 1 : -1 }),
      },
    } : {};

    const pipeline = [
      ...(Object.keys(searchStage).length ? [searchStage] : []),
      matchStage,
      ...(Object.keys(sortStage).length ? [sortStage] : []),
      { $limit: 10 },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          URLimage: 1,
          stock: 1,
        },
      },
    ];

    const results = await ProductModel.aggregate(pipeline as any[]).exec();
    res.json(results);
  })
);

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const {
        name,
        slug,
        URLimage,
        categoryId,
        description,
        materials,
        price,
        priority,
      } = req.body
      const category = await CategoryModel.findById(categoryId)
      if (!category) {
        res.status(500).json('Category does not exist')
        return
      }

      const newProduct = new ProductModel({
        name,
        slug,
        URLimage,
        category,
        description,
        materials,
        price,
        priority,
      })
      const savedProduct = await newProduct.save()
      res.status(201).json(savedProduct)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error on product creation' })
    }
  })
)

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id
    const deletionFilter = { _id: new Types.ObjectId(id) }
    try {
      const result = await ProductModel.deleteOne(deletionFilter)
      result.deletedCount > 0
        ? res.json({ message: 'Product deleted successfully.' })
        : res.status(500).json({ error: 'Product not found.' })
    } catch (error) {
      console.error('Error :', error)
      res.status(500).json({ error: 'Delete error.' })
    }
  })
)

productRouter.put(
  '/:productId',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId
    const newData = req.body
    try {
      const result = await ProductModel.updateOne(
        { _id: productId },
        { $set: newData }
      )
      if (result.matchedCount === 0) {
        res.status(500).json({ error: 'No product found' })
      } else if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Update succeeded' })
      } else {
        res.status(500).json({ error: 'Update error' })
      }
    } catch (error) {
      console.error('error :', error)
      next(error)
    }
  })
)

export { productRouter }
