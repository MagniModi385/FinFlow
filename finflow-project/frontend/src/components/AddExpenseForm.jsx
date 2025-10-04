// frontend/src/components/AddExpenseForm.jsx
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001/api';

function AddExpenseForm({ onExpenseAdded }) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ description: '', amount: '', category: 'Food' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (!user) return setError('You must be logged in.');
        
        const expenseData = { ...formData, userId: user._id, companyId: user.company_id, amount: parseFloat(formData.amount) };

        try {
            const response = await axios.post(`${API_URL}/expenses`, expenseData);
            setSuccess('Expense added successfully!');
            setFormData({ description: '', amount: '', category: 'Food' });
            if (onExpenseAdded) onExpenseAdded(response.data.expense);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expense.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg h-full">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="input-field" required />
                <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="input-field" required />
                <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Software">Software</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Health">Health</option>
                    <option value="Other">Other</option>
                </select>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                {success && <p className="text-sm text-green-600 text-center">{success}</p>}
                <button type="submit" className="w-full py-3 mt-2 bg-blue-600 text-white font-bold rounded-lg">Submit Expense</button>
            </form>
        </div>
    );
}
export default AddExpenseForm;