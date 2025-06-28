import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CheckIn from './pages/CheckIn.jsx';
import Inbox from './pages/Inbox.jsx'; // 1. Import the Inbox page
import Conversation from './pages/Conversation.jsx'; // 2. Import the Conversation page

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-in"
          element={
            <ProtectedRoute>
              <CheckIn />
            </ProtectedRoute>
          }
        />
        {/* 3. Add the new routes for messaging */}
        <Route 
          path="/inbox" 
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/conversations/:id" 
          element={
            <ProtectedRoute>
              <Conversation />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
