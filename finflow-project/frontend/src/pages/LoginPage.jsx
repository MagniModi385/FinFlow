// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function LoginPage({ onLogin }) {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [error, setError] = useState('');

    // 1. Fetch all users from the API when the component loads
    useEffect(() => {
        axios.get(`${API_URL}/users`).then(response => {
            setUsers(response.data);
        }).catch(err => {
            console.error("Failed to fetch users:", err);
            setError("Could not connect to the server. Is it running?");
        });
    }, []);

    // 2. Handle the form submission
    const handleLogin = (e) => {
        e.preventDefault();
        if (!selectedUserId) {
            setError('Please select a user to continue.');
            return;
        }
        const user = users.find(u => u._id === parseInt(selectedUserId));
        onLogin(user); // 3. Pass the selected user object back to App.jsx
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <h1 className="text-4xl font-bold text-center text-blue-600">FinFlow</h1>
                <p className="mt-2 text-center text-gray-500">Your streamlined expense management.</p>
            </div>
            <div className="max-w-md w-full mx-auto mt-8 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="user" className="text-sm font-medium text-gray-700 block">
                            Login As
                        </label>
                        <select
                            id="user"
                            value={selectedUserId}
                            onChange={(e) => {
                                setSelectedUserId(e.target.value);
                                setError('');
                            }}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>-- Select a user --</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>{user.name} ({user.role})</option>
                            ))}
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;