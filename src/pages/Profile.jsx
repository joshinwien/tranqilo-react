import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
    const { user, updateUserContext } = useAuth(); // Use the new function
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                birthDate: user.birthDate || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const { data: updatedUser } = await api.put('/api/v1/users/me/profile', formData);
            
            // Use the new, safe function to update the context
            updateUserContext(updatedUser);
            
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update profile. Please check your data.');
            console.error(err);
        }
    };

    if (!formData) {
        return <div className="p-6 text-center text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>
            <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form inputs remain the same... */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} disabled={!isEditing} className="w-full mt-1 p-2 border border-gray-300 rounded-md disabled:bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} disabled={!isEditing} className="w-full mt-1 p-2 border border-gray-300 rounded-md disabled:bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} className="w-full mt-1 p-2 border border-gray-300 rounded-md disabled:bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} disabled={!isEditing} className="w-full mt-1 p-2 border border-gray-300 rounded-md disabled:bg-gray-100" />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}

                    <div className="flex justify-end gap-4 pt-4">
                        {isEditing ? (
                            <>
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save Changes</button>
                            </>
                        ) : (
                            <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Edit Profile</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
