import { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  HeartPulse,
  Brain,
  Users,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronDown,
  ChevronUp,
  UserCheck,
  RotateCcw,
  Stethoscope,
  ClipboardList,
  Wind,
  Flame,
  Droplets,
  Edit3,
  FileText,
  Utensils,
  Sparkles,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import {
  CCRAS_TRAIT_DOMAINS,
  CCRAS_PRAKRITI_QUESTIONS,
  calculateCcrasPrakriti,
} from '../../../services/prakritiDetermineService';
import { ayushAiCopilotService } from '../../../services/ayushAiCopilotService';

/* ─── Dosha colour tokens ─────────────────────────────────────────────────── */
const DOSHA = {
  vata:  { label: 'Vata',  hi: 'वात',  bg: 'bg-sky-50',     border: 'border-sky-200',    pill: 'bg-sky-100 text-sky-800',          bar: 'bg-sky-500',     ring: 'ring-sky-200',   dot: 'bg-sky-500'     },
  pitta: { label: 'Pitta', hi: 'पित्त', bg: 'bg-amber-50',   border: 'border-amber-200',  pill: 'bg-amber-100 text-amber-800',      bar: 'bg-amber-500',   ring: 'ring-amber-200', dot: 'bg-amber-500'   },
  kapha: { label: 'Kapha', hi: 'कफ',   bg: 'bg-emerald-50', border: 'border-emerald-200', pill: 'bg-emerald-100 text-emerald-800',  bar: 'bg-emerald-500', ring: 'ring-emerald-200', dot: 'bg-emerald-500' },
};

const PRAKRITI_TYPES = [
  'Vata-Pitta Prakriti (वात-पित्त)',
  'Pitta-Vata Prakriti (पित्त-वात)',
  'Pitta-Kapha Prakriti (पित्त-कफ)',
  'Kapha-Pitta Prakriti (कफ-पित्त)',
  'Kapha-Vata Prakriti (कफ-वात)',
  'Vata-Kapha Prakriti (वात-कफ)',
  'Vata Pradhana Prakriti (केवल वात)',
  'Pitta Pradhana Prakriti (केवल पित्त)',
  'Kapha Pradhana Prakriti (केवल कफ)',
  'Sama Doshaja Prakriti (सम त्रिदोष)',
];

/* ─── Small reusables ─────────────────────────────────────────────────────── */
function DoshaGauge({ dosha, pct, pts }) {
  const d = DOSHA[dosha];
  const Icon = dosha === 'vata' ? Wind : dosha === 'pitta' ? Flame : Droplets;
  return (
    <div className={`${d.bg} ${d.border} border rounded-2xl p-4 space-y-3`}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
          <span className={`w-2 h-2 rounded-full ${d.dot}`} />
          <Icon size={13} className="opacity-60" />
          {d.label} <span className="font-normal opacity-60">({d.hi})</span>
        </span>
        <span className="text-2xl font-black font-mono text-slate-900">{pct}%</span>
      </div>
      <div className="w-full bg-white/80 h-3 rounded-full overflow-hidden">
        <div className={`${d.bar} h-full rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[11px] text-slate-500 font-medium">{pts} pts scored</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    DOCTOR_CONFIRMED: { cls: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: <CheckCircle2 size={12} />, label: 'Confirmed by Vaidya' },
    DOCTOR_MODIFIED:  { cls: 'bg-blue-100 text-blue-900 border-blue-300',          icon: <Edit3 size={12} />,        label: 'Modified by Vaidya' },
    PENDING_REVIEW:   { cls: 'bg-amber-100 text-amber-900 border-amber-300',        icon: <AlertTriangle size={12} />, label: 'Pending Review' },
  };
  const s = map[status] || map.PENDING_REVIEW;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function OpdCcrasPrakritiTab({
  selectedCase,
  patientPrakritiAnswers = {},
  onUpdatePrakritiAnswers,
  onConfirmDoctorPrakriti,
}) {
  const [activeDomain, setActiveDomain]   = useState('all');
  const [expandedQ, setExpandedQ]         = useState({});
  const [showTraitsPanel, setShowTraitsPanel] = useState(true);

  const [doctorOverride, setDoctorOverride] = useState(
    selectedCase?.pariksha?.doctorConfirmedPrakriti?.dominantOverride || ''
  );
  const [status, setStatus] = useState(
    selectedCase?.pariksha?.prakritiStatus || 'PENDING_REVIEW'
  );
  const [doctorNotes, setDoctorNotes] = useState(
    selectedCase?.pariksha?.doctorConfirmedPrakriti?.vaidyaNotes || ''
  );
  const [stampTime, setStampTime] = useState(
    selectedCase?.pariksha?.confirmedAt || ''
  );

  // Clinical insights — collapsed by default, no Gemini branding visible in UI
  const [aiInsights, setAiInsights]     = useState(null);
  const [aiLoading, setAiLoading]       = useState(false);
  const [showInsights, setShowInsights] = useState(false); // collapsed by default

  /* ── Effective answers ────────────────────────────────────────────────────── */
  const effectiveAnswers = useMemo(() => {
    const base = {
      ...(selectedCase?.pariksha?.ccrasAnswers || {}),
      ...(selectedCase?.pariksha?.prakritiAnswers || {}),
      ...patientPrakritiAnswers,
    };
    if (Object.keys(base).length === 0 && selectedCase?.pariksha?.prakritiResult) {
      const dom     = selectedCase.pariksha.prakritiResult.dominant || '';
      const isVata  = dom.includes('Vata');
      const isPitta = dom.includes('Pitta');
      const isKapha = dom.includes('Kapha');
      base['ccras_phy_1']    = isKapha ? 'upachita'        : isVata ? 'apachita'         : 'sama';
      base['ccras_phy_2']    = isVata  ? 'deergha'         : 'madhyama';
      base['ccras_phy_3']    = isVata  ? 'prominent'       : isPitta ? 'moderate'        : 'hidden';
      base['ccras_phy_4']    = isPitta ? 'warm_moles'      : isVata  ? 'dry_rough'       : 'smooth_oily';
      base['ccras_phy_5']    = isPitta ? 'fine_early_grey' : isVata  ? 'dry_thin'        : 'thick_dense';
      base['ccras_phy_6']    = isPitta ? 'sharp_reddish'   : isVata  ? 'small_restless'  : 'large_serene';
      base['ccras_physio_1'] = isVata  ? 'vishama'         : isPitta ? 'tikshna'         : 'manda';
      base['ccras_physio_2'] = isPitta ? 'high_cold'       : isKapha ? 'low_erratic'     : 'moderate_balanced';
      base['ccras_physio_3'] = isVata  ? 'krura'           : isPitta ? 'mridu'           : 'madhyama';
      base['ccras_physio_4'] = isVata  ? 'light_broken'    : isPitta ? 'moderate_sound'  : 'deep_heavy';
      base['ccras_physio_5'] = isPitta ? 'profuse'         : isVata  ? 'scanty'          : 'moderate';
      base['ccras_physio_6'] = isPitta ? 'heat_intolerant' : 'cold_intolerant';
      base['ccras_physio_7'] = isKapha ? 'pravara'         : isPitta ? 'madhyama_bala'   : 'alpa';
      base['ccras_psy_1']    = isVata  ? 'quick_grasp'     : isPitta ? 'analytical'      : 'methodical';
      base['ccras_psy_2']    = isVata  ? 'quick_forget'    : isPitta ? 'sharp_memory'    : 'lifelong';
      base['ccras_psy_3']    = isVata  ? 'hesitant'        : isPitta ? 'decisive'        : 'deliberate';
      base['ccras_psy_4']    = isPitta ? 'quick_anger'     : isVata  ? 'anxious'         : 'peaceful';
      base['ccras_psy_5']    = isVata  ? 'fluctuating'     : isPitta ? 'passionate'      : 'grounded';
      base['ccras_beh_1']    = isVata  ? 'fast_chatter'    : isPitta ? 'sharp_speech'    : 'deep_melodious';
      base['ccras_beh_2']    = isVata  ? 'fast_stride'     : isPitta ? 'confident_pace'  : 'majestic_slow';
      base['ccras_beh_3']    = isVata  ? 'impulsive_spend' : isPitta ? 'calculated_spend': 'thrifty';
      base['ccras_beh_4']    = isVata  ? 'many_casual'     : isPitta ? 'selective'       : 'deep_roots';
      base['ccras_beh_5']    = isVata  ? 'brief_grudge'    : isPitta ? 'intense_rival'   : 'forgiving_peace';
    }
    return base;
  }, [selectedCase, patientPrakritiAnswers]);

  const ccrasResult    = useMemo(() => calculateCcrasPrakriti(effectiveAnswers), [effectiveAnswers]);
  const kioskSuggested = selectedCase?.pariksha?.prakritiResult?.dominant || ccrasResult.dominant;
  const finalDiagnosis = doctorOverride || ccrasResult.dominant;
  const answeredCount  = CCRAS_PRAKRITI_QUESTIONS.filter(q => effectiveAnswers[q.id]).length;

  const totalPts = key =>
    ['physical', 'physiological', 'psychological', 'behavioral']
      .reduce((s, d) => s + (ccrasResult.domainScores?.[d]?.[key] || 0), 0);

  /* ── Handlers ─────────────────────────────────────────────────────────────── */
  const handleSelectOption = (qId, val) => {
    if (onUpdatePrakritiAnswers) onUpdatePrakritiAnswers({ ...effectiveAnswers, [qId]: val });
    setStatus('DOCTOR_MODIFIED');
  };

  const handleConfirm = () => {
    const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    setStampTime(now);
    setStatus(doctorOverride ? 'DOCTOR_MODIFIED' : 'DOCTOR_CONFIRMED');
    if (onConfirmDoctorPrakriti) {
      onConfirmDoctorPrakriti({
        dominant: finalDiagnosis,
        dominantHi: doctorOverride || ccrasResult.dominantHi,
        dominantOverride: doctorOverride,
        isModified: Boolean(doctorOverride),
        ccrasResult,
        answers: effectiveAnswers,
        kioskSuggestion: kioskSuggested,
        vaidyaNotes: doctorNotes,
        confirmedBy: 'Dr. V. Sharma (BAMS, MD Ayu)',
        registrationNo: 'AYU-DEL-2018-9412',
        confirmedAt: now,
      });
    }
  };

  const handleFetchInsights = async () => {
    setAiLoading(true);
    try {
      const insights = await ayushAiCopilotService.generateClinicalInsights({
        chiefComplaint: selectedCase?.intake?.complaintLabel || 'General Consultation',
        complaintId:    selectedCase?.intake?.complaintId || '',
        complaintDetails: selectedCase?.intake?.answers || {},
        prakriti: finalDiagnosis,
        prakritiPercentages: { vata: ccrasResult.vataPct, pitta: ccrasResult.pittaPct, kapha: ccrasResult.kaphaPct },
        vitals: selectedCase?.vitals || {},
        currentMedications: selectedCase?.intake?.currentMedications || [],
        patientAge:    selectedCase?.patient?.age || 45,
        patientGender: selectedCase?.patient?.gender || 'Female',
      });
      setAiInsights(insights);
    } catch (e) {
      console.error('Clinical insights error:', e);
    } finally {
      setAiLoading(false);
    }
  };

  // Fetch insights once when case loads (silently in background)
  useEffect(() => {
    if (selectedCase && !aiInsights && !aiLoading) handleFetchInsights();
  }, [selectedCase?.id]);

  const domainIcons = { physical: Activity, physiological: HeartPulse, psychological: Brain, behavioral: Users };

  const filteredQuestions = useMemo(
    () => activeDomain === 'all'
      ? CCRAS_PRAKRITI_QUESTIONS
      : CCRAS_PRAKRITI_QUESTIONS.filter(q => q.domain === activeDomain),
    [activeDomain]
  );

  /* ════════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-5 pb-16 font-sans text-slate-900">

      {/* ══════════════════════════════════════════════════════════════════════
          1. CCRAS OFFICIAL HEADER
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden border border-[#0a3569]/30 shadow-md">
        {/* Navy top band */}
        <div className="bg-[#06234a] px-5 py-4 flex items-center gap-4">
          <div className="w-12 h-14 bg-white rounded-xl p-1 shadow-md flex items-center justify-center shrink-0">
            <img src="/Emblem_of_India.svg" alt="Emblem of India" className="w-full h-full object-contain" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="bg-amber-400 text-[#06234a] text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md">
                CCRAS Certified
              </span>
              <span className="text-blue-300 text-[11px] font-medium">
                Ministry of AYUSH • ISBN 978-93-83864-21-8
              </span>
            </div>
            <h2 className="text-white text-lg sm:text-xl font-black tracking-tight leading-tight">
              मानकीकृत प्रकृति परीक्षण
              <span className="text-blue-300 font-normal text-sm ml-2">Prakriti Assessment</span>
            </h2>
            <p className="text-blue-300/80 text-[11px] mt-0.5">
              केन्द्रीय आयुर्वेदीय विज्ञान अनुसंधान परिषद — 23 नैदानिक मापदंड
            </p>
          </div>

          {/* Progress indicator */}
          <div className="shrink-0 text-right">
            <div className="text-2xl font-black font-mono text-white">
              {answeredCount}<span className="text-blue-400 text-base font-semibold">/23</span>
            </div>
            <div className="text-[10px] text-blue-400 font-medium">Parameters</div>
            <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden mt-1.5 ml-auto">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(answeredCount / 23) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Confirmation stamp (only after doctor signs) */}
        {stampTime && (
          <div className="bg-emerald-50 border-t border-emerald-200 px-5 py-2.5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-emerald-800 font-bold">
              <ShieldCheck size={15} className="text-emerald-600" />
              Confirmed — Dr. V. Sharma (BAMS, MD Ayu) · Reg. AYU-DEL-2018-9412
            </span>
            <span className="font-mono text-emerald-700">{stampTime}</span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. DOCTOR FINAL AUTHORITY PANEL
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-2 border-amber-300 rounded-2xl overflow-hidden shadow-sm">
        {/* Panel header */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 bg-[#06234a] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg">
              <Stethoscope size={12} /> Vaidya — Final Clinical Authority
            </span>
            <StatusBadge status={status} />
          </div>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow transition-all cursor-pointer"
          >
            <CheckCircle2 size={14} /> Sign &amp; Confirm Prakriti
          </button>
        </div>

        {/* Kiosk suggestion  vs  Doctor override — two-column */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Kiosk */}
          <div className="px-6 py-5 space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Patient Self-Report (Kiosk)
            </div>
            <div className="text-base font-black text-slate-800">{kioskSuggested}</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Auto-calculated from 23 answers submitted by patient at the kiosk touchscreen.
              This is a preliminary suggestion only.
            </p>
          </div>

          {/* Doctor override */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center gap-1.5 text-[10px] text-[#06234a] font-bold uppercase tracking-widest">
              <UserCheck size={12} /> Vaidya Clinical Diagnosis
              {doctorOverride && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 ml-1 normal-case tracking-normal">
                  Override Active
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={doctorOverride}
                onChange={e => { setDoctorOverride(e.target.value); setStatus('DOCTOR_MODIFIED'); }}
                className="flex-1 bg-slate-50 border-2 border-[#06234a] text-slate-900 text-xs font-bold rounded-xl p-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">— Accept calculated: {ccrasResult.dominant} —</option>
                {PRAKRITI_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {doctorOverride && (
                <button
                  onClick={() => { setDoctorOverride(''); setStatus('DOCTOR_CONFIRMED'); }}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                  title="Reset to calculated"
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </div>
            <textarea
              value={doctorNotes}
              onChange={e => setDoctorNotes(e.target.value)}
              rows={2}
              placeholder="Nadi Pariksha findings, clinical notes, modification rationale…"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. TRI-DOSHA SCORE OVERVIEW
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Final diagnosis hero card */}
        <div className="bg-[#06234a] text-white rounded-2xl p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mb-2">
              Final Prakriti
            </div>
            <div className="text-base font-black leading-snug">{finalDiagnosis}</div>
            <div className="text-blue-300 text-xs mt-1 font-medium">{ccrasResult.dominantHi}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-blue-300">
            <span>CCRAS Score</span>
            <span className="font-black font-mono text-white">{ccrasResult.totalScore} / 23</span>
          </div>
        </div>

        <DoshaGauge dosha="vata"  pct={ccrasResult.vataPct}  pts={totalPts('vata')}  />
        <DoshaGauge dosha="pitta" pct={ccrasResult.pittaPct} pts={totalPts('pitta')} />
        <DoshaGauge dosha="kapha" pct={ccrasResult.kaphaPct} pts={totalPts('kapha')} />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. 23 CCRAS CLINICAL PREDICTORS (DOCTOR EDITOR)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Collapsible header */}
        <button
          onClick={() => setShowTraitsPanel(p => !p)}
          className="w-full px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#06234a] flex items-center justify-center shrink-0">
              <ClipboardList size={15} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-slate-900">
                23 CCRAS Clinical Predictors
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {answeredCount}/23 recorded · Click any parameter to review or modify
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Domain filter — small pills in header */}
            <div className="hidden sm:flex items-center gap-1.5">
              {CCRAS_TRAIT_DOMAINS.map(d => {
                const Icon = domainIcons[d.id];
                const count = CCRAS_PRAKRITI_QUESTIONS.filter(q => q.domain === d.id).length;
                return (
                  <button
                    key={d.id}
                    onClick={e => { e.stopPropagation(); setActiveDomain(d.id); }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      activeDomain === d.id
                        ? 'bg-[#06234a] text-white'
                        : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    <Icon size={11} /> {d.labelEn} ({count})
                  </button>
                );
              })}
              <button
                onClick={e => { e.stopPropagation(); setActiveDomain('all'); }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                  activeDomain === 'all' ? 'bg-[#06234a] text-white' : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
                }`}
              >
                <Award size={11} /> All
              </button>
            </div>
            {showTraitsPanel
              ? <ChevronUp size={16} className="text-slate-400" />
              : <ChevronDown size={16} className="text-slate-400" />}
          </div>
        </button>

        {showTraitsPanel && (
          <div className="divide-y divide-slate-100">
            {filteredQuestions.map((q, idx) => {
              const selectedVal = effectiveAnswers[q.id];
              const currentOpt = q.options.find(o => o.value === selectedVal);
              const isOpen     = expandedQ[q.id] ?? false;
              const dKey       = currentOpt?.vata ? 'vata' : currentOpt?.pitta ? 'pitta' : currentOpt?.kapha ? 'kapha' : null;

              return (
                <div key={q.id}>
                  {/* Row — collapsed by default */}
                  <button
                    onClick={() => setExpandedQ(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                    className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    {/* Number badge */}
                    <span className={`w-7 h-7 shrink-0 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                      selectedVal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {idx + 1}
                    </span>

                    {/* Question label */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {q.questionHi}
                        <span className="text-slate-400 font-normal ml-1.5 text-[11px]">
                          ({q.questionEn})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {q.sopRef} · {q.classicalRef}
                      </div>
                    </div>

                    {/* Current selection pill */}
                    <div className="shrink-0 flex items-center gap-2">
                      {currentOpt ? (
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${dKey ? DOSHA[dKey].pill : 'bg-slate-100 text-slate-600'}`}>
                          {currentOpt.labelEn}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          Not answered
                        </span>
                      )}
                      {isOpen
                        ? <ChevronUp size={14} className="text-slate-400" />
                        : <ChevronDown size={14} className="text-slate-400" />}
                    </div>
                  </button>

                  {/* Expanded — doctor can pick a different option */}
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1">
                      <p className="text-[11px] text-slate-500 mb-3 italic">{q.descHi}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {q.options.map(opt => {
                          const isSelected = selectedVal === opt.value;
                          const od = DOSHA[opt.vata ? 'vata' : opt.pitta ? 'pitta' : 'kapha'];
                          return (
                            <div
                              key={opt.value}
                              onClick={() => handleSelectOption(q.id, opt.value)}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer select-none transition-all ${
                                isSelected
                                  ? `${od.border} ${od.bg} ring-2 ${od.ring}`
                                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <span className={`text-xs font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                  {opt.labelHi}
                                </span>
                                <div className={`w-4 h-4 mt-0.5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? `${od.dot} border-transparent` : 'border-slate-300'
                                }`}>
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-500 italic">{opt.labelEn}</p>
                              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{opt.descHi}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. CLINICAL INSIGHTS (compact accordion — collapsed by default)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        {/* Header — always visible */}
        <button
          onClick={() => setShowInsights(p => !p)}
          className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-indigo-500" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-slate-800 flex items-center gap-2">
                Clinical Insights
                {aiInsights && !aiLoading && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                    Ready
                  </span>
                )}
                {aiLoading && (
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <RefreshCw size={10} className="animate-spin" /> Generating…
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {aiInsights
                  ? aiInsights.chikitsaSutra?.substring(0, 72) + '…'
                  : 'Ayurvedic treatment insights based on Prakriti + Chief Complaint'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={e => { e.stopPropagation(); handleFetchInsights(); }}
              disabled={aiLoading}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 text-[11px] font-bold hover:bg-slate-100 flex items-center gap-1 cursor-pointer disabled:opacity-40"
            >
              <RefreshCw size={11} className={aiLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            {showInsights
              ? <ChevronUp size={15} className="text-slate-400" />
              : <ChevronDown size={15} className="text-slate-400" />}
          </div>
        </button>

        {/* Expanded detail */}
        {showInsights && (
          <div className="border-t border-slate-100 px-5 py-4">
            {aiInsights ? (
              <div className="space-y-4">

                {/* Dosha-Vyadhi correlation — one paragraph */}
                <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
                  <div className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-1.5">
                    Constitutional Correlation
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">{aiInsights.doshaVyadhiCorrelation}</p>
                  {aiInsights.doshaVyadhiCorrelationEn && (
                    <p className="text-[11px] text-slate-500 mt-1 italic">{aiInsights.doshaVyadhiCorrelationEn}</p>
                  )}
                </div>

                {/* Line of treatment + Formulations — side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Chikitsa Sutra */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5">
                    <div className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                      Line of Treatment
                    </div>
                    <p className="text-xs font-bold text-slate-900">{aiInsights.chikitsaSutraHi}</p>
                    <p className="text-[11px] text-amber-900 leading-relaxed">{aiInsights.chikitsaSutra}</p>
                    {aiInsights.dinacharyaYoga && (
                      <p className="text-[11px] text-slate-600 pt-2 border-t border-amber-200">
                        <span className="font-bold">Dinacharya: </span>{aiInsights.dinacharyaYoga}
                      </p>
                    )}
                  </div>

                  {/* Suggested formulations */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        Suggested Formulations ({aiInsights.recommendedFormulations?.length || 0})
                      </div>
                    </div>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-0.5">
                      {aiInsights.recommendedFormulations?.map((med, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex-1 space-y-0.5">
                            <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                              {med.name}
                              {med.kalpana && (
                                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">{med.kalpana}</span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">{med.dose} · {med.frequency}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-6 text-center text-sm text-slate-400">
                {aiLoading
                  ? <span className="flex items-center justify-center gap-2"><RefreshCw size={14} className="animate-spin text-indigo-400" /> Generating insights…</span>
                  : 'Click Refresh to generate clinical insights.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          6. PATHYA-APATHYA (only if data exists from service)
      ══════════════════════════════════════════════════════════════════════ */}
      {ccrasResult?.guidelines && (

        (ccrasResult.guidelines.pathya?.length > 0 || ccrasResult.guidelines.apathya?.length > 0)
      ) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ccrasResult.guidelines.pathya?.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-[11px] font-black text-emerald-900 uppercase tracking-wider">
                <Utensils size={13} /> Pathya — पथ्य (Recommended)
              </div>
              <ul className="space-y-1.5">
                {ccrasResult.guidelines.pathya.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {ccrasResult.guidelines.apathya?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-[11px] font-black text-red-900 uppercase tracking-wider">
                <AlertTriangle size={13} /> Apathya — अपथ्य (Avoid)
              </div>
              <ul className="space-y-1.5">
                {ccrasResult.guidelines.apathya.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-red-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          6. CCRAS REFERENCE FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          <FileText size={13} />
          CCRAS Standardized Prakriti Assessment Scale · ISBN 978-93-83864-21-8
        </span>
        <a
          href="/15032023_AYUR-PRAKRITI-WEB-PORTAL-Manual.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#06234a] hover:underline"
        >
          View SOP Manual ↗
        </a>
      </div>

    </div>
  );
}
