import { useState, useEffect } from 'react';
import {
  FileText,
  Activity,
  Flame,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Check,
  CheckCircle2,
  Lock,
  ChevronRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Search,
  ExternalLink,
  Plus,
  Trash2,
  Save
} from 'lucide-react';
import { ayushAiCopilotService } from '../../../services/ayushAiCopilotService';
import NidanAiCard from '../../ui/NidanAiCard';

/**
 * Reusable interactive item manager for Nidana Panchaka pillars
 * Supports: Active tag deletion, AI quick-select chips, custom input with Enter key
 */
function PanchakaItemManager({
  title,
  subtitle,
  items = [],
  onAddItem,
  onRemoveItem,
  suggestions = [],
  color = 'indigo',
  placeholder = 'Add new item...',
  prefix = '•'
}) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      onAddItem(text.trim());
      setText('');
    }
  };

  const availableSuggestions = (suggestions || []).filter(s => !items.includes(s));

  const colorStyles = {
    rose: {
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500',
      btn: 'bg-rose-700 hover:bg-rose-800'
    },
    amber: {
      badge: 'bg-amber-50 text-amber-900 border-amber-200',
      dot: 'bg-amber-500',
      btn: 'bg-amber-700 hover:bg-amber-800'
    },
    indigo: {
      badge: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      dot: 'bg-indigo-500',
      btn: 'bg-indigo-700 hover:bg-indigo-800'
    },
    emerald: {
      badge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      dot: 'bg-emerald-500',
      btn: 'bg-emerald-700 hover:bg-emerald-800'
    },
    teal: {
      badge: 'bg-teal-50 text-teal-900 border-teal-200',
      dot: 'bg-teal-500',
      btn: 'bg-teal-700 hover:bg-teal-800'
    }
  };

  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
          <span>{title}</span>
        </span>
        <span className="text-[10px] font-bold text-slate-400 font-mono">
          {items.length} दर्ज
        </span>
      </div>

      {subtitle && (
        <p className="text-[10px] text-slate-400 italic -mt-1">{subtitle}</p>
      )}

      {/* Active Recorded Badges */}
      <div className="flex flex-wrap gap-1.5 min-h-[26px] items-center">
        {items.length === 0 ? (
          <span className="text-[11px] text-slate-400 italic">None recorded</span>
        ) : (
          items.map((item, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-medium border shadow-3xs ${style.badge}`}
            >
              <span className="font-bold">{prefix}</span>
              <span className="truncate max-w-[260px]" title={item}>{item}</span>
              <button
                type="button"
                onClick={() => onRemoveItem(idx)}
                className="ml-0.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer text-xs leading-none"
                title="हटाएं (Remove)"
              >
                ✕
              </button>
            </span>
          ))
        )}
      </div>

      {/* Suggested Quick-Select Chips */}
      {availableSuggestions.length > 0 && (
        <div className="pt-1 border-t border-slate-200/60">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Sparkles size={10} className="text-amber-500" />
            <span>Nidan AI सुझाव (+ Click to Add):</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {availableSuggestions.slice(0, 4).map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onAddItem(sug)}
                className="text-[10px] font-medium bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 transition-all cursor-pointer truncate max-w-full flex items-center gap-1"
                title={sug}
              >
                <Plus size={9} className="text-indigo-600" />
                <span>{sug}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Input Field */}
      <div className="flex items-center gap-1 pt-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1 text-xs px-2.5 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!text.trim()}
          className={`px-2.5 py-1 rounded-lg ${style.btn} disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer shrink-0`}
        >
          + जोड़ें
        </button>
      </div>
    </div>
  );
}

export default function OpdRogaParikshaTab({
  selectedCase,
  assessmentNotes = '',
  onUpdateAssessmentNotes,
  confirmedDiagnosis,
  onConfirmDoctorDiagnosis
}) {
  const [aiData, setAiData] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [selectedDx, setSelectedDx] = useState(confirmedDiagnosis || null);
  const [savedNotice, setSavedNotice] = useState(false);

  // 1. Nidana States (Aharaja, Viharaja, Manasika)
  const [aharajaHetu, setAharajaHetu] = useState([]);
  const [viharajaHetu, setViharajaHetu] = useState([]);
  const [manasikaHetu, setManasikaHetu] = useState([]);

  // 2. Purvarupa & 3. Rupa States
  const [purvarupaList, setPurvarupaList] = useState([]);
  const [rupaList, setRupaList] = useState([]);

  // 4. Upashaya / Anupashaya States
  const [upashayaList, setUpashayaList] = useState([]);
  const [anupashayaList, setAnupashayaList] = useState([]);

  const roga = selectedCase?.rogaPariksha || {};
  const rogi = selectedCase?.rogiPariksha || {};
  const samprapti = roga.samprapti || {};
  const currentSamprapti = aiData?.ghatakas || samprapti;
  const diagnosticCodes = roga.diagnosticCodes || {};

  // Initialize fields on case selection
  useEffect(() => {
    if (!selectedCase) return;
    const intake = selectedCase?.intake || {};
    const existingRoga = selectedCase?.rogaPariksha || {};

    // Aharaja
    const initialAhara = (existingRoga.nidana?.aharaja && existingRoga.nidana.aharaja.length > 0)
      ? existingRoga.nidana.aharaja
      : (intake.triggers?.ahara && intake.triggers.ahara.length > 0)
      ? intake.triggers.ahara
      : [];
    setAharajaHetu(initialAhara);

    // Viharaja
    const initialVihara = (existingRoga.nidana?.viharaja && existingRoga.nidana.viharaja.length > 0)
      ? existingRoga.nidana.viharaja
      : (intake.triggers?.vihara && intake.triggers.vihara.length > 0)
      ? intake.triggers.vihara
      : [];
    setViharajaHetu(initialVihara);

    // Manasika
    const initialManasika = (existingRoga.nidana?.manasika && existingRoga.nidana.manasika.length > 0)
      ? existingRoga.nidana.manasika
      : (intake.triggers?.manasika && intake.triggers.manasika.length > 0)
      ? intake.triggers.manasika
      : [];
    setManasikaHetu(initialManasika);

    // Purvarupa
    setPurvarupaList(existingRoga.purvarupa || []);

    // Rupa (Pre-populate with chief complaint & associated symptoms)
    const initialRupa = (existingRoga.rupa && existingRoga.rupa.length > 0)
      ? existingRoga.rupa
      : [
          intake.chiefComplaint || selectedCase?.chiefComplaint,
          ...(intake.associatedSymptoms || [])
        ].filter(Boolean);
    setRupaList(initialRupa);

    // Upashaya / Anupashaya
    setUpashayaList(existingRoga.upashayaAnupashaya?.upashaya || []);
    setAnupashayaList(existingRoga.upashayaAnupashaya?.anupashaya || []);
  }, [selectedCase?.id]);

  const fetchRogaAi = async () => {
    setLoadingAi(true);
    try {
      const intake = selectedCase?.intake || {};
      const chiefComplaint = intake.chiefComplaint || intake.complaintLabelHi || intake.complaintLabel || rogi.lakshana?.chiefComplaint || selectedCase?.chiefComplaint || 'सामान्य बाह्य रोगी परामर्श';
      const complaintId = intake.complaintId || '';

      const res = await ayushAiCopilotService.generateAssessmentAssist({
        chiefComplaint,
        complaintId,
        socrates: rogi.lakshana || intake,
        kioskInquiries: intake.kioskInquiries || intake.aiInquiriesResponse || {},
        doctorSubjectiveNotes: assessmentNotes,
        prakriti: rogi.dashavidha?.prakriti?.dominant || selectedCase?.pariksha?.prakritiResult?.dominant || 'Pitta-Vata',
        prakritiPercentages: rogi.dashavidha?.prakriti?.scores || { vata: 35, pitta: 55, kapha: 10 },
        vitals: selectedCase?.vitals || selectedCase?.pariksha?.vitals || {},
        ashtavidha: rogi.ashtavidha || selectedCase?.pariksha?.ashtavidha || {},
        agni: rogi.dashavidha?.aharaShakti?.agni || selectedCase?.pariksha?.agni || 'Mandagni',
        koshtha: rogi.ashtavidha?.mala ? 'Krura' : (selectedCase?.pariksha?.koshtha || 'Madhyama')
      });
      setAiData(res);

      // Auto-populate empty fields with classical suggestions if currently empty
      if (aharajaHetu.length === 0 && res.nidana?.aharaja) {
        setAharajaHetu(res.nidana.aharaja);
      }
      if (viharajaHetu.length === 0 && res.nidana?.viharaja) {
        setViharajaHetu(res.nidana.viharaja);
      }
      if (manasikaHetu.length === 0 && res.nidana?.manasika) {
        setManasikaHetu(res.nidana.manasika);
      }
      if (purvarupaList.length === 0 && res.purvarupa) {
        setPurvarupaList(res.purvarupa);
      }
      if (res.rupa && res.rupa.length > 0) {
        setRupaList(prev => Array.from(new Set([...prev, ...res.rupa])));
      }
      if (upashayaList.length === 0 && res.upashayaAnupashaya?.upashaya) {
        setUpashayaList(res.upashayaAnupashaya.upashaya);
      }
      if (anupashayaList.length === 0 && res.upashayaAnupashaya?.anupashaya) {
        setAnupashayaList(res.upashayaAnupashaya.anupashaya);
      }
    } catch (e) {
      console.error('Roga Pariksha AI assist error:', e);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    if (selectedCase) {
      fetchRogaAi();
      setSelectedDx(confirmedDiagnosis || selectedCase.assessment?.confirmedDiagnosis || null);
    }
  }, [selectedCase?.id, confirmedDiagnosis]);

  // One-click populate all 5 pillars from Nidan AI
  const handleAutoFillAllFromAi = () => {
    if (!aiData) return;
    if (aiData.nidana?.aharaja) setAharajaHetu(aiData.nidana.aharaja);
    if (aiData.nidana?.viharaja) setViharajaHetu(aiData.nidana.viharaja);
    if (aiData.nidana?.manasika) setManasikaHetu(aiData.nidana.manasika);
    if (aiData.purvarupa) setPurvarupaList(aiData.purvarupa);
    if (aiData.rupa) {
      setRupaList(prev => Array.from(new Set([...prev, ...aiData.rupa])));
    }
    if (aiData.upashayaAnupashaya?.upashaya) setUpashayaList(aiData.upashayaAnupashaya.upashaya);
    if (aiData.upashayaAnupashaya?.anupashaya) setAnupashayaList(aiData.upashayaAnupashaya.anupashaya);

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // Compile full rogaPariksha payload
  const getCompiledRogaData = () => ({
    nidana: {
      aharaja: aharajaHetu,
      viharaja: viharajaHetu,
      manasika: manasikaHetu
    },
    purvarupa: purvarupaList,
    rupa: rupaList,
    upashayaAnupashaya: {
      upashaya: upashayaList,
      anupashaya: anupashayaList
    },
    samprapti: aiData?.ghatakas || samprapti,
    diagnosticCodes: {
      namasteTerm: selectedDx?.primaryDiagnosisHi || selectedDx?.nameHi || aiData?.primaryDiagnosisHi,
      namasteCode: selectedDx?.namasteCode || aiData?.namasteCode,
      icd11Code: selectedDx?.icd11Code || aiData?.icd11Code
    }
  });

  const handleSaveNidanaPanchaka = () => {
    const data = getCompiledRogaData();
    if (selectedCase) {
      selectedCase.rogaPariksha = data;
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  const handleConfirmDiagnosis = (dx) => {
    setSelectedDx(dx);
    const compiled = getCompiledRogaData();
    if (selectedCase) {
      selectedCase.rogaPariksha = compiled;
    }
    if (onConfirmDoctorDiagnosis) {
      onConfirmDoctorDiagnosis(dx, compiled);
    }
  };

  return (
    <div className="space-y-5 text-slate-800 font-sans pb-10">
      {/* ─── PHASE BANNER & DOCTOR ORIENTATION ─── */}
      <div className="bg-white border-l-4 border-amber-500 p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              Phase 2: Roga Pariksha (रोग परीक्षा)
            </span>
            <span className="text-xs font-bold text-slate-500">
              निदान पंचक एवं सम्प्राप्ति घटक (Disease Pathology &amp; Etiology)
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1">
            निदान, पूर्वरूप, रूप, उपशय-अनुपशय एवं सम्प्राप्ति (Nidana Panchaka Analysis)
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            रोगी के परीक्षणोपरांत रोग के मूल हेतु, प्रारम्भिक लक्षण, व्यक्त लक्षण, आहार-परीक्षण (उपशय) तथा षट्क्रियाकाल सम्प्राप्ति का शास्त्रीय निर्धारण किया जाता है।
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 shrink-0">
          <button
            onClick={handleAutoFillAllFromAi}
            disabled={!aiData}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-40"
            title="Nidan AI से सम्पूर्ण शास्त्रीय निदान पंचक स्वतः भरें"
          >
            <Sparkles size={13} className="text-amber-100" />
            <span>✨ Nidan AI से स्वतः भरें</span>
          </button>

          <button
            onClick={handleSaveNidanaPanchaka}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="रोग परीक्षा व निदान सुरक्षित करें"
          >
            <Save size={13} />
            <span>सुरक्षित करें (Save)</span>
          </button>

          <button
            onClick={fetchRogaAi}
            disabled={loadingAi}
            className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200 disabled:opacity-50"
            title="Refresh Nidan AI Pathology Synthesis"
          >
            <RefreshCw size={12} className={loadingAi ? 'animate-spin text-amber-600' : ''} />
            <span>{loadingAi ? 'विश्लेषण...' : 'पुनर्विश्लेषण'}</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>✓ निदान पंचक एवं सम्प्राप्ति सफलतापूर्वक सुरक्षित हो गई है! यह डेटा प्रिस्क्रिप्शन और क्लिनिकल समरी में जोड़ दिया गया है।</span>
        </div>
      )}

      {/* ─── NIDANA PANCHAKA 5-PILLAR GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT 6 COLS: NIDANA (ETIOLOGY), PURVARUPA, RUPA, UPASHAYA/ANUPASHAYA */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* 1. NIDANA (ETIOLOGICAL TRIGGERS: AHARAJA, VIHARAJA, MANASIKA) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                  <Flame size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    1. निदान (Nidana — Etiological Factors)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">आहारज, विहारज एवं मानसिक हेतु जिनकी वजह से दोष प्रकोपित हुए</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Hetu Identification
              </span>
            </div>

            <div className="space-y-3">
              {/* Aharaja */}
              <PanchakaItemManager
                title="आहारज हेतु (Dietary Triggers)"
                subtitle="विरुद्धाहार, अध्यशन, तीक्ष्ण/कटु/रूक्ष/शीत आहार"
                items={aharajaHetu}
                onAddItem={(item) => setAharajaHetu(prev => [...prev, item])}
                onRemoveItem={(idx) => setAharajaHetu(prev => prev.filter((_, i) => i !== idx))}
                suggestions={aiData?.nidana?.aharaja || []}
                color="rose"
                placeholder="उदा: वातिक आहार, अनियमित भोजन, रुक्ष अन्न..."
                prefix="•"
              />

              {/* Viharaja */}
              <PanchakaItemManager
                title="विहारज हेतु (Lifestyle Triggers)"
                subtitle="अतिव्यायाम, रात्रि जागरण, दिवास्वप्न, वेगविधारण"
                items={viharajaHetu}
                onAddItem={(item) => setViharajaHetu(prev => [...prev, item])}
                onRemoveItem={(idx) => setViharajaHetu(prev => prev.filter((_, i) => i !== idx))}
                suggestions={aiData?.nidana?.viharaja || []}
                color="amber"
                placeholder="उदा: रात्रि जागरण, भारी वजन उठाना, वेग संधारण..."
                prefix="•"
              />

              {/* Manasika */}
              <PanchakaItemManager
                title="मानसिक हेतु (Emotional / Mental Stressors)"
                subtitle="चिन्ता, शोक, क्रोध, भ्रांति, तनाव"
                items={manasikaHetu}
                onAddItem={(item) => setManasikaHetu(prev => [...prev, item])}
                onRemoveItem={(idx) => setManasikaHetu(prev => prev.filter((_, i) => i !== idx))}
                suggestions={aiData?.nidana?.manasika || []}
                color="indigo"
                placeholder="उदा: मानसिक तनाव, अत्यधिक चिन्ता..."
                prefix="•"
              />
            </div>
          </div>

          {/* 2. PURVARUPA & 3. RUPA (CLINICAL MANIFESTATION) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Activity size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    2. पूर्वरूप एवं 3. रूप (Purvarupa &amp; Manifested Rupa)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">रोगोत्पत्ति के प्रारम्भिक संकेत एवं व्यक्त लक्षण</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Lakshana Vimarsha
              </span>
            </div>

            <div className="space-y-3">
              {/* Purvarupa */}
              <PanchakaItemManager
                title="पूर्वरूप (Prodromal Signs)"
                subtitle="रोगोत्पत्ति से पूर्व के प्रारम्भिक अस्पष्ट लक्षण"
                items={purvarupaList}
                onAddItem={(item) => setPurvarupaList(prev => [...prev, item])}
                onRemoveItem={(idx) => setPurvarupaList(prev => prev.filter((_, i) => i !== idx))}
                suggestions={aiData?.purvarupa || []}
                color="amber"
                placeholder="उदा: हल्का भारीपन, संधि-अंगड़ाई, आलस्य..."
                prefix="•"
              />

              {/* Rupa */}
              <PanchakaItemManager
                title="व्यक्त रूप (Manifested Symptoms)"
                subtitle="रोग के व्यक्त लक्षण (Chief Complaint & Associated Symptoms)"
                items={rupaList}
                onAddItem={(item) => setRupaList(prev => [...prev, item])}
                onRemoveItem={(idx) => setRupaList(prev => prev.filter((_, i) => i !== idx))}
                suggestions={aiData?.rupa || []}
                color="rose"
                placeholder="उदा: सन्धिशूल, शोथ, संचलन में कष्ट..."
                prefix="•"
              />
            </div>
          </div>

          {/* 4. UPASHAYA / ANUPASHAYA (THERAPEUTIC TRIAL) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    4. उपशय एवं अनुपशय (Upashaya / Anupashaya — Therapeutic Trial)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">किन आहार, विहार अथवा उपचार से रोग घटता (उपशय) अथवा बढ़ता (अनुपशय) है</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Differential Test
              </span>
            </div>

            <div className="space-y-3">
              {/* Upashaya */}
              <PanchakaItemManager
                title="उपशय (Relieving Factors ✓)"
                subtitle="अनुकूल आहार, विहार, उष्णोपचार जिससे उपशम मिलता है"
                items={upashayaList}
                onAddItem={(item) => setUpashayaList(prev => [...prev, item])}
                onRemoveItem={(idx) => setUpashayaList(prev => prev.filter((_, i) => i !== idx))}
                suggestions={aiData?.upashayaAnupashaya?.upashaya || []}
                color="emerald"
                placeholder="उदा: उष्ण शेक, विश्राम, सुपाच्य भोजन..."
                prefix="✓"
              />

              {/* Anupashaya */}
              <PanchakaItemManager
                title="अनुपशय (Aggravating Factors ✗)"
                subtitle="प्रतिकूल आहार, विहार, शीत स्पर्श जिससे लक्षण बढ़ते हैं"
                items={anupashayaList}
                onAddItem={(item) => setAnupashayaList(prev => [...prev, item])}
                onRemoveItem={(idx) => setAnupashayaList(prev => prev.filter((_, i) => i !== idx))}
                suggestions={aiData?.upashayaAnupashaya?.anupashaya || []}
                color="rose"
                placeholder="उदा: शीत वायु, भारी कार्य, वातवर्धक भोजन..."
                prefix="✗"
              />
            </div>
          </div>

        </div>

        {/* RIGHT 6 COLS: SAMPRAPTI GHATAKAS & NIDAN AI DIAGNOSTIC COPILOT */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* NIDAN AI: DIAGNOSTIC COPILOT CARD */}
          <NidanAiCard title="Nidan AI: Rogi-Roga Synthesis & Diagnostic Differential">
            <div className="space-y-3 text-xs">
              {/* Correlation rationale */}
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80 text-indigo-950 font-medium leading-relaxed">
                <span className="font-bold text-indigo-900 block mb-0.5">नैदानिक सम्बद्धता (Clinical Synthesis):</span>
                {aiData?.correlationSummary || 'रोगी के व्यक्त लक्षण, नाड़ी-जिह्वा परीक्षा, तथा पूर्ववृत्त के आधार पर मुख्य व्याधि का निर्धारण किया गया है।'}
              </div>

              {/* Primary AI Suggested Diagnosis */}
              {(() => {
                const isConfirmed = Boolean(selectedDx);
                return (
                  <div className={`p-4 rounded-xl border transition-all ${
                    isConfirmed 
                      ? 'bg-emerald-50/40 border-emerald-300 shadow-xs' 
                      : 'bg-amber-50/25 border-amber-300 shadow-2xs'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        प्राथमिक निदान (Primary Diagnosis)
                      </span>
                      {isConfirmed ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-emerald-700" />
                          वैद्य द्वारा पुष्ट (Confirmed)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300 flex items-center gap-1">
                          <AlertCircle size={11} className="text-amber-700" />
                          Nidan AI सुझाव (पुष्टि प्रतीक्षित)
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-baseline justify-between gap-2 flex-wrap">
                      <div>
                        <h4 className="text-base font-black text-slate-900">
                          {selectedDx?.primaryDiagnosisHi || selectedDx?.nameHi || aiData?.primaryDiagnosisHi || diagnosticCodes.namasteTerm || (selectedCase?.intake?.chiefComplaint ? `${selectedCase.intake.chiefComplaint}` : 'निदान विचाराधीन (Diagnosis Pending)')}
                        </h4>
                        <p className="text-xs text-slate-600 font-semibold">
                          {selectedDx?.primaryDiagnosis || selectedDx?.name || aiData?.primaryDiagnosis || (selectedCase?.intake?.complaintLabel || 'Clinical assessment pending')}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {selectedDx?.namasteCode || aiData?.namasteCode || diagnosticCodes.namasteCode || 'AYU-DX-PENDING'}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {selectedDx?.icd11Code || aiData?.icd11Code || diagnosticCodes.icd11Code || 'TM1-PENDING'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] text-slate-600 font-medium">
                        {isConfirmed 
                          ? '✓ यह निदान आधिकारिक ई-प्रिस्क्रिप्शन हेतु पुष्ट कर दिया गया है।'
                          : 'वैद्य द्वारा रोगी के लक्षणों के आधार पर अंतिम पुष्टि आवश्यक है:'}
                      </span>
                      
                      <button
                        onClick={() => handleConfirmDiagnosis({
                          name: aiData?.primaryDiagnosis || diagnosticCodes.namasteTerm,
                          nameHi: aiData?.primaryDiagnosisHi || diagnosticCodes.namasteTerm,
                          namasteCode: aiData?.namasteCode || diagnosticCodes.namasteCode,
                          icd11Code: aiData?.icd11Code || diagnosticCodes.icd11Code,
                          timestamp: new Date().toLocaleTimeString()
                        })}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isConfirmed
                            ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                        }`}
                      >
                        <CheckCircle2 size={13} />
                        <span>{isConfirmed ? 'निदान पुष्ट (Confirmed ✓)' : 'पुष्टि करें (Confirm Diagnosis)'}</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Differentials */}
              {aiData?.differentialDiagnoses && aiData.differentialDiagnoses.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">भेदक निदान (Differential Considerations)</span>
                  {aiData.differentialDiagnoses.map((diff, i) => (
                    <div key={i} className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{diff.nameHi || diff.name}</span>
                        <span className="text-[10px] text-slate-500 ml-1.5">({diff.differentiatingFeature})</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {diff.namasteCode}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </NidanAiCard>

          {/* 5. SAMPRAPTI GHATAKAS MATRIX (PATHOGENESIS PATHWAY) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Zap size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    5. सम्प्राप्ति घटक (Samprapti Ghatakas — Pathophysiology)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">दोष-दूष्य सम्मूर्च्छना, स्रोतस एवं साध्यासाध्यता</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Shatkriyakala
              </span>
            </div>

            {/* Ghatakas Key-Value Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">दोष (Dosha)</span>
                <p className="font-bold text-slate-900 mt-0.5">{currentSamprapti.dosha || 'Pachaka Pitta, Samana Vata'}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">दूष्य (Dushya)</span>
                <p className="font-bold text-slate-900 mt-0.5">{currentSamprapti.dushya || 'Rasa Dhatu, Rakta'}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">स्रोतस (Srotas)</span>
                <p className="font-bold text-slate-900 mt-0.5">{currentSamprapti.srotas || 'Annavaha, Purishavaha'}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">दृष्टि प्रकार (Srotodushti)</span>
                <p className="font-bold text-slate-900 mt-0.5">{currentSamprapti.srotodushtiPrakara || 'Atipravritti & Sanga'}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">उद्भवस्थान (Origin)</span>
                <p className="font-bold text-slate-900 mt-0.5">{currentSamprapti.udbhavasthana || 'Amashaya'}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">रोगमार्ग (Rogamarga)</span>
                <p className="font-bold text-slate-900 mt-0.5">{currentSamprapti.rogamarga || 'Abhyantara Rogamarga'}</p>
              </div>

              <div className="col-span-2 sm:col-span-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">साध्यासाध्यता (Prognosis)</span>
                  <span className="font-black text-emerald-900 text-xs mt-0.5">{currentSamprapti.sadhyaAsadhyata || 'Sukhasadhya (Easily Curable)'}</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">
                  क्रीयाकाल: {currentSamprapti.kriyakalaStage || 'Vyakti Avastha'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
