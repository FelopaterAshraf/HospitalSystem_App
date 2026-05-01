import { useState } from 'react';
import doctorService from '../services/doctorService';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddDoctor() {
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' }); // 'success' or 'error'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            await doctorService.create({ name, specialty });
            setStatus({ type: 'success', message: 'Doctor added successfully! Redirecting...' });
            setTimeout(() => navigate('/doctors'), 1500);
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to add doctor. Please check your data.' });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-2xl mx-auto mt-10">
            {/* Header / Back Button */}
            <div className="mb-6">
                <Link to="/doctors" className="text-gray-500 hover:text-brand-primary flex items-center gap-2 w-fit transition-colors">
                    <ArrowLeft size={20} />
                    Back to Directory
                </Link>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                    <div className="bg-brand-light p-3 rounded-xl text-brand-primary">
                        <UserPlus size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Register New Doctor</h2>
                        <p className="text-gray-500 text-sm">Add a new medical professional to the system.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor's Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="e.g. Dr. Sarah Jenkins"
                            required 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Specialty</label>
                        <input 
                            type="text" 
                            value={specialty} 
                            onChange={(e) => setSpecialty(e.target.value)} 
                            placeholder="e.g. Neurology, Pediatrics"
                            required 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        />
                    </div>

                    {/* Status Messages */}
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
                        {isSubmitting ? 'Saving Record...' : 'Submit Doctor Record'}
                    </button>
                </form>
            </div>
        </div>
    );
}