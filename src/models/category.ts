import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { collection: 'categories' } })
export class Category {

    constructor(_name: string, _URLimage: string) {
        this.name = _name;
        this.urlImage = _URLimage;
    }


    public _id?: string

    @prop({ required: true })
    public name!: string

    @prop({ required: true })
    public urlImage!: string
}

export const ProductModel = getModelForClass(Category)