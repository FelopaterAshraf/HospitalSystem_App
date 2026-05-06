import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import doctorService from '../services/doctorService';
import patientService from '../services/patientService';
import appointmentService from '../services/appointmentService';
import { getErrorMessage } from '../services/errorHelper';
import { Users, UserCircle, Calendar, Clock, CheckCircle2, XCircle, CalendarCheck } from 'lucide-react';

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function StatCard({ title, count, icon, bgColor, textColor }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className={`p-4 rounded-xl ${bgColor} ${textColor}`}>{icon}</div>
            <div>
                <h3 className="text-gray-500 text-sm font-semibold mb-1">{title}</h3>
                <p className="text-3xl font-bold text-gray-800">{count}</p>
            </div>
        </div>
    );
}

function AdminDashboard({ userName }) {
    const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([doctorService.getAll(), patientService.getAll(), appointmentService.getAll()])
            .then(([d, p, a]) => {
                setStats({ doctors: d.data.length, patients: p.data.length, appointments: a.data.length });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, {userName} 👋</h1>
                <p className="text-gray-500">Here is the latest update on your hospital data.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Doctors"       count={loading ? '...' : stats.doctors}       icon={<UserCircle size={32} />} bgColor="bg-brand-primary/10" textColor="text-brand-primary" />
                <StatCard title="Total Patients"      count={loading ? '...' : stats.patients}      icon={<Users size={32} />}      bgColor="bg-blue-50"         textColor="text-blue-600" />
                <StatCard title="Total Appointments"  count={loading ? '...' : stats.appointments}  icon={<Calendar size={32} />}   bgColor="bg-purple-50"       textColor="text-purple-600" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/appointments/new" className="flex flex-col items-center justify-center p-6 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors border border-orange-100 group">
                        <div className="bg-orange-500 text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md shadow-orange-200"><Calendar size={24} /></div>
                        <span className="font-semibold text-orange-900">Book Appointment</span>
                        <span className="text-sm text-orange-600 mt-1">Schedule a new visit</span>
                    </Link>
                    <Link to="/patients/new" className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors border border-purple-100 group">
                        <div className="bg-purple-600 text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md shadow-purple-200"><Users size={24} /></div>
                        <span className="font-semibold text-purple-900">Register Patient</span>
                        <span className="text-sm text-purple-600 mt-1">Add new patient records</span>
                    </Link>
                    <Link to="/doctors/new" className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors border border-blue-100 group">
                        <div className="bg-blue-600 text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md shadow-blue-200"><UserCircle size={24} /></div>
                        <span className="font-semibold text-blue-900">Add Doctor</span>
                        <span className="text-sm text-blue-600 mt-1">Onboard new medical staff</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── Doctor Dashboard ─────────────────────────────────────────────────────────

const SCHEDULE_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

function toISODate(d) {
    const y  = d.getFullYear();
    const m  = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function formatHourLabel(h) {
    return `${String(h).padStart(2, '0')}:00`;
}

function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function buildWeekDays() {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });
}

function DoctorDashboard({ userName }) {
    const todayISO = toISODate(new Date());

    const [pending, setPending]         = useState([]);
    const [schedule, setSchedule]       = useState([]);
    const [selectedDate, setSelectedDate] = useState(todayISO);
    const [loadingP, setLoadingP]       = useState(true);
    const [loadingS, setLoadingS]       = useState(false);
    const [feedback, setFeedback]       = useState({ type: '', message: '' });
    const [acting, setActing]           = useState(null);

    const weekDays = buildWeekDays();

    useEffect(() => {
        if (!feedback.message) return;
        const t = setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
        return () => clearTimeout(t);
    }, [feedback.message]);

    const fetchPending = () => {
        setLoadingP(true);
        appointmentService.getPending()
            .then(r => { setPending(r.data); setLoadingP(false); })
            .catch(() => setLoadingP(false));
    };

    useEffect(() => { fetchPending(); }, []);

    useEffect(() => {
        setLoadingS(true);
        appointmentService.getDoctorSchedule(selectedDate)
            .then(r => { setSchedule(r.data); setLoadingS(false); })
            .catch(() => setLoadingS(false));
    }, [selectedDate]);

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
            // Refresh schedule if the approved/rejected appt is on the selected date
            appointmentService.getDoctorSchedule(selectedDate)
                .then(r => setSchedule(r.data)).catch(() => {});
        } catch (err) {
            setFeedback({ type: 'error', message: getErrorMessage(err, 'Action failed.') });
        } finally {
            setActing(null);
        }
    };

    // Build hour → appointment lookup for the timeline
    const scheduleMap = Object.fromEntries(
        schedule.map(a => [new Date(a.appointmentDate).getHours(), a])
    );

    const selectedDateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString([], {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="animate-fade-in space-y-10">

            {/* Welcome */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">Hello, Dr. {userName} 👋</h1>
                <p className="text-gray-500">{new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Feedback banner */}
            {feedback.message && (
                <div className={`px-5 py-3 rounded-xl text-sm font-medium ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {feedback.message}
                </div>
            )}

            {/* ── Pending Appointments ── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Pending Appointments</h2>
                    <Link to="/appointments/pending" className="text-sm text-brand-primary hover:underline font-medium">View all</Link>
                </div>

                {loadingP ? (
                    <div className="text-gray-400 text-sm animate-pulse py-4">Loading...</div>
                ) : pending.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                        <CalendarCheck size={36} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No pending requests. You're all caught up!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                                    <th className="px-6 py-3 font-medium">Patient</th>
                                    <th className="px-6 py-3 font-medium">Date & Time</th>
                                    <th className="px-6 py-3 font-medium">Reason</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pending.map(a => (
                                    <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-800">{a.patientName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Clock size={14} className="text-brand-primary" />
                                                <span className="text-sm">{new Date(a.appointmentDate).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{a.reason || '—'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(a.id, 'approve')}
                                                    disabled={acting !== null}
                                                    className="flex items-center gap-1.5 text-sm bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                                                >
                                                    <CheckCircle2 size={14} />
                                                    {acting === a.id + 'approve' ? 'Approving...' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => handleAction(a.id, 'reject')}
                                                    disabled={acting !== null}
                                                    className="flex items-center gap-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                                                >
                                                    <XCircle size={14} />
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

            {/* ── Schedule ── */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">My Schedule</h2>

                {/* Date selector strip */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Calendar size={18} className="text-brand-primary" />
                            <span className="font-semibold">{selectedDateLabel}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {weekDays.map(day => {
                            const iso = toISODate(day);
                            const isSelected = iso === selectedDate;
                            const isToday    = iso === todayISO;
                            return (
                                <button
                                    key={iso}
                                    onClick={() => setSelectedDate(iso)}
                                    className={`flex flex-col items-center px-4 py-3 rounded-2xl min-w-[58px] transition-all font-medium
                                        ${isSelected
                                            ? 'bg-brand-primary text-white shadow-md'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
                                >
                                    <span className="text-xs mb-1">
                                        {day.toLocaleDateString([], { weekday: 'short' })}
                                    </span>
                                    <span className="text-lg font-bold leading-none">{day.getDate()}</span>
                                    {isToday && !isSelected && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Timeline */}
                {loadingS ? (
                    <div className="text-gray-400 text-sm animate-pulse py-4">Loading schedule...</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
                        {SCHEDULE_HOURS.map((hour, idx) => {
                            const appt = scheduleMap[hour];
                            return (
                                <div key={hour} className="flex gap-4 min-h-[64px]">
                                    {/* Time label */}
                                    <div className="w-14 flex-shrink-0 text-right pt-3">
                                        <span className="text-xs font-semibold text-gray-400">{formatHourLabel(hour)}</span>
                                    </div>

                                    {/* Slot area */}
                                    <div className={`flex-1 pt-2 pb-2 ${idx < SCHEDULE_HOURS.length - 1 ? 'border-t border-gray-100' : ''}`}>
                                        {appt && (
                                            <div className="flex items-stretch gap-0 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                                <div className="w-1 bg-brand-primary flex-shrink-0" />
                                                <div className="flex-1 bg-brand-primary/5 px-4 py-3">
                                                    <p className="font-semibold text-gray-800 text-sm">{appt.patientName}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {formatTime(appt.appointmentDate)} &middot; {appt.reason || 'No reason provided'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Empty state overlay when no appointments at all */}
                        {schedule.length === 0 && (
                            <div className="text-center py-6 -mt-4">
                                <Calendar size={32} className="text-gray-200 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">No approved appointments on this day.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function Dashboard() {
    const userName = localStorage.getItem('userName') || '';
    const userRole = localStorage.getItem('userRole');

    if (userRole === 'Doctor') return <DoctorDashboard userName={userName} />;
    return <AdminDashboard userName={userName} />;
}
