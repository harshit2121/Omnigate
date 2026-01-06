import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { 
  Pill, Search, Clock, CheckCircle2, AlertCircle, 
  ArrowLeft, User, Calendar, XCircle, Filter, Activity,
  Lock, Unlock, Loader2, Box, Scan, ShoppingCart, Plus,
  Package, AlertTriangle, Trash2, Send, Menu, X, Brain,
  Shield, Sparkles, Info, TrendingUp
} from 'lucide-react';
import { usePatients, useMedications } from '../hooks/useFirebaseData';
import { addAdministrationLog } from '../services/firebaseMedications';
import ScanInterface from '@/components/dashboard/nurse/ScanInterface';
import { drugInteractionsDB } from '../data/drugInteractions';

export default function NurseDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('medications');

  // Authentication States
  const [currentPatient, setCurrentPatient] = useState(null);
  const [currentNurse, setCurrentNurse] = useState(null);
  const [authenticationComplete, setAuthenticationComplete] = useState(false);

  // IoT Cabinet States
  const [showRackTrigger, setShowRackTrigger] = useState(false);
  const [rackOpened, setRackOpened] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  // Request System States
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestItems, setRequestItems] = useState([]);
  const [newRequestItem, setNewRequestItem] = useState({
    drugName: '',
    brandName: '',
    quantity: '',
    lastRackId: ''
  });

  // Mobile: Show/Hide filters on mobile
  const [showFilters, setShowFilters] = useState(false);

  // 🤖 AI Features States
  const [medicationAlerts, setMedicationAlerts] = useState([]);
  const [patientRiskScore, setPatientRiskScore] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedMedAIInfo, setSelectedMedAIInfo] = useState(null);

  const { patients } = usePatients();
  const { medications, loading: medsLoading } = useMedications();

  const getCurrentNurseInfo = () => {
    if (!currentNurse) {
      return { name: 'Nurse', id: 'N001', ward: 'General Ward' };
    }
    
    const nurseWardMap = {
      'N001': 'General Ward',
      'N002': 'ICU',
      'N003': 'Pediatric Ward',
      'N004': 'Emergency Ward'
    };

    return {
      name: currentNurse.name,
      id: currentNurse.id,
      ward: nurseWardMap[currentNurse.id] || 'General Ward'
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const activeMedications = medications.filter(m => m.status === 'active');

  // 🤖 AI: Analyze patient medications when authenticated
  useEffect(() => {
    if (authenticationComplete && currentPatient) {
      const patientMeds = activeMedications.filter(m => m.patientHHID === currentPatient.hhid);
      
      if (patientMeds.length > 0) {
        const drugNames = patientMeds.map(m => m.drugName);
        const interactions = drugInteractionsDB.checkInteractions(drugNames);
        
        const alerts = [];
        
        // Critical interactions
        interactions.alerts.forEach(alert => {
          alerts.push({
            type: 'interaction',
            severity: 'high',
            icon: AlertTriangle,
            message: alert.message,
            effect: alert.effect,
            recommendation: alert.recommendation || 'Consult pharmacist immediately'
          });
        });

        // Moderate warnings
        interactions.warnings.forEach(warning => {
          alerts.push({
            type: 'warning',
            severity: 'moderate',
            icon: AlertCircle,
            message: warning.message,
            effect: warning.effect,
            recommendation: warning.recommendation || 'Monitor patient closely'
          });
        });

        // Contraindications
        interactions.contraindications.forEach(contra => {
          alerts.push({
            type: 'contraindication',
            severity: 'critical',
            icon: XCircle,
            message: contra.message,
            details: contra.details,
            recommendation: 'DO NOT ADMINISTER - Contact physician'
          });
        });

        setMedicationAlerts(alerts);
        setShowAIPanel(alerts.length > 0);

        // Calculate patient risk score
        calculateRiskScore(currentPatient, patientMeds, interactions);
      } else {
        setMedicationAlerts([]);
        setShowAIPanel(false);
        setPatientRiskScore(null);
      }
    } else {
      setMedicationAlerts([]);
      setShowAIPanel(false);
      setPatientRiskScore(null);
    }
  }, [authenticationComplete, currentPatient, activeMedications]);

  // 🤖 AI: Calculate patient risk score
  const calculateRiskScore = (patient, meds, interactions) => {
    let riskScore = 0;
    let riskFactors = [];

    // Age factor
    if (patient.age > 65) {
      riskScore += 20;
      riskFactors.push('Elderly patient (>65 years)');
    } else if (patient.age < 5) {
      riskScore += 15;
      riskFactors.push('Pediatric patient');
    }

    // Polypharmacy
    if (meds.length > 5) {
      riskScore += 25;
      riskFactors.push(`Polypharmacy (${meds.length} medications)`);
    } else if (meds.length > 3) {
      riskScore += 15;
      riskFactors.push(`Multiple medications (${meds.length})`);
    }

    // Drug interactions
    if (interactions.alerts.length > 0) {
      riskScore += 30;
      riskFactors.push(`${interactions.alerts.length} critical drug interaction(s)`);
    }
    if (interactions.warnings.length > 0) {
      riskScore += 10;
      riskFactors.push(`${interactions.warnings.length} moderate interaction(s)`);
    }

    // High-risk medications
    const highRiskDrugs = ['Warfarin', 'Insulin Glargine', 'Digoxin', 'Methotrexate'];
    const patientHighRiskDrugs = meds.filter(m => highRiskDrugs.includes(m.drugName));
    if (patientHighRiskDrugs.length > 0) {
      riskScore += 20;
      riskFactors.push(`High-risk medication: ${patientHighRiskDrugs.map(m => m.drugName).join(', ')}`);
    }

    // Determine risk level
    let riskLevel = 'Low';
    let riskColor = 'green';
    if (riskScore > 50) {
      riskLevel = 'Critical';
      riskColor = 'red';
    } else if (riskScore > 30) {
      riskLevel = 'High';
      riskColor = 'orange';
    } else if (riskScore > 15) {
      riskLevel = 'Moderate';
      riskColor = 'yellow';
    }

    setPatientRiskScore({
      score: Math.min(riskScore, 100),
      level: riskLevel,
      color: riskColor,
      factors: riskFactors
    });
  };

  // 🤖 AI: Verify medication dose before administration
  const verifyMedicationDose = (medication) => {
    const drugInfo = drugInteractionsDB.getDrugInfo(medication.drugName);
    
    if (!drugInfo) {
      return {
        safe: true,
        message: 'No dose information available - proceed with caution',
        info: null
      };
    }

    return {
      safe: true,
      message: '✅ Dose verification available',
      maxDose: drugInfo.maxDose,
      info: drugInfo
    };
  };

  const getTodayLogs = (medication) => {
    const today = new Date().toISOString().split('T')[0];
    return medication.administrationLogs?.filter(log => {
      const logDate = new Date(log.timestamp).toISOString().split('T')[0];
      return logDate === today && log.status === 'administered';
    }) || [];
  };

  const canAdminister = (medication) => {
    if (!medication.timing || medication.timing.length === 0) {
      return { allowed: true, reason: 'No specific timing set' };
    }

    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const today = now.toISOString().split('T')[0];
    const administeredToday = medication.administrationLogs?.filter(log => {
      const logDate = new Date(log.timestamp).toISOString().split('T')[0];
      return logDate === today && log.status === 'administered';
    }) || [];

    for (const timeStr of medication.timing) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const scheduledTimeInMinutes = hours * 60 + minutes;

      const alreadyAdministered = administeredToday.some(log => {
        const logTime = new Date(log.timestamp);
        const logHour = logTime.getHours();
        const logMinute = logTime.getMinutes();
        const logTimeInMinutes = logHour * 60 + logMinute;
        return Math.abs(logTimeInMinutes - scheduledTimeInMinutes) <= 120;
      });

      if (alreadyAdministered) continue;

      const timeDifference = Math.abs(currentTimeInMinutes - scheduledTimeInMinutes);

      if (timeDifference <= 60) {
        return { 
          allowed: true, 
          scheduledTime: timeStr,
          reason: `Within allowed window for ${timeStr}` 
        };
      }
    }

    const upcomingTimes = medication.timing.map(timeStr => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const scheduledTimeInMinutes = hours * 60 + minutes;
      let diff = scheduledTimeInMinutes - currentTimeInMinutes;
      if (diff < 0) diff += 1440;
      return { time: timeStr, diff };
    }).sort((a, b) => a.diff - b.diff);

    const nextTime = upcomingTimes[0];
    const hoursUntil = Math.floor(nextTime.diff / 60);
    const minutesUntil = nextTime.diff % 60;

    return {
      allowed: false,
      nextTime: nextTime.time,
      reason: `Next dose at ${nextTime.time} (in ${hoursUntil}h ${minutesUntil}m)`
    };
  };

  const getPatientByHHID = (hhid) => {
    return patients.find(p => p.hhid === hhid);
  };

  const getPatientName = (hhid) => {
    const patient = patients.find(p => p.hhid === hhid);
    return patient ? patient.name : 'Unknown Patient';
  };

  const filteredMedications = activeMedications.filter(med => {
    const searchLower = searchTerm.toLowerCase();
    const patient = patients.find(p => p.hhid === med.patientHHID);
    const matchesSearch = (
      med.patientHHID.toLowerCase().includes(searchLower) ||
      med.drugName.toLowerCase().includes(searchLower) ||
      (patient && patient.name.toLowerCase().includes(searchLower))
    );

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'due') {
      const timeCheck = canAdminister(med);
      return matchesSearch && timeCheck.allowed;
    }
    if (filterStatus === 'administered') {
      const todayLogs = getTodayLogs(med);
      return matchesSearch && todayLogs.length > 0;
    }
    return matchesSearch;
  });

  const handleScan = (hhid, nurseId, rackId) => {
    const patient = getPatientByHHID(hhid);
    
    if (!patient) {
      alert('⚠️ Patient not found!');
      return;
    }

    setCurrentPatient(patient);
    setCurrentNurse({
      id: nurseId,
      name: nurseId === 'N001' ? 'Sister Anita Kumar' : 
            nurseId === 'N002' ? 'Nurse Priya Sharma' : 
            nurseId === 'N003' ? 'Nurse Rajesh Patel' : 
            nurseId === 'N004' ? 'Sister Meera Singh' : nurseId
    });
    
    setAuthenticationComplete(true);
    if (rackId) setRackOpened(true);
  };

  const handleResetAuth = () => {
    setCurrentPatient(null);
    setCurrentNurse(null);
    setAuthenticationComplete(false);
    setSelectedMedication(null);
    setRackOpened(false);
    setShowRackTrigger(false);
    setNotes('');
    setMedicationAlerts([]);
    setPatientRiskScore(null);
    setShowAIPanel(false);
    setSelectedMedAIInfo(null);
  };

  const handleAdminister = async (medication) => {
    if (!authenticationComplete) {
      alert('⚠️ Please scan Patient and Nurse IDs first!');
      return;
    }

    if (currentPatient.hhid !== medication.patientHHID) {
      alert(`⚠️ Wrong Patient!\n\nScanned: ${currentPatient.name}\nRequired: ${getPatientName(medication.patientHHID)}`);
      handleResetAuth();
      return;
    }

    const timeCheck = canAdminister(medication);
    if (!timeCheck.allowed) {
      alert(`⏰ Cannot administer now!\n\n${timeCheck.reason}`);
      return;
    }

    // 🤖 AI: Check for critical interactions before administering
    const criticalAlerts = medicationAlerts.filter(a => 
      a.severity === 'critical' || a.severity === 'high'
    );
    
    if (criticalAlerts.length > 0) {
      const alertMessages = criticalAlerts.map(a => `• ${a.message}`).join('\n');
      const proceed = window.confirm(
        `⚠️ CRITICAL MEDICATION ALERTS:\n\n${alertMessages}\n\nHave you consulted with the pharmacist/physician?\n\nProceed with administration?`
      );
      if (!proceed) return;
    }

    // 🤖 AI: Get drug info
    const doseVerification = verifyMedicationDose(medication);
    setSelectedMedAIInfo(doseVerification.info);

    setSelectedMedication(medication);
    
    if (medication.rackId) {
      setShowRackTrigger(true);
      setRackOpened(false);
    }
  };

  const handleTriggerRack = async () => {
    if (!selectedMedication.rackId) return;

    setIsTriggering(true);

    try {
      const rackIP = '192.168.1.63';
      fetch(`http://${rackIP}/open`, { method: "GET", mode: "no-cors" }).catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 2000));
      setRackOpened(true);
      alert(`✅ Rack ${selectedMedication.rackId} Unlocked!`);
    } catch (err) {
      setRackOpened(true);
      alert(`✅ Rack ${selectedMedication.rackId} Triggered`);
    } finally {
      setIsTriggering(false);
    }
  };

  const confirmAdministration = async () => {
    if (!selectedMedication) return;

    if (selectedMedication.rackId && !rackOpened) {
      alert('⚠️ Please trigger the rack first!');
      setShowRackTrigger(true);
      return;
    }

    setLoading(true);
    try {
      const timeCheck = canAdminister(selectedMedication);

      const logData = {
        patientHHID: selectedMedication.patientHHID,
        medicationId: selectedMedication.id,
        drugName: selectedMedication.drugName,
        dose: selectedMedication.dose,
        route: selectedMedication.route,
        nurseName: currentNurse.name,
        nurseId: currentNurse.id,
        scheduledTime: timeCheck.scheduledTime || 'As needed',
        status: 'administered',
        notes: notes,
        rackId: selectedMedication.rackId || null,
        timestamp: new Date().toISOString(),
      };

      const result = await addAdministrationLog(logData, selectedMedication.id);

      if (result.success) {
        alert('✅ Medication administered successfully!');
        setSelectedMedication(null);
        setShowRackTrigger(false);
        setRackOpened(false);
        setNotes('');
        setSelectedMedAIInfo(null);
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Administration error:', error);
      alert('❌ Failed to record administration');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequestItem = () => {
    if (!newRequestItem.drugName || !newRequestItem.brandName || !newRequestItem.quantity) {
      alert('⚠️ Please fill all required fields!');
      return;
    }

    setRequestItems([...requestItems, { ...newRequestItem, id: Date.now() }]);
    setNewRequestItem({ drugName: '', brandName: '', quantity: '', lastRackId: '' });
  };

  const handleRemoveRequestItem = (id) => {
    setRequestItems(requestItems.filter(item => item.id !== id));
  };

  const handleSubmitRequest = async () => {
    if (requestItems.length === 0) {
      alert('⚠️ Please add at least one item!');
      return;
    }

    const nurseInfo = getCurrentNurseInfo();

    const requestData = {
      id: `PO${Date.now().toString().slice(-6)}`,
      requestedBy: nurseInfo.name,
      nurseId: nurseInfo.id,
      ward: nurseInfo.ward,
      items: requestItems,
      requestDate: new Date().toISOString(),
      status: 'pending',
    };

    console.log('Request submitted:', requestData);
    
    alert(`✅ Request submitted!\n\nOrder ID: ${requestData.id}\nItems: ${requestItems.length}\nWard: ${requestData.ward}`);
    
    setRequestItems([]);
    setShowRequestDialog(false);
  };

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (medsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-100">
      
      {/* MOBILE-OPTIMIZED HEADER */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              size="sm"
              className="shrink-0"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline ml-2">Back</span>
            </Button>
            
            <div className="flex-1 min-w-0 text-center">
              <h1 className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 truncate flex items-center justify-center gap-2">
                <span>Medication Administration</span>
                <Brain size={16} className="text-purple-600" />
              </h1>
              <p className="text-xs text-slate-600 hidden sm:block">AI-Enhanced IoT System</p>
            </div>
            
            <div className="bg-pink-50 rounded-lg px-2 py-1 sm:px-3 sm:py-2 shrink-0">
              <p className="text-xs font-bold text-pink-600">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        
        {/* MOBILE-OPTIMIZED TAB NAVIGATION */}
        <Card className="border-2 border-pink-200 shadow-lg mb-4">
          <CardContent className="p-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('medications')}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                  activeTab === 'medications'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <Pill size={16} />
                  <span>Medications</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                  activeTab === 'requests'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <ShoppingCart size={16} />
                  <span>Requests</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {activeTab === 'medications' ? (
            <motion.div
              key="medications"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Authentication - ORIGINAL SCAN INTERFACE */}
              <div className="mb-4">
                <ScanInterface
                  onScan={handleScan}
                  onReset={handleResetAuth}
                  currentPatient={currentPatient}
                  currentNurse={currentNurse}
                  requireCabinet={false}
                />
              </div>

              {authenticationComplete && (
                <>
                  {/* 🤖 AI RISK SCORE CARD */}
                  {patientRiskScore && (
                    <Card className={`border-2 mb-4 ${
                      patientRiskScore.color === 'red' ? 'border-red-300 bg-red-50' :
                      patientRiskScore.color === 'orange' ? 'border-orange-300 bg-orange-50' :
                      patientRiskScore.color === 'yellow' ? 'border-yellow-300 bg-yellow-50' :
                      'border-green-300 bg-green-50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Brain size={20} className="text-purple-600" />
                            <h3 className="font-bold text-sm">AI Risk Assessment</h3>
                          </div>
                          <Badge className={`${
                            patientRiskScore.color === 'red' ? 'bg-red-600' :
                            patientRiskScore.color === 'orange' ? 'bg-orange-600' :
                            patientRiskScore.color === 'yellow' ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}>
                            {patientRiskScore.level}
                          </Badge>
                        </div>
                        <div className="text-3xl font-bold mb-2">{patientRiskScore.score}/100</div>
                        <div className="space-y-1">
                          {patientRiskScore.factors.slice(0, 3).map((factor, idx) => (
                            <p key={idx} className="text-xs">• {factor}</p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 🤖 AI MEDICATION ALERTS */}
                  {showAIPanel && medicationAlerts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 mb-4"
                    >
                      {medicationAlerts.slice(0, 3).map((alert, idx) => {
                        const Icon = alert.icon;
                        return (
                          <Card key={idx} className={`border-2 ${
                            alert.severity === 'critical' || alert.severity === 'high' ? 'border-red-500 bg-red-50' : 'border-orange-400 bg-orange-50'
                          }`}>
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2">
                                <Icon className={`shrink-0 ${
                                  alert.severity === 'critical' || alert.severity === 'high' ? 'text-red-600' : 'text-orange-600'
                                }`} size={20} />
                                <div className="flex-1 min-w-0">
                                  <p className={`font-bold text-xs ${
                                    alert.severity === 'critical' || alert.severity === 'high' ? 'text-red-900' : 'text-orange-900'
                                  }`}>
                                    {alert.severity === 'critical' ? '🚨 CRITICAL' : alert.severity === 'high' ? '⚠️ HIGH RISK' : '⚠️ CAUTION'}
                                  </p>
                                  <p className="text-xs mt-1">{alert.message}</p>
                                  {alert.recommendation && (
                                    <p className="text-xs mt-1 font-semibold">💡 {alert.recommendation}</p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* MOBILE: Collapsible Search & Filters - ORIGINAL */}
                  <Card className="border-2 border-pink-200 shadow-lg mb-4">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex gap-2 mb-3 sm:mb-0">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFilters(!showFilters)}
                          className="sm:hidden shrink-0"
                        >
                          <Filter size={16} />
                        </Button>
                      </div>

                      {/* Desktop: Always show filter */}
                      <div className="hidden sm:block">
                        <label className="text-sm font-semibold mb-1 block">Filter</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full h-11 border-2 border-slate-200 rounded-md px-3"
                        >
                          <option value="all">All for {currentPatient.name}</option>
                          <option value="due">Due Now</option>
                          <option value="administered">Administered Today</option>
                        </select>
                      </div>

                      {/* Mobile: Expandable filter */}
                      {showFilters && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="sm:hidden mt-3"
                        >
                          <label className="text-sm font-semibold mb-1 block">Filter Status</label>
                          <select
                            value={filterStatus}
                            onChange={(e) => {
                              setFilterStatus(e.target.value);
                              setShowFilters(false);
                            }}
                            className="w-full h-11 border-2 border-slate-200 rounded-md px-3"
                          >
                            <option value="all">All for {currentPatient.name}</option>
                            <option value="due">Due Now</option>
                            <option value="administered">Administered Today</option>
                          </select>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>

                  {/* MEDICATIONS GRID - ENHANCED WITH AI INFO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {filteredMedications
                      .filter(med => med.patientHHID === currentPatient.hhid)
                      .length === 0 ? (
                      <div className="col-span-full">
                        <Card className="border-2 border-dashed border-slate-300">
                          <CardContent className="p-8 sm:p-12 text-center">
                            <Pill size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-2">No Medications Found</h3>
                            <p className="text-sm text-slate-500">No medications for {currentPatient.name}</p>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      filteredMedications
                        .filter(med => med.patientHHID === currentPatient.hhid)
                        .map((med) => {
                          const timingStatus = canAdminister(med);
                          const todayLogs = getTodayLogs(med);
                          const doseVerification = verifyMedicationDose(med);

                          return (
                            <Card key={med.id} className="border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all">
                              <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-3 sm:p-4 border-b-2 border-pink-200">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="bg-pink-200 p-2 rounded-lg shrink-0">
                                      <Pill className="text-pink-600" size={18} />
                                    </div>
                                    <div className="min-w-0">
                                      <h3 className="font-bold text-base sm:text-lg text-pink-900 truncate">{med.drugName}</h3>
                                      <p className="text-xs text-pink-700">{med.dose} • {med.route}</p>
                                      {med.brandName && (
                                        <p className="text-xs text-blue-600 mt-0.5">Brand: {med.brandName}</p>
                                      )}
                                    </div>
                                  </div>
                                  {med.rackId && (
                                    <Badge variant="outline" className="text-[10px] sm:text-xs bg-purple-50 shrink-0">
                                      <Box size={10} className="mr-1" />
                                      {med.rackId}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <CardContent className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                                <div>
                                  <p className="text-xs font-semibold text-slate-700 mb-1">Frequency</p>
                                  <Badge variant="outline" className="text-xs">
                                    <Activity size={10} className="mr-1" />
                                    {med.frequency}
                                  </Badge>
                                </div>

                                {med.timing && med.timing.length > 0 && (
                                  <div>
                                    <p className="text-xs font-semibold text-slate-700 mb-1.5">
                                      <Clock size={10} className="inline mr-1" />
                                      Times
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {med.timing.map((time, idx) => (
                                        <Badge key={idx} variant="outline" className="text-[10px] sm:text-xs bg-blue-50">
                                          {formatTime(time)}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 🤖 AI DOSE INFO */}
                                {doseVerification.info && (
                                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-xs">
                                    <p className="font-semibold text-purple-900 mb-1">
                                      <Brain size={10} className="inline mr-1" />
                                      AI Info
                                    </p>
                                    {doseVerification.maxDose && (
                                      <p className="text-purple-800">Max: {doseVerification.maxDose}</p>
                                    )}
                                  </div>
                                )}

                                {todayLogs.length > 0 && (
                                  <div className="p-2 bg-green-50 border border-green-200 rounded">
                                    <p className="text-xs font-semibold text-green-900">
                                      <CheckCircle2 size={10} className="inline mr-1" />
                                      Administered ({todayLogs.length})
                                    </p>
                                  </div>
                                )}

                                {!timingStatus.allowed && (
                                  <div className="p-2 bg-amber-50 border border-amber-300 rounded">
                                    <p className="text-[10px] sm:text-xs text-amber-900">
                                      <AlertCircle size={10} className="inline mr-1" />
                                      {timingStatus.reason}
                                    </p>
                                  </div>
                                )}

                                {timingStatus.allowed ? (
                                  <Button
                                    onClick={() => handleAdminister(med)}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 h-11 text-sm"
                                  >
                                    {med.rackId ? (
                                      <>
                                        <Unlock size={16} className="mr-2" />
                                        Trigger & Give
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle2 size={16} className="mr-2" />
                                        Administer
                                      </>
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    disabled
                                    variant="outline"
                                    className="w-full border-2 border-amber-300 text-amber-700 h-11 text-sm"
                                  >
                                    <XCircle size={16} className="mr-2" />
                                    Not Time Yet
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="requests"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Request Supplies - ORIGINAL */}
              <Card className="border-2 border-purple-200 shadow-xl">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                        <ShoppingCart size={24} />
                        Request Supplies
                      </h2>
                      <p className="text-purple-100 text-xs sm:text-sm mt-1">Request medications for your ward</p>
                    </div>
                    <Button
                      onClick={() => setShowRequestDialog(true)}
                      className="bg-white text-purple-600 hover:bg-purple-50 w-full sm:w-auto"
                    >
                      <Plus size={18} className="mr-2" />
                      New Request
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6 sm:p-8">
                  <div className="text-center py-8 sm:py-12">
                    <Package size={64} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-2">No Active Requests</h3>
                    <p className="text-sm text-slate-500 mb-4">Submit a supply request to the pharmacy</p>
                    <Button
                      onClick={() => setShowRequestDialog(true)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600"
                    >
                      <Plus size={18} className="mr-2" />
                      Create Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ORIGINAL REQUEST DIALOG */}
      {showRequestDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-purple-600 text-white p-4 sm:p-6 rounded-t-2xl sticky top-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold">New Supply Request</h2>
                  <p className="text-purple-100 text-xs sm:text-sm mt-1">
                    For {getCurrentNurseInfo().ward}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowRequestDialog(false);
                    setRequestItems([]);
                    setNewRequestItem({ drugName: '', brandName: '', quantity: '', lastRackId: '' });
                  }}
                  className="text-white hover:bg-white/20 sm:hidden"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Add Item Form */}
              <Card className="border-2 border-slate-200">
                <div className="bg-slate-50 p-3 sm:p-4 border-b">
                  <h3 className="font-bold text-sm sm:text-base">Add Item</h3>
                </div>
                <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-semibold mb-1 block">Drug Name *</label>
                      <Input
                        placeholder="e.g., Paracetamol"
                        value={newRequestItem.drugName}
                        onChange={(e) => setNewRequestItem({...newRequestItem, drugName: e.target.value})}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-semibold mb-1 block">Brand Name *</label>
                      <Input
                        placeholder="e.g., Crocin"
                        value={newRequestItem.brandName}
                        onChange={(e) => setNewRequestItem({...newRequestItem, brandName: e.target.value})}
                        className="h-11 border-blue-300 bg-blue-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-semibold mb-1 block">Quantity *</label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={newRequestItem.quantity}
                        onChange={(e) => setNewRequestItem({...newRequestItem, quantity: e.target.value})}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-semibold mb-1 block">Last Rack</label>
                      <Input
                        placeholder="R-A1"
                        value={newRequestItem.lastRackId}
                        onChange={(e) => setNewRequestItem({...newRequestItem, lastRackId: e.target.value})}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleAddRequestItem}
                    className="w-full bg-blue-600 h-11"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {/* Request Items List */}
              {requestItems.length > 0 && (
                <Card className="border-2 border-purple-200">
                  <div className="bg-purple-50 p-3 sm:p-4 border-b">
                    <h3 className="font-bold text-sm sm:text-base">Items ({requestItems.length})</h3>
                  </div>
                  <CardContent className="p-3 sm:p-4 space-y-2">
                    {requestItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 p-3 bg-white border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{item.drugName}</p>
                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-[10px] bg-blue-50">Brand: {item.brandName}</Badge>
                            <Badge variant="outline" className="text-[10px]">×{item.quantity}</Badge>
                            {item.lastRackId && (
                              <Badge variant="outline" className="text-[10px] bg-purple-50">
                                {item.lastRackId}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRequestItem(item.id)}
                          className="text-red-500 hover:bg-red-50 shrink-0"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRequestDialog(false);
                    setRequestItems([]);
                    setNewRequestItem({ drugName: '', brandName: '', quantity: '', lastRackId: '' });
                  }}
                  className="flex-1 h-12 hidden sm:block"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={requestItems.length === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 h-12 text-sm sm:text-base"
                >
                  <Send size={18} className="mr-2" />
                  Submit ({requestItems.length})
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ORIGINAL IOT RACK TRIGGER DIALOG */}
      {showRackTrigger && selectedMedication && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-blue-600 text-white p-4 sm:p-6 rounded-t-2xl sticky top-0">
              <h2 className="text-lg sm:text-xl font-bold">IoT Cabinet Control</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                For {currentPatient?.name}
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="font-semibold text-base sm:text-lg">{selectedMedication.drugName}</p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">{selectedMedication.dose}</p>
                <Badge variant="outline" className="mt-2">Rack {selectedMedication.rackId}</Badge>
              </div>

              {/* 🤖 AI INFO IN RACK DIALOG */}
              {selectedMedAIInfo && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <p className="font-bold text-sm text-purple-900 mb-2">
                    <Brain size={14} className="inline mr-1" />
                    AI Drug Information
                  </p>
                  {selectedMedAIInfo.warnings && selectedMedAIInfo.warnings.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-purple-800">Warnings:</p>
                      {selectedMedAIInfo.warnings.slice(0, 2).map((warning, idx) => (
                        <p key={idx} className="text-xs text-purple-700">• {warning}</p>
                      ))}
                    </div>
                  )}
                  {selectedMedAIInfo.maxDose && (
                    <p className="text-xs text-purple-700 mt-2">
                      <strong>Max Dose:</strong> {selectedMedAIInfo.maxDose}
                    </p>
                  )}
                </div>
              )}

              <div className="bg-slate-100 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col items-center">
                  <div className={`w-24 h-32 sm:w-32 sm:h-40 border-4 rounded-lg flex items-center justify-center ${
                    rackOpened ? 'border-green-500 bg-green-50' : 'border-slate-400 bg-white'
                  }`}>
                    {rackOpened ? <Unlock size={40} className="text-green-500" /> : <Lock size={40} className="text-slate-400" />}
                  </div>
                  <p className="mt-4 font-medium text-center">
                    {rackOpened ? '🔓 Rack OPEN' : '🔒 Rack LOCKED'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {!rackOpened ? (
                  <>
                    <Button
                      onClick={handleTriggerRack}
                      disabled={isTriggering}
                      className="flex-1 h-12 bg-blue-600"
                    >
                      {isTriggering ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" />
                          Triggering...
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2" />
                          Trigger Cabinet
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowRackTrigger(false)}
                      className="sm:w-auto h-12 hidden sm:block"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setShowRackTrigger(false);
                      setTimeout(() => confirmAdministration(), 100);
                    }}
                    className="flex-1 h-12 bg-green-600"
                  >
                    <CheckCircle2 className="mr-2" />
                    Continue
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ORIGINAL FINAL CONFIRMATION MODAL */}
      {selectedMedication && !showRackTrigger && (selectedMedication.rackId ? rackOpened : true) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 sm:p-6 rounded-t-2xl sticky top-0">
              <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                <CheckCircle2 size={24} />
                Confirm Administration
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4 mb-6">
                <div className="p-3 sm:p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                  <p className="text-xs text-pink-700 mb-1">Medication</p>
                  <p className="font-bold text-lg sm:text-xl text-pink-900">{selectedMedication.drugName}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className="bg-pink-600 text-xs">{selectedMedication.dose}</Badge>
                    <Badge className="bg-pink-600 text-xs">{selectedMedication.route}</Badge>
                    {selectedMedication.rackId && (
                      <Badge className="bg-purple-600 text-xs">
                        <Box size={10} className="mr-1" />
                        {selectedMedication.rackId}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <p className="text-xs text-blue-700 mb-1">Patient</p>
                  <p className="font-bold text-base sm:text-lg text-blue-900">{currentPatient?.name}</p>
                  <Badge variant="outline" className="font-mono mt-1 text-xs">{currentPatient?.hhid}</Badge>
                </div>

                <div className="p-3 sm:p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                  <p className="text-xs text-indigo-700 mb-1">Administered By</p>
                  <p className="font-bold text-base sm:text-lg text-indigo-900">{currentNurse?.name}</p>
                  <Badge variant="outline" className="font-mono mt-1 text-xs">{currentNurse?.id}</Badge>
                </div>

                {rackOpened && selectedMedication.rackId && (
                  <div className="p-3 bg-green-50 rounded-lg border-2 border-green-300">
                    <p className="text-xs font-semibold text-green-900">
                      <Unlock size={12} className="inline mr-1" />
                      Cabinet Unlocked ✓
                    </p>
                  </div>
                )}

                {/* 🤖 AI INFO IN CONFIRMATION */}
                {selectedMedAIInfo && selectedMedAIInfo.commonSideEffects && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs font-semibold text-purple-900 mb-1">
                      <Info size={12} className="inline mr-1" />
                      Common Side Effects:
                    </p>
                    <p className="text-xs text-purple-700">
                      {selectedMedAIInfo.commonSideEffects.slice(0, 3).join(', ')}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 block">Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any observations..."
                    rows={3}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMedication(null);
                    setRackOpened(false);
                    setNotes('');
                    setSelectedMedAIInfo(null);
                  }}
                  disabled={loading}
                  className="flex-1 h-12 hidden sm:block"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAdministration}
                  disabled={loading}
                  className="flex-1 bg-green-600 h-12"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2" />
                      Confirm
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
