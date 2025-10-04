// frontend/src/pages/SignupPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AUTH_API_URL = 'http://localhost:3001/api/auth';
const COUNTRIES_API_URL = 'https://restcountries.com/v3.1/all?fields=name,currencies';

function SignupPage() {
    const [formData, setFormData] = useState({ companyName: '', adminName: '', email: '', password: '', country: '', defaultCurrency: '' });
    const [countries, setCountries] = useState([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(COUNTRIES_API_URL)
            .then(response => {
                const countryData = response.data
                    .map(country => {
                        const currencyCode = Object.keys(country.currencies || {})[0];
                        return currencyCode ? { name: country.name.common, currency: currencyCode } : null;
                    })
                    .filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
                setCountries(countryData);
                if (countryData.length > 0) {
                    const defaultCountry = countryData.find(c => c.name === "India") || countryData[0];
                    setFormData(prev => ({ ...prev, country: defaultCountry.name, defaultCurrency: defaultCountry.currency }));
                }
            })
            .catch(() => setError('Failed to load country list.'))
            .finally(() => setIsLoadingCountries(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'country') {
            const selectedCountry = countries.find(c => c.name === value);
            setFormData({ ...formData, country: selectedCountry.name, defaultCurrency: selectedCountry.currency });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${AUTH_API_URL}/signup`, formData)
            .then(() => {
                setSuccess('Company created successfully! Redirecting to sign in...');
                setTimeout(() => navigate('/signin'), 2000);
            })
            .catch(err => setError(err.response?.data?.message || 'Signup failed.'));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-blue-600">Create Company</h1>
                </div>
                {success ? <p className="text-center text-green-600">{success}</p> : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} className="input-field" required />
                        <select name="country" onChange={handleChange} value={formData.country} className="input-field" required disabled={isLoadingCountries}>
                            {isLoadingCountries ? <option>Loading countries...</option> : countries.map(c => <option key={c.name} value={c.name}>{c.name} ({c.currency})</option>)}
                        </select>
                        <input type="text" name="adminName" placeholder="Your Full Name (Admin)" onChange={handleChange} className="input-field" required />
                        <input type="email" name="email" placeholder="Your Email" onChange={handleChange} className="input-field" required />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input-field" required />
                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg">Create Account</button>
                    </form>
                )}
                 <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link to="/signin" className="font-semibold text-blue-600">Sign In</Link></p>
            </div>
        </div>
    );
}
export default SignupPage;