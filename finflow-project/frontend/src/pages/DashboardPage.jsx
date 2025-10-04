// src/pages/DashboardPage.jsx
import EmployeeDashboard from '../components/EmployeeDashboard';
import ManagerDashboard from '../components/ManagerDashboard';

function DashboardPage({ currentUser, onLogout }) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <span className="text-3xl font-bold text-blue-600">FinFlow</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-6 text-gray-700 font-medium">
                                Welcome, <span className="font-bold">{currentUser.name}</span>!
                            </span>
                            <button
                                onClick={onLogout}
                                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-sm transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
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