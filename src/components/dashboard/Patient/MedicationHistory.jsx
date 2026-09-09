import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, History, Plus, Trash2, CheckCircle2, AlertTriangle, 
  ShieldAlert, Clock, Calendar, Stethoscope, Flower2, 
  Sparkles, RefreshCw, ChevronRight, X, ArrowRight, Check,
  FileText, Activity, AlertOctagon, HelpCircle, Eye
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

export default function MedicationHistory({
  currentMedications = [],
  previousMedications = [],
  onUpdateCurrentMeds,
  onUpdatePrevMeds,
  onReconcileToRx,
  isPhysicianMode = true
}) {
  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'previous' | 'reconciliation'
  const [systemFilter, setSystemFilter] = useState('all'); // 'all' | 'ayurvedic' | 'allopathic'
  
  // New Medication Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [addCategory, setAddCategory] = useState('current'); // 'current' | 'previous'
  
  const [newMed, setNewMed] = useState({
    name: '',
    system: 'ayurvedic', // 'ayurvedic' | 'allopathic'
    dose: '',
    frequency: 'BD (Twice Daily)',
    route: 'Oral',
    kaala: 'Adhobhakta (After Meals)',
    anupana: 'Lukewarm Water',
    indication: '',
    prescriber: 'AIIA OPD',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    adherence: 'High (>90%)',
    discontinueReason: 'Course Completed (उपचार पूर्ण)',
    discontinueNote: ''
  });

  // Default demo data if empty
  const activeCurrent = currentMedications.length > 0 ? currentMedications : [
    {
      id: 'cm-1',
      name: 'Telmisartan Tablets',
      genericName: 'Telmisartan',
      system: 'allopathic',
      type: 'Antihypertensive',
      dose: '40 mg',
      route: 'Oral',
      frequency: 'OD (Once Daily - Morning)',
      indication: 'Essential Hypertension',
      prescriber: 'Dr. R. K. Gupta (Cardiology, AIIMS)',
      startDate: '2025-11-10',
      adherence: 'High (>90%)',
      tolerability: 'Well tolerated; BP stable ~128/84',
      interactions: ['Monitor with Arjuna & Sarpagandha']
    },
    {
      id: 'cm-2',
      name: 'Pantoprazole Tablets',
      genericName: 'Pantoprazole',
      system: 'allopathic',
      type: 'Proton Pump Inhibitor',
      dose: '40 mg',
      route: 'Oral',
      frequency: 'OD (Empty Stomach - 07:30 AM)',
      indication: 'Amlapitta / Severe GERD & Epigastric Burning',
      prescriber: 'Self / Local Clinic',
      startDate: '2026-01-15',
      adherence: 'Moderate (Misses doses on weekends)',
      tolerability: 'Partial symptom relief only; recurrent night heartburn'
    },
    {
      id: 'cm-3',
      name: 'Sutshekhar Ras (Gold)',
      system: 'ayurvedic',
      type: 'Rasaushadhi / Vati',
      dose: '250 mg',
      route: 'Oral',
      frequency: 'BD (Twice Daily)',
      kaala: 'Pragbhakta (Before Meals)',
      anupana: 'Godugdha (Warm Cow Milk)',
      indication: 'Amlapitta & Urdhwaga Pitta Flare',
      prescriber: 'Dr. V. Sharma (AIIA OPD)',
      startDate: '2026-02-28',
      adherence: 'High (>90%)',
      tolerability: 'Rapid cooling effect on retrosternal burning'
    }
  ];

  const activePrevious = previousMedications.length > 0 ? previousMedications : [
    {
      id: 'pm-1',
      name: 'Diclofenac Sodium 50mg + Paracetamol 325mg',
      genericName: 'Diclofenac + Paracetamol',
      system: 'allopathic',
      dose: '1 tablet BD',
      indication: 'Knee & Lower Back Pain',
      startDate: '2025-08-01',
      endDate: '2025-09-15',
      duration: '6 Weeks',
      discontinueReason: 'Adverse Drug Reaction / Gastritis (अम्लपित्त एवं उदर दाह)',
      discontinueNote: 'Patient developed severe burning epigastric pain and acid reflux. Switched to Ayurvedic Vata-hara therapies.',
      prescriber: 'Community Health Centre'
    },
    {
      id: 'pm-2',
      name: 'Avipattikar Churna',
      system: 'ayurvedic',
      type: 'Churna',
      dose: '3g with lukewarm water at bedtime',
      indication: 'Chronic Constipation & Acid Reflux',
      startDate: '2025-10-01',
      endDate: '2025-11-20',
      duration: '7 Weeks',
      discontinueReason: 'Course Completed (उपचार पूर्ण)',
      discontinueNote: 'Bowel movements normalized (Kostha became Madhyama). Temporarily paused during winter.',
      prescriber: 'Panchakarma Vaidya'
    },
    {
      id: 'pm-3',
      name: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
      genericName: 'Augmentin',
      system: 'allopathic',
      dose: '625 mg BD',
      indication: 'Upper Respiratory Infection / Sinusitis',
      startDate: '2025-12-05',
      endDate: '2025-12-12',
      duration: '7 Days',
      discontinueReason: 'Course Completed (उपचार पूर्ण)',
      discontinueNote: 'Full 7-day antibiotic course completed; infection resolved with Sitopaladi adjunct.',
      prescriber: 'ENT Specialist'
    }
  ];

  const handleAddNewMedication = () => {
    if (!newMed.name.trim()) return;

    const entry = {
      ...newMed,
      id: `med-${Date.now()}`
    };

    if (addCategory === 'current') {
      const updated = [...activeCurrent, entry];
      if (onUpdateCurrentMeds) onUpdateCurrentMeds(updated);
    } else {
      const updated = [...activePrevious, entry];
      if (onUpdatePrevMeds) onUpdatePrevMeds(updated);
    }

    setShowAddModal(false);
    setNewMed({
      name: '',
      system: 'ayurvedic',
      dose: '',
      frequency: 'BD (Twice Daily)',
      route: 'Oral',
      kaala: 'Adhobhakta (After Meals)',
      anupana: 'Lukewarm Water',
      indication: '',
      prescriber: 'AIIA OPD',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      adherence: 'High (>90%)',
      discontinueReason: 'Course Completed (उपचार पूर्ण)',
      discontinueNote: ''
    });
  };

  const filteredCurrent = activeCurrent.filter(m => {
    if (systemFilter === 'all') return true;
    return m.system === systemFilter;
  });

  const filteredPrevious = activePrevious.filter(m => {
    if (systemFilter === 'all') return true;
    return m.system === systemFilter;
  });

  return (
    <div className="bg-white border border-[#D0DFEF] rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
      
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] text-[10px] font-mono font-bold">
              HIS PHARMACOTHERAPY TIMELINE
            </Badge>
            <span className="text-xs font-bold text-slate-500">
              ABDM HL7 MedicationStatement & Reconciliation
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
            Patient Medication History & Reconciliation (दवा इतिहास)
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Cross-discipline documentation of active ongoing prescriptions vs past discontinued therapies (Modern + Ayurvedic).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setAddCategory('current');
              setShowAddModal(true);
            }}
            className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-extrabold rounded-xl text-xs h-9 px-3.5 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus size={15} />
            <span>+ Add Medication</span>
          </Button>
        </div>
      </div>

      {/* 2. Tabs & System Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC] p-2 rounded-2xl border border-slate-200">
        {/* Main Category Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'current'
                ? 'bg-[#1E40AF] text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pill size={14} />
            <span>Current Active Meds ({activeCurrent.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('previous')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'previous'
                ? 'bg-[#EA580C] text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History size={14} />
            <span>Previous / Discontinued ({activePrevious.length})</span>
          </button>
        </div>

        {/* System Filter (All / Ayurvedic / Allopathic) */}
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <span className="text-slate-500 text-[11px]">System:</span>
          {[
            { id: 'all', label: 'All Systems' },
            { id: 'ayurvedic', label: '🌿 Ayurvedic' },
            { id: 'allopathic', label: '💊 Allopathic' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSystemFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                systemFilter === f.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 3. TAB 1: CURRENT ACTIVE MEDICATIONS                                    */}
      {/* ======================================================================= */}
      {activeTab === 'current' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-bold">
              Showing {filteredCurrent.length} currently active ongoing therapies:
            </span>
            <Badge className="bg-[#F0FDF4] text-emerald-800 border border-[#BBF7D0] text-[10px]">
              Active Cross-System CDSS Monitoring
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredCurrent.map((med, idx) => {
              const isAyush = med.system === 'ayurvedic';
              return (
                <div
                  key={med.id || idx}
                  className={`p-4 rounded-2xl border-2 transition-all space-y-2.5 ${
                    isAyush 
                      ? 'bg-[#FFFDF9] border-[#FED7AA] hover:border-orange-400' 
                      : 'bg-[#F9FBFE] border-[#BFDBFE] hover:border-blue-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
                        isAyush ? 'bg-[#EA580C]' : 'bg-[#1E40AF]'
                      }`}>
                        {isAyush ? <Flower2 size={15} /> : <Pill size={15} />}
                      </div>
                      
                      <h4 className="font-black text-sm text-slate-900">{med.name}</h4>
                      
                      <Badge className={isAyush ? 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA] text-[10px]' : 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE] text-[10px]'}>
                        {isAyush ? 'Ayurvedic Formulation' : 'Modern Allopathic'}
                      </Badge>

                      {med.type && (
                        <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {med.type}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                        ● Adherence: {med.adherence || 'High'}
                      </Badge>
                      
                      {onReconcileToRx && (
                        <Button
                          size="sm"
                          onClick={() => onReconcileToRx(med)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] h-7 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={12} />
                          <span>Reconcile to Rx</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Dosage, Timing & Administration */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Dosage & Frequency</span>
                      <span className="font-extrabold text-slate-900">{med.dose} • {med.frequency}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        {isAyush ? 'Kaala (Timing) & Anupana' : 'Route & Timing'}
                      </span>
                      <span className="font-bold text-slate-800">
                        {isAyush 
                          ? `${med.kaala || 'Adhobhakta'} (${med.anupana || 'Water'})` 
                          : `${med.route || 'Oral'} • ${med.frequency}`}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Indication & Prescriber</span>
                      <span className="font-bold text-slate-800 truncate block">
                        {med.indication || 'General'} ({med.prescriber || 'OPD'})
                      </span>
                    </div>
                  </div>

                  {/* Tolerability / Notes */}
                  {med.tolerability && (
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/80 flex items-start gap-1.5">
                      <Activity size={13} className="text-[#1E40AF] shrink-0 mt-0.5" />
                      <span><b>Clinical Observation:</b> {med.tolerability}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. TAB 2: PREVIOUS / DISCONTINUED MEDICATIONS                           */}
      {/* ======================================================================= */}
      {activeTab === 'previous' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-bold">
              Showing {filteredPrevious.length} past discontinued medications with clinical rationales:
            </span>
            <Badge className="bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] text-[10px]">
              Discontinuation Audit Log
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredPrevious.map((med, idx) => {
              const isAyush = med.system === 'ayurvedic';
              const isAdverse = med.discontinueReason?.toLowerCase().includes('adverse') || 
                                med.discontinueReason?.toLowerCase().includes('gastritis') ||
                                med.discontinueReason?.toLowerCase().includes('allergy');
              
              return (
                <div
                  key={med.id || idx}
                  className={`p-4 rounded-2xl border-2 transition-all space-y-2.5 ${
                    isAdverse 
                      ? 'bg-red-50/40 border-red-200 hover:border-red-400' 
                      : 'bg-[#F8FAFC] border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
                        isAdverse ? 'bg-red-600' : isAyush ? 'bg-[#EA580C]' : 'bg-slate-700'
                      }`}>
                        {isAdverse ? <AlertOctagon size={15} /> : isAyush ? <Flower2 size={15} /> : <Pill size={15} />}
                      </div>

                      <h4 className="font-black text-sm text-slate-900 line-through opacity-80">{med.name}</h4>

                      <Badge className={isAyush ? 'bg-[#FFF7ED] text-[#EA580C] text-[10px]' : 'bg-[#EFF6FF] text-[#1E40AF] text-[10px]'}>
                        {isAyush ? 'Ayurvedic (Past)' : 'Allopathic (Past)'}
                      </Badge>

                      <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {med.duration || 'Past Course'}
                      </span>
                    </div>

                    <Badge className={isAdverse ? 'bg-red-100 text-red-800 border-red-300 text-[10px] font-bold' : 'bg-slate-200 text-slate-700 text-[10px]'}>
                      Status: Discontinued
                    </Badge>
                  </div>

                  {/* Clinical Reason for Discontinuation */}
                  <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                    isAdverse ? 'bg-red-50 border-red-200 text-red-950' : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div className="flex items-center gap-1.5 font-black text-xs">
                      {isAdverse ? <AlertTriangle size={14} className="text-red-600" /> : <CheckCircle2 size={14} className="text-emerald-600" />}
                      <span>कारण (Reason for Stopping): {med.discontinueReason}</span>
                    </div>
                    {med.discontinueNote && (
                      <p className="text-[11px] opacity-90 font-medium pl-5">
                        {med.discontinueNote}
                      </p>
                    )}
                  </div>

                  {/* Dates & Prescriber */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200/80">
                    <span>Course Period: <b>{med.startDate}</b> to <b>{med.endDate || 'Completed'}</b></span>
                    <span>Prescriber: <b>{med.prescriber || 'Hospital OPD'}</b></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 5. ADD MEDICATION MODAL                                                 */}
      {/* ======================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl border border-slate-200 p-6 max-w-xl w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900">
                  {addCategory === 'current' ? 'Add Current Ongoing Medication' : 'Add Past Discontinued Medication'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Record patient pharmacotherapy for clinical reconciliation</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Therapy System</label>
                  <select
                    value={newMed.system}
                    onChange={(e) => setNewMed({ ...newMed, system: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl h-10 px-3 text-xs font-bold"
                  >
                    <option value="ayurvedic">🌿 Ayurvedic / AYUSH</option>
                    <option value="allopathic">💊 Modern Allopathic</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">History Type</label>
                  <select
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl h-10 px-3 text-xs font-bold"
                  >
                    <option value="current">Current Active Medication</option>
                    <option value="previous">Previous Discontinued Medication</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Medication Name & Strength</label>
                <input
                  type="text"
                  placeholder="e.g. Sutshekhar Ras 250mg, Telmisartan 40mg, Avipattikar Churna..."
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl h-10 px-3 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Dose & Frequency</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 tab BD, 5g at bedtime..."
                    value={newMed.dose}
                    onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl h-10 px-3 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Clinical Indication</label>
                  <input
                    type="text"
                    placeholder="e.g. Amlapitta, Hypertension, Joint Pain..."
                    value={newMed.indication}
                    onChange={(e) => setNewMed({ ...newMed, indication: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl h-10 px-3 text-xs font-bold"
                  />
                </div>
              </div>

              {addCategory === 'previous' && (
                <div className="space-y-3 bg-red-50/50 p-3 rounded-2xl border border-red-200">
                  <div>
                    <label className="text-[10px] text-red-900 font-black uppercase block mb-1">
                      Reason for Discontinuation (रोकने का कारण)
                    </label>
                    <select
                      value={newMed.discontinueReason}
                      onChange={(e) => setNewMed({ ...newMed, discontinueReason: e.target.value })}
                      className="w-full bg-white border border-red-300 rounded-xl h-10 px-3 text-xs font-bold"
                    >
                      <option value="Course Completed (उपचार पूर्ण)">Course Completed (उपचार पूर्ण)</option>
                      <option value="Adverse Drug Reaction / Gastritis (अम्लपित्त / एलर्जी)">Adverse Drug Reaction / Gastritis (अम्लपित्त / एलर्जी)</option>
                      <option value="Ineffective / Lack of Efficacy (लाभ न होना)">Ineffective / Lack of Efficacy (लाभ न होना)</option>
                      <option value="Intolerable Side Effects (असहनीय दुष्प्रभाव)">Intolerable Side Effects (असहनीय दुष्प्रभाव)</option>
                      <option value="Switched by Physician (चिकित्सक द्वारा बदली गई)">Switched by Physician (चिकित्सक द्वारा बदली गई)</option>
                      <option value="Patient Self-Discontinued (रोगी द्वारा स्वयं बंद)">Patient Self-Discontinued (रोगी द्वारा स्वयं बंद)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-red-900 font-bold block mb-1">Clinical Discontinuation Details</label>
                    <input
                      type="text"
                      placeholder="e.g. Developed acute epigastric burning after 2 weeks..."
                      value={newMed.discontinueNote}
                      onChange={(e) => setNewMed({ ...newMed, discontinueNote: e.target.value })}
                      className="w-full bg-white border border-red-300 rounded-xl h-10 px-3 text-xs font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl h-9 text-xs font-bold"
              >
                Cancel
              </Button>

              <Button
                onClick={handleAddNewMedication}
                className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-extrabold rounded-xl h-9 text-xs px-4"
              >
                Save Medication
              </Button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
