import Sidebar from './Sidebar';
import PatientLayout from './PatientLayout';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children }) {
    const { user } = useAuth();
    const userRole = user?.role;

    if (userRole === 'User') {
        return <PatientLayout>{children}</PatientLayout>;
    }

    return (
        <div className="flex min-h-screen bg-brand-light font-sans">
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <Sidebar />
            <main id="main-content" tabIndex={-1} className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
