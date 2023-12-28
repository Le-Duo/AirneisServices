import express from 'express'
import asyncHandler from 'express-async-handler'
import { Types } from 'mongoose';
import { CategoryModel } from '../models/category'
import { isAuth } from '../utils'

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
    // isAuth,
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

categoryRouter.delete(
    '/:id',
    asyncHandler(async (req, res) => {

        const id = req.params.id; // récupère l'id dans les paramètres de l'url

        const filtreSuppression = {_id: new Types.ObjectId(id) }; // filtre sur l'id pour la suppression

       try {
            const resultat = await CategoryModel.deleteOne(filtreSuppression);

            if (resultat.deletedCount && resultat.deletedCount > 0) {
                 res.json({ message: 'Catégorie supprimée avec succès.' });
            } else {
                 res.status(500).json({ error: 'Aucune catégorie trouvée avec cet ID.' });
            }
        } catch (erreur) {
            console.error('Erreur lors de la suppression :', erreur);
            res.status(500).json({ error: 'Erreur serveur lors de la suppression.' });
        }
        
      
        
    })
)