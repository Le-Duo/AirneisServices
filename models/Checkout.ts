import { Types } from 'mongoose'

export type Checkout = {
    CardName: string
    CardNumber: number
    CardExpirationDate: Date
    CardSecurityCode: number
    CardUser: Types.ObjectId
}