import express from "express";
import asyncHandler from "express-async-handler";
import { Types } from "mongoose";
import { CategoryModel } from "../models/category";
import { isAuth } from "../utils";
import { isAdmin } from "../utils";

export const categoryRouter = express.Router();

categoryRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const categories = await CategoryModel.find().sort({ order: 1 });
    res.json(categories);
  })
);

categoryRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
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
    const slug = req.params.slug;
    const category = await CategoryModel.findOne({ slug: slug });
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
      const { _id, name, slug, urlImage, description, order } = req.body;

      const newCategory = new CategoryModel({
        _id,
        name,
        slug,
        urlImage,
        description,
        order,
      });

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
    const id = req.params.id;
    const nouvellesDonnees = req.body;

    try {
      const resultat = await CategoryModel.updateOne(
        { _id: id },
        { $set: nouvellesDonnees }
      );

      if (resultat.modifiedCount > 0) {
        res.json({ message: "Update succeeded" });
      } else {
        res.status(500).json({ error: "Category not found" });
      }
    } catch (erreur) {
      console.error("Update error :", erreur);
      res.status(500).json({ error: "Update error" });
    }
  })
);

categoryRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const filtreSuppression = { _id: new Types.ObjectId(id) };

    try {
      const resultat = await CategoryModel.deleteOne(filtreSuppression);

      if (resultat.deletedCount && resultat.deletedCount > 0) {
        res.json({ message: "category deleted successfully" });
      } else {
        res.status(500).json({ error: "Category not found." });
      }
    } catch (erreur) {
      console.error("Erreur lors de la suppression :", erreur);
      res.status(500).json({ error: "Delete error." });
    }
  })
);
