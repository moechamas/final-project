import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [customerDetails, setCustomerDetails] = useState({ firstName: '', lastName: '', address: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails({ ...customerDetails, [name]: value });
  };

  const handlePaymentSubmission = async (event) => {
    event.preventDefault();
    // Here, instead of processing the payment, you just simulate success.
    console.log('Payment details submitted:', customerDetails);
    alert('Payment successful! (simulation)');
    // navigate to a success or confirmation page
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

export default PaymentPage;