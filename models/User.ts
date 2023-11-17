export enum UserRole {
    admin = 'admin',
    user = 'user'
}

export type Adress = {
    street1: string
    street2: string
    city: string
    region: string
    postalCode: string
    country: string
    phone: string
}

export type User = {
    userFirstName: string
    userLastName: string
    deliveryAdress: Adress
    billingAddress: Adress
    userEmail: string
    userPassword: string
    userRole: UserRole
    createdAt: Date
    updatedAt: Date
}