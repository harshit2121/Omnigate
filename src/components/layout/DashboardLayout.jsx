import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Activity, Stethoscope, User, LogOut, Menu, X, 
  Pill, Users, Shield, Settings, Bell, Search,
  ChevronRight, ChevronDown, Sparkles, HelpCircle,
  Maximize2, Minimize2, Clock, Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [commandPalette, setCommandPalette] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    setCommandPalette(false);
  };

  const navigationGroups = [
    {
      label: 'Main',
      items: [
        { icon: Activity, label: 'Nurse', path: '/nurse', color: 'blue', badge: null },
        { icon: Stethoscope, label: 'Pharmacist', path: '/pharmacist', color: 'green', badge: null },
        { icon: User, label: 'Patient', path: '/patient/HH001', color: 'purple', badge: null },
      ]
    },
    {
      label: 'Management',
      items: [
        { icon: Users, label: 'All Patients', path: '/patient-records', color: 'cyan', badge: null },
        { icon: Pill, label: 'Medications', path: '/medications', color: 'orange', badge: 2 },
      ]
    },
    {
      label: 'System',
      items: [
        { icon: Shield, label: 'Audit Log', path: '/audit-log', color: 'amber' },
        { icon: Settings, label: 'Settings', path: '/settings', color: 'slate' },
      ]
    }
  ];

  const isActive = (path) => location.pathname === path;

  const getPageTitle = () => {
    if (location.pathname.includes('pharmacist')) return 'Pharmacist Dashboard';
    if (location.pathname.includes('nurse')) return 'Nurse Dashboard';
    if (location.pathname.includes('patient')) return 'Patient Portal';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* MODERN SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : -280,
          width: sidebarCollapsed ? 80 : 280
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:sticky top-0 left-0 h-screen bg-slate-900 text-white flex flex-col shadow-2xl z-50 lg:translate-x-0"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 opacity-50" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Logo & Controls */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between relative z-10">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <Activity size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">OmniGate</h1>
                <p className="text-xs text-slate-400">Hospital System</p>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg mx-auto">
              <Activity size={22} className="text-white" />
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:block p-2 hover:bg-slate-800 rounded-lg transition-colors">
            {sidebarCollapsed ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="space-y-6 px-2">
            {navigationGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                {!sidebarCollapsed && (
                  <div className="px-3 mb-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{group.label}</p>
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item, idx) => {
                    const active = isActive(item.path);
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigate(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all relative group ${active ? 'text-white bg-slate-800 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                      >
                        {active && (
                          <motion.div 
                            layoutId="activeTab"
                            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
                              item.color === 'blue' ? 'bg-blue-500' :
                              item.color === 'green' ? 'bg-green-500' :
                              item.color === 'purple' ? 'bg-purple-500' :
                              item.color === 'cyan' ? 'bg-cyan-500' :
                              item.color === 'orange' ? 'bg-orange-500' :
                              item.color === 'amber' ? 'bg-amber-500' : 'bg-slate-500'
                            }`}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        <div className={`p-2 rounded-lg transition-all relative ${
                          active 
                            ? item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                              item.color === 'green' ? 'bg-green-500/20 text-green-400' :
                              item.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                              item.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                              item.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                              item.color === 'amber' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                            : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-700'
                        }`}>
                          <item.icon size={18} />
                          {item.badge && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {!sidebarCollapsed && <span className="font-medium flex-1 text-left">{item.label}</span>}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Quick Actions */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-slate-800 relative z-10">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-blue-400" />
                <p className="text-xs font-semibold text-slate-300">Quick Actions</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setCommandPalette(true)} className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-xs text-slate-300 hover:text-white transition-colors">
                  <Search size={14} className="mx-auto mb-1" />
                  Search
                </button>
                <button className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-xs text-slate-300 hover:text-white transition-colors">
                  <HelpCircle size={14} className="mx-auto mb-1" />
                  Help
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800 relative z-10">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} gap-3`}>
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0 relative">
                    A
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Dr. Admin</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      Online
                    </p>
                  </div>
                </div>
                <button onClick={() => handleNavigate('/')} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors flex-shrink-0">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg relative">
                A
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* COMMAND PALETTE */}
      <AnimatePresence>
        {commandPalette && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommandPalette(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[70] px-4"
            >
              <div className="bg-white border-2 border-slate-300 shadow-2xl rounded-lg overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search pages, patients, records... (Ctrl+K)"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="p-2 max-h-96 overflow-y-auto">
                  <div className="space-y-1">
                    <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Quick Navigation</p>
                    {navigationGroups.flatMap(g => g.items).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavigate(item.path)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-colors text-left"
                      >
                        <item.icon size={18} className="text-slate-600" />
                        <span className="text-sm font-medium text-slate-900">{item.label}</span>
                        <ChevronRight size={16} className="ml-auto text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-slate-50 w-full lg:w-auto">
        {/* Top Bar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm"
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden shrink-0">
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 truncate">{getPageTitle()}</h1>
              <div className="hidden sm:flex items-center gap-2 mt-0.5">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-xs text-slate-600">
                  {currentTime.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button onClick={() => setCommandPalette(true)} className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-sm text-slate-600">
              <Search size={16} />
              <span>Search</span>
              <kbd className="ml-2 px-2 py-0.5 bg-white border border-slate-300 rounded text-xs">⌘K</kbd>
            </button>
            <div className="hidden md:block text-right bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <p className="text-sm font-bold text-slate-900 font-mono">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-[10px] text-slate-500">
                {currentTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative p-2 sm:p-2.5 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
              <Bell size={18} className="text-slate-700" />
              {notifications > 0 && (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {notifications}
                </motion.span>
              )}
            </motion.button>
            <button onClick={() => setCommandPalette(true)} className="md:hidden p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Search size={18} />
            </button>
          </div>
        </motion.div>

        {/* Page Content */}
        <div className="p-3 sm:p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
