// src/components/ManagerDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function ManagerDashboard({ currentUser }) {
    const [pendingExpenses, setPendingExpenses] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchPendingExpenses = () => {
        // NOTE: This endpoint assumes your backend can find expenses for a manager's team.
        // You would need to implement this logic on your server.
        axios.get(`${API_URL}/expenses/pending/${currentUser._id}`)
            .then(response => {
                setPendingExpenses(response.data);
            })
            .catch(err => {
                console.error("Failed to fetch pending expenses:", err);
                setError("Could not fetch expenses for approval.");
            });
    };

    useEffect(() => {
        fetchPendingExpenses();
    }, [currentUser._id]);

    const handleUpdateStatus = (expenseId, newStatus) => {
        setError('');
        setSuccess('');
        axios.patch(`${API_URL}/expenses/${expenseId}/status`, { status: newStatus })
            .then(() => {
                setSuccess(`Expense has been ${newStatus.toLowerCase()}.`);
                fetchPendingExpenses(); // Refresh the list
                setTimeout(() => setSuccess(''), 3000);
            })
            .catch(err => {
                console.error("Failed to update status:", err);
                setError("Failed to update expense status.");
            });
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Pending Expense Approvals</h2>
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            {success && <p className="text-sm text-green-600 mb-4">{success}</p>}
            <div className="space-y-4">
                {pendingExpenses.length > 0 ? (
                    pendingExpenses.map(exp => (
                        <div key={exp._id} className="p-5 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-500 text-sm">Submitted by: {exp.user.name}</p>
                                    <p className="font-medium text-gray-800 mt-1">{exp.description}</p>
                                    <p className="font-bold text-xl text-blue-600 mt-1">{exp.amount} INR</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => handleUpdateStatus(exp._id, 'Approved')}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateStatus(exp._id, 'Rejected')}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No expenses are currently waiting for your approval.</p>
                )}
            </div>
        </div>
    );
}

export default ManagerDashboard;