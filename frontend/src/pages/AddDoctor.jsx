import { useState } from 'react';
import doctorService from '../services/doctorService';
import { useNavigate, Link } from 'react-router-dom';
import { getErrorMessage } from '../services/errorHelper';
import { ArrowLeft, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

const SPECIALTIES = [
    'Cardiology',
    'Dentistry',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Surgery',
    'General Medicine',
    'Other',
];

export default function AddDoctor() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [customSpecialty, setCustomSpecialty] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const specialty = selectedSpecialty === 'Other' ? customSpecialty.trim() : selectedSpecialty;
        if (!specialty) {
            setStatus({ type: 'error', message: 'Please enter a specialty.' });
            return;
        }
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });
        try {
            await doctorService.createWithAccount({ ...form, specialty });
            setStatus({ type: 'success', message: 'Doctor account created successfully! Redirecting...' });
            setTimeout(() => navigate('/doctors'), 1500);
        } catch (err) {
            setStatus({ type: 'error', message: getErrorMessage(err, 'Failed to create doctor account.') });
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all";

    return (
        <div className="animate-fade-in max-w-2xl mx-auto mt-10">
            <div className="mb-6">
                <Link to="/doctors" className="text-gray-500 hover:text-brand-primary flex items-center gap-2 w-fit transition-colors">
                    <ArrowLeft size={20} />
                    Back to Directory
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                    <div className="bg-brand-light p-3 rounded-xl text-brand-primary">
                        <UserPlus size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Create Doctor Account</h2>
                        <p className="text-gray-500 text-sm">Creates a doctor profile and login account in one step.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor's Full Name</label>
                        <input
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Dr. Sarah Jenkins"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Specialty</label>
                        <select
                            value={selectedSpecialty}
                            onChange={e => { setSelectedSpecialty(e.target.value); setCustomSpecialty(''); }}
                            required
                            className={inputClass + ' bg-white'}
                        >
                            <option value="" disabled>-- Select a Specialty --</option>
                            {SPECIALTIES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {selectedSpecialty === 'Other' && (
                            <input
                                type="text"
                                value={customSpecialty}
                                onChange={e => setCustomSpecialty(e.target.value)}
                                placeholder="Enter custom specialty"
                                required
                                className={inputClass + ' mt-3'}
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Login Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="doctor@hospital.com"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Temporary Password</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 characters"
                            required
                            minLength={6}
                            className={inputClass}
                        />
                    </div>

                    {status.message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-red-50 text-red-600'}`}>
                            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-medium">{status.message}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`mt-4 py-3.5 rounded-xl font-bold text-white transition-all shadow-sm ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-dark'}`}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Doctor Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
