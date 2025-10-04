// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('finflow_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            if (parsedUser.isTemporaryPassword) {
                setShowPasswordModal(true);
            }
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('finflow_user', JSON.stringify(userData));
        setUser(userData);
        if (userData.isTemporaryPassword) {
            setShowPasswordModal(true);
        }
    };

    const logout = () => {
        localStorage.removeItem('finflow_user');
        setUser(null);
        setShowPasswordModal(false);
    };
    
    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
        localStorage.setItem('finflow_user', JSON.stringify(updatedUserData));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, showPasswordModal, setShowPasswordModal }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};