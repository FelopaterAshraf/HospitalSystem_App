import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import doctorService      from '../services/doctorService';
import patientService     from '../services/patientService';
import appointmentService from '../services/appointmentService';
import { getErrorMessage } from '../services/errorHelper';
import {
    Users, UserCircle, Calendar, Clock,
    CheckCircle2, XCircle, CalendarCheck,
    ArrowUpRight, TrendingUp, ChevronLeft, ChevronRight,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────
const H_STYLE = { fontFamily: 'Syne, sans-serif' };

// ─────────────────────────────────────────────────────────────
// Admin Dashboard
// ─────────────────────────────────────────────────────────────
const STAT_CARDS = [
    {
        key: 'doctors',
        label: 'Total Doctors',
        Icon: UserCircle,
        gradient: 'linear-gradient(135deg, #0d7a62 0%, #0d7a62 100%)',
        shadow:   'rgba(16,137,112,0.32)',
        link:     '/doctors',
        linkText: 'View doctors' ,
    },
    {
        key: 'patients',
        label: 'Total Patients',
        Icon: Users,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        shadow:   'rgba(59,130,246,0.3)',
        link:     '/patients',
        linkText: 'View patients',
    },
    {
        key: 'appointments',
        label: 'Appointments',
        Icon: Calendar,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        shadow:   'rgba(139,92,246,0.3)',
        link:     '/appointments',
        linkText: 'View all',
    },
];

const QUICK_ACTIONS = [
    {
        to: '/appointments/new',
        label: 'Book Appointment',
        sub: 'Schedule a new visit',
        bg:  'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.18)',
        iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
        iconShadow: 'rgba(245,158,11,0.35)',
        Icon: Calendar,
    },
    {
        to: '/patients/new',
        label: 'Register Patient',
        sub: 'Add new patient record',
        bg:  'rgba(139,92,246,0.08)',
        border: 'rgba(139,92,246,0.18)',
        iconBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        iconShadow: 'rgba(139,92,246,0.35)',
        Icon: Users,
    },
    {
        to: '/doctors/new',
        label: 'Add Doctor',
        sub: 'Onboard medical staff',
        bg:  'rgba(59,130,246,0.08)',
        border: 'rgba(59,130,246,0.18)',
        iconBg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        iconShadow: 'rgba(59,130,246,0.35)',
        Icon: UserCircle,
    },
];

function AdminDashboard({ userName }) {
    const [stats,   setStats]   = useState({ doctors: 0, patients: 0, appointments: 0 });
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
            {/* Header */}
            <div className="mb-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: '#0d7a62', fontFamily: 'Syne, sans-serif' }}>
                    Admin Panel
                </p>
                <h1 className="text-[28px] font-bold mb-1" style={{ color: '#0e3d36', ...H_STYLE }}>
                    Hello, {userName} 👋
                </h1>
                <p className="text-[13.5px]" style={{ color: '#4a6e68' }}>
                    Here's your hospital at a glance.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 stagger">
                {STAT_CARDS.map(({ key, label, Icon, gradient, shadow, link, linkText }) => (
                    <div
                        key={key}
                        className="rounded-2xl p-5 flex items-center gap-5 overflow-hidden relative group"
                        style={{ background: 'white', border: '1px solid rgba(14,61,54,0.07)', boxShadow: '0 2px 12px rgba(14,61,54,0.05)' }}
                    >
                        {/* Icon */}
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: gradient, boxShadow: `0 6px 18px ${shadow}` }}
                        >
                            <Icon size={26} className="text-white" strokeWidth={1.8} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[42px] font-bold leading-none mb-1" style={{ color: '#0e3d36', fontFamily: 'Syne, sans-serif' }}>
                                {loading ? '—' : stats[key]}
                            </p>
                            <p className="text-[12px] font-semibold" style={{ color: '#4a6e68' }}>{label}</p>
                        </div>

                        {/* Link top-right */}
                        <Link
                            to={link}
                            // fix link contrast
                            className="absolute top-4 right-4 flex items-center gap-0.5 text-[11px] font-bold opacity-0 group-hover:opacity-60 transition-opacity"
                            style={{ color: '#042c82', fontFamily: 'Syne, sans-serif' }}
                        >
                            {linkText} <ArrowUpRight size={11} />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div
                className="rounded-2xl p-7"
                style={{ background: 'white', border: '1px solid rgba(14,61,54,0.07)', boxShadow: '0 2px 12px rgba(14,61,54,0.05)' }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[17px] font-bold" style={{ color: '#0e3d36', ...H_STYLE }}>
                        Quick Actions
                    </h3>
                    <TrendingUp size={16} style={{ color: '#4a6e68' }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {QUICK_ACTIONS.map(({ to, label, sub, bg, border, iconBg, iconShadow, Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className="flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-200 group text-center"
                            style={{ background: bg, border: `1px solid ${border}` }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                        >
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
                                style={{ background: iconBg, boxShadow: `0 6px 20px ${iconShadow}` }}
                            >
                                <Icon size={22} className="text-white" strokeWidth={2} />
                            </div>
                            <p className="font-bold text-[14px] text-gray-800 mb-0.5" style={H_STYLE}>{label}</p>
                            <p className="text-[12px] text-gray-500">{sub}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Doctor Dashboard helpers
// ─────────────────────────────────────────────────────────────
const SCHEDULE_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const toISODate = d => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const buildWeekDays = (offsetWeeks = 0) =>
    Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + offsetWeeks * 7 + i); return d; });

const formatHourLabel = h => `${String(h).padStart(2, '0')}:00`;
const formatTime      = ds => new Date(ds).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ─────────────────────────────────────────────────────────────
// Doctor Dashboard
// ─────────────────────────────────────────────────────────────
function DoctorDashboard({ userName }) {
    const todayISO = toISODate(new Date());

    const [weekOffset,    setWeekOffset]    = useState(0);
    const [pending,       setPending]       = useState([]);
    const [schedule,      setSchedule]      = useState([]);
    const [selectedDate,  setSelectedDate]  = useState(todayISO);

    const weekDays = buildWeekDays(weekOffset);

    const changeWeek = (delta) => {
        const newOffset = weekOffset + delta;
        setWeekOffset(newOffset);
        const anchor = new Date();
        anchor.setDate(anchor.getDate() + newOffset * 7);
        setSelectedDate(toISODate(anchor));
    };

    const handleDatePick = (isoDate) => {
        if (!isoDate) return;
        setSelectedDate(isoDate);
        const picked = new Date(isoDate + 'T00:00:00');
        const today  = new Date();
        today.setHours(0, 0, 0, 0);
        const diffDays = Math.round((picked - today) / (1000 * 60 * 60 * 24));
        setWeekOffset(Math.floor(diffDays / 7));
    };
    const [loadingP,      setLoadingP]      = useState(true);
    const [loadingS,      setLoadingS]      = useState(false);
    const [feedback,      setFeedback]      = useState({ type: '', message: '' });
    const [acting,        setActing]        = useState(null);

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
        try {
            if (action === 'approve') {
                await appointmentService.approve(id);
                setFeedback({ type: 'success', message: 'Appointment approved.' });
            } else {
                await appointmentService.reject(id);
                setFeedback({ type: 'success', message: 'Appointment rejected.' });
            }
            fetchPending();
            appointmentService.getDoctorSchedule(selectedDate).then(r => setSchedule(r.data)).catch(() => {});
        } catch (err) {
            setFeedback({ type: 'error', message: getErrorMessage(err, 'Action failed.') });
        } finally {
            setActing(null);
        }
    };

    const scheduleMap = Object.fromEntries(
        schedule.map(a => [new Date(a.appointmentDate).getHours(), a])
    );

    const selectedDateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString([], {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className="animate-fade-in space-y-8">

            {/* Header */}
            <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: '#0d7a62', fontFamily: 'Syne, sans-serif' }}>
                    Doctor Panel
                </p>
                <h1 className="text-[28px] font-bold mb-1" style={{ color: '#0e3d36', ...H_STYLE }}>
                    Hello, Dr. {userName} 👋
                </h1>
                <p className="text-[13px]" style={{ color: '#4a6e68' }}>
                    {new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Feedback */}
            {feedback.message && (
                <div
                    className="px-5 py-3 rounded-xl text-[13px] font-semibold flex items-center gap-2"
                    style={{
                        background: feedback.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                        color:      feedback.type === 'success' ? '#059669' : '#dc2626',
                        border:     `1px solid ${feedback.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    }}
                >
                    {feedback.type === 'success' ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                    {feedback.message}
                </div>
            )}

            {/* ── Pending Appointments ── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[18px] font-bold" style={{ color: '#0e3d36', ...H_STYLE }}>
                        Pending Requests
                    </h2>
                    <Link
                        to="/appointments/pending"
                        className="flex items-center gap-1 text-[12px] font-bold"
                        style={{ color: '#0d7a62', fontFamily: 'Syne, sans-serif' }}
                    >
                        View all <ArrowUpRight size={13} />
                    </Link>
                </div>

                {loadingP ? (
                    <div className="text-[13px] animate-pulse" style={{ color: '#4a6e68' }}>Loading…</div>
                ) : pending.length === 0 ? (
                    <div
                        className="rounded-2xl p-10 text-center"
                        style={{ background: 'white', border: '1px solid rgba(14,61,54,0.07)' }}
                    >
                        <CalendarCheck size={36} style={{ color: '#d4e9e0', margin: '0 auto 12px' }} />
                        <p className="font-semibold text-[14px]" style={{ color: '#4a6e68' }}>All caught up! No pending requests.</p>
                    </div>
                ) : (
                    <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(14,61,54,0.07)', boxShadow: '0 2px 12px rgba(14,61,54,0.05)' }}>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr style={{ background: 'rgba(238,244,241,0.7)', borderBottom: '1px solid rgba(14,61,54,0.07)' }}>
                                    {['Patient', 'Date & Time', 'Reason', 'Actions'].map(h => (
                                        <th key={h} className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: '#4a6e68', fontFamily: 'Syne, sans-serif' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pending.map((a, idx) => (
                                    <tr
                                        key={a.id}
                                        style={{ borderTop: idx > 0 ? '1px solid rgba(14,61,54,0.05)' : 'none' }}
                                        className="hover:bg-[#f8fcfa] transition-colors duration-100"
                                    >
                                        <td className="px-6 py-4 font-bold text-[13.5px]" style={{ color: '#1a2e2a' }}>{a.patientName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-[13px]" style={{ color: '#4b7065' }}>
                                                <Clock size={13} style={{ color: '#0d7a62', flexShrink: 0 }} />
                                                {new Date(a.appointmentDate).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[13px]" style={{ color: '#4a6e68' }}>{a.reason || '—'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleAction(a.id, 'approve')}
                                                    disabled={acting !== null}
                                                    className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-50"
                                                    style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.18)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
                                                >
                                                    <CheckCircle2 size={13} />
                                                    {acting === a.id + 'approve' ? 'Approving…' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => handleAction(a.id, 'reject')}
                                                    disabled={acting !== null}
                                                    className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-50"
                                                    style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                                                >
                                                    <XCircle size={13} />
                                                    {acting === a.id + 'reject' ? 'Rejecting…' : 'Reject'}
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
                <h2 className="text-[18px] font-bold mb-4" style={{ color: '#0e3d36', ...H_STYLE }}>
                    My Schedule
                </h2>

                {/* Date selector */}
                <div
                    className="rounded-2xl p-5 mb-4"
                    style={{ background: 'white', border: '1px solid rgba(14,61,54,0.07)', boxShadow: '0 2px 12px rgba(14,61,54,0.05)' }}
                >
                    {/* Week navigation row */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <button
                            type="button"
                            onClick={() => changeWeek(-1)}
                            aria-label="Previous week"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                            style={{ background: 'rgba(238,244,241,0.9)', color: '#3a574f', border: '1px solid rgba(14,61,54,0.1)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,236,229,1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(238,244,241,0.9)'}
                        >
                            <ChevronLeft size={14} aria-hidden="true" />
                            Prev
                        </button>

                        <button
                            type="button"
                            onClick={() => { setWeekOffset(0); setSelectedDate(todayISO); }}
                            disabled={weekOffset === 0}
                            aria-label="Go to current week"
                            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-default"
                            style={{
                                background: weekOffset === 0 ? 'rgba(13,122,98,0.12)' : 'rgba(238,244,241,0.9)',
                                color:      weekOffset === 0 ? '#0d7a62'              : '#3a574f',
                                border:     weekOffset === 0 ? '1px solid rgba(13,122,98,0.25)' : '1px solid rgba(14,61,54,0.1)',
                            }}
                        >
                            Today
                        </button>

                        <button
                            type="button"
                            onClick={() => changeWeek(1)}
                            aria-label="Next week"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                            style={{ background: 'rgba(238,244,241,0.9)', color: '#3a574f', border: '1px solid rgba(14,61,54,0.1)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,236,229,1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(238,244,241,0.9)'}
                        >
                            Next
                            <ChevronRight size={14} aria-hidden="true" />
                        </button>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => handleDatePick(e.target.value)}
                            aria-label="Jump to date"
                            className="ml-auto px-3 py-1.5 rounded-lg text-[12px] font-medium outline-none transition-all"
                            style={{
                                background: 'white',
                                border:     '1.5px solid rgba(14,61,54,0.15)',
                                color:      '#1a2e2a',
                                fontFamily: 'Syne, sans-serif',
                            }}
                            onFocus={e => { e.target.style.borderColor = '#0d7a62'; e.target.style.boxShadow = '0 0 0 3px rgba(13,122,98,0.1)'; }}
                            onBlur={e  => { e.target.style.borderColor = 'rgba(14,61,54,0.15)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    {/* Selected date label */}
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar size={15} style={{ color: '#0d7a62' }} aria-hidden="true" />
                        <span className="font-semibold text-[13.5px]" style={{ color: '#0e3d36', fontFamily: 'Syne, sans-serif' }}>
                            {selectedDateLabel}
                        </span>
                    </div>

                    {/* Day strip */}
                    <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Select a day">
                        {weekDays.map(day => {
                            const iso        = toISODate(day);
                            const isSelected = iso === selectedDate;
                            const isToday    = iso === todayISO;
                            return (
                                <button
                                    key={iso}
                                    type="button"
                                    onClick={() => setSelectedDate(iso)}
                                    aria-pressed={isSelected}
                                    aria-label={day.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    className="flex flex-col items-center px-4 py-3 rounded-2xl min-w-[58px] transition-all duration-150 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d7a62]"
                                    style={{
                                        background: isSelected ? 'linear-gradient(135deg, #0d7a62, #0b5c47)' : 'rgba(238,244,241,0.8)',
                                        color:      isSelected ? 'white' : '#3a574f',
                                        boxShadow:  isSelected ? '0 4px 12px rgba(16,137,112,0.3)' : 'none',
                                        transform:  isSelected ? 'scale(1.04)' : 'none',
                                    }}
                                >
                                    <span className="text-[10px] mb-1" style={{ color: isSelected ? 'rgba(255,255,255,0.85)' : '#3a574f', fontFamily: 'Syne, sans-serif' }}>
                                        {day.toLocaleDateString([], { weekday: 'short' })}
                                    </span>
                                    <span className="text-[18px] font-bold leading-none">{day.getDate()}</span>
                                    {isToday && !isSelected && (
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#0d7a62' }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Timeline */}
                {loadingS ? (
                    <div className="text-[13px] animate-pulse" style={{ color: '#4a6e68' }}>Loading schedule…</div>
                ) : (
                    <div
                        className="rounded-2xl px-6 py-4"
                        style={{ background: 'white', border: '1px solid rgba(14,61,54,0.07)', boxShadow: '0 2px 12px rgba(14,61,54,0.05)' }}
                    >
                        {schedule.length === 0 && (
                            <div className="text-center py-6 mb-2">
                                <Calendar size={30} style={{ color: '#d4e9e0', margin: '0 auto 8px' }} />
                                <p className="text-[13px]" style={{ color: '#4a6e68' }}>No approved appointments on this day.</p>
                            </div>
                        )}

                        {SCHEDULE_HOURS.map((hour, idx) => {
                            const appt = scheduleMap[hour];
                            return (
                                <div key={hour} className="flex gap-4 min-h-[60px]">
                                    <div className="w-12 flex-shrink-0 text-right pt-3">
                                        <span className="text-[11px] font-bold" style={{ color: '#4a6e68', fontFamily: 'Syne, sans-serif' }}>
                                            {formatHourLabel(hour)}
                                        </span>
                                    </div>
                                    <div
                                        className="flex-1 py-2"
                                        style={{ borderTop: idx > 0 ? '1px solid rgba(14,61,54,0.06)' : 'none' }}
                                    >
                                        {appt && (
                                            <div
                                                className="flex items-stretch rounded-xl overflow-hidden"
                                                style={{ border: '1px solid rgba(16,137,112,0.15)', boxShadow: '0 2px 8px rgba(16,137,112,0.08)' }}
                                            >
                                                <div className="w-1 flex-shrink-0" style={{ background: 'linear-gradient(180deg, #0d7a62, #0fc98a)' }} />
                                                <div className="flex-1 px-4 py-2.5" style={{ background: 'rgba(238,244,241,0.6)' }}>
                                                    <p className="font-bold text-[13px]" style={{ color: '#0e3d36' }}>{appt.patientName}</p>
                                                    <p className="text-[11.5px] mt-0.5" style={{ color: '#4a6e68' }}>
                                                        {formatTime(appt.appointmentDate)} &middot; {appt.reason || 'No reason provided'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
    const userName = localStorage.getItem('userName') || '';
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'Doctor') return <DoctorDashboard userName={userName} />;
    return <AdminDashboard userName={userName} />;
}
