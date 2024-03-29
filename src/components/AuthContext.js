import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isAuthenticated, loginWithRedirect, logout: originalLogout, user, isLoading } = useAuth0();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [sessionId, setSessionId] = useState(null); 

  useEffect(() => {
    setIsUserAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    const initializeSession = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await fetch('https://backend-final-9ylj.onrender.com/api/session', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'sessionId': sessionId,
            },
            body: JSON.stringify({ email: user.email }),
          });
  
          if (!response.ok) {
            throw new Error('Session initialization failed');
          }
  
          const responseSessionId = (await response.json()).sessionId;
          setSessionId(responseSessionId);
          console.log('Retrieved session ID:', responseSessionId);
  
        } catch (error) {
          console.error('Error initializing session:', error);
        }
      }
    };
  
    if (isAuthenticated) {
      initializeSession();
    }
  }, [isAuthenticated, user]);

  const logout = (...args) => {
    localStorage.clear(); 
    originalLogout(...args); 
  };

  return (
    <AuthContext.Provider value={{ isUserAuthenticated, loginWithRedirect, logout, user, isLoading, sessionId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
