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
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Welcome page without footer */}
        <Route path="/" element={<Welcome />} />
        
        {/* All other pages with footer */}
        <Route element={<AppLayout />}>
          <Route path="/nurse" element={<NurseDashboard />} />
          <Route path="/pharmacist" element={<PharmacistDashboard />} />
          <Route path="/patient-registration" element={<PatientDashboard />} />
          <Route path="/patient-records" element={<PatientRecords />} />
          <Route path="/audit-log" element={<AuditLog />} /> {/* ✅ NEW */}
          <Route path="/dashboard" element={<CommonDashboard />} /> {/* ✅ NEW */}
          <Route path="/login" element={<Login />} /> {/* ✅ NEW */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
