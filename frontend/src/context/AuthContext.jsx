import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage on mount
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data); // data usually contains user info
            if (data.token) setToken(data.token);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            setUser(data);
            if (data.token) setToken(data.token);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setToken(null);
        window.location.href = '/login';
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
