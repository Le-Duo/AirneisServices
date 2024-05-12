import express, { Request, Response } from 'express'
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
    console.log(`Fetching stock for product ID: ${productId}`) // Added log as per instruction
    const stock = await StockModel.findOne({ 'product._id': productId }).exec()
    if (stock) {
      console.log(`Stock found for product ID: ${productId}`) // Log on successful find
      res.json(stock)
    } else {
      console.log(`Stock not found for product ID: ${productId}`) // Log on failure to find stock
      res.status(404).json({ error: 'Stock not found for the product' })
    }
  })
)

stockRouter.post(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId, quantity } = req.body
    // Check if stock already exists for the product
    const existingStock = await StockModel.findOne({ 'product._id': productId }).exec()
    if (existingStock) {
      // Update existing stock entry's quantity
      await StockModel.updateOne({ 'product._id': productId }, { $set: { quantity } }).exec()
      res.status(200).json({ message: 'Stock updated' })
    } else {
      // If no existing stock, proceed to find the product
      const product = await ProductModel.findById(productId).exec()
      if (!product) {
        res.status(404).json({ error: 'Product does not exist' })
      } else {
        // Create new stock entry since product exists and no stock entry exists
        const newStock = await StockModel.create({ product, quantity })
        res.status(201).json(newStock)
      }
    }
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

stockRouter.delete(
  '/products/:productId',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    const result = await StockModel.deleteOne({ 'product._id': productId }).exec()
    result.deletedCount > 0
      ? res.json({ message: 'Delete succeeded' })
      : res.status(404).json({ error: 'No stock found' })
  })
)
