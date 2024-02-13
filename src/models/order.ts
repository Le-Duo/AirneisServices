import {
  modelOptions,
  prop,
  getModelForClass,
  Ref,
  DocumentType,
} from '@typegoose/typegoose'
import { Product } from './product'
import { User } from './user'
import { Payment } from './payment'

enum OrderStatus {
  Initiated = 'initiated',
  Pending = 'pending',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

class ShippingAddress {
  @prop({ required: true })
  public fullName!: string
  @prop({ required: true })
  public address!: string
  @prop({ required: true })
  public city!: string
  @prop({ required: true })
  public postalCode!: string // Assuming postalCode is preferred over zipCode for consistency with develop branch
  @prop({ required: true })
  public country!: string
  @prop()
  public lat?: number
  @prop()
  public lng?: number
}

class Item {
  @prop({ required: true })
  public name!: string
  @prop({ required: true })
  public quantity!: number // Assuming quantity should be a number
  @prop({ required: true })
  public image!: string
  @prop({ required: true })
  public price!: number
  @prop({ ref: () => Product })
  public product?: Ref<Product>
}

class PaymentResult {
  @prop()
  public paymentId!: string
  @prop()
  public status!: string
  @prop()
  public update_time!: string
  @prop()
  public email_address!: string
}

@modelOptions({ schemaOptions: { collection: 'orders', timestamps: true } })
export class Order {
  public _id!: string

  @prop({ type: () => [Item], required: true })
  public orderItems!: Item[]
  @prop({ type: () => ShippingAddress, required: true })
  public shippingAddress!: ShippingAddress

  @prop({ ref: () => User, required: true })
  public user!: Ref<User>

  @prop({ required: true })
  public paymentMethod!: string
  @prop()
  public paymentResult?: PaymentResult

  @prop({ required: true, default: 0 })
  public itemsPrice!: number
  @prop({ required: true, default: 0 })
  public shippingPrice!: number
  @prop({ required: true, default: 0 })
  public taxPrice!: number
  @prop({ required: true, default: 0 })
  public totalPrice!: number

  @prop({ required: true, default: false })
  public isPaid!: boolean
  @prop()
  public paidAt?: Date

  @prop({ required: true, default: false })
  public isDelivered!: boolean
  @prop()
  public deliveredAt?: Date

  @prop({ required: true, default: OrderStatus.Initiated })
  public status!: OrderStatus
}

export const OrderModel = getModelForClass(Order)
