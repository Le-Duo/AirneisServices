/**
 * J'ai choisi d'utiliser TypeScript, Express et bcryptjs pour construire cette API REST car ils offrent une excellente compatibilité et des fonctionnalités robustes.
 * Ce fichier, 'data.ts', contient des données d'échantillon pour les produits et les utilisateurs qui sont utilisées pour peupler la base de données lors de l'initialisation de l'application.
 * Les produits et les utilisateurs sont définis avec leurs attributs respectifs, tels que le nom, l'image, la catégorie, la marque, le prix, le stock pour les produits et le nom, l'email, le mot de passe pour les utilisateurs.
 */

// ONLY FOR TEST //
import { DocumentType } from '@typegoose/typegoose'
import { Category, CategoryModel } from './models/category'
import { Product } from './models/product'
import { User } from './models/user'
import bcrypt from 'bcryptjs'



export const sampleProducts: Product[] = [
  {
    name: 'MACLEOD',
    slug: 'macleod',
    URLimage: '../public/images/blue-3-seater-sofa.png',
    category: (CategoryModel.findById("658ad8a0c5f1cecc0b52d46d")) as unknown as DocumentType<Category>, //récupère une categorie dont l'id est 658ad8a0c5f1cecc0b52d46d + le cast en type "unknow" (selon mongoose) et ensuite le cast en type voulu qui est DocumentType<Category>
    brand: 'Airneis',
    price: 200,
    description: 'Blue 3 seater sofa',
  },
  {
    name: 'NESSIE',
    slug: 'nessie',
    URLimage: '../public/images/red-2-seater-sofa-in-living-room.png',
    category: (CategoryModel.findById("658ad8a0c5f1cecc0b52d46d")) as unknown as DocumentType<Category>,
    brand: 'Airneis',
    price: 150,
    description: 'Red 2 seater sofa',
  },
  {
    name: 'THISTLE',
    slug: 'thistle',
    URLimage: '../public/images/single-seat-green-sofa-in-living-room.png',
    category: (CategoryModel.findById("658ad8a0c5f1cecc0b52d46d")) as unknown as DocumentType<Category>,
    brand: 'Airneis',
    price: 100,
    description: 'Green 1 seater sofa',
  },
  {
    name: 'GLEN',
    slug: 'glen',
    URLimage: '../public/images/modern-brown-coffee-table (1).png',
    category: (CategoryModel.findById("658ad8a0c5f1cecc0b52d46d")) as unknown as DocumentType<Category>,
    brand: 'Airneis',
    price: 80,
    description: 'Brown coffee table',
  },
  {
    name: 'WALLACE',
    slug: 'wallace',
    URLimage:
      '../public/images/bookcase-with-a-wooden-finish-and-a-metal-frame.png',
    category: (CategoryModel.findById("658ad8a0c5f1cecc0b52d46d")) as unknown as DocumentType<Category>,
    brand: 'Airneis',
    price: 80,
    description: 'bookcase with a wooden finish and a metal frame.',
  },
  {
    name: 'HEATHER',
    slug: 'heather',
    URLimage: '../public/images/modern-purple-rug-with-floral-pattern.png',
    category: (CategoryModel.findById("658ad8a0c5f1cecc0b52d46d")) as unknown as DocumentType<Category>,
    brand: 'Airneis',
    price: 35,
    description: 'rug with a woolen texture and a purple colour',
  },
  {
    name: 'STIRLING',
    slug: 'stirling',
    URLimage:
      '../public/images/ad-of-a-lamp-with-glass-shade-and-thin-silver-base.png',
    category: (CategoryModel.findById("658ad8a0c5f1cecc0b52d46d")) as unknown as DocumentType<Category>,
    brand: 'Airneis',
    price: 20,
    description: 'lamp with glass shade and thin silver base',
  },
  {
    name: 'SKYE',
    slug: 'skye',
    URLimage: '../public/images/wardrobe-with-a-white-colour-and-3-doors.png',
    category: (CategoryModel.findById("658ad8a0c5f1cecc0b52d46d")) as unknown as DocumentType<Category>,
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
