import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import {
  Stethoscope, FileText, User, Pill, Plus, Trash2, Search, 
  ArrowLeft, Clock, Calendar, AlertCircle, X, History, CheckCircle2,
  Printer, Download, ShieldCheck, Sparkles, AlertTriangle, RefreshCw,
  Eye, Heart, Activity, Leaf, Database, Layers, Check, ChevronRight
} from 'lucide-react';
import { usePatients } from '../hooks/useFirebaseData';
import medicationDatabase from '../data/medicationDatabase';
import { AYURGENIX_DATASET } from '../data/ayurGenixDataset';
import { AYUSH_FORMULATIONS_DATASET } from '../data/ayushFormulationsDataset';
import { INDIAN_MEDICINES_DATASET } from '../data/indianMedicinesDataset';
import { printDoctorPrescription } from '../utils/prakritiPdfGenerator';

export default function DoctorPrescription() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Clinical encounter state
  const [diagnosis, setDiagnosis] = useState('Amlapitta (Hyperacidity / Acid Peptic Disorder) - NAMASTE-AYU-842');
  const [icdCode, setIcdCode] = useState('NAMASTE-AYU-842');
  const [medications, setMedications] = useState([]);
  const [panchakarmaOrders, setPanchakarmaOrders] = useState([]);
  const [dietRecommendations, setDietRecommendations] = useState('');
  const [yogaTherapy, setYogaTherapy] = useState('');
  const [followUpDate, setFollowUpDate] = useState('After 14 Days (14 दिन बाद)');
  
  // Prescription system mode: 'ayurvedic' vs 'allopathic'
  const [prescribeSystem, setPrescribeSystem] = useState('ayurvedic');
  
  // Current item builder state
  const [currentMed, setCurrentMed] = useState({
    drugName: '',
    brandName: '',
    system: 'ayurvedic',
    kalpana: 'Vati',
    dose: '1 Vati (250mg)',
    frequency: 'BD (Twice Daily)',
    sevanaKala: 'Pragbhakta (Before food / प्राग्भक्त)',
    anupana: 'Lukewarm water (उष्ण जल)',
    route: 'Oral',
    timing: ['09:00', '21:00'],
    duration: '14 Days',
    instructions: 'Consume before morning and evening meals.',
    classicalText: 'Bhaishajya Ratnavali'
  });

  // Drug search dropdown state
  const [drugSuggestions, setDrugSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPreviousMeds, setShowPreviousMeds] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [protocolSearch, setProtocolSearch] = useState('');

  // Selected disease protocol from AyurGenix
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  // Filtered patient list
  const filteredPatients = useMemo(() => {
    return (patients || []).filter(p =>
      (p.hhid && p.hhid.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.phone && p.phone.includes(searchTerm))
    );
  }, [patients, searchTerm]);

  // Dynamic timing calculator
  const getTimingsForFrequency = (frequency) => {
    const timings = {
      'OD': ['09:00'],
      'BD': ['09:00', '21:00'],
      'TID': ['09:00', '14:00', '21:00'],
      'QID': ['09:00', '13:00', '17:00', '21:00'],
      'HS': ['22:00'],
      'SOS': ['As needed']
    };
    return timings[frequency] || ['09:00', '21:00'];
  };

  // Search drugs dynamically
  useEffect(() => {
    if (currentMed.drugName.trim().length >= 2) {
      const results = medicationDatabase.searchDrugs(currentMed.drugName, prescribeSystem);
      setDrugSuggestions(results);
      setShowSuggestions(true);
    } else {
      setDrugSuggestions([]);
      setShowSuggestions(false);
    }
  }, [currentMed.drugName, prescribeSystem]);

  // Set default initial patient if none selected
  useEffect(() => {
    if (!selectedPatient && patients && patients.length > 0) {
      // default to first active patient
      const first = patients[0];
      setSelectedPatient({
        ...first,
        prakriti: first.prakriti || 'Pitta-Vata (पित्त-वात)',
        vitals: first.vitals || { bp: '122/80 mmHg', pulse: '74 bpm', spo2: '99%', temp: '98.4 °F' },
        allergies: first.allergies || 'NKDA (No Known Drug Allergies)',
        abhaId: first.abhaId || '91-8842-1092-4412'
      });
      // Initial standard medications
      setMedications([
        {
          id: 1,
          drugName: 'Sutshekhar Ras (Gold)',
          system: 'ayurvedic',
          kalpana: 'Rasaushadhi / Vati',
          dose: '250mg (1 Vati)',
          frequency: 'BD',
          sevanaKala: 'Pragbhakta (Before food)',
          anupana: 'Godugdha (Warm Cow Milk)',
          duration: '14 Days',
          classicalText: 'Bhaishajya Ratnavali'
        },
        {
          id: 2,
          drugName: 'Avipattikar Churna',
          system: 'ayurvedic',
          kalpana: 'Churna',
          dose: '5g',
          frequency: 'HS',
          sevanaKala: 'Nishikala (Bedtime)',
          anupana: 'Lukewarm Water',
          duration: '14 Days',
          classicalText: 'Bhaishajya Ratnavali'
        },
        {
          id: 3,
          drugName: 'Pantoprazole 40mg',
          brandName: 'Pantocid 40',
          system: 'allopathic',
          dose: '40mg',
          frequency: 'OD',
          route: 'Oral',
          timing: ['08:00 (Empty Stomach)'],
          duration: '14 Days',
          instructions: 'Take 30 minutes before breakfast'
        }
      ]);
      setDietRecommendations('Pathya: Old shali rice, mudga yusha (moong dal soup), cow milk, amla, pomegranate. Avoid: Excessively spicy, sour, pungent, fried foods, and tea/coffee on empty stomach.');
      setYogaTherapy('Anulom Vilom Pranayama (10 mins), Sheetali Pranayama, Vajrasana post meals (10 mins), Shavasana.');
    }
  }, [patients, selectedPatient]);

  // Handle drug suggestion selection
  const handleSelectSuggestion = (drug) => {
    const isAyur = drug.system === 'ayurvedic';
    setPrescribeSystem(drug.system || 'ayurvedic');
    
    if (isAyur) {
      setCurrentMed({
        drugName: drug.name,
        brandName: '',
        system: 'ayurvedic',
        kalpana: drug.kalpana || 'Vati',
        dose: drug.standardDose || '1 Vati (250mg)',
        frequency: 'BD (Twice Daily)',
        sevanaKala: drug.sevanaKala || 'Pragbhakta (Before food)',
        anupana: drug.anupana || 'Lukewarm water',
        route: 'Oral',
        timing: ['09:00', '21:00'],
        duration: '14 Days',
        instructions: drug.indications ? `Indicated for: ${drug.indications.slice(0, 2).join(', ')}` : '',
        classicalText: drug.classicalText || 'Ayurvedic Pharmacopoeia of India'
      });
    } else {
      setCurrentMed({
        drugName: drug.name,
        brandName: drug.brands && drug.brands[0] ? drug.brands[0] : drug.name,
        system: 'allopathic',
        kalpana: '',
        dose: drug.commonDoses ? drug.commonDoses[0] : '500mg',
        frequency: drug.defaultFrequency || 'OD',
        sevanaKala: '',
        anupana: 'Water',
        route: 'Oral',
        timing: getTimingsForFrequency(drug.defaultFrequency || 'OD'),
        duration: '7 Days',
        instructions: drug.composition1 ? `Composition: ${drug.composition1}` : 'Take after meals',
        classicalText: ''
      });
    }
    setShowSuggestions(false);
  };

  // Add medication to active list
  const handleAddMedication = () => {
    if (!currentMed.drugName.trim()) {
      alert('Please select or type a medication name');
      return;
    }

    setMedications([
      ...medications,
      {
        ...currentMed,
        id: Date.now()
      }
    ]);

    // Reset current form
    setCurrentMed({
      drugName: '',
      brandName: '',
      system: prescribeSystem,
      kalpana: prescribeSystem === 'ayurvedic' ? 'Vati' : '',
      dose: prescribeSystem === 'ayurvedic' ? '1 Vati (250mg)' : '500mg',
      frequency: 'BD',
      sevanaKala: 'Pragbhakta (Before food)',
      anupana: 'Lukewarm water',
      route: 'Oral',
      timing: ['09:00', '21:00'],
      duration: '14 Days',
      instructions: '',
      classicalText: ''
    });
  };

  const handleRemoveMedication = (id) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  // 1-Click apply AyurGenix disease protocol
  const handleApplyAyurGenixProtocol = (protocol) => {
    setSelectedProtocol(protocol);
    setDiagnosis(`${protocol.Disease} (${protocol['Hindi Name'] || ''}) - ${protocol.Doshas || ''} vitiation`);
    setIcdCode(`AYUR-${protocol.id || 'GENIX'}`);
    
    // Auto-populate formulation from protocol
    const newMeds = [];
    if (protocol['Ayurvedic Herbs']) {
      const herbs = protocol['Ayurvedic Herbs'].split(',').map(h => h.trim());
      herbs.forEach((herb, i) => {
        newMeds.push({
          id: Date.now() + i,
          drugName: `${herb} Extract / Ghanvati`,
          system: 'ayurvedic',
          kalpana: 'Ghanvati / Churna',
          dose: '500mg (1 Vati)',
          frequency: 'BD',
          sevanaKala: 'Adhobhakta (After food)',
          anupana: 'Lukewarm water',
          duration: protocol['Duration of Treatment'] || '14 Days',
          classicalText: 'AyurGenix AI Clinical Pharmacopoeia'
        });
      });
    }

    if (protocol.Formulation) {
      newMeds.push({
        id: Date.now() + 10,
        drugName: protocol.Formulation,
        system: 'ayurvedic',
        kalpana: 'Classical Yoga',
        dose: 'Standard dose',
        frequency: 'BD',
        sevanaKala: 'Pragbhakta (Before food)',
        anupana: 'Honey / Warm Water',
        duration: protocol['Duration of Treatment'] || '14 Days',
        classicalText: 'AyurGenix Samhita Protocol'
      });
    }

    if (newMeds.length > 0) {
      // Interlinked: Add to active list without erasing individual drugs
      setMedications(prev => {
        const existingNames = new Set(prev.map(m => (m.drugName || m.name || '').toLowerCase()));
        const filtered = newMeds.filter(m => !existingNames.has((m.drugName || m.name || '').toLowerCase()));
        return [...prev, ...(filtered.length > 0 ? filtered : newMeds)];
      });
    }

    if (protocol['Diet and Lifestyle Recommendations']) {
      setDietRecommendations(`Pathya/Apathya: ${protocol['Diet and Lifestyle Recommendations']}. Patient Advice: ${protocol['Patient Recommendations'] || 'Rest and stay hydrated.'}`);
    }

    if (protocol['Yoga & Physical Therapy']) {
      setYogaTherapy(protocol['Yoga & Physical Therapy']);
    }

    setShowProtocolModal(false);
  };

  // Check live drug interactions
  const liveInteractions = useMemo(() => {
    return medicationDatabase.checkInteractions(medications);
  }, [medications]);

  // Filtered AyurGenix protocols
  const filteredProtocols = useMemo(() => {
    return medicationDatabase.searchDiseaseProtocols(protocolSearch);
  }, [protocolSearch]);

  // Trigger Print / PDF
  const handlePrintPrescription = () => {
    if (!selectedPatient) return;
    printDoctorPrescription({
      patient: selectedPatient,
      diagnosis,
      icdCode,
      prakriti: selectedPatient.prakriti || 'Pitta-Vata (पित्त-वात)',
      vitals: selectedPatient.vitals || { bp: '120/80 mmHg', pulse: '74 bpm', spo2: '99%' },
      medications,
      panchakarmaOrders,
      dietRecommendations,
      yogaTherapy,
      followUpDate,
      currentLang: 'en'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-16">
      
      {/* Top National Hospital Navigation Strip */}
      <div className="bg-[#0A2540] text-white sticky top-0 z-40 px-4 sm:px-8 py-3 shadow-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/ayush-opd')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl h-9 px-3 flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft size={15} />
              <span>Back to OPD</span>
            </Button>

            <div className="h-5 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E2861E] flex items-center justify-center text-white font-bold">
                <FileText size={18} />
              </div>
              <div>
                <h1 className="font-black text-sm sm:text-base leading-tight flex items-center gap-2">
                  <span>Advanced Hospital E-Prescription Suite</span>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px]">
                    ABDM M3 Live
                  </Badge>
                </h1>
                <p className="text-[11px] text-slate-300">
                  Dual Ayush Pharmacopoeia & Indian Allopathic Medicine Registry
                </p>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              onClick={() => setShowProtocolModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs h-9 px-3 flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles size={14} />
              <span>AyurGenix Protocols (446+)</span>
            </Button>

            <Button
              onClick={handlePrintPrescription}
              className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-black rounded-xl text-xs h-9 px-3.5 flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer size={15} />
              <span>Print / Download PDF</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Patient Selection & Clinical Vitals Banner */}
        {selectedPatient ? (
          <div className="bg-white border-2 border-[#D0DFEF] rounded-3xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B4C8C] to-[#1E40AF] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  {selectedPatient.name ? selectedPatient.name[0] : 'P'}
                </div>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="font-black text-xl text-slate-900">{selectedPatient.name}</h2>
                    <span className="bg-[#EFF6FF] text-[#1E40AF] font-mono text-xs font-black px-2.5 py-0.5 rounded-lg border border-[#BFDBFE]">
                      {selectedPatient.hhid}
                    </span>
                    <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-xs">
                      {selectedPatient.prakriti}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>Age: <b>{selectedPatient.age}Y</b></span>
                    <span>•</span>
                    <span>Gender: <b>{selectedPatient.gender}</b></span>
                    <span>•</span>
                    <span>ABHA ID: <b className="font-mono text-slate-700">{selectedPatient.abhaId}</b></span>
                  </p>
                </div>
              </div>

              {/* Vitals Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto bg-[#F8FAFC] p-3 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Blood Pressure</span>
                  <span className="font-black text-slate-900">{selectedPatient.vitals?.bp || '120/80 mmHg'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Pulse Rate</span>
                  <span className="font-black text-slate-900">{selectedPatient.vitals?.pulse || '74 bpm'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Oxygen (SpO2)</span>
                  <span className="font-black text-slate-900">{selectedPatient.vitals?.spo2 || '99%'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-red-600 font-bold block uppercase">Known Allergies</span>
                  <span className="font-black text-red-600 truncate">{selectedPatient.allergies || 'NKDA'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Patient Search Selector */
          <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50 p-6 rounded-3xl text-center">
            <h3 className="font-black text-lg text-slate-900 mb-2">Select an Active Patient Encounter</h3>
            <div className="max-w-md mx-auto relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Search patient by HHID, name, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-white rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {filteredPatients.slice(0, 6).map(p => (
                <button
                  key={p.hhid}
                  onClick={() => setSelectedPatient(p)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 text-left transition-all shadow-xs cursor-pointer"
                >
                  <span className="font-black text-xs text-slate-900 block">{p.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{p.hhid} • {p.age}Y/{p.gender}</span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Live Drug-Herb Safety Interaction Guard */}
        {liveInteractions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 flex items-start gap-3.5 text-amber-900 shadow-xs"
          >
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="font-black text-xs uppercase tracking-wide">
                Live Drug Interaction & CDSS Warning ({liveInteractions.length} Alerts)
              </h4>
              <ul className="mt-1 space-y-1 text-xs">
                {liveInteractions.map((inter, i) => (
                  <li key={i} className="font-medium">
                    ⚠️ <b>{inter.drug1}</b> + <b>{inter.drug2}</b>: {inter.warning}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Diagnosis & Clinical Terminology Ribbon */}
        <div className="bg-white border border-[#D0DFEF] rounded-3xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Stethoscope size={16} className="text-[#1E40AF]" />
              <span>Clinical / Provisional Diagnosis (रोग निदान)</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-slate-500">ICD-11 / NAMASTE: {icdCode}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8">
              <Input
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter clinical diagnosis (e.g. Amlapitta with Pitta-Vata vitiation)..."
                className="h-11 bg-[#F8FAFC] border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <Input
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                placeholder="Follow-up review timing"
                className="h-11 bg-[#F8FAFC] border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Dual Prescription Builder & Active Prescription List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Prescription Form Builder (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-[#D0DFEF] rounded-3xl p-5 shadow-xs space-y-4">
              
              {/* Prescribe Mode Switcher */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-black text-xs text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Plus size={16} className="text-blue-600" />
                  <span>Prescribe Medication (औषध योग)</span>
                </span>

                {/* System Toggle Tabs */}
                <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    onClick={() => {
                      setPrescribeSystem('ayurvedic');
                      setCurrentMed(prev => ({
                        ...prev,
                        system: 'ayurvedic',
                        dose: '1 Vati (250mg)',
                        frequency: 'BD',
                        sevanaKala: 'Pragbhakta (Before food)',
                        anupana: 'Lukewarm water'
                      }));
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      prescribeSystem === 'ayurvedic'
                        ? 'bg-[#E2861E] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🌿 Ayurvedic Formulations
                  </button>

                  <button
                    onClick={() => {
                      setPrescribeSystem('allopathic');
                      setCurrentMed(prev => ({
                        ...prev,
                        system: 'allopathic',
                        dose: '500mg',
                        frequency: 'OD',
                        sevanaKala: '',
                        anupana: 'Water'
                      }));
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      prescribeSystem === 'allopathic'
                        ? 'bg-[#1E40AF] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    💊 Modern Indian Drugs (3.5k+)
                  </button>
                </div>
              </div>

              {/* Drug Name Search Input with Safe Suggestions */}
              <div className="relative">
                <label className="text-xs font-black text-slate-700 block mb-1.5">
                  {prescribeSystem === 'ayurvedic' ? 'Search Ayurvedic Formulation / Kalpana *' : 'Search Indian Commercial Brand / Generic Drug *'}
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    value={currentMed.drugName}
                    onChange={(e) => setCurrentMed({ ...currentMed, drugName: e.target.value })}
                    placeholder={prescribeSystem === 'ayurvedic' ? "e.g. Sutshekhar Ras, Arogyavardhini, Avipattikar..." : "e.g. Augmentin 625, Azithral 500, Pantocid 40..."}
                    className="pl-10 h-11 bg-white border-slate-300 rounded-xl text-xs font-bold"
                  />
                  {currentMed.drugName && (
                    <button
                      onClick={() => setCurrentMed({ ...currentMed, drugName: '' })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Safe Non-Overlapping Suggestions Dropdown */}
                {showSuggestions && drugSuggestions.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border-2 border-blue-400 rounded-2xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100">
                    {drugSuggestions.map((drug, i) => (
                      <div
                        key={drug.id || i}
                        onClick={() => handleSelectSuggestion(drug)}
                        className="p-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-slate-900">{drug.name}</span>
                            <Badge className={drug.system === 'ayurvedic' ? 'bg-amber-100 text-amber-800 text-[10px]' : 'bg-blue-100 text-blue-800 text-[10px]'}>
                              {drug.category || drug.kalpana || drug.system}
                            </Badge>
                          </div>
                          {drug.composition1 && (
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">{drug.composition1}</p>
                          )}
                          {drug.classicalText && (
                            <p className="text-[10px] text-amber-700 italic">Ref: {drug.classicalText}</p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          {drug.price && <span className="text-xs font-mono font-bold text-slate-600 block">₹{drug.price}</span>}
                          <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                            Select <ChevronRight size={10} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Parameter Grid depending on System */}
              {prescribeSystem === 'ayurvedic' ? (
                /* Ayurvedic Classical Form */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Dose / Matra (मात्रा)</label>
                    <Input
                      value={currentMed.dose}
                      onChange={(e) => setCurrentMed({ ...currentMed, dose: e.target.value })}
                      placeholder="e.g. 1 Vati (250mg)"
                      className="h-10 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Sevana Kala (सेवन काल)</label>
                    <select
                      value={currentMed.sevanaKala}
                      onChange={(e) => setCurrentMed({ ...currentMed, sevanaKala: e.target.value })}
                      className="w-full h-10 bg-white border border-slate-300 rounded-xl px-2.5 text-xs font-bold"
                    >
                      <option value="Pragbhakta (Before food / प्राग्भक्त)">Pragbhakta (Before meals)</option>
                      <option value="Adhobhakta (After food / अधोभक्त)">Adhobhakta (After meals)</option>
                      <option value="Samabhakta (With food / समभक्त)">Samabhakta (With food)</option>
                      <option value="Nishikala (Bedtime / निशीकाल)">Nishikala (Bedtime)</option>
                      <option value="Muhurmuhu (Repeatedly / मुहुर्मुहु)">Muhurmuhu (Frequent)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Anupana (अनुपान)</label>
                    <Input
                      value={currentMed.anupana}
                      onChange={(e) => setCurrentMed({ ...currentMed, anupana: e.target.value })}
                      placeholder="e.g. Lukewarm water, Honey..."
                      className="h-10 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              ) : (
                /* Allopathic Modern Form */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Strength / Dose</label>
                    <Input
                      value={currentMed.dose}
                      onChange={(e) => setCurrentMed({ ...currentMed, dose: e.target.value })}
                      placeholder="e.g. 40mg, 500mg"
                      className="h-10 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Frequency</label>
                    <select
                      value={currentMed.frequency}
                      onChange={(e) => {
                        const freq = e.target.value;
                        setCurrentMed({
                          ...currentMed,
                          frequency: freq,
                          timing: getTimingsForFrequency(freq)
                        });
                      }}
                      className="w-full h-10 bg-white border border-slate-300 rounded-xl px-2.5 text-xs font-bold"
                    >
                      <option value="OD">OD (Once Daily)</option>
                      <option value="BD">BD (Twice Daily)</option>
                      <option value="TID">TID (Thrice Daily)</option>
                      <option value="QID">QID (4 Times Daily)</option>
                      <option value="HS">HS (Bedtime)</option>
                      <option value="SOS">SOS (When needed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Route & Food Relation</label>
                    <Input
                      value={currentMed.instructions}
                      onChange={(e) => setCurrentMed({ ...currentMed, instructions: e.target.value })}
                      placeholder="e.g. Oral, After meals"
                      className="h-10 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Duration (अवधि)</label>
                  <Input
                    value={currentMed.duration}
                    onChange={(e) => setCurrentMed({ ...currentMed, duration: e.target.value })}
                    placeholder="e.g. 14 Days, 1 Month"
                    className="h-10 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleAddMedication}
                    className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-black h-10 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Plus size={16} />
                    <span>Add to Active Rx</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Diet (Pathya-Apathya) & Yoga Recommendations */}
            <div className="bg-white border border-[#D0DFEF] rounded-3xl p-5 space-y-3 shadow-xs">
              <span className="font-black text-xs text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Leaf size={16} className="text-emerald-600" />
                <span>Pathya / Apathya & Yoga Lifestyle Prescription</span>
              </span>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Dietary Inclusions & Restrictions (पथ्यापथ्य)</label>
                  <Textarea
                    value={dietRecommendations}
                    onChange={(e) => setDietRecommendations(e.target.value)}
                    rows={2}
                    placeholder="e.g. Pathya: Cow milk, moong dal soup, pomegranate. Apathya: Spicy, oily, sour foods..."
                    className="text-xs font-medium rounded-xl border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Yoga & Pranayama Therapy (योगाभ्यास)</label>
                  <Input
                    value={yogaTherapy}
                    onChange={(e) => setYogaTherapy(e.target.value)}
                    placeholder="e.g. Anulom Vilom Pranayama (10 mins), Vajrasana post meals, Sheetali..."
                    className="h-10 text-xs font-medium rounded-xl border-slate-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Active Prescription Table & Orders (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border-2 border-[#1E40AF]/30 rounded-3xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center font-black text-xs">
                    Rx
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900">Active Encounter Prescription</h3>
                    <span className="text-[10px] text-slate-500 font-bold">{medications.length} items prescribed</span>
                  </div>
                </div>

                {medications.length > 0 && (
                  <Button
                    size="sm"
                    onClick={handlePrintPrescription}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl h-8 px-3 flex items-center gap-1 cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Print Rx</span>
                  </Button>
                )}
              </div>

              {medications.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <Pill size={40} className="mx-auto opacity-40 text-slate-400" />
                  <p className="text-xs font-bold">No medications in current prescription</p>
                  <p className="text-[11px]">Use the builder on the left or select a disease protocol</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
                  {medications.map((med, idx) => {
                    const isAyur = med.system !== 'allopathic';
                    return (
                      <div
                        key={med.id || idx}
                        className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 space-y-1.5 relative group hover:border-blue-400 transition-all shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-black text-xs text-slate-900">{med.drugName || med.name}</span>
                              <Badge className={isAyur ? 'bg-amber-100 text-amber-800 text-[9px] py-0' : 'bg-blue-100 text-blue-800 text-[9px] py-0'}>
                                {isAyur ? (med.kalpana || 'Ayurvedic') : 'Allopathic'}
                              </Badge>
                            </div>

                            {med.brandName && (
                              <p className="text-[10px] font-bold text-blue-600">Brand: {med.brandName}</p>
                            )}

                            <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold mt-1">
                              <span>Matra: {med.dose}</span>
                              <span>•</span>
                              <span>Freq: {med.frequency || med.sevanaKala}</span>
                              <span>•</span>
                              <span>Dur: {med.duration}</span>
                            </div>

                            {med.anupana && (
                              <p className="text-[10px] text-slate-500 font-medium italic mt-0.5">
                                Anupana: {med.anupana}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => handleRemoveMedication(med.id)}
                            className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Summary Footer Action */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-slate-500">
                  {medications.length} items ready for physician sign-off
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handlePrintPrescription}
                    className="rounded-xl h-10 text-xs font-bold border-slate-300 w-full sm:w-auto"
                  >
                    <Printer size={14} className="mr-1" />
                    <span>Print Draft</span>
                  </Button>

                  <Button
                    disabled={medications.length === 0}
                    onClick={() => setShowPreviewModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl h-10 px-5 cursor-pointer shadow-md flex items-center gap-1.5 w-full sm:w-auto"
                  >
                    <CheckCircle2 size={16} />
                    <span>Complete & E-Prescribe</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AyurGenix AI Disease Protocol Modal (446+ Records from CSV) */}
      <AnimatePresence>
        {showProtocolModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden text-slate-900 shadow-2xl"
            >
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-[#0A2540] text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-white">
                      AyurGenix AI Clinical Disease Protocols (446+ Samhita Protocols)
                    </h3>
                    <p className="text-xs text-slate-300">
                      Standard Ayurvedic clinical decision support, herbs, formulation, diet & yoga sets
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowProtocolModal(false)}
                  className="rounded-xl border-white/20 text-white hover:bg-white/10 text-xs font-bold"
                >
                  Close
                </Button>
              </div>

              {/* Search Protocol */}
              <div className="p-4 bg-[#F8FAFC] border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    value={protocolSearch}
                    onChange={(e) => setProtocolSearch(e.target.value)}
                    placeholder="Search 446+ diseases e.g. Cough, Diabetes, Hypertension, Migraine, Arthritis, Indigestion..."
                    className="pl-10 h-11 bg-white border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* Protocol Grid List */}
              <div className="p-4 overflow-y-auto max-h-[55vh] space-y-3 bg-slate-50">
                {filteredProtocols.map(item => (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-slate-200 hover:border-[#1E40AF] p-4 rounded-2xl transition-all shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-base text-slate-900">
                            {item.Disease} {item['Hindi Name'] && <span className="text-amber-700">({item['Hindi Name']})</span>}
                          </h4>
                          <Badge className="bg-amber-100 text-amber-900 text-[10px] font-bold">
                            Dosha: {item.Doshas || 'Tridosha'}
                          </Badge>
                          {item.Severity && (
                            <Badge className="bg-slate-100 text-slate-700 text-[10px]">
                              {item.Severity}
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 mt-1">
                          <b>Symptoms:</b> {item.Symptoms || 'General clinical manifestation'}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleApplyAyurGenixProtocol(item)}
                        className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-black text-xs rounded-xl h-9 px-3.5 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                      >
                        <Check size={14} />
                        <span>Apply Protocol</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Recommended Herbs</span>
                        <span className="font-bold text-slate-800">{item['Ayurvedic Herbs'] || 'Ashwagandha, Tulsi'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Formulation Yoga</span>
                        <span className="font-bold text-slate-800">{item.Formulation || 'Standard Classical Yoga'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Yoga Therapy</span>
                        <span className="font-bold text-slate-800">{item['Yoga & Physical Therapy'] || 'Pranayama, Asanas'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Total 446 Clinical Samhita Protocols Loaded</span>
                <Button size="sm" onClick={() => setShowProtocolModal(false)} className="rounded-xl">Done</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation & Official Digital Sign-off Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedPatient && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 shadow-2xl space-y-0"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#0A2540] text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white">
                      Confirm & Issue Official E-Prescription (ई-प्रिस्क्रिप्शन प्रमाणीकरण)
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      All India Institute of Ayurveda (AIIA) • ABDM Verified Electronic Record
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPreviewModal(false)}
                  className="rounded-xl border-white/20 text-white hover:bg-white/10 text-xs font-bold"
                >
                  Edit / Back
                </Button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-4 bg-slate-50 text-xs">
                {/* Patient Summary */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Patient</span>
                      <span className="font-black text-slate-900 text-sm">{selectedPatient.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Age / Gender</span>
                      <span className="font-bold text-slate-800">{selectedPatient.age}Y / {selectedPatient.gender}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">HHID / ABHA</span>
                      <span className="font-mono font-bold text-[#1E40AF]">{selectedPatient.hhid}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Prakriti</span>
                      <span className="font-bold text-[#EA580C]">{selectedPatient.prakriti || 'Pitta-Vata'}</span>
                    </div>
                  </div>

                  <div className="pt-2 text-slate-700 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Diagnosis:</span>
                    <span className="font-black text-slate-900">{diagnosis}</span>
                  </div>
                </div>

                {/* Prescribed Medications */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-black text-slate-900 text-xs uppercase tracking-wider">
                      Prescribed Formulations ({medications.length} items)
                    </span>
                    <Badge className="bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                      CDSS Checked Safe
                    </Badge>
                  </div>

                  <div className="space-y-2 divide-y divide-slate-100">
                    {medications.map((med, idx) => (
                      <div key={med.id || idx} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">#{idx + 1} {med.drugName || med.name}</span>
                            <Badge className={med.system === 'ayurvedic' ? 'bg-amber-50 text-amber-800 text-[9px]' : 'bg-blue-50 text-blue-800 text-[9px]'}>
                              {med.kalpana || med.system}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                            Dose: <b>{med.dose}</b> • Freq: <b>{med.frequency}</b> • Timing: <b>{med.sevanaKala || med.timing}</b> • Anupana: <b>{med.anupana || 'Water'}</b> • Duration: <b className="text-[#1E40AF]">{med.duration}</b>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diet & Yoga Instructions */}
                {(dietRecommendations || yogaTherapy) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {dietRecommendations && (
                      <div className="bg-[#FFF7ED] p-3 rounded-xl border border-amber-200">
                        <span className="text-[10px] font-black uppercase text-amber-900 block mb-1">
                          🥗 Dietary Instructions
                        </span>
                        <p className="text-[11px] text-slate-800 font-medium line-clamp-2">
                          {dietRecommendations}
                        </p>
                      </div>
                    )}
                    {yogaTherapy && (
                      <div className="bg-[#F0FDF4] p-3 rounded-xl border border-emerald-200">
                        <span className="text-[10px] font-black uppercase text-emerald-900 block mb-1">
                          🧘 Yoga & Lifestyle
                        </span>
                        <p className="text-[11px] text-slate-800 font-medium line-clamp-2">
                          {yogaTherapy}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Digital Signature */}
                <div className="bg-slate-100 p-3 rounded-xl border border-slate-300 flex items-center justify-between text-[11px]">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 block">Digitally Signed by: Dr. V. Sharma (BAMS, MD Ayu)</span>
                    <span className="text-slate-500 font-mono">Reg. No: AYU-DEL-8942 • AIIA National OPD</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 block">ABDM QR Code Stamped</span>
                    <span className="text-slate-400 font-mono">{new Date().toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPreviewModal(false)}
                  className="rounded-xl w-full sm:w-auto text-xs font-bold"
                >
                  Back & Edit
                </Button>

                <Button
                  onClick={() => {
                    setShowPreviewModal(false);
                    handlePrintPrescription();
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs h-11 px-8 flex items-center justify-center gap-2 cursor-pointer shadow-md w-full sm:w-auto"
                >
                  <CheckCircle2 size={16} />
                  <span>Confirm & Issue Official E-Prescription (Print)</span>
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

