import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
    <div>
      <img src="/Home12.png" alt="Home" style={{ width: '100%', maxHeight: '600px', position: 'absolute', top: 0, left: 0, zIndex: -1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', maxWidth: '1500px', marginTop: '550px' }}>
        {order ? (
          <div style={{ backgroundColor: '#f3f3f3', padding: '20px', margin: '20px 0', boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)', width: '90%', borderRadius: '10px' }}>
            <h3>Order ID: {order.ticketId}</h3>
            <p>Total Cost: ${order.totalCost.toFixed(2)}</p>
            <p>Customer: {order.customerDetails.firstName} {order.customerDetails.lastName}</p>
            <p>Address: {order.customerDetails.address}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>{item.description} - ${item.price} x {item.quantity}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div style={{ backgroundColor: '#f3f3f3', padding: '20px', margin: '20px 0', boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)', width: '90%', borderRadius: '10px' }}>
            <p>No orders placed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourOrderPage;
