import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import doctorService from '../services/doctorService';
import appointmentService from '../services/appointmentService';
import { ArrowLeft, Calendar } from 'lucide-react';

const SCHEDULE_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const STATUS_LABEL = { 0: 'Pending', 1: 'Approved' };
const STATUS_CLASS = {
    0: 'bg-yellow-100 text-yellow-700',
    1: 'bg-green-100 text-green-700',
};

function toISODate(d) {
    const y   = d.getFullYear();
    const m   = String(d.getMonth() + 1).padStart(2, '0');
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

export default function DoctorSchedule() {
    const { id } = useParams();
    const todayISO  = toISODate(new Date());
    const weekDays  = buildWeekDays();

    const [doctor, setDoctor]           = useState(null);
    const [selectedDate, setSelectedDate] = useState(todayISO);
    const [schedule, setSchedule]       = useState([]);
    const [loadingDoctor, setLoadingDoctor] = useState(true);
    const [loadingSchedule, setLoadingSchedule] = useState(false);

    // Load doctor info once
    useEffect(() => {
        doctorService.getById(id)
            .then(res => { setDoctor(res.data); setLoadingDoctor(false); })
            .catch(() => setLoadingDoctor(false));
    }, [id]);

    // Load schedule whenever date changes
    useEffect(() => {
        setLoadingSchedule(true);
        appointmentService.getAdminDoctorSchedule(id, selectedDate)
            .then(res => { setSchedule(res.data); setLoadingSchedule(false); })
            .catch(() => { setSchedule([]); setLoadingSchedule(false); });
    }, [id, selectedDate]);

    // Build hour → appointment map
    const scheduleMap = Object.fromEntries(
        schedule.map(a => [new Date(a.appointmentDate).getHours(), a])
    );

    const selectedDateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString([], {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    if (loadingDoctor) return <div className="p-8 text-gray-500 animate-pulse">Loading doctor information...</div>;

    return (
        <div className="animate-fade-in max-w-3xl mx-auto">
            {/* Back */}
            <div className="mb-6">
                <Link to="/doctors" className="text-gray-500 hover:text-brand-primary flex items-center gap-2 w-fit transition-colors">
                    <ArrowLeft size={20} /> Back to Doctor Directory
                </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-1">
                    {doctor ? `Dr. ${doctor.name}` : 'Doctor'} — Schedule
                </h1>
                {doctor && (
                    <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mt-1">
                        {doctor.specialty}
                    </span>
                )}
            </div>

            {/* Date selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-brand-primary" />
                    <span className="font-semibold text-gray-700">{selectedDateLabel}</span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                    {weekDays.map(day => {
                        const iso        = toISODate(day);
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
            {loadingSchedule ? (
                <div className="text-gray-600 text-sm animate-pulse py-4">Loading schedule...</div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
                    {SCHEDULE_HOURS.map((hour, idx) => {
                        const appt = scheduleMap[hour];
                        return (
                            <div key={hour} className="flex gap-4 min-h-[64px]">
                                {/* Time label */}
                                <div className="w-14 flex-shrink-0 text-right pt-3">
                                    <span className="text-xs font-semibold text-gray-600">{formatHourLabel(hour)}</span>
                                </div>

                                {/* Slot area */}
                                <div className={`flex-1 pt-2 pb-2 ${idx < SCHEDULE_HOURS.length - 1 ? 'border-t border-gray-100' : ''}`}>
                                    {appt ? (
                                        <div className="flex items-stretch gap-0 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                            <div className={`w-1 flex-shrink-0 ${appt.status === 0 ? 'bg-yellow-400' : 'bg-brand-primary'}`} />
                                            <div className="flex-1 bg-gray-50 px-4 py-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="font-semibold text-gray-800 text-sm">{appt.patientName}</p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_CLASS[appt.status]}`}>
                                                        {STATUS_LABEL[appt.status]}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {formatTime(appt.appointmentDate)} &middot; {appt.reason || 'No reason provided'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center h-full">
                                            <span className="text-xs text-gray-500 font-medium">Available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
