import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CheckIn = () => {
    const [mood, setMood] = useState(5);
    const [energy, setEnergy] = useState(5);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/api/v1/check-ins', {
                mood,
                energy,
                notes
            });
            setSuccess('Check-in submitted successfully!');
            // Redirect back to the dashboard after a short delay
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError('Failed to submit check-in. Please try again.');
            console.error(err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Daily Check-in</h1>
            <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Mood Slider */}
                    <div>
                        <label htmlFor="mood" className="block text-lg font-medium text-gray-700">
                            Mood: <span className="font-bold text-indigo-600">{mood}</span>/10
                        </label>
                        <p className="text-sm text-gray-500">How are you feeling mentally today?</p>
                        <input
                            type="range"
                            id="mood"
                            min="1"
                            max="10"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                        />
                    </div>

                    {/* Energy Slider */}
                    <div>
                        <label htmlFor="energy" className="block text-lg font-medium text-gray-700">
                            Energy: <span className="font-bold text-indigo-600">{energy}</span>/10
                        </label>
                        <p className="text-sm text-gray-500">How are your physical energy levels?</p>
                        <input
                            type="range"
                            id="energy"
                            min="1"
                            max="10"
                            value={energy}
                            onChange={(e) => setEnergy(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                        />
                    </div>

                    {/* Notes Textarea */}
                    <div>
                        <label htmlFor="notes" className="block text-lg font-medium text-gray-700">
                            Notes
                        </label>
                        <p className="text-sm text-gray-500">Any additional thoughts, wins, or challenges?</p>
                        <textarea
                            id="notes"
                            rows="4"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Optional..."
                        ></textarea>
                    </div>

                    {/* Status Messages */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Check-in'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckIn;
