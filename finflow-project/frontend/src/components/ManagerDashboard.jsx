// frontend/src/components/ManagerDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001/api';

function ManagerDashboard() {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAllExpenses = useCallback(async () => {
        if (!user) return;
        try {
            const response = await axios.get(`${API_URL}/admin/expenses/${user.company_id}`, { headers: { 'user-id': user._id } });
            setExpenses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch expenses.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchAllExpenses(); }, [fetchAllExpenses]);

    const handleUpdateStatus = async (expenseId, status) => {
        try {
            const response = await axios.put(`${API_URL}/admin/expenses/${expenseId}/status`, { status }, { headers: { 'user-id': user._id } });
            setExpenses(prev => prev.map(exp => (exp._id === expenseId ? response.data : exp)));
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Expense Approval Queue</h2>
            <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
                {isLoading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {expenses.map(expense => (
                                    <tr key={expense._id}>
                                        <td className="px-6 py-4">{expense.user_id?.name || 'N/A'}</td>
                                        <td className="px-6 py-4">{expense.description}</td>
                                        <td className="px-6 py-4">{expense.category}</td>
                                        <td className="px-6 py-4">₹{expense.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">{new Date(expense.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ expense.status === 'Approved' ? 'bg-green-100 text-green-800' : expense.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{expense.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {expense.status === 'Pending' && (
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleUpdateStatus(expense._id, 'Approved')} className="text-green-600 hover:text-green-900">Approve</button>
                                                    <button onClick={() => handleUpdateStatus(expense._id, 'Rejected')} className="text-red-600 hover:text-red-900">Reject</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
export default ManagerDashboard;