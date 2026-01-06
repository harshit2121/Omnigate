import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { 
  Search, FileText, User, Calendar, Pill, Activity, Clock, 
  ArrowLeft, AlertCircle, CheckCircle2, XCircle, Stethoscope, 
  Edit2, Save, X as CloseIcon, Plus, Trash2, ChevronRight,
  Brain, TrendingUp, AlertTriangle, Download, Printer, Share2,
  History, FileCheck, Sparkles, Target, MessageSquare, Bot,
  BarChart3, Eye, EyeOff, RefreshCw, Zap, Shield, Menu
} from 'lucide-react';
import { usePatients, useMedications, useAdministrationLogs } from '../hooks/useFirebaseData';
import { updatePatient } from '../services/firebasePatients';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { labTestTemplates, labTestCategories } from '../data/labTestTemplates';

export default function PatientRecords() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLabTests, setEditLabTests] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Mobile: Sidebar toggle
  const [showPatientList, setShowPatientList] = useState(false);

  // Test Selector States
  const [showTestSelector, setShowTestSelector] = useState(false);
  const [testFilterCategory, setTestFilterCategory] = useState('all');

  // AI Features States
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Advanced Features States
  const [selectedTab, setSelectedTab] = useState('overview');

  const { patients, loading: patientsLoading } = usePatients();
  const { medications } = useMedications();
  const { logs } = useAdministrationLogs();

  const filteredPatients = patients.filter(p =>
    p.hhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPatientMedications = (hhid) => {
    return medications.filter(m => m.patientHHID === hhid);
  };

  const getPatientLogs = (hhid) => {
    return logs
      .filter(l => l.patientHHID === hhid)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // AI Analysis Functions
  const calculateRiskScore = (patient, meds, labs) => {
    let score = 0;
    if (patient.status === 'critical') score += 40;
    if (patient.age > 65) score += 20;
    if (meds.length > 5) score += 15;
    if (patient.allergies) score += 10;
    
    labs.forEach(test => {
      test.parameters?.forEach(param => {
        if (param.value) {
          const val = parseFloat(param.value);
          if (val < param.range.min || val > param.range.max) score += 5;
        }
      });
    });
    
    return Math.min(score, 100);
  };

  const generateAlerts = (patient, meds, labs) => {
    const alerts = [];
    
    if (patient.status === 'critical') {
      alerts.push({
        severity: 'high',
        type: 'Patient Status',
        message: 'Patient in critical condition - requires immediate attention',
        icon: AlertTriangle,
        color: 'text-red-600'
      });
    }
    
    if (patient.allergies) {
      alerts.push({
        severity: 'high',
        type: 'Allergies',
        message: `Active allergies: ${patient.allergies}`,
        icon: AlertCircle,
        color: 'text-orange-600'
      });
    }
    
    if (meds.length > 5) {
      alerts.push({
        severity: 'medium',
        type: 'Polypharmacy',
        message: `Patient on ${meds.length} medications - monitor for interactions`,
        icon: Pill,
        color: 'text-yellow-600'
      });
    }
    
    return alerts;
  };

  const generateRecommendations = (patient, meds, labs) => {
    const recommendations = [];
    
    if (meds.length > 5) {
      recommendations.push({
        category: 'Medication Management',
        priority: 'High',
        suggestion: 'Consider medication reconciliation to reduce polypharmacy risk',
        action: 'Schedule pharmacist review'
      });
    }
    
    if (patient.age > 50) {
      recommendations.push({
        category: 'Preventive Care',
        priority: 'Medium',
        suggestion: 'Annual cardiac and metabolic screening recommended',
        action: 'Schedule ECG and lipid profile'
      });
    }
    
    return recommendations;
  };

  const checkDrugInteractions = (meds) => {
    return [];
  };

  const calculateAdherence = (meds, logs) => {
    if (meds.length === 0) return 100;
    
    const activeMeds = meds.filter(m => m.status === 'active');
    const recentLogs = logs.filter(l => {
      const logDate = new Date(l.timestamp);
      const daysDiff = (new Date() - logDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    const expectedDoses = activeMeds.length * 7 * 2;
    const actualDoses = recentLogs.length;
    const adherence = Math.min((actualDoses / expectedDoses) * 100, 100);
    return Math.round(adherence);
  };

  const predictOutcome = (patient, labs) => {
    const predictions = {
      recoveryLikelihood: 'Good',
      estimatedStay: '5-7 days',
      complications: 'Low risk',
      confidenceScore: 85
    };

    if (patient.status === 'critical') {
      predictions.recoveryLikelihood = 'Guarded';
      predictions.estimatedStay = '10-14 days';
      predictions.complications = 'Moderate risk';
      predictions.confidenceScore = 70;
    }

    return predictions;
  };

  const generateSummary = (patient, meds, labs) => {
    return `${patient.name}, ${patient.age}Y ${patient.gender}, currently ${patient.status} with ${meds.filter(m => m.status === 'active').length} active medications. Recent laboratory findings show ${labs.length} test(s) on record. Primary diagnosis: ${patient.diagnosis || 'Not specified'}.`;
  };

  const generateAIInsights = () => {
    setIsGeneratingAI(true);
    
    setTimeout(() => {
      const patientMeds = getPatientMedications(selectedPatient.hhid);
      const patientLogs = getPatientLogs(selectedPatient.hhid);
      const labTests = selectedPatient.labTests || [];

      const insights = {
        riskScore: calculateRiskScore(selectedPatient, patientMeds, labTests),
        alerts: generateAlerts(selectedPatient, patientMeds, labTests),
        recommendations: generateRecommendations(selectedPatient, patientMeds, labTests),
        drugInteractions: checkDrugInteractions(patientMeds),
        adherenceScore: calculateAdherence(patientMeds, patientLogs),
        predictedOutcome: predictOutcome(selectedPatient, labTests),
        summary: generateSummary(selectedPatient, patientMeds, labTests),
      };

      setAiInsights(insights);
      setIsGeneratingAI(false);
      setShowAIInsights(true);
    }, 2000);
  };

  const handleAIChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      type: 'user',
      text: chatInput,
      timestamp: new Date().toISOString()
    };

    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');

    setTimeout(() => {
      const aiResponse = generateAIResponse(chatInput, selectedPatient);
      setChatMessages(prev => [...prev, {
        type: 'ai',
        text: aiResponse,
        timestamp: new Date().toISOString()
      }]);
    }, 1000);
  };

  const generateAIResponse = (question, patient) => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('allergy') || lowerQ.includes('allergies')) {
      return patient.allergies 
        ? `Patient has documented allergies: ${patient.allergies}. Please avoid these medications.`
        : 'No documented allergies on record.';
    }
    
    if (lowerQ.includes('medication') || lowerQ.includes('drug')) {
      const meds = getPatientMedications(patient.hhid);
      return `Patient is currently on ${meds.length} medications: ${meds.map(m => m.drugName).join(', ')}.`;
    }
    
    if (lowerQ.includes('risk') || lowerQ.includes('score')) {
      const risk = calculateRiskScore(patient, getPatientMedications(patient.hhid), patient.labTests || []);
      return `Patient risk score is ${risk}/100. ${risk > 70 ? 'High risk - requires close monitoring.' : risk > 40 ? 'Moderate risk - standard monitoring.' : 'Low risk - routine care.'}`;
    }

    return `Based on ${patient.name}'s record, I recommend reviewing the AI Insights panel for comprehensive analysis.`;
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowAIInsights(false);
    setAiInsights(null);
    setChatMessages([]);
    setShowPatientList(false);
  };

  // ✅ EDIT HANDLERS
  const handleEditClick = () => {
    setEditForm({
      name: selectedPatient.name,
      age: selectedPatient.age,
      gender: selectedPatient.gender,
      weight: selectedPatient.weight,
      height: selectedPatient.height,
      ward: selectedPatient.ward,
      bed: selectedPatient.bed,
      status: selectedPatient.status,
      diagnosis: selectedPatient.diagnosis || '',
      provisionalDiagnosis: selectedPatient.provisionalDiagnosis || '',
      allergies: selectedPatient.allergies || '',
      chiefComplaints: selectedPatient.chiefComplaints || '',
      historyOfIllness: selectedPatient.historyOfIllness || '',
      pastMedicalHistory: selectedPatient.pastMedicalHistory || '',
      familyHistory: selectedPatient.familyHistory || '',
      admissionDate: selectedPatient.admissionDate || '',
      dischargeDate: selectedPatient.dischargeDate || '',
    });

    setEditLabTests(selectedPatient.labTests && selectedPatient.labTests.length > 0 
      ? JSON.parse(JSON.stringify(selectedPatient.labTests))
      : []
    );

    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleAddLabTest = () => {
    setShowTestSelector(true);
  };

  const handleSelectTestTemplate = (template) => {
    const newTest = {
      type: template.name,
      date: new Date().toISOString().split('T')[0],
      parameters: template.parameters.map(param => ({
        name: param.name,
        value: '',
        unit: param.unit,
        range: { 
          min: param.range.min, 
          max: param.range.max 
        }
      }))
    };
    
    setEditLabTests([...editLabTests, newTest]);
    setShowTestSelector(false);
  };

  const filteredTestTemplates = testFilterCategory === 'all'
    ? labTestTemplates
    : labTestTemplates.filter(test => test.category === testFilterCategory);

  const handleRemoveLabTest = (testIdx) => {
    setEditLabTests(editLabTests.filter((_, idx) => idx !== testIdx));
  };

  const handleLabTestTypeChange = (testIdx, value) => {
    const updated = [...editLabTests];
    updated[testIdx].type = value;
    setEditLabTests(updated);
  };

  const handleLabTestDateChange = (testIdx, value) => {
    const updated = [...editLabTests];
    updated[testIdx].date = value;
    setEditLabTests(updated);
  };

  const handleParameterChange = (testIdx, paramIdx, field, value) => {
    const updated = [...editLabTests];
    if (field === 'min' || field === 'max') {
      updated[testIdx].parameters[paramIdx].range[field] = parseFloat(value) || 0;
    } else {
      updated[testIdx].parameters[paramIdx][field] = value;
    }
    setEditLabTests(updated);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const result = await updatePatient(
        selectedPatient.id, 
        editForm, 
        editLabTests,
        'Admin User'
      );
      
      if (result.success) {
        alert('✅ Patient details updated successfully!');
        setIsEditModalOpen(false);
        const updatedPatient = { 
          ...selectedPatient, 
          ...editForm,
          labTests: editLabTests
        };
        setSelectedPatient(updatedPatient);
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('❌ Failed to update patient. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (patientsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
          </div>
          <p className="text-slate-700 font-bold text-base sm:text-lg mb-2">Loading Patient Records</p>
          <p className="text-slate-500 text-xs sm:text-sm">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      
      {/* TOP BAR */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                size="sm"
                className="shrink-0"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline ml-2">Back</span>
              </Button>
              
              {selectedPatient && (
                <Button
                  variant="outline"
                  onClick={() => setShowPatientList(!showPatientList)}
                  size="sm"
                  className="lg:hidden shrink-0"
                >
                  <Menu size={16} />
                </Button>
              )}
            </div>

            <div className="flex-1 min-w-0 text-center lg:text-left">
              <h1 className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 truncate">
                Patient Records
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">AI-Powered EMR System</p>
            </div>

            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-xs px-2 py-1">
                <Shield size={12} className="mr-1" />
                HIPAA
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-xs px-2 py-1">
                <Brain size={12} className="mr-1" />
                AI
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE PATIENT LIST OVERLAY */}
      <AnimatePresence>
        {showPatientList && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPatientList(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto lg:hidden"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold">Patient Directory</h2>
                  <p className="text-xs text-blue-100">{filteredPatients.length} patients</p>
                </div>
                <button onClick={() => setShowPatientList(false)} className="p-2 hover:bg-white/20 rounded-lg">
                  <CloseIcon size={20} />
                </button>
              </div>
              
              <div className="p-3">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>

                <div className="space-y-2">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.hhid}
                      onClick={() => handlePatientSelect(patient)}
                      className={`p-3 rounded-xl cursor-pointer border-2 ${
                        selectedPatient?.hhid === patient.hhid
                          ? 'bg-blue-50 border-blue-500'
                          : 'bg-white border-slate-200 active:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          selectedPatient?.hhid === patient.hhid 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {patient.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{patient.name}</p>
                          <p className="text-xs text-slate-600 font-mono">{patient.hhid}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{patient.age}Y • {patient.sex}</span>
                        <Badge variant={patient.status === 'critical' ? 'destructive' : 'default'} className="text-[10px]">
                          {patient.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="p-3 sm:p-6 max-w-[1600px] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* DESKTOP SIDEBAR */}
          <div className="hidden lg:block lg:col-span-3">
            <Card className="border-2 border-blue-200 shadow-xl sticky top-24">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Search size={18} />
                  Patient Directory
                </h2>
                <p className="text-xs text-blue-100 mt-1">{filteredPatients.length} patients</p>
              </div>
              <CardContent className="p-3">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>

                <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.hhid}
                      onClick={() => handlePatientSelect(patient)}
                      className={`p-3 rounded-xl cursor-pointer border-2 ${
                        selectedPatient?.hhid === patient.hhid
                          ? 'bg-blue-50 border-blue-500'
                          : 'bg-white border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          selectedPatient?.hhid === patient.hhid 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {patient.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{patient.name}</p>
                          <p className="text-xs text-slate-600 font-mono">{patient.hhid}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{patient.age}Y • {patient.sex}</span>
                        <Badge variant={patient.status === 'critical' ? 'destructive' : 'default'} className="text-[10px]">
                          {patient.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-9">
            {!selectedPatient ? (
              <Card className="border-2 border-dashed border-slate-300 shadow-xl">
                <CardContent className="p-12 sm:p-20 text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                    <FileText size={48} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">No Patient Selected</h3>
                  <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mb-4">
                    Select a patient from the directory to view their complete medical records
                  </p>
                  <Button
                    onClick={() => setShowPatientList(true)}
                    className="lg:hidden bg-blue-600 mt-4"
                  >
                    <Search size={16} className="mr-2" />
                    Select Patient
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                
                {/* QUICK ACTIONS */}
                <Card className="border-2 border-blue-200 shadow-lg">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 overflow-x-auto">
                        <Button
                          size="sm"
                          onClick={handleEditClick}
                          className="bg-blue-600 h-9 shrink-0"
                        >
                          <Edit2 size={14} className="mr-1 sm:mr-2" />
                          <span className="text-xs sm:text-sm">Edit</span>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={generateAIInsights}
                          disabled={isGeneratingAI}
                          className="border-2 border-purple-300 h-9 shrink-0"
                        >
                          {isGeneratingAI ? (
                            <>
                              <RefreshCw size={14} className="mr-1 sm:mr-2 animate-spin" />
                              <span className="text-xs sm:text-sm">Analyzing...</span>
                            </>
                          ) : (
                            <>
                              <Brain size={14} className="mr-1 sm:mr-2" />
                              <span className="text-xs sm:text-sm">AI Insights</span>
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowAIChat(!showAIChat)}
                          className="border-2 border-indigo-300 h-9 shrink-0"
                        >
                          <MessageSquare size={14} className="mr-1 sm:mr-2" />
                          <span className="text-xs sm:text-sm hidden sm:inline">AI Assistant</span>
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 justify-end sm:justify-start">
                        <Button size="sm" variant="ghost" className="h-9 shrink-0">
                          <Download size={14} className="sm:mr-2" />
                          <span className="hidden sm:inline text-xs">Export</span>
                        </Button>
                        <Button size="sm" variant="ghost" className="h-9 shrink-0">
                          <Printer size={14} className="sm:mr-2" />
                          <span className="hidden sm:inline text-xs">Print</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI INSIGHTS PANEL */}
                {showAIInsights && aiInsights && (
                  <Card className="border-2 border-purple-300 shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sm:p-4 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Brain size={20} />
                          <div>
                            <h2 className="text-base sm:text-lg font-bold">AI Clinical Insights</h2>
                            <p className="text-xs text-purple-100 hidden sm:block">Powered by ML</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowAIInsights(false)}
                          className="text-white hover:bg-white/20 h-8 w-8 p-0"
                        >
                          <CloseIcon size={16} />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3 sm:p-6">
                      {/* Risk Score */}
                      <div className="mb-4 sm:mb-6">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900">Risk Assessment</h3>
                          <Badge className={`${
                            aiInsights.riskScore > 70 ? 'bg-red-600' :
                            aiInsights.riskScore > 40 ? 'bg-yellow-600' : 'bg-green-600'
                          } text-white px-3 py-1`}>
                            {aiInsights.riskScore}/100
                          </Badge>
                        </div>
                        <div className="h-2 sm:h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              aiInsights.riskScore > 70 ? 'bg-red-600' :
                              aiInsights.riskScore > 40 ? 'bg-yellow-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${aiInsights.riskScore}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-600 mt-2">
                          {aiInsights.riskScore > 70 ? 'High risk - Requires immediate attention' :
                           aiInsights.riskScore > 40 ? 'Moderate risk - Standard monitoring' :
                           'Low risk - Routine care sufficient'}
                        </p>
                      </div>

                      {/* Alerts */}
                      {aiInsights.alerts.length > 0 && (
                        <div className="mb-4 sm:mb-6">
                          <h3 className="font-bold text-sm sm:text-base mb-2 sm:mb-3">Clinical Alerts ({aiInsights.alerts.length})</h3>
                          <div className="space-y-2">
                            {aiInsights.alerts.map((alert, idx) => (
                              <div key={idx} className={`p-2 sm:p-3 rounded-lg border-l-4 ${
                                alert.severity === 'high' ? 'bg-red-50 border-l-red-600' :
                                alert.severity === 'medium' ? 'bg-yellow-50 border-l-yellow-600' :
                                'bg-blue-50 border-l-blue-600'
                              }`}>
                                <div className="flex items-start gap-2">
                                  <alert.icon className={alert.color} size={16} />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-xs sm:text-sm">{alert.type}</p>
                                    <p className="text-xs text-slate-700 mt-0.5">{alert.message}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      {aiInsights.recommendations.length > 0 && (
                        <div className="mb-4 sm:mb-6">
                          <h3 className="font-bold text-sm sm:text-base mb-2 sm:mb-3">Recommendations ({aiInsights.recommendations.length})</h3>
                          <div className="space-y-2">
                            {aiInsights.recommendations.map((rec, idx) => (
                              <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <p className="font-semibold text-xs sm:text-sm">{rec.category}</p>
                                  <Badge className={`${
                                    rec.priority === 'High' ? 'bg-red-600' :
                                    rec.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                                  } text-white text-[10px]`}>
                                    {rec.priority}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-700 mb-2">{rec.suggestion}</p>
                                <p className="text-xs text-blue-700 font-semibold">Action: {rec.action}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Adherence & Outcome */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="text-green-600" size={16} />
                            <p className="text-xs font-semibold">Adherence</p>
                          </div>
                          <p className="text-2xl sm:text-3xl font-bold text-green-600">{aiInsights.adherenceScore}%</p>
                        </div>

                        <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="text-blue-600" size={16} />
                            <p className="text-xs font-semibold">Outlook</p>
                          </div>
                          <p className="text-base sm:text-lg font-bold text-blue-600">{aiInsights.predictedOutcome.recoveryLikelihood}</p>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 sm:p-4 border-2 border-purple-300">
                        <p className="text-xs font-semibold text-purple-900 mb-2 flex items-center gap-2">
                          <Bot size={14} />
                          AI Summary
                        </p>
                        <p className="text-xs sm:text-sm text-slate-800">{aiInsights.summary}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI CHAT */}
                {showAIChat && (
                  <Card className="border-2 border-indigo-300 shadow-2xl">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3 sm:p-4 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bot size={20} />
                          <div>
                            <h2 className="text-base font-bold">AI Assistant</h2>
                            <p className="text-xs text-indigo-100">Ask about this patient</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowAIChat(false)}
                          className="text-white hover:bg-white/20 h-8 w-8 p-0"
                        >
                          <CloseIcon size={16} />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <div className="h-60 sm:h-80 overflow-y-auto mb-3 space-y-2">
                        {chatMessages.length === 0 ? (
                          <div className="text-center py-8 text-slate-500 text-sm">
                            <Bot size={40} className="mx-auto mb-2 text-slate-300" />
                            <p>Ask me anything about {selectedPatient.name}</p>
                          </div>
                        ) : (
                          chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] p-2 sm:p-3 rounded-lg ${
                                msg.type === 'user' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-slate-100 text-slate-900'
                              }`}>
                                <p className="text-xs sm:text-sm">{msg.text}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAIChatSend()}
                          placeholder="Type your question..."
                          className="flex-1"
                        />
                        <Button onClick={handleAIChatSend} size="sm">
                          Send
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* PATIENT DETAILS CARD */}
                <Card className="border-2 border-blue-200 shadow-xl">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 sm:p-5 rounded-t-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-lg sm:text-2xl">
                          {selectedPatient.name[0]}
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-2xl font-bold">{selectedPatient.name}</h2>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-white/20 text-white font-mono text-xs">
                              {selectedPatient.hhid}
                            </Badge>
                            <span className="text-blue-100 text-xs sm:text-sm">{selectedPatient.age}Y • {selectedPatient.gender}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${
                        selectedPatient.status === 'critical' ? 'bg-red-500' :
                        selectedPatient.status === 'stable' ? 'bg-green-500' : 'bg-yellow-500'
                      } text-white px-3 py-1.5 text-xs sm:text-sm self-start sm:self-auto`}>
                        {selectedPatient.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 bg-white/10 rounded-lg p-2 sm:p-3">
                      <div>
                        <p className="text-xs text-blue-100 mb-0.5">Weight</p>
                        <p className="font-bold text-sm sm:text-lg">{selectedPatient.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-100 mb-0.5">Height</p>
                        <p className="font-bold text-sm sm:text-lg">{selectedPatient.height} cm</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-100 mb-0.5">BMI</p>
                        <p className="font-bold text-sm sm:text-lg">
                          {(selectedPatient.weight / ((selectedPatient.height / 100) ** 2)).toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-100 mb-0.5">Meds</p>
                        <p className="font-bold text-sm sm:text-lg">
                          {getPatientMedications(selectedPatient.hhid).filter(m => m.status === 'active').length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-3 sm:p-6">
                    {/* TABS */}
                    <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b-2 border-slate-200 overflow-x-auto">
                      {['overview', 'medications', 'labs', 'history'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setSelectedTab(tab)}
                          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold capitalize transition-all whitespace-nowrap ${
                            selectedTab === tab
                              ? 'text-blue-600 border-b-2 border-blue-600 -mb-[2px]'
                              : 'text-slate-600'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* TAB CONTENT */}
                    {selectedTab === 'overview' && (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                          <InfoCard label="Admission" value={
                            selectedPatient.admissionDate 
                              ? new Date(selectedPatient.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                              : 'N/A'
                          } icon={Calendar} />
                          <InfoCard label="Ward" value={`${selectedPatient.ward} • ${selectedPatient.bed}`} icon={Activity} />
                          <InfoCard label="Status" value={selectedPatient.isActive !== false ? 'Active' : 'Discharged'} icon={Activity} />
                          <InfoCard label="Days" value={
                            selectedPatient.admissionDate 
                              ? Math.floor((new Date() - new Date(selectedPatient.admissionDate)) / (1000 * 60 * 60 * 24))
                              : 'N/A'
                          } icon={Clock} />
                        </div>

                        {selectedPatient.diagnosis && (
                          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-3 sm:p-4">
                            <div className="flex items-start gap-2">
                              <Stethoscope className="text-blue-600 mt-1" size={18} />
                              <div>
                                <p className="font-bold text-xs sm:text-sm text-blue-900 mb-1">Diagnosis</p>
                                <p className="text-xs sm:text-sm text-slate-800">{selectedPatient.diagnosis}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedPatient.allergies && (
                          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 sm:p-4">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="text-red-600 mt-1" size={18} />
                              <div>
                                <p className="font-bold text-xs sm:text-sm text-red-900 mb-1">⚠️ ALLERGIES</p>
                                <p className="text-xs sm:text-sm text-red-800 font-semibold">{selectedPatient.allergies}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedTab === 'medications' && (
                      <div>
                        <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                          Prescribed Medications ({getPatientMedications(selectedPatient.hhid).length})
                        </h3>
                        
                        {getPatientMedications(selectedPatient.hhid).length === 0 ? (
                          <div className="text-center py-8 sm:py-12 bg-slate-50 rounded-lg">
                            <Pill size={40} className="mx-auto text-slate-300 mb-2 sm:mb-3" />
                            <p className="text-sm sm:text-base text-slate-600 font-semibold">No medications</p>
                          </div>
                        ) : (
                          <div className="space-y-2 sm:space-y-3">
                            {getPatientMedications(selectedPatient.hhid).map((med) => (
                              <div key={med.id} className="border-2 border-slate-200 rounded-xl p-3 sm:p-4 bg-white">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-bold text-sm sm:text-lg">{med.drugName}</h4>
                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm text-slate-600">
                                      <span className="font-semibold">{med.dose}</span>
                                      <span>•</span>
                                      <span>{med.frequency}</span>
                                      <span>•</span>
                                      <span>{med.route}</span>
                                    </div>
                                  </div>
                                  <Badge variant={med.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                    {med.status}
                                  </Badge>
                                </div>
                                {med.instructions && (
                                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded mt-2">
                                    💊 {med.instructions}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedTab === 'labs' && (
                      <div>
                        <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Laboratory Investigations</h3>
                        
                        {(!selectedPatient.labTests || selectedPatient.labTests.length === 0) ? (
                          <div className="text-center py-8 sm:py-12 bg-slate-50 rounded-lg">
                            <FileText size={40} className="mx-auto text-slate-300 mb-2 sm:mb-3" />
                            <p className="text-sm sm:text-base text-slate-600 font-semibold">No lab tests</p>
                          </div>
                        ) : (
                          <div className="space-y-3 sm:space-y-4">
                            {selectedPatient.labTests.map((test, idx) => (
                              <div key={idx} className="border-2 border-slate-200 rounded-xl p-3 sm:p-5 bg-white">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                  <h4 className="font-bold text-sm sm:text-lg">{test.type}</h4>
                                  <Badge variant="outline" className="text-xs">{test.date}</Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                                  {test.parameters.map((param, pIdx) => {
                                    const value = parseFloat(param.value);
                                    const isAbnormal = value && (value < param.range.min || value > param.range.max);
                                    
                                    return (
                                      <div key={pIdx} className={`p-2 sm:p-3 rounded-lg border-2 ${
                                        isAbnormal ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'
                                      }`}>
                                        <p className="text-xs font-semibold text-slate-600 mb-1">{param.name}</p>
                                        <div className="flex items-baseline gap-2">
                                          <p className={`text-lg sm:text-xl font-bold ${
                                            isAbnormal ? 'text-red-700' : 'text-green-700'
                                          }`}>
                                            {param.value || 'N/A'}
                                          </p>
                                          <span className="text-xs text-slate-600">{param.unit}</span>
                                          {param.value && (
                                            <span className="text-base sm:text-lg">{isAbnormal ? '⚠️' : '✓'}</span>
                                          )}
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1">
                                          Normal: {param.range.min}-{param.range.max}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedTab === 'history' && (
                      <div>
                        <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                          Administration History ({getPatientLogs(selectedPatient.hhid).length})
                        </h3>
                        
                        {getPatientLogs(selectedPatient.hhid).length === 0 ? (
                          <div className="text-center py-8 sm:py-12 bg-slate-50 rounded-lg">
                            <Activity size={40} className="mx-auto text-slate-300 mb-2 sm:mb-3" />
                            <p className="text-sm sm:text-base text-slate-600 font-semibold">No records</p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                            {getPatientLogs(selectedPatient.hhid).map((log, idx) => (
                              <div key={idx} className={`border-l-4 rounded-r-lg p-3 sm:p-4 ${
                                log.status === 'administered' 
                                  ? 'border-l-green-500 bg-green-50' 
                                  : 'border-l-red-500 bg-red-50'
                              }`}>
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-bold text-sm sm:text-base">{log.drugName}</h4>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{log.dose} • {log.route}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {log.status === 'administered' ? (
                                      <CheckCircle2 size={12} className="mr-1 text-green-600" />
                                    ) : (
                                      <XCircle size={12} className="mr-1 text-red-600" />
                                    )}
                                    {log.status}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500">
                                  <span>
                                    <Clock size={12} className="inline mr-1" />
                                    {new Date(log.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                  </span>
                                  <span>
                                    <Stethoscope size={12} className="inline mr-1" />
                                    {log.nurseName}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ EDIT MODAL - FULLY FUNCTIONAL & MOBILE OPTIMIZED */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Edit Patient Record</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-semibold mb-1 block">Name *</label>
                  <Input name="name" value={editForm.name || ''} onChange={handleEditFormChange} />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold mb-1 block">Age *</label>
                  <Input type="number" name="age" value={editForm.age || ''} onChange={handleEditFormChange} />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold mb-1 block">Gender *</label>
                  <select name="gender" value={editForm.gender || ''} onChange={handleEditFormChange} className="w-full h-10 border rounded-md px-3">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold mb-1 block">Status *</label>
                  <select name="status" value={editForm.status || ''} onChange={handleEditFormChange} className="w-full h-10 border rounded-md px-3">
                    <option value="stable">Stable</option>
                    <option value="critical">Critical</option>
                    <option value="moderate">Moderate</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold mb-1 block">Weight (kg)</label>
                  <Input type="number" name="weight" value={editForm.weight || ''} onChange={handleEditFormChange} />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold mb-1 block">Height (cm)</label>
                  <Input type="number" name="height" value={editForm.height || ''} onChange={handleEditFormChange} />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold mb-1 block">Ward</label>
                  <Input name="ward" value={editForm.ward || ''} onChange={handleEditFormChange} />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold mb-1 block">Bed</label>
                  <Input name="bed" value={editForm.bed || ''} onChange={handleEditFormChange} />
                </div>
              </div>
            </div>

            {/* Clinical Info */}
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-3">Clinical Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs sm:text-sm font-semibold mb-1 block">Diagnosis</label>
                  <Textarea name="diagnosis" value={editForm.diagnosis || ''} onChange={handleEditFormChange} rows={2} />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold mb-1 block">Allergies ⚠️</label>
                  <Input name="allergies" value={editForm.allergies || ''} onChange={handleEditFormChange} placeholder="e.g., Penicillin, Latex" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold mb-1 block">Chief Complaints</label>
                  <Textarea name="chiefComplaints" value={editForm.chiefComplaints || ''} onChange={handleEditFormChange} rows={2} />
                </div>
              </div>
            </div>

            {/* Lab Tests */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base sm:text-lg">Laboratory Tests</h3>
                <Button onClick={handleAddLabTest} size="sm" variant="outline">
                  <Plus size={14} className="mr-2" />
                  Add Test
                </Button>
              </div>

              {editLabTests.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                  <FileText size={40} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-600">No lab tests added</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {editLabTests.map((test, testIdx) => (
                    <div key={testIdx} className="border-2 border-slate-200 rounded-lg p-3 sm:p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-semibold mb-1 block">Test Type</label>
                            <Input 
                              value={test.type} 
                              onChange={(e) => handleLabTestTypeChange(testIdx, e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold mb-1 block">Date</label>
                            <Input 
                              type="date"
                              value={test.date} 
                              onChange={(e) => handleLabTestDateChange(testIdx, e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLabTest(testIdx)}
                          className="text-red-500 hover:bg-red-50 ml-2"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-700">Parameters:</p>
                        {test.parameters.map((param, paramIdx) => (
                          <div key={paramIdx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-2 bg-slate-50 rounded">
                            <div className="sm:col-span-2">
                              <Input 
                                value={param.name}
                                onChange={(e) => handleParameterChange(testIdx, paramIdx, 'name', e.target.value)}
                                placeholder="Parameter"
                                className="text-xs h-8"
                              />
                            </div>
                            <div>
                              <Input 
                                value={param.value}
                                onChange={(e) => handleParameterChange(testIdx, paramIdx, 'value', e.target.value)}
                                placeholder="Value"
                                className="text-xs h-8"
                              />
                            </div>
                            <div>
                              <Input 
                                value={param.unit}
                                onChange={(e) => handleParameterChange(testIdx, paramIdx, 'unit', e.target.value)}
                                placeholder="Unit"
                                className="text-xs h-8"
                              />
                            </div>
                            <div className="flex gap-1">
                              <Input 
                                type="number"
                                value={param.range.min}
                                onChange={(e) => handleParameterChange(testIdx, paramIdx, 'min', e.target.value)}
                                placeholder="Min"
                                className="text-xs h-8"
                              />
                              <Input 
                                type="number"
                                value={param.range.max}
                                onChange={(e) => handleParameterChange(testIdx, paramIdx, 'max', e.target.value)}
                                placeholder="Max"
                                className="text-xs h-8"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 animate-spin" size={16} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={16} />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* TEST SELECTOR MODAL */}
      <Dialog open={showTestSelector} onOpenChange={setShowTestSelector}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Lab Test Template</DialogTitle>
          </DialogHeader>

          <div className="mb-4">
            <label className="text-sm font-semibold mb-2 block">Filter by Category</label>
            <select 
              value={testFilterCategory} 
              onChange={(e) => setTestFilterCategory(e.target.value)}
              className="w-full h-10 border rounded-md px-3"
            >
              <option value="all">All Categories</option>
              {labTestCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTestTemplates.map((template, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectTestTemplate(template)}
                className="p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <h4 className="font-bold text-sm mb-1">{template.name}</h4>
                <Badge variant="outline" className="text-xs mb-2">{template.category}</Badge>
                <p className="text-xs text-slate-600">{template.parameters.length} parameters</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper Component
function InfoCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg p-2 sm:p-3">
      <div className="flex items-center gap-1 sm:gap-2 mb-1">
        <Icon size={14} className="text-blue-600" />
        <p className="text-[10px] sm:text-xs text-slate-600 font-semibold">{label}</p>
      </div>
      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{value}</p>
    </div>
  );
}
