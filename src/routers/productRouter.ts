/**
 * J'ai choisi d'utiliser Express et Typegoose pour construire cette API REST car ils offrent une excellente compatibilité avec TypeScript.
 * Ce fichier, 'productRouter.ts', gère les routes pour les produits. Il contient deux routes principales : une pour obtenir tous les produits et une autre pour obtenir un produit spécifique par son slug.
 * La route 'GET /' renvoie tous les produits.
 * La route 'GET /slug/:slug' renvoie les détails d'un produit spécifique.
 */
import express from "express";
import asyncHandler from "express-async-handler";
import { ProductModel } from "../models/product";
import { CategoryModel } from "../models/category";
import { isAuth } from "../utils";
import { Types } from "mongoose";

export const productRouter = express.Router();
productRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await ProductModel.find();
    res.json(products);
  })
);

productRouter.get(
  "/slug/:slug",
  asyncHandler(async (req, res) => {
    const product = await ProductModel.findOne({ slug: req.params.slug });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  })
);

productRouter.get("/search", asyncHandler(async (req, res) => {
  const { searchText, priceMin, priceMax, categories, inStock } = req.query;

  let searchQuery = {
    $search: {
      index: 'searchIndex', 
      text: {
        query: searchText,
        path: ['description', 'materials', 'name'] 
      }
    }
  };

  let filterQuery: any = {};
  if (priceMin || priceMax) {
    filterQuery.price = {};
    if (priceMin) filterQuery.price.$gte = Number(priceMin);
    if (priceMax) filterQuery.price.$lte = Number(priceMax);
  }
  if (categories) {
    const categoriesArray = typeof categories === 'string' ? categories.split(",") : categories;
    filterQuery["category._id"] = { $in: categoriesArray };
  }
  if (inStock) {
    filterQuery.stock = { $gt: 0 };
  }

  const aggregateQuery = [
    { $match: searchQuery },
    { $match: filterQuery }
  ];

  const products = await ProductModel.aggregate(aggregateQuery).exec();

  res.json(products);
}));

productRouter.post(
  "/",
  // isAuth,
  asyncHandler(async (req, res) => {
    try {
      const { name, slug, URLimage, categoryId, description, materials, price, priority } =
        req.body;

      // Récupère le produit dans la db
      const category = await CategoryModel.findById(categoryId);

      if (category) {
        console.log("Category found:", category);
      } else {
        // si la catégorie n'existe pas, il ne faut pas aller plus loin
        console.error("Category not found");
        res.status(500).json("Category does not exists");
      }

      const newProduct = new ProductModel({
        name,
        slug,
        URLimage,
        category: category, // cast la variable category en type "Category"
        description,
        materials,
        price,
        priority,
      });

      // Enregistrez le produit dans la base de données
      const savedProduct = await newProduct.save();

      // Répondez avec le produit créé
      res.status(201).json(savedProduct);
    } catch (error) {
      // Gérez les erreurs
      console.error(error);
      res.status(500).json({ error: "Error on product creation" });
    }
  })
);

productRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id; // récupère l'id dans les paramètres de l'url

    const filtreSuppression = { _id: new Types.ObjectId(id) }; // filtre sur l'id pour la suppression

    try {
      const resultat = await ProductModel.deleteOne(filtreSuppression);

      if (resultat.deletedCount && resultat.deletedCount > 0) {
        res.json({ message: "product deleted successfully." });
      } else {
        res.status(500).json({ error: "Product not found." });
      }
    } catch (erreur) {
      console.error("Error :", erreur);
      res.status(500).json({ error: "Delete error." });
    }
  })
);

productRouter.put(
  "/:productId",
  asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const newData = req.body;
    try {
      const result = await ProductModel.updateOne(
        { _id: productId },
        { $set: newData }
      );

      if (result.matchedCount == 0) {
        res.status(500).json({ error: "No product found" });
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
