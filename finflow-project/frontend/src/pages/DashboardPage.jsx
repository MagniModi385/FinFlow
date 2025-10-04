// frontend/src/pages/DashboardPage.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import EmployeeDashboard from '../components/EmployeeDashboard';
import ManagerDashboard from '../components/ManagerDashboard';

function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Welcome, {user.name.split(' ')[0]}!</h1>
                    <p className="mt-1 text-gray-500">You are logged in as an {user.role}.</p>
                </div>
                <div className="flex items-center space-x-4">
                     {user.role !== 'Employee' && (
                        <Link to="/manage-users" className="py-2 px-4 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-lg">
                            Manage Users
                        </Link>
                    )}
                    <button onClick={handleLogout} className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg">
                        Logout
                    </button>
                </div>
            </header>
            <main>
                {user.role === 'Employee' ? <EmployeeDashboard /> : <ManagerDashboard />}
            </main>
        </div>
    );
}
export default DashboardPage;