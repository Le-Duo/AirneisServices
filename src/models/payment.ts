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
  public orderNumber!: String;

  @prop({ default: new Date() })
  public updatedAt!: Date;
}

export const PaymentModel = getModelForClass(Payment);
