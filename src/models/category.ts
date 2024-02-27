import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    collection: 'categories',
    timestamps: true,
  },
})
export class Category {
  public _id?: string

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public slug!: string

  @prop()
  public urlImage?: string
}

export const CategoryModel = getModelForClass(Category)
