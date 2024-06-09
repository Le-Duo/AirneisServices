import {
  modelOptions,
  prop,
  getModelForClass,
  DocumentType,
} from '@typegoose/typegoose'
import { Product } from './product'

@modelOptions({ schemaOptions: { collection: 'stock', timestamps: true } })
export class Stock {

  public _id?: string

  @prop({ required: true, type: () => Product })
  public product!: DocumentType<Product>

  @prop({ required: true, default: 0 })
  public quantity!: number
}

export const StockModel = getModelForClass(Stock)
