// frontend/src/components/AddEmployeeForm.jsx

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001/api';

function AddEmployeeForm({ onEmployeeAdded }) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Employee',
    });
    const [error, setError] = useState('');
    const [successInfo, setSuccessInfo] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessInfo(null);

        try {
            const response = await axios.post(`${API_URL}/admin/employees`, 
                {
                    ...formData,
                    companyId: user.company_id
                },
                {
                    headers: { 'user-id': user._id }
                }
            );

            setSuccessInfo(response.data);
            setFormData({ name: '', email: '', role: 'Employee' }); // Reset form
            if (onEmployeeAdded) {
                onEmployeeAdded(response.data.employee);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add employee.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg h-full">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add New Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="input-field">
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>

                <button type="submit" className="w-full py-3 mt-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition">Create Employee Account</button>

                {error && <p className="text-sm text-red-600 text-center font-medium mt-4">{error}</p>}

                {successInfo && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-lg text-center">
                        <p className="font-semibold text-green-700">{successInfo.message}</p>
                        <p className="text-sm text-gray-600 mt-2">Please share these credentials with the new employee:</p>
                        <div className="mt-2 text-left bg-gray-50 p-3 rounded">
                            <p><span className="font-semibold">Email:</span> {successInfo.employee.email}</p>
                            <p><span className="font-semibold">Temporary Password:</span>
                                <strong className="text-red-600 ml-2 select-all">{successInfo.temporaryPassword}</strong>
                            </p>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default AddEmployeeForm;