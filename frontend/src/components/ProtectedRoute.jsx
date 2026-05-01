import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    // Check the VIP wristband in local storage
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
        // If they don't have it, kick them to login
        return <Navigate to="/" replace />;
    }

    // If they have it, render the nested dashboard routes
    return <Outlet />;
}