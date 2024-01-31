
require('dotenv').config(); 
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const stripe = require('stripe')('sk_test_51ObW35JuImlUjwClMcXxCRaL1p4Dz7H3BL7ySfC67MWmPjY0vEwmqjeqhfnjqrwI2qV6Q7Xi2PVFXN7uCluFHPu000vLRfrBXf');
const { handlePayment } = require('./handlers');
const cors = require('cors');
const { events } = require('../data');

const app = express();
app.use(express.json()); 

const port = 3006;

// Enhanced Logging Middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers); 
  console.log(`Request Body: `, req.body);
  next();
});

app.use(cors())

// Auth0 Configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'pJjxygBL99YThVmF2B2_Pm44vMshm-MVrxNeQJt2wqpQTCN-zNR8bP4fIQ3rjly6',
  baseURL: 'http://localhost:3006',
  clientID: 'Qw2bXi87MBgGKJybw9nCAKOQ3TBDEe6z',
  issuerBaseURL: 'https://dev-5cctc0ue24r5lvxh.us.auth0.com',
  authorizationParams: {
    redirect_uri: 'http://localhost:3005/',
  },
};

app.use(auth(config));

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/reservations', (req, res) => {
  const { cart, totalCost } = req.body;
  const reservationId = uuidv4();
  const reservationDetails = getReservationDetails(cart, totalCost);


  res.json({ reservationId, ...reservationDetails });
});

app.post('/create-payment-intent', async (req, res) => {
  const { cart, totalCost } = req.body;

  try {
    // Call the handlePayment function with totalCost
    await handlePayment(stripe, cart, totalCost);

    res.json({ success: true });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: error.message });
  }
});

// Route to initiate payment
app.post('/initiate-payment', async (req, res) => {
  const { cart, totalCost } = req.body;

  try {
    // Verify that totalCost is a valid number
    if (typeof totalCost !== 'number' || isNaN(totalCost)) {
      throw new Error('Invalid totalCost');
    }

    // Convert totalCost to cents
    const amountInCents = Math.round(totalCost * 100);

    // Add console log to check the value of totalCost
    console.log('Total Cost in cents:', amountInCents);

    // Make the HTTP request to create a payment intent
    const response = await fetch('http://localhost:3006/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: amountInCents, // Use the calculated amount in cents
      }),
    });

    const data = await response.json();

    // Debug log to check the response data
    console.log('Payment Intent Response:', data);

    // Handle the response data as needed
    // For example, you can redirect the user to a payment form page

    res.json(data);
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).send({ error: error.message });
  }
});

// Missing closing brace for the try block

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});