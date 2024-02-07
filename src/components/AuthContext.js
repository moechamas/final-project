import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    console.log("Auth0 isAuthenticated:", isAuthenticated); 
    setIsUserAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isUserAuthenticated, loginWithRedirect, logout, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
