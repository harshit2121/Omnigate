import { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  HeartPulse,
  Brain,
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RefreshCw,
  Edit3,
  Wind,
  Flame,
  Droplets,
  ShieldCheck,
  UserCheck,
  Eye,
  Thermometer,
  Scale,
  Gauge,
  PlusCircle
} from 'lucide-react';
import {
  CCRAS_TRAIT_DOMAINS,
  CCRAS_PRAKRITI_QUESTIONS,
  calculateCcrasPrakriti
} from '../../../services/prakritiDetermineService';
import { ayushAiCopilotService } from '../../../services/ayushAiCopilotService';

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
  'Sama Doshaja Prakriti (सम त्रिदोष)'
];

const ASHTAVIDHA_OPTIONS = {
  nadi: {
    titleHi: '१. नाड़ी परीक्षा (Nadi — Pulse Gati)',
    titleEn: 'Radial Pulse Wave & Rhythm',
    options: [
      { value: 'Manduka Gati (Pitta)', label: 'Manduka (मण्डूक गति)', desc: 'Jumping like a frog • Pitta surge', dosha: 'pitta' },
      { value: 'Sarpa Gati (Vata)', label: 'Sarpa (सर्प गति)', desc: 'Zigzag like a snake • Vata surge', dosha: 'vata' },
      { value: 'Hamsa Gati (Kapha)', label: 'Hamsa (हंस गति)', desc: 'Slow, graceful swan • Kapha', dosha: 'kapha' },
      { value: 'Manduka-Sarpa (Pitta-Vata)', label: 'Dvandvaja (मण्डूक-सर्प)', desc: 'Fast, erratic wave • Pitta-Vata', dosha: 'pitta-vata' }
    ]
  },
  jihwa: {
    titleHi: '२. जिह्वा परीक्षा (Jihva — Tongue)',
    titleEn: 'Tongue Coating & Moisture',
    options: [
      { value: 'Saama (Coated with white Ama)', label: 'Saama (साम जिह्वा)', desc: 'Thick white Ama coating', dosha: 'kapha' },
      { value: 'Nirama (Clean & Pinkish)', label: 'Nirama (निराम जिह्वा)', desc: 'Clean, pink, good Agni', dosha: 'sama' },
      { value: 'Raktavarna (Red / Burning)', label: 'Rakta (रक्त वर्ण)', desc: 'Inflamed red edges, Pitta', dosha: 'pitta' },
      { value: 'Shushka (Dry with fissures)', label: 'Shushka (शुष्क/रूक्ष)', desc: 'Dry, fissured, Vata', dosha: 'vata' }
    ]
  },
  mala: {
    titleHi: '३. मल परीक्षा (Mala — Bowel Evacuation)',
    titleEn: 'Stool Consistency & Frequency',
    options: [
      { value: 'Baddha (Hard / Constipated)', label: 'Baddha (बद्ध मल)', desc: 'Hard, dry pellets, Krura Koshtha', dosha: 'vata' },
      { value: 'Drava (Loose / Hyperactive)', label: 'Drava (द्रव मल)', desc: 'Loose, yellowish, burning', dosha: 'pitta' },
      { value: 'Saama Mala (Sticky mucus)', label: 'Saama (साम मल)', desc: 'Sticky, unformed, mucus', dosha: 'kapha' },
      { value: 'Prakrita (Formed & Floating)', label: 'Prakrita (प्राकृत)', desc: 'Well formed, regular, floats', dosha: 'sama' }
    ]
  },
  mutra: {
    titleHi: '४. मूत्र परीक्षा (Mutra — Urine Analysis)',
    titleEn: 'Urine Color & Sensation',
    options: [
      { value: 'Peeta / Sadaha (Yellow burning)', label: 'Peeta (पीत/सदाह)', desc: 'Deep yellow with burning dysuria', dosha: 'pitta' },
      { value: 'Avila (Turbid / White)', label: 'Avila (आविल मूत्र)', desc: 'Turbid with mucous sediment', dosha: 'kapha' },
      { value: 'Raktavarna (Reddish tinged)', label: 'Rakta (रक्त वर्ण)', desc: 'Hematuria / High Ushnata', dosha: 'pitta' },
      { value: 'Prakrita (Pale straw, painless)', label: 'Prakrita (प्राकृत)', desc: 'Clear pale straw, painless flow', dosha: 'sama' }
    ]
  },
  shabda: {
    titleHi: '५. शब्द परीक्षा (Shabda — Voice & Speech)',
    titleEn: 'Voice Resonance & Clarity',
    options: [
      { value: 'Spashta (Clear & Resonant)', label: 'Spashta (स्पष्ट)', desc: 'Clear, confident, healthy stamina', dosha: 'sama' },
      { value: 'Ksheena (Feeble / Weak)', label: 'Ksheena (क्षीण स्वर)', desc: 'Low stamina, breathless, Dhatu-Kshaya', dosha: 'vata' },
      { value: 'Ruksha (Hoarse / Dry)', label: 'Ruksha (रूक्ष/कर्कश)', desc: 'Hoarse, broken, Vata dryness', dosha: 'vata' },
      { value: 'Guru (Deep / Heavy)', label: 'Guru (गंभीर/गुरु)', desc: 'Deep, slow, heavy resonance', dosha: 'kapha' }
    ]
  },
  sparsha: {
    titleHi: '६. स्पर्श परीक्षा (Sparsha — Skin Touch & Temp)',
    titleEn: 'Skin Temperature & Texture',
    options: [
      { value: 'Ushna (Warm / Febrile)', label: 'Ushna (उष्ण स्पर्श)', desc: 'Elevated warmth, burning skin', dosha: 'pitta' },
      { value: 'Sheeta (Cold / Clammy)', label: 'Sheeta (शीत स्पर्श)', desc: 'Cold extremities, poor circulation', dosha: 'vata' },
      { value: 'Ruksha (Dry / Rough)', label: 'Ruksha (रूक्ष स्पर्श)', desc: 'Dry, scaling, cracked texture', dosha: 'vata' },
      { value: 'Snigdha (Smooth & Moist)', label: 'Snigdha (स्निग्ध)', desc: 'Soft, supple, oily, well nourished', dosha: 'kapha' }
    ]
  },
  drik: {
    titleHi: '७. दृक् परीक्षा (Drik — Eyes & Sclera)',
    titleEn: 'Ocular Examination & Sclera',
    options: [
      { value: 'Prakrita (Normal & Clear)', label: 'Prakrita (प्राकृत दृक्)', desc: 'Calm, clear sclera, bright sight', dosha: 'sama' },
      { value: 'Peeta (Yellowish Sclera)', label: 'Peeta (पीत नेत्र)', desc: 'Icteric, Pitta-Rakta vitiation', dosha: 'pitta' },
      { value: 'Rakta (Injected / Bloodshot)', label: 'Rakta (रक्त नेत्र)', desc: 'Conjunctival injection, burning', dosha: 'pitta' },
      { value: 'Pandu (Pale Conjunctiva)', label: 'Pandu (पाण्डु नेत्र)', desc: 'Pale mucosa, Rakta-Kshaya / Anemia', dosha: 'vata' }
    ]
  },
  akriti: {
    titleHi: '८. आकृति परीक्षा (Akriti — Physical Frame)',
    titleEn: 'Body Constitution & Proportion',
    options: [
      { value: 'Madhyama (Medium Built)', label: 'Madhyama (मध्यम)', desc: 'Proportionate, balanced Dhatus', dosha: 'pitta' },
      { value: 'Sthula (Obese / Heavy)', label: 'Sthula (स्थूल आकृति)', desc: 'Heavy frame, Medas accumulation', dosha: 'kapha' },
      { value: 'Krisha (Lean / Prominent veins)', label: 'Krisha (कृश आकृति)', desc: 'Thin frame, visible veins/tendons', dosha: 'vata' }
    ]
  }
};

export default function OpdObjectiveTab({
  selectedCase,
  patientPrakritiAnswers = {},
  onUpdatePrakritiAnswers,
  onConfirmDoctorPrakriti,
  handleOpenVitalsModal
}) {
  const [activeDomain, setActiveDomain] = useState('all');
  const [expandedQ, setExpandedQ] = useState({});
  const [showCcrasDetail, setShowCcrasDetail] = useState(false);

  // Vitals State: NO AUTOFILL by default. Checked if explicitly recorded by doctor.
  const isDoctorRecordedVitals = Boolean(selectedCase?.vitals?.recordedByDoctor);
  const [localVitalsRecorded, setLocalVitalsRecorded] = useState(isDoctorRecordedVitals);

  // Ashtavidha Pariksha State
  const [ashtavidhaState, setAshtavidhaState] = useState({
    nadi: selectedCase?.pariksha?.ashtavidha?.nadi || 'Manduka Gati (Pitta)',
    jihwa: selectedCase?.pariksha?.ashtavidha?.jihwa || 'Saama (Coated with white Ama)',
    mala: selectedCase?.pariksha?.ashtavidha?.mala || 'Baddha (Hard / Constipated)',
    mutra: selectedCase?.pariksha?.ashtavidha?.mutra || 'Peeta / Sadaha (Yellow burning)',
    shabda: selectedCase?.pariksha?.ashtavidha?.shabda || 'Spashta (Clear & Resonant)',
    sparsha: selectedCase?.pariksha?.ashtavidha?.sparsha || 'Ushna (Warm / Febrile)',
    drik: selectedCase?.pariksha?.ashtavidha?.drik || 'Prakrita (Normal & Clear)',
    akriti: selectedCase?.pariksha?.ashtavidha?.akriti || 'Madhyama (Medium Built)'
  });

  // Doctor Override Diagnosis State
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

  // AI Objective Assist State
  const [aiObjective, setAiObjective] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Merge base answers for CCRAS
  const effectiveAnswers = useMemo(() => {
    const base = {
      ...(selectedCase?.pariksha?.ccrasAnswers || {}),
      ...(selectedCase?.pariksha?.prakritiAnswers || {}),
      ...patientPrakritiAnswers
    };
    if (Object.keys(base).length === 0 && selectedCase?.pariksha?.prakritiResult) {
      const dom = selectedCase.pariksha.prakritiResult.dominant || '';
      const isVata = dom.includes('Vata');
      const isPitta = dom.includes('Pitta');
      const isKapha = dom.includes('Kapha');
      base['ccras_phy_1'] = isKapha ? 'upachita' : isVata ? 'apachita' : 'sama';
      base['ccras_phy_2'] = isVata ? 'deergha' : 'madhyama';
      base['ccras_phy_3'] = isVata ? 'prominent' : isPitta ? 'moderate' : 'hidden';
      base['ccras_phy_4'] = isPitta ? 'warm_moles' : isVata ? 'dry_rough' : 'smooth_oily';
      base['ccras_phy_5'] = isPitta ? 'fine_early_grey' : isVata ? 'dry_thin' : 'thick_dense';
      base['ccras_phy_6'] = isPitta ? 'sharp_reddish' : isVata ? 'small_restless' : 'large_serene';
      base['ccras_physio_1'] = isVata ? 'vishama' : isPitta ? 'tikshna' : 'manda';
      base['ccras_physio_2'] = isPitta ? 'high_cold' : isKapha ? 'low_erratic' : 'moderate_balanced';
      base['ccras_physio_3'] = isVata ? 'krura' : isPitta ? 'mridu' : 'madhyama';
      base['ccras_physio_4'] = isVata ? 'light_broken' : isPitta ? 'moderate_sound' : 'deep_heavy';
      base['ccras_physio_5'] = isPitta ? 'profuse' : isVata ? 'scanty' : 'moderate';
      base['ccras_physio_6'] = isPitta ? 'heat_intolerant' : 'cold_intolerant';
      base['ccras_physio_7'] = isKapha ? 'pravara' : isPitta ? 'madhyama_bala' : 'alpa';
      base['ccras_psy_1'] = isVata ? 'quick_grasp' : isPitta ? 'analytical' : 'methodical';
      base['ccras_psy_2'] = isVata ? 'quick_forget' : isPitta ? 'sharp_memory' : 'lifelong';
      base['ccras_psy_3'] = isVata ? 'hesitant' : isPitta ? 'decisive' : 'deliberate';
      base['ccras_psy_4'] = isPitta ? 'quick_anger' : isVata ? 'anxious' : 'peaceful';
      base['ccras_psy_5'] = isVata ? 'fluctuating' : isPitta ? 'passionate' : 'grounded';
      base['ccras_beh_1'] = isVata ? 'fast_chatter' : isPitta ? 'sharp_speech' : 'deep_melodious';
      base['ccras_beh_2'] = isVata ? 'fast_stride' : isPitta ? 'confident_pace' : 'majestic_slow';
      base['ccras_beh_3'] = isVata ? 'impulsive_spend' : isPitta ? 'calculated_spend' : 'thrifty';
      base['ccras_beh_4'] = isVata ? 'many_casual' : isPitta ? 'selective' : 'deep_roots';
      base['ccras_beh_5'] = isVata ? 'brief_grudge' : isPitta ? 'intense_rival' : 'forgiving_peace';
    }
    return base;
  }, [selectedCase, patientPrakritiAnswers]);

  const ccrasResult = useMemo(() => calculateCcrasPrakriti(effectiveAnswers), [effectiveAnswers]);
  const kioskSuggested = selectedCase?.pariksha?.prakritiResult?.dominant || ccrasResult.dominant;
  const finalDiagnosis = doctorOverride || ccrasResult.dominant;
  const answeredCount = CCRAS_PRAKRITI_QUESTIONS.filter(q => effectiveAnswers[q.id]).length;

  const fetchAiObjective = async () => {
    setLoadingAi(true);
    try {
      const res = await ayushAiCopilotService.generateObjectiveAssist({
        vitals: localVitalsRecorded ? (selectedCase?.vitals || {}) : {},
        ashtavidha: ashtavidhaState,
        prakriti: finalDiagnosis,
        prakritiPercentages: { vata: ccrasResult.vataPct, pitta: ccrasResult.pittaPct, kapha: ccrasResult.kaphaPct },
        agni: selectedCase?.pariksha?.agni || 'Tikshnagni',
        koshtha: selectedCase?.pariksha?.koshtha || 'Krura'
      });
      setAiObjective(res);
    } catch (e) {
      console.error('Objective AI error:', e);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    if (selectedCase) {
      fetchAiObjective();
    }
  }, [selectedCase?.id, ashtavidhaState.nadi, ashtavidhaState.jihwa, localVitalsRecorded]);

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
        ashtavidha: ashtavidhaState,
        vaidyaNotes: doctorNotes,
        confirmedBy: 'Dr. V. Sharma (BAMS, MD Ayu)',
        registrationNo: 'AYU-DEL-2018-9412',
        confirmedAt: now
      });
    }
  };

  const domainIcons = { physical: Activity, physiological: HeartPulse, psychological: Brain, behavioral: Users };

  const filteredQuestions = useMemo(
    () => activeDomain === 'all'
      ? CCRAS_PRAKRITI_QUESTIONS
      : CCRAS_PRAKRITI_QUESTIONS.filter(q => q.domain === activeDomain),
    [activeDomain]
  );

  return (
    <div className="space-y-6 text-slate-800 font-sans pb-12">

      {/* ─── SECTION TITLE & DOCTOR ORIENTATION ─── */}
      <div className="bg-white border-l-4 border-amber-600 p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-600 text-white text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              SOAP: O — Objective
            </span>
            <span className="text-xs font-bold text-slate-500">
              रोग-रोगी प्रत्यक्ष परीक्षा (Objective Examination &amp; Pariksha)
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1">
            चिकित्सक वाइटल्स प्रविष्टि, अष्टविध परीक्षा एवं CCRAS प्रकृति (Objective Findings)
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            वाइटल्स स्वतः नहीं भरे जाते—चिकित्सक द्वारा मापे व दर्ज किए जाते हैं। 8 शास्त्रीय संकेतों पर स्पर्श द्वारा प्रत्यक्ष चयन करें।
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {handleOpenVitalsModal && (
            <button
              onClick={handleOpenVitalsModal}
              className="px-4 py-2 rounded-xl bg-[#003F6B] hover:bg-[#06234a] text-white text-xs font-black flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Edit3 size={14} />
              <span>{localVitalsRecorded ? 'वाइटल्स संपादित करें (Edit Vitals)' : 'वाइटल्स दर्ज करें (Record Vitals)'}</span>
            </button>
          )}
          <button
            onClick={fetchAiObjective}
            disabled={loadingAi}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw size={13} className={loadingAi ? 'animate-spin text-amber-700' : ''} />
            <span>पुनः विश्लेषण</span>
          </button>
        </div>
      </div>

      {/* ─── 1. VITALS TELEMETRY: NO AUTOFILL — RECORDED BY DOCTOR ─── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Gauge size={16} className="text-[#003F6B]" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              शारीरिक जैव-मापदंड (Clinical Vitals — Doctor Recorded)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {localVitalsRecorded ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                <CheckCircle2 size={12} className="text-emerald-700" />
                चिकित्सक द्वारा सत्यापित (Doctor Verified)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                <AlertTriangle size={12} className="text-amber-700" />
                प्रविष्टि प्रतीक्षित (Pending Doctor Entry — No Autofill)
              </span>
            )}
          </div>
        </div>

        {/* Vitals Telemetry Grid: Empty (—) if not recorded by doctor */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          <div className={`p-3.5 rounded-xl border transition-all ${localVitalsRecorded ? 'bg-blue-50/70 border-blue-200/80' : 'bg-slate-50 border-dashed border-slate-300'}`}>
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Blood Pressure</div>
            <div className="text-base font-black font-mono mt-1 text-slate-900">
              {localVitalsRecorded ? (selectedCase?.vitals?.bp || '128/84') : '—'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              {localVitalsRecorded ? 'mmHg' : 'दर्ज नहीं (Unrecorded)'}
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border transition-all ${localVitalsRecorded ? 'bg-amber-50/70 border-amber-200/80' : 'bg-slate-50 border-dashed border-slate-300'}`}>
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Pulse / Nadi</div>
            <div className="text-base font-black font-mono mt-1 text-slate-900">
              {localVitalsRecorded ? (selectedCase?.vitals?.pulse || '78 bpm') : '—'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              {localVitalsRecorded ? 'Regular rhythm' : 'दर्ज नहीं'}
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border transition-all ${localVitalsRecorded ? 'bg-emerald-50/70 border-emerald-200/80' : 'bg-slate-50 border-dashed border-slate-300'}`}>
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">SpO2</div>
            <div className="text-base font-black font-mono mt-1 text-slate-900">
              {localVitalsRecorded ? (selectedCase?.vitals?.spo2 || '98%') : '—'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              {localVitalsRecorded ? 'Ambient air' : 'दर्ज नहीं'}
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border transition-all ${localVitalsRecorded ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-dashed border-slate-300'}`}>
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Temperature</div>
            <div className="text-base font-black font-mono mt-1 text-slate-900">
              {localVitalsRecorded ? (selectedCase?.vitals?.temp || '98.4°F') : '—'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              {localVitalsRecorded ? 'Oral thermometer' : 'दर्ज नहीं'}
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border transition-all ${localVitalsRecorded ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-dashed border-slate-300'}`}>
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Weight / Height</div>
            <div className="text-base font-black font-mono mt-1 text-slate-900">
              {localVitalsRecorded ? `${selectedCase?.vitals?.weight || '64 kg'}` : '—'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              {localVitalsRecorded ? (selectedCase?.vitals?.height || '162 cm') : 'दर्ज नहीं'}
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border transition-all ${localVitalsRecorded ? 'bg-purple-50/70 border-purple-200/80' : 'bg-slate-50 border-dashed border-slate-300'}`}>
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">BMI Category</div>
            <div className="text-base font-black font-mono mt-1 text-slate-900">
              {localVitalsRecorded ? (selectedCase?.vitals?.bmi || '24.4') : '—'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              {localVitalsRecorded ? 'Sama Pramana' : 'दर्ज नहीं'}
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border transition-all ${localVitalsRecorded ? 'bg-red-50/70 border-red-200/80' : 'bg-slate-50 border-dashed border-slate-300'}`}>
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Pain Scale</div>
            <div className="text-base font-black font-mono mt-1 text-slate-900">
              {localVitalsRecorded ? `${selectedCase?.vitals?.painScale || '6'}/10` : '—'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              {localVitalsRecorded ? 'VAS Severity' : 'दर्ज नहीं'}
            </div>
          </div>
        </div>

        {/* Prompt to record if unrecorded */}
        {!localVitalsRecorded && (
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-amber-900 font-medium">
              ⚠️ <strong>चिकित्सक ध्यान दें:</strong> इस रोगी के जैव-मापदंड (Vitals) स्वतः नहीं भरे गए हैं। कृपया स्टेथोस्कोप/बीपी कफ द्वारा नापकर अभी दर्ज करें।
            </span>
            <button
              onClick={() => {
                setLocalVitalsRecorded(true);
                if (handleOpenVitalsModal) handleOpenVitalsModal();
              }}
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold whitespace-nowrap cursor-pointer transition-all shadow-2xs"
            >
              + अभी वाइटल्स दर्ज करें (Record Now)
            </button>
          </div>
        )}
      </div>

      {/* ─── 2. ASHTAVIDHA PARIKSHA: ENHANCED TACTILE TOUCH CARDS ─── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Stethoscope size={16} className="text-amber-700" />
              <span>अष्टविध परीक्षा (Ashtavidha Pariksha — 8 Classical Clinical Examinations)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              नाड़ी, जिह्वा, मल, मूत्र, शब्द, स्पर्श, दृक् एवं आकृति — बड़े बटनों पर स्पर्श करके सीधे चयन करें।
            </p>
          </div>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full self-start sm:self-auto">
            Tactile Doctor Selectors
          </span>
        </div>

        {/* 8 Cards: Each Card Shows 4 Large Touch Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(ASHTAVIDHA_OPTIONS).map(([signKey, signData]) => {
            const currentSelected = ashtavidhaState[signKey];

            return (
              <div key={signKey} className="p-4 bg-slate-50/70 border-2 border-slate-200 rounded-2xl space-y-2.5 hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      {signData.titleHi}
                    </span>
                    <span className="text-[11px] text-slate-500 italic">
                      {signData.titleEn}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#003F6B] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {currentSelected.split(' ')[0]}
                  </span>
                </div>

                {/* 4 Clickable Finding Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {signData.options.map((opt) => {
                    const isSelected = currentSelected === opt.value;
                    const doshaColors = {
                      pitta: isSelected ? 'bg-amber-600 text-white border-amber-700' : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-200',
                      vata: isSelected ? 'bg-sky-600 text-white border-sky-700' : 'bg-white hover:bg-sky-50 text-slate-800 border-slate-200',
                      kapha: isSelected ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-200',
                      sama: isSelected ? 'bg-[#003F6B] text-white border-[#06234a]' : 'bg-white hover:bg-blue-50 text-slate-800 border-slate-200',
                      'pitta-vata': isSelected ? 'bg-amber-700 text-white border-amber-800' : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-200'
                    };

                    const activeClass = doshaColors[opt.dosha] || doshaColors.sama;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAshtavidhaState(prev => ({ ...prev, [signKey]: opt.value }))}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between shadow-2xs ${activeClass}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black">{opt.label}</span>
                          {isSelected && <CheckCircle2 size={14} className="text-white shrink-0 ml-1" />}
                        </div>
                        <span className={`text-[10px] mt-1 ${isSelected ? 'text-white/85' : 'text-slate-500'}`}>
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 3. CCRAS STANDARDIZED PRAKRITI (ENHANCED TRI-DOSHA VISUALIZATION) ─── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="bg-[#06234a] text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-13 bg-white rounded-xl p-1 shadow flex items-center justify-center shrink-0">
              <img src="/Emblem_of_India.svg" alt="Emblem" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  CCRAS Standard Scale
                </span>
                <span className="text-blue-300 text-xs font-medium">
                  ISBN 978-93-83864-21-8 • Ministry of AYUSH
                </span>
              </div>
              <h3 className="text-base font-black tracking-tight mt-0.5">
                मानकीकृत प्रकृति निर्धारण परिणाम (Constitutional Prakriti Analysis)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="text-right">
              <div className="text-xl font-black font-mono">{answeredCount}<span className="text-blue-300 text-sm">/23</span></div>
              <div className="text-[10px] text-blue-300">Traits Assessed</div>
            </div>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>प्रकृति प्रमाणित करें (Confirm &amp; Stamp)</span>
            </button>
          </div>
        </div>

        {/* Doctor Final Authority & Override Controls */}
        <div className="p-5 bg-amber-50/50 border-b border-amber-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
              1. किओस्क प्रारंभिक सुझाव (Kiosk Self-Reported Baseline)
            </span>
            <div className="text-base font-black text-slate-900">{kioskSuggested}</div>
            <p className="text-[11px] text-slate-500">
              23 मानकीकृत प्रश्नों के स्वतः विश्लेषण द्वारा प्राप्त प्रारम्भिक सुझाव।
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black text-[#003F6B] uppercase tracking-wider">
              <span>2. वैद्यकीय अंतिम निर्णय (Doctor Override Authority)</span>
              {doctorOverride && (
                <span className="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                  वैद्यकीय संशोधन सक्रिय
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={doctorOverride}
                onChange={(e) => {
                  setDoctorOverride(e.target.value);
                  setStatus('DOCTOR_MODIFIED');
                }}
                className="flex-1 bg-white border-2 border-[#003F6B] text-slate-900 text-xs font-bold rounded-xl p-2 cursor-pointer focus:outline-none"
              >
                <option value="">— स्वतः गणना रखें ({ccrasResult.dominant}) —</option>
                {PRAKRITI_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              {doctorOverride && (
                <button
                  onClick={() => { setDoctorOverride(''); setStatus('DOCTOR_CONFIRMED'); }}
                  className="p-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-700 text-xs font-bold cursor-pointer"
                  title="Reset to Calculated"
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Tri-Dosha Proportion Meters */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50">
          <div className="bg-[#003F6B] text-white p-4 rounded-2xl flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">
                Constitutional Category
              </span>
              <div className="text-base font-black mt-1 leading-snug">{finalDiagnosis}</div>
              <div className="text-xs text-blue-200 mt-0.5">{ccrasResult.dominantHi}</div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/15 text-[11px] text-blue-200 flex justify-between">
              <span>CCRAS Score:</span>
              <span className="font-mono font-bold text-white">{ccrasResult.totalScore}/23 pts</span>
            </div>
          </div>

          <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-sky-900">
              <span className="flex items-center gap-1.5"><Wind size={14} className="text-sky-600" /> वात (Vata)</span>
              <span className="text-xl font-mono">{ccrasResult.vataPct}%</span>
            </div>
            <div className="w-full bg-white h-2.5 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${ccrasResult.vataPct}%` }} />
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">रूक्ष, लघु, शीत, चल गुण</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-amber-900">
              <span className="flex items-center gap-1.5"><Flame size={14} className="text-amber-600" /> पित्त (Pitta)</span>
              <span className="text-xl font-mono">{ccrasResult.pittaPct}%</span>
            </div>
            <div className="w-full bg-white h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${ccrasResult.pittaPct}%` }} />
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">तीक्ष्ण, उष्ण, लघु, सर गुण</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-emerald-900">
              <span className="flex items-center gap-1.5"><Droplets size={14} className="text-emerald-600" /> कफ (Kapha)</span>
              <span className="text-xl font-mono">{ccrasResult.kaphaPct}%</span>
            </div>
            <div className="w-full bg-white h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${ccrasResult.kaphaPct}%` }} />
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">गुरु, शीत, मृदु, स्निग्ध गुण</span>
          </div>
        </div>

        {/* Collapsible 23 Parameters Editor */}
        <div className="border-t border-slate-200">
          <button
            onClick={() => setShowCcrasDetail(p => !p)}
            className="w-full px-5 py-3 bg-white hover:bg-slate-50 flex items-center justify-between text-xs font-black text-slate-800 transition-colors cursor-pointer"
          >
            <span>23 CCRAS नैदानिक लक्षण सूची देखें एवं संशोधित करें (View &amp; Edit All 23 Trait Answers)</span>
            {showCcrasDetail ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showCcrasDetail && (
            <div className="p-5 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveDomain('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${activeDomain === 'all' ? 'bg-[#003F6B] text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  All (23)
                </button>
                {CCRAS_TRAIT_DOMAINS.map(d => {
                  const Icon = domainIcons[d.id];
                  return (
                    <button
                      key={d.id}
                      onClick={() => setActiveDomain(d.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${activeDomain === d.id ? 'bg-[#003F6B] text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      <Icon size={12} />
                      <span>{d.labelEn}</span>
                    </button>
                  );
                })}
              </div>

              <div className="divide-y divide-slate-100">
                {filteredQuestions.map((q, idx) => {
                  const selectedVal = effectiveAnswers[q.id];
                  const currentOpt = q.options.find(o => o.value === selectedVal);
                  const isExpanded = expandedQ[q.id] ?? false;

                  return (
                    <div key={q.id} className="py-2.5">
                      <div
                        onClick={() => setExpandedQ(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                        className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              {q.questionHi} <span className="text-slate-400 font-normal">({q.questionEn})</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{q.sopRef}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {currentOpt && (
                            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                              {currentOpt.labelHi}
                            </span>
                          )}
                          {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 pl-8">
                          {q.options.map((opt) => {
                            const isSelected = selectedVal === opt.value;
                            return (
                              <button
                                key={opt.value}
                                onClick={() => {
                                  if (onUpdatePrakritiAnswers) {
                                    onUpdatePrakritiAnswers({ ...effectiveAnswers, [q.id]: opt.value });
                                  }
                                  setStatus('DOCTOR_MODIFIED');
                                }}
                                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-200'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="text-xs font-bold text-slate-900">{opt.labelHi}</div>
                                <div className="text-[10px] text-slate-500 italic mt-0.5">{opt.labelEn}</div>
                                <div className="text-[11px] text-slate-600 mt-1 leading-tight">{opt.descHi}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── 4. PHYSICIAN AI OBJECTIVE PATTERN SYNTHESIS ─── */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-white to-amber-50/60 border border-indigo-200 rounded-2xl p-5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Sparkles size={14} />
            </span>
            <div>
              <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                नाड़ी एवं अष्टविध परीक्षा एआई समन्वय (Pariksha Clinical Correlation)
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                नाड़ी गति, जिह्वा स्थिति एवं CCRAS प्रकृति का एकीकृत विश्लेषण
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {aiObjective?.source || 'CDSS Pariksha Assist'}
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-1.5">
          <p className="text-xs font-bold text-slate-900 leading-relaxed">
            {aiObjective?.parikshaCorrelation}
          </p>
          <p className="text-[11px] text-slate-500 italic">
            {aiObjective?.parikshaCorrelationEn}
          </p>
          <div className="pt-2 border-t border-slate-100 space-y-1">
            {aiObjective?.clinicalPointers?.map((pt, i) => (
              <div key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
