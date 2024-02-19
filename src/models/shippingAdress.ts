import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { collection: 'shippingAdresses', timestamps: true } })
export class ShippingAdress {
    public _id?: string

    @prop({ required: true })
    public firstName!: string

    @prop({ required: true })
    public lastName!: string

    @prop({ required: true })
    public street!: string

    public street2?: string
    
    @prop({ required: true })
    public city!: string
    
    @prop({ required: true })
    public postalCode!: string
    
    @prop({ required: true })
    public country!: string

    @prop({ required: true })
    public phone!: string
    }

export const ShippingAdressModel = getModelForClass(ShippingAdress)