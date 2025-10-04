// src/components/ExpenseList.jsx

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
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/expenses/${user._id}`);
            setExpenses(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch expenses.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    useEffect(() => {
        if (newExpense) {
            setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
        }
    }, [newExpense]);

    if (isLoading) {
        return <p className="text-center mt-8">Loading expenses...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600 mt-8">{error}</p>;
    }

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Expenses</h2>
            {expenses.length === 0 ? (
                <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-lg text-center text-gray-500">
                    You haven't added any expenses yet.
                </div>
            ) : (
                <div className="bg-white p-4 sm:p-8 border border-gray-200 rounded-2xl shadow-lg">
                    <ul className="divide-y divide-gray-200">
                        {expenses.map((expense) => (
                            <li key={expense._id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="flex-grow">
                                    <p className="text-lg font-semibold text-gray-900">{expense.description}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(expense.createdAt).toLocaleDateString()} - {expense.category} - 
                                        <span className={`font-medium ${
                                            expense.status === 'Approved' ? 'text-green-600' : 
                                            expense.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                            {expense.status}
                                        </span>
                                    </p>
                                </div>
                                <p className="text-xl font-bold text-blue-600 mt-2 sm:mt-0 whitespace-nowrap pl-4">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: expense.currency || 'INR' }).format(expense.amount)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ExpenseList;