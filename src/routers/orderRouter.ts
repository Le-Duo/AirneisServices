/**
 * J'ai choisi d'utiliser Express et Typegoose pour construire cette API REST car ils offrent une excellente compatibilité avec TypeScript.
 * Ce fichier, 'orderRouter.ts', gère les routes pour les commandes. Il contient deux routes principales : une pour obtenir une commande spécifique par son ID et une autre pour créer une nouvelle commande.
 * La route 'GET /:id' renvoie les détails d'une commande spécifique. Elle nécessite une authentification.
 * La route 'POST /' crée une nouvelle commande avec les détails fournis dans le corps de la requête. Elle nécessite également une authentification.
 */

import express, { Request, Response } from 'express'
import asynchandler from 'express-async-handler'
import { isAuth } from '../utils'
import { OrderModel } from '../models/order'
import { Product } from '../models/product'
export const orderRouter = express.Router()

orderRouter.get(
  '/:id',
  isAuth,
  asynchandler(async (req: Request, res: Response) => {
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
  asynchandler(async (req: Request, res: Response) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' })
    } else {
      const createOrder = await OrderModel.create({
        orderItems: req.body.orderItems.map((x: Product) => ({
          ...x,
          product: x._id,
        })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      })
      res.status(201).send({ message: 'Order Created', order: createOrder })
    }
  })
)
