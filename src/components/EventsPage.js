import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import { useAuth } from './AuthContext'; 
import './mobileStyles.css'; 

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, totalCost } = useContext(CartContext);
  const { isUserAuthenticated, loginWithRedirect, logout } = useAuth(); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://backend-final-9ylj.onrender.com/api/events');
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
      eventId: event.eventId, 
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
    <div className="cart-summary" >
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
      <img src="/home.png" alt="Home" className='image-style'  />
      {!isUserAuthenticated ? (
        <div onClick={loginWithRedirect} style={{
          cursor: 'pointer',
          color: 'red',
          textDecoration: 'underline',
          fontSize: 'larger',
          position: 'absolute',
          top: '-250px', 
          right: '30px', 
          zIndex: 2 
        }}>Login</div>
      ) : (
        <div onClick={() => logout({ returnTo: window.location.origin })} style={{
          cursor: 'pointer',
          color: 'red',
          textDecoration: 'underline',
          fontSize: '29px',
          position: 'absolute', 
          top: '390px', 
          right: '940px', 
          zIndex: 2 
        }}>Logout</div>
      )}
<div className="events-box">
      {events && events.length > 0 && events.map((event) => (
  <div key={event.eventId} style={eventStyle}> 
    <div style={eventDetailsStyle}>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>Price: ${event.price}</p>
      <p>Date: {event.startDate} - {event.endDate}</p>
      {isUserAuthenticated ? (
        <button onClick={() => handleAddToCart(event)}>{event.buttonLabel}</button>
      ) : (
        <p style={loginPromptStyle} onClick={loginWithRedirect}>Login to purchase tickets</p>
      )}
    </div>
  </div>
))}
      </div>
      {isCartVisible && <CartSummary />}
    </div>
  );
              };  



// Style objects

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


const eventStyle = {
  margin: '48px 0',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '10px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
};

const eventDetailsStyle = {
  flex: 1, 
};




export default EventsPage;