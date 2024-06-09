import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { productRouter } from './routers/productRouter'
import { seedRouter } from './routers/seedRouter'
import { userRouter } from './routers/userRouter'
import { orderRouter } from './routers/orderRouter'
import { stockRouter } from './routers/stockRouter'
import { categoryRouter } from './routers/categoryRouter'
import { contactRouter } from './routers/contactRouter'
import { carouselRouter } from './routers/carouselRouter'
import { shippingAddressRouter } from './routers/shippingAddressRouter'
import { statusRouter } from './routers/statusRouter'
import { featuredProductRouter } from './routers/featuredProductRouter'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''
const LOCAL_MONGODB_URI = process.env.LOCAL_MONGODB_URI || 'mongodb://localhost:27017'

const connectionOptions = {
  dbName: `Airneis`,
}

const connectToMongoDB = async (uri: string) => {
  try {
    await mongoose.connect(uri, connectionOptions)
    console.log(uri === MONGODB_URI ? `Connected to MongoDB Atlas` : `Connected to local MongoDB`)
  } catch (error) {
    console.error(`Failed to connect to ${uri === MONGODB_URI ? 'MongoDB Atlas' : 'local MongoDB'}`, error)
    throw error
  }
}

console.log('Attempting to connect to MONGODB_URI...')
connectToMongoDB(MONGODB_URI).catch(() => {
  console.log('Attempting to connect to LOCAL_MONGODB_URI...')
  connectToMongoDB(LOCAL_MONGODB_URI).catch(() => {
    console.error('Failed to connect to both MONGODB_URI and LOCAL_MONGODB_URI')
    process.exit(1)
  })
})

mongoose.set('strictQuery', true)

const app = express()

app.use(helmet())
app.use(cookieParser())
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
app.use('/api/status', statusRouter)
app.use('/api/featuredProducts', featuredProductRouter)

const PORT: number = parseInt((process.env.PORT || '4000') as string, 10)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})

export default app