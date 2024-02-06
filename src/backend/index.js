require('dotenv').config({ path: '/Users/chamas/Final-Project/final-project/.env' });

const express = require('express');
const session = require('express-session'); 
const { auth, requiresAuth } = require('express-openid-connect');
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);
const cors = require('cors');
const { events, pastEvents, reviews } = require('../data');
const { connectDB } = require('./mongodbUtil');

const app = express();

// Session configuration
const sessionConfig = {
  secret: 'pJjxygBL99YThVmF2B2_Pm44vMshm-MVrxNeQJt2wqpQTCN-zNR8bP4fIQ3rjly6', 
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true, 
    maxAge: 24 * 60 * 60 * 1000, 
  }
};

// Apply session middleware
app.use(session(sessionConfig));

app.use(express.json());

const port = 3006;

// Enhanced Logging Middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log(`Request Body: `, req.body);
  next();
});


app.use(cors({
  origin: 'http://localhost:3005', 
  credentials: true,
}));


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



app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/reservations', async (req, res) => {
  try {
    const reservation = req.body; 
    const db = await connectDB();
    const result = await db.collection('reservations').insertOne(reservation);
    if (result.acknowledged) {
      console.log("Reservation saved:", reservation);
      res.status(201).send(reservation);
    } else {
      console.error("Failed to save the reservation");
      res.status(500).send("Failed to save the reservation");
    }
  } catch (error) {
    console.error("Error saving the reservation:", error);
    res.status(500).send("Error saving the reservation");
  }
});


app.get('/api/reservations/last', async (req, res) => {
  try {
    const db = await connectDB();
    const lastReservation = await db.collection('reservations')
      .find({})
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    if (lastReservation.length > 0) {
      console.log("Last reservation found:", lastReservation[0]); 
      res.json(lastReservation[0]); 
    } else {
      console.log("No reservations found");
      res.status(404).send("No reservations found");
    }
  } catch (error) {
    console.error("Error fetching the last reservation:", error);
    res.status(500).send("Error fetching the last reservation");
  }
});

// Handler to fetch past events
app.get('/api/past-events', (req, res) => {
  res.json(pastEvents);
});

// Handler to fetch reviews for a specific past event
app.get('/api/reviews/:eventId', (req, res) => {
  const { eventId } = req.params;
  const eventReviews = reviews.filter(review => review.eventId === parseInt(eventId));

  if (eventReviews.length > 0) {
    res.json(eventReviews);
  } else {
    res.status(404).json({ message: `No reviews found for event with ID ${eventId}` });
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});