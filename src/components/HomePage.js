import React from 'react';
import NavBar from './NavBar'; 

const HomePage = () => {
  return (
    <div style={{
      width: '100vw',
      overflow: 'hidden' 
    }}>
      <img src="/home.png" alt="Home" style={{
        width: '100%',
        height: '63%',
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000 
      }} />
    </div>
  );
};

export default HomePage;
