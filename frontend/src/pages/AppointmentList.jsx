import { useEffect, useState } from 'react';
import appointmentService from '../services/appointmentService';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calendar, Edit, Clock } from 'lucide-react';

export default function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const userRole = localStorage.getItem('userRole');
    const isAdmin = userRole === 'Admin';
    const isPatient = userRole === 'User' && !!localStorage.getItem('linkedPatientId');

    useEffect(() => {
        if (userRole === 'User') { navigate('/my-appointments', { replace: true }); return; }
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await appointmentService.getAll();
            setAppointments(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch appointments. Ensure you are logged in.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this appointment?")) return;

        try {
            await appointmentService.delete(id);
            setAppointments(appointments.filter(a => a.id !== id));
        } catch (err) {
            setError('Failed to delete appointment. Admin rights required.');
        }
    };

    if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading appointments...</div>;
    if (error) return <div className="p-8 text-red-500 font-medium">{error}</div>;

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointments</h1>
                    <p className="text-gray-500">Manage patient bookings and schedules.</p>
                </div>
                
                <div className="flex gap-3">
                    {isAdmin && (
                        <Link to="/appointments/new">
                            <button className="bg-[#0b5f59] hover:bg-[#084c47] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors inline-flex items-center gap-2 shadow-sm">
                                <Plus size={20} />
                                New Appointment
                            </button>
                        </Link>
                    )}
                    {isPatient && (
                        <Link to="/appointments/book">
                            <button className="bg-brand-primary hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
                                <Plus size={20} />
                                Book Appointment
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm tracking-wide">
                            <th className="px-6 py-4 font-medium">Patient</th>
                            <th className="px-6 py-4 font-medium">Doctor</th>
                            <th className="px-6 py-4 font-medium">Date & Time</th>
                            
                            {/* 2. HIDE THE ACTIONS HEADER */}
                            {isAdmin && (
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {appointments.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? "4" : "3"} className="px-6 py-8 text-center text-gray-600">
                                    No appointments found. Create one to get started!
                                </td>
                            </tr>
                        ) : (
                            appointments.map(appointment => (
                                <tr key={appointment.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
                                                <Calendar size={20} />
                                            </div>
                                            <span className="font-semibold text-gray-800">
                                                {appointment.patientName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">
                                        Dr. {appointment.doctorName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Clock size={16} className="text-brand-primary"/>
                                            <span>{new Date(appointment.appointmentDate).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    
                                    {/* 3. HIDE THE EDIT AND DELETE BUTTONS */}
                                    {isAdmin && (
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/appointments/edit/${appointment.id}`}
                                                aria-label={`Edit appointment for ${appointment.patientName}`}
                                            >
                                                <button
                                                    className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors mr-2"
                                                    tabIndex={-1}
                                                >
                                                    <Edit aria-hidden="true" size={20} />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(appointment.id)}
                                                aria-label={`Delete appointment for ${appointment.patientName}`}
                                                className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 aria-hidden="true" size={20} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}