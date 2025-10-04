// frontend/src/components/ExpenseList.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001/api';

function ExpenseList({ newExpense }) {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchExpenses = useCallback(async () => {
        if (!user) return;
        try {
            const response = await axios.get(`${API_URL}/expenses/${user._id}`);
            setExpenses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch expenses.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchExpenses(); }, [fetchExpenses]);
    useEffect(() => { if (newExpense) setExpenses(prev => [newExpense, ...prev]); }, [newExpense]);

    if (isLoading) return <p className="text-center">Loading expenses...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Submitted Expenses</h2>
            {expenses.length === 0 ? <p className="text-center text-gray-500">No expenses yet.</p> : (
                <ul className="divide-y divide-gray-200">
                    {expenses.map(expense => (
                        <li key={expense._id} className="py-4 flex justify-between items-center">
                            <div>
                                <p className="text-lg font-semibold">{expense.description}</p>
                                <p className="text-sm text-gray-500">{new Date(expense.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-blue-600">₹{expense.amount.toFixed(2)}</p>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ expense.status === 'Approved' ? 'bg-green-100 text-green-800' : expense.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{expense.status}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default ExpenseList;