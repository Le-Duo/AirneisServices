/**
 * J'ai choisi d'utiliser Typegoose pour définir les modèles de notre application car il offre une excellente compatibilité avec TypeScript.
 * Ce fichier définit le modèle utilisateur pour notre API REST. Il représente la structure des données que nous stockerons dans notre base de données MongoDB.
 * Chaque utilisateur contient des informations sur le nom, l'email, le mot de passe et le statut d'administrateur.
 */

import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'
import {PaymentCard } from '../models/payment'

export class UserAddress {
  @prop({default: ''})
  public street!: string
  @prop({default: ''})
  public city!: string
  @prop({default: ''})
  public postalCode!: string // Assuming postalCode is preferred over zipCode for consistency with develop branch
  @prop({default: ''})
  public country!: string
}

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
export class User {
  public _id?: string
  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public email!: string

  // Must be required: false
  // Quand on veut utilisr un user pour passer un order, il ne faudrait pas obligatoirement fournir son MDP
  @prop({ required: true })
  public password!: string

  @prop({ default: false })
  public isAdmin!: boolean

  @prop({ required: false })
  public address!: UserAddress

  @prop({ required: false })
  public paymentCards!: PaymentCard[]

  @prop()
  public passwordResetTokenJti?: string // Field to track jti of password reset token
}
export const UserModel = getModelForClass(User)
export const UserAddressModel = getModelForClass(UserAddress)
