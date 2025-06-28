import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const { data } = await api.get('/api/v1/users/me');
          setUser(data);
        } catch (error) {
          console.error("Token is invalid, logging out.", error);
          logout(); // If the token from storage is bad, log out
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      const receivedToken = response.data.token;
      localStorage.setItem('authToken', receivedToken);
      setToken(receivedToken); // This will trigger the useEffect to fetch the user
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };
  
  // New function to update the user state without logging in again
  const updateUserContext = (newUserData) => {
    setUser(newUserData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = { token, user, loading, login, logout, updateUserContext };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
