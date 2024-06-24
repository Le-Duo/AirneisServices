import express from 'express';
import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { isAuth } from '../utils';
import { OrderModel } from '../models/order';
import { logger } from '../utils';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const endpointSecret = "whsec_04b9c59b29da18817e5bd2296bb408c2e0b3e81a28be46fdb0cfffd6bd86a64c";

export const paymentRouter = express.Router();

paymentRouter.post(
  '/create-payment-intent',
  isAuth,
  asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: 'gbp',
      metadata: { orderId: order._id.toString() },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  })
);

paymentRouter.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      logger.error(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info(`PaymentIntent for ${failedPaymentIntent.amount} failed.`);
        await handlePaymentIntentFailed(failedPaymentIntent);
        break;
      case 'charge.succeeded':
        const charge = event.data.object as Stripe.Charge;
        logger.info(`Charge for ${charge.amount} was successful!`);
        await handleChargeSucceeded(charge);
        break;
      case 'payment_intent.created':
        const createdPaymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info(`PaymentIntent for ${createdPaymentIntent.amount} was created!`);
        await handlePaymentIntentCreated(createdPaymentIntent);
        break;
      // ... handle other event types
      default:
        logger.warn(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  })
);

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;
  const order = await OrderModel.findById(orderId);
  if (order) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      paymentId: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
      email_address: paymentIntent.receipt_email || '',
    };
    await order.save();
  } else {
    logger.error(`Order with ID ${orderId} not found`);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;
  const order = await OrderModel.findById(orderId);
  if (order) {
    order.isPaid = false;
    order.paymentResult = {
      paymentId: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
      email_address: paymentIntent.receipt_email || '',
    };
    await order.save();
  } else {
    logger.error(`Order with ID ${orderId} not found`);
  }
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
  const orderId = charge.metadata.orderId;
  const order = await OrderModel.findById(orderId);
  if (order) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      paymentId: charge.id,
      status: charge.status,
      update_time: new Date().toISOString(),
      email_address: charge.receipt_email || '',
    };
    await order.save();
  } else {
    logger.error(`Order with ID ${orderId} not found`);
  }
}

async function handlePaymentIntentCreated(paymentIntent: Stripe.PaymentIntent) {
  logger.info(`PaymentIntent for ${paymentIntent.amount} was created!`);
}