import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import appointmentService from '../services/appointmentService';
import { getErrorMessage } from '../services/errorHelper';
import { CalendarPlus, Clock, Calendar, XCircle, History } from 'lucide-react';

const STATUS_LABEL = { 0: 'Pending', 1: 'Approved', 2: 'Rejected', 3: 'Cancelled' };
const STATUS_CLASS = {
    0: 'bg-yellow-100 text-yellow-700',
    1: 'bg-green-100 text-green-700',
    2: 'bg-red-100 text-red-600',
    3: 'bg-gray-100 text-gray-500',
};

function AppointmentRow({ a, onCancel, cancelling, showCancel }) {
    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4 font-semibold text-gray-800">Dr. {a.doctorName}</td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-600">
                    <Clock size={15} className="text-brand-primary" />
                    <span>{new Date(a.appointmentDate).toLocaleString()}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-gray-500">{a.reason || '—'}</td>
            <td className="px-6 py-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CLASS[a.status]}`}>
                    {STATUS_LABEL[a.status] ?? 'Unknown'}
                </span>
            </td>
            <td className="px-6 py-4">
                {showCancel && (
                    <button
                        onClick={() => onCancel(a.id)}
                        disabled={cancelling === a.id}
                        className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <XCircle size={15} />
                        {cancelling === a.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                )}
            </td>
        </tr>
    );
}

function AppointmentTable({ rows, onCancel, cancelling, isFuture }) {
    if (rows.length === 0) return null;
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm tracking-wide">
                        <th className="px-6 py-4 font-medium">Doctor</th>
                        <th className="px-6 py-4 font-medium">Date & Time</th>
                        <th className="px-6 py-4 font-medium">Reason</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {rows.map(a => (
                        <AppointmentRow
                            key={a.id}
                            a={a}
                            onCancel={onCancel}
                            cancelling={cancelling}
                            showCancel={isFuture && a.status === 0}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [cancelling, setCancelling] = useState(null);

    useEffect(() => {
        if (!feedback.message) return;
        const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
        return () => clearTimeout(timer);
    }, [feedback.message]);

    const fetchAppointments = () => {
        setLoading(true);
        appointmentService.getMine()
            .then(res => { setAppointments(res.data); setLoading(false); })
            .catch(() => { setError('Failed to load your appointments.'); setLoading(false); });
    };

    useEffect(() => { fetchAppointments(); }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this appointment?')) return;
        setCancelling(id);
        setFeedback({ type: '', message: '' });
        try {
            await appointmentService.cancel(id);
            setFeedback({ type: 'success', message: 'Appointment cancelled successfully.' });
            fetchAppointments();
        } catch (err) {
            setFeedback({ type: 'error', message: getErrorMessage(err, 'Failed to cancel appointment.') });
        } finally {
            setCancelling(null);
        }
    };

    if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading your appointments...</div>;
    if (error)   return <div className="p-8 text-red-500 font-medium">{error}</div>;

    const now = new Date();
    const upcoming = appointments.filter(
        a => (a.status === 0 || a.status === 1) && new Date(a.appointmentDate) > now
    );
    const history = appointments.filter(
        a => !((a.status === 0 || a.status === 1) && new Date(a.appointmentDate) > now)
    );

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
                    <p className="text-gray-500">Your upcoming and past appointment requests.</p>
                </div>
                <Link to="/appointments/book">
                    <button className="bg-brand-primary hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
                        <CalendarPlus size={20} /> Book New
                    </button>
                </Link>
            </div>

            {feedback.message && (
                <div className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {feedback.message}
                </div>
            )}

            {/* Upcoming / Active */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Upcoming & Active</h2>
                {upcoming.length === 0 ? (
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
                    <AppointmentTable
                        rows={upcoming}
                        onCancel={handleCancel}
                        cancelling={cancelling}
                        isFuture={true}
                    />
                )}
            </div>

            {/* History */}
            {history.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <History size={18} className="text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-800">Appointment History</h2>
                    </div>
                    <AppointmentTable
                        rows={history}
                        onCancel={handleCancel}
                        cancelling={cancelling}
                        isFuture={false}
                    />
                </div>
            )}
        </div>
    );
}
