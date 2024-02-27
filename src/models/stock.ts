import {
  modelOptions,
  prop,
  getModelForClass,
  DocumentType,
} from '@typegoose/typegoose'
import { Product } from './product'

@modelOptions({ schemaOptions: { collection: 'stock', timestamps: true } })
export class Stock {
  @prop()
  public _id?: string

  @prop({ required: true, type: () => Product })
  public product!: DocumentType<Product> //Ne pas utiliser Ref<> : Ref<> ne garde que l'ID mongo, nous voulons le Product entier

  @prop({ required: true, default: 0 })
  public quantity!: number
}

export const StockModel = getModelForClass(Stock)
