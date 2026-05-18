import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Home, UserCircle, CalendarPlus, ClipboardList, LogOut } from 'lucide-react';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
    { to: '/home',              label: 'Home',            Icon: Home },
    { to: '/doctors',           label: 'Doctors',         Icon: UserCircle },
    { to: '/appointments/book', label: 'Book',            Icon: CalendarPlus },
    { to: '/my-appointments',   label: 'My Appointments', Icon: ClipboardList },
];

export default function PatientLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogout = async () => {
        try { await authService.logout(); } catch {}
        finally {
            setUser(null);
            navigate('/');
        }
    };

    return (
        <div
            className="min-h-screen"
            style={{ background: '#eef4f1', fontFamily: 'Nunito Sans, sans-serif' }}
        >
            {/* ── Navbar ── */}
            <nav
                className="fixed top-0 left-0 right-0 z-50"
                style={{
                    background:           'rgba(255,255,255,0.84)',
                    backdropFilter:       'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom:         '1px solid rgba(14,61,54,0.08)',
                    boxShadow:            '0 1px 24px rgba(14,61,54,0.06)',
                }}
            >
                <div
                    className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-6"
                    style={{ height: '60px' }}
                >
                    {/* Logo */}
                    <Link to="/home" className="flex items-center gap-2.5 flex-shrink-0 group">
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #108970 0%, #0fc98a 100%)',
                                boxShadow:  '0 3px 10px rgba(16,137,112,0.3)',
                            }}
                        >
                            <Activity size={16} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span
                            className="font-bold tracking-wide"
                            style={{ fontFamily: 'Syne, sans-serif', color: '#0e3d36', fontSize: '17px' }}
                        >
                            Medcare
                        </span>
                    </Link>

                    {/* Nav links */}
                    <div className="flex items-center gap-0.5">
                        {NAV_LINKS.map(({ to, label, Icon }) => {
                            const isActive = location.pathname === to;
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] whitespace-nowrap transition-all duration-150"
                                    style={{
                                        fontFamily:  'Syne, sans-serif',
                                        fontWeight:  600,
                                        color:       isActive ? '#108970' : '#4a6e68',
                                        background:  isActive ? 'rgba(16,137,112,0.1)' : 'transparent',
                                        borderBottom: isActive ? '2px solid #108970' : '2px solid transparent',
                                    }}
                                >
                                    <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-2 rounded-xl transition-all duration-150 flex-shrink-0"
                        style={{
                            fontFamily: 'Syne, sans-serif',
                            color:      '#4a6e68',
                            border:     '1px solid rgba(14,61,54,0.1)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color      = '#ef4444';
                            e.currentTarget.style.background = 'rgba(239,68,68,0.06)';
                            e.currentTarget.style.borderColor= 'rgba(239,68,68,0.2)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color      = '#4a6e68';
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor= 'rgba(14,61,54,0.1)';
                        }}
                    >
                        <LogOut size={14} />
                        Logout
                    </button>
                </div>
            </nav>

            {/* ── Content ── */}
            <main className="pt-16">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
