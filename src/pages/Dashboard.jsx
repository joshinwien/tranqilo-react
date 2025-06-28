import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WellnessChart from '../components/WellnessChart.jsx';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="p-6 text-center text-gray-500">Loading user data...</div>;
    }

    const QuickActions = () => (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                {user.role === 'CLIENT' && (
                    <Link to="/check-in" className="w-full text-center px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600">
                        New Check-in
                    </Link>
                )}
                <Link to="/inbox" className="w-full text-center px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600">
                    View Inbox
                </Link>
                {/* Add Manage Clients button for coaches */}
                {user.role === 'COACH' && (
                    <Link to="/manage-clients" className="w-full text-center px-4 py-2 font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600">
                        Manage Clients
                    </Link>
                )}
            </div>
        </div>
    );

    const CoachView = () => (
        <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Clients</h2>
            {user.clients && user.clients.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.clients.map(client => (
                        <li key={client.id}>
                            <Link to={`/clients/${client.id}`} className="block p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition">
                                <p className="font-bold text-gray-800">{client.firstName} {client.lastName}</p>
                                <p className="text-sm text-gray-500">@{client.username}</p>
                            </Link>
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

    const ClientView = () => {
        const [checkIns, setCheckIns] = useState(null);
        useEffect(() => {
            api.get('/api/v1/check-ins/summary')
                .then(res => setCheckIns(res.data))
                .catch(err => console.error(err));
        }, []);

        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Coach</h2>
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
                 <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <WellnessChart checkInData={checkIns} />
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h1>
            <p className="text-lg text-gray-600 mb-8">Here's your summary for today.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {user.role === 'COACH' ? <CoachView /> : <ClientView />}
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <QuickActions />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
