import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ContactModel } from '../models/contact'
import { Types } from 'mongoose'

export const contactRouter = express.Router()

contactRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const contacts = await ContactModel.find()
    res.json(contacts)
  })
)

contactRouter.get(
  '/message/:messageId',

  asyncHandler(async (req: Request, res: Response) => {
    console.log('Get message by message Id called')
    const contact = await ContactModel.findById(req.params.messageId)
    if (contact) {
      res.json(contact)
    } else {
      res.status(404).json({ message: 'Message Not Found' })
    }
  })
)

contactRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { _id, mail, subject, message, userId } = req.body

      const newContact = new ContactModel({
        _id,
        mail,
        subject,
        message,
        user: userId,
      })
      const savedContact = await newContact.save()

      res.status(201).json(savedContact)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error message création' })
    }
  })
)

contactRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id

    const filtreSuppression = { _id: new Types.ObjectId(id) }

    try {
      const resultat = await ContactModel.deleteOne(filtreSuppression)
      if (resultat.deletedCount && resultat.deletedCount > 0) {
        res.json({ message: 'Message deleted successfully' })
      } else {
        res.status(500).json({ error: 'Message not found' })
      }
    } catch (erreur) {
      console.error('Erreur lors de la suppression:', erreur)
      res.status(500).json({ error: 'Delete error' })
    }
  })
)
