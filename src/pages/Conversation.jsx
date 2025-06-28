import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Conversation = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [conversation, setConversation] = useState(null); // Will hold the entire conversation object
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const { data } = await api.get(`/api/v1/messaging/conversations/${id}`);
                setConversation(data);
            } catch (err) {
                setError('Failed to load conversation.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversation();
    }, [id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversation) return;

        // Find the recipient from the conversation participants list
        const recipient = conversation.participants.find(p => p.username !== user.username);

        if (!recipient) {
            setError("Could not determine recipient.");
            return;
        }

        try {
            await api.post('/api/v1/messaging/send', {
                recipientUsername: recipient.username,
                content: newMessage,
            });
            setNewMessage('');
            // Refetch messages to show the new one immediately
            const { data } = await api.get(`/api/v1/messaging/conversations/${id}`);
            setConversation(data);
        } catch (err) {
            setError('Failed to send message.');
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500">Loading messages...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!conversation) return null; // Or some other placeholder

    const messages = conversation.messages || [];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Conversation</h1>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4">
                {messages.length > 0 ? (
                    messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.senderUsername === user.username ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.senderUsername === user.username ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="text-sm">{msg.content}</p>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(msg.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No messages yet. Send the first one!</p>
                )}
            </div>

            <form onSubmit={handleSendMessage} className="mt-6">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                />
                <button type="submit" className="mt-2 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Send
                </button>
            </form>
        </div>
    );
};

export default Conversation;
