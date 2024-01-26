import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import eventsData from '../data.js';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
  });
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (eventsData && eventsData.events) {
      setEvents(eventsData.events);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prevState => ({ ...prevState, [name]: value }));
  };

  const handleBuyTickets = (eventId, price) => {
    setSelectedEvent({ eventId, price });
    setShowForm(true);
  };

  const handlePaymentSubmission = async (event) => {
    event.preventDefault();

    if (!selectedEvent || !stripe || !elements || !isAuthenticated) return;

    const { eventId, price } = selectedEvent;
    const cardElement = elements.getElement(CardElement);

    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, amount: price * 100 }),
    });

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${customerDetails.firstName} ${customerDetails.lastName}`,
          email: customerDetails.email,
          address: {
            line1: customerDetails.address,
          },
        },
      },
    });

    if (result.error) {
      console.log('Payment error:', result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded!');
      setShowForm(false); 
      setCustomerDetails({ firstName: '', lastName: '', email: '', address: '' }); // Reset customer details
    }
  };

  return (
    <div style={pageStyle}>
    <img src="/home.png" alt="Home" style={imageStyle} />
    {!isAuthenticated ? (
      <button style={loginButtonStyle} onClick={() => loginWithRedirect()}>
        Login
      </button>
    ) : (
      <button style={loginButtonStyle} onClick={() => logout({ returnTo: 'http://localhost:3005' })}>
        Logout
      </button>
    )}
    <div style={eventsBoxStyle}>
      {events.map((event) => (
        <div key={event.id} style={eventStyle}>
          <h3 style={titleStyle}>{event.title}</h3>
          <p style={dateStyle}>{event.startDate} - {event.endDate}</p>
          <p>Price: ${event.price}</p>
          <button onClick={() => handleBuyTickets(event.id, event.price)}>Buy Tickets</button>
        </div>
      ))}
    </div>
      {showForm && (
        <div style={backdropStyle} onClick={() => setShowForm(false)}>
          {isAuthenticated ? (
            <form onSubmit={handlePaymentSubmission} style={modalStyle} onClick={(e) => e.stopPropagation()}>
              <input type="text" name="firstName" value={customerDetails.firstName} onChange={handleInputChange} placeholder="First Name" required />
              <input type="text" name="lastName" value={customerDetails.lastName} onChange={handleInputChange} placeholder="Last Name" required />
              <input type="email" name="email" value={customerDetails.email} onChange={handleInputChange} placeholder="Email" required />
              <input type="text" name="address" value={customerDetails.address} onChange={handleInputChange} placeholder="Address" required />
              <CardElement />
              <button type="submit" disabled={!stripe}>Pay</button>
            </form>
          ) : (
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
              <p>Please log in to buy tickets!</p>
              <button onClick={() => loginWithRedirect()}>Login Using Auth0</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};




// Style objects
const modalStyle = {
  position: 'fixed', 
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000, 
  backgroundColor: '#fff',
  padding: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  width: '80%',
  maxWidth: '400px', 
};

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 999, 
};

const pageStyle = {
  position: 'relative',
  paddingTop: '38.8%',
};

const imageStyle = {
  position: 'absolute',
  top: -140,
  left: 0,
  width: '100%',
  height: '34.9%',
};

const eventsBoxStyle = {
  padding: '20px',
  borderRadius: '15px',
  backgroundColor: '#f3f3f3',
  boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
  width: '97%',
  maxWidth: '1500px',
  marginTop: '-100px',
  overflowY: 'auto',
  zIndex: 2,
};

const eventStyle = {
  margin: '48px 0',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '10px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
};

const titleStyle = {
  fontSize: '1.5rem',
  margin: '0 0 10px 0',
  color: '#333',
};

const dateStyle = {
  fontSize: '1.2rem',
  margin: '0 0 10px 0',
  color: '#555',
};

const loginButtonStyle = {
  position: 'absolute',
  top: '290px',
  right: '900px',
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  padding: '20px 40px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 'bold',
  textAlign: 'center',
  display: 'inline-block',
  transition: 'background-color 0.3s ease',
};

export default EventsPage;
