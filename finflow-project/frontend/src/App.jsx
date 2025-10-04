import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

function PublicRoute({ user, children }) {
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
            path="/signin"
            element={<PublicRoute user={currentUser}><SigninPage onLogin={setCurrentUser} /></PublicRoute>}
        />
        <Route
            path="/signup"
            element={<PublicRoute user={currentUser}><SignupPage /></PublicRoute>}
        />
        <Route
            path="/dashboard"
            element={
                <ProtectedRoute user={currentUser}>
                    <DashboardPage currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
                </ProtectedRoute>
            }
        />
        <Route
            path="*"
            element={<Navigate to={currentUser ? "/dashboard" : "/signin"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;