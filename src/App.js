import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import NavBar from './components/NavBar';
import EventsPage from './components/EventsPage';
import YourOrderPage from './components/YourOrderPage';
import BlogPage from './components/BlogPage';

const stripePromise = loadStripe('pk_test_51ObW35JuImlUjwCl0ikE3zljwaMRsZcW2KRLG2d21DWhNsF3OztiVhQdekTkeWuzzTSwDx2ay4YLWUlM5JowaORD00NihjjDuR');

const auth0Domain = "dev-5cctc0ue24r5lvxh.us.auth0.com";
const auth0ClientId = "Qw2bXi87MBgGKJybw9nCAKOQ3TBDEe6z";

function App() {
  return (
    <Auth0Provider domain={auth0Domain} clientId={auth0ClientId} redirectUri={window.location.origin}>
      <Router>
        <NavBar />
        <Elements stripe={stripePromise}>
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/events" element={<EventsPage />} />
            
            <Route path="/your-order" element={<YourOrderPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="*" element={<EventsPage />} />
          </Routes>
        </Elements>
      </Router>
    </Auth0Provider>
  );
}

export default App;
