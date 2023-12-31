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
  "/initialize",
  // isAuth,
  asyncHandler(async (req: Request, res: Response) => {
  try{
    const { price, createdAt, products, user, shippingAddress} = req.body;

    const orderNumber = generateOrderNumber()
    
    const newOrder = new OrderModel({
      orderNumber,
      price,
      status: "initated",
      createdAt,
      products,
      shippingAddress, 
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

/*
  Pour le update, une fois l'ordre créer en initiated, on s'attend
  à un paiement valide.
  Quand le paiement est fait, l'ordre sera mis à jour avec la référence de paiement
  et son status changera en "pending".
  Si le paiement est refusé, l'ordre sera mis à jour avec le status
  "cancelled" et la référence du paiement échouée
*/
orderRouter.put(
  "/:ordernumber",
  asyncHandler(async (req, res) => {
    const ordernumber = req.params.ordernumber;
    const newData = req.body;
    newData.updatedAt = Date.now()

    try {
      const result = await OrderModel.updateOne(
        { orderNumber: ordernumber },
        { $set: newData }
      );

      if (result.matchedCount == 0) {
        res.status(500).json({ error: "No order found" });
      }
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "update succeeded" });
      }

      res.status(500).json({ error: "Update error" });
    } catch (erreur) {
      console.error("error :", erreur);
      res.status(500).json({ error: "Update  error" });
    }
  })
);

function generateOrderNumber() : string{
  const prefix = "CMD";

  const uniqueId = uuidv4().replace(/-/g, ''); // Supprime les tirets du GUID

  const orderNumber = `${prefix}-${uniqueId}`;

  return orderNumber;

}