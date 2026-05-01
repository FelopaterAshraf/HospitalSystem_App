import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "../services/authService";
import { Activity } from "lucide-react";

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyCookie = async () => {
            try {
                // This asks the backend: "Is my HttpOnly cookie valid?"
                await authService.refresh(); 
                setIsAuthenticated(true);
            } catch (error) {
                // If it fails (expired or missing), lock them out.
                setIsAuthenticated(false);
            }
        };

        verifyCookie();
    }, []);

    // While waiting for the backend to answer, show a loading screen
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Activity className="animate-spin text-brand-primary mb-4" size={48} />
                <p className="text-slate-500 font-medium">Verifying secure session...</p>
            </div>
        );
    }

    // If verified, let them in. If not, kick them to login.
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}