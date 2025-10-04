// src/components/AddExpenseForm.jsx

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001/api';

function AddExpenseForm({ onExpenseAdded }) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Food',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!user) {
            setError('You must be logged in to add an expense.');
            return;
        }

        const expenseData = {
            ...formData,
            userId: user._id,
            companyId: user.company_id,
            amount: parseFloat(formData.amount)
        };

        try {
            const response = await axios.post(`${API_URL}/expenses`, expenseData);
            setSuccess('Expense added successfully!');
            setFormData({ description: '', amount: '', category: 'Food' });
            // Notify parent component that a new expense was added
            if (onExpenseAdded) {
                onExpenseAdded(response.data.expense);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expense.');
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-lg h-full">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Add New Expense</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Amount ({user?.defaultCurrency || '...'})</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Supplies">Office Supplies</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}
                    {success && <p className="text-sm text-green-600 text-center font-medium">{success}</p>}
                    <button type="submit" className="w-full py-3 mt-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition">Submit Expense</button>
                </form>
            </div>
        </div>
    );
}

export default AddExpenseForm;