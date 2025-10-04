// src/pages/DashboardPage.jsx
import EmployeeDashboard from '../components/EmployeeDashboard';
import ManagerDashboard from '../components/ManagerDashboard';

function DashboardPage({ currentUser, onLogout }) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-blue-600">FinFlow</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-gray-600">Welcome, {currentUser.name}!</span>
                            <button
                                onClick={onLogout}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Conditional Rendering Logic */}
                {currentUser.role === 'Employee' ? (
                    <EmployeeDashboard currentUser={currentUser} />
                ) : (
                    <ManagerDashboard currentUser={currentUser} />
                )}
            </main>
        </div>
    );
}

export default DashboardPage;