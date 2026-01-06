import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Activity, Users, Pill, Stethoscope, Clock, TrendingUp, 
  AlertCircle, CheckCircle2, FileText, Shield, Heart, 
  User, LogOut, Menu, X, UserPlus, Search, Filter,
  ChevronRight, BarChart3, Calendar, Bell, Settings,
  Zap, Target, Award, Brain, Sparkles, ArrowUp, ArrowDown,
  Eye, Download, RefreshCw, Radio, Wifi, Database, Cloud,
  Home, Layers, MessageSquare, HelpCircle, ChevronDown,
  Maximize2, Minimize2, Sun, Moon, TrendingDown
} from 'lucide-react';
import { usePatients, useMedications, useAdministrationLogs } from '../hooks/useFirebaseData';

export default function CommonDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole] = useState('nurse');
  const [notifications, setNotifications] = useState(3);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [commandPalette, setCommandPalette] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const { patients } = usePatients();
  const { medications } = useMedications();
  const { logs } = useAdministrationLogs();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const stats = {
    totalPatients: patients.length,
    criticalPatients: patients.filter(p => p.status === 'critical').length,
    stablePatients: patients.filter(p => p.status === 'stable').length,
    activeMedications: medications.filter(m => m.status === 'active').length,
    pendingMedications: medications.filter(m => m.status === 'pending').length,
    todayAdministrations: logs.filter(l => 
      new Date(l.timestamp).toDateString() === new Date().toDateString()
    ).length,
    bedOccupancy: 85,
    availableDoctors: 12,
    efficiency: 94,
    satisfaction: 4.8,
  };

  const navigationGroups = [
    {
      label: 'Main',
      items: [
        { icon: BarChart3, label: 'Dashboard', path: '/dashboard', color: 'blue', badge: null },
        { icon: Users, label: 'Patients', path: '/patient-records', color: 'green', badge: stats.totalPatients },
      ]
    },
    {
      label: 'Operations',
      items: [
        { icon: UserPlus, label: 'Registration', path: '/patient-registration', color: 'purple' },
        { 
          icon: Pill, 
          label: 'Medications', 
          path: '/nurse', 
          color: 'orange',
          badge: stats.pendingMedications > 0 ? stats.pendingMedications : null,
        },
        { icon: Stethoscope, label: 'Pharmacy', path: '/pharmacist', color: 'cyan' },
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

  const recentPatients = patients.slice(0, 6);
  const recentLogs = logs.slice(0, 8);
  const criticalAlerts = patients.filter(p => p.status === 'critical');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR - Fixed for Desktop, Toggle for Mobile */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: isDesktop ? 0 : (sidebarOpen ? 0 : -280),
          width: sidebarCollapsed ? 80 : 280
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:sticky top-0 left-0 h-screen bg-slate-900 text-white flex flex-col shadow-2xl z-50"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 opacity-50" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

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
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigate(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all relative group ${
                          isActive ? 'text-white bg-slate-800 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="activeTab"
                            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
                              item.color === 'blue' ? 'bg-blue-500' :
                              item.color === 'green' ? 'bg-green-500' :
                              item.color === 'purple' ? 'bg-purple-500' :
                              item.color === 'orange' ? 'bg-orange-500' :
                              item.color === 'cyan' ? 'bg-cyan-500' :
                              item.color === 'amber' ? 'bg-amber-500' : 'bg-slate-500'
                            }`}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        <div className={`p-2 rounded-lg transition-all relative ${
                          isActive 
                            ? item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                              item.color === 'green' ? 'bg-green-500/20 text-green-400' :
                              item.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                              item.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                              item.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
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
                    HP
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Harshit Pamar</p>
                    <p className="text-xs text-slate-400 capitalize flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      {userRole}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('username');
                    navigate('/login');
                  }}
                  className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors flex-shrink-0"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg relative">
                HP
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
              <Card className="border-2 border-slate-300 shadow-2xl">
                <div className="p-4 border-b border-slate-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search patients, medications, records... (Ctrl+K)"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="p-2 max-h-96 overflow-y-auto">
                  <div className="space-y-1">
                    <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Quick Actions</p>
                    {[
                      { icon: UserPlus, label: 'New Patient Registration', path: '/patient-registration' },
                      { icon: Users, label: 'View All Patients', path: '/patient-records' },
                      { icon: Pill, label: 'Medication Administration', path: '/nurse' },
                      { icon: Shield, label: 'Audit Log', path: '/audit-log' },
                    ].map((item, idx) => (
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
              </Card>
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
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 truncate">Dashboard</h1>
              <div className="hidden sm:flex items-center gap-2 mt-0.5">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-xs text-slate-600">All systems operational</p>
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

        {/* Dashboard Content */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* Stats Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Stat 1 */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -4 }}>
              <Card className="border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
                <CardContent className="p-3 sm:p-5 relative z-10">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="bg-blue-50 p-2 sm:p-2.5 rounded-lg">
                      <Users size={18} className="text-blue-600" />
                    </motion.div>
                    <Badge variant="outline" className="text-[10px] sm:text-xs text-green-600 border-green-600 hidden sm:flex items-center gap-1">
                      <TrendingUp size={10} />
                      +12%
                    </Badge>
                  </div>
                  <motion.h3 initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="text-xl sm:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1">
                    {stats.totalPatients}
                  </motion.h3>
                  <p className="text-xs sm:text-sm text-slate-600">Total Patients</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stat 2 */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -4 }}>
              <Card className="border border-red-200 shadow-sm bg-red-50/30 overflow-hidden relative">
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl" />
                <CardContent className="p-3 sm:p-5 relative z-10">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }} className="bg-red-100 p-2 sm:p-2.5 rounded-lg">
                      <AlertCircle size={18} className="text-red-600" />
                    </motion.div>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Badge variant="destructive" className="text-[10px] sm:text-xs">URGENT</Badge>
                    </motion.div>
                  </div>
                  <motion.h3 initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.3 }} className="text-xl sm:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1">
                    {stats.criticalPatients}
                  </motion.h3>
                  <p className="text-xs sm:text-sm text-slate-600">Critical</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stat 3 */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -4 }}>
              <Card className="border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
                <CardContent className="p-3 sm:p-5 relative z-10">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="bg-purple-50 p-2 sm:p-2.5 rounded-lg">
                      <Pill size={18} className="text-purple-600" />
                    </motion.div>
                    <Badge variant="outline" className="text-[10px] sm:text-xs text-slate-600 hidden sm:flex">
                      {stats.pendingMedications} pending
                    </Badge>
                  </div>
                  <motion.h3 initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.4 }} className="text-xl sm:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1">
                    {stats.activeMedications}
                  </motion.h3>
                  <p className="text-xs sm:text-sm text-slate-600">Active Meds</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stat 4 */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -4 }}>
              <Card className="border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl" />
                <CardContent className="p-3 sm:p-5 relative z-10">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <motion.div whileHover={{ scale: 1.2 }} className="bg-green-50 p-2 sm:p-2.5 rounded-lg">
                      <CheckCircle2 size={18} className="text-green-600" />
                    </motion.div>
                    <Badge variant="outline" className="text-[10px] sm:text-xs text-green-600 border-green-600">Today</Badge>
                  </div>
                  <motion.h3 initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.5 }} className="text-xl sm:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1">
                    {stats.todayAdministrations}
                  </motion.h3>
                  <p className="text-xs sm:text-sm text-slate-600">Doses Given</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl bg-gradient-to-r from-red-50 to-pink-50 overflow-hidden">
                <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="bg-white/20 p-2 sm:p-3 rounded-xl backdrop-blur-sm">
                        <AlertCircle size={20} />
                      </motion.div>
                      <div>
                        <h3 className="text-base sm:text-xl font-bold">Critical Alerts</h3>
                        <p className="text-red-100 text-xs sm:text-sm">{criticalAlerts.length} patients need immediate attention</p>
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleNavigate('/patient-records')} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm font-medium transition-colors text-sm w-full sm:w-auto">
                      View All
                    </motion.button>
                  </div>
                </motion.div>
                <CardContent className="p-3 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {criticalAlerts.map((patient, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.03, y: -4 }}
                        onClick={() => handleNavigate('/patient-records')}
                        className="bg-white border-2 border-red-200 rounded-xl p-3 sm:p-4 cursor-pointer shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">{patient.name}</h4>
                            <p className="text-xs text-slate-600 font-mono">HHID: {patient.hhid}</p>
                          </div>
                          <Badge variant="destructive" className="text-[10px] sm:text-xs ml-2">CRITICAL</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-slate-600 truncate">{patient.ward} • Bed {patient.bed}</span>
                          <ChevronRight size={16} className="text-red-500 shrink-0" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
              {/* SYSTEM STATUS */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                        <Activity size={20} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">System Health</h3>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    {[
                      { label: 'Bed Occupancy', value: stats.bedOccupancy, max: 100, gradient: 'from-blue-500 to-cyan-500' },
                      { label: 'Staff Available', value: stats.availableDoctors, max: 15, gradient: 'from-emerald-500 to-teal-500' },
                      { label: 'Efficiency', value: stats.efficiency, max: 100, gradient: 'from-purple-500 to-pink-500' },
                    ].map((item, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                          <span className="text-sm font-bold text-slate-900">
                            {item.value}{item.max === 100 ? '%' : `/${item.max}`}
                          </span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / item.max) * 100}%` }}
                            transition={{ duration: 1, delay: idx * 0.2 }}
                            className={`h-full rounded-full bg-gradient-to-r ${item.gradient} shadow-lg`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
  {/* QUICK ACTIONS */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                        <Zap size={20} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    {[
                      { icon: UserPlus, label: 'New Patient', path: '/patient-registration', gradient: 'from-blue-500 to-cyan-500' },
                      { icon: Pill, label: 'Give Medication', path: '/nurse', gradient: 'from-purple-500 to-pink-500' },
                      { icon: Search, label: 'Search Records', path: '/patient-records', gradient: 'from-emerald-500 to-teal-500' },
                      { icon: Shield, label: 'Audit Log', path: '/audit-log', gradient: 'from-amber-500 to-orange-500' },
                    ].map((action, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.03, x: 5 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleNavigate(action.path)}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r ${action.gradient} text-white shadow-lg hover:shadow-xl transition-all`}
                      >
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                          <action.icon size={18} />
                        </div>
                        <span className="font-semibold flex-1 text-left">{action.label}</span>
                        <ChevronRight size={16} />
                      </motion.button>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
              

                   <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                          className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl"
                        >
                          <Activity size={20} className="text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Live Activity</h3>
                          <p className="text-xs text-slate-600">Real-time updates</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-1"></span>
                        Live
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {recentLogs.map((log, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl border border-purple-100"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <CheckCircle2 size={18} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-900 truncate">{log.drugName}</p>
                            <p className="text-xs text-slate-600">Patient: {log.patientHHID} • {log.nurseName}</p>
                          </div>
                          <span className="text-xs text-slate-500 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
          {/* Add more content sections here... Recent Patients, Activity Log, etc. */}
          {/* Use the same structure from the previous code for remaining sections */}

        </motion.div>
      </main>
    </div>
  );
}
