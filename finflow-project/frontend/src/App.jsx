// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import ForcePasswordChangeModal from './components/ForcePasswordChangeModal';

function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/signin" />;
}

function AdminRoute({ children }) {
    const { user } = useAuth();
    return user && (user.role === 'Admin' || user.role === 'Manager') ? children : <Navigate to="/dashboard" />;
}

function AppContent() {
    const { showPasswordModal } = useAuth();
    return (
        <>
            {showPasswordModal && <ForcePasswordChangeModal />}
            <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/signin" element={<SigninPage />} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/manage-users" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
                <Route path="/" element={<Navigate to="/signin" />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}
export default App;