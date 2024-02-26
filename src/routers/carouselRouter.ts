import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { CarouselItemModel } from '../models/carouselItem'

export const carouselRouter = express.Router()

carouselRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const items = await CarouselItemModel.find()
    res.json(items)
  })
)

carouselRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const newItem = new CarouselItemModel(req.body)
    const savedItem = await newItem.save()
    res.status(201).json(savedItem)
  })
)

carouselRouter.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const updatedItem = await CarouselItemModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    )
    if (updatedItem) {
      res.json(updatedItem)
    } else {
      res.status(404).send({ message: 'Carousel Item Not Found' })
    }
  })
)

carouselRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const deletedItem = await CarouselItemModel.findByIdAndDelete(req.params.id)
    if (deletedItem) {
      res.json(deletedItem)
    } else {
      res.status(404).send({ message: 'Carousel Item Not Found' })
    }
  })
)

