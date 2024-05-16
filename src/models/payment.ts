import { prop, getModelForClass } from "@typegoose/typegoose";

enum PaymentStatus {
  Accepted = "accepted",
  Refused = "refused",
}

export class Payment {
  public _id?: string;

  @prop({ required: true })
  public status!: PaymentStatus;
  
  @prop({ required: true })
  public orderNumber!: string;

  @prop({ default: new Date() })
  public updatedAt!: Date;
}

export class PaymentCard {
  public _id?: string;

  @prop({ required: true })
  public bankName!: string;

  @prop({ required: true })
  public number!: string;

  @prop({ required: true })
  public fullName!: string;

  @prop({ required: true })
  public monthExpiration!: number;

  @prop({ required: true })
  public yearExpiration!: number;

  @prop({ required: true, default: false })
  public isDefault!: boolean;
} 

export const PaymentModel = getModelForClass(Payment);
export const PaymentCardModel = getModelForClass(PaymentCard);
