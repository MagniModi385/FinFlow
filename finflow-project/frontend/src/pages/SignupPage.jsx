// src/pages/SignupPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AUTH_API_URL = 'http://localhost:3001/api/auth';
const COUNTRIES_API_URL = 'https://restcountries.com/v3.1/all?fields=name,currencies';

function SignupPage() {
    const [formData, setFormData] = useState({
        companyName: '',
        adminName: '',
        email: '',
        password: '',
        country: '',
        defaultCurrency: '',
    });
    const [countries, setCountries] = useState([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get(COUNTRIES_API_URL);
                const countryData = response.data
                    .map(country => {
                        const currencyCode = Object.keys(country.currencies || {})[0];
                        return currencyCode ? {
                            name: country.name.common,
                            currency: currencyCode
                        } : null;
                    })
                    .filter(Boolean)
                    .sort((a, b) => a.name.localeCompare(b.name));

                setCountries(countryData);
                
                if (countryData.length > 0) {
                    const defaultCountry = countryData.find(c => c.name === "India") || countryData[0];
                    setFormData(prev => ({
                        ...prev,
                        country: defaultCountry.name,
                        defaultCurrency: defaultCountry.currency,
                    }));
                }
            } catch (err) {
                setError('Failed to load country list.');
            } finally {
                setIsLoadingCountries(false);
            }
        };
        fetchCountries();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'country') {
            const selectedCountry = countries.find(c => c.name === value);
            setFormData({
                ...formData,
                country: selectedCountry.name,
                defaultCurrency: selectedCountry.currency,
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        axios.post(`${AUTH_API_URL}/signup`, formData)
            .then(() => {
                setSuccess('Company and Admin account created successfully! Redirecting to sign in...');
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
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
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Company Name</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Country</label>
                                <select 
                                    name="country" 
                                    onChange={handleChange} 
                                    value={formData.country} 
                                    className="input-field" 
                                    required
                                    disabled={isLoadingCountries}
                                >
                                    {isLoadingCountries ? (
                                        <option>Loading countries...</option>
                                    ) : (
                                        countries.map(country => (
                                            <option key={country.name} value={country.name}>
                                                {country.name} ({country.currency})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Your Full Name (Admin)</label>
                                <input type="text" name="adminName" value={formData.adminName} onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Your Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" required />
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