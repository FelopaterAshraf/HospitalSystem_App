import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { getErrorMessage } from '../services/errorHelper';
import { Activity, Mail, Lock, UserPlus, LogIn, ChevronRight } from 'lucide-react';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
    const [loading, setLoading] = useState(false); // t prevents multiple submissions.
    const [error, setError] = useState('');
    const navigate = useNavigate();


    // This function runs when the user changes any input field. It updates the formData state with the new value.
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Stops the browser from executing its default behavior of refreshing the entire page upon form submission.
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                const res = await authService.login({ email: formData.email, password: formData.password }); //sends the email and password to the backend.
                
                localStorage.setItem('userName', res.data.fullName);
                localStorage.setItem('userRole', res.data.role);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('linkedDoctorId', res.data.linkedDoctorId ?? '');
                localStorage.setItem('linkedPatientId', res.data.linkedPatientId ?? '');

                navigate(res.data.role === 'User' ? '/home' : '/dashboard');
            } else {
                await authService.register(formData);
                const res = await authService.login({ email: formData.email, password: formData.password });

                localStorage.setItem('userName', res.data.fullName);
                localStorage.setItem('userRole', res.data.role);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('linkedDoctorId', res.data.linkedDoctorId ?? '');
                localStorage.setItem('linkedPatientId', res.data.linkedPatientId ?? '');

                navigate(res.data.role === 'User' ? '/home' : '/dashboard');
            }
        } catch (err) {
            const cleanMessage = getErrorMessage(err, "Registration failed. Please check your details and try again.");
            setError(cleanMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                
                {/* Brand Header */}
                <div className="bg-brand-dark p-10 text-center">
                    <div className="inline-flex p-4 bg-brand-primary rounded-2xl mb-4 shadow-lg shadow-brand-primary/20">
                        <Activity size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Medcare Hospital</h1>
                    <p className="text-brand-primary/80 text-sm mt-1 font-medium">Healthcare Management System</p>
                </div>

                {/* Form Section */}
                <div className="p-10">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <UserPlus className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                <input 
                                    name="fullName"
                                    type="text" 
                                    placeholder="Full Name" 
                                    value={formData.fullName} 
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input 
                                name="email"
                                type="email" 
                                placeholder="Email Address" 
                                value={formData.email}  
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input 
                                name="password"
                                type="password" 
                                placeholder="Password"  
                                value={formData.password} 
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-primary/25 transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? "Processing..." : (isLogin ? "Sign In" : "Register")}
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Toggle Button */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="ml-2 text-brand-primary font-bold hover:underline"
                            >
                                {isLogin ? "Register Now" : "Login here"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}