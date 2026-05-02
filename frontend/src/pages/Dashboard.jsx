import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import doctorService from '../services/doctorService';
import patientService from '../services/patientService';
import appointmentService from '../services/appointmentService';
import { Users, UserCircle, Calendar, Activity } from 'lucide-react';

export default function Dashboard() {
    const [userName, setUserName] = useState('Admin'); 
    const userRole = localStorage.getItem('userRole');
    const isAdmin = userRole === 'Admin';
    
    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0 
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Since we are using the new LocalStorage method, let's grab the name 
        // straight from LocalStorage instead of decoding a token! Much cleaner.
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }

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

            {/* Quick Actions Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    
                    {/* 1. Book Appointment (VISIBLE TO ALL USERS) */}
                    <Link to="/appointments/new" className="flex flex-col items-center justify-center p-6 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors border border-orange-100 group">
                        <div className="bg-orange-500 text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md shadow-orange-200">
                            <Calendar size={24} />
                        </div>
                        <span className="font-semibold text-orange-900">Book Appointment</span>
                        <span className="text-sm text-orange-600 mt-1">Schedule a new visit</span>
                    </Link>

                    {/* 2. Register Patient (ADMIN ONLY) */}
                    {isAdmin && (
                        <Link to="/patients/new" className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors border border-purple-100 group">
                            <div className="bg-purple-600 text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md shadow-purple-200">
                                <Users size={24} />
                            </div>
                            <span className="font-semibold text-purple-900">Register Patient</span>
                            <span className="text-sm text-purple-600 mt-1">Add new patient records</span>
                        </Link>
                    )}

                    {/* 3. Add Doctor (ADMIN ONLY) */}
                    {isAdmin && (
                        <Link to="/doctors/new" className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors border border-blue-100 group">
                            <div className="bg-blue-600 text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md shadow-blue-200">
                                <UserCircle size={24} />
                            </div>
                            <span className="font-semibold text-blue-900">Add Doctor</span>
                            <span className="text-sm text-blue-600 mt-1">Onboard new medical staff</span>
                        </Link>
                    )}

                </div>
            </div>
        </div>
    );
}