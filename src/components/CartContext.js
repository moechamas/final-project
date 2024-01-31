import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const addToCart = (newItem) => {
    const existingItemIndex = cart.findIndex(item => item.eventId === newItem.eventId);
    if (existingItemIndex > -1) {
      // Item exists, update the quantity
      const updatedCart = cart.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCart(updatedCart);
    } else {
      // Item does not exist, add new item
      setCart([...cart, { ...newItem, quantity: 1 }]);
    }
  };

  const removeFromCart = (eventId) => {
    const existingItemIndex = cart.findIndex(item => item.eventId === eventId);
    if (existingItemIndex > -1 && cart[existingItemIndex].quantity > 1) {
      // Decrement quantity
      const updatedCart = cart.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      setCart(updatedCart);
    } else {
      // Remove item completely
      const updatedCart = cart.filter(item => item.eventId !== eventId);
      setCart(updatedCart);
    }
  };

  useEffect(() => {
    // Calculate the total cost whenever the cart changes
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const updatedTotal = isNaN(total) ? 0 : total; // Handle NaN case
    console.log('Total Cost:', updatedTotal); // Add this line for debugging
    setTotalCost(updatedTotal);
  }, [cart]);
  
  

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, totalCost }}>
      {children}
    </CartContext.Provider>
  );
};
