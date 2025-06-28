import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
          logout(); 
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
      setToken(receivedToken);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };
  
  // Wrap this function in useCallback so it doesn't change on every render.
  // The empty dependency array `[]` ensures it's created only once.
  const updateUserContext = useCallback((newUserData) => {
    setUser(newUserData);
  }, []);

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
