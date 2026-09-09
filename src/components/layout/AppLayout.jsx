import { Outlet } from 'react-router-dom';
import GovtTopbar from './GovtTopbar';
import Footer from '../shared/Footer';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Official Government Topbar */}
      <GovtTopbar />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer on All Pages */}
      <Footer />
    </div>
  );
}
