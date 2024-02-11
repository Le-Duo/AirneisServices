import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    collection: 'categories',
    timestamps: true, // Enable automatic handling of createdAt and updatedAt fields
  },
})
export class Category {
  constructor(_name: string, _URLimage: string) {
    this.name = _name
    this.urlImage = _URLimage
  }

  public _id?: string

  @prop({ required: true })
  public name!: string

  @prop()
  public urlImage?: string
}

export const CategoryModel = getModelForClass(Category)
