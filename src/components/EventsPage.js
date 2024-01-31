import React, { useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, totalCost } = useContext(CartContext);
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3006/api/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleAddToCart = (event) => {
    const newItem = {
      eventId: event.id,
      description: event.title,
      quantity: 1,
      price: event.price,
    };
    addToCart(newItem);
    setIsCartVisible(true);
  };

  const redirectToPaymentPage = () => {
    navigate('/payment'); 
  };

  const CartSummary = () => (
    <div style={cartSummaryStyle}>
      <button onClick={() => setIsCartVisible(false)} style={closeCartButtonStyle}>X</button>
      <h3 style={cartSummaryHeadingStyle}>Cart Summary</h3>
      {cart && cart.length > 0 && cart.map((item, index) => (
        <div key={index} style={cartItemSummaryStyle}>
          <p>{item.description} - {item.quantity} x ${item.price.toFixed(2)}</p>
          <button onClick={() => removeFromCart(item.eventId)} style={removeItemButtonStyle}>-</button>
        </div>
      ))}
      <p style={cartSummaryTotalStyle}><strong>Total: ${totalCost.toFixed(2)}</strong></p>
      <button onClick={redirectToPaymentPage} style={payNowButtonStyle}>Pay Now</button>
    </div>
  );

  return (
    <div style={pageStyle}>
      <img src="/home.png" alt="Home" style={imageStyle} />
      {!isAuthenticated ? (
        <button onClick={loginWithRedirect}>Login</button>
      ) : (
        <button onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>
      )}
      <div style={eventsBoxStyle}>
        {events && events.length > 0 && events.map((event) => (
          <div key={event.id} style={eventStyle}>
            <h3>{event.title}</h3>
            <p>Price: ${event.price}</p>
            {isAuthenticated ? (
              <button onClick={() => handleAddToCart(event)}>Add to Cart</button>
            ) : (
              <p style={loginPromptStyle} onClick={loginWithRedirect}>Login to purchase tickets</p>
            )}
          </div>
        ))}
      </div>
      {isCartVisible && <CartSummary />}
    </div>
  );
};



// Style objects


const cartSummaryStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  width: '300px', 
  height: '100vh',
  backgroundColor: '#f8f8f8',
  padding: '20px',
  boxShadow: '-3px 0px 10px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s ease-in-out',
  overflowY: 'auto',
  zIndex: 1001,
};


const cartSummaryHeadingStyle = {
  textAlign: 'center',
  color: '#333',
  marginBottom: '15px',
  fontSize: '1.5rem',
};

const cartItemSummaryStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
  borderBottom: '1px solid #eee',
  paddingBottom: '10px',
};

const cartSummaryTotalStyle = {
  textAlign: 'right',
  marginTop: '15px',
  fontWeight: 'bold',
  color: '#333',
};

const payNowButtonStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
};



const closeCartButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  fontSize: '1.2rem',
};



const loginPromptStyle = {
  color: '#007bff',
  cursor: 'pointer',
  textDecoration: 'underline',
};

const removeItemButtonStyle = {
  marginLeft: '10px',
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  color: 'red',
  fontWeight: 'bold',
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




export default EventsPage;