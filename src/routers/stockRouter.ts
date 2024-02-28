import express, { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import { StockModel } from '../models/stock'
import { ProductModel } from '../models/product'
import { isAuth, isAdmin } from '../utils'

export const stockRouter = express.Router()

stockRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const allStock = await StockModel.find().exec()
    res.json(allStock)
  })
)

stockRouter.get(
  '/products/:productId',
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    const stock = await StockModel.findOne({ 'product._id': productId }).exec()
    stock ? res.json(stock) : res.status(404).json({ error: 'Stock not found for the product' })
  })
)

stockRouter.post(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body
    // Check if stock already exists for the product
    const existingStock = await StockModel.findOne({ 'product._id': productId }).exec()
    if (existingStock) {
      // If stock already exists, return a 400 Bad Request response
      res.status(400).json({ error: 'Stock already exists for this product' })
    }
    // If no existing stock, proceed to find the product
    const product = await ProductModel.findById(productId).exec()
    if (!product) {
      // If product does not exist, return a 404 Not Found response
      res.status(404).json({ error: 'Product does not exist' })
      ;('')
    }
    // Create new stock entry since product exists and no stock entry exists
    const newStock = await StockModel.create({ product, quantity })
    // Return the newly created stock entry with a 201 Created response
    res.status(201).json(newStock)
  })
)

stockRouter.put(
  '/products/:productId',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    const newData = req.body
    const result = await StockModel.updateOne(
      { 'product._id': productId },
      { $set: newData }
    ).exec()
    result.modifiedCount > 0
      ? res.json({ message: 'Update succeeded' })
      : res.status(404).json({ error: 'No stock found' })
  })
)
