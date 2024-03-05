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
import { StockModel } from '../models/stock'
import { isAuth, isAdmin } from '../utils'
import { Types } from 'mongoose'

const productRouter = express.Router()

productRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductModel.find().sort({
      'stock.quantity': 1, // Tri décroissant par quantité en stock (les produits épuisés apparaissent en dernier)
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
  '/id/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.json(product);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching product by ID' });
    }
  })
);

productRouter.get(
  '/search',
  asyncHandler(async (req: Request, res: Response) => {
    console.log('Starting search operation')

    // Extract query parameters for search criteria
    const { searchText, categories, inStock, materials, minPrice, maxPrice, sortBy, sortOrder } = req.query
    console.log('Extracted query parameters', req.query)

    // Convert inStock query parameter to boolean
    const inStockBool = inStock !== undefined && inStock !== 'false'
    console.log('Converted inStock to boolean:', inStockBool)

    // Convert minPrice and maxPrice to numbers
    const minPriceNumber = minPrice ? Number(minPrice) : undefined;
    const maxPriceNumber = maxPrice ? Number(maxPrice) : undefined;
    console.log('Processed price range. Min:', minPriceNumber, 'Max:', maxPriceNumber)

    // Retrieve product IDs that are in stock if inStockBool is true
    let productIdsInStockObjectIds: Types.ObjectId[] = []
    if (inStockBool) {
      console.log('Retrieving in-stock product IDs')
      const stockInfo = await StockModel.find({ quantity: { $gt: 0 } }).exec()
      const productIdsInStock = stockInfo.map(stock => stock.product._id.toString())
      productIdsInStockObjectIds = productIdsInStock.map(id => new Types.ObjectId(id))
      console.log('Retrieved product IDs in stock:', productIdsInStock)

      // Convert productIdsInStock to ObjectId instances
      console.log('Converted product IDs to ObjectId instances:', productIdsInStockObjectIds)
    } else {
      console.log('In-stock filter not applied or all products are considered.')
    }

    console.log('Processed price range. Min:', minPriceNumber, 'Max:', maxPriceNumber)

    if (minPriceNumber !== undefined || maxPriceNumber !== undefined) {
      console.log('Price range provided:', minPriceNumber, 'to', maxPriceNumber)
    } else {
      console.log('No specific price range provided.')
    }

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
    console.log('Defined search stage:', searchStage)

    if (Object.keys(searchStage).length > 0) {
      console.log('Search text provided, applying search stage.')
    } else {
      console.log('No search text provided, skipping search stage.')
    }

    // Define lookup stage to join with stock information
    let lookupStage = {
      $lookup: {
        from: 'stock',
        localField: '_id',
        foreignField: 'product._id',
        as: 'stockInfo',
      },
    }
    console.log('Defined lookup stage')

    // Define match stage to filter results based on query parameters
    let matchStage = {
      $match: {
        ...((minPriceNumber !== undefined || maxPriceNumber !== undefined) && {
          price: {
            ...(minPriceNumber !== undefined && { $gte: minPriceNumber }),
            ...(maxPriceNumber !== undefined && { $lte: maxPriceNumber }),
          },
        }),
        ...(categories && {
          'category.name': {
            $in: typeof categories === 'string' ? categories.split(',') : categories,
          },
        }),
        ...(inStockBool && { _id: { $in: productIdsInStockObjectIds } }), // Use ObjectId instances for matching
        ...(materials && {
          materials: {
            $in: typeof materials === 'string' ? materials.split(',') : materials,
          },
        }),
      },
    }
    console.log('Defined match stage:', matchStage)

    // Define sort stage based on sortBy and sortOrder query parameters
    let sortStage = sortBy
      ? {
          $sort: {
            ...(sortBy === 'price' && {
              price: sortOrder === 'asc' ? 1 : sortOrder === 'desc' ? -1 : 0,
            }),
            ...(sortBy === 'dateAdded' && {
              createdAt: sortOrder === 'asc' ? 1 : sortOrder === 'desc' ? -1 : 0,
            }),
            ...(sortBy === 'inStock' && {
              'stockInfo.quantity': sortOrder === 'asc' ? 1 : sortOrder === 'desc' ? -1 : 0,
            }),
          },
        }
      : {}
    console.log('Defined sort stage:', sortStage)

    if (Object.keys(sortStage).length > 0) {
      console.log('Sort criteria provided, applying sort stage.')
    } else {
      console.log('No sort criteria provided, skipping sort stage.')
    }

    // Compile the aggregation pipeline stages
    const pipeline = [
      ...(Object.keys(searchStage).length > 0 ? [searchStage] : []),
      lookupStage,
      ...(Object.keys(matchStage.$match).length > 0 ? [matchStage] : []),
      ...(Object.keys(sortStage).length > 0 ? [sortStage] : []),
      { $limit: 10 },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          URLimage: 1,
          quantity: { $arrayElemAt: ['$stockInfo.quantity', 0] },
        },
      },
    ]
    console.log('Compiled aggregation pipeline:', pipeline)

    // Execute the aggregation pipeline
    console.log('Executing aggregation pipeline')
    const results = await ProductModel.aggregate(pipeline as any[]).exec()
    console.log('Aggregation pipeline executed. Results:', results)

    // Return the search results
    res.json(results)
  })
)

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { name, slug, URLimage, categoryId, description, materials, price, priority, _id } = req.body
      const category = await CategoryModel.findById(categoryId)
      if (!category) {
        res.status(500).json('Category does not exist')
        return
      }

      const newProduct = new ProductModel({
        _id,
        name,
        slug,
        URLimage,
        category: category, //cast la variable category en type "Category"
        description,
        materials,
        price,
        priority,
      })
      const savedProduct = await newProduct.save()

      // After successfully saving the product, create a stock entry with default quantity (e.g., 0)
      const newStock = new StockModel({
        product: savedProduct, // Reference the newly created product
        quantity: 0, // Default quantity, adjust as needed
      });
      await newStock.save();

      // Respond with the saved product (and optionally the stock information)
      res.status(201).json({ product: savedProduct, stock: newStock });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error on product creation' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const deletionFilter = { _id: new Types.ObjectId(id) };
    try {
      // First, delete the product
      const productDeletionResult = await ProductModel.deleteOne(deletionFilter);
      if (productDeletionResult.deletedCount > 0) {
        // If the product was successfully deleted, delete the associated stock
        const stockDeletionResult = await StockModel.deleteOne({ 'product._id': id });
        if (stockDeletionResult.deletedCount > 0) {
          res.json({ message: 'Product and associated stock deleted successfully.' });
        } else {
          // If no stock was found (or deleted), you might want to log this or handle it differently
          res.json({ message: 'Product deleted successfully, but no associated stock was found.' });
        }
      } else {
        res.status(404).json({ error: 'Product not found.' });
      }
    } catch (error) {
      console.error('Error :', error);
      res.status(500).json({ error: 'Delete error.' });
    }
  })
);

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
