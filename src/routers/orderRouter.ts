/**
 * J'ai choisi d'utiliser Express et Typegoose pour construire cette API REST car ils offrent une excellente compatibilité avec TypeScript.
 * Ce fichier, 'orderRouter.ts', gère les routes pour les commandes. Il contient deux routes principales : une pour obtenir une commande spécifique par son ID et une autre pour créer une nouvelle commande.
 * La route 'GET /:id' renvoie les détails d'une commande spécifique. Elle nécessite une authentification.
 * La route 'POST /' crée une nouvelle commande avec les détails fournis dans le corps de la requête. Elle nécessite également une authentification.
 */

import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { isAuth } from '../utils'
import { OrderModel, ShippingAddress } from '../models/order'
import { StockModel } from '../models/stock'
import { v4 as uuidv4 } from 'uuid'
import { Item } from '../models/order'
export const orderRouter = express.Router()

orderRouter.get(
  '/',
  // isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({}).populate('user', 'name')
    res.json(orders)
  })
)

orderRouter.get(
  '/mine',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' })
      return
    }
    const orders = await OrderModel.find({ user: req.user._id })
    res.send(orders)
  })
)

orderRouter.get(
  '/:id',
  // isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    console.log('Get order by id called')
    const order = await OrderModel.findById(req.params.id)
    if (order) {
      res.json(order)
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  })
)

orderRouter.get(
  '/order/:orderNumber',
  // isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    console.log('Get order by orderNumb er called')
    const order = await OrderModel.findOne({
      orderNumber: req.params.orderNumber,
    })
    if (order) {
      res.json(order)
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  })
)

function calculateShippingPrice(itemsPrice: number): number {
  if (itemsPrice < 400) {
    return 39
  } else if (itemsPrice >= 400 && itemsPrice <= 1000) {
    return 59
  } else if (itemsPrice > 1000) {
    return 109
  }
  return 0
}

orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const {
        user,
        shippingAddress,
        paymentMethod,
        orderItems,
        isPaid,
        isDelivered,
      }: {
        user: string
        shippingAddress: ShippingAddress
        paymentMethod: string
        orderItems: Item[]
        isPaid: boolean
        isDelivered: boolean
      } = req.body

      if (
        !Array.isArray(orderItems) ||
        !orderItems.every(item => typeof item === 'object' && 'quantity' in item && 'price' in item)
      ) {
        res.status(400).json({ error: 'Invalid orderItems format' })
        return
      }

      const itemsPrice = orderItems.reduce((acc: number, item: Item) => {
        const quantity = typeof item.quantity === 'number' ? item.quantity : 0
        const price = typeof item.price === 'number' ? item.price : 0

        return acc + quantity * price
      }, 0)

      const shippingPrice = calculateShippingPrice(itemsPrice)
      const taxPrice = itemsPrice * 0.2
      const totalPrice = itemsPrice + shippingPrice + taxPrice

      const orderNumber = generateOrderNumber()

      const newOrder = new OrderModel({
        orderNumber,
        user,
        shippingAddress,
        paymentMethod,
        orderItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        isPaid,
        isDelivered,
        status: 'initiated',
      })

      // Deduct stock
      for (const item of orderItems) {
        await StockModel.findOneAndUpdate(
          { 'product._id': item.product },
          {
            $inc: { quantity: -item.quantity },
          }
        )
      }

      const savedOrder = await newOrder.save()
      res.status(201).json(savedOrder)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error on order creation' })
    }
  })
)

/*
  Pour le update, une fois l'ordre créer en initiated, on s'attend
  à un paiement valide.
  Quand le paiement est fait, l'ordre sera mis à jour avec la référence de paiement
  et son status changera en "pending".
  Si le paiement est refusé, l'ordre sera mis à jour avec le status
  "cancelled" et la référence du paiement échouée
*/
orderRouter.put(
  '/:ordernumber',
  asyncHandler(async (req, res) => {
    const ordernumber = req.params.ordernumber
    const newData = req.body
    newData.updatedAt = Date.now()

    try {
      const result = await OrderModel.updateOne({ orderNumber: ordernumber }, { $set: newData })

      if (result.matchedCount == 0) {
        res.status(500).json({ error: 'No order found' })
      }
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'update succeeded' })
      }

      res.status(500).json({ error: 'Update error' })
    } catch (erreur) {
      console.error('error :', erreur)
      res.status(500).json({ error: 'Update  error' })
    }
  })
)

orderRouter.delete(
  '/:id',
  // isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id
    const deletedOrder = await OrderModel.findByIdAndDelete(orderId)
    if (deletedOrder) {
      res.json(deletedOrder)
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  })
)

function generateOrderNumber(): string {
  const prefix = 'CMD'

  const uniqueId = uuidv4().replace(/-/g, '')

  const orderNumber = `${prefix}-${uniqueId}`

  return orderNumber
}
