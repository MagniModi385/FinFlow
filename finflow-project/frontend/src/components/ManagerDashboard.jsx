// src/components/ManagerDashboard.jsx

function ManagerDashboard({ currentUser }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold">Manager Dashboard</h2>
            <p>Welcome, {currentUser.name}! The list of pending approvals will be here.</p>
        </div>
    );
}

export default ManagerDashboard;