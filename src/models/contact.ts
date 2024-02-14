import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "contacts" } })
export class Contact {

  public _id?: string;

  @prop({ required: true })
  public mail!: string;

  @prop({ required: true })
  public subject!: string;

  @prop({ required: true })
  public message!: string;

  constructor(mail: string, subject: string, message: string) {
    this.mail = mail;
    this.subject = subject;
    this.message = message;
  }
}

export const ContactModel = getModelForClass(Contact);