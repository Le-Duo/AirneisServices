/**
 * J'ai choisi d'utiliser Typegoose pour définir les modèles de notre application car il offre une excellente compatibilité avec TypeScript.
 * Ce fichier définit le modèle de produit pour notre API REST. Il représente la structure des données que nous stockerons dans notre base de données MongoDB.
 * Chaque produit contient des informations sur le nom, le slug, l'image, la catégorie, la description, la marque, le prix et le nombre en stock.
 */

import {
  modelOptions,
  prop,
  getModelForClass,
  DocumentType,
} from "@typegoose/typegoose";
import { Category } from "./category";

@modelOptions({ schemaOptions: { collection: "products" } })
export class Product {
  public _id?: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public slug!: string;

  @prop({ required: true })
  public URLimage!: string;

  @prop({ type: () => Category, required: true })
  public category!: DocumentType<Category>; //Ne pas utiliser Ref<> : Ref<> ne garde que l'ID mongo, nous voulons la Category entiere

  @prop({ required: true })
  public description!: string;

  @prop({ required: true, type: () => [String] })
  public materials!: string[];

  @prop({ required: true, default: 0 })
  public price!: number;
}

export const ProductModel = getModelForClass(Product);
