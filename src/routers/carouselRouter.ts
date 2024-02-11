import express from 'express'
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
  asyncHandler(async (req, res) => {
    const updatedItem = await CarouselItemModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' })
    }
    res.json(updatedItem)
  })
)
