import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Inbox = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await api.get('/api/v1/messaging/conversations');
                setConversations(data);
            } catch (err) {
                setError('Failed to load conversations.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading conversations...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    // Helper to get the display name for a conversation
    const getParticipantNames = (participants) => {
        if (!participants || participants.length === 0) return "Unknown Conversation";
        return participants.map(p => `${p.firstName} ${p.lastName}`).join(', ');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Inbox</h1>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {conversations.length > 0 ? (
                        conversations.map(convo => (
                            <li key={convo.id} className="hover:bg-gray-50">
                                <Link to={`/conversations/${convo.id}`} className="block p-4">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-indigo-600">{getParticipantNames(convo.participants)}</p>
                                        {convo.lastMessage && (
                                            <p className="text-sm text-gray-500">{new Date(convo.lastMessage.createdAt).toLocaleTimeString()}</p>
                                        )}
                                    </div>
                                    <p className="text-gray-600 truncate mt-1">
                                        {convo.lastMessage ? convo.lastMessage.content : <em>No messages yet...</em>}
                                    </p>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="p-4 text-center text-gray-500">You have no conversations.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Inbox;