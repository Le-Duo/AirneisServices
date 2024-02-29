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
    const products = await ProductModel.find().sort({
      priority: -1, // Tri décroissant par priorité (les produits avec une priorité élevée apparaissent en premier)
    })
    res.json(products)
  })
)

// Middleware to validate slug format
const validateSlugFormat = (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params
  // Regex for validating slug format: lowercase letters, numbers, and hyphens
  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

  if (!regex.test(slug)) {
    res.status(400).json({ message: 'Invalid slug format' })
    return
  }

  next()
}

productRouter.get(
  '/slug/:slug',
  validateSlugFormat,
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findOne({ slug: req.params.slug })
    product ? res.json(product) : res.status(404).json({ message: 'Product not found' })
  })
)

productRouter.get(
  '/search',
  asyncHandler(async (req: Request, res: Response) => {
    const { searchText, price, categories, materials, sortBy, sortOrder, inStock } = req.query

    console.log('Search Query Params:', req.query)

    const priceRange = price ? price.toString().split('-') : []
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined

    console.log('Converted minPrice:', minPrice, 'maxPrice:', maxPrice)

    let searchStage = searchText
      ? {
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
        }
      : {}

    let matchStage = {
      $match: {
        ...((price !== undefined || minPrice !== undefined || maxPrice !== undefined) && {
          price: {
            ...(minPrice !== undefined && { $gte: minPrice }),
            ...(maxPrice !== undefined && { $lte: maxPrice }),
          },
        }),
        ...(categories && {
          'category.name': {
            $in: typeof categories === 'string' ? categories.split(',') : categories,
          },
        }),
        ...(materials && {
          materials: {
            $in: typeof materials === 'string' ? materials.split(',') : materials,
          },
        }),
      },
    }

    let sortStage = sortBy
      ? {
          $sort: {
            ...(sortBy === 'price' && {
              price: sortOrder === 'asc' ? 1 : sortOrder === 'desc' ? -1 : 0,
            }),
            ...(sortBy === 'dateAdded' && {
              createdAt: sortOrder === 'asc' ? 1 : sortOrder === 'desc' ? -1 : 0,
            }),
          },
        }
      : {}

    console.log('sortStage:', sortStage)

    const inStockBool = inStock === 'true'

    const pipeline = [
      ...(Object.keys(searchStage).length ? [searchStage] : []),
      {
        $lookup: {
          from: 'stock', // Assuming 'stock' is the name of the collection for stock items
          localField: '_id',
          foreignField: 'product._id',
          as: 'stockInfo',
        },
      },
      {
        $addFields: {
          stock: { $sum: "$stockInfo.quantity" } // Sum up the quantities from stockInfo array
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          URLimage: 1,
          stock: 1, // Include the new 'stock' field
        },
      },
      {
        $match: {
          ...matchStage.$match, // Keep existing match conditions
          $expr: inStockBool
            ? { $gt: ['$stock', 0] } // In stock: stock > 0
            : { $lte: ['$stock', 0] }, // Out of stock: stock <= 0
        },
      },
      ...(Object.keys(sortStage).length ? [sortStage] : []),
      { $limit: 10 },
    ]

    console.log('Aggregation Pipeline:', JSON.stringify(pipeline, null, 2))

    const results = await ProductModel.aggregate(pipeline as any[]).exec()
    console.log('Number of Products Found:', results.length)
    res.json(results)
  })
)

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { name, slug, URLimage, categoryId, description, materials, price, priority } = req.body
      const category = await CategoryModel.findById(categoryId)
      if (!category) {
        res.status(500).json('Category does not exist')
        return
      }

      const newProduct = new ProductModel({
        name,
        slug,
        URLimage,
        category: category,
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
      const result = await ProductModel.updateOne({ _id: productId }, { $set: newData })
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

