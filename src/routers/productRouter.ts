/**
 * J'ai choisi d'utiliser Express et Typegoose pour construire cette API REST car ils offrent une excellente compatibilité avec TypeScript.
 * Ce fichier, 'productRouter.ts', gère les routes pour les produits. Il contient deux routes principales : une pour obtenir tous les produits et une autre pour obtenir un produit spécifique par son slug.
 * La route 'GET /' renvoie tous les produits.
 * La route 'GET /slug/:slug' renvoie les détails d'un produit spécifique.
 */
import express from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel } from '../models/product'
import { CategoryModel } from '../models/category'
import { isAuth } from '../utils'
import { Types } from 'mongoose';


export const productRouter = express.Router()
productRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await ProductModel.find()
    res.json(products)
  })
)

productRouter.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const product = await ProductModel.findOne({ slug: req.params.slug })
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: 'Product not found' })
    }
  })
)

productRouter.post(
  "/",
  // isAuth,
  asyncHandler(async (req, res) => {

    try {

      const { name, slug, URLimage, categoryId, description, brand, price } = req.body;

      // Récupère le produit dans la db
      const category = await CategoryModel.findById(categoryId);

      if (category) {
        console.log('Category found:', category);
      } else {
        // si la catégorie n'existe pas, il ne faut pas aller plus loin
        console.error('Category not found');
        res.status(500).json('Category does not exists');
      }

      const newProduct = new ProductModel({
        name,
        slug,
        URLimage,
        category: category, // cast la variable category en type "Category"
        description,
        brand,
        price,
      });

      // Enregistrez le produit dans la base de données
      const savedProduct = await newProduct.save();

      // Répondez avec le produit créé
      res.status(201).json(savedProduct);
    } catch (error) {
      // Gérez les erreurs
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la création du produit' });
    }

  })
)

productRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {

      const id = req.params.id; // récupère l'id dans les paramètres de l'url

      const filtreSuppression = {_id: new Types.ObjectId(id) }; // filtre sur l'id pour la suppression

     try {
          const resultat = await ProductModel.deleteOne(filtreSuppression);

          if (resultat.deletedCount && resultat.deletedCount > 0) {
               res.json({ message: 'Produit supprimé avec succès.' });
          } else {
               res.status(500).json({ error: 'Aucun produit trouvé avec cet ID.' });
          }
      } catch (erreur) {
          console.error('Erreur lors de la suppression :', erreur);
          res.status(500).json({ error: 'Erreur serveur lors de la suppression.' });
      }  
  })
)