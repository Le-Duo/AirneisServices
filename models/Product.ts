import { Types } from 'mongoose'

export type Product = {
    productName: string
    productDescription: string
    productMaterials: Array<string>
    productPrice: number
    productQuantity: number
    productImageDescription: string
    ProductCategory: Types.ObjectId
    createdAt: Date
    updatedAt: Date
}