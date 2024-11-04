# Subscription Management System with Stripe

<img src="./assets/Stripe Integration .png">

This project implements a subscription management system using Node.js, Express, and Stripe's API. It allows users to manage subscriptions, handle payments, and validate coupons easily.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Webhooks](#webhooks)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- View subscription plans and corresponding prices.
- Subscribe to plans with Stripe Checkout.
- Handle coupon validation.
- Redirect users to a billing portal for managing subscriptions.
- Listen to Stripe webhooks for subscription updates.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/subscription-management-system.git
   cd subscription-management-system
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment Variables**

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET_KEY=your_stripe_webhook_secret_key
   BASE_URL=http://localhost:3000
   ```

   Replace `your_stripe_secret_key` and `your_stripe_webhook_secret_key` with your actual Stripe keys.

## Usage

1. **Run the Server**

   ```bash
   npm start
   ```

   The server will start on port 3000.

2. **Access the Application**

   Open your web browser and go to `http://localhost:3000`.

## API Endpoints

### 1. Home Route

- **GET** `/`

  Renders the main page of the application.

### 2. Get Price by Product ID

- **GET** `/get-price/:productId`

  Retrieves price details for a specific product.

  **Parameters:**
  - `productId`: ID of the product.

### 3. Get All Prices

- **GET** `/api/get-all-prices`

  Fetches all active prices and their corresponding product names.

### 4. Subscribe to a Plan

- **GET** `/subscribe`

  Subscribes a user to a specific plan.

  **Query Parameters:**
  - `plan`: Name of the subscription plan.
  - `coupon` (optional): Coupon code to apply.

### 5. Success Route

- **GET** `/success`

  Displays a message upon successful subscription.

### 6. Cancel Route

- **GET** `/cancel`

  Redirects users back to the home page after canceling the subscription.

### 7. Customer Billing Portal

- **GET** `/customers/:customerId`

  Redirects to Stripe's billing portal for managing subscriptions.

### 8. Webhook

- **POST** `/webhook`

  Receives and handles webhook events from Stripe.

### 9. Validate Coupon

- **POST** `/validate-coupon`

  Validates if a coupon is valid.

  **Request Body:**
  - `coupon`: The coupon code to validate.

## Webhooks

This application listens for the following events from Stripe:

- `checkout.session.completed` - Triggered when a new subscription is started.
- `invoice.paid` - Triggered when an invoice is successfully paid.
- `invoice.payment_failed` - Triggered when an invoice payment fails.
- `customer.subscription.updated` - Triggered when a subscription is updated.

## Environment Variables

- `STRIPE_SECRET_KEY`: Your Stripe secret API key.
- `STRIPE_WEBHOOK_SECRET_KEY`: Your Stripe webhook secret key.
- `BASE_URL`: The base URL for your application (typically localhost during development).

## Contributing

Feel free to submit issues or pull requests. Ensure that your code adheres to the project's coding standards.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
