/**
 * J'ai choisi d'utiliser TypeScript, Express et bcryptjs pour construire cette API REST car ils offrent une excellente compatibilité et des fonctionnalités robustes.
 * Ce fichier, 'data.ts', contient des données d'échantillon pour les produits et les utilisateurs qui sont utilisées pour peupler la base de données lors de l'initialisation de l'application.
 * Les produits et les utilisateurs sont définis avec leurs attributs respectifs, tels que le nom, l'image, la catégorie, la marque, le prix, le stock pour les produits et le nom, l'email, le mot de passe pour les utilisateurs.
 */

import { DocumentType } from '@typegoose/typegoose'
import { CarouselItem } from './models/carouselItem'
import { Category } from './models/category'
import { Contact } from './models/contact'
import { Order, ShippingAddress, OrderStatus } from './models/order'
import { Product } from './models/product'
import { Stock } from './models/stock'
import { User } from './models/user'
import bcrypt from 'bcryptjs'

export const sampleCategories: Category[] = [
  {
    _id: '60d0fe4f5311236168a109ca',
    name: 'Sofas',
    urlImage: '../public/images/categorysofa.png',
    slug: 'sofas',
  },
  {
    _id: '60d0fe4f5311236168a109cb',
    name: 'Tables',
    urlImage: '../public/images/categorytable.png',
    slug: 'tables',
  },
  {
    _id: '60d0fe4f5311236168a109cc',
    name: 'Bookcases',
    urlImage: '../public/images/categorybookcase.png',
    slug: 'bookcases',
  },
  {
    _id: '60d0fe4f5311236168a109cd',
    name: 'Rugs',
    urlImage: '../public/images/categoryrug.png',
    slug: 'rugs',
  },
  {
    _id: '60d0fe4f5311236168a109ce',
    name: 'Lamps',
    urlImage: '../public/images/categorylamp.png',
    slug: 'lamps',
  },
  {
    _id: '60d0fe4f5311236168a109cf',
    name: 'Wardrobes',
    urlImage: '../public/images/categorywardrobe.png',
    slug: 'wardrobes',
  },
]

export const sampleProducts: Product[] = [
  {
    _id: '60d0fe4f5311236168a109d0',
    name: 'MACLEOD',
    slug: 'macleod',
    URLimage: '../public/images/blue-3-seater-sofa.png',
    category: sampleCategories.find(cat => cat.slug === 'sofas') as DocumentType<Category>,
    materials: ['cotton', 'wood'],
    price: 200,
    description: 'Blue 3-seater sofa',
    priority: true,
    
  },
  {
    _id: '60d0fe4f5311236168a109d1',
    name: 'NESSIE',
    slug: 'nessie',
    URLimage: '../public/images/red-2-seater-sofa-in-living-room.png',
    category: sampleCategories.find(cat => cat.slug === 'sofas') as DocumentType<Category>,
    materials: ['cotton', 'wood'],
    price: 150,
    description: 'Red 2-seater sofa',
    priority: false,
  },
  {
    _id: '60d0fe4f5311236168a109d2',
    name: 'THISTLE',
    slug: 'thistle',
    URLimage: '../public/images/single-seat-green-sofa-in-living-room.png',
    category: sampleCategories.find(cat => cat.slug === 'sofas') as DocumentType<Category>,
    materials: ['cotton', 'wood'],
    price: 100,
    description: 'Green 1-seater sofa',
    priority: false,
  },
  {
    _id: '60d0fe4f5311236168a109d3',
    name: 'GLEN',
    slug: 'glen',
    URLimage: '../public/images/modern-brown-coffee-table (1).png',
    category: sampleCategories.find(cat => cat.slug === 'tables') as DocumentType<Category>,
    materials: ['wood'],
    price: 80,
    description: 'Brown coffee table',
    priority: false,
  },
  {
    _id: '60d0fe4f5311236168a109d4',
    name: 'WALLACE',
    slug: 'wallace',
    URLimage:
      '../public/images/bookcase-with-a-wooden-finish-and-a-metal-frame.png',
    category: sampleCategories.find(cat => cat.slug === 'bookcases') as DocumentType<Category>,
    materials: ['wood', 'metal'],
    price: 80,
    description: 'Bookcase with wooden finish and metal frame.',
    priority: false,
  },
  {
    _id: '60d0fe4f5311236168a109d5',
    name: 'HEATHER',
    slug: 'heather',
    URLimage: '../public/images/modern-purple-rug-with-floral-pattern.png',
    category: sampleCategories.find(cat => cat.slug === 'rugs') as DocumentType<Category>,
    materials: ['wool'],
    price: 35,
    description: 'Rug with a wool texture and a purple color',
    priority: false,
  },
  {
    _id: '60d0fe4f5311236168a109d6',
    name: 'STIRLING',
    slug: 'stirling',
    URLimage:
      '../public/images/ad-of-a-lamp-with-glass-shade-and-thin-silver-base.png',
    category: sampleCategories.find(cat => cat.slug === 'lamps') as DocumentType<Category>,
    materials: ['glass', 'metal'],
    price: 20,
    description: 'Lamp with glass shade and thin silver base',
    priority: false,
  },
  {
    _id: '60d0fe4f5311236168a109d7',
    name: 'SKYE',
    slug: 'skye',
    URLimage: '../public/images/wardrobe-with-a-white-colour-and-3-doors.png',
    category: sampleCategories.find(cat => cat.slug === 'wardrobes') as DocumentType<Category>,
    materials: ['wood', 'glass'],
    price: 200,
    description: 'White wardrobe with a mirror door',
    priority: false,
  },
]

export const sampleUsers: User[] = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password'),
    isAdmin: true,
    address: {
      street: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'USA',
    },
    paymentCards: [
      {
        bankName: 'Visa',
        number: '1234 5678 1234 5678',
        fullName: 'John Doe',
        monthExpiration: 12,
        yearExpiration: 2023,
      },
      {
        bankName: 'Mastercard',
        number: '1234 5678 1234 5678',
        fullName: 'Jane Doe',
        monthExpiration: 12,
        yearExpiration: 2023,
      },
    ],
  },
  {
    name: 'User One',
    email: 'userone@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: false,
    address: {
      street: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'USA',
    },
    paymentCards: [
      {
        bankName: 'Visa',
        number: '1234 5678 1234 5678',
        fullName: 'John Doe',
        monthExpiration: 12,
        yearExpiration: 2023,
      },
      {
        bankName: 'Mastercard',
        number: '1234 5678 1234 5678',
        fullName: 'Jane Doe',
        monthExpiration: 12,
        yearExpiration: 2023,
      },
    ],
  },
  {
    name: 'User Two',
    email: 'usertwo@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: false,
    address: {
      street: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'USA',
    },
    paymentCards: [
      {
        bankName: 'Visa',
        number: '1234 5678 1234 5678',
        fullName: 'John Doe',
        monthExpiration: 12,
        yearExpiration: 2023,
      },
      {
        bankName: 'Mastercard',
        number: '1234 5678 1234 5678',
        fullName: 'Jane Doe',
        monthExpiration: 12,
        yearExpiration: 2023,
      },
    ],
  },
]

export const sampleCarouselItems: CarouselItem[] = [
  {
    src: '../public/images/bedroom.png',
    alt: 'Elegant Bedroom Design',
    caption: 'Explore our latest bedroom furniture collections',
  },
  {
    src: '../public/images/garden.png',
    alt: 'Serene Garden Furniture',
    caption: 'Discover the beauty of outdoor living with our garden range',
  },
  {
    src: '../public/images/livingroom.png',
    alt: 'Modern Living Room',
    caption: 'Transform your living space with our contemporary designs',
  },
]

export const sampleContacts: Contact[] = [
  {
    mail: 'contact@example.com',
    subject: 'Inquiry about product availability',
    message: 'I would like to know when the MACLEOD sofa will be back in stock. Thank you.',
  },
  {
    mail: 'feedback@example.com',
    subject: 'Feedback on recent purchase',
    message: 'I recently purchased the NESSIE sofa and am extremely satisfied with the quality. Thank you!',
  },
  {
    mail: 'support@example.com',
    subject: 'Issue with delivery',
    message: 'My order for the THISTLE sofa was delayed, and I would like to inquire about the new delivery date.',
  },
]

export const sampleStocks: Stock[] = [
  {
    product: sampleProducts.find(product => product.slug === 'macleod')! as DocumentType<Product>,
    quantity: 5,
  },
  {
    product: sampleProducts.find(product => product.slug === 'nessie')! as DocumentType<Product>,
    quantity: 3,
  },
  {
    product: sampleProducts.find(product => product.slug === 'thistle')! as DocumentType<Product>,
    quantity: 8,
  },
  {
    product: sampleProducts.find(product => product.slug === 'glen')! as DocumentType<Product>,
    quantity: 10,
  },
  {
    product: sampleProducts.find(product => product.slug === 'wallace')! as DocumentType<Product>,
    quantity: 2,
  },
  {
    product: sampleProducts.find(product => product.slug === 'heather')! as DocumentType<Product>,
    quantity: 4,
  },
  {
    product: sampleProducts.find(product => product.slug === 'skye')! as DocumentType<Product>,
    quantity: 1,
  },
]

export const sampleOrders: Order[] = [
  {
    _id: '60d0fe4f5311236168a109e0',
    orderNumber: '1001',
    orderItems: [
      {
        name: 'MACLEOD',
        quantity: 1,
        image: '../public/images/blue-3-seater-sofa.png',
        price: 200,
        product: sampleProducts.find(product => product.slug === 'macleod') as any,
      },
    ],
    shippingAddress: {
      _id: '60d0fe4f5311236168a109f1',
      user: 'Admin User',
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'USA',
      phone: '555-1234',
    } as ShippingAddress,
    user: sampleUsers.find(user => user.email === 'admin@example.com') as any,
    paymentMethod: 'PayPal',
    itemsPrice: 200,
    shippingPrice: 20,
    taxPrice: 0,
    totalPrice: 220,
    isPaid: true,
    paidAt: new Date('2023-01-01'),
    isDelivered: true,
    deliveredAt: new Date('2023-01-05'),
    status: OrderStatus.Delivered,
  },
]