import { useState, useEffect } from 'react';
import appointmentService from '../services/appointmentService';
import doctorService from '../services/doctorService';
import patientService from '../services/patientService';
import { useNavigate, Link } from 'react-router-dom';
import { getErrorMessage } from '../services/errorHelper';
import { ArrowLeft, CalendarPlus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddAppointment() {
    // Form State
    const [patientId, setPatientId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [reason, setReason] = useState('');
    
    // Dropdown Data State
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    
    // UI State
    const [status, setStatus] = useState({ type: '', message: '' }); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Fetch doctors and patients as soon as the page loads!
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [docRes, patRes] = await Promise.all([
                    doctorService.getAll(),
                    patientService.getAll()
                ]);
                setDoctors(docRes.data);
                setPatients(patRes.data);
            } catch (err) {
                setStatus({ type: 'error', message: getErrorMessage(err, 'Failed to book appointment.') });
                setIsSubmitting(false);
            }
        };
        fetchDropdownData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            await appointmentService.create({ 
                patientId: parseInt(patientId), 
                doctorId: parseInt(doctorId), 
                appointmentDate,
                reason
            });
            setStatus({ type: 'success', message: 'Appointment booked successfully!' });
            setTimeout(() => navigate('/appointments'), 1500);
        } catch (err) {
            setStatus({ type: 'error', message: 'Booking failed. Check your backend logic.' });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-2xl mx-auto mt-10">
            <div className="mb-6">
                <Link to="/appointments" className="text-gray-500 hover:text-brand-primary flex items-center gap-2 w-fit transition-colors">
                    <ArrowLeft size={20} />
                    Back to Schedule
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                    <div className="bg-orange-50 p-3 rounded-xl text-orange-500">
                        <CalendarPlus size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
                        <p className="text-gray-500 text-sm">Schedule a consultation between a doctor and patient.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Patient Dropdown */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Patient</label>
                        <select 
                            value={patientId} 
                            onChange={(e) => setPatientId(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white transition-all"
                        >
                            <option value="" disabled>-- Choose a Patient --</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Doctor Dropdown */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Doctor</label>
                        <select 
                            value={doctorId} 
                            onChange={(e) => setDoctorId(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white transition-all"
                        >
                            <option value="" disabled>-- Choose a Doctor --</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialty})</option>
                            ))}
                        </select>
                    </div>

                    {/* Date/Time Picker */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time</label>
                        <input 
                            type="datetime-local" 
                            value={appointmentDate} 
                            onChange={(e) => setAppointmentDate(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        />
                    </div>

                    {/* Reason Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit</label>
                        <input 
                            type="text" 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)} 
                            placeholder="e.g. Annual Checkup, Stomach Pain"
                            required 
                            maxLength="250"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        />
                    </div>

                    {status.message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-medium">{status.message}</span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`mt-4 py-3.5 rounded-xl font-bold text-white transition-all shadow-sm ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-dark'}`}
                    >
                        {isSubmitting ? 'Processing...' : 'Confirm Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
}