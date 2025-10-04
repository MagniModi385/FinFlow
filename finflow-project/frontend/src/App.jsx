// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import DashboardPage from './pages/DashboardPage';

// A wrapper to protect routes that require authentication
function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/signin" />;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/signin" element={<SigninPage />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        } 
                    />
                    <Route path="/" element={<Navigate to="/signin" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;