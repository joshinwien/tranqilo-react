import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CheckIn from './pages/CheckIn.jsx';
import Inbox from './pages/Inbox.jsx';
import Conversation from './pages/Conversation.jsx';
import Profile from './pages/Profile.jsx';
import ClientDetail from './pages/ClientDetail.jsx'; // Import the new page

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/check-in" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
        <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/conversations/:id" element={<ProtectedRoute><Conversation /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Add the new route for the client detail page */}
        <Route path="/clients/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;