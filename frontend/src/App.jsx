import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute, { RoleRoute } from './components/ProtectedRoute';

import Auth              from './pages/Auth';
import Dashboard         from './pages/Dashboard';
import DoctorList        from './pages/DoctorList';
import AddDoctor         from './pages/AddDoctor';
import EditDoctor        from './pages/EditDoctor';
import DoctorSchedule    from './pages/DoctorSchedule';
import PatientList       from './pages/PatientList';
import AddPatient        from './pages/AddPatient';
import EditPatient       from './pages/EditPatient';
import AppointmentList   from './pages/AppointmentList';
import AddAppointment    from './pages/AddAppointment';
import EditAppointment   from './pages/EditAppointment';
import BookAppointment   from './pages/BookAppointment';
import PendingAppointments from './pages/PendingAppointments';
import PatientHome       from './pages/PatientHome';
import MyAppointments    from './pages/MyAppointments';

const wrap = (Page) => <DashboardLayout><Page /></DashboardLayout>;

function App() {
    return (
        <Router>
            <Routes>
                {/* Public */}
                <Route path="/" element={<Auth />} />

                {/* ── All authenticated users ── */}
                <Route element={<ProtectedRoute />}>

                    {/* Visible to all roles */}
                    <Route path="/doctors" element={wrap(DoctorList)} />

                    {/* ── Admin + Doctor ── */}
                    <Route element={<RoleRoute allowedRoles={['Admin', 'Doctor']} />}>
                        <Route path="/dashboard" element={wrap(Dashboard)} />
                    </Route>

                    {/* ── Admin only ── */}
                    <Route element={<RoleRoute allowedRoles={['Admin']} />}>
                        <Route path="/doctors/new"            element={wrap(AddDoctor)} />
                        <Route path="/doctors/edit/:id"       element={wrap(EditDoctor)} />
                        <Route path="/doctors/:id/schedule"   element={wrap(DoctorSchedule)} />

                        <Route path="/patients"               element={wrap(PatientList)} />
                        <Route path="/patients/new"           element={wrap(AddPatient)} />
                        <Route path="/patients/edit/:id"      element={wrap(EditPatient)} />

                        <Route path="/appointments"           element={wrap(AppointmentList)} />
                        <Route path="/appointments/new"       element={wrap(AddAppointment)} />
                        <Route path="/appointments/edit/:id"  element={wrap(EditAppointment)} />
                    </Route>

                    {/* ── User / Patient only ── */}
                    <Route element={<RoleRoute allowedRoles={['User']} />}>
                        <Route path="/home"                   element={wrap(PatientHome)} />
                        <Route path="/my-appointments"        element={wrap(MyAppointments)} />
                        <Route path="/appointments/book"      element={wrap(BookAppointment)} />
                    </Route>

                    {/* ── Doctor only ── */}
                    <Route element={<RoleRoute allowedRoles={['Doctor']} />}>
                        <Route path="/appointments/pending"   element={wrap(PendingAppointments)} />
                    </Route>

                </Route>
                {/* ── END PROTECTED ── */}

            </Routes>
        </Router>
    );
}

export default App;
