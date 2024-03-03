import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { collection: 'contacts' } })
export class Contact {
  @prop()
  public _id?: string

  @prop({ required: true })
  public mail!: string

  @prop({ required: true })
  public subject!: string

  @prop({ required: true })
  public message!: string
}

export const ContactModel = getModelForClass(Contact)
