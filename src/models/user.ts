/**
 * J'ai choisi d'utiliser Typegoose pour définir les modèles de notre application car il offre une excellente compatibilité avec TypeScript.
 * Ce fichier définit le modèle utilisateur pour notre API REST. Il représente la structure des données que nous stockerons dans notre base de données MongoDB.
 * Chaque utilisateur contient des informations sur le nom, l'email, le mot de passe et le statut d'administrateur.
 */

import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  public _id?: string
  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public email!: string

  @prop({ required: true })
  public password!: string
  @prop({ default: false })
  public isAdmin!: boolean
}
export const UserModel = getModelForClass(User)
