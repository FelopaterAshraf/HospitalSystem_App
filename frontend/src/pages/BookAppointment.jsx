import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import doctorService from '../services/doctorService';
import appointmentService from '../services/appointmentService';
import { getErrorMessage } from '../services/errorHelper';
import { ArrowLeft, CalendarPlus, CheckCircle2, AlertCircle } from 'lucide-react';

const SLOT_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

function formatHour(hour) {
    if (hour === 12) return '12:00 PM';
    return hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
}

function slotStyle(status, selected) {
    if (status === 'Pending')
        return 'bg-yellow-100 text-yellow-600 border border-yellow-300 cursor-not-allowed opacity-70';
    if (status === 'Approved')
        return 'bg-red-100 text-red-500 border border-red-200 cursor-not-allowed opacity-70';
    if (selected)
        return 'bg-brand-primary text-white border border-brand-primary shadow';
    return 'bg-white text-gray-700 border border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer';
}

export default function BookAppointment() {
    const linkedPatientId = localStorage.getItem('linkedPatientId');
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedHour, setSelectedHour] = useState(null);
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        doctorService.getAll().then(res => setDoctors(res.data)).catch(() => {});
    }, []);

    useEffect(() => {
        if (!doctorId || !date) { setSlots([]); setSelectedHour(null); return; }
        setLoadingSlots(true);
        setSelectedHour(null);
        appointmentService.getSlots(doctorId, date)
            .then(res => setSlots(res.data))
            .catch(() => setSlots([]))
            .finally(() => setLoadingSlots(false));
    }, [doctorId, date]);

    if (!linkedPatientId) {
        return (
            <div className="max-w-2xl mx-auto mt-10">
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
                    <AlertCircle size={36} className="text-yellow-500 mx-auto mb-3" />
                    <h2 className="text-lg font-bold text-yellow-800 mb-1">Account Not Linked</h2>
                    <p className="text-yellow-700 text-sm">Your account is not linked to a patient record. Please contact the administrator.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedHour === null) {
            setStatus({ type: 'error', message: 'Please select a time slot.' });
            return;
        }
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });
        try {
            await appointmentService.book({
                doctorId: parseInt(doctorId),
                date,
                hour: selectedHour,
                reason
            });
            setStatus({ type: 'success', message: 'Appointment request submitted! Status: Pending.' });
            setTimeout(() => navigate('/my-appointments'), 1500);
        } catch (err) {
            setStatus({ type: 'error', message: getErrorMessage(err, 'Booking failed.') });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-2xl mx-auto mt-10">
            <div className="mb-6">
                <Link to="/my-appointments" className="text-gray-500 hover:text-brand-primary flex items-center gap-2 w-fit transition-colors">
                    <ArrowLeft size={20} /> Back to My Appointments
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                    <div className="bg-orange-50 p-3 rounded-xl text-orange-500">
                        <CalendarPlus size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
                        <p className="text-gray-500 text-sm">Choose a doctor, date, and available time slot.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Doctor */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Doctor</label>
                        <select
                            value={doctorId}
                            onChange={e => setDoctorId(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white"
                        >
                            <option value="" disabled>-- Choose a Doctor --</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialty})</option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                        <input
                            type="date"
                            value={date}
                            min={today}
                            onChange={e => setDate(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        />
                    </div>

                    {/* Slot Grid */}
                    {doctorId && date && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Select Time Slot
                                {loadingSlots && <span className="ml-2 text-gray-400 font-normal text-xs">Loading...</span>}
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {SLOT_HOURS.map(hour => {
                                    const slot = slots.find(s => s.hour === hour);
                                    const slotStatus = slot ? slot.status : 'Available';
                                    const isDisabled = slotStatus !== 'Available';
                                    const isSelected = selectedHour === hour;
                                    return (
                                        <button
                                            key={hour}
                                            type="button"
                                            disabled={isDisabled}
                                            onClick={() => !isDisabled && setSelectedHour(hour)}
                                            className={`py-2.5 rounded-xl text-sm font-medium transition-all ${slotStyle(slotStatus, isSelected)}`}
                                            title={isDisabled ? slotStatus : 'Available'}
                                        >
                                            {formatHour(hour)}
                                            {isDisabled && (
                                                <div className="text-xs mt-0.5 opacity-80">{slotStatus}</div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="e.g. Annual Checkup, Stomach Pain"
                            maxLength="250"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        />
                    </div>

                    {status.message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-medium">{status.message}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || selectedHour === null}
                        className={`mt-2 py-3.5 rounded-xl font-bold text-white transition-all shadow-sm ${isSubmitting || selectedHour === null ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-dark'}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Request Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
