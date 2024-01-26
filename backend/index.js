
require('dotenv').config(); // Make sure to install dotenv package
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const stripe = require('stripe')('sk_test_51ObW35JuImlUjwClMcXxCRaL1p4Dz7H3BL7ySfC67MWmPjY0vEwmqjeqhfnjqrwI2qV6Q7Xi2PVFXN7uCluFHPu000vLRfrBXf');

const app = express();
const port = 3006;

// Enhanced Logging Middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log(`Request Headers: `, req.headers);
  console.log(`Request Body: `, req.body);
  next();
});

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

console.log("Auth0 Configuration: ", config);

app.use(express.json());

app.use(auth(config));

app.get('/', (req, res) => {
  console.log("User authenticated: ", req.oidc.isAuthenticated());
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  console.log("Accessing profile for user: ", req.oidc.user);
  res.send(JSON.stringify(req.oidc.user));
});

app.post('/create-payment-intent', async (req, res) => {
  console.log("Demo create-payment-intent request received with body: ", req.body);
  
  try {
    // Mocking a successful payment intent creation response
    const mockClientSecret = "mock_client_secret_for_demo_purposes";
    console.log("Mock Payment Intent created for demo purposes");

    // Sending back a mock clientSecret
    res.send({ clientSecret: mockClientSecret });
  } catch (error) {
    console.error('Error in mock payment intent creation:', error);
    res.status(500).send({ error: 'Failed to create mock payment intent' });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("An unexpected error occurred");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
