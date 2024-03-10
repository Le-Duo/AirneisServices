import { prop, getModelForClass, DocumentType } from "@typegoose/typegoose";

enum PaymentStatus {
  Accepted = "accepted",
  Refused = "refused",
}

export class Payment {
  public _id?: string;

  @prop({ required: true })
  public status!: PaymentStatus;
  
  @prop({ required: true })
  public orderNumber!: String;

  @prop({ required: false, default: new Date() })
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
} 

export const PaymentModel = getModelForClass(Payment);
export const PaymentCardModel = getModelForClass(PaymentCard);
