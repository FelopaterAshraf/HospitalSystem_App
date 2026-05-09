import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import appointmentService from '../services/appointmentService';
import {
    CalendarPlus, Heart, Brain, Bone, Baby, ClipboardList,
    Clock, Calendar, ShieldCheck, Award, Zap, Activity, Users,
} from 'lucide-react';

const services = [
    { icon: Heart,  label: 'Cardiology',  desc: 'Heart & cardiovascular care',  gradient: 'from-rose-400 to-rose-600' },
    { icon: Brain,  label: 'Neurology',   desc: 'Brain & nervous system',        gradient: 'from-violet-400 to-violet-600' },
    { icon: Bone,   label: 'Orthopedics', desc: 'Bone, joint & muscle care',     gradient: 'from-amber-400 to-amber-600' },
    { icon: Baby,   label: 'Pediatrics',  desc: 'Care for children & infants',   gradient: 'from-sky-400 to-sky-600' },
];

const features = [
    { icon: ShieldCheck, title: 'Secure & Private',  desc: 'Your health data is encrypted and protected at every step.' },
    { icon: Award,       title: 'Top Specialists',   desc: 'Access certified doctors across a wide range of specialties.' },
    { icon: Zap,         title: 'Fast Booking',      desc: 'Book, reschedule, or cancel appointments in seconds.' },
];

const STATUS_LABEL = { 0: 'Pending', 1: 'Approved', 2: 'Rejected', 3: 'Cancelled' };
const STATUS_CLASS  = {
    0: 'bg-yellow-100 text-yellow-700',
    1: 'bg-green-100  text-green-700',
    2: 'bg-red-100    text-red-600',
    3: 'bg-gray-100   text-gray-500',
};

export default function PatientHome() {
    const userName = localStorage.getItem('userName') || 'Patient';
    const [allAppointments, setAllAppointments] = useState([]);
    const [loadingAppts, setLoadingAppts] = useState(true);

    useEffect(() => {
        appointmentService.getMine()
            .then(res => setAllAppointments(res.data))
            .catch(() => {})
            .finally(() => setLoadingAppts(false));
    }, []);

    const now = new Date();
    const activeUpcoming = allAppointments
        .filter(a => (a.status === 0 || a.status === 1) && new Date(a.appointmentDate) > now)
        .slice(0, 4);

    return (
        <div className="space-y-12">

            {/* ── Hero ── */}
            <div className="animate-fade-in relative rounded-3xl overflow-hidden bg-[#0d3d35]">
                {/* Decorative blobs */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-14 -left-14 w-64 h-64 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 px-8 py-12 md:py-14 flex flex-col md:flex-row items-center gap-10">

                    {/* Left — headline + CTA + stats */}
                    <div className="flex-1 min-w-0">
                        <p className="text-brand-primary font-semibold text-xs uppercase tracking-widest mb-3">Welcome back</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-2">
                            Hello, {userName}
                        </h1>
                        <p className="text-xl font-semibold text-white/70 mb-3">Your Health, Our Priority.</p>
                        <p className="text-gray-300 text-sm mb-8 max-w-md leading-relaxed">
                            Connect with top specialists, book appointments in seconds,
                            and manage your care — all in one place.
                        </p>

                        <div className="flex flex-wrap gap-3 mb-10">
                            <Link
                                to="/appointments/book"
                                className="bg-brand-primary hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:-translate-y-0.5"
                            >
                                <CalendarPlus aria-hidden="true" size={18} /> Book Appointment
                            </Link>
                            <Link
                                to="/my-appointments"
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:-translate-y-0.5"
                            >
                                <ClipboardList aria-hidden="true" size={18} /> My Appointments
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6">
                            {[
                                { icon: Users,       val: '50+',  label: 'Trusted Doctors' },
                                { icon: Calendar,    val: '24/7', label: 'Easy Booking' },
                                { icon: ShieldCheck, val: '100%', label: 'Secure Care' },
                            ].map(({ icon: Icon, val, label }) => (
                                <div key={label} className="flex items-center gap-2.5">
                                    <div aria-hidden="true" className="bg-brand-primary/20 p-1.5 rounded-lg">
                                        <Icon size={14} className="text-brand-primary" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm leading-none">{val}</p>
                                        <p className="text-gray-400 text-xs mt-0.5">{label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — glass specialties card */}
                    <div className="flex-shrink-0 w-full md:w-72">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity aria-hidden="true" size={16} className="text-brand-primary" />
                                <span className="text-white font-semibold text-sm">Our Specialties</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Oncology'].map(s => (
                                    <div key={s} className="bg-white/10 rounded-xl px-3 py-2 text-white text-xs font-medium text-center">
                                        {s}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 text-center">
                                <p className="text-brand-primary font-bold text-2xl">50+</p>
                                <p className="text-gray-300 text-xs">Specialists available</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Our Services ── */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Our Services</h2>
                    <p className="text-gray-500 text-sm mt-1">Expert care across leading medical specialties</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {services.map(({ icon: Icon, label, desc, gradient }) => (
                        <div
                            key={label}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-default group"
                        >
                            <div aria-hidden="true" className={`bg-gradient-to-br ${gradient} p-3.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                                <Icon size={26} className="text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{label}</p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Why Choose Medcare? ── */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Why Choose Medcare?</h2>
                    <p className="text-gray-500 text-sm mt-1">Everything you need for a better healthcare experience</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                            <div aria-hidden="true" className="bg-brand-primary/10 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                                <Icon size={22} className="text-brand-primary" />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-1.5">{title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Upcoming Appointments ── */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Upcoming Appointments</h2>
                        <p className="text-gray-500 text-sm mt-0.5">Your next scheduled visits</p>
                    </div>
                    <Link to="/my-appointments" className="text-sm text-brand-primary hover:underline font-medium">
                        View all <span aria-hidden="true">→</span>
                    </Link>
                </div>

                {loadingAppts ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center" role="status" aria-live="polite">
                        <div className="text-gray-400 text-sm animate-pulse">Loading appointments...</div>
                    </div>
                ) : activeUpcoming.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <div aria-hidden="true" className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Calendar size={32} className="text-gray-300" />
                        </div>
                        <p className="text-gray-600 font-semibold mb-1">No upcoming appointments</p>
                        <p className="text-gray-400 text-sm mb-6">Book an appointment with one of our specialists to get started.</p>
                        <Link
                            to="/appointments/book"
                            className="inline-block bg-brand-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-dark transition-colors shadow-sm"
                        >
                            Book an Appointment
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-sm">
                                    <th scope="col" className="px-6 py-3.5 font-medium">Doctor</th>
                                    <th scope="col" className="px-6 py-3.5 font-medium">Date &amp; Time</th>
                                    <th scope="col" className="px-6 py-3.5 font-medium">Reason</th>
                                    <th scope="col" className="px-6 py-3.5 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {activeUpcoming.map(a => (
                                    <tr key={a.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-800">Dr. {a.doctorName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Clock aria-hidden="true" size={13} className="text-brand-primary flex-shrink-0" />
                                                <span className="text-sm">{new Date(a.appointmentDate).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{a.reason || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CLASS[a.status]}`}>
                                                {STATUS_LABEL[a.status] ?? 'Unknown'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}
