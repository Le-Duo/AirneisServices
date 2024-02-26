import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

export enum PaymentStatus {
  Accepted = 'accepted',
  Refused = 'refused',
}

export class Payment {
  public _id?: string

  @prop({ required: true })
  public status!: PaymentStatus

  @prop({ required: true })
  public orderNumber!: String

  @prop({ required: false, default: new Date() })
  public updatedAt!: Date
}

export const PaymentModel = getModelForClass(Payment)
