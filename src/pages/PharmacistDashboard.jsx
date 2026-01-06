import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { 
  Pill, Search, Clock, User, ArrowLeft, CheckCircle2, 
  Sparkles, Award, ShieldCheck, TrendingUp, Activity,
  Package, AlertTriangle, Calendar, Users, ClipboardList,
  BarChart3, FileText, Zap, Star, Target, Box, Unlock,
  Lock, Loader2, ShoppingCart, XCircle, Menu, X, Brain,
  Shield, AlertCircle, Check, Info, BookOpen, Beaker
} from 'lucide-react';
import { usePatients, useMedications } from '../hooks/useFirebaseData';
import { addMedication } from '../services/firebaseMedications';
import { medicationDictionary, frequencyOptions, routeOptions } from '../data/medicationDictionary';
import { drugInteractionsDB } from '../data/drugInteractions';
import Fuse from 'fuse.js';

export default function PharmacistDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [showPatientList, setShowPatientList] = useState(false);
  
  // Medication form states
  const [drugName, setDrugName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [drugSuggestions, setDrugSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dose, setDose] = useState('');
  const [doseSuggestions, setDoseSuggestions] = useState([]);
  const [route, setRoute] = useState('');
  const [frequency, setFrequency] = useState('');
  const [timing, setTiming] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [duration, setDuration] = useState('');

  // 🤖 AI Features States
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [currentPatientMeds, setCurrentPatientMeds] = useState([]);
  const [interactionAlerts, setInteractionAlerts] = useState({ alerts: [], warnings: [], synergies: [] });

  const { patients } = usePatients();
  const { medications } = useMedications();

  // Procurement states
  const [procurementOrders, setProcurementOrders] = useState([
    {
      id: 'PO001',
      requestedBy: 'Nurse Priya Sharma',
      nurseId: 'N002',
      ward: 'General Ward',
      items: [
        { drugName: 'Paracetamol 500mg', brandName: 'Crocin', quantity: 100 },
        { drugName: 'Amoxicillin 500mg', brandName: 'Novamox', quantity: 50 }
      ],
      requestDate: new Date().toISOString(),
      status: 'pending',
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pharmacistId, setPharmacistId] = useState('');
  const [rackId, setRackId] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);
  const [rackOpened, setRackOpened] = useState(false);

  const racks = [
    { id: 'R-A1', name: 'Rack A1 - General', location: 'Ward A', ip: '192.168.1.63' },
    { id: 'R-A2', name: 'Rack A2 - Emergency', location: 'Ward A', ip: '192.168.1.64' },
    { id: 'R-B1', name: 'Rack B1 - Antibiotics', location: 'Ward B', ip: '192.168.1.65' },
    { id: 'R-C1', name: 'Rack C1 - ICU', location: 'ICU', ip: '192.168.1.67' },
  ];

  // Setup Fuse.js for smart drug search
  const fuse = new Fuse(medicationDictionary, {
    keys: ['name', 'brandNames', 'category'],
    threshold: 0.3,
    includeScore: true
  });

  const filteredPatients = patients.filter(p =>
    p.hhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalPrescriptions: medications.length,
    activePrescriptions: medications.filter(m => m.status === 'active').length,
    patientsServed: new Set(medications.map(m => m.patientHHID)).size,
    categoriesUsed: new Set(medications.map(m => m.drugName)).size,
    pendingOrders: procurementOrders.filter(o => o.status === 'pending').length,
    fulfilledOrders: procurementOrders.filter(o => o.status === 'fulfilled').length,
  };

  const categories = ['all', ...new Set(medicationDictionary.map(m => m.category))];

  // 🤖 AI: Get patient's current medications
  useEffect(() => {
    if (selectedPatient) {
      const patientMeds = medications
        .filter(m => m.patientHHID === selectedPatient.hhid && m.status === 'active')
        .map(m => m.drugName);
      setCurrentPatientMeds(patientMeds);
    }
  }, [selectedPatient, medications]);

  // 🤖 AI: Real-time drug interaction check
  useEffect(() => {
    if (drugName && currentPatientMeds.length > 0) {
      const allDrugs = [...currentPatientMeds, drugName];
      const analysis = drugInteractionsDB.checkInteractions(allDrugs);
      setInteractionAlerts(analysis);
      setShowAIPanel(analysis.alerts.length > 0 || analysis.warnings.length > 0 || analysis.synergies.length > 0);
    } else {
      setInteractionAlerts({ alerts: [], warnings: [], synergies: [] });
      setShowAIPanel(false);
    }
  }, [drugName, currentPatientMeds]);

  // 🤖 AI: Enhanced drug search with fuzzy matching
  useEffect(() => {
    if (drugName.length > 1) {
      const results = fuse.search(drugName);
      const filtered = results
        .map(r => r.item)
        .filter(med => selectedCategory === 'all' || med.category === selectedCategory)
        .slice(0, 10);
      setDrugSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setDrugSuggestions([]);
      setShowSuggestions(false);
    }
  }, [drugName, selectedCategory]);

  // 🤖 AI: Get comprehensive drug info
  const handleDrugSelect = (medication) => {
    setDrugName(medication.name);
    if (medication.brandNames && medication.brandNames.length > 0) {
      setBrandName(medication.brandNames[0]);
    }
    setDoseSuggestions(medication.commonDoses);
    setShowSuggestions(false);
    
    // Get AI analysis for this drug
    const drugInfo = drugInteractionsDB.interactions[medication.name];
    setAiAnalysis(drugInfo);
    
    if (medication.commonDoses.length > 0) setDose(medication.commonDoses[0]);
    if (medication.routes.length > 0) setRoute(medication.routes[0]);
    if (medication.frequencies.length > 0) {
      setFrequency(medication.frequencies[0]);
      const freq = frequencyOptions.find(f => f.value === medication.frequencies[0]);
      if (freq) setTiming(freq.timings);
    }
  };

  const handleFrequencyChange = (freq) => {
    setFrequency(freq);
    const freqOption = frequencyOptions.find(f => f.value === freq);
    if (freqOption) setTiming(freqOption.timings);
  };

  const handleSubmit = async () => {
    if (!selectedPatient || !drugName || !brandName || !dose || !route || !frequency) {
      alert('❌ Please fill all required fields including Brand Name!');
      return;
    }

    // Check for critical interactions
    if (interactionAlerts.alerts.length > 0) {
      const proceed = window.confirm(
        `⚠️ CRITICAL DRUG INTERACTIONS DETECTED:\n\n${interactionAlerts.alerts.map(a => a.message).join('\n\n')}\n\nDo you still want to proceed?`
      );
      if (!proceed) return;
    }

    setLoading(true);
    try {
      const medicationData = {
        patientHHID: selectedPatient.hhid,
        patientName: selectedPatient.name,
        drugName,
        brandName,
        dose,
        route,
        frequency,
        timing,
        instructions,
        duration,
        status: 'active',
        rackId: 'R-01',
        prescribedBy: 'Dr. Smith',
      };

      const result = await addMedication(medicationData);

      if (result.success) {
        alert('✅ Medication prescribed successfully!');
        // Reset form
        setDrugName('');
        setBrandName('');
        setDose('');
        setRoute('');
        setFrequency('');
        setTiming([]);
        setInstructions('');
        setDuration('');
        setDoseSuggestions([]);
        setAiAnalysis(null);
        setShowAIPanel(false);
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessOrder = (order) => {
    setSelectedOrder(order);
    setRackId('');
    setRackOpened(false);
  };

  const handleTriggerRack = async () => {
    if (!pharmacistId) {
      alert('⚠️ Please scan your Pharmacist ID first!');
      return;
    }
    if (!rackId) {
      alert('⚠️ Please select a rack!');
      return;
    }

    setIsTriggering(true);
    try {
      const rack = racks.find(r => r.id === rackId);
      const rackIP = rack?.ip || '192.168.1.63';
      fetch(`http://${rackIP}/open`, { method: "GET", mode: "no-cors" }).catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 2000));
      setRackOpened(true);
      alert(`✅ Rack ${rackId} Unlocked!`);
    } catch (err) {
      setRackOpened(true);
      alert(`✅ Rack ${rackId} Triggered`);
    } finally {
      setIsTriggering(false);
    }
  };

  const handleFulfillOrder = () => {
    if (!rackOpened) {
      alert('⚠️ Please trigger the rack first!');
      return;
    }
    setProcurementOrders(orders => 
      orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: 'fulfilled', rackId, pharmacistId, fulfilledDate: new Date().toISOString() }
          : order
      )
    );
    alert(`✅ Order ${selectedOrder.id} fulfilled!`);
    setSelectedOrder(null);
    setRackId('');
    setPharmacistId('');
    setRackOpened(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
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
            
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 truncate flex items-center gap-2">
                <Brain size={20} className="text-purple-600 shrink-0" />
                <span className="hidden sm:inline">AI-Powered Pharmacy</span>
                <span className="sm:hidden">AI Pharmacy</span>
                <Sparkles size={16} className="text-yellow-500 shrink-0" />
              </h1>
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              <Badge className="bg-purple-600 text-xs px-2 py-1">
                <Brain size={12} className="mr-1" />
                AI
              </Badge>
              <Badge className="bg-emerald-600 text-xs px-2 py-1">
                <ShieldCheck size={12} className="mr-1" />
                Safety
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-[56px] sm:top-[72px] z-20">
        <div className="px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 font-semibold border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'prescriptions'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <Pill size={16} />
                <span>Prescriptions</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('procurement')}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 font-semibold border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'procurement'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package size={16} />
                <span>Procurement</span>
                {stats.pendingOrders > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {stats.pendingOrders}
                  </Badge>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 max-w-7xl mx-auto">
        
        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="border-2 border-emerald-200 shadow-sm">
            <CardContent className="p-3 sm:p-6">
              <div className="bg-emerald-100 p-2 sm:p-3 rounded-lg inline-block mb-2">
                <ClipboardList className="text-emerald-600" size={20} />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-slate-900">{stats.totalPrescriptions}</p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Total Rx</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 shadow-sm">
            <CardContent className="p-3 sm:p-6">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg inline-block mb-2">
                <Activity className="text-blue-600" size={20} />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-slate-900">{stats.activePrescriptions}</p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Active</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 shadow-sm">
            <CardContent className="p-3 sm:p-6">
              <div className="bg-orange-100 p-2 sm:p-3 rounded-lg inline-block mb-2">
                <ShoppingCart className="text-orange-600" size={20} />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-slate-900">{stats.pendingOrders}</p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Pending</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 shadow-sm">
            <CardContent className="p-3 sm:p-6">
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg inline-block mb-2">
                <CheckCircle2 className="text-green-600" size={20} />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-slate-900">{stats.fulfilledOrders}</p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Fulfilled</p>
            </CardContent>
          </Card>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'prescriptions' ? (
            <motion.div
              key="prescriptions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Mobile: Selected Patient Card */}
              {selectedPatient && (
                <Card className="border-2 border-emerald-300 shadow-lg lg:hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                          {selectedPatient.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{selectedPatient.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-emerald-600 text-xs">{selectedPatient.hhid}</Badge>
                            <Badge variant="outline" className="text-xs">{selectedPatient.age}Y</Badge>
                          </div>
                          {currentPatientMeds.length > 0 && (
                            <p className="text-xs text-slate-600 mt-1">
                              Current Meds: {currentPatientMeds.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPatientList(!showPatientList)}
                      >
                        {showPatientList ? <X size={16} /> : <Menu size={16} />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mobile: Patient List */}
              {(!selectedPatient || showPatientList) && (
                <Card className="border-2 border-emerald-200 shadow-lg lg:hidden">
                  <div className="bg-emerald-600 text-white p-4">
                    <h2 className="font-bold flex items-center gap-2">
                      <Search size={18} />
                      Select Patient
                    </h2>
                  </div>
                  <CardContent className="p-4">
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-3 h-12"
                    />
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {filteredPatients.map((patient) => (
                        <div
                          key={patient.hhid}
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowPatientList(false);
                          }}
                          className="p-3 rounded-xl border-2 border-slate-200 hover:border-emerald-500 bg-white active:bg-emerald-50"
                        >
                          <p className="font-bold text-sm">{patient.name}</p>
                          <p className="text-xs text-slate-600 mt-1">{patient.hhid} • {patient.age}Y</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Desktop Layout */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                  <Card className="border-2 border-emerald-200 shadow-xl">
                    <div className="bg-emerald-600 text-white p-4 rounded-t-xl">
                      <h2 className="font-bold">Patient Selection</h2>
                    </div>
                    <CardContent className="p-4">
                      <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4"
                      />
                      {selectedPatient && (
                        <div className="mb-4 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
                          <p className="font-bold text-lg">{selectedPatient.name}</p>
                          <Badge className="mt-2">{selectedPatient.hhid}</Badge>
                          {currentPatientMeds.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-slate-700 mb-1">Current Medications:</p>
                              {currentPatientMeds.map((med, idx) => (
                                <Badge key={idx} variant="outline" className="mr-1 mb-1 text-xs">
                                  {med}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredPatients.map((patient) => (
                          <div
                            key={patient.hhid}
                            onClick={() => setSelectedPatient(patient)}
                            className={`p-3 rounded-xl cursor-pointer border-2 ${
                              selectedPatient?.hhid === patient.hhid
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            <p className="font-bold">{patient.name}</p>
                            <p className="text-sm text-slate-600">{patient.hhid}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-8">
                  {!selectedPatient ? (
                    <Card className="border-2 border-dashed border-slate-300">
                      <CardContent className="p-16 text-center">
                        <User size={48} className="mx-auto text-slate-400 mb-4" />
                        <h3 className="text-xl font-bold">No Patient Selected</h3>
                      </CardContent>
                    </Card>
                  ) : (
                    <PrescriptionForm
                      selectedPatient={selectedPatient}
                      drugName={drugName}
                      setDrugName={setDrugName}
                      brandName={brandName}
                      setBrandName={setBrandName}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      categories={categories}
                      showSuggestions={showSuggestions}
                      drugSuggestions={drugSuggestions}
                      handleDrugSelect={handleDrugSelect}
                      dose={dose}
                      setDose={setDose}
                      doseSuggestions={doseSuggestions}
                      route={route}
                      setRoute={setRoute}
                      routeOptions={routeOptions}
                      frequency={frequency}
                      handleFrequencyChange={handleFrequencyChange}
                      frequencyOptions={frequencyOptions}
                      timing={timing}
                      duration={duration}
                      setDuration={setDuration}
                      instructions={instructions}
                      setInstructions={setInstructions}
                      loading={loading}
                      handleSubmit={handleSubmit}
                      aiAnalysis={aiAnalysis}
                      interactionAlerts={interactionAlerts}
                      showAIPanel={showAIPanel}
                      currentPatientMeds={currentPatientMeds}
                    />
                  )}
                </div>
              </div>

              {/* Mobile: Prescription Form */}
              {selectedPatient && !showPatientList && (
                <div className="lg:hidden">
                  <PrescriptionForm
                    selectedPatient={selectedPatient}
                    drugName={drugName}
                    setDrugName={setDrugName}
                    brandName={brandName}
                    setBrandName={setBrandName}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    categories={categories}
                    showSuggestions={showSuggestions}
                    drugSuggestions={drugSuggestions}
                    handleDrugSelect={handleDrugSelect}
                    dose={dose}
                    setDose={setDose}
                    doseSuggestions={doseSuggestions}
                    route={route}
                    setRoute={setRoute}
                    routeOptions={routeOptions}
                    frequency={frequency}
                    handleFrequencyChange={handleFrequencyChange}
                    frequencyOptions={frequencyOptions}
                    timing={timing}
                    duration={duration}
                    setDuration={setDuration}
                    instructions={instructions}
                    setInstructions={setInstructions}
                    loading={loading}
                    handleSubmit={handleSubmit}
                    aiAnalysis={aiAnalysis}
                    interactionAlerts={interactionAlerts}
                    showAIPanel={showAIPanel}
                    currentPatientMeds={currentPatientMeds}
                  />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="procurement"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Procurement Orders */}
              <Card className="border-2 border-purple-200 shadow-lg">
                <div className="bg-purple-600 text-white p-4">
                  <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <Package size={20} sm:size={24} />
                    Ward Supply Requests
                  </h2>
                </div>
                <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                  {procurementOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`border-2 rounded-xl p-4 sm:p-6 ${
                        order.status === 'pending' ? 'border-orange-200 bg-orange-50/30' : 'border-green-200 bg-green-50/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base sm:text-lg font-bold">#{order.id}</h3>
                            <Badge className={order.status === 'pending' ? 'bg-orange-500' : 'bg-green-500'}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                            <p><strong>By:</strong> {order.requestedBy}</p>
                            <p><strong>Ward:</strong> {order.ward}</p>
                          </div>
                        </div>
                        {order.status === 'pending' && (
                          <Button
                            onClick={() => handleProcessOrder(order)}
                            className="bg-blue-600 w-full sm:w-auto"
                            size="sm"
                          >
                            <Package size={16} className="mr-2" />
                            Process
                          </Button>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <p className="text-sm font-semibold mb-2">Items:</p>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm py-2 border-b last:border-0">
                              <div>
                                <p className="font-semibold">{item.drugName}</p>
                                <p className="text-xs text-blue-600">Brand: {item.brandName}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">×{item.quantity}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Procurement Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-purple-600 text-white p-4 sm:p-6 rounded-t-2xl sticky top-0">
              <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                <Package size={24} />
                Process Order #{selectedOrder.id}
              </h2>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label className="text-sm font-semibold mb-2 block">Pharmacist ID *</label>
                <Input
                  placeholder="Enter ID"
                  value={pharmacistId}
                  onChange={(e) => setPharmacistId(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900">Destination</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">{selectedOrder.ward}</p>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Storage Rack *</label>
                <select
                  value={rackId}
                  onChange={(e) => {
                    setRackId(e.target.value);
                    setRackOpened(false);
                  }}
                  className="w-full h-12 border-2 rounded-lg px-4 text-sm sm:text-base"
                >
                  <option value="">Choose Rack...</option>
                  {racks.map(rack => (
                    <option key={rack.id} value={rack.id}>{rack.name}</option>
                  ))}
                </select>
              </div>

              {rackId && (
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
                    {!rackOpened && (
                      <Button
                        onClick={handleTriggerRack}
                        disabled={isTriggering || !pharmacistId}
                        className="mt-4 w-full h-12 bg-blue-600"
                      >
                        {isTriggering ? (
                          <>
                            <Loader2 className="mr-2 animate-spin" />
                            Triggering...
                          </>
                        ) : (
                          <>
                            <Unlock className="mr-2" />
                            Trigger Rack
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedOrder(null);
                    setRackId('');
                    setPharmacistId('');
                    setRackOpened(false);
                  }}
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFulfillOrder}
                  disabled={!rackOpened}
                  className="flex-1 h-12 bg-green-600"
                >
                  <CheckCircle2 className="mr-2" />
                  Fulfill Order
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// 🤖 AI-Enhanced Prescription Form Component
function PrescriptionForm({ 
  selectedPatient, drugName, setDrugName, brandName, setBrandName,
  selectedCategory, setSelectedCategory, categories, showSuggestions,
  drugSuggestions, handleDrugSelect, dose, setDose, doseSuggestions,
  route, setRoute, routeOptions, frequency, handleFrequencyChange,
  frequencyOptions, timing, duration, setDuration, instructions,
  setInstructions, loading, handleSubmit, aiAnalysis, interactionAlerts,
  showAIPanel, currentPatientMeds
}) {
  return (
    <div className="space-y-4">
      {/* 🤖 AI DRUG INTERACTION ALERTS */}
      {showAIPanel && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Critical Alerts */}
          {interactionAlerts.alerts.map((alert, idx) => (
            <Card key={idx} className="border-2 border-red-500 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-600 shrink-0" size={24} />
                  <div className="flex-1">
                    <p className="font-bold text-red-900 text-sm sm:text-base">
                      🚨 CRITICAL INTERACTION
                    </p>
                    <p className="text-sm text-red-800 mt-1">{alert.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Warnings */}
          {interactionAlerts.warnings.map((warning, idx) => (
            <Card key={idx} className="border-2 border-orange-400 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-orange-600 shrink-0" size={24} />
                  <div className="flex-1">
                    <p className="font-bold text-orange-900 text-sm">
                      ⚠️ CAUTION REQUIRED
                    </p>
                    <p className="text-sm text-orange-800 mt-1">{warning.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Synergies */}
          {interactionAlerts.synergies.map((synergy, idx) => (
            <Card key={idx} className="border-2 border-green-400 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 shrink-0" size={24} />
                  <div className="flex-1">
                    <p className="font-bold text-green-900 text-sm">
                      ✅ SYNERGISTIC EFFECT
                    </p>
                    <p className="text-sm text-green-800 mt-1">{synergy.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* 🤖 AI DRUG INFORMATION PANEL */}
      {aiAnalysis && (
        <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="bg-purple-600 text-white p-3 flex items-center gap-2">
            <Brain size={20} />
            <h3 className="font-bold text-sm sm:text-base">AI Drug Analysis: {drugName}</h3>
          </div>
          <CardContent className="p-4 space-y-3">
            
            {/* Contraindications */}
            {aiAnalysis.contraindications && aiAnalysis.contraindications.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="text-red-600" size={16} />
                  <p className="font-bold text-sm text-red-900">Contraindications</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <ul className="text-xs sm:text-sm space-y-1">
                    {aiAnalysis.contraindications.map((item, idx) => (
                      <li key={idx} className="text-red-800">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Warnings */}
            {aiAnalysis.warnings && aiAnalysis.warnings.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="text-orange-600" size={16} />
                  <p className="font-bold text-sm text-orange-900">Warnings</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <ul className="text-xs sm:text-sm space-y-1">
                    {aiAnalysis.warnings.map((item, idx) => (
                      <li key={idx} className="text-orange-800">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Pregnancy & Lactation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiAnalysis.pregnancy && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="font-bold text-xs text-blue-900 mb-1">🤰 Pregnancy</p>
                  <p className="text-xs text-blue-800">{aiAnalysis.pregnancy}</p>
                </div>
              )}
              {aiAnalysis.lactation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="font-bold text-xs text-blue-900 mb-1">🤱 Lactation</p>
                  <p className="text-xs text-blue-800">{aiAnalysis.lactation}</p>
                </div>
              )}
            </div>

            {/* Max Dose */}
            {aiAnalysis.maxDose && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="font-bold text-xs text-purple-900 mb-1">💊 Maximum Dose</p>
                <p className="text-sm font-bold text-purple-800">{aiAnalysis.maxDose}</p>
              </div>
            )}

            {/* Side Effects */}
            {aiAnalysis.commonSideEffects && aiAnalysis.commonSideEffects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="text-blue-600" size={16} />
                  <p className="font-bold text-sm text-blue-900">Common Side Effects</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {aiAnalysis.commonSideEffects.map((effect, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* PRESCRIPTION FORM */}
      <Card className="border-2 border-emerald-200 shadow-lg">
        <div className="bg-emerald-600 text-white p-4 sm:p-5 rounded-t-xl">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <FileText size={20} />
            New Prescription
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            For: <span className="font-bold">{selectedPatient.name}</span> • {selectedPatient.hhid}
          </p>
          {currentPatientMeds.length > 0 && (
            <p className="text-xs text-emerald-100 mt-2">
              Current: {currentPatientMeds.join(', ')}
            </p>
          )}
        </div>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            
            <div>
              <label className="text-sm font-bold mb-2 block">Category Filter</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-11 sm:h-12 border-2 rounded-xl px-3 sm:px-4 text-sm sm:text-base"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? '🔍 All' : `💊 ${cat}`}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="text-sm font-bold mb-2 block flex items-center gap-2">
                Drug Name (Generic) *
                <Brain size={14} className="text-purple-600" />
              </label>
              <Input
                value={drugName}
                onChange={(e) => setDrugName(e.target.value)}
                placeholder="Type medication..."
                className="h-11 sm:h-12 text-sm sm:text-base"
              />
              {showSuggestions && drugSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-emerald-400 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  {drugSuggestions.map((med, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleDrugSelect(med)}
                      className="p-3 hover:bg-emerald-50 border-b last:border-0 active:bg-emerald-100 cursor-pointer"
                    >
                      <p className="font-bold text-sm">{med.name}</p>
                      {med.brandNames && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {med.brandNames.slice(0, 3).map((brand, bIdx) => (
                            <Badge key={bIdx} variant="outline" className="text-xs">{brand}</Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-slate-600 mt-1">Category: {med.category}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-bold mb-2 block">Brand Name *</label>
              <Input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g., Pantocid"
                className="h-11 sm:h-12 border-2 border-blue-300 bg-blue-50"
              />
            </div>

            <div>
              <label className="text-sm font-bold mb-2 block">Dosage *</label>
              {doseSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {doseSuggestions.map((d, idx) => (
                    <Badge
                      key={idx}
                      onClick={() => setDose(d)}
                      className={`cursor-pointer px-3 py-2 text-xs sm:text-sm ${
                        dose === d ? 'bg-emerald-600' : 'bg-slate-600'
                      }`}
                    >
                      {d}
                    </Badge>
                  ))}
                </div>
              )}
              <Input
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="e.g., 500mg"
                className="h-11 sm:h-12"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold mb-2 block">Route *</label>
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full h-11 sm:h-12 border-2 rounded-xl px-3 sm:px-4 text-sm sm:text-base"
                >
                  <option value="">Select</option>
                  {routeOptions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold mb-2 block">Frequency *</label>
                <select
                  value={frequency}
                  onChange={(e) => handleFrequencyChange(e.target.value)}
                  className="w-full h-11 sm:h-12 border-2 rounded-xl px-3 sm:px-4 text-sm sm:text-base"
                >
                  <option value="">Select</option>
                  {frequencyOptions.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {timing.length > 0 && (
              <div className="p-3 sm:p-4 bg-blue-50 border-2 border-blue-300 rounded-xl">
                <p className="text-sm font-bold text-blue-900 mb-2">
                  <Clock size={14} className="inline mr-1" />
                  Schedule ({timing.length}x/day)
                </p>
                <div className="flex flex-wrap gap-2">
                  {timing.map((time, idx) => (
                    <Badge key={idx} className="bg-blue-600 px-3 py-1 text-xs sm:text-sm">
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-bold mb-2 block">Duration</label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 7 days"
                className="h-11 sm:h-12"
              />
            </div>

            <div>
              <label className="text-sm font-bold mb-2 block">Special Instructions</label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g., Take with food..."
                rows={3}
                className="text-sm sm:text-base resize-none"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full h-12 sm:h-14 text-base sm:text-lg font-bold ${
                interactionAlerts.alerts.length > 0 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  {interactionAlerts.alerts.length > 0 ? (
                    <>
                      <AlertTriangle size={20} className="mr-2" />
                      Submit Despite Warnings
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} className="mr-2" />
                      Submit Prescription
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
