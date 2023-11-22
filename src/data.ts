/**
 * J'ai choisi d'utiliser TypeScript, Express et bcryptjs pour construire cette API REST car ils offrent une excellente compatibilité et des fonctionnalités robustes.
 * Ce fichier, 'data.ts', contient des données d'échantillon pour les produits et les utilisateurs qui sont utilisées pour peupler la base de données lors de l'initialisation de l'application.
 * Les produits et les utilisateurs sont définis avec leurs attributs respectifs, tels que le nom, l'image, la catégorie, la marque, le prix, le stock pour les produits et le nom, l'email, le mot de passe pour les utilisateurs.
 */

import { Product } from './models/product'
import { User } from './models/user'
import bcrypt from 'bcryptjs'

export const sampleProducts: Product[] = [
  {
    name: 'MACLEOD',
    slug: 'macleod',
    image: '../public/images/blue-3-seater-sofa.png',
    category: 'Sofas',
    brand: 'Airneis',
    price: 200,
    countInStock: 10,
    description: 'Blue 3 seater sofa',
  },
  {
    name: 'NESSIE',
    slug: 'nessie',
    image: '../public/images/red-2-seater-sofa-in-living-room.png',
    category: 'Sofas',
    brand: 'Airneis',
    price: 150,
    countInStock: 20,
    description: 'Red 2 seater sofa',
  },
  {
    name: 'THISTLE',
    slug: 'thisle',
    image: '../public/images/single-seat-green-sofa-in-living-room.png',
    category: 'Sofas',
    brand: 'Airneis',
    price: 100,
    countInStock: 0,
    description: 'Green 1 seater sofa',
  },
  {
    name: 'GLEN',
    slug: 'glen',
    image: '../public/images/modern-brown-coffee-table (1).png',
    category: 'Tables',
    brand: 'Airneis',
    price: 80,
    countInStock: 15,
    description: 'Brown coffee table',
  },
  {
    name: 'WALLACE',
    slug: 'wallace',
    image:
      '../public/images/bookcase-with-a-wooden-finish-and-a-metal-frame.png',
    category: 'Bookcases',
    brand: 'Airneis',
    price: 80,
    countInStock: 15,
    description: 'bookcase with a wooden finish and a metal frame.',
  },
  {
    name: 'HEATHER',
    slug: 'heather',
    image: '../public/images/modern-purple-rug-with-floral-pattern.png',
    category: 'Rugs',
    brand: 'Airneis',
    price: 35,
    countInStock: 0,
    description: 'rug with a woolen texture and a purple colour',
  },
  {
    name: 'STIRLING',
    slug: 'stirling',
    image:
      '../public/images/ad-of-a-lamp-with-glass-shade-and-thin-silver-base.png',
    category: 'Lamps',
    brand: 'Airneis',
    price: 20,
    countInStock: 15,
    description: 'lamp with glass shade and thin silver base',
  },
  {
    name: 'SKYE',
    slug: 'skye',
    image: '../public/images/wardrobe-with-a-white-colour-and-3-doors.png',
    category: 'Wardrobes',
    brand: 'Airneis',
    price: 200,
    countInStock: 15,
    description: 'wardrobe with a white colour and a mirrored door',
  },
]

export const sampleUsers: User[] = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: true,
  },
  {
    name: 'User One',
    email: 'userone@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: false,
  },
  {
    name: 'User Two',
    email: 'usertwo@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: false,
  },
]
