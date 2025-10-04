// src/components/EmployeeDashboard.jsx

function EmployeeDashboard({ currentUser }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold">Employee Dashboard</h2>
            <p>Welcome, {currentUser.name}! Your expense submission form will be here.</p>
        </div>
    );
}

export default EmployeeDashboard;