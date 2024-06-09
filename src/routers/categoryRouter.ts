import express from "express";
import asyncHandler from "express-async-handler";
import { Types } from "mongoose";
import { CategoryModel } from "../models/category";
import { isAuth, isAdmin } from "../utils";

export const categoryRouter = express.Router();

categoryRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const categories = await CategoryModel.find();
    res.json(categories);
  })
);

categoryRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  })
);

categoryRouter.get(
  "/slug/:slug",
  asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const category = await CategoryModel.findOne({ slug });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  })
);

categoryRouter.post(
  "/",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    try {
      const { _id, name, slug, urlImage, description } = req.body;
      const newCategory = new CategoryModel({ _id, name, slug, urlImage, description });
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error on create new category" });
    }
  })
);

categoryRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const nouvellesDonnees = req.body;
    try {
      const resultat = await CategoryModel.updateOne({ _id: id }, { $set: nouvellesDonnees });
      if (resultat.modifiedCount > 0) {
        res.json({ message: "Update succeeded" });
      } else {
        res.status(500).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ error: "Update error" });
    }
  })
);

categoryRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const filtreSuppression = { _id: new Types.ObjectId(id) };
    try {
      const resultat = await CategoryModel.deleteOne(filtreSuppression);
      if (resultat.deletedCount > 0) {
        res.json({ message: "Category deleted successfully" });
      } else {
        res.status(500).json({ error: "Category not found." });
      }
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ error: "Delete error." });
    }
  })
);
