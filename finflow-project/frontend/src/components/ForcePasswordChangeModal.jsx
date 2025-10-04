// frontend/src/components/ForcePasswordChangeModal.jsx
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001/api/users';

function ForcePasswordChangeModal() {
    const { user, updateUser, setShowPasswordModal, logout } = useAuth();
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (formData.newPassword !== formData.confirmPassword) return setError('New passwords do not match.');
        if (formData.newPassword.length < 6) return setError('Password must be at least 6 characters.');

        try {
            await axios.post(`${API_URL}/set-password`, { userId: user._id, currentPassword: formData.currentPassword, newPassword: formData.newPassword });
            setSuccess('Password updated successfully!');
            updateUser({ ...user, isTemporaryPassword: false });
            setTimeout(() => setShowPasswordModal(false), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full relative">
                <button onClick={logout} className="absolute top-2 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Set Your New Password</h2>
                <p className="text-center text-gray-500 mb-6">You must change your temporary password.</p>
                {success ? <p className="text-center text-lg text-green-600 font-semibold">{success}</p> : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input type="password" name="currentPassword" placeholder="Temporary Password" onChange={handleChange} className="input-field" required />
                        <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} className="input-field" required />
                        <input type="password" name="confirmPassword" placeholder="Confirm New Password" onChange={handleChange} className="input-field" required />
                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <button type="submit" className="w-full py-3 mt-2 bg-blue-600 text-white font-bold rounded-lg">Set Password</button>
                    </form>
                )}
            </div>
        </div>
    );
}
export default ForcePasswordChangeModal;