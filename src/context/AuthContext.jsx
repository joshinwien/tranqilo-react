import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Initialize token from localStorage so it persists across refreshes
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true); // Start in a loading state

  // This useEffect runs only when the component mounts or the token changes.
  // Its only job is to get user data if a token exists.
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // The api interceptor will automatically add the token to the header
          const { data } = await api.get('/api/v1/users/me');
          setUser(data);
        } catch (error) {
          console.error("Token is invalid, logging out.", error);
          // If the token from storage is bad, clear it out.
          logout();
        }
      }
      setLoading(false); // We are done loading
    };

    fetchUser();
  }, [token]); // This dependency array is key: the effect runs when `token` changes.

  // The login function's only job is to get a token and set it.
  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      const receivedToken = response.data.token;
      
      // Save the token to local storage for persistence
      localStorage.setItem('authToken', receivedToken);
      
      // Set the token in our state. This will trigger the useEffect above.
      setToken(receivedToken);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // The logout function's job is to clear everything.
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = { token, user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render the app until the initial auth check is done */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
