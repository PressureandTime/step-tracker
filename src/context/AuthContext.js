import React, { createContext, useState, useEffect } from 'react';
import { getAuthTokens } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      // Temporarily bypass authentication - always authenticated
      // const token = await getAuthTokens();
      // setIsAuthenticated(!!token);
      setIsAuthenticated(true); // Always authenticated for testing
    } catch (error) {
      console.log('Auth check error:', error);
      setIsAuthenticated(true); // Still authenticated even on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
