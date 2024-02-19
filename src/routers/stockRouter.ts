import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { StockModel } from "../models/stock";
import { ProductModel } from "../models/product";
import { isAuth, isAdmin } from "../utils";

export const stockRouter = express.Router();

stockRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const allStock = await StockModel.find().exec();
    res.json(allStock);
  })
);

stockRouter.get(
  "/:productId",
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const stock = await StockModel.findOne({ "product._id": productId }).exec();
    stock
      ? res.json(stock)
      : res.status(404).json({ error: "Stock not found for the product" });
  })
);

stockRouter.post(
  "/",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body;
    const product = await ProductModel.findById(productId).exec();
    if (!product) {
      res.status(404).json("Product does not exist");
      return next();
    }
    const newStock = await StockModel.create({ product, quantity });
    res.status(201).json(newStock);
  })
);

stockRouter.put(
  "/:productId",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const newData = req.body;
    const result = await StockModel.updateOne(
      { "product._id": productId },
      { $set: newData }
    ).exec();
    result.modifiedCount > 0
      ? res.json({ message: "Update succeeded" })
      : res.status(404).json({ error: "No stock found" });
  })
);
