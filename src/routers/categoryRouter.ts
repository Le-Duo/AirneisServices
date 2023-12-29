import express from "express";
import asyncHandler from "express-async-handler";
import { Types } from "mongoose";
import { CategoryModel } from "../models/category";
import { isAuth } from "../utils";

export const categoryRouter = express.Router();

categoryRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const categories = await CategoryModel.find();
    res.json(categories);
  })
);

categoryRouter.post(
  "/",
  // isAuth,
  asyncHandler(async (req, res) => {
    try {
      const { name, urlImage } = req.body;

      // Création du model pour la catégorie
      const newCategory = new CategoryModel({
        name,
        urlImage,
      });

      // Enregistre le produit dans la base de données
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
  // isAuth,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const nouvellesDonnees = req.body; // récupère les informations du body

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
  asyncHandler(async (req, res) => {
    const id = req.params.id; // récupère l'id dans les paramètres de l'url

    const filtreSuppression = { _id: new Types.ObjectId(id) }; // filtre sur l'id pour la suppression

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
