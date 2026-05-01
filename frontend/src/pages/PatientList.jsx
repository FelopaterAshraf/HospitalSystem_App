import { useEffect, useState } from 'react';
import patientService from '../services/patientService';
import { Link } from 'react-router-dom';
import { Plus, Trash2, User, Edit } from 'lucide-react';

export default function PatientList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Admin check is ready to go!
    const userRole = localStorage.getItem('userRole');
    const isAdmin = userRole === 'Admin';

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await patientService.getAll();
            setPatients(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch patients. Ensure you are logged in.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this patient record?")) return;

        try {
            await patientService.delete(id);
            setPatients(patients.filter(p => p.id !== id));
        } catch (err) {
            alert('Failed to delete patient. Admin rights required.');
        }
    };

    if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading patient records...</div>;
    if (error) return <div className="p-8 text-red-500 font-medium">{error}</div>;

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Patient Records</h1>
                    <p className="text-gray-500">Manage hospital admissions and diagnoses.</p>
                </div>
                
                {/* 1. HIDE THE REGISTER BUTTON */}
                {isAdmin && (
                    <Link to="/patients/new">
                        <button className="bg-brand-primary hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
                            <Plus size={20} />
                            Register Patient
                        </button>
                    </Link>
                )}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm tracking-wide">
                            <th className="px-6 py-4 font-medium">Patient Name</th>
                            <th className="px-6 py-4 font-medium">Current Diagnosis</th>
                            
                            {/* 2. HIDE THE ACTIONS HEADER */}
                            {isAdmin && (
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {patients.length === 0 ? (
                            <tr>
                                {/* Adjust colSpan so it doesn't look weird when Actions column is hidden */}
                                <td colSpan={isAdmin ? "3" : "2"} className="px-6 py-8 text-center text-gray-400">
                                    No patients found. Register one to get started!
                                </td>
                            </tr>
                        ) : (
                            patients.map(patient => (
                                <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-brand-light p-2 rounded-lg text-brand-primary">
                                                <User size={24} />
                                            </div>
                                            <span className="font-semibold text-gray-800">{patient.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm font-medium border border-purple-100">
                                            {patient.diagnosis}
                                        </span>
                                    </td>
                                    
                                    {/* 3. HIDE THE EDIT AND DELETE BUTTONS */}
                                    {isAdmin && (
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/patients/edit/${patient.id}`}>
                                                <button 
                                                    className="text-gray-400 hover:text-purple-500 hover:bg-purple-50 p-2 rounded-lg transition-colors mr-2"
                                                    title="Edit Patient"
                                                >
                                                    <Edit size={20} />
                                                </button>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(patient.id)}
                                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Delete Patient"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}