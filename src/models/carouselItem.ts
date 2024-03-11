import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { collection: 'carouselItems', timestamps: true },
})
export class CarouselItem {

  public _id?: string
  
  @prop({ required: true })
  public src!: string

  @prop({ required: true })
  public alt!: string

  @prop()
  public caption?: string
}

export const CarouselItemModel = getModelForClass(CarouselItem)
