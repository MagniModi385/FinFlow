// src/components/EmployeeDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function EmployeeDashboard({ currentUser }) {
    const [expense, setExpense] = useState({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });
    
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchUserExpenses = () => {
        axios.get(`${API_URL}/expenses/${currentUser._id}`)
            .then(response => setExpenses(response.data))
            .catch(err => console.error("Failed to fetch expenses:", err));
    };

    useEffect(() => {
        fetchUserExpenses();
    }, [currentUser._id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExpense(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!expense.amount || !expense.category || !expense.description || !expense.date) {
            setError("Please fill in all fields.");
            return;
        }

        const expenseData = {
            amount: expense.amount,
            description: `${expense.category} - ${expense.description} (Date: ${expense.date})`,
            user_id: currentUser._id,
        };

        axios.post(`${API_URL}/expenses`, expenseData)
            .then(() => {
                setSuccess("Expense submitted successfully!");
                fetchUserExpenses();
                setExpense({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
                setTimeout(() => setSuccess(''), 3000); // Clear message after 3 seconds
            })
            .catch(err => setError("Failed to submit expense. Please try again."));
    };
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="space-y-10">
            {/* Expense Submission Form Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Submit a New Expense</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-semibold text-gray-600 mb-1">Amount (INR)</label>
                        <input type="number" name="amount" value={expense.amount} onChange={handleInputChange} className="input-field" placeholder="e.g., 500" />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-semibold text-gray-600 mb-1">Date of Expense</label>
                        <input type="date" name="date" value={expense.date} onChange={handleInputChange} className="input-field" />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="category" className="block text-sm font-semibold text-gray-600 mb-1">Category</label>
                        <input type="text" name="category" value={expense.category} onChange={handleInputChange} className="input-field" placeholder="e.g., Travel, Food, Supplies" />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
                        <textarea name="description" value={expense.description} onChange={handleInputChange} rows="3" className="input-field" placeholder="e.g., Client lunch meeting"></textarea>
                    </div>
                    <div className="md:col-span-2">
                        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
                        {success && <p className="text-sm text-green-600 mb-4">{success}</p>}
                        <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition">
                            Submit Expense
                        </button>
                    </div>
                </form>
            </div>

            {/* Expense History Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Expense History</h2>
                <div className="space-y-4">
                    {expenses.length > 0 ? (
                        expenses.map(exp => (
                            <div key={exp._id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition">
                                <div>
                                    <p className="font-semibold text-gray-800">{exp.description}</p>
                                    <p className="font-bold text-lg text-blue-600">{exp.amount} INR</p>
                                </div>
                                <span className={`px-4 py-1 text-sm font-bold rounded-full ${getStatusClass(exp.status)}`}>
                                    {exp.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">You have not submitted any expenses yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Add this class to your index.css or a global stylesheet for reuse
/*
.input-field {
    @apply mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition;
}
*/
export default EmployeeDashboard;