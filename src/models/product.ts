import {
  modelOptions,
  prop,
  getModelForClass,
  DocumentType,
} from '@typegoose/typegoose';
import { Category } from './category';

@modelOptions({ schemaOptions: { collection: 'products', timestamps: true } })
export class Product {

  public _id?: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public slug!: string;

  @prop({ type: () => [String] })
  public URLimages?: string[];

  @prop({ required: true, type: () => Category })
  public category!: DocumentType<Category>;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true, type: () => [String] })
  public materials!: string[];

  @prop({ required: true, default: 0 })
  public price!: number;

  @prop({ required: true, default: false })
  public priority!: boolean;
}

export const ProductModel = getModelForClass(Product);