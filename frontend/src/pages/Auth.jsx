import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { getErrorMessage } from '../services/errorHelper';
import { Activity, Mail, Lock, UserPlus, ChevronRight, AlertCircle, ShieldCheck, Calendar, Users } from 'lucide-react';

const FEATURES = [
    { Icon: ShieldCheck, text: 'Secure JWT authentication' },
    { Icon: Calendar,    text: 'Real-time appointment scheduling' },
    { Icon: Users,       text: 'Multi-role access: Admin, Doctor, Patient' },
];

/* ── Defined OUTSIDE Auth — prevents remounting on every keystroke ── */
function Field({ name, type = 'text', placeholder, IconEl, required = true, minLength, value, onChange }) {
    const label = name === 'fullName' ? 'Full Name'
                : name === 'email'    ? 'Email Address'
                : 'Password';

    return (
        <div>
            <label
                htmlFor={name}
                className="block text-[12px] font-bold uppercase tracking-[0.1em] mb-1.5"
                style={{ color: '#4a6e68', fontFamily: 'Syne, sans-serif' }}
            >
                {label}
            </label>
            <div className="relative">
                <IconEl
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    size={15}
                    style={{ color: '#a8c4bc' }}
                />
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    minLength={minLength}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-[14px] outline-none transition-all duration-150"
                    style={{
                        background: 'white',
                        border:     '1.5px solid #e2ede9',
                        fontFamily: 'Nunito Sans, sans-serif',
                        color:      '#1a2e2a',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#108970'; e.target.style.boxShadow = '0 0 0 3px rgba(16,137,112,0.1)'; }}
                    onBlur={e  => { e.target.style.borderColor = '#e2ede9'; e.target.style.boxShadow = 'none'; }}
                />
            </div>
        </div>
    );
}

export default function Auth() {
    const [isLogin,  setIsLogin]  = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState('');
    const navigate = useNavigate();

    const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                const res = await authService.login({ email: formData.email, password: formData.password });
                localStorage.setItem('userName',        res.data.fullName);
                localStorage.setItem('userRole',        res.data.role);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('linkedDoctorId',  res.data.linkedDoctorId  ?? '');
                localStorage.setItem('linkedPatientId', res.data.linkedPatientId ?? '');
                localStorage.setItem('userSpecialty', res.data.specialty ?? '');
                navigate(res.data.role === 'User' ? '/home' : '/dashboard');
            } else {
                await authService.register(formData);
                const res = await authService.login({ email: formData.email, password: formData.password });
                localStorage.setItem('userName',        res.data.fullName);
                localStorage.setItem('userRole',        res.data.role);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('linkedDoctorId',  res.data.linkedDoctorId  ?? '');
                localStorage.setItem('linkedPatientId', res.data.linkedPatientId ?? '');
                localStorage.setItem('userSpecialty', res.data.specialty ?? '');
                navigate(res.data.role === 'User' ? '/home' : '/dashboard');
            }
        } catch (err) {
            setError(getErrorMessage(err, 'Registration failed. Please check your details.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>

            {/* ── Left brand panel ── */}
            <div
                className="hidden lg:flex w-[42%] relative overflow-hidden flex-col"
                style={{
                    backgroundColor:    '#0a1f1c',
                    backgroundImage:    "url('/auth-hero.png')",
                    backgroundSize:     'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark green gradient overlay — keeps text legible over the photo */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(160deg, rgba(6,26,22,0.90) 0%, rgba(14,61,54,0.80) 55%, rgba(6,26,22,0.72) 100%)',
                        zIndex: 1,
                    }}
                />
                {/* Subtle dot texture */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                        backgroundSize:  '24px 24px',
                        zIndex: 2,
                    }}
                />
                {/* Ambient glows */}
                <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full pointer-events-none"
                    style={{ background: 'rgba(15,201,138,0.07)', filter: 'blur(60px)', zIndex: 2 }} />
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                    style={{ background: 'rgba(16,137,112,0.08)', filter: 'blur(50px)', zIndex: 2 }} />

                <div className="relative flex flex-col justify-between p-12 h-full" style={{ zIndex: 10 }}>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                                background: 'rgba(15,201,138,0.18)',
                                border:     '1px solid rgba(15,201,138,0.3)',
                                boxShadow:  '0 4px 16px rgba(15,201,138,0.15)',
                            }}
                        >
                            <Activity aria-hidden="true" size={20} style={{ color: '#0fc98a' }} strokeWidth={2.5} />
                        </div>
                        <div>
                            <span className="text-white font-bold text-xl tracking-wide" style={{ fontFamily: 'Syne, sans-serif', textShadow: '0 1px 8px rgba(0,0,0,0.65)' }}>
                                Medcare
                            </span>
                            <div className="text-white/60 text-[11px] uppercase tracking-[0.14em] font-semibold mt-0.5">
                                Hospital System
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-[12px] font-bold uppercase tracking-[0.12em] mb-4"
                            style={{ color: '#0fc98a', fontFamily: 'Syne, sans-serif', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>
                            Healthcare Management
                        </p>
                        <h2 className="text-4xl font-bold text-white leading-[1.15] mb-5"
                            style={{ fontFamily: 'Syne, sans-serif', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
                            Your health,<br />in capable hands.
                        </h2>
                        <p className="text-white/70 text-[14px] leading-relaxed max-w-xs">
                            A unified platform for appointments, patient records, and medical staff — built for modern healthcare.
                        </p>

                        <div className="mt-8 flex flex-col gap-3">
                            {FEATURES.map(({ Icon, text }) => (
                                <div key={text} className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(15,201,138,0.15)' }}>
                                        <Icon aria-hidden="true" size={14} style={{ color: '#0fc98a' }} strokeWidth={2} />
                                    </div>
                                    <span className="text-white/70 text-[13px]">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-white/60 text-xs">© 2026 Medcare Hospital System</p>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#f5faf7' }}>
                <div className="w-full max-w-[400px]">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #108970, #0fc98a)' }}>
                            <Activity aria-hidden="true" size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: '#0e3d36' }}>
                            Medcare
                        </span>
                    </div>

                    <h1 className="text-[26px] font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif', color: '#0e3d36' }}>
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="text-[13.5px] mb-8" style={{ color: '#4a6e68' }}>
                        {isLogin ? 'Sign in to access your dashboard' : 'Register to start managing your health'}
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {!isLogin && (
                            <Field
                                name="fullName"
                                placeholder="Dr. Jane Smith"
                                IconEl={UserPlus}
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        )}
                        <Field
                            name="email"
                            type="email"
                            placeholder="you@hospital.com"
                            IconEl={Mail}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <Field
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            IconEl={Lock}
                            minLength={6}
                            value={formData.password}
                            onChange={handleChange}
                        />

                        {error && (
                            <div
                                role="alert"
                                aria-live="assertive"
                                className="flex items-center gap-2.5 p-3.5 rounded-xl text-[13px] font-medium"
                                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid rgba(220,38,38,0.15)' }}
                            >
                                <AlertCircle aria-hidden="true" size={15} style={{ flexShrink: 0 }} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            aria-busy={loading}
                            className="w-full py-3.5 rounded-xl font-bold text-white text-[14.5px] transition-all duration-200 flex items-center justify-center gap-2 group mt-1"
                            style={{
                                fontFamily: 'Syne, sans-serif',
                                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #108970 0%, #0d7a62 100%)',
                                boxShadow:  loading ? 'none' : '0 4px 20px rgba(16,137,112,0.36)',
                                cursor:     loading ? 'not-allowed' : 'pointer',
                            }}
                            onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 6px 28px rgba(16,137,112,0.48)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 20px rgba(16,137,112,0.36)'; e.currentTarget.style.transform = 'none'; }}
                        >
                            {loading ? 'Processing…' : (isLogin ? 'Sign In' : 'Create Account')}
                            {!loading && <ChevronRight aria-hidden="true" size={16} className="group-hover:translate-x-0.5 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-7 text-center">
                        <p className="text-[13px]" style={{ color: '#4a6e68' }}>
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="font-bold transition-colors duration-150"
                                style={{ color: '#0d7a62' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#0b5c47'}
                                onMouseLeave={e => e.currentTarget.style.color = '#0d7a62'}
                            >
                                {isLogin ? 'Register now' : 'Sign in here'}
                            </button>
                        </p>
                    </div>

                </div>
            </div>
        </main>
    );
}
