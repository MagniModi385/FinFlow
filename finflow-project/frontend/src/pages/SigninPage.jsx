import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

function SigninPage({ onLogin }) {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        axios.post(`${API_URL}/signin`, credentials)
            .then(response => {
                onLogin(response.data.user);
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Sign in failed. Please check your credentials.');
            });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-sm w-full mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-blue-600">Sign In to FinFlow</h1>
                    <p className="mt-2 text-gray-500">Welcome back! Access your dashboard.</p>
                </div>
                <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">Email Address</label>
                            <input type="email" name="email" onChange={handleChange} className="input-field" required />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">Password</label>
                            <input type="password" name="password" onChange={handleChange} className="input-field" required />
                        </div>
                        {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}
                        <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition">Sign In</button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        First time here?{' '}
                        <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
                            Create a new company account.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SigninPage;