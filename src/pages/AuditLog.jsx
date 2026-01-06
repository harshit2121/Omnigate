import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Search, Shield, ArrowLeft, Filter, Calendar, User, 
  FileText, Activity, AlertTriangle, CheckCircle2, XCircle
} from 'lucide-react';
import { useAuditLogs } from '../hooks/useAuditLogs';

export default function AuditLog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const { logs, loading } = useAuditLogs(500);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || log.eventType.includes(filterType);
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getEventIcon = (eventType) => {
    if (eventType.includes('medication')) return Pill;
    if (eventType.includes('patient')) return User;
    if (eventType.includes('system')) return Shield;
    return Activity;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return { variant: 'default', icon: CheckCircle2, color: 'text-green-600' };
      case 'failed':
        return { variant: 'destructive', icon: XCircle, color: 'text-red-600' };
      case 'warning':
        return { variant: 'secondary', icon: AlertTriangle, color: 'text-amber-600' };
      default:
        return { variant: 'outline', icon: Activity, color: 'text-slate-600' };
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'nurse': return 'bg-pink-100 text-pink-700 border-pink-300';
      case 'pharmacist': return 'bg-green-100 text-green-700 border-green-300';
      case 'doctor': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-3 sm:p-4 md:p-6">
      
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => navigate('/')}
        className="mb-4 hover:bg-slate-100"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Home
      </Button>

      {/* Header */}
      <div className="mb-4 sm:mb-6 animate-in slide-in-from-top duration-500">
        <div className="bg-gradient-to-r from-slate-700 via-gray-800 to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 sm:p-3 rounded-xl backdrop-blur-sm animate-bounce">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Audit Log</h1>
                <p className="text-white/90 text-xs sm:text-sm">Complete system activity tracking & monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Events', value: logs.length, icon: Activity, color: 'from-blue-500 to-cyan-600' },
          { label: 'Success', value: logs.filter(l => l.status === 'success').length, icon: CheckCircle2, color: 'from-green-500 to-emerald-600' },
          { label: 'Failed', value: logs.filter(l => l.status === 'failed').length, icon: XCircle, color: 'from-red-500 to-rose-600' },
          { label: 'Today', value: logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length, icon: Calendar, color: 'from-purple-500 to-violet-600' },
        ].map((stat, idx) => (
          <Card key={idx} className="border-2 border-slate-200 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-2 border-slate-200 shadow-xl mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                <Search size={14} />
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 border-2"
                />
              </div>
            </div>

            {/* Filter by Type */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                <Filter size={14} />
                Event Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full h-10 border-2 border-slate-200 rounded-md px-3 focus:border-blue-500 outline-none"
              >
                <option value="all">All Events</option>
                <option value="patient">Patient Events</option>
                <option value="medication">Medication Events</option>
                <option value="system">System Events</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                <Activity size={14} />
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-10 border-2 border-slate-200 rounded-md px-3 focus:border-green-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredLogs.length}</span> of {logs.length} events
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setSearchTerm(''); setFilterType('all'); setFilterStatus('all'); }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="border-2 border-slate-200 shadow-xl">
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={64} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-semibold">No audit logs found</p>
                <p className="text-slate-400 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredLogs.map((log, idx) => {
                  const EventIcon = getEventIcon(log.eventType);
                  const statusInfo = getStatusBadge(log.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div 
                      key={log.id} 
                      className="p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="bg-slate-100 p-2 rounded-lg shrink-0">
                          <EventIcon className="text-slate-600" size={20} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900 mb-1">{log.action}</p>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <Badge variant="outline" className="font-mono">
                                  {log.targetId}
                                </Badge>
                                <span className="text-slate-600">{log.targetName}</span>
                              </div>
                            </div>
                            <Badge variant={statusInfo.variant} className="shrink-0 flex items-center gap-1">
                              <StatusIcon size={12} />
                              {log.status}
                            </Badge>
                          </div>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {log.performedBy}
                            </span>
                            <Badge className={`${getRoleBadgeColor(log.performedByRole)} text-xs`}>
                              {log.performedByRole}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(log.timestamp).toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Details */}
                          {log.details && Object.keys(log.details).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                                View Details
                              </summary>
                              <pre className="mt-2 text-xs bg-slate-100 p-2 rounded overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Import Pill icon
import { Pill } from 'lucide-react';
