import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './orderStyles.css';
import { Link } from 'react-router-dom'; 

const YourOrderPage = () => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isUserAuthenticated, user } = useAuth();

  useEffect(() => {
    console.log("Checking user authentication status:", isUserAuthenticated);

    if (!isUserAuthenticated) {
      console.log('User is not authenticated. Preventing data fetch.');
      return;
    }

    console.log('Fetching the last reservation for:', user?.email);
    const fetchLastReservation = async () => {
      try {
        const response = await fetch('http://localhost:3006/api/reservations/last', {
          method: 'GET',
          credentials: 'include',
        });

        console.log('Fetch response status:', response.status);
        if (!response.ok) throw new Error('Failed to fetch the last reservation');

        const data = await response.json();
        console.log("Fetched reservation data:", data);

        setOrder(data);
      } catch (error) {
        console.error('Error during reservation fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastReservation();
  }, [isUserAuthenticated, user]);

    return (
    <div className="order-page-container">
      <img src="/Home12.png" alt="Home" className="order-page-background" />
      <div className="order-content-container">
        {isLoading ? (
          <div className="loading-message">Loading your order...</div>
        ) : order ? (
          <div className="order-details">
            <h3>Order ID: {order.ticketId}</h3>
            <p>Total Cost: ${order.totalCost.toFixed(2)}</p>
            <p>Customer: {order.customerDetails.firstName} {order.customerDetails.lastName}</p>
            <p>Address: {order.customerDetails.address}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>{item.description} - ${item.price} x {item.quantity}</li>
              ))}
            </ul>
            <p>Orders are processed immediately and will disappear from this page after a short period. A confirmation will be sent to your email.</p>
          </div>
        ) : (
          <div className="no-orders-message">
            <p>No orders placed. You can <Link to="/events">buy tickets on the Events Page</Link>.</p> 
          </div>
        )}
      </div>
    </div>
  );
};

export default YourOrderPage;
