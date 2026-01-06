import { Outlet } from 'react-router-dom';
import Footer from '../shared/Footer';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer on All Pages */}
      <Footer />
    </div>
  );
}
