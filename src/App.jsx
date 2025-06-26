import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';

// --- Header Component ---
const Header = () => {
    const { user, logout } = useAuth();
    return (
        <header className="bg-white shadow-sm">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700">
                    Tranqilo
                </Link>
                <div>
                    {user && (
                        <button
                            onClick={logout}
                            className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

// --- Dashboard Component ---
const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="p-6 text-center text-gray-500">Loading user data...</div>;
    }

    const CoachView = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Your Clients</h2>
            {user.clients && user.clients.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.clients.map(client => (
                        <li key={client.id} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                            <p className="font-bold text-gray-800">{client.firstName} {client.lastName}</p>
                            <p className="text-sm text-gray-500">@{client.username}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-4 bg-white rounded-lg shadow-sm border text-center text-gray-500">
                    You have no clients assigned.
                </div>
            )}
        </div>
    );

    const ClientView = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Your Coach</h2>
            {user.coach ? (
                <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                    <p className="font-bold text-gray-800">{user.coach.firstName} {user.coach.lastName}</p>
                    <p className="text-sm text-gray-500">@{user.coach.username}</p>
                </div>
            ) : (
                <div className="p-4 bg-white rounded-lg shadow-sm border text-center text-gray-500">
                    You are not yet assigned to a coach.
                </div>
            )}
        </div>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600 mb-8">Welcome back, {user.firstName}!</p>
            {user.role === 'COACH' ? <CoachView /> : <ClientView />}
        </div>
    );
};

// --- Main App Layout Component ---
const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>{children}</main>
        </div>
    );
};

// --- Protected Route Component ---
const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading Application...</div>;
    }

    if (!token) {
        return <Navigate to="/login" />;
    }
    
    return <AppLayout>{children}</AppLayout>;
};

// --- App Router ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;
