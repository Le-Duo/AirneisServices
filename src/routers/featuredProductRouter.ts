import express from "express";
import { FeaturedProductModel } from "../models/FeaturedProduct";
import asyncHandler from "express-async-handler";
import { isAdmin, isAuth } from "../utils";

const featuredProductRouter = express.Router();

featuredProductRouter.post(
  "/",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { product, order } = req.body;
    const featuredProduct = new FeaturedProductModel({
      product,
      order,
    });
    const savedFeaturedProduct = await featuredProduct.save();
    res.status(201).json(savedFeaturedProduct);
  })
);

featuredProductRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const featuredProducts = await FeaturedProductModel.find()
      .populate("product")
      .sort("order");
    res.json(featuredProducts);
  })
);

featuredProductRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const featuredProduct = await FeaturedProductModel.findById(id).populate(
      "product"
    );
    if (!featuredProduct) {
      res.status(404).json({ message: "Featured product not found" });
      return;
    }
    res.json(featuredProduct);
  })
);

featuredProductRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { order } = req.body;
    const updatedFeaturedProduct = await FeaturedProductModel.findByIdAndUpdate(
      id,
      { order },
      { new: true }
    );
    if (!updatedFeaturedProduct) {
      res.status(404).json({ message: "Featured product not found" });
      return;
    }
    res.json(updatedFeaturedProduct);
  })
);

featuredProductRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedFeaturedProduct = await FeaturedProductModel.findByIdAndDelete(
      id
    );
    if (!deletedFeaturedProduct) {
      res.status(404).json({ message: "Featured product not found" });
      return;
    }
    res.json({ message: "Featured product deleted" });
  })
);

export { featuredProductRouter };