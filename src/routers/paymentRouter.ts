import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { isAuth } from '../utils';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const paymentRouter = express.Router();

paymentRouter.post('/create-payment-intent', isAuth, asyncHandler(async (req: Request, res: Response) => {
  const { amount } = req.body; // Amount should be in the smallest currency unit
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      // Add more options here based on your requirements
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating payment intent' });
  }
}));

export { paymentRouter };