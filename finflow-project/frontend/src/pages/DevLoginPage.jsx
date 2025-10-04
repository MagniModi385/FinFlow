import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function DevLoginPage({ onLogin }) {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`${API_URL}/users`)
            .then(response => {
                setUsers(response.data);
                if (response.data.length > 0) {
                    setSelectedUserId(response.data[0]._id);
                }
            })
            .catch(err => setError('Could not fetch user list. Is the server running?'));
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (!selectedUserId) return;
        const user = users.find(u => u._id === parseInt(selectedUserId));
        onLogin(user);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-sm w-full mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-blue-600">Developer Login</h1>
                    <p className="mt-2 text-gray-500">Quickly log in as a pre-seeded user.</p>
                </div>
                <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-lg">
                    <form onSubmit={handleLogin} className="space-y-6">
                         <div>
                            <label htmlFor="user" className="text-sm font-semibold text-gray-700 block mb-2">Select a User</label>
                            <select id="user" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="input-field">
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>{user.name} ({user.role})</option>
                                ))}
                            </select>
                        </div>
                        {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}
                        <button type="submit" className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-lg shadow-md transition">Login as Selected User</button>
                    </form>
                     <p className="text-center text-sm text-gray-500 mt-6">
                        <Link to="/" className="font-semibold text-blue-600 hover:underline">
                           &larr; Back to Welcome Screen
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DevLoginPage;