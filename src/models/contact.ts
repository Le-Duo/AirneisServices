import { modelOptions, prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from './user'

@modelOptions({ schemaOptions: { collection: 'contacts' } })
export class Contact {

  public _id?: string

  @prop({ required: true })
  public mail!: string

  @prop({ required: true })
  public subject!: string

  @prop({ required: true })
  public message!: string

  @prop({ ref: () => User })
  public user?: Ref<User>
}

export const ContactModel = getModelForClass(Contact)
