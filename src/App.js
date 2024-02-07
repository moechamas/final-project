import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Layout from './components/Layout';
import EventsPage from './components/EventsPage';
import YourOrderPage from './components/YourOrderPage';
import BlogPage from './components/BlogPage';
import PaymentPage from './components/PaymentPage';
import { CartProvider } from './components/CartContext';
import { OrdersProvider } from './components/OrdersContext'; 
import { AuthProvider } from './components/AuthContext'; 


const stripePromise = loadStripe('pk_test_51ObW35JuImlUjwCl0ikE3zljwaMRsZcW2KRLG2d21DWhNsF3OztiVhQdekTkeWuzzTSwDx2ay4YLWUlM5JowaORD00NihjjDuR');

const auth0Domain = "dev-5cctc0ue24r5lvxh.us.auth0.com";
const auth0ClientId = "Qw2bXi87MBgGKJybw9nCAKOQ3TBDEe6z";

function App() {
  return (
    <Auth0Provider domain={auth0Domain} clientId={auth0ClientId} redirectUri={window.location.origin}>
      <AuthProvider> 
        <Router>
          <Elements stripe={stripePromise}>
            <CartProvider>
              <OrdersProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<EventsPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/your-order" element={<YourOrderPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="*" element={<EventsPage />} />
                  </Routes>
                </Layout>
              </OrdersProvider>
            </CartProvider>
          </Elements>
        </Router>
      </AuthProvider>
    </Auth0Provider>
  );
}



export default App;
