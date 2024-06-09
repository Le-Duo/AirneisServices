
import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'
import { PaymentCard } from '../models/payment'

export class UserAddress {

  public _id?: string;
  
  @prop({ default: '' })
  public street!: string
  @prop({ default: '' })
  public city!: string
  @prop({ default: '' })
  public postalCode!: string
  @prop({ default: '' })
  public country!: string
  @prop({ required: true, default: false })
  public isDefault!: boolean
}

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
export class User {
  @prop({ required: false, auto: true })
  public _id?: string
  
  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public email!: string

  @prop({ required: false, default: '' })
  public phoneNumber?: string

  @prop({ required: true })
  public password!: string

  @prop({ default: false })
  public isAdmin!: boolean

  @prop({ type: () => [UserAddress], required: false })
  public addresses?: UserAddress[]

  @prop({ type: () => [PaymentCard], required: false })
  public paymentCards?: PaymentCard[]

  @prop()
  public passwordResetTokenJti?: string
}
export const UserModel = getModelForClass(User)
export const UserAddressModel = getModelForClass(UserAddress)
