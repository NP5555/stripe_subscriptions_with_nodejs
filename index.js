require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.get('/', async (req, res) => {
    res.render('index.ejs');
});
app.get('/get-price/:productId', async (req, res) => {
    const { productId } = req.params;
 
    try {
        // Retrieve the price details from Stripe
        const price = await stripe.prices.retrieve(productId);
        res.json({
            success: true,
            price: {
                id: price.id,
                unit_amount: price.unit_amount,
                currency: price.currency,
                product: price.product,
                recurring: price.recurring,
            },
             
        });
    } catch (error) {
        console.error('Error retrieving price:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve price' });
    }
});



app.get('/api/get-all-prices', async (req, res) => {
    try {
        const prices = await stripe.prices.list({
            active: true,
            expand: ['data.product']
        });

        const formattedPrices = prices.data.reduce((acc, price) => {
            // Use the product name as the key (converted to lowercase)
            const planName = price.product.name.toLowerCase();
            acc[planName] = price.id;
            return acc;
        }, {});

        res.json({
            success: true,
            prices: formattedPrices
        });
    } catch (error) {
        console.error('Error fetching price IDs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch price IDs'
        });
    }
});

// Subscription endpoint
app.get('/subscribe', async (req, res) => {
    const { plan, coupon } = req.query;

    if (!plan) {
        return res.send('Subscription plan not found');
    }

    try {
        // Fetch all active prices from Stripe
        const prices = await stripe.prices.list({
            active: true,
            expand: ['data.product']
        });

        // Debug logging
        console.log('Requested plan:', plan);
        console.log('Available prices:', prices.data.map(price => ({
            id: price.id,
            product_name: price.product.name,
            amount: price.unit_amount,
            currency: price.currency
        })));

        // Find the price that matches the requested plan
        const priceObject = prices.data.find(price => {
            console.log('Comparing:', {
                product_name: price.product.name.toLowerCase(),
                plan: plan.toLowerCase()
            });
            return price.product.name.toLowerCase() === plan.toLowerCase();
        });

        if (!priceObject) {
            return res.send(`Subscription plan "${plan}" not found. Available plans: ${prices.data.map(p => p.product.name).join(', ')}`);
        }

        const sessionConfig = {
            mode: 'subscription',
            line_items: [
                {
                    price: priceObject.id,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/cancel`,
        };

        // Add coupon to session if provided
        if (coupon) {
            try {
                await stripe.coupons.retrieve(coupon);
                sessionConfig.discounts = [{ coupon }];
            } catch (error) {
                console.error('Invalid coupon:', error);
                // Continue without applying the coupon
            }
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        res.redirect(session.url);
    } catch (error) {
        console.error('Error creating subscription session:', error);
        res.status(500).send('An error occurred while processing your request');
    }
});

// Success and cancel routes
app.get('/success', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id, {
        expand: ['subscription', 'subscription.plan.product'],
    });
    res.send('<h1>Subscribed successfully</h1>');
});

app.get('/cancel', (req, res) => {
    res.redirect('/');
});


// Import Stripe
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Route to get all customer IDs
app.get('/api/get-all-customers', async (req, res) => {
    try {
        // Fetch the list of all customers from Stripe
        const customers = await stripe.customers.list({ limit: 100 });
        
        // Map customer data to just customer IDs
        const customerIds = customers.data.map(customer => customer.id);

        res.json({
            success: true,
            customerIds: customerIds
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer data',
            error: error.message
        });
    }
});

// Fetch and display all customers and their plan details
app.get('/customers', async (req, res) => {
    try {
        const customers = await stripe.customers.list({ limit: 10 }); // Adjust limit as needed
        const customerData = [];

        for (const customer of customers.data) {
            const subscriptions = await stripe.subscriptions.list({
                customer: customer.id,
                status: 'all',
                limit: 10
            });

            const planDetails = subscriptions.data.map(subscription => {
                const plan = subscription.items.data[0].plan;
                return {
                    planId: plan.id,
                    nickname: plan.nickname,
                    amount: plan.amount / 100,
                    currency: plan.currency,
                    interval: plan.interval,
                    status: subscription.status,
                    start_date: new Date(subscription.start_date * 1000),
                    current_period_end: new Date(subscription.current_period_end * 1000)
                };
            });

            customerData.push({
                customerId: customer.id,
                customerName: customer.name || 'No Name',
                email: customer.email,
                plans: planDetails
            });
        }

        res.render('customers', { customerData });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).send('Failed to fetch customer data');
    }
});







// Customer billing portal route
app.get('/customers/:customerId', async (req, res) => {
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: req.params.customerId,
        return_url: `${process.env.BASE_URL}/`,
    });

    res.redirect(portalSession.url);
});

// Webhook endpoint for Stripe events
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            console.log('New Subscription started!');
            console.log(event.data);
            break;
        case 'invoice.paid':
            console.log('Invoice paid');
            console.log(event.data);
            break;
        case 'invoice.payment_failed':
            console.log('Invoice payment failed!');
            console.log(event.data);
            break;
        case 'customer.subscription.updated':
            console.log('Subscription updated!');
            console.log(event.data);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.send();
});

app.post('/validate-coupon', async (req, res) => {
    try {
        const { coupon } = req.body;
        
        // Retrieve the coupon from Stripe
        const couponObject = await stripe.coupons.retrieve(coupon);
        
        res.json({
            success: true,
            coupon: {
                id: couponObject.id,
                percent_off: couponObject.percent_off,
                amount_off: couponObject.amount_off,
                currency: couponObject.currency
            }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Invalid coupon code'
        });
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));
