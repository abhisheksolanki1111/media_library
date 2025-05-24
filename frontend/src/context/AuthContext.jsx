import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const getDecodedToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            return null;
        }
        return decoded;
    } catch (err) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const storedAuth = localStorage.getItem('auth');
    const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;

    const [token, setToken] = useState(parsedAuth?.token || null);
    const [user, setUser] = useState(parsedAuth?.user || null);


    const login = (newToken, userDetails) => {
        const decoded = getDecodedToken(newToken);
        if (!decoded) {
            logout();
            return;
        }

        const authData = {
            token: newToken,
            user: userDetails,
            decoded: decoded
        };

        localStorage.setItem('auth', JSON.stringify(authData));
        setToken(newToken);
        setUser(userDetails);
    };
    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUser(null);
        navigate('/login');
    };
    const isAuthenticated = () => !!user;

    const hasRole = (role) => user?.role === role;

    const isAdmin = () => hasRole('admin');

    const isUploader = () => hasRole('uploader') || isAdmin();

    return (
        <AuthContext.Provider value={{ user, decoded: getDecodedToken(token), token, login, logout, isAuthenticated, isAdmin, isUploader }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
