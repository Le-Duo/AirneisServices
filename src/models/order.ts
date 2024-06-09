import { modelOptions, prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Product } from "./product";
import { User } from "./user";
import { Category } from "./category";

export enum OrderStatus {
  Initiated = 'initiated',
  Pending = 'pending',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export class ShippingAddress {

  public _id?: string;

  @prop({ required: true })
  public fullName!: string;
  
  @prop({ required: true })
  public phoneNumber!: string;

  @prop({ required: true })
  public street!: string;

  @prop()
  public street2?: string;

  @prop({ required: true })
  public city!: string;

  @prop({ required: true })
  public postalCode!: string;

  @prop({ required: true })
  public country!: string;
}

export const ShippingAddressModel = getModelForClass(ShippingAddress);

export class Item {
  @prop({ required: true })
  public name!: string;
  @prop({ required: true })
  public quantity!: number;
  @prop({ required: false })
  public image?: string;

  @prop({ required: false })
  public category?: Category;

  @prop({ required: true })
  public price!: number;
  @prop({ ref: () => Product })
  public product?: Ref<Product>;
}

export class PaymentResult {
  @prop()
  public paymentId!: string;
  @prop()
  public status!: string;
  @prop()
  public update_time!: string;
  @prop()
  public email_address!: string;
}

@modelOptions({ schemaOptions: { collection: 'orders', timestamps: true } })
export class Order {
  public _id?: string;

  @prop({ required: true })
  public orderNumber!: string;

  @prop({ required: true, type: () => [Item] })
  public orderItems!: Item[];
  @prop({ required: true, type: () => ShippingAddress })
  public shippingAddress!: ShippingAddress;

  @prop({ ref: () => User, required: true })
  public user!: Ref<User>;

  @prop({ required: true })
  public paymentMethod!: string;
  @prop()
  public paymentResult?: PaymentResult;

  @prop({ required: true, default: 0 })
  public itemsPrice!: number;
  @prop({ required: true, default: 0 })
  public shippingPrice!: number;
  @prop({ required: true, default: 0 })
  public taxPrice!: number;
  @prop({ required: true, default: 0 })
  public totalPrice!: number;

  @prop({ required: true, default: false })
  public isPaid!: boolean;
  @prop()
  public paidAt?: Date;

  @prop({ required: true, default: false })
  public isDelivered!: boolean;
  @prop()
  public deliveredAt?: Date;

  @prop({ required: true, default: OrderStatus.Initiated })
  public status!: OrderStatus;
}

export const OrderModel = getModelForClass(Order)
