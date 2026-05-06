import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Home, UserCircle, CalendarPlus, ClipboardList, LogOut } from 'lucide-react';
import authService from '../services/authService';

const NAV_LINKS = [
    { to: '/home',              label: 'Home',             Icon: Home },
    { to: '/doctors',           label: 'Doctors',          Icon: UserCircle },
    { to: '/appointments/book', label: 'Book Appointment', Icon: CalendarPlus },
    { to: '/my-appointments',   label: 'My Appointments',  Icon: ClipboardList },
];

export default function PatientLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try { await authService.logout(); } catch {}
        finally {
            ['isAuthenticated', 'userRole', 'userName', 'linkedDoctorId', 'linkedPatientId']
                .forEach(k => localStorage.removeItem(k));
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* ── Top Navbar ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link to="/home" className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="bg-brand-primary p-1.5 rounded-lg">
                            <Activity size={20} className="text-white" />
                        </div>
                        <span className="text-brand-dark text-lg font-bold tracking-wide">Medcare</span>
                    </Link>

                    {/* Nav links */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {NAV_LINKS.map(({ to, label, Icon }) => {
                            const isActive = location.pathname === to;
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                                        ${isActive
                                            ? 'text-brand-primary bg-brand-primary/10'
                                            : 'text-gray-500 hover:text-brand-primary hover:bg-gray-50'}`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex-shrink-0"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </nav>

            {/* ── Page content (offset for fixed navbar) ── */}
            <main className="pt-16">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    {children}
                </div>
            </main>

        </div>
    );
}
