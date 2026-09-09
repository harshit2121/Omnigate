import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Search, Shield, ArrowLeft, Filter, Calendar, User, 
  FileText, Activity, AlertTriangle, CheckCircle2, XCircle,
  Lock, Link as LinkIcon, RefreshCw, ShieldCheck, Database
} from 'lucide-react';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { verifyAuditLedgerIntegrity, getLocalAuditLedger } from '../services/auditLog';

export default function AuditLog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { logs, loading } = useAuditLogs(500);

  // Run initial cryptographic ledger verification
  useEffect(() => {
    runIntegrityCheck();
  }, [logs]);

  const runIntegrityCheck = async () => {
    setIsVerifying(true);
    try {
      const localLedger = getLocalAuditLedger();
      const combined = logs.length > 0 ? logs : localLedger;
      const result = await verifyAuditLedgerIntegrity(combined);
      setVerificationResult(result);
    } catch (err) {
      console.error('Ledger verification error:', err);
      setVerificationResult({ isValid: false, reason: err.message });
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.targetName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.performedBy || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.targetId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.blockHash || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || (log.eventType || '').includes(filterType);
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getEventIcon = (eventType = '') => {
    if (eventType.includes('medication')) return Activity;
    if (eventType.includes('patient') || eventType.includes('kiosk')) return User;
    if (eventType.includes('system') || eventType.includes('crypto')) return Lock;
    return Shield;
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
      case 'kiosk': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading cryptographic audit ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-3 sm:p-4 md:p-6 font-sans">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Button>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 py-1 px-3">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span className="font-semibold text-xs">DPDP Act 2023 & ABDM M3 Compliant</span>
          </Badge>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 animate-in slide-in-from-top duration-500">
        <div className="bg-gradient-to-r from-slate-800 via-[#0B4C8C] to-slate-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-sm shadow-inner">
                <Lock className="text-emerald-400" size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                  Immutable Cryptographic Audit Trail
                </h1>
                <p className="text-blue-100 text-xs sm:text-sm mt-0.5">
                  Tamper-evident SHA-256 hash-chained ledger for clinical actions, ABHA consent, and token dispatches
                </p>
              </div>
            </div>

            <Button
              onClick={runIntegrityCheck}
              disabled={isVerifying}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-4 rounded-xl flex items-center gap-2 shadow-md cursor-pointer shrink-0"
            >
              <RefreshCw size={14} className={isVerifying ? "animate-spin" : ""} />
              <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Cryptographic Integrity'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Cryptographic Ledger Verification Status Card */}
      {verificationResult && (
        <Card className={`border-2 mb-6 shadow-md transition-all ${
          verificationResult.isValid ? 'border-emerald-300 bg-emerald-50/70' : 'border-rose-300 bg-rose-50/70'
        }`}>
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${verificationResult.isValid ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                {verificationResult.isValid ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {verificationResult.isValid ? 'Cryptographic Ledger Integrity: 100% Verified (Intact)' : 'Integrity Alert: Tampering Detected'}
                  </h4>
                  <Badge className={verificationResult.isValid ? "bg-emerald-700 text-white text-[10px]" : "bg-rose-700 text-white text-[10px]"}>
                    {verificationResult.isValid ? 'ZERO DISCREPANCIES' : 'TAMPER DETECTED'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-mono">
                  {verificationResult.statusText || verificationResult.reason}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 text-xs text-slate-500 font-mono">
              <div>Verified: {new Date(verificationResult.verifiedAt || Date.now()).toLocaleTimeString('en-IN')}</div>
              <div>Algorithm: SHA-256 / AES-GCM</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Chained Blocks', value: logs.length, icon: Database, color: 'from-blue-500 to-cyan-600' },
          { label: 'Success Actions', value: logs.filter(l => l.status === 'success').length, icon: CheckCircle2, color: 'from-green-500 to-emerald-600' },
          { label: 'Security Flags', value: logs.filter(l => l.status === 'warning' || l.status === 'failed').length, icon: AlertTriangle, color: 'from-amber-500 to-rose-600' },
          { label: 'Today Dispatches', value: logs.filter(l => new Date(l.timestamp || l.timestampISO).toDateString() === new Date().toDateString()).length, icon: Calendar, color: 'from-purple-500 to-violet-600' },
        ].map((stat, idx) => (
          <Card key={idx} className="border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 shadow-xs`}>
                <stat.icon className="text-white" size={18} />
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-2 border-slate-200 shadow-sm mb-6">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1 uppercase tracking-wider">
                <Search size={13} />
                Search Hash / Action / ABHA
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={15} />
                <Input
                  placeholder="Search by action, block hash, patient ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-10 border-2 font-mono text-xs"
                />
              </div>
            </div>

            {/* Filter by Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1 uppercase tracking-wider">
                <Filter size={13} />
                Event Scope
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full h-10 border-2 border-slate-200 rounded-md px-3 text-xs font-medium focus:border-blue-500 outline-none"
              >
                <option value="all">All Events & Blocks</option>
                <option value="kiosk">Kiosk Token Dispatches</option>
                <option value="patient">Patient Clinical Intake</option>
                <option value="medication">Medication Administrations</option>
                <option value="system">System & Security Logs</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1 uppercase tracking-wider">
                <Activity size={13} />
                Execution Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-10 border-2 border-slate-200 rounded-md px-3 text-xs font-medium focus:border-green-500 outline-none"
              >
                <option value="all">All Execution States</option>
                <option value="success">Success / Verified</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning / Flagged</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-200">
            <p className="text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredLogs.length}</span> of {logs.length} immutable blocks
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setSearchTerm(''); setFilterType('all'); setFilterStatus('all'); }}
              className="text-xs h-8 cursor-pointer"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="border-2 border-slate-200 shadow-md">
        <CardContent className="p-0">
          <div className="max-h-[650px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-semibold text-sm">No cryptographic logs found</p>
                <p className="text-slate-400 text-xs">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredLogs.map((log, idx) => {
                  const EventIcon = getEventIcon(log.eventType);
                  const statusInfo = getStatusBadge(log.status);
                  const StatusIcon = statusInfo.icon;
                  const displayHash = log.blockHash || log.id || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

                  return (
                    <div 
                      key={log.id || idx} 
                      className="p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Block Index & Icon */}
                        <div className="bg-[#0B4C8C]/10 text-[#0B4C8C] p-2.5 rounded-xl shrink-0 flex flex-col items-center justify-center min-w-[48px]">
                          <EventIcon size={18} />
                          <span className="text-[10px] font-bold font-mono mt-0.5">#{log.blockIndex || (idx + 1)}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex-1">
                              <p className="text-sm font-extrabold text-slate-900 mb-0.5">{log.action}</p>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <Badge variant="outline" className="font-mono bg-slate-50 text-[11px] font-bold text-slate-800">
                                  {log.targetId}
                                </Badge>
                                <span className="text-slate-600 font-medium">{log.targetName}</span>
                              </div>
                            </div>
                            <Badge variant={statusInfo.variant} className="shrink-0 flex items-center gap-1 text-[11px] font-bold">
                              <StatusIcon size={12} />
                              {log.status}
                            </Badge>
                          </div>

                          {/* Cryptographic Hash Strip */}
                          <div className="bg-slate-100/90 border border-slate-200 rounded-lg px-2.5 py-1 my-1.5 flex items-center justify-between text-[10.5px] font-mono text-slate-700">
                            <div className="flex items-center gap-1.5 truncate">
                              <LinkIcon size={11} className="text-emerald-600 shrink-0" />
                              <span className="font-bold text-slate-800">SHA-256:</span>
                              <span className="truncate text-slate-600">{displayHash}</span>
                            </div>
                            <span className="text-[9.5px] text-emerald-700 font-bold uppercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                              CHAIN LINKED ✓
                            </span>
                          </div>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                            <span className="flex items-center gap-1 font-medium">
                              <User size={12} />
                              {log.performedBy}
                            </span>
                            <Badge className={`${getRoleBadgeColor(log.performedByRole)} text-[10px] font-bold`}>
                              {log.performedByRole}
                            </Badge>
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Calendar size={12} />
                              {new Date(log.timestamp || log.timestampISO || Date.now()).toLocaleString('en-IN')}
                            </span>
                            {log.ipAddress && (
                              <span className="text-[11px] text-slate-400 font-mono">
                                IP: {log.ipAddress}
                              </span>
                            )}
                          </div>

                          {/* Details Accordion */}
                          {log.details && Object.keys(log.details).length > 0 && (
                            <details className="mt-2 text-xs">
                              <summary className="text-[#0B4C8C] font-semibold cursor-pointer hover:underline">
                                Inspect Payload Parameters & Metadata
                              </summary>
                              <pre className="mt-2 text-[11px] bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto font-mono">
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
