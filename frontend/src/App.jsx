import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; //enables client-side routing
import DashboardLayout from './components/DashboardLayout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DoctorList from './pages/DoctorList';
import AddDoctor from './pages/AddDoctor';
import EditDoctor from './pages/EditDoctor';
import PatientList from './pages/PatientList';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import AppointmentList from './pages/AppointmentList';
import AddAppointment from './pages/AddAppointment';
import EditAppointment from './pages/EditAppointment';


import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* The Login page stays outside so unauthenticated users can see it */}
                <Route path="/" element={<Auth />} />
                
                {/* --- THE BOUNCER: Everything inside this wrapper is protected --- */}
                <Route element={<ProtectedRoute />}>
                    
                    {/* Dashboard Hub */}
                    <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
                    
                    {/* Doctor Routes */}
                    <Route path="/doctors" element={<DashboardLayout><DoctorList /></DashboardLayout>} />
                    <Route path="/doctors/new" element={<DashboardLayout><AddDoctor /></DashboardLayout>} />
                    <Route path="/doctors/edit/:id" element={<DashboardLayout><EditDoctor /></DashboardLayout>} />
                    
                    {/* Patient Routes */}
                    <Route path="/patients" element={<DashboardLayout><PatientList /></DashboardLayout>} />
                    <Route path="/patients/new" element={<DashboardLayout><AddPatient /></DashboardLayout>} />
                    <Route path="/patients/edit/:id" element={<DashboardLayout><EditPatient /></DashboardLayout>} />

                    {/* Appointment Routes */}
                    <Route path="/appointments" element={<DashboardLayout><AppointmentList /></DashboardLayout>} />
                    <Route path="/appointments/new" element={<DashboardLayout><AddAppointment /></DashboardLayout>} />
                    <Route path="/appointments/edit/:id" element={<DashboardLayout><EditAppointment /></DashboardLayout>} />
                    
                </Route>
                {/* --- END OF PROTECTED ROUTES --- */}
                
            </Routes>
        </Router>
    );
}

export default App;