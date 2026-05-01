import { useEffect, useState } from 'react';
import appointmentService from '../services/appointmentService';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Calendar as CalendarIcon, Clock, Edit } from 'lucide-react';

export default function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userRole = localStorage.getItem('userRole');
    const isAdmin = userRole === 'Admin';

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await appointmentService.getAll();
            console.log("MY APPOINTMENT DATA:", response.data);
            setAppointments(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch appointments. Ensure you are logged in.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Cancel this appointment?")) return;

        try {
            await appointmentService.delete(id);
            setAppointments(appointments.filter(a => a.id !== id));
        } catch (err) {
            alert('Failed to cancel appointment.');
        }
    };

    if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading schedule...</div>;
    if (error) return <div className="p-8 text-red-500 font-medium">{error}</div>;

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointments</h1>
                    <p className="text-gray-500">Manage hospital scheduling and bookings.</p>
                </div>
                <Link to="/appointments/new">
                    <button className="bg-brand-primary hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
                        <Plus size={20} />
                        Book Appointment
                    </button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm tracking-wide">
                            <th className="px-6 py-4 font-medium">Date & Time</th>
                            <th className="px-6 py-4 font-medium">Patient Name</th>
                            <th className="px-6 py-4 font-medium">Doctor Name</th>
                            <th className="px-6 py-4 font-medium">Reason</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {appointments.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                    No appointments scheduled. Book one to get started!
                                </td>
                            </tr>
                        ) : (
                            appointments.map(apt => (
                                <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-50 p-2 rounded-lg text-orange-500">
                                                <Clock size={20} />
                                            </div>
                                            <span className="font-semibold text-gray-800">
                                                {new Date(apt.appointmentDate).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    {/* Notice how we use patientName and doctorName now! */}
                                    <td className="px-6 py-4 text-gray-600 font-medium">{apt.patientName}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">Dr. {apt.doctorName}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{apt.reason}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link to={`/appointments/edit/${apt.id}`}>
                                            <button 
                                                className="text-gray-400 hover:text-orange-500 hover:bg-orange-50 p-2 rounded-lg transition-colors mr-2"
                                                title="Edit Appointment"
                                            >
                                                <Edit size={20} />
                                            </button>
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(apt.id)}
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Cancel Appointment"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}   