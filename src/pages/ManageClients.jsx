import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ManageClients = () => {
    const { user, updateUserContext } = useAuth();
    const [unassignedClients, setUnassignedClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/v1/users/unassigned');
                setUnassignedClients(response.data);
            } catch (err) {
                setError('Failed to load available clients.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const refreshData = async () => {
        try {
            // Fetch both lists concurrently
            const [unassignedRes, meRes] = await Promise.all([
                api.get('/api/v1/users/unassigned'),
                api.get('/api/v1/users/me')
            ]);
            setUnassignedClients(unassignedRes.data);
            // Update the user context with the latest data, which includes the updated client list
            updateUserContext(meRes.data);
        } catch (err) {
            console.error('Failed to refresh data:', err);
            setError('Could not refresh client lists.');
        }
    }

    const handleAddClient = async (clientUsername) => {
        try {
            await api.post('/api/v1/coach/clients', { clientUsername });
            await refreshData(); // Refresh all data after the action
        } catch (err) {
            console.error('Failed to add client:', err);
            setError('Could not add the client.');
        }
    };

    const handleRemoveClient = async (clientUsername) => {
        try {
            await api.delete(`/api/v1/coach/clients/${clientUsername}`);
            await refreshData(); // Refresh all data after the action
        } catch (err) {
            console.error('Failed to remove client:', err);
            setError('Could not remove the client.');
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Clients</h1>
            {error && <p className="p-4 bg-red-100 text-red-700 rounded-md mb-4">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Your Clients List */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Clients</h2>
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-3">
                        {user?.clients && user.clients.length > 0 ? (
                            user.clients.map(client => (
                                <div key={client.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                                    <span>{client.firstName} {client.lastName} (@{client.username})</span>
                                    <button onClick={() => handleRemoveClient(client.username)} className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
                                        Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">You have no clients.</p>
                        )}
                    </div>
                </div>

                {/* Available Clients List */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Available Clients</h2>
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-3">
                        {unassignedClients.length > 0 ? (
                            unassignedClients.map(client => (
                                <div key={client.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                                    <span>{client.firstName} {client.lastName} (@{client.username})</span>
                                    <button onClick={() => handleAddClient(client.username)} className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">
                                        Add
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No available clients to add.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageClients;