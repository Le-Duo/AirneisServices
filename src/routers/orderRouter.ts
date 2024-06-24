import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { isAuth } from '../utils'
import { OrderModel, ShippingAddress, Item } from '../models/order'
import { StockModel } from '../models/stock'
import { v4 as uuidv4 } from 'uuid'
import Stripe from 'stripe';

export const orderRouter = express.Router()

orderRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({}).populate("user", "name");
    res.json(orders);
  })
);

orderRouter.get(
  "/mine",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const orders = await OrderModel.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  "/average-basket-by-category",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("Fetching average basket size by category");
    const averages = await OrderModel.aggregate([
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: "$categoryDetails.name",
          averageQuantity: { $avg: "$orderItems.quantity" },
        },
      },
    ]);
    console.log("Averages calculated:", averages);

    res.json(averages);
  })
);

orderRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("Get order by id called");
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  })
);

orderRouter.get(
  "/order/:orderNumber",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("Get order by orderNumb er called");
    const order = await OrderModel.findOne({
      orderNumber: req.params.orderNumber,
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  })
);

function calculateShippingPrice(itemsPrice: number): number {
  if (itemsPrice < 400) {
    return 39;
  } else if (itemsPrice >= 400 && itemsPrice <= 1000) {
    return 59;
  } else if (itemsPrice > 1000) {
    return 109;
  }
  return 0;
}

orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const {
        user,
        shippingAddress,
        paymentMethod,
        orderItems,
        isPaid,
        isDelivered,
        orderNumber: customOrderNumber,
      }: {
        user: string,
        shippingAddress: ShippingAddress,
        paymentMethod: string,
        orderItems: Item[],
        isPaid: boolean,
        isDelivered: boolean,
        orderNumber?: string
      } = req.body;

      if (typeof isPaid !== 'boolean' || typeof isDelivered !== 'boolean') {
        res.status(400).json({ error: "Invalid isPaid or isDelivered format" });
        return;
      }

      if (
        !Array.isArray(orderItems) ||
        !orderItems.every(
          (item) =>
            typeof item === "object" && "quantity" in item && "price" in item
        )
      ) {
        res.status(400).json({ error: "Invalid orderItems format" });
        return;
      }

      const itemsPrice = orderItems.reduce((acc: number, item: Item) => {
        const quantity = typeof item.quantity === "number" ? item.quantity : 0;
        const price = typeof item.price === "number" ? item.price : 0;

        return acc + quantity * price;
      }, 0);

      const shippingPrice = calculateShippingPrice(itemsPrice);
      const taxPrice = itemsPrice * 0.2;
      const totalPrice = itemsPrice + shippingPrice + taxPrice;

      const orderNumber = customOrderNumber || generateOrderNumber();

      const newOrder = new OrderModel({
        orderNumber,
        user,
        shippingAddress,
        paymentMethod,
        orderItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        isPaid,
        isDelivered,
        status: "initiated",
      });

      if (!process.env.STRIPE_SECRET_KEY) {
        res.status(500).json({ error: "Stripe secret key is not defined" });
        return;
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-04-10',
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency: 'gbp',
        metadata: { orderId: newOrder._id.toString() },
      });

      newOrder.paymentIntentId = paymentIntent.id;

      const savedOrder = await newOrder.save();

      // Update stock levels
      const stockUpdates = [];
      const originalStockLevels = [];

      for (const item of orderItems) {
        console.log("Processing item:", item);
        const stock = await StockModel.findOne({ "product._id": item._id });
        
        if (!stock) {
          throw new Error(`Stock not found for product: ${item._id}`);
        }

        if (stock.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product: ${item._id}`);
        }

        originalStockLevels.push({ productId: item._id, quantity: stock.quantity });
        stockUpdates.push(
          StockModel.updateOne(
            { "product._id": item._id },
            { $inc: { quantity: -item.quantity } }
          )
        );
      }

      try {
        await Promise.all(stockUpdates);
      } catch (error) {
        // Rollback stock updates if an error occurs
        for (const original of originalStockLevels) {
          await StockModel.updateOne(
            { "product._id": original.productId },
            { $set: { quantity: original.quantity } }
          );
        }
        throw new Error("Failed to update stock levels");
      }

      res.status(201).json({ ...savedOrder.toObject(), clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ error: (error as Error).message || "Error on order creation" });
    }
  })
);

orderRouter.put(
  "/:ordernumber",
  asyncHandler(async (req, res) => {
    const ordernumber = req.params.ordernumber;
    const newData = req.body;
    newData.updatedAt = Date.now();

    try {
      const result = await OrderModel.updateOne(
        { orderNumber: ordernumber },
        { $set: newData }
      );

      if (result.matchedCount == 0) {
        res.status(500).json({ error: "No order found" });
      }
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "update succeeded" });
      }

      res.status(500).json({ error: "Update error" });
    } catch (erreur) {
      console.error("error :", erreur);
      res.status(500).json({ error: "Update  error" });
    }
  })
);

orderRouter.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);
    if (deletedOrder) {
      res.json(deletedOrder);
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  })
);

function generateOrderNumber(): string {
  const prefix = "CMD";

  const uniqueId = uuidv4().replace(/-/g, "");

  const orderNumber = `${prefix}-${uniqueId}`;

  return orderNumber;
}
