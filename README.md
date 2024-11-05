# Subscription Management System with Stripe

<img src="./assets/Stripe Integration .png">

Stripe Subscriptions with Node.js

This project demonstrates how to integrate Stripe subscriptions into a Node.js application using the Express framework. The application provides a front-end with a pricing table built using Bootstrap, along with features like coupon validation and plan status display.

Features
Displays a Bootstrap-based pricing table with multiple subscription plans.
Fetches and displays plan pricing dynamically from Stripe.
Highlights the active subscription plan.
Supports coupon validation to apply discounts on plans.
Prerequisites
Ensure you have the following installed:

Node.js
npm
A Stripe account with active subscription products and plans.
Getting Started
1. Clone the Repository
bash
Copy code
git clone https://github.com/your-username/stripe-subscriptions-nodejs.git
cd stripe-subscriptions-nodejs
2. Install Dependencies
bash
Copy code
npm install
3. Set Up Environment Variables
Create a .env file in the root of the project with the following variables:

   ```plaintext
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET_KEY=your_stripe_webhook_secret
   BASE_URL=http://localhost:3000
   ```

4. **Run the application**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

## API Endpoints

- `GET /`: Returns the main home page.
- `GET /get-price/:productId`: Get price details for a specific product by ID.
- `GET /api/get-all-prices`: List all active prices from Stripe.
- `GET /subscribe`: Redirects to Stripe Checkout for subscribing to a plan.
- `GET /success`: Success page after subscription.
- `GET /cancel`: Redirect back to home page if the subscription is canceled.
- `GET /api/get-all-customers`: Retrieve IDs of all customers from Stripe.
- `GET /customers`: Display all customers and their subscription details in a page.
- `POST /webhook`: Endpoint for handling webhook events from Stripe.
- `POST /validate-coupon`: Validate a coupon code.

## Webhook Handling

This application listens for Stripe webhook events such as:
- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.updated`

You will need to configure your Stripe account to send webhook events to `/webhook`.
env
Copy code
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
Replace your_stripe_secret_key and your_stripe_publishable_key with your actual Stripe keys from your Stripe dashboard.

4. Run the Application
bash
Copy code
node app.js
The application will run on http://localhost:3000 by default.

Endpoints
Frontend Routes
GET / - Displays the pricing table with subscription plans.
GET /subscribe?plan={planType} - Redirects users to subscribe to a specific plan.
API Routes
GET /api/get-all-prices - Fetches all Stripe subscription plan prices.
POST /validate-coupon - Validates a coupon code and applies discounts on the subscription.
Project Structure
graphql
Copy code
stripe-subscriptions-nodejs/
├── views/                 # EJS templates for rendering the frontend
├── public/                # Public assets (CSS, JS)
├── routes/                # Express route handlers
│   ├── index.js           # Main routing for subscription pages
│   ├── api.js             # API routes for fetching prices and validating coupons
├── app.js                 # Main application file
└── README.md              # Project documentation
Using Coupons
Enter a coupon code in the provided input field in the pricing table. Click "Apply Coupon" to validate and see the updated price if the coupon is valid.

Technologies Used
Node.js - Backend runtime environment.
Express.js - Node.js web application framework.
Stripe API - For subscription management.
Bootstrap - For styling the front-end.
License
This project is open-source and available under the MIT License.
## Environment Variables

- `STRIPE_SECRET_KEY`: Your Stripe secret API key.
- `STRIPE_WEBHOOK_SECRET_KEY`: Your Stripe webhook secret key.
- `BASE_URL`: The base URL for your application (typically localhost during development).

## Contributing

Feel free to submit issues or pull requests. Ensure that your code adheres to the project's coding standards.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Stripe](https://stripe.com/docs) for their payment processing API.
- [Express.js](https://expressjs.com/) for their web framework.
- [EJS](https://ejs.co/) for server-side templating.

Feel free to modify, fork, or contribute to the project!

```

Make sure to replace `yourusername` in the clone URL with your actual GitHub username and customize the project details as necessary!