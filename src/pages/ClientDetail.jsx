import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import WellnessChart from '../components/WellnessChart';

const ClientDetail = () => {
    const { id: clientId } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [checkIns, setCheckIns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [clientRes, checkInsRes] = await Promise.all([
                    api.get(`/api/v1/clients/${clientId}`),
                    api.get(`/api/v1/clients/${clientId}/check-ins/summary`)
                ]);
                setClient(clientRes.data);
                setCheckIns(checkInsRes.data);
            } catch (err) {
                setError('Failed to load client data. You may not have access.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [clientId]);

    const handleMessageClick = async () => {
        if (!client) return;
        try {
            const response = await api.post('/api/v1/messaging/start', {
                recipientUsername: client.username
            });
            const conversationId = response.data.id;
            navigate(`/conversations/${conversationId}`);
        } catch (error) {
            console.error("Failed to start conversation", error);
            setError("Could not start a conversation with this user.");
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500">Loading client details...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!client) return <div className="p-6 text-center text-gray-500">Client not found.</div>;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <Link to="/" className="text-indigo-600 hover:text-indigo-800">&larr; Back to Dashboard</Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">{client.firstName} {client.lastName}'s Dashboard</h1>
                <p className="text-lg text-gray-600">@{client.username}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <WellnessChart checkInData={checkIns} />
                </div>

                {/* Sidebar Area */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Actions</h2>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleMessageClick}
                                className="w-full text-center px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            >
                                Message Client
                            </button>
                            <button className="w-full text-center px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600">
                                Remove Client
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Check-ins List */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Check-ins</h2>
                <div className="bg-white rounded-lg shadow-md border border-gray-200 divide-y divide-gray-200">
                    {checkIns.length > 0 ? (
                        checkIns.slice().reverse().map(checkIn => ( // Show newest first
                            <div key={checkIn.id} className="p-4">
                                <p className="text-sm text-gray-500">{new Date(checkIn.createdAt).toLocaleDateString()}</p>
                                <div className="flex items-center gap-4 mt-1">
                                    <p><strong>Mood:</strong> {checkIn.mood}/10</p>
                                    <p><strong>Energy:</strong> {checkIn.energy}/10</p>
                                </div>
                                {checkIn.notes && <p className="mt-2 text-gray-700 bg-gray-50 p-3 rounded-md">{checkIn.notes}</p>}
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-center text-gray-500">This client has no recent check-ins.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDetail;
