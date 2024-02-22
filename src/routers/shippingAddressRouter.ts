import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { ShippingAddressModel } from "../models/shippingAddress";
import { isAuth } from '../utils';

export const shippingAddressRouter = express.Router();

shippingAddressRouter.get(
  "/",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return; // Exit the function after sending the response
    }
    const userShippingAddresses = await ShippingAddressModel.find({ user: req.user._id }).exec(); // Filter by user ID
    res.json(userShippingAddresses);
    // No need to return anything here
  })
);

shippingAddressRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const shippingAddress = await ShippingAddressModel.findById(id).exec();
    shippingAddress
      ? res.json(shippingAddress)
      : res.status(404).json({ error: "Shipping address not found" });
  })
);

shippingAddressRouter.post(
  "/",
  isAuth,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return; // Exit the function after sending the response
    }
    const newShippingAddress = new ShippingAddressModel({
      ...req.body,
      user: req.user._id, // Assuming req.user contains the authenticated user's info
    });
    const savedShippingAddress = await newShippingAddress.save();
    res.status(201).json(savedShippingAddress);
    // No need to return anything here
  })
);

shippingAddressRouter.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const newData = req.body;
    const result = await ShippingAddressModel.updateOne({ _id: id }, { $set: newData }).exec();
    result.modifiedCount > 0
      ? res.json({ message: "Update succeeded" })
      : res.status(404).json({ error: "No shipping address found" });
  })
);