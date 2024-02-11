import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { isAuth } from '../utils'
import { OrderModel } from '../models/order'
import { Product } from '../models/product'
export const orderRouter = express.Router()

orderRouter.get(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({}).populate('user', 'name')
    res.json(orders)
  })
)

orderRouter.get(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    if (order) {
      res.json(order)
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  })
)

orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body
    const user = req.user // Correctly define the user from the request object
    if (!orderItems || orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' })
    } else {
      const createOrder = await OrderModel.create({
        orderItems: orderItems.map((x: Product) => ({
          ...x,
          product: x._id,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        user: user?._id, // Use the user ID from the defined user object
      })
      res.status(201).send({ message: 'Order Created', order: createOrder })
    }
  })
)

orderRouter.put(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const order = await OrderModel.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    if (order) {
      res.json(order)
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

orderRouter.delete(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const order = await OrderModel.findByIdAndDelete(id)
    if (order) {
      res.status(204).send()
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)
