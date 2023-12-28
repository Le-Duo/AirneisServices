
import { modelOptions, prop, getModelForClass, DocumentType } from '@typegoose/typegoose'
import { Product, ProductModel } from './product';

@modelOptions({ schemaOptions: { collection: 'stock' } })
export class Stock {
  public _id?: string;

  @prop({ type: () => Product, required: true })
  public product!: DocumentType<Product>; //Ne pas utiliser Ref<> : Ref<> ne garde que l'ID mongo, nous voulons le Product entier

  @prop({ required: true, default: 0 })
  public quantity!: number;

}

export const StockModel = getModelForClass(Stock);