import React, { useState, useContext } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CartContext } from './CartContext';
import { OrdersContext } from './OrdersContext';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [customerDetails, setCustomerDetails] = useState({ firstName: '', lastName: '', address: '' });

  const { totalCost, cart } = useContext(CartContext);
  const { addOrder } = useContext(OrdersContext);
  const navigate = useNavigate();

  const handlePaymentSubmission = async (event) => {
    event.preventDefault();
    const ticketId = `ticket-${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare the order details
    const orderDetails = {
      ticketId,
      items: cart,
      totalCost,
      customerDetails
    };

    // First, post the reservation
    await createReservation(orderDetails);

    // Add order to context (if needed, depending on how you manage state)
    addOrder(orderDetails);

    alert('Order placed successfully!');
    navigate('/your-order'); // Redirect to YourOrderPage
  };

  // Function to create a reservation
  const createReservation = async (reservationDetails) => {
    try {
      const response = await fetch('http://localhost:3006/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationDetails),
      });
      if (!response.ok) {
        throw new Error('Failed to create the reservation');
      }
      const data = await response.json();
      console.log("Reservation created:", data);
      return data;
    } catch (error) {
      console.error('Error creating the reservation:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails({ ...customerDetails, [name]: value });
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
           

        <div style={cardElementContainerStyle}>
          <CardElement style={cardElementStyle} />
        </div>
        <div style={totalCostStyle}>
          Total Cost: ${totalCost.toFixed(2)}
        </div>

        <button type="submit" disabled={!stripe} style={submitButtonStyle}>Submit Payment</button>
      </form>
    </div>
  );
};

// Styling
const formContainerStyle = {
  maxWidth: '500px',
  margin: '20px auto',
  padding: '20px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  background: '#fff',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const cardElementContainerStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  margin: '5px 0',
};

const cardElementStyle = {
  base: {
    iconColor: '#666EE8',
    color: '#31325F',
    fontWeight: 300,
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSize: '18px',
    '::placeholder': {
      color: '#CFD7E0',
    },
  },
};

const submitButtonStyle = {
  width: '100%',
  padding: '10px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
};

const totalCostStyle = { 
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '10px 0',
  };
  
  

export default PaymentPage;