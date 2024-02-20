import { modelOptions, prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from './user'

@modelOptions({ schemaOptions: { collection: 'shippingAddresses', timestamps: true } })
export class ShippingAddress {
    public _id?: string

    @prop({ ref: () => User, required: true })
    public user!: Ref<User>;

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

export const ShippingAddressModel = getModelForClass(ShippingAddress)