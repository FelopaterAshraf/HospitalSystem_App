import { useState, useEffect } from 'react';
import doctorService from '../services/doctorService';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserCog, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EditDoctor() {
    const { id } = useParams(); // Grabs the ID from the URL (e.g., /doctors/edit/5)
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    
    const [status, setStatus] = useState({ type: '', message: '' }); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the specific doctor's data when the page loads
    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await doctorService.getById(id);
                setName(response.data.name);
                setSpecialty(response.data.specialty);
                setIsLoading(false);
            } catch (error) {
                setStatus({ type: 'error', message: 'Failed to load doctor data. They may have been deleted.' });
                setIsLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            await doctorService.update(id, { id, name, specialty });
            setStatus({ type: 'success', message: 'Doctor updated successfully! Redirecting...' });
            setTimeout(() => navigate('/doctors'), 1500);
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to update doctor. Check your backend.' });
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading doctor data...</div>;

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
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                        <UserCog size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Edit Doctor Profile</h2>
                        <p className="text-gray-500 text-sm">Update information for Doctor ID: {id}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor's Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
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
                            required 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        />
                    </div>

                    {status.message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-medium">{status.message}</span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`mt-4 py-3.5 rounded-xl font-bold text-white transition-all shadow-sm ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSubmitting ? 'Saving Changes...' : 'Save Updates'}
                    </button>
                </form>
            </div>
        </div>
    );
}