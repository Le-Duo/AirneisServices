/**
 * J'ai choisi d'utiliser Typegoose pour définir les modèles de notre application car il offre une excellente compatibilité avec TypeScript.
 * Ce fichier définit le modèle de commande pour notre API REST. Il représente la structure des données que nous stockerons dans notre base de données MongoDB.
 * Chaque commande contient des informations sur l'adresse de livraison, les articles commandés et le résultat du paiement.
 */
import { prop, getModelForClass, DocumentType } from "@typegoose/typegoose";
import { Product } from "./product";
import { Payment } from "./payment";
import { User } from "./user";

enum OrderStatus {
  Initiated = "initiated",
  Pending = "pending",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

export class Order {
  public _id?: string;

  @prop({ required: true })
  public orderNumber!: string;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true })
  public status!: OrderStatus;

  @prop({ required: false, default: new Date() })
  public createdAt?: Date;

  @prop({ required: false })
  public updatedAt?: Date;

  @prop({ type: () => ShippingAddress, required: true })
  public shippingAddress!: DocumentType<ShippingAddress>;

  @prop({ required: false })
  public payment?: Payment;

  @prop({ type: () => Product, required: true })
  public products!: DocumentType<Product>[];

  @prop({ type: () => User, required: true })
  public user!: DocumentType<User>;
}


class ShippingAddress {
  @prop({ required: true })
  public fullName?: string;
  @prop({ required: true })
  public address?: string;
  @prop({ required: true })
  public city?: string;
  @prop({ required: true })
  public zipCode?: number;
  @prop({ required: true })
  public country?: string;
}



export const OrderModel = getModelForClass(Order);
