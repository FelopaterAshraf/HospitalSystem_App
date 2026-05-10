import { useState, useEffect, useRef } from 'react';
import appointmentService from '../services/appointmentService';
import doctorService from '../services/doctorService';
import patientService from '../services/patientService';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getErrorMessage } from '../services/errorHelper';
import { ArrowLeft, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

const SLOT_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const SPECIALTY_CHIPS = {
    Dentistry:     ['Dental Pain', 'Toothache', 'Cavity Check', 'Gum Bleeding', 'Dental Cleaning', 'Tooth Extraction', 'Orthodontic Visit', 'Wisdom Tooth'],
    Cardiology:    ['Chest Pain', 'Blood Pressure Check', 'Heart Palpitations', 'Shortness of Breath', 'Dizziness', 'Irregular Heartbeat', 'Post-cardiac Follow-up', 'Echocardiogram'],
    Dermatology:   ['Skin Rash', 'Acne', 'Eczema', 'Mole Check', 'Hair Loss', 'Skin Allergy', 'Psoriasis', 'Wound Check'],
    Neurology:     ['Headache', 'Migraine', 'Dizziness', 'Numbness', 'Memory Issues', 'Seizure Follow-up', 'Nerve Pain', 'Tremor'],
    Orthopedics:   ['Back Pain', 'Joint Pain', 'Fracture Follow-up', 'Knee Pain', 'Shoulder Pain', 'Post-surgery Follow-up', 'Sports Injury', 'Arthritis'],
    Pediatrics:    ['Vaccination', 'Growth Check', 'Fever', 'Cough', 'Ear Infection', 'Rash', 'General Checkup', 'Flu Symptoms'],
    Endocrinology: ['Diabetes Check', 'Blood Sugar Test', 'Thyroid Check', 'Weight Issues', 'Hormonal Imbalance', 'Lab Test Review', 'Medication Review', 'Follow-up'],
    Ophthalmology: ['Eye Exam', 'Vision Check', 'Eye Irritation', 'Blurry Vision', 'Eye Infection', 'Glasses Prescription', 'Dry Eyes', 'Follow-up'],
    Psychiatry:    ['Anxiety', 'Depression', 'Sleep Issues', 'Stress', 'Medication Review', 'Follow-up', 'Panic Attacks', 'Mood Changes'],
    default:       ['General Checkup', 'Follow-up', 'Consultation', 'Emergency', 'Prescription Renewal', 'Stomach Pain', 'Headache', 'Fever'],
};

function getChipsForSpecialty(specialty) {
    if (!specialty) return SPECIALTY_CHIPS.default;
    const s = specialty.toLowerCase();
    if (s.includes('dent'))                          return SPECIALTY_CHIPS.Dentistry;
    if (s.includes('cardio') || s.includes('heart')) return SPECIALTY_CHIPS.Cardiology;
    if (s.includes('derm')   || s.includes('skin'))  return SPECIALTY_CHIPS.Dermatology;
    if (s.includes('neuro'))                         return SPECIALTY_CHIPS.Neurology;
    if (s.includes('ortho')  || s.includes('bone'))  return SPECIALTY_CHIPS.Orthopedics;
    if (s.includes('pedia')  || s.includes('child')) return SPECIALTY_CHIPS.Pediatrics;
    if (s.includes('endo')   || s.includes('diabet'))return SPECIALTY_CHIPS.Endocrinology;
    if (s.includes('ophthal')|| s.includes('eye'))   return SPECIALTY_CHIPS.Ophthalmology;
    if (s.includes('psych')  || s.includes('mental'))return SPECIALTY_CHIPS.Psychiatry;
    return SPECIALTY_CHIPS.default;
}
const STATUS_OPTIONS = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Approved' },
    { value: 2, label: 'Rejected' },
    { value: 3, label: 'Cancelled' },
];

function formatHour(hour) {
    if (hour === 12) return '12:00 PM';
    return hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
}

function slotStyle(slotStatus, selected) {
    if (slotStatus === 'Pending')
        return 'bg-yellow-100 text-yellow-600 border border-yellow-300 cursor-not-allowed opacity-70';
    if (slotStatus === 'Approved')
        return 'bg-red-100 text-red-500 border border-red-200 cursor-not-allowed opacity-70';
    if (selected)
        return 'bg-brand-primary text-white border border-brand-primary shadow';
    return 'bg-white text-gray-700 border border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer';
}

function toLocalDateString(dt) {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export default function EditAppointment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [patientId, setPatientId]           = useState('');
    const [doctorId, setDoctorId]             = useState('');
    const [date, setDate]                     = useState('');
    const [slots, setSlots]                   = useState([]);
    const [selectedHour, setSelectedHour]     = useState(null);
    const [reason, setReason]                 = useState('');
    const [apptStatus, setApptStatus]         = useState(1);
    const [patients, setPatients]             = useState([]);
    const [doctors, setDoctors]               = useState([]);
    const [uiStatus, setUiStatus]             = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting]     = useState(false);
    const [isLoading, setIsLoading]           = useState(true);
    const [loadingSlots, setLoadingSlots]     = useState(false);

    // Holds the hour from the loaded appointment so the first slot fetch can restore it
    const initialHourRef = useRef(null);

    // ── Initial data load ──────────────────────────────────────────────────
    useEffect(() => {
        Promise.all([
            appointmentService.getById(id),
            doctorService.getAll(),
            patientService.getAll(),
        ]).then(([aptRes, docRes, patRes]) => {
            setDoctors(docRes.data);
            setPatients(patRes.data);

            const apt = aptRes.data;
            const dt  = new Date(apt.appointmentDate);

            // Store the original hour so the slot useEffect can restore it
            initialHourRef.current = dt.getHours();

            setPatientId(String(apt.patientId));
            setDoctorId(String(apt.doctorId));
            setDate(toLocalDateString(dt));
            setReason(apt.reason || '');
            setApptStatus(apt.status ?? 1);
            setIsLoading(false);
        }).catch(() => {
            setUiStatus({ type: 'error', message: 'Failed to load appointment data.' });
            setIsLoading(false);
        });
    }, [id]);

    // ── Slot fetch — fires whenever doctor or date changes ─────────────────
    useEffect(() => {
        if (!doctorId || !date) { setSlots([]); setSelectedHour(null); return; }
        setLoadingSlots(true);
        appointmentService.getSlots(doctorId, date, parseInt(id))
            .then(res => {
                setSlots(res.data);
                // First load: restore the original hour; subsequent changes: clear selection
                if (initialHourRef.current !== null) {
                    setSelectedHour(initialHourRef.current);
                    initialHourRef.current = null;
                } else {
                    setSelectedHour(null);
                }
            })
            .catch(() => { setSlots([]); setSelectedHour(null); })
            .finally(() => setLoadingSlots(false));
    }, [doctorId, date]);

    // ── Submit ─────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedHour === null) {
            setUiStatus({ type: 'error', message: 'Please select a time slot.' });
            return;
        }
        setIsSubmitting(true);
        setUiStatus({ type: '', message: '' });
        try {
            const appointmentDate = `${date}T${String(selectedHour).padStart(2, '0')}:00:00`;
            await appointmentService.update(id, {
                id:          parseInt(id),
                patientId:   parseInt(patientId),
                doctorId:    parseInt(doctorId),
                appointmentDate,
                reason,
                status:      apptStatus,
            });
            setUiStatus({ type: 'success', message: 'Appointment updated successfully!' });
            setTimeout(() => navigate('/appointments'), 1500);
        } catch (err) {
            setUiStatus({ type: 'error', message: getErrorMessage(err, 'Failed to update appointment.') });
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading appointment data...</div>;

    const selectClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white";
    const today = toLocalDateString(new Date());
    const activeChips = getChipsForSpecialty(doctors.find(d => String(d.id) === doctorId)?.specialty);

    return (
        <div className="animate-fade-in max-w-2xl mx-auto mt-10">
            <div className="mb-6">
                <Link to="/appointments" className="text-gray-500 hover:text-brand-primary flex items-center gap-2 w-fit transition-colors">
                    <ArrowLeft aria-hidden="true" size={20} /> Back to Schedule
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                    <div className="bg-orange-50 p-3 rounded-xl text-orange-500" aria-hidden="true">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Edit Appointment</h2>
                        <p className="text-gray-500 text-sm">Reschedule or update details for appointment #{id}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Patient */}
                    <div>
                        <label htmlFor="ea-patient" className="block text-sm font-semibold text-gray-700 mb-2">Select Patient</label>
                        <select id="ea-patient" value={patientId} onChange={e => setPatientId(e.target.value)} required className={selectClass}>
                            <option value="" disabled>-- Choose a Patient --</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Doctor */}
                    <div>
                        <label htmlFor="ea-doctor" className="block text-sm font-semibold text-gray-700 mb-2">Select Doctor</label>
                        <select id="ea-doctor" value={doctorId} onChange={e => setDoctorId(e.target.value)} required className={selectClass}>
                            <option value="" disabled>-- Choose a Doctor --</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialty})</option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="ea-date" className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                        <input
                            id="ea-date"
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
                        <fieldset>
                            <legend className="block text-sm font-semibold text-gray-700 mb-3">
                                Select Time Slot
                                <span aria-live="polite" aria-atomic="true" className="ml-2 text-gray-400 font-normal text-xs">
                                    {loadingSlots ? 'Loading...' : ''}
                                </span>
                            </legend>
                            <div className="grid grid-cols-5 gap-2">
                                {SLOT_HOURS.map(hour => {
                                    const slot       = slots.find(s => s.hour === hour);
                                    const slotStatus = slot ? slot.status : 'Available';
                                    const isDisabled = slotStatus !== 'Available';
                                    const isSelected = selectedHour === hour;
                                    return (
                                        <button
                                            key={hour}
                                            type="button"
                                            disabled={isDisabled}
                                            aria-pressed={isSelected}
                                            aria-label={`${formatHour(hour)} — ${slotStatus}`}
                                            onClick={() => !isDisabled && setSelectedHour(hour)}
                                            className={`py-2.5 rounded-xl text-sm font-medium transition-all ${slotStyle(slotStatus, isSelected)}`}
                                        >
                                            {formatHour(hour)}
                                            {isDisabled && (
                                                <div aria-hidden="true" className="text-xs mt-0.5 opacity-80">{slotStatus}</div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </fieldset>
                    )}

                    {/* Reason */}
                    <div>
                        <label htmlFor="ea-reason" className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                        {activeChips.map(chip => (
                            <button
                            key={chip}
                            type="button"
                            onClick={() => setReason(chip)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                                reason === chip
                                ? 'bg-[#0b5f59] text-white border-[#0b5f59]'
                                : 'bg-gray-100 text-gray-800 border-gray-400 hover:border-[#0b5f59] hover:text-[#0b5f59] hover:bg-emerald-50'
                            }`}
                            >
                            {chip}
                            </button>
                        ))}
                        </div>
                        <input
                            id="ea-reason"
                            type="text"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="e.g. Annual Checkup, Stomach Pain"
                            required
                            maxLength="250"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="ea-status" className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <select id="ea-status" value={apptStatus} onChange={e => setApptStatus(parseInt(e.target.value))} className={selectClass}>
                            {STATUS_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {uiStatus.message && (
                        <div role="alert" aria-live="assertive" className={`p-4 rounded-xl flex items-center gap-3 ${uiStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                            {uiStatus.type === 'success' ? <CheckCircle2 aria-hidden="true" size={20} /> : <AlertCircle aria-hidden="true" size={20} />}
                            <span className="font-medium">{uiStatus.message}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || selectedHour === null}
                        aria-busy={isSubmitting}
                        className={`mt-2 py-3.5 rounded-xl font-bold text-white transition-all shadow-sm ${isSubmitting || selectedHour === null ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-dark'}`}
                    >
                        {isSubmitting ? 'Saving Changes...' : 'Update Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
