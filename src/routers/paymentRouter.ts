import express from 'express'
import stripe from '../utils/stripeConfig'

export const paymentRouter = express.Router()

paymentRouter.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'gbp',
    })

    res.status(200).send(paymentIntent)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    res.status(500).send({ error: errorMessage })
  }
})

// Webhook endpoint for Stripe events
paymentRouter.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body as Buffer, // Cast req.body to Buffer
      sig as string, // Ensure sig is treated as a string
      process.env.STRIPE_WEBHOOK_SECRET as string // Ensure the secret is treated as a string
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err}`)
  }

  // Handle the event
  switch (
    event.type as string // Cast event.type to string to bypass the strict type checking
  ) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      // Handle successful payment here
      break
    case 'payment_intent.failed':
      // Handle failed payment here
      break
    default:
      // Unexpected event type
      return res.status(400).send(`Unhandled event type ${event.type}`)
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true })
})
