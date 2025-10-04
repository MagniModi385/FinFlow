import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!currentUser ? <LoginPage onLogin={setCurrentUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={currentUser ? <DashboardPage currentUser={currentUser} onLogout={() => setCurrentUser(null)} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;