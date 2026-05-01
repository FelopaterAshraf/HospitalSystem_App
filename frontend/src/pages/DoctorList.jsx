import { useEffect, useState } from 'react';
import doctorService from '../services/doctorService';
import { Link } from 'react-router-dom';
import { Plus, Trash2, UserCircle, Edit } from 'lucide-react';

export default function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // You already did this perfectly!
    const userRole = localStorage.getItem('userRole');
    const isAdmin = userRole === 'Admin';
    
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await doctorService.getAll();
            setDoctors(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch doctors. Make sure you are logged in!');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;
        
        try {
            await doctorService.delete(id);
            setDoctors(doctors.filter(d => d.id !== id));
        } catch (err) {
            alert('Failed to delete. You might not have Admin privileges.');
        }
    };

    if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading doctors...</div>;
    if (error) return <div className="p-8 text-red-500 font-medium">{error}</div>;

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctor Directory</h1>
                    <p className="text-gray-500">Manage your hospital's medical staff.</p>
                </div>
                
                {/* 1. HIDE THE ADD BUTTON FROM NORMAL USERS */}
                {isAdmin && (
                    <Link to="/doctors/new">
                        <button className="bg-brand-primary hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
                            <Plus size={20} />
                            Add New Doctor
                        </button>
                    </Link>
                )}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm tracking-wide">
                            <th className="px-6 py-4 font-medium">Doctor Info</th>
                            <th className="px-6 py-4 font-medium">Specialty</th>
                            
                            {/* 2. HIDE THE ACTIONS HEADER */}
                            {isAdmin && (
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {doctors.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? "3" : "2"} className="px-6 py-8 text-center text-gray-400">
                                    No doctors found. Add one to get started!
                                </td>
                            </tr>
                        ) : (
                            doctors.map(doctor => (
                                <tr key={doctor.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-brand-light p-2 rounded-lg text-brand-primary">
                                                <UserCircle size={24} />
                                            </div>
                                            <span className="font-semibold text-gray-800">{doctor.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                            {doctor.specialty}
                                        </span>
                                    </td>
                                    
                                    {/* 3. HIDE THE EDIT AND DELETE BUTTONS */}
                                    {isAdmin && (
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/doctors/edit/${doctor.id}`}>
                                                <button 
                                                    className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors mr-2"
                                                    title="Edit Doctor"
                                                >
                                                    <Edit size={20} />
                                                </button>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(doctor.id)}
                                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Delete Doctor"
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