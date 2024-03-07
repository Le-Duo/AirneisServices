import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Product } from './product';

class FeaturedProduct {
  @prop({ ref: () => Product, required: true })
  public product!: Ref<Product>;

  @prop({ required: true })
  public order!: number;
}

const FeaturedProductModel = getModelForClass(FeaturedProduct, { schemaOptions: { timestamps: true } });

export { FeaturedProductModel };