// frontend/src/pages/SigninPage.jsx
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

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${API_URL}/signin`, formData)
            .then(response => {
                login(response.data.user);
                navigate('/dashboard');
            })
            .catch(err => setError(err.response?.data?.message || 'Sign in failed.'));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
                 <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-blue-600">Sign In</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className="input-field" required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input-field" required />
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg">Sign In</button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <Link to="/signup" className="font-semibold text-blue-600">Sign Up</Link></p>
            </div>
        </div>
    );
}
export default SigninPage;