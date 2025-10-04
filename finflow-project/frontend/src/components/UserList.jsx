// frontend/src/components/UserList.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001/api';

function UserList({ newUser }) {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = useCallback(async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/admin/employees/${user.company_id}`, {
                headers: { 'user-id': user._id }
            });
            setUsers(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        if (newUser) {
            setUsers(prevUsers => [newUser, ...prevUsers]);
        }
    }, [newUser]);

    const handleRemoveUser = async (employeeId) => {
        if (!window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/admin/employees/${employeeId}`, {
                headers: { 'user-id': user._id }
            });
            setUsers(prevUsers => prevUsers.filter(u => u._id !== employeeId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove user.');
        }
    };

    if (isLoading) return <p>Loading users...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="bg-white p-4 sm:p-8 border border-gray-200 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Company Employees</h2>
            {users.length === 0 ? (
                <p className="text-center text-gray-500">No employees have been added yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((employee) => (
                                <tr key={employee._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{employee.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleRemoveUser(employee._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
export default UserList;