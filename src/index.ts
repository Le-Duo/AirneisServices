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
import helmet from 'helmet'
import { productRouter } from './routers/productRouter'
import { seedRouter } from './routers/seedRouter'
import { userRouter } from './routers/userRouter'
import { orderRouter } from './routers/orderRouter'
import { stockRouter } from './routers/stockRouter'
import { categoryRouter } from './routers/categoryRouter'
import { contactRouter } from './routers/contactRouter'
import { carouselRouter } from './routers/carouselRouter'
import { shippingAddressRouter } from './routers/shippingAddressRouter'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''

if (MONGODB_URI == '') {
  console.error('var MONGODB_URI not found')
  process.exit(1)
}

// Force connection on "Airneis" database; by default, mongoose create "Test" database
const connectionpOptions = {
  dbName: `Airneis`,
}

mongoose.set('strictQuery', true)
mongoose
  .connect(MONGODB_URI, connectionpOptions)
  .then(() => console.log('connected to MongoDB !'))
  .catch((error) => console.error(error))

const app = express()

app.use(helmet())
app.use(
  cors({
    credentials: true,
    origin: '*',
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/seed', seedRouter)
app.use('/api/orders', orderRouter)
app.use('/api/contact', contactRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/stocks', stockRouter)
app.use('/api/carousel', carouselRouter)
app.use('/api/shippingaddresses', shippingAddressRouter)
app.use('/api/status', (req, res) => {
  res.send('API is running')
})

const PORT: number = parseInt((process.env.PORT || '4000') as string, 10)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
