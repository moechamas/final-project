import React, { useContext } from 'react';
import { CartContext } from './CartContext';

const Cart = () => {
  const { totalCost } = useContext(CartContext);

  return (
    <div style={cartContainerStyle}>
      <h2 style={headingStyle}>Your Cart</h2>
      {cart.length === 0 ? (
        <p style={emptyMessageStyle}>Your cart is empty.</p>
      ) : (
        cart.map((item, index) => (
          <div key={index} style={itemStyle}>
            <p><strong>Event:</strong> {item.description}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
            <p><strong>Subtotal:</strong> ${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))
      )}
      <div style={totalCostStyle}>
        <strong>Total Cost:</strong> ${totalCost.toFixed(2)}
      </div>
    </div>
  );
};

// Styling objects


export default Cart;
