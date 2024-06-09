
import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel, Product } from '../models/product'
import { UserModel } from '../models/user'
import { CategoryModel } from '../models/category'
import { CarouselItemModel } from '../models/carouselItem'
import { StockModel } from '../models/stock'
import { OrderModel } from '../models/order'
import { ContactModel } from '../models/contact'
import { sampleProducts } from '../data'
import { sampleUsers } from '../data'
import { sampleCategories } from '../data'
import { sampleCarouselItems } from '../data'
import { sampleStocks } from '../data'
import { sampleOrders } from '../data'
import { sampleContacts } from '../data'

export const seedRouter = express.Router()

seedRouter.get(
  '/all',
  asyncHandler(async (req: Request, res: Response) => {
    await ProductModel.deleteMany({});
    await UserModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await CarouselItemModel.deleteMany({});
    await StockModel.deleteMany({});
    await OrderModel.deleteMany({});
    await ContactModel.deleteMany({});

    const createdCategories = await CategoryModel.insertMany(sampleCategories);

    const updatedSampleProducts = sampleProducts.map(product => {
      const categoryDoc = createdCategories.find(c => c.name === product.category.name);
      if (!categoryDoc) {
        throw new Error(`Category ${product.category.name} not found`);
      }
      return { ...product, category: categoryDoc };
    });

    const createdProducts = await ProductModel.insertMany(updatedSampleProducts);

    const createdUsers = await UserModel.insertMany(sampleUsers);

    const createdCarouselItems = await CarouselItemModel.insertMany(sampleCarouselItems);

    const updatedSampleStocks = sampleStocks.map(stock => {
      const productDoc = createdProducts.find(p => p.slug === stock.product.slug);
      if (!productDoc) {
        throw new Error(`Product ${stock.product.slug} not found`);
      }
      return { ...stock, product: productDoc };
    });

    const createdStocks = await StockModel.insertMany(updatedSampleStocks);

    const updatedSampleOrders = sampleOrders.map(order => {
      const userDoc = createdUsers.find(u => u.email === 'admin@example.com');
      if (!userDoc) {
        throw new Error('User not found');
      }
      return { ...order, user: userDoc._id };
    });

    const createdOrders = await OrderModel.insertMany(updatedSampleOrders);
    const createdContacts = await ContactModel.insertMany(sampleContacts);

    res.json({ createdCategories, createdProducts, createdUsers, createdCarouselItems, createdStocks, createdOrders, createdContacts });
  })
);

seedRouter.get('/categories', asyncHandler(async (req: Request, res: Response) => {
  await CategoryModel.deleteMany({});
  const createdCategories = await CategoryModel.insertMany(sampleCategories);
  res.json(createdCategories);
}));

seedRouter.get('/products', asyncHandler(async (req: Request, res: Response) => {
  await ProductModel.deleteMany({});
  const categories = await CategoryModel.find({});
  const updatedProducts = sampleProducts.map(product => {
    const categoryDoc = categories.find(c => c.slug === product.category.slug);
    if (!categoryDoc) {
      throw new Error(`Category ${product.category.slug} not found`);
    }
    return { ...product, category: { _id: categoryDoc._id, slug: categoryDoc.slug, name: categoryDoc.name } };
  });
  const createdProducts = await ProductModel.insertMany(updatedProducts);
  res.json(createdProducts);
}));

seedRouter.get('/users', asyncHandler(async (req: Request, res: Response) => {
  await UserModel.deleteMany({});
  const createdUsers = await UserModel.insertMany(sampleUsers);
  res.json(createdUsers);
}));

seedRouter.get('/carousel-items', asyncHandler(async (req: Request, res: Response) => {
  await CarouselItemModel.deleteMany({});
  const createdCarouselItems = await CarouselItemModel.insertMany(sampleCarouselItems);
  res.json(createdCarouselItems);
}));

seedRouter.get('/stocks', asyncHandler(async (req: Request, res: Response) => {
  await StockModel.deleteMany({});
  const products = await ProductModel.find({});
  const updatedStocks = sampleStocks.map(stock => {
    const productDoc = products.find(p => p.slug === stock.product.slug);
    if (!productDoc) {
      throw new Error(`Product ${stock.product.slug} not found`);
    }
    return { ...stock, product: productDoc };
  });
  const createdStocks = await StockModel.insertMany(updatedStocks);
  res.json(createdStocks);
}));

seedRouter.get('/orders', asyncHandler(async (req: Request, res: Response) => {
  await OrderModel.deleteMany({});
  const users = await UserModel.find({});
  const products = await ProductModel.find({});
  const updatedOrders = sampleOrders.map(order => {
    const userDoc = users.find(u => u._id.toString() === order.user.toString());
    if (!userDoc) {
      console.error(`User with ID ${order.user} not found`);
      return null;
    }
    const orderItemsUpdated = order.orderItems.map(item => {
      const productDoc = products.find(p => p.slug === (item.product as Product).slug);
      if (!productDoc) {
        throw new Error(`Product ${(item.product as Product).slug} not found`);
      }
      return { ...item, product: productDoc._id };
    });
    return { ...order, user: userDoc._id, orderItems: orderItemsUpdated };
  }).filter(order => order !== null);

  const createdOrders = await OrderModel.insertMany(updatedOrders);
  res.json(createdOrders);
}));

seedRouter.get('/contacts', asyncHandler(async (req: Request, res: Response) => {
  await ContactModel.deleteMany({});
  const createdContacts = await ContactModel.insertMany(sampleContacts);
  res.json(createdContacts);
}));
