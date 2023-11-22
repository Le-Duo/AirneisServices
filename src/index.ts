/**
 * J'ai choisi d'utiliser Express, dotenv, mongoose et cors pour construire cette API REST car ils offrent une excellente compatibilité avec TypeScript.
 * Ce fichier, 'index.ts', est le point d'entrée de l'application. Il configure l'application Express, se connecte à la base de données MongoDB et définit les routes pour les différents endpoints de l'API.
 * Les routes sont définies pour les produits, les utilisateurs, les commandes et les données d'initialisation.
 * L'application écoute sur le port 4000 et se connecte à la base de données MongoDB à l'aide de l'URI fournie par la variable d'environnement MONGODB_URI.
 */

import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { productRouter } from './routers/productRouter'
import { seedRouter } from './routers/seedRouter'
import { userRouter } from './routers/userRouter'
import { orderRouter } from './routers/orderRouter'

dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/airneis'
mongoose.set('strictQuery', true)
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('connected to MongoDB ...'))
  .catch((error) => console.log(error))

const app = express()

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173'],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/seed', seedRouter)
app.use('/api/orders', orderRouter)

const PORT = 4000

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
