# Technical Details
## To run Àirneis successfully, ensure you have the following dependencies installed:

* install Node > LTS Version (https://nodejs.org/en/download)
* install Mongoose v7.6.3
  	* ```npm i mongoose@7.6.3```
* install @typegoose/typegoose
    * ```npm i @typegoose/typegoose```
* install vite v5.0.4
    * ```npm i vite```
* install react v18.2.0
    * ```npm i react```
* install Eslint v8.55.0
    * ```npm i eslint```
* install Prettier v3.1.0
    * ```npm i prettier```
* install Express v4.18.2
    * ```npm i express```
* install Axios v1.6.2
    * ```npm i axios```
* install Cors v2.8.5
    * ```npm i cors```
* install Nodemon v3.0.2
    * ```npm i nodemon```
* install Bcrypt v5.1.1
    * ```npm i bcrypt```
* install JsonWebToken (JWT) v9.0.2
    * ```npm i jsonwebtoken```
* install Dotenv v16.3.1
    * ```npm i dotenv```
* install uuid v9.0.1
    * ```npm i uuid```
* install i18next v23.11.2
    * ```npm i i18next```
* install i18next-http-middleware v3.5.0
    * ```npm i i18next-http-middleware```
* install helmet v7.1.0
    * ```npm i helmet```
* install supertest v7.0.0
    * ```npm i supertest```
* install jest v29.7.0
    * ```npm i jest```
* install ts-jest v29.1.2
    * ```npm i ts-jest```
* install ts-node v10.9.1
    * ```npm i ts-node```
* install ts-node-dev v2.0.0
    * ```npm i ts-node-dev```
* install typescript v5.3.2
    * ```npm i typescript```

## Useful extensions

* GitHub Codespaces v1.16.2
* MongoDB for VS Code v1.3.1

# Installation

### 1. Clone the Repository:
  * ```git clone https://github.com/Le-Duo/AirneisServices.git```
  * ```cd AirneisServices```
 
### 2. Install Node.js Packages:
  * ```npm install```
    
### 3. Set Up MongoDB:
  * Ensure MongoDB is running.
  * Use connection string to connect with database

### 4. Start the Application:
  * ```npm run dev``` or ```npm install && tsc && node build/src/index.js```
  * The application should now be running locally.
  * Access it by navigating to http://localhost:4000 in your web browser.

# API Endpoints

## Status
* `GET /api/status` - Check if the API is running.

## Products
* `GET /api/products` - Get all products.
* `GET /api/products/slug/:slug` - Get a product by slug.
* `GET /api/products/id/:id` - Get a product by ID.
* `GET /api/products/similar/:categoryId/:productId` - Get similar products.
* `GET /api/products/search` - Search for products.
* `POST /api/products` - Create a new product (Admin only).
* `PUT /api/products/:productId` - Update a product (Admin only).
* `DELETE /api/products/:id` - Delete a product (Admin only).

## Categories
* `GET /api/categories` - Get all categories.
* `GET /api/categories/:id` - Get a category by ID.
* `GET /api/categories/slug/:slug` - Get a category by slug.
* `POST /api/categories` - Create a new category (Admin only).
* `PUT /api/categories/:id` - Update a category (Admin only).
* `DELETE /api/categories/:id` - Delete a category (Admin only).

## Carousel Items
* `GET /api/carousel` - Get all carousel items.
* `GET /api/carousel/:id` - Get a carousel item by ID.
* `POST /api/carousel` - Create a new carousel item.
* `PUT /api/carousel/:id` - Update a carousel item.
* `DELETE /api/carousel/:id` - Delete a carousel item.

## Contacts
* `GET /api/contact` - Get all contacts.
* `GET /api/contact/message/:messageId` - Get a contact message by ID.
* `POST /api/contact` - Create a new contact message.
* `DELETE /api/contact/:id` - Delete a contact message.

## Featured Products
* `GET /api/featuredProducts` - Get all featured products.
* `GET /api/featuredProducts/:id` - Get a featured product by ID.
* `POST /api/featuredProducts` - Create a new featured product (Admin only).
* `PUT /api/featuredProducts/:id` - Update a featured product (Admin only).
* `DELETE /api/featuredProducts/:id` - Delete a featured product (Admin only).

## Orders
* `GET /api/orders` - Get all orders.
* `GET /api/orders/mine` - Get orders of the authenticated user.
* `GET /api/orders/average-basket-by-category` - Get average basket by category.
* `GET /api/orders/:id` - Get an order by ID.
* `GET /api/orders/order/:orderNumber` - Get an order by order number.
* `POST /api/orders` - Create a new order.
* `PUT /api/orders/:ordernumber` - Update an order.
* `DELETE /api/orders/:id` - Delete an order.

## Shipping Addresses
* `GET /api/shippingaddresses` - Get all shipping addresses of the authenticated user.
* `GET /api/shippingaddresses/:id` - Get a shipping address by ID.
* `POST /api/shippingaddresses` - Create a new shipping address.
* `PUT /api/shippingaddresses/:id` - Update a shipping address.
* `DELETE /api/shippingaddresses/:id` - Delete a shipping address.

## Stocks
* `GET /api/stocks` - Get all stocks.
* `GET /api/stocks/products/:productId` - Get stock by product ID.
* `POST /api/stocks` - Create or update stock (Admin only).
* `PUT /api/stocks/products/:productId` - Update stock by product ID (Admin only).
* `DELETE /api/stocks/products/:productId` - Delete stock by product ID (Admin only).

## Users
* `GET /api/users` - Get all users.
* `GET /api/users/:id` - Get a user by ID.
* `PUT /api/users/:id` - Update a user.
* `POST /api/users/:id/address/add` - Add a new address to a user.
* `PUT /api/users/:id/address/:idAddress/default` - Set a default address for a user.
* `PUT /api/users/:id/address/:addressId` - Update an address of a user.
* `POST /api/users/:id/payment/card/add` - Add a new payment card to a user.
* `PUT /api/users/:id/payment/card/:idCard/default` - Set a default payment card for a user.
* `DELETE /api/users/:id` - Delete a user.
* `POST /api/users/signin` - Sign in a user.
* `POST /api/users/signup` - Sign up a new user.
* `POST /api/users/password-reset-request` - Request a password reset.
* `POST /api/users/password-reset` - Reset a password.

## Seed
* `GET /api/seed/all` - Seed all data.
* `GET /api/seed/categories` - Seed categories.
* `GET /api/seed/products` - Seed products.
* `GET /api/seed/users` - Seed users.
* `GET /api/seed/carousel-items` - Seed carousel items.
* `GET /api/seed/stocks` - Seed stocks.
* `GET /api/seed/orders` - Seed orders.
* `GET /api/seed/contacts` - Seed contacts.

# Environment Variables
Ensure you have the following environment variables set in your `.env` file:

MONGODB_URI=<your_mongodb_uri>
LOCAL_MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=<your_jwt_secret>
PORT=4000
MAILTRAP_USER=<your_mailtrap_user>
MAILTRAP_PASS=<your_mailtrap_pass>
STRIPE_SECRET_KEY=<your_stripe_secret_key> (not implemented yet)