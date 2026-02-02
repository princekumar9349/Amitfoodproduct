import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // You can replace this with a proper loading spinner component later
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
