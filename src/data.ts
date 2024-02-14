/**
 * J'ai choisi d'utiliser TypeScript, Express et bcryptjs pour construire cette API REST car ils offrent une excellente compatibilité et des fonctionnalités robustes.
 * Ce fichier, 'data.ts', contient des données d'échantillon pour les produits et les utilisateurs qui sont utilisées pour peupler la base de données lors de l'initialisation de l'application.
 * Les produits et les utilisateurs sont définis avec leurs attributs respectifs, tels que le nom, l'image, la catégorie, la marque, le prix, le stock pour les produits et le nom, l'email, le mot de passe pour les utilisateurs.
 */

import { DocumentType } from '@typegoose/typegoose'
import { Category } from './models/category'
import { Product } from './models/product'
import { User } from './models/user'
import bcrypt from 'bcryptjs'

export const sampleCategories: Category[] = [
  {
    _id: '60d0fe4f5311236168a109ca',
    name: 'Sofas',
    urlImage: '../public/images/sofa.png',
  },
  {
    _id: '60d0fe4f5311236168a109cb',
    name: 'Tables',
    urlImage: '../public/images/table.png',
  },
  {
    _id: '60d0fe4f5311236168a109cc',
    name: 'Bookcases',
    urlImage: '../public/images/bookcase.png',
  },
  {
    _id: '60d0fe4f5311236168a109cd',
    name: 'Rugs',
    urlImage: '../public/images/rug.png',
  },
  {
    _id: '60d0fe4f5311236168a109ce',
    name: 'Lamps',
    urlImage: '../public/images/lamp.png',
  },
  {
    _id: '60d0fe4f5311236168a109cf',
    name: 'Wardrobes',
    urlImage: '../public/images/wardrobe.png',
  },
]

const categoryMap = new Map(sampleCategories.map(cat => [cat._id, cat]));

export const sampleProducts: Product[] = [
  {
    name: 'MACLEOD',
    slug: 'macleod',
    URLimage: '../public/images/blue-3-seater-sofa.png',
    category: categoryMap.get("60d0fe4f5311236168a109ca") as DocumentType<Category>,
    materials: ['cotton', 'wood'],
    price: 200,
    description: 'Blue 3-seater sofa',
    priority: true,
  },
  {
    name: 'NESSIE',
    slug: 'nessie',
    URLimage: '../public/images/red-2-seater-sofa-in-living-room.png',
    category: categoryMap.get("60d0fe4f5311236168a109ca") as DocumentType<Category>,
    materials: ['cotton', 'wood'],
    price: 150,
    description: 'Red 2-seater sofa',
    priority: false,
  },
  {
    name: 'THISTLE',
    slug: 'thistle',
    URLimage: '../public/images/single-seat-green-sofa-in-living-room.png',
    category: categoryMap.get("60d0fe4f5311236168a109ca") as DocumentType<Category>,
    materials: ['cotton', 'wood'],
    price: 100,
    description: 'Green 1-seater sofa',
    priority: false,
  },
  {
    name: 'GLEN',
    slug: 'glen',
    URLimage: '../public/images/modern-brown-coffee-table (1).png',
    category: categoryMap.get("60d0fe4f5311236168a109cb") as DocumentType<Category>,
    materials: ['wood'],
    price: 80,
    description: 'Brown coffee table',
    priority: false,
  },
  {
    name: 'WALLACE',
    slug: 'wallace',
    URLimage:
      '../public/images/bookcase-with-a-wooden-finish-and-a-metal-frame.png',
    category: categoryMap.get("60d0fe4f5311236168a109cc") as DocumentType<Category>,
    materials: ['wood', 'metal'],
    price: 80,
    description: 'Bookcase with wooden finish and metal frame.',
    priority: false,
  },
  {
    name: 'HEATHER',
    slug: 'heather',
    URLimage: '../public/images/modern-purple-rug-with-floral-pattern.png',
    category: categoryMap.get("60d0fe4f5311236168a109cd") as DocumentType<Category>,
    materials: ['wool'],
    price: 35,
    description: 'Rug with a wool texture and a purple color',
    priority: false,
  },
  {
    name: 'STIRLING',
    slug: 'stirling',
    URLimage:
      '../public/images/ad-of-a-lamp-with-glass-shade-and-thin-silver-base.png',
    category: categoryMap.get("60d0fe4f5311236168a109ce") as DocumentType<Category>,
    materials: ['glass', 'metal'],
    price: 20,
    description: 'Lamp with glass shade and thin silver base',
    priority: false,
  },
  {
    name: 'SKYE',
    slug: 'skye',
    URLimage: '../public/images/wardrobe-with-a-white-colour-and-3-doors.png',
    category: categoryMap.get("60d0fe4f5311236168a109cf") as DocumentType<Category>,
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

