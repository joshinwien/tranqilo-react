import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Header Component ---
export const Header = () => {
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

// --- Main App Layout Component ---
export const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>{children}</main>
        </div>
    );
};

// --- Protected Route Component ---
export const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading Application...</div>;
    }

    if (!token) {
        return <Navigate to="/login" />;
    }
    
    return <AppLayout>{children}</AppLayout>;
};
