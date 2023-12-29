
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
    
        // Récupérez le stock du produit en utilisant la propriété product
        const stock = await StockModel.findOne({ 'product._id': productId });
  
        if (!stock) {
           res.status(500).json({ error: 'Stock not found for the product' });
        }
  
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
      res.status(500).json({ error: 'Error on creation' });
    }

  })
)

stockRouter.put( // On fait un update du stock par produit id
  "/products/:productId",
  asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const newData =  req.body;

    try{
      
      const result = await StockModel.updateOne({'product._id': productId}, {$set: newData});

      if(result.modifiedCount > 0) {
        res.json({ message: 'update succeeded' });
        } else {
              res.status(500).json({ error: 'No stock found' });
        }
      } catch (erreur) {
        console.error('error :', erreur);
          res.status(500).json({ error: 'Delete error' });
        }
  })
)
