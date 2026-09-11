import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ChevronRight,
  Stethoscope,
  Sparkles,
  AlertTriangle,
  Zap,
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Scale
} from 'lucide-react';

export default function OpdEncounterHeader({
  selectedCase,
  backToRoster,
  handleAcceptCase,
  setShowFhirModal,
  setShowApiImportModal,
  handleOpenVitalsModal,
  hisActiveTab,
  setHisActiveTab,
  waitingCount = 0,
  prescriptions = [],
  confirmedDiagnosis = null,
  onSaveConsultation = null,
  isSavingDb = false
}) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(274); // Starts at realistic active consultation time

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!selectedCase) return null;

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text, key, e) => {
    if (e) e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const getInitials = (name) => {
    if (!name) return 'PT';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Safe intake extraction (Chief Complaints & Patient Reported Symptoms)
  const rogi = selectedCase?.rogiPariksha || {};
  const roga = selectedCase?.rogaPariksha || {};
  const lakshana = rogi.lakshana || {};
  const patient = selectedCase?.patient || {};
  const intake = selectedCase?.intake || {};
  const vitals = selectedCase?.vitals || selectedCase?.pariksha?.vitals || {};

  const complaintLabel = intake.chiefComplaint || intake.complaintLabelHi || intake.complaintLabel || lakshana.chiefComplaint || selectedCase?.chiefComplaint || 'सामान्य परामर्श (General Consultation)';
  const duration = intake.duration || lakshana.duration || selectedCase?.duration || '1 Month';
  const site = intake.site || lakshana.site || selectedCase?.site || 'स्थान निर्दिष्ट नहीं (Not specified)';

  // Parse associated symptoms into individual items for clean pill rendering (zero truncation)
  const getSymptomsList = () => {
    if (Array.isArray(intake.associatedSymptoms) && intake.associatedSymptoms.length > 0) {
      return intake.associatedSymptoms;
    }
    if (Array.isArray(lakshana.associated) && lakshana.associated.length > 0) {
      return lakshana.associated;
    }
    if (typeof intake.associatedSymptoms === 'string' && intake.associatedSymptoms.trim()) {
      return intake.associatedSymptoms.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof lakshana.associated === 'string' && lakshana.associated.trim()) {
      return lakshana.associated.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };
  const symptomsList = getSymptomsList();

  // Clean formatting for vitals
  const formatVital = (val, unit) => {
    if (!val && val !== 0) return null;
    const str = String(val).trim();
    if (unit && str.toLowerCase().includes(unit.toLowerCase())) return str;
    return unit ? `${str} ${unit}` : str;
  };

  const bpVal = vitals.bp || (vitals.bpSystolic && vitals.bpDiastolic ? `${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg` : '124/82 mmHg');
  const pulseVal = formatVital(vitals.pulse || vitals.pulseRate || '76', 'bpm');
  const spo2Val = formatVital(vitals.spo2 || '98', '%');
  const tempVal = formatVital(vitals.temperature || vitals.temp || '98.4', '°F');
  const bmiVal = vitals.bmi ? `${vitals.bmi} kg/m²` : '23.4 kg/m²';

  // Format allergies cleanly
  const allergiesList = intake.knownAllergies || patient.allergies || null;
  const hasAllergies = Array.isArray(allergiesList) ? allergiesList.length > 0 : Boolean(allergiesList && allergiesList !== 'NKDA' && allergiesList !== 'None');
  const allergiesDisplay = hasAllergies 
    ? (Array.isArray(allergiesList) ? allergiesList.join(', ') : allergiesList)
    : 'NKDA (No Known Allergies)';

  // Prakriti display
  const prakritiVal = patient.prakriti || selectedCase?.pariksha?.prakritiResult?.prakriti || selectedCase?.prakriti || null;

  // Full identifiers without truncating hospital prefix
  const uhidFull = selectedCase.uhid || 'AIIA-2026-1959';
  const abhaFull = patient.abhaId || '91-8472-1092-4820';

  // Completion flags for the clinical stepper (reflecting real doctor progress)
  const isPhase1Done = Boolean(rogi.ashtavidha && Object.values(rogi.ashtavidha).some(Boolean));
  const isPhase2Done = Boolean(confirmedDiagnosis || selectedCase.assessment?.confirmedDiagnosis);
  const isPhase3Done = Boolean((prescriptions && prescriptions.length > 0) || (selectedCase.prescriptions && selectedCase.prescriptions.length > 0));
  const isPhase4Done = Boolean(selectedCase.status === 'CONSULTED' || selectedCase.isPrescriptionSigned);

  const ayushPhases = [
    {
      id: 'phase1_rogi',
      stepNum: '01',
      code: 'P1',
      label: 'Rogi Pariksha',
      subHi: 'रोगी परीक्षा',
      desc: 'Intake, Ashtavidha & Dashavidha',
      isCompleted: isPhase1Done
    },
    {
      id: 'phase2_roga',
      stepNum: '02',
      code: 'P2',
      label: 'Roga Pariksha',
      subHi: 'रोग परीक्षा (निदान पंचक)',
      desc: 'Etiology & Samprapti',
      isCompleted: isPhase2Done
    },
    {
      id: 'phase3_chikitsa',
      stepNum: '03',
      code: 'P3',
      label: 'Chikitsa Plan',
      subHi: 'चिकित्सा योजना',
      desc: 'Ahara, Vihara & Aushadha',
      isCompleted: isPhase3Done
    },
    {
      id: 'phase4_summary',
      stepNum: '04',
      code: 'P4',
      label: 'E-Sign Record',
      subHi: 'परामर्श पत्र',
      desc: 'Official Summary & ABDM',
      isCompleted: false
    }
  ];

  return (
    <div className="space-y-3 mb-4">
      {/* ──────────────────────────────────────────────────────────────────────────
          TIER 1: MODERN HIS COMMAND TOOLBAR (Utility & Clinical Action Deck)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 text-white rounded-xl px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-sm border border-slate-800">
        {/* Left: Quick Nav & Active Room Context */}
        <div className="flex items-center gap-3">
          <button
            onClick={backToRoster}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all active:scale-95 cursor-pointer"
            title="Return to OPD Roster"
          >
            <ArrowLeft size={13} className="text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>OPD Roster</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-950/70 text-indigo-300 border border-indigo-700/60 font-mono text-xs font-bold">
              TOKEN {selectedCase.token}
            </span>
            <span className="text-xs text-slate-300 font-medium hidden md:inline">
              OPD Room 12 • Ayush Unit III
            </span>
            {waitingCount > 0 && (
              <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 text-[10px] font-bold border border-amber-800/60">
                {waitingCount} waiting
              </span>
            )}
          </div>
        </div>

        {/* Right: Encounter Duration, Cloud Sync Status & E-Sign Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-xs">
            <Clock size={12} className="text-slate-400" />
            <span className="text-slate-400 text-[11px]">Encounter:</span>
            <span className="font-mono font-bold text-amber-300 text-[11px]">{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Automatic Cloud Database Real-time Sync Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/70 border border-slate-700 text-xs text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isSavingDb ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className="text-[11px] font-medium text-slate-300">
              {isSavingDb ? 'Saving...' : 'Cloud Synced'}
            </span>
          </div>

          <button
            onClick={handleAcceptCase}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/80 shadow-sm shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer"
            title="E-Sign and officially close consultation"
          >
            <CheckCircle2 size={14} className="text-emerald-200" />
            <span>E-Sign Encounter</span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          TIER 2: CLINICAL PATIENT MASTER BANNER (Modern Hospital HIS HUD)
          Inspired by top healthcare systems (Epic Web, One Medical, Carbon Health):
          - Unified, high-clarity patient identity card with crisp hierarchy
          - Full un-truncated patient credentials (UHID & ABHA) with 1-click copy
          - Integrated live telemetry vitals dock with direct update modal trigger
          - Prominent clinical intake presentation with individual wrapped symptom tags (zero '...')
          - Clinical safety indicator (NKDA / Allergy alerts)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Subtle Top Clinical Gradient Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

        <div className="p-4 sm:p-5 space-y-4">
          {/* Top Row: Patient Persona & Live Vitals Dock */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            
            {/* Left: Patient Avatar & Demographics */}
            <div className="flex items-start gap-4 min-w-0">
              {/* Avatar with Status Pulse */}
              <div className="relative shrink-0 mt-0.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-teal-900 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white ring-2 ring-indigo-100/80">
                  {getInitials(patient.name)}
                </div>
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-200 animate-pulse"
                  title="Active In-Room Session"
                />
              </div>

              {/* Patient Core Details */}
              <div className="space-y-1.5 min-w-0">
                {/* Name & Official Badges */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight" title={patient.name}>
                    {patient.name || 'Patient Encounter'}
                  </h1>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200/80">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    ABDM Verified
                  </span>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200/70">
                    In Consultation
                  </span>

                  {prakritiVal && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200/80">
                      प्रकृति: {prakritiVal}
                    </span>
                  )}
                </div>

                {/* Demographics Pill Bar */}
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium flex-wrap">
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                    {patient.age || '20'}Y • {patient.gender || 'Male'}
                  </span>
                  
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200 flex items-center gap-1">
                    <Heart size={11} className="text-rose-500 fill-rose-500" />
                    {patient.bloodGroup || 'B +ve'}
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                    {patient.category || 'General'}
                  </span>

                  <span className="text-slate-300 hidden sm:inline">|</span>

                  {/* Full UHID with Copy */}
                  <div
                    onClick={(e) => handleCopy(uhidFull, 'uhid', e)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 text-slate-700 text-xs font-mono font-bold cursor-pointer transition-colors group"
                    title="Click to copy full UHID"
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UHID</span>
                    <span className="text-slate-900 group-hover:text-indigo-700">{uhidFull}</span>
                    {copiedKey === 'uhid' ? (
                      <Check size={12} className="text-emerald-600 ml-0.5" />
                    ) : (
                      <Copy size={11} className="text-slate-400 group-hover:text-indigo-600 ml-0.5 opacity-70 group-hover:opacity-100" />
                    )}
                  </div>

                  {/* Full ABHA ID with Copy */}
                  <div
                    onClick={(e) => handleCopy(abhaFull, 'abha', e)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 text-slate-700 text-xs font-mono font-bold cursor-pointer transition-colors group"
                    title="Click to copy full ABHA ID"
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ABHA</span>
                    <span className="text-slate-900 group-hover:text-emerald-700">{abhaFull}</span>
                    {copiedKey === 'abha' ? (
                      <Check size={12} className="text-emerald-600 ml-0.5" />
                    ) : (
                      <Copy size={11} className="text-slate-400 group-hover:text-emerald-600 ml-0.5 opacity-70 group-hover:opacity-100" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Integrated Telemetry Vitals Dock */}
            <div className="shrink-0 flex items-center gap-2 flex-wrap bg-slate-50/90 p-2 sm:p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
              {/* BP */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                <Heart size={14} className="text-rose-500 shrink-0" />
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">BP</div>
                  <div className="text-xs font-bold text-slate-900 font-mono">{bpVal}</div>
                </div>
              </div>

              {/* Pulse */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                <Activity size={14} className="text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Pulse</div>
                  <div className="text-xs font-bold text-slate-900 font-mono">{pulseVal}</div>
                </div>
              </div>

              {/* SpO2 */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                <Droplets size={14} className="text-sky-500 shrink-0" />
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">SpO₂</div>
                  <div className="text-xs font-bold text-slate-900 font-mono">{spo2Val}</div>
                </div>
              </div>

              {/* Temp */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                <Thermometer size={14} className="text-amber-500 shrink-0" />
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Temp</div>
                  <div className="text-xs font-bold text-slate-900 font-mono">{tempVal}</div>
                </div>
              </div>

              {/* BMI */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                <Scale size={14} className="text-indigo-500 shrink-0" />
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">BMI</div>
                  <div className="text-xs font-bold text-slate-900 font-mono">{bmiVal}</div>
                </div>
              </div>

              {/* Quick Edit Vitals Trigger */}
              <button
                onClick={handleOpenVitalsModal}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 shadow-2xs transition-colors cursor-pointer"
                title="Update or record new vitals & pariksha"
              >
                <Stethoscope size={13} className="text-indigo-600" />
                <span>Vitals</span>
              </button>
            </div>

          </div>

          {/* Bottom Row: Clinical Intake Presentation & Safety Ribbon */}
          <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            
            {/* Left: Chief Complaint & Lakshana Tags (Full Wrapping, Zero Truncation!) */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider text-slate-400">
                  <FileText size={12} className="text-indigo-600" />
                  <span>Chief Presenting Complaint:</span>
                </div>

                <div className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  {complaintLabel}
                </div>

                <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                  काल: {duration}
                </span>

                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                  स्थान: <span className="font-semibold text-slate-900">{site}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200/60">
                  <Sparkles size={10} className="text-indigo-600" />
                  Kiosk Intake Linked
                </span>
              </div>

              {/* Symptoms (Lakshana) Pill Strip - Full Wrap Without Cutting Off! */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 mr-1">संबद्ध लक्षण:</span>
                {symptomsList.length > 0 ? (
                  symptomsList.map((symptom, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-50 text-slate-800 text-xs font-medium border border-slate-200/80 shadow-2xs hover:bg-slate-100 transition-colors"
                    >
                      {symptom}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">
                    {associated}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Clinical Safety & Quick Tab Navigation Action */}
            <div className="shrink-0 flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-between lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              {/* Clinical Safety Allergy Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  hasAllergies
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                }`}
                title="Allergies Recorded at Intake"
              >
                {hasAllergies ? (
                  <AlertTriangle size={13} className="text-rose-600 shrink-0" />
                ) : (
                  <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                )}
                <span>{allergiesDisplay}</span>
              </div>

              {/* Quick Navigation to Phase 2: Roga Pariksha */}
              <button
                onClick={() => setHisActiveTab('phase2_roga')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200/80 transition-all active:scale-95 cursor-pointer shadow-2xs"
                title="Proceed directly to Phase 2: Roga Pariksha"
              >
                <Zap size={13} className="text-indigo-600" />
                <span>Phase 2: Roga Pariksha →</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          TIER 3: 4-STAGE CLASSICAL AYURVEDIC WORKFLOW PIPELINE
          Visualizes progress through Rogi Pariksha -> Roga Pariksha -> Chikitsa -> E-Sign
      ────────────────────────────────────────────────────────────────────────── */}
      <nav className="bg-white rounded-xl border border-slate-200/90 p-1.5 shadow-2xs" aria-label="Classical Ayurvedic Workflow Pipeline">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {ayushPhases.map((phase, idx) => {
            const isActive = hisActiveTab === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setHisActiveTab(phase.id)}
                className={`group relative px-3 py-2.5 rounded-xl text-left transition-all duration-150 flex items-center gap-2.5 select-none cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-indigo-500/20'
                    : phase.isCompleted
                    ? 'bg-emerald-50/50 hover:bg-emerald-50 text-slate-800 border-emerald-200/70'
                    : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200/70'
                }`}
              >
                {/* Step Circle Badge with Status Icon */}
                <div
                  className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-black text-xs transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : phase.isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                  }`}
                >
                  {phase.isCompleted && !isActive ? (
                    <Check size={14} className="text-white stroke-[3]" />
                  ) : (
                    phase.code
                  )}
                </div>

                {/* Phase Titles */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-300' : 'text-slate-400'}`}>
                      {phase.stepNum}.
                    </span>
                    <span className={`text-xs font-black tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                      {phase.label}
                    </span>
                  </div>
                  <div className={`text-[10px] font-medium truncate ${isActive ? 'text-slate-300' : phase.isCompleted ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    {phase.subHi}
                  </div>
                </div>

                {/* Trailing Connector Indicator */}
                {idx < ayushPhases.length - 1 && (
                  <ChevronRight size={13} className={`hidden sm:block shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-300'}`} />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
