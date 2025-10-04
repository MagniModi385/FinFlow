import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

function SignupPage() {
    const [formData, setFormData] = useState({
        companyName: '',
        adminName: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        axios.post(`${API_URL}/signup`, formData)
            .then(() => {
                setSuccess('Company and Admin account created successfully! You can now sign in.');
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Signup failed. Please try again.');
            });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-blue-600">Create Your Company</h1>
                    <p className="mt-2 text-gray-500">Welcome! Let's get your company set up on FinFlow.</p>
                </div>
                <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-lg">
                    {success ? (
                        <div className="text-center">
                            <p className="text-lg text-green-600 font-semibold">{success}</p>
                            <Link to="/signin" className="mt-4 inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md">
                                Proceed to Sign In
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Company Name</label>
                                <input type="text" name="companyName" onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Your Full Name (Admin)</label>
                                <input type="text" name="adminName" onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Your Email</label>
                                <input type="email" name="email" onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
                                <input type="password" name="password" onChange={handleChange} className="input-field" required />
                            </div>
                            {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}
                            <button type="submit" className="w-full py-3 mt-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition">Create Account</button>
                        </form>
                    )}
                    {!success && (
                        <p className="text-center text-sm text-gray-500 mt-6">
                            Already have an account?{' '}
                            <Link to="/signin" className="font-semibold text-blue-600 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SignupPage;