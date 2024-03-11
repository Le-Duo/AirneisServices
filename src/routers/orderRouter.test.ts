import request from 'supertest';
import app from '../index';
import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { isAuth } from '../utils'
import { OrderModel } from '../models/order'
import { StockModel } from '../models/stock'
import { v4 as uuidv4 } from 'uuid'

jest.mock('../models/stock', () => ({
  StockModel: {
    findOneAndUpdate: jest.fn().mockResolvedValue(true),
  },
}));

describe('POST /', () => {
  it('should create an order successfully', async () => {
    const orderData = {
      user: '65b2de45860c1db56605434d',
      shippingAddress: {
        "user": "65b2de45860c1db56605434d",
        "firstName": "Fergus",
        "lastName": "Gray",
        "street": "79 Northgate Street",
        "city": "BICKTON",
        "postalCode": "SP6 6GN",
        "country": "United Kingdom",
        "phone": "43453"
      },
      paymentMethod: 'Credit Card',
      orderItems: [{
        product: '65b2de45860c1db56605433c', // Remplacer par un ObjectId valide
        quantity: 2,
        price: 100,
        image: 'path/to/image.jpg', // Ajouter le chemin de l'image
        name: 'Nom du produit' // Ajouter le nom du produit
      }],
      isPaid: false,
      isDelivered: false,
    };

    const response = await request(app).post('/api/orders').send(orderData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('orderNumber');
  });
});
