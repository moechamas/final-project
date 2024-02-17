import React, { useState, useContext, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CartContext } from './CartContext';
import { OrdersContext } from './OrdersContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 


const PaymentPage = () => {
  const { sessionId } = useAuth(); 
  const [seshId, setSeshId] = useState(null)

  useEffect(() => {
    if (sessionId) {
      console.log('Session ID is now available:', sessionId);
      setSeshId(sessionId)
      
    }
  }, [sessionId]);

  const [error, setError] = useState(null); 

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { totalCost, cart } = useContext(CartContext);
  const { addOrder } = useContext(OrdersContext);

  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
  });

  const handlePaymentSubmission = async (event) => {
    event.preventDefault();
    const ticketId = `ticket-${Math.random().toString(36).substr(2, 9)}`;

    const orderDetails = {
      ticketId,
      items: cart,
      totalCost,
      customerDetails
    };

    await createReservation(orderDetails);
    addOrder(orderDetails);

    alert('Order placed successfully!');
    navigate('/your-order');
  };

  const createReservation = async (reservationDetails) => {
    try {
      const response = await fetch('https://backend-final-9ylj.onrender.com/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${seshId}` 
        },
        credentials: 'include', 
      body: JSON.stringify(reservationDetails),
    });

    if (!response.ok) {
      throw new Error('Failed to create the reservation');
    }

    const data = await response.json();
    console.log('Reservation created:', data);
  } catch (error) {
    console.error('Error creating the reservation:', error);
    setError(error.message);
  }
};

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div style={formContainerStyle}>
      <form onSubmit={handlePaymentSubmission} style={formStyle}>
        <input 
          name="firstName"
          value={customerDetails.firstName}
          onChange={handleInputChange}
          style={inputStyle}
          placeholder="First Name"
        />
        <input 
          name="lastName"
          value={customerDetails.lastName}
          onChange={handleInputChange}
          style={inputStyle}
          placeholder="Last Name"
        />
        <input 
          name="address"
          value={customerDetails.address}
          onChange={handleInputChange}
          style={inputStyle}
          placeholder="Address"
        />
        <input 
          name="city"
          value={customerDetails.city}
          onChange={handleInputChange}
          style={inputStyle}
          placeholder="City"
        />
        <input 
          name="country"
          value={customerDetails.country}
          onChange={handleInputChange}
          style={inputStyle}
          placeholder="Country"
        />

        <div style={cardElementContainerStyle}>
          <CardElement options={{ style: cardElementStyle }} />
        </div>
        <div style={totalCostStyle}>
          Total Cost: ${totalCost.toFixed(2)}
        </div>

        <button type="submit" disabled={!stripe} style={submitButtonStyle}>Submit Payment</button>
      </form>
    </div>
  );
};

// Updated Styling
const formContainerStyle = {
  maxWidth: '600px',
  margin: '40px auto',
  padding: '20px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  background: '#f9f9f9',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  margin: '5px 0',
  borderRadius: '5px',
  border: '1px solid #ccc',
  background: '#fff',
};

const cardElementContainerStyle = {
  width: '100%',
  padding: '12px 15px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  background: '#fff',
  margin: '5px 0',
};

const cardElementStyle = {
  base: {
    iconColor: '#666EE8',
    color: '#31325F',
    fontWeight: 400,
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSize: '16px',
    '::placeholder': {
      color: '#CFD7E0',
    },
  },
};

const submitButtonStyle = {
  width: '100%',
  padding: '12px 15px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '15px',
};

const totalCostStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '10px 0',
  textAlign: 'center',
};

export default PaymentPage;
