import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { ShippingAdressModel } from "../models/shippingAdress";
import { isAuth } from '../utils';

export const shippingAdressRouter = express.Router();

shippingAdressRouter.get(
  "/",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return; // Exit the function after sending the response
    }
    const userShippingAdresses = await ShippingAdressModel.find({ user: req.user._id }).exec(); // Filter by user ID
    res.json(userShippingAdresses);
    // No need to return anything here
  })
);

shippingAdressRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const shippingAdress = await ShippingAdressModel.findById(id).exec();
    shippingAdress
      ? res.json(shippingAdress)
      : res.status(404).json({ error: "Shipping adress not found" });
  })
);

shippingAdressRouter.post(
  "/",
  isAuth,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return; // Exit the function after sending the response
    }
    const newShippingAdress = new ShippingAdressModel({
      ...req.body,
      user: req.user._id, // Assuming req.user contains the authenticated user's info
    });
    const savedShippingAdress = await newShippingAdress.save();
    res.status(201).json(savedShippingAdress);
    // No need to return anything here
  })
);

shippingAdressRouter.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const newData = req.body;
    const result = await ShippingAdressModel.updateOne({ _id: id }, { $set: newData }).exec();
    result.modifiedCount > 0
      ? res.json({ message: "Update succeeded" })
      : res.status(404).json({ error: "No shipping adress found" });
  })
);