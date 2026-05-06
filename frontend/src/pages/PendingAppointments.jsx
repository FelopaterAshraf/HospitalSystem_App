import { useEffect, useState } from 'react';
import appointmentService from '../services/appointmentService';
import { getErrorMessage } from '../services/errorHelper';
import { Clock, CheckCircle2, XCircle, CalendarCheck } from 'lucide-react';

export default function PendingAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [acting, setActing] = useState(null);

    useEffect(() => {
        if (!feedback.message) return;
        const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
        return () => clearTimeout(timer);
    }, [feedback.message]);

    const fetchPending = () => {
        setLoading(true);
        appointmentService.getPending()
            .then(res => { setAppointments(res.data); setLoading(false); })
            .catch(() => { setError('Failed to load pending appointments.'); setLoading(false); });
    };

    useEffect(() => { fetchPending(); }, []);

    const handleAction = async (id, action) => {
        setActing(id + action);
        setFeedback({ type: '', message: '' });
        try {
            if (action === 'approve') {
                await appointmentService.approve(id);
                setFeedback({ type: 'success', message: 'Appointment approved.' });
            } else {
                await appointmentService.reject(id);
                setFeedback({ type: 'success', message: 'Appointment rejected.' });
            }
            fetchPending();
        } catch (err) {
            setFeedback({ type: 'error', message: getErrorMessage(err, 'Action failed.') });
        } finally {
            setActing(null);
        }
    };

    if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading pending appointments...</div>;
    if (error)   return <div className="p-8 text-red-500 font-medium">{error}</div>;

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Pending Appointments</h1>
                <p className="text-gray-500">Review and approve or reject appointment requests assigned to you.</p>
            </div>

            {feedback.message && (
                <div className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {feedback.message}
                </div>
            )}

            {appointments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                    <CalendarCheck size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No pending appointments. You're all caught up!</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm tracking-wide">
                                <th className="px-6 py-4 font-medium">Patient</th>
                                <th className="px-6 py-4 font-medium">Date & Time</th>
                                <th className="px-6 py-4 font-medium">Reason</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {appointments.map(a => (
                                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-800">{a.patientName}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Clock size={15} className="text-brand-primary" />
                                            <span>{new Date(a.appointmentDate).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{a.reason || '—'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleAction(a.id, 'approve')}
                                                disabled={acting !== null}
                                                className="flex items-center gap-1.5 text-sm bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                                            >
                                                <CheckCircle2 size={15} />
                                                {acting === a.id + 'approve' ? 'Approving...' : 'Approve'}
                                            </button>
                                            <button
                                                onClick={() => handleAction(a.id, 'reject')}
                                                disabled={acting !== null}
                                                className="flex items-center gap-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                                            >
                                                <XCircle size={15} />
                                                {acting === a.id + 'reject' ? 'Rejecting...' : 'Reject'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
