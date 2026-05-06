import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import appointmentService from '../services/appointmentService';
import { CalendarPlus, Heart, Brain, Bone, Baby, ClipboardList, Clock, Calendar } from 'lucide-react';

const services = [
    { icon: Heart,  label: 'Cardiology',  desc: 'Heart & cardiovascular care' },
    { icon: Brain,  label: 'Neurology',   desc: 'Brain & nervous system' },
    { icon: Bone,   label: 'Orthopedics', desc: 'Bone, joint & muscle care' },
    { icon: Baby,   label: 'Pediatrics',  desc: 'Care for children & infants' },
];

const STATUS_LABEL = { 0: 'Pending', 1: 'Approved', 2: 'Rejected', 3: 'Cancelled' };
const STATUS_CLASS  = {
    0: 'bg-yellow-100 text-yellow-700',
    1: 'bg-green-100  text-green-700',
    2: 'bg-red-100    text-red-600',
    3: 'bg-gray-100   text-gray-500',
};

export default function PatientHome() {
    const userName = localStorage.getItem('userName') || 'Patient';
    const [allAppointments, setAllAppointments] = useState([]);
    const [loadingAppts, setLoadingAppts] = useState(true);

    useEffect(() => {
        appointmentService.getMine()
            .then(res => setAllAppointments(res.data))
            .catch(() => {})
            .finally(() => setLoadingAppts(false));
    }, []);

    const now = new Date();
    const activeUpcoming = allAppointments
        .filter(a => (a.status === 0 || a.status === 1) && new Date(a.appointmentDate) > now)
        .slice(0, 4);

    return (
        <div className="animate-fade-in space-y-10">

            {/* Welcome Banner */}
            <div className="bg-brand-dark rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <p className="text-brand-primary font-semibold text-sm mb-1 uppercase tracking-wider">Welcome back</p>
                    <h1 className="text-3xl font-bold text-white mb-2">{userName}</h1>
                    <p className="text-gray-300 text-sm max-w-md">
                        Book an appointment with one of our specialists and take control of your health today.
                    </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <Link to="/appointments/book">
                        <button className="bg-brand-primary hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-lg">
                            <CalendarPlus size={20} /> Book Appointment
                        </button>
                    </Link>
                    <Link to="/my-appointments">
                        <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors">
                            <ClipboardList size={20} /> My Appointments
                        </button>
                    </Link>
                </div>
            </div>

            {/* Our Services */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Our Services</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {services.map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
                            <div className="bg-brand-primary/10 p-3 rounded-xl">
                                <Icon size={28} className="text-brand-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* My Recent Appointments */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
                    <Link to="/my-appointments" className="text-sm text-brand-primary hover:underline font-medium">
                        View all
                    </Link>
                </div>

                {loadingAppts ? (
                    <div className="text-gray-400 text-sm animate-pulse py-4">Loading appointments...</div>
                ) : activeUpcoming.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium mb-4">No upcoming appointments.</p>
                        <Link to="/appointments/book">
                            <button className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-dark transition-colors">
                                Book an Appointment
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                                    <th className="px-6 py-3 font-medium">Doctor</th>
                                    <th className="px-6 py-3 font-medium">Date & Time</th>
                                    <th className="px-6 py-3 font-medium">Reason</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {activeUpcoming.map(a => (
                                    <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-800">Dr. {a.doctorName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Clock size={14} className="text-brand-primary" />
                                                <span className="text-sm">{new Date(a.appointmentDate).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{a.reason || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CLASS[a.status]}`}>
                                                {STATUS_LABEL[a.status] ?? 'Unknown'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}
