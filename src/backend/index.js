require('dotenv').config({ path: '/Users/chamas/Final-Project/final-project/.env' });

const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);
const cors = require('cors');
const { events, pastEvents, reviews } = require('../data');
const { connectDB } = require('./mongodbUtil');

const app = express();




app.use(express.json());

const port = 3006;

const cookieParser = require('cookie-parser');
app.use(cookieParser());

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


app.post('/api/reservations', async (req, res) => {
  try {
    // Extract the session ID from the cookie
    const sessionId = req.cookies['connect.sid']; 
    if (!sessionId) {
      return res.status(401).send("User is not authenticated");
    }

    const reservationWithSessionId = {
      ...req.body,
      sessionId: sessionId, 
    };

    const db = await connectDB();
    const result = await db.collection('reservations').insertOne(reservationWithSessionId);
    if (result.acknowledged) {
      console.log("Reservation saved:", reservationWithSessionId);
      res.status(201).send(reservationWithSessionId);
    } else {
      console.error("Failed to save the reservation");
      res.status(500).send("Failed to save the reservation");
    }
  } catch (error) {
    console.error("Error saving the reservation:", error);
    res.status(500).send("Error saving the reservation");
  }
});


app.all('/api/reservations/last', async (req, res) => {
  try {
    console.log("Received cookies:", req.cookies);

    const sessionId = req.cookies['connect.sid'];
    console.log("Attempting to fetch last reservation with session ID:", sessionId);

    if (!sessionId) {
      console.log("No session ID found in request, user not authenticated.");
      return res.status(401).send("User is not authenticated");
    }

    const db = await connectDB();
    console.log("Connected to MongoDB successfully.");

    const lastReservation = await db.collection('reservations')
      .find({ sessionId: sessionId })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    console.log("Query result for last reservation:", lastReservation);

    if (lastReservation.length > 0) {
      console.log("Found last reservation, sending to client.");
      res.json(lastReservation[0]);
    } else {
      console.log("No reservations found for session ID:", sessionId);
      res.status(404).send("No reservations found");
    }
  } catch (error) {
    console.error("Error fetching the last reservation with session ID:", sessionId, error);
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


app.post('/api/comments', async (req, res) => {
  const { eventId, userName, comment } = req.body;

  try {
    const db = await connectDB();
    const result = await db.collection('comments').insertOne({ eventId, userName, comment });
    if (result.acknowledged) {
      res.status(201).json({ message: 'Comment added successfully' });
    } else {
      res.status(500).json({ message: 'Failed to add comment' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/session', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send('Email is required to initialize session');
    }

  
    const sessionId = generateSessionId();


    // Store the session ID in the client's local storage
    res.cookie('sessionId', sessionId, { httpOnly: true }); 

    res.status(200).json({ sessionId });
  } catch (error) {
    console.error('Error initializing session:', error);
    res.status(500).send('Error initializing session');
  }
});


function generateSessionId() {

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}





app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});