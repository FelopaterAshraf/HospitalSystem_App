import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- We need this for the Quick Action links!
import doctorService from '../services/doctorService';
import patientService from '../services/patientService';
import appointmentService from '../services/appointmentService';
import { Users, UserCircle, Calendar, Activity } from 'lucide-react';

export default function Dashboard() {
    // 1. We added the userName state here!
    const [userName, setUserName] = useState('Admin'); 
    
    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0 
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // --- 2. Decode the Token to get the user's name ---
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decodedToken = JSON.parse(jsonPayload);
                
                const extractedName = 
                    decodedToken.name || 
                    decodedToken.unique_name || 
                    decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || 
                    'Admin';
                    
                setUserName(extractedName);
            } catch (error) {
                console.error("Could not read name from token", error);
            }
        }

        // --- 3. Fetch Dashboard Stats ---
        const fetchDashboardData = async () => {
            try {
                const [doctorRes, patientRes, appointmentRes] = await Promise.all([
                    doctorService.getAll(),
                    patientService.getAll(),
                    appointmentService.getAll()
                ]);
                
                setStats({
                    doctors: doctorRes.data.length,
                    patients: patientRes.data.length,
                    appointments: appointmentRes.data.length 
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stats:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const StatCard = ({ title, count, icon, bgColor, textColor }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className={`p-4 rounded-xl ${bgColor} ${textColor}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-gray-500 text-sm font-semibold mb-1">{title}</h3>
                <p className="text-3xl font-bold text-gray-800">{count}</p>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <div className="mb-8">
                {/* 4. We inject the dynamic userName here! */}
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, {userName} 👋</h1>
                <p className="text-gray-500">Here is the latest update on your hospital data.</p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Total Doctors" 
                    count={loading ? "..." : stats.doctors} 
                    icon={<UserCircle size={32} />} 
                    bgColor="bg-brand-primary/10" 
                    textColor="text-brand-primary" 
                />
                <StatCard 
                    title="Total Patients" 
                    count={loading ? "..." : stats.patients} 
                    icon={<Users size={32} />} 
                    bgColor="bg-blue-50" 
                    textColor="text-blue-600" 
                />
                <StatCard 
                    title="Total Appointments" 
                    count={loading ? "..." : stats.appointments} 
                    icon={<Calendar size={32} />} 
                    bgColor="bg-purple-50" 
                    textColor="text-purple-600" 
                />
            </div>

            {/* 5. The New Quick Actions Grid! */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/appointments/new" className="flex flex-col items-center justify-center p-6 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors border border-orange-100 group">
                        <div className="bg-orange-500 text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md shadow-orange-200">
                            <Calendar size={24} />
                        </div>
                        <span className="font-semibold text-orange-900">Book Appointment</span>
                        <span className="text-sm text-orange-600 mt-1">Schedule a new visit</span>
                    </Link>

                    <Link to="/patients/new" className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors border border-purple-100 group">
                        <div className="bg-purple-600 text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md shadow-purple-200">
                            <Users size={24} />
                        </div>
                        <span className="font-semibold text-purple-900">Register Patient</span>
                        <span className="text-sm text-purple-600 mt-1">Add new patient records</span>
                    </Link>

                    <Link to="/doctors/new" className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors border border-blue-100 group">
                        <div className="bg-blue-600 text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md shadow-blue-200">
                            <UserCircle size={24} />
                        </div>
                        <span className="font-semibold text-blue-900">Add Doctor</span>
                        <span className="text-sm text-blue-600 mt-1">Onboard new medical staff</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}