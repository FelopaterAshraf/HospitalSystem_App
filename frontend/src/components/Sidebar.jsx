import { 
    Activity, LayoutDashboard, Users, Calendar, 
    UserCircle, BarChart2, HelpCircle, 
    Settings, Flag, LogOut 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import authService from '../services/authService';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate(); 
    // The Logout Function
    const handleLogout = async () => {
        try {
            // Tell the backend to destroy the HttpOnly cookies
            await authService.logout(); 
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            // --- ADD THESE TWO LINES TO DESTROY THE VIP WRISTBAND ---
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            // --------------------------------------------------------
            localStorage.removeItem('userName'); 
            
            // Kick them back to the login screen
            navigate('/'); 
        }
    };

    const getLinkStyle = (path) => {
        const isActive = location.pathname === path;
        return `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            isActive 
                ? 'bg-brand-primary text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-white/10'
        }`;
    };

    return (
        // The flex-col here is what allows mt-auto to push the logout button to the bottom
        <aside className="w-64 bg-brand-dark min-h-screen rounded-r-[2rem] p-6 flex flex-col fixed left-0 top-0">
            {/* Logo Area */}
            <div className="flex items-center gap-3 mb-10 pl-2 mt-2">
                <div className="bg-brand-primary p-2 rounded-xl">
                    <Activity size={24} className="text-white" />
                </div>
                <span className="text-white text-2xl font-bold tracking-wide">Medcare</span>
            </div>

            {/* Main Menu */}
            <p className="text-xs text-gray-400 font-semibold mb-4 tracking-wider pl-4">MENU</p>
            <nav className="flex flex-col gap-2 mb-10">
                <Link to="/dashboard" className={getLinkStyle('/dashboard')}>
                    <LayoutDashboard size={20} /> Dashboard
                </Link>
                <Link to="/doctors" className={getLinkStyle('/doctors')}>
                    <UserCircle size={20} /> Doctors
                </Link>
                <Link to="/patients" className={getLinkStyle('/patients')}>
                    <Users size={20} /> Patients
                </Link>
                <Link to="/appointments" className={getLinkStyle('/appointments')}>
                    <Calendar size={20} /> Appointments
                </Link>
            </nav>

            
            {/* --- LOGOUT BUTTON AT THE VERY BOTTOM --- */}
            <div className="mt-auto pt-4 border-t border-white/10">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-3 rounded-xl"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Log Out</span>
                </button>
            </div>
        </aside>
    );
}