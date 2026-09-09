import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import PatientDashboard from './pages/PatientDashboard';
import NurseDashboard from './pages/NurseDashboard';
import PharmacistDashboard from './pages/PharmacistDashboard';
import PatientRecords from './pages/PatientRecords';
import AuditLog from './pages/AuditLog'; // ✅ NEW
import AppLayout from './components/layout/AppLayout';
import CommonDashboard from './pages/CommonDashboard'; // Removed
import Login from './pages/Login'; // Removed
import DoctorPrescription from './pages/DoctorPrescription';
import MediKiosk from './pages/MediKiosk';
import AyushPhysicianOPD from './pages/AyushPhysicianOPD';
import OpdWaitingDisplay from './pages/OpdWaitingDisplay';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Welcome, Standalone MediKiosk, and Fullscreen OPD Waiting Room TV Display */}
        <Route path="/" element={<Welcome />} />
        <Route path="/kiosk" element={<MediKiosk />} />
        <Route path="/checkin" element={<MediKiosk />} />
        <Route path="/opd-display" element={<OpdWaitingDisplay />} />
        <Route path="/waiting-room" element={<OpdWaitingDisplay />} />
        
        {/* All other pages with footer */}
        <Route element={<AppLayout />}>
          <Route path="/ayush-opd" element={<AyushPhysicianOPD />} />
          <Route path="/doctor-consultation" element={<AyushPhysicianOPD />} />
          <Route path="/nurse" element={<NurseDashboard />} />
          <Route path="/pharmacist" element={<PharmacistDashboard />} />
          <Route path="/patient-registration" element={<PatientDashboard />} />
          <Route path="/patient-records" element={<PatientRecords />} />
          <Route path="/audit-log" element={<AuditLog />} />
          <Route path="/dashboard" element={<CommonDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor-prescription" element={<DoctorPrescription />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
