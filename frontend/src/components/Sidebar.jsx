import {
    Activity, LayoutDashboard, Users, Calendar,
    UserCircle, LogOut, Home, CalendarPlus, ClipboardList, Clock,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const ADMIN_LINKS = [
    { to: '/dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
    { to: '/doctors',      label: 'Doctors',      Icon: UserCircle },
    { to: '/patients',     label: 'Patients',     Icon: Users },
    { to: '/appointments', label: 'Appointments', Icon: Calendar },
];

const DOCTOR_LINKS = [
    { to: '/dashboard',            label: 'Dashboard',           Icon: LayoutDashboard },
    { to: '/appointments/pending', label: 'Pending Requests',    Icon: Clock },
];

const USER_LINKS = [
    { to: '/home',               label: 'Home',            Icon: Home },
    { to: '/doctors',            label: 'Doctors',         Icon: UserCircle },
    { to: '/appointments/book',  label: 'Book Appointment', Icon: CalendarPlus },
    { to: '/my-appointments',    label: 'My Appointments', Icon: ClipboardList },
];

export default function Sidebar() {
    const location  = useLocation();
    const navigate  = useNavigate();
    const userRole  = localStorage.getItem('userRole');
    const userName  = localStorage.getItem('userName') || 'User';
    const userSpecialty = localStorage.getItem('userSpecialty');

    const links = userRole === 'Admin'  ? ADMIN_LINKS
                : userRole === 'Doctor' ? DOCTOR_LINKS
                : USER_LINKS;
                

    const handleLogout = async () => {
        try { await authService.logout(); } catch {}
        finally {
            ['isAuthenticated', 'userRole', 'userName', 'linkedDoctorId', 'linkedPatientId']
                .forEach(k => localStorage.removeItem(k));
            navigate('/');
        }
    };

    const roleLabel = userRole === 'Admin'  ? 'Administrator'
                    : userRole === 'Doctor' ? (userSpecialty || 'Physician')
                    : 'Patient';
    return (
        <aside
            aria-label="Site navigation"
            className="w-64 min-h-screen fixed left-0 top-0 flex flex-col overflow-hidden"
            style={{ background: 'linear-gradient(168deg, #0e3d36 0%, #071f1a 100%)' }}
        >
            {/* Dot grid pattern */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />
            {/* Glow top-right */}
            <div
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: 'rgba(15,201,138,0.07)', filter: 'blur(40px)' }}
            />

            <div className="relative flex flex-col h-full min-h-screen">

                {/* ── Logo ── */}
                <div className="px-5 pt-7 pb-5">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #108970 0%, #0fc98a 100%)', boxShadow: '0 4px 12px rgba(15,201,138,0.35)' }}
                        >
                            <Activity aria-hidden="true" size={18} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <span
                                className="text-white font-bold text-[17px] leading-none tracking-wide"
                                style={{ fontFamily: 'Syne, sans-serif' }}
                            >
                                Medcare
                            </span>
                            <div className="text-white/30 text-[9px] mt-0.5 uppercase tracking-[0.14em] font-semibold">Hospital System</div>
                        </div>
                    </div>
                </div>

                <div className="mx-5 border-t mb-5" style={{ borderColor: 'rgba(255,255,255,0.07)' }} />

                {/* ── Nav ── */}
                <nav aria-label="Main menu" className="px-3 flex flex-col gap-0.5">
                    <p
                        className="text-[9.5px] font-bold uppercase tracking-[0.14em] px-3 mb-2"
                        style={{ color: 'rgba(255,255,255,0.22)', fontFamily: 'Syne, sans-serif' }}
                    >
                        Menu
                    </p>

                    {links.map(({ to, label, Icon }) => {
                        const isActive = location.pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                aria-current={isActive ? 'page' : undefined}
                                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group overflow-hidden"
                                style={{
                                    background: isActive ? 'rgba(15,201,138,0.14)' : 'transparent',
                                    color:      isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.42)',
                                }}
                            >
                                {/* Active left indicator */}
                                {isActive && (
                                    <span
                                        className="absolute left-0 top-[30%] bottom-[30%] w-[3px] rounded-r-full"
                                        style={{ background: '#0fc98a' }}
                                    />
                                )}

                                {/* Hover overlay */}
                                <span
                                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                    style={{ background: isActive ? 'transparent' : 'rgba(255,255,255,0.04)' }}
                                />

                                <Icon
                                    aria-hidden="true"
                                    size={16}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    style={{ color: isActive ? '#0fc98a' : 'inherit', flexShrink: 0 }}
                                />
                                <span
                                    className="text-[13px] font-semibold relative"
                                    style={{ fontFamily: 'Syne, sans-serif' }}
                                >
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex-1" />

                {/* ── User card ── */}
                <div className="px-3 pb-5">
                    <div
                        className="rounded-2xl p-3.5"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        <div className="flex items-center gap-2.5 mb-3">
                            {/* Avatar */}
                            <div
                                aria-hidden="true"
                                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                                style={{ background: 'linear-gradient(135deg, #108970, #0fc98a)' }}
                            >
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p
                                    className="text-white text-[12.5px] font-bold truncate leading-tight"
                                    style={{ fontFamily: 'Syne, sans-serif' }}
                                >
                                    {userName}
                                </p>
                                <p className="text-[10px] font-medium" style={{ color: '#0fc98a' }}>
                                    {roleLabel}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
                            style={{ color: 'rgba(255,255,255,0.35)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                        >
                            <LogOut aria-hidden="true" size={13} />
                            Sign out
                        </button>
                    </div>
                </div>

            </div>
        </aside>
    );
}
