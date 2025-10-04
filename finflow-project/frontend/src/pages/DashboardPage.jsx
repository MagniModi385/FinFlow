// src/pages/DashboardPage.jsx

import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <header className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Welcome, {user ? user.name.split(' ')[0] : 'User'}!</h1>
                    <p className="mt-1 text-gray-500">Here's your expense dashboard.</p>
                </div>
                <button 
                    onClick={handleLogout} 
                    className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md transition"
                >
                    Logout
                </button>
            </header>
            
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <AddExpenseForm />
                </div>
                <div className="md:col-span-2">
                    <ExpenseList /> 
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;