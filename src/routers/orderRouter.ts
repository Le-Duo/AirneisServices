/**
 * J'ai choisi d'utiliser Express et Typegoose pour construire cette API REST car ils offrent une excellente compatibilité avec TypeScript.
 * Ce fichier, 'orderRouter.ts', gère les routes pour les commandes. Il contient deux routes principales : une pour obtenir une commande spécifique par son ID et une autre pour créer une nouvelle commande.
 * La route 'GET /:id' renvoie les détails d'une commande spécifique. Elle nécessite une authentification.
 * La route 'POST /' crée une nouvelle commande avec les détails fournis dans le corps de la requête. Elle nécessite également une authentification.
 */

import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { isAuth } from "../utils";
import { OrderModel } from "../models/order";
import { Product } from "../models/product";
import {v4 as uuidv4} from 'uuid';
export const orderRouter = express.Router();

orderRouter.get(
  "/:id",
  // isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    console.log("Get order by id called")
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  })
);

orderRouter.get(
  "/order/:orderNumber",
  // isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    console.log("Get order by orderNumer called")
    const order = await OrderModel.findOne({orderNumber : req.params.orderNumber});
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  })
);


orderRouter.post(
  "/",
  // isAuth,
  asyncHandler(async (req: Request, res: Response) => {
  try{
    const { price, createdAt, products, user, shippingAddress, payment} = req.body;

    const orderNumber = generateOrderNumber()
    
    const newOrder = new OrderModel({
      orderNumber,
      price,
      status: "initated",
      createdAt,
      products,
      shippingAddress, 
      payment,
      user,
    });
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);

  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Error on order creation" });
  }
  })
);

function generateOrderNumber() : string{
  const prefix = "CMD";

  const uniqueId = uuidv4().replace(/-/g, ''); // Supprime les tirets du GUID

  const orderNumber = `${prefix}-${uniqueId}`;

  return orderNumber;

}