/**
 * J'ai choisi d'utiliser TypeScript, Express et bcryptjs pour construire cette API REST car ils offrent une excellente compatibilité et des fonctionnalités robustes.
 * Ce fichier, 'data.ts', contient des données d'échantillon pour les produits et les utilisateurs qui sont utilisées pour peupler la base de données lors de l'initialisation de l'application.
 * Les produits et les utilisateurs sont définis avec leurs attributs respectifs, tels que le nom, l'image, la catégorie, la marque, le prix, le stock pour les produits et le nom, l'email, le mot de passe pour les utilisateurs.
 */

import { Category } from './models/category'
import { Product } from './models/product'
import { User } from './models/user'
import bcrypt from 'bcryptjs'

export const sampleProducts: Product[] = [
  {
    name: 'MACLEOD',
    URLimage: '../public/images/blue-3-seater-sofa.png',
    category: new Category("Sofa", "./images/categories/sofa"),
    brand: 'Airneis',
    price: 200,
    description: 'Blue 3 seater sofa',
  },
  {
    name: 'NESSIE',
    URLimage: '../public/images/red-2-seater-sofa-in-living-room.png',
    category: new Category("Sofa", "./images/categories/sofa"),
    brand: 'Airneis',
    price: 150,
    description: 'Red 2 seater sofa',
  },
  {
    name: 'THISTLE',
    URLimage: '../public/images/single-seat-green-sofa-in-living-room.png',
    category: new Category("Sofa", "./images/categories/sofa"),
    brand: 'Airneis',
    price: 100,
    description: 'Green 1 seater sofa',
  },
  {
    name: 'GLEN',
    URLimage: '../public/images/modern-brown-coffee-table (1).png',
    category: new Category("Table", "./images/categories/table"),
    brand: 'Airneis',
    price: 80,
    description: 'Brown coffee table',
  },
  {
    name: 'WALLACE',
    URLimage:
      '../public/images/bookcase-with-a-wooden-finish-and-a-metal-frame.png',
    category: new Category("Bookcase", "./images/categories/sofa"),
    brand: 'Airneis',
    price: 80,
    description: 'bookcase with a wooden finish and a metal frame.',
  },
  {
    name: 'HEATHER',
    URLimage: '../public/images/modern-purple-rug-with-floral-pattern.png',
    category: new Category("Rugs", "./images/categories/rugs"),
    brand: 'Airneis',
    price: 35,
    description: 'rug with a woolen texture and a purple colour',
  },
  {
    name: 'STIRLING',
    URLimage:
      '../public/images/ad-of-a-lamp-with-glass-shade-and-thin-silver-base.png',
    category: new Category("Lamps", "./images/categories/lamp"),
    brand: 'Airneis',
    price: 20,
    description: 'lamp with glass shade and thin silver base',
  },
  {
    name: 'SKYE',
    URLimage: '../public/images/wardrobe-with-a-white-colour-and-3-doors.png',
    category: new Category("Wardrobe", "./images/categories/wardrobe"),
    brand: 'Airneis',
    price: 200,
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
