import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';

// A simple dashboard component for now
const Dashboard = () => {
    const { logout } = useAuth();
    return (
        <div>
            <h1>Welcome to Your Dashboard</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

// A component to protect routes
const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) {
        // If no token, redirect to the login page
        return <Navigate to="/login" />;
    }
    return children;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Add other protected routes here later */}
      </Routes>
    </Router>
  );
}

export default App;