import { Navigate, Outlet } from 'react-router-dom';

// Outer guard — blocks unauthenticated users entirely
export default function ProtectedRoute() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) return <Navigate to="/" replace />;
    return <Outlet />;
}

// Inner guard — blocks wrong roles; assumes auth already passed
export function RoleRoute({ allowedRoles }) {
    const userRole = localStorage.getItem('userRole');
    if (!allowedRoles.includes(userRole)) {
        if (userRole === 'User') return <Navigate to="/home" replace />;
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
}
