import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Spinner() {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5faf7' }}>
            <div
                style={{
                    width: 40, height: 40,
                    border: '3px solid #e2ede9',
                    borderTop: '3px solid #108970',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// Outer guard — blocks unauthenticated users entirely.
// Waits for /auth/me to finish before making a decision.
export default function ProtectedRoute() {
    const { user, loading } = useAuth();
    if (loading) return <Spinner />;
    if (!user)   return <Navigate to="/" replace />;
    return <Outlet />;
}

// Inner guard — blocks wrong roles; auth already verified by ProtectedRoute.
export function RoleRoute({ allowedRoles }) {
    const { user } = useAuth();
    if (!allowedRoles.includes(user?.role)) {
        if (user?.role === 'User') return <Navigate to="/home"      replace />;
        return                            <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
}
