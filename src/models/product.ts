/**
 * J'ai choisi d'utiliser Typegoose pour définir les modèles de notre application car il offre une excellente compatibilité avec TypeScript.
 * Ce fichier définit le modèle de produit pour notre API REST. Il représente la structure des données que nous stockerons dans notre base de données MongoDB.
 * Chaque produit contient des informations sur le nom, le slug, l'image, la catégorie, la description, la marque, le prix et le nombre en stock.
 */

import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
  public _id?: string

  @prop({ required: true })
  public name!: string

  @prop({ required: true, unique: true })
  public slug!: string

  @prop({ required: true })
  public image!: string

  @prop({ required: true })
  public category!: string

  @prop({ required: true })
  public description!: string

  @prop({ required: true })
  public brand!: string

  @prop({ required: true, default: 0 })
  public price!: number

  @prop({ required: true, default: 0 })
  public countInStock!: number
}

export const ProductModel = getModelForClass(Product)
