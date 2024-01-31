import React from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div>
      {location.pathname !== '/payment' && <NavBar />}
      {children}
    </div>
  );
};

export default Layout;
