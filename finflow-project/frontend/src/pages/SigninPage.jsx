// src/pages/SigninPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001/api/auth';

function SigninPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        axios.post(`${API_URL}/signin`, formData)
            .then(response => {
                login(response.data.user);
                navigate('/dashboard');
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Sign in failed. Please check your credentials.');
            });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-blue-600">Sign In</h1>
                    <p className="mt-2 text-gray-500">Welcome back to FinFlow!</p>
                </div>
                <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
                            <input type="email" name="email" onChange={handleChange} className="input-field" required />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
                            <input type="password" name="password" onChange={handleChange} className="input-field" required />
                        </div>
                        {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}
                        <button type="submit" className="w-full py-3 mt-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition">Sign In</button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SigninPage;