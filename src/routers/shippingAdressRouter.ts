import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { ShippingAdressModel } from "../models/shippingAdress";

export const shippingAdressRouter = express.Router();

shippingAdressRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const allShippingAdresses = await ShippingAdressModel.find().exec();
    res.json(allShippingAdresses);
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
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const newShippingAdress = await ShippingAdressModel.create(req.body);
    res.status(201).json(newShippingAdress);
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