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
          const response = await fetch('http://localhost:3006/api/session', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email }),
          });

          if (!response.ok) {
            throw new Error('Session initialization failed');
          }

          const { sessionId } = await response.json();
          setSessionId(sessionId); 
          console.log('Retrieved session ID:', sessionId); 

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
