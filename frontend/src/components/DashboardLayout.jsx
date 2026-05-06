import Sidebar from './Sidebar';
import PatientLayout from './PatientLayout';

export default function DashboardLayout({ children }) {
    const userRole = localStorage.getItem('userRole');

    if (userRole === 'User') {
        return <PatientLayout>{children}</PatientLayout>;
    }

    return (
        <div className="flex min-h-screen bg-brand-light font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
