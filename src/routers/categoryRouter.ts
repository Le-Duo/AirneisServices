import express from 'express'
import asyncHandler from 'express-async-handler'
import { CategoryModel } from '../models/category'

export const categoryRouter = express.Router()

categoryRouter.get(
    '/',
    asyncHandler(async (req, res) => {
        const categories = await CategoryModel.find()
        res.json(categories)
    })
)

categoryRouter.post(
    "/",
    asyncHandler(async (req, res) => {
        try {

            const { name, urlImage } = req.body;

            // Création du model pour la catégorie
            const newCategory = new CategoryModel({
                name,
                urlImage
            });


            // Enregistre le produit dans la base de données
            const savedCategory = await newCategory.save();

            res.status(201).json(savedCategory);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la création de la categorie' });
        }

    })
)