
import express from 'express'
import asyncHandler from 'express-async-handler'
import { StockModel } from '../models/stock'
import { ProductModel } from '../models/product'
import { isAuth } from '../utils'
import { Types } from 'mongoose';

export const stockRouter = express.Router()
stockRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const allStock = await StockModel.find()
    res.json(allStock)
  })
)


stockRouter.get(
    '/products/:productId',
    asyncHandler(async (req, res) => {

        const productId = req.params.productId;

        console.log(productId)
    
        // Récupérez le stock du produit en utilisant la propriété product
        const stock = await StockModel.findOne({ 'product._id': productId });
  
        if (!stock) {
           res.status(404).json({ error: 'Stock not found for the product' });
        }
  
        // Répondez avec le stock et les détails du produit
        res.status(200).json(stock);
    
    })
  );

stockRouter.post(
  "/",
  // isAuth,
  asyncHandler(async (req, res) => {
    try {

      console.log("POST stockRouter / called.")

      const { productId, quantity } = req.body;

      // Récupère le produit dans la db
      const product = await ProductModel.findById(productId);
      
      if (product) {
        console.log('Product found:', product);
      } else {
        // si le produit n'existe pas, il ne faut pas aller plus loin
        console.error('Product not found');
        res.status(500).json('Product does not exists'); 
      }

      // Création du model pour le stock
      const newStock = new StockModel({
        product: product, // cast la variable product en type "Product"
        quantity
      });

      // Enregistre le produit dans la base de données
      const savedStock = await newStock.save();

      // Réponds avec le produit créé
      res.status(201).json(savedStock);
    } catch (error) {
      // Gérez les erreurs
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la création du stock pour le produit' });
    }

  })
)

stockRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {

      const id = req.params.id; // récupère l'id dans les paramètres de l'url

      const filtreSuppression = {_id: new Types.ObjectId(id) }; // filtre sur l'id pour la suppression

     try {
          const resultat = await StockModel.deleteOne(filtreSuppression);

          if (resultat.deletedCount && resultat.deletedCount > 0) {
               res.json({ message: 'Stock supprimé avec succès.' });
          } else {
               res.status(500).json({ error: 'Aucun produit trouvé avec cet ID.' });
          }
      } catch (erreur) {
          console.error('Erreur lors de la suppression :', erreur);
          res.status(500).json({ error: 'Erreur serveur lors de la suppression.' });
      }  
  })
)