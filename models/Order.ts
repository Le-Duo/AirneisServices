import { Types } from 'mongoose'

export enum OrderStatus {
    Pending = 'pending',
    Delivered = 'delivered',
    Cancelled = 'cancelled'
}

export type Product = {
    productId: Types.ObjectId,
    quantity: number
}

export type Order = {
    orderNumber : number
    orderPrice : number
    orderStatus : OrderStatus
    orderDate : Date
    orderProducts : Array<Product>
    orderUser : Types.ObjectId
    CreatedAt : Date
    UpdatedAt : Date
}