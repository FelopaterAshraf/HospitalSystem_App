import { useState, useEffect } from 'react';
import patientService from '../services/patientService';
import { getErrorMessage } from '../services/errorHelper';
import { Users, X, CheckCircle2, AlertCircle } from 'lucide-react';

function statusBadge(status) {
    if (status === 'Approved')  return 'bg-green-50 text-green-600 border-green-100';
    if (status === 'Pending')   return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    if (status === 'Rejected')  return 'bg-red-50 text-red-500 border-red-100';
    if (status === 'Cancelled') return 'bg-gray-50 text-gray-400 border-gray-200';
    return 'bg-gray-50 text-gray-500 border-gray-200';
}

export default function DoctorPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [historyPatient, setHistoryPatient] = useState(null);

    const [diagnosisPatient, setDiagnosisPatient] = useState(null);
    const [diagnosisText, setDiagnosisText] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        patientService.getMyPatients()
            .then(res => setPatients(res.data))
            .catch(() => setError('Failed to load patients.'))
            .finally(() => setLoading(false));
    }, []);

    const openDiagnosis = (patient) => {
        setDiagnosisPatient(patient);
        setDiagnosisText(patient.diagnosis || '');
        setSaveMsg({ type: '', text: '' });
    };

    const saveDiagnosis = async () => {
        setSaving(true);
        try {
            await patientService.updateDiagnosis(diagnosisPatient.id, diagnosisText);
            setPatients(prev =>
                prev.map(p => p.id === diagnosisPatient.id ? { ...p, diagnosis: diagnosisText } : p)
            );
            setDiagnosisPatient(null);
        } catch (err) {
            setSaveMsg({ type: 'error', text: getErrorMessage(err, 'Failed to save diagnosis.') });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading patients...</div>;
    if (error)   return <div className="p-8 text-red-500 font-medium">{error}</div>;

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Patients</h1>
                <p className="text-gray-500">Patients who have appointments with you.</p>
            </div>

            {patients.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400">
                    <Users size={36} className="mx-auto mb-3 opacity-40" />
                    <p>No patients have booked an appointment with you yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm tracking-wide">
                                <th className="px-6 py-4 font-medium w-40">Patient</th>
                                <th className="px-6 py-4 font-medium w-36">Last Appointment</th>
                                <th className="px-6 py-4 font-medium w-44">Last Reason</th>
                                <th className="px-6 py-4 font-medium">Diagnosis</th>
                                <th className="px-6 py-4 font-medium text-right w-px whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {patients.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-800">{p.name}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {p.latestAppointmentDate
                                            ? new Date(p.latestAppointmentDate).toLocaleDateString(undefined, { dateStyle: 'medium' })
                                            : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm max-w-[180px] truncate">
                                        {p.latestReason || '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.diagnosis ? (
                                            <span
                                                className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-medium border border-purple-100"
                                                title={p.diagnosis.length > 60 ? p.diagnosis : undefined}
                                            >
                                                {p.diagnosis.length > 60 ? p.diagnosis.slice(0, 60) + '…' : p.diagnosis}
                                            </span>
                                        ) : (
                                            <span className="bg-gray-50 text-gray-400 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 italic">
                                                No diagnosis yet
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setHistoryPatient(p)}
                                                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-brand-primary hover:text-brand-primary transition-colors font-medium"
                                            >
                                                View History
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openDiagnosis(p)}
                                                className="text-sm px-3 py-1.5 rounded-lg bg-brand-primary text-white hover:bg-brand-dark transition-colors font-medium"
                                            >
                                                {p.diagnosis ? 'Update Diagnosis' : 'Add Diagnosis'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── History Modal ── */}
            {historyPatient && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setHistoryPatient(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-800">
                                Appointment History — {historyPatient.name}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setHistoryPatient(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {historyPatient.appointments?.length === 0 ? (
                            <p className="text-gray-400 text-sm">No appointment records found.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                                {historyPatient.appointments?.map(a => (
                                    <li key={a.id} className="py-3 flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">
                                                {new Date(a.appointmentDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                {' '}
                                                <span className="font-normal text-gray-500">
                                                    {new Date(a.appointmentDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">{a.reason || 'No reason provided'}</p>
                                        </div>
                                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(a.status)}`}>
                                            {a.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* ── Diagnosis Modal ── */}
            {diagnosisPatient && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setDiagnosisPatient(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-800">
                                {diagnosisPatient.diagnosis ? 'Update' : 'Add'} Diagnosis — {diagnosisPatient.name}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setDiagnosisPatient(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <textarea
                            value={diagnosisText}
                            onChange={e => setDiagnosisText(e.target.value)}
                            rows={4}
                            maxLength={500}
                            placeholder="Enter diagnosis..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm resize-none"
                        />

                        {saveMsg.text && (
                            <div className={`mt-2 text-sm flex items-center gap-2 ${saveMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                                {saveMsg.type === 'error'
                                    ? <AlertCircle size={14} aria-hidden="true" />
                                    : <CheckCircle2 size={14} aria-hidden="true" />}
                                {saveMsg.text}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={() => setDiagnosisPatient(null)}
                                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={saveDiagnosis}
                                disabled={saving}
                                className="px-4 py-2 rounded-xl bg-brand-primary text-white hover:bg-brand-dark text-sm font-bold transition-colors disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : 'Save Diagnosis'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
