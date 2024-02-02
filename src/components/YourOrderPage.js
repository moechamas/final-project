import React, { useState, useEffect } from 'react';

const YourOrderPage = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchLastReservation = async () => {
      try {
        const response = await fetch('http://localhost:3006/api/reservations/last');
        if (!response.ok) {
          throw new Error('Failed to fetch the last reservation');
        }
        const data = await response.json();
        if (data) {
          console.log("Last reservation data:", data);
          setOrder(data);
        } else {
          console.error('No reservation found');
        }
      } catch (error) {
        console.error('Error fetching the last reservation:', error);
      }
    };

    fetchLastReservation();
  }, []);

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
