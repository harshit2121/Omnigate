import { useState, useEffect } from 'react';
import {
  Utensils,
  Sun,
  Pill,
  Flower2,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  ShieldCheck,
  Flame,
  Calendar,
  Sparkles,
  Clock,
  Printer,
  Database,
  RefreshCw,
  Save,
  Check,
  ShieldAlert,
  Edit3
} from 'lucide-react';
import { ayushAiCopilotService } from '../../../services/ayushAiCopilotService';
import NidanAiCard from '../../ui/NidanAiCard';

export default function OpdChikitsaPlanTab({
  selectedCase,
  prescriptions = [],
  setPrescriptions,
  panchakarmaOrders = [],
  setPanchakarmaOrders,
  setShowApiImportModal,
  setShowPanchakarmaModal,
  onSaveChikitsaPlan
}) {
  const [activePlanLevel, setActivePlanLevel] = useState('all');
  const [loadingAiPlan, setLoadingAiPlan] = useState(false);
  const [aiPlanData, setAiPlanData] = useState(null);
  const [savedNotice, setSavedNotice] = useState(false);

  // 4-Tier Interactive Treatment Plan States
  const [sutraText, setSutraText] = useState('');
  const [nidanaParivarjanaList, setNidanaParivarjanaList] = useState([]);
  const [pathyaAharaList, setPathyaAharaList] = useState([]);
  const [apathyaAharaList, setApathyaAharaList] = useState([]);
  const [favRasa, setFavRasa] = useState('मधुर, तिक्त, कषाय');
  const [unfavRasa, setUnfavRasa] = useState('कटु, अम्ल, लवण');
  const [dinacharyaText, setDinacharyaText] = useState('');
  const [ritucharyaText, setRitucharyaText] = useState('');
  const [yogaText, setYogaText] = useState('');
  const [cdssAlerts, setCdssAlerts] = useState([]);

  // Inputs for adding individual tags
  const [newParivarjana, setNewParivarjana] = useState('');
  const [newPathya, setNewPathya] = useState('');
  const [newApathya, setNewApathya] = useState('');

  const [newShamanaMed, setNewShamanaMed] = useState({
    name: '',
    kalpana: 'Vati',
    dose: '250 mg',
    frequency: 'BD (Twice Daily)',
    kaala: 'Pragbhakta (Before Meals)',
    anupana: 'Lukewarm Water',
    duration: '15 Days',
    purpose: 'Deepana-Pachana'
  });

  const rogi = selectedCase?.rogiPariksha || {};
  const roga = selectedCase?.rogaPariksha || {};
  const chikitsa = selectedCase?.chikitsaPlan || {};
  const vyayamaShakti = rogi.dashavidha?.vyayamaShakti || {};

  // Initialize fields on case selection
  useEffect(() => {
    if (!selectedCase) return;
    const existingPlan = selectedCase.chikitsaPlan || {};

    setSutraText(existingPlan.sutra || '');
    setNidanaParivarjanaList(Array.isArray(existingPlan.nidanaParivarjana) ? existingPlan.nidanaParivarjana : []);
    
    // Ahara
    const ahara = existingPlan.ahara || {};
    const pathya = Array.isArray(ahara.pathya) ? ahara.pathya : (ahara.prescribedDiet ? [ahara.prescribedDiet] : []);
    const apathya = Array.isArray(ahara.apathya) ? ahara.apathya : (ahara.restrictedDiet ? [ahara.restrictedDiet] : []);
    setPathyaAharaList(pathya);
    setApathyaAharaList(apathya);
    setFavRasa(Array.isArray(ahara.favorableRasa) ? ahara.favorableRasa.join(', ') : (ahara.favorableRasa || 'मधुर, तिक्त, कषाय'));
    setUnfavRasa(Array.isArray(ahara.unfavorableRasa) ? ahara.unfavorableRasa.join(', ') : (ahara.unfavorableRasa || 'कटु, अम्ल, लवण'));

    // Vihara
    const vihara = existingPlan.vihara || {};
    setDinacharyaText(vihara.dinacharya || '');
    setRitucharyaText(vihara.ritucharya || '');
    setYogaText(vihara.yogaPranayama || '');
    setCdssAlerts(existingPlan.cdssCautions || []);

    // If plan is empty, trigger Nidan AI assist automatically
    if (!existingPlan.sutra && (!existingPlan.nidanaParivarjana || existingPlan.nidanaParivarjana.length === 0)) {
      fetchPlanAi();
    }
  }, [selectedCase?.id]);

  const fetchPlanAi = async () => {
    if (!selectedCase) return;
    setLoadingAiPlan(true);
    try {
      const intake = selectedCase?.intake || {};
      const assessment = selectedCase?.assessment || {};
      const confirmedDx = assessment.confirmedDiagnosis || selectedCase.assessment?.confirmedDiagnosis || null;
      const chiefComplaint = intake.chiefComplaint || intake.complaintLabelHi || intake.complaintLabel || rogi.lakshana?.chiefComplaint || selectedCase?.chiefComplaint || 'सामान्य बाह्य रोगी परामर्श';

      const res = await ayushAiCopilotService.generatePlanAssist({
        patientAge: selectedCase?.patient?.age || 45,
        patientGender: selectedCase?.patient?.gender || 'Female',
        chiefComplaint,
        complaintId: intake.complaintId || '',
        confirmedDiagnosis: confirmedDx,
        activeGhatakas: roga.samprapti || assessment.ghatakas || null,
        doctorSubjectiveNotes: selectedCase?.clinicalNotes || '',
        doctorAssessmentNotes: '',
        prakriti: rogi.dashavidha?.prakriti?.dominant || selectedCase?.pariksha?.prakritiResult?.dominant || 'Pitta-Vata',
        prakritiPercentages: rogi.dashavidha?.prakriti?.scores || { vata: 35, pitta: 55, kapha: 10 },
        vitals: selectedCase?.vitals || selectedCase?.pariksha?.vitals || {},
        ashtavidha: rogi.ashtavidha || selectedCase?.pariksha?.ashtavidha || {},
        agni: rogi.dashavidha?.aharaShakti?.agni || selectedCase?.pariksha?.agni || 'Mandagni',
        koshtha: selectedCase?.pariksha?.koshtha || 'Madhyama',
        currentMedications: intake.currentMedications || [],
        allergies: intake.knownAllergies || [],
        kioskInquiries: intake.kioskInquiries || intake.aiInquiriesResponse || {}
      });

      setAiPlanData(res);

      // Auto-populate empty fields with classical suggestions
      if (!sutraText && (res.chikitsaSutraHi || res.chikitsaSutra)) {
        setSutraText(res.chikitsaSutraHi || res.chikitsaSutra);
      }
      if (nidanaParivarjanaList.length === 0 && res.apathyaAhara) {
        setNidanaParivarjanaList(res.apathyaAhara.slice(0, 3));
      }
      if (pathyaAharaList.length === 0 && res.pathyaAhara) {
        setPathyaAharaList(res.pathyaAhara);
      }
      if (apathyaAharaList.length === 0 && res.apathyaAhara) {
        setApathyaAharaList(res.apathyaAhara);
      }
      if (!dinacharyaText && res.dinacharyaYoga) {
        setDinacharyaText(res.dinacharyaYoga);
        setYogaText(res.dinacharyaYoga);
      }
      if (res.cdssCautions && res.cdssCautions.length > 0) {
        setCdssAlerts(res.cdssCautions);
      }
    } catch (e) {
      console.error('Chikitsa Plan AI assist error:', e);
    } finally {
      setLoadingAiPlan(false);
    }
  };

  // 1-Click Auto-Fill entire 4-tier plan from Nidan AI
  const handleAutoFillAllTiersFromAi = () => {
    if (!aiPlanData) return;
    if (aiPlanData.chikitsaSutraHi || aiPlanData.chikitsaSutra) {
      setSutraText(aiPlanData.chikitsaSutraHi || aiPlanData.chikitsaSutra);
    }
    if (aiPlanData.apathyaAhara) {
      setNidanaParivarjanaList(aiPlanData.apathyaAhara);
      setApathyaAharaList(aiPlanData.apathyaAhara);
    }
    if (aiPlanData.pathyaAhara) {
      setPathyaAharaList(aiPlanData.pathyaAhara);
    }
    if (aiPlanData.dinacharyaYoga) {
      setDinacharyaText(aiPlanData.dinacharyaYoga);
      setYogaText(aiPlanData.dinacharyaYoga);
    }
    if (aiPlanData.recommendedFormulations && aiPlanData.recommendedFormulations.length > 0) {
      handleApplySuggestedMedications();
    }
    if (aiPlanData.panchakarmaProcedures && aiPlanData.panchakarmaProcedures.length > 0) {
      handleApplySuggestedShodhana();
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleApplySuggestedMedications = () => {
    const meds = aiPlanData?.recommendedFormulations || [];
    if (meds.length === 0) return;
    const formatted = meds.map((m, idx) => ({
      id: Date.now() + idx,
      name: m.name,
      kalpana: m.kalpana || 'Vati',
      type: m.kalpana || 'Classical Formulation',
      system: 'ayurvedic',
      dose: m.dose || '250 mg',
      frequency: m.frequency || 'BD (Twice Daily)',
      kaala: m.kaala || 'Pragbhakta (Before Meals)',
      anupana: m.anupana || 'Lukewarm Water',
      duration: m.duration || '15 Days',
      purpose: m.purpose || m.rationale || 'Shamana Chikitsa',
      source: 'Nidan AI Suggested Regimen'
    }));
    if (setPrescriptions) {
      setPrescriptions(formatted);
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  const handleApplySuggestedShodhana = () => {
    const procs = aiPlanData?.panchakarmaProcedures || [];
    if (procs.length === 0) return;
    const orders = procs.map((p, idx) => ({
      id: Date.now() + idx,
      procedure: p.procedure || p.protocolName || 'Mridu Virechana Karma',
      dravya: p.dravya || 'Classical Dravya as indicated',
      sessions: p.sessions || '7 Sessions',
      time: 'Pratah Kala (Early Morning)',
      notes: p.notes || `${p.pradhanakarma || ''} ${p.paschatkarma || ''}`.trim() || 'Samsarjana Krama 3-7 days'
    }));
    if (setPanchakarmaOrders) {
      setPanchakarmaOrders(orders);
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  const getCompiledChikitsaData = () => ({
    sutra: sutraText,
    nidanaParivarjana: nidanaParivarjanaList,
    ahara: {
      favorableRasa: favRasa.split(',').map(s => s.trim()),
      unfavorableRasa: unfavRasa.split(',').map(s => s.trim()),
      prescribedDiet: pathyaAharaList.join('; '),
      restrictedDiet: apathyaAharaList.join('; '),
      pathya: pathyaAharaList,
      apathya: apathyaAharaList
    },
    vihara: {
      dinacharya: dinacharyaText,
      ritucharya: ritucharyaText,
      yogaPranayama: yogaText
    },
    suggestedProtocol: {
      protocolTitle: aiPlanData?.chikitsaSutra || 'Classical Regimen',
      medications: aiPlanData?.recommendedFormulations || [],
      panchakarma: aiPlanData?.panchakarmaProcedures?.[0] || null
    },
    cdssCautions: cdssAlerts
  });

  const handleSaveChikitsaPlan = () => {
    const compiled = getCompiledChikitsaData();
    if (selectedCase) {
      selectedCase.chikitsaPlan = compiled;
    }
    if (onSaveChikitsaPlan) {
      onSaveChikitsaPlan(compiled);
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleAddShamana = (e) => {
    e.preventDefault();
    if (!newShamanaMed.name.trim()) return;
    const item = {
      id: Date.now(),
      ...newShamanaMed
    };
    if (setPrescriptions) {
      setPrescriptions(prev => [...prev, item]);
    }
    setNewShamanaMed({
      name: '',
      kalpana: 'Vati',
      dose: '250 mg',
      frequency: 'BD (Twice Daily)',
      kaala: 'Pragbhakta (Before Meals)',
      anupana: 'Lukewarm Water',
      duration: '15 Days',
      purpose: 'Deepana-Pachana'
    });
  };

  const handleRemoveShamana = (id) => {
    if (setPrescriptions) {
      setPrescriptions(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleClearPrescriptions = () => {
    if (setPrescriptions) {
      setPrescriptions([]);
    }
  };

  const suggestedMeds = (aiPlanData?.recommendedFormulations && aiPlanData.recommendedFormulations.length > 0)
    ? aiPlanData.recommendedFormulations
    : (chikitsa.suggestedProtocol?.medications || []);

  const suggestedPanchakarmaList = (aiPlanData?.panchakarmaProcedures && aiPlanData.panchakarmaProcedures.length > 0)
    ? aiPlanData.panchakarmaProcedures
    : (chikitsa.suggestedProtocol?.panchakarma ? [chikitsa.suggestedProtocol.panchakarma] : []);

  return (
    <div className="space-y-5 text-slate-800 font-sans pb-10">
      {/* ─── PHASE BANNER & DOCTOR ORIENTATION ─── */}
      <div className="bg-white border-l-4 border-teal-600 p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              Phase 3: Chikitsa Sutra &amp; Plan (चिकित्सा योजना)
            </span>
            <span className="text-xs font-bold text-slate-500">
              आहार, विहार, शमन एवं शोधन (Multi-Tiered Therapeutic Architecture)
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1">
            चतुर्विध चिकित्सा विधान (Targeted Diet, Lifestyle, Shamana &amp; Shodhana)
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            आयुर्वेदिक उपचार केवल दवा नहीं है। यहाँ 1. निदान परिवर्जन, 2. आहार, 3. विहार, तथा 4. औषध (व्यायाम शक्ति अनुसार शमन एवं शोधन) का समग्र विधान किया जाता है।
          </p>
        </div>

        {/* Nidan AI Actions & Save to Cloud DB */}
        <div className="flex items-center flex-wrap gap-2 shrink-0">
          <button
            onClick={handleAutoFillAllTiersFromAi}
            disabled={!aiPlanData || loadingAiPlan}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-40"
            title="Nidan AI से चारों स्तरों की शास्त्रीय चिकित्सा योजना स्वतः भरें"
          >
            <Sparkles size={13} className="text-teal-100" />
            <span>✨ Nidan AI से स्वतः भरें</span>
          </button>

          <button
            onClick={handleSaveChikitsaPlan}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="चिकित्सा योजना Supabase क्लाउड डेटाबेस में सुरक्षित करें"
          >
            <Save size={13} className="text-emerald-400" />
            <span>सुरक्षित करें (Save to DB)</span>
          </button>

          <button
            onClick={fetchPlanAi}
            disabled={loadingAiPlan}
            className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200 disabled:opacity-50"
            title="Refresh Nidan AI Treatment Synthesis"
          >
            <RefreshCw size={12} className={loadingAiPlan ? 'animate-spin text-teal-600' : ''} />
            <span>{loadingAiPlan ? 'संश्लेषण...' : 'पुनर्विश्लेषण'}</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>✓ चिकित्सा योजना (चतुर्विध चिकित्सा विधान) Supabase Cloud Database में सफलतापूर्वक सुरक्षित हो गई है!</span>
        </div>
      )}

      {/* Level Filter Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {[
          { id: 'all', label: 'समग्र योजना (All 4 Levels)' },
          { id: 'nidana', label: '1. निदान परिवर्जन' },
          { id: 'ahara', label: '2. आहार' },
          { id: 'vihara', label: '3. विहार' },
          { id: 'aushadha', label: '4. औषध (शमन/शोधन)' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setActivePlanLevel(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePlanLevel === f.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Classical Chikitsa Sutra Ribbon */}
      <div className="bg-gradient-to-r from-teal-50 via-indigo-50/50 to-teal-50 border border-teal-200 p-3.5 rounded-2xl flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold shadow-2xs">
          ॐ
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-wider text-teal-800">
              शास्त्रीय चिकित्सा सूत्र (Classical Treatment Sutra)
            </span>
            {aiPlanData?.source && (
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {aiPlanData.source}
              </span>
            )}
          </div>
          <input
            type="text"
            value={sutraText}
            onChange={(e) => setSutraText(e.target.value)}
            placeholder="शास्त्रीय चिकित्सा सूत्र प्रविष्ट करें (उदा: पित्त शमन, दीपन-पाचन, मृदु अनुलोमन)..."
            className="w-full mt-1 font-serif font-bold text-slate-900 text-sm bg-transparent border-b border-dashed border-teal-300 focus:border-teal-600 focus:outline-none py-0.5"
          />
        </div>
      </div>

      {/* CDSS Safety Alerts if Herb-Drug cautions present */}
      {cdssAlerts.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 shadow-2xs">
          <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-amber-900">
              CDSS Clinical Safety &amp; Herb-Drug Interaction Alert:
            </span>
            <ul className="list-disc list-inside space-y-0.5 font-medium text-[11px] text-amber-900">
              {cdssAlerts.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ─── LEVEL 1: NIDANA PARIVARJANA & LEVEL 2: AHARA ─── */}
      {(activePlanLevel === 'all' || activePlanLevel === 'nidana' || activePlanLevel === 'ahara') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* LEVEL 1: NIDANA PARIVARJANA (ROOT CAUSE REMOVAL) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                  <AlertTriangle size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    1. निदान परिवर्जन (Root Cause Cessation)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">रोगोत्पादक आहार, विहार एवं मानसिक कारणों का तत्काल त्याग</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Primary Step
              </span>
            </div>

            {/* Active Cessation Rules */}
            <div className="space-y-1.5">
              {nidanaParivarjanaList.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No specific cessation rules added yet</p>
              ) : (
                nidanaParivarjanaList.map((rule, i) => (
                  <div key={i} className="p-2 rounded-xl bg-rose-50/60 border border-rose-200 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        ✗
                      </span>
                      <span className="font-medium text-slate-800">{rule}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNidanaParivarjanaList(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-600 text-xs px-1"
                      title="हटाएं"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Quick Add Custom Cessation Rule */}
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={newParivarjana}
                onChange={(e) => setNewParivarjana(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newParivarjana.trim()) {
                    e.preventDefault();
                    setNidanaParivarjanaList(prev => [...prev, newParivarjana.trim()]);
                    setNewParivarjana('');
                  }
                }}
                placeholder="उदा: रात्रि जागरण निषेध, कटु-अम्ल भोजन त्याग..."
                className="flex-1 text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (newParivarjana.trim()) {
                    setNidanaParivarjanaList(prev => [...prev, newParivarjana.trim()]);
                    setNewParivarjana('');
                  }
                }}
                disabled={!newParivarjana.trim()}
                className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold disabled:opacity-40 transition-all cursor-pointer shrink-0"
              >
                + जोड़ें
              </button>
            </div>
          </div>

          {/* LEVEL 2: AHARA (DIETARY THERAPEUTICS) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Utensils size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    2. पथ्य आहार (Targeted Dietary Therapeutics)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">विकृति शामक रस, गुण एवं औषधीय आहार विन्यास</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Agni Kindling
              </span>
            </div>

            {/* Favorable vs Unfavorable Rasas */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">हितकर रस (Favorable)</span>
                <input
                  type="text"
                  value={favRasa}
                  onChange={(e) => setFavRasa(e.target.value)}
                  className="w-full font-bold text-emerald-900 bg-transparent border-none focus:outline-none text-xs"
                />
              </div>
              <div className="p-2 rounded-xl bg-rose-50/60 border border-rose-200">
                <span className="text-[10px] font-bold uppercase text-rose-800 block">अहितकर रस (Avoid)</span>
                <input
                  type="text"
                  value={unfavRasa}
                  onChange={(e) => setUnfavRasa(e.target.value)}
                  className="w-full font-bold text-rose-900 bg-transparent border-none focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Pathya (Recommended Diet) */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                प्रशस्त/पथ्य आहार (Recommended Foods):
              </span>
              <div className="flex flex-wrap gap-1.5 min-h-[26px]">
                {pathyaAharaList.length === 0 ? (
                  <span className="text-slate-400 italic text-[11px]">No specific pathya items added</span>
                ) : (
                  pathyaAharaList.map((p, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px]">
                      <span>✓ {p}</span>
                      <button type="button" onClick={() => setPathyaAharaList(prev => prev.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-rose-600">✕</button>
                    </span>
                  ))
                )}
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={newPathya}
                  onChange={(e) => setNewPathya(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newPathya.trim()) {
                      e.preventDefault();
                      setPathyaAharaList(prev => [...prev, newPathya.trim()]);
                      setNewPathya('');
                    }
                  }}
                  placeholder="नया पथ्य आहार जोड़ें (उदा: मूंग दाल, पुराना शाली चावल)..."
                  className="flex-1 text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newPathya.trim()) {
                      setPathyaAharaList(prev => [...prev, newPathya.trim()]);
                      setNewPathya('');
                    }
                  }}
                  disabled={!newPathya.trim()}
                  className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold disabled:opacity-40"
                >
                  + जोड़ें
                </button>
              </div>
            </div>

            {/* Apathya (Restricted Diet) */}
            <div className="space-y-1 text-xs pt-1 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 block">
                वर्ज्य/अपथ्य आहार (Foods to Avoid):
              </span>
              <div className="flex flex-wrap gap-1.5 min-h-[26px]">
                {apathyaAharaList.length === 0 ? (
                  <span className="text-slate-400 italic text-[11px]">No specific apathya items added</span>
                ) : (
                  apathyaAharaList.map((a, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 text-rose-900 border border-rose-200 text-[11px]">
                      <span>✗ {a}</span>
                      <button type="button" onClick={() => setApathyaAharaList(prev => prev.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-rose-600">✕</button>
                    </span>
                  ))
                )}
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={newApathya}
                  onChange={(e) => setNewApathya(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newApathya.trim()) {
                      e.preventDefault();
                      setApathyaAharaList(prev => [...prev, newApathya.trim()]);
                      setNewApathya('');
                    }
                  }}
                  placeholder="नया अपथ्य आहार जोड़ें (उदा: खट्टे व तीखे पदार्थ, दही)..."
                  className="flex-1 text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newApathya.trim()) {
                      setApathyaAharaList(prev => [...prev, newApathya.trim()]);
                      setNewApathya('');
                    }
                  }}
                  disabled={!newApathya.trim()}
                  className="px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold disabled:opacity-40"
                >
                  + जोड़ें
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ─── LEVEL 3: VIHARA (LIFESTYLE, DINACHARYA & YOGA) ─── */}
      {(activePlanLevel === 'all' || activePlanLevel === 'vihara') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Sun size={16} />
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  3. विहार विधान (Lifestyle, Dinacharya &amp; Yogic Regimen)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">दिनचर्या, ऋतुचर्या एवं दोषानुसार योगासन-प्राणायाम का निर्धारण</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Behavioral Rx
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">दिनचर्या (Daily Routine)</span>
              <textarea
                value={dinacharyaText}
                onChange={(e) => setDinacharyaText(e.target.value)}
                placeholder="समय पर शयन, भोजन समय, अभ्यंग निर्देश..."
                rows={3}
                className="w-full text-xs text-slate-800 bg-transparent border-none focus:outline-none resize-none leading-relaxed"
              />
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">ऋतुचर्या (Seasonal Alignment)</span>
              <textarea
                value={ritucharyaText}
                onChange={(e) => setRitucharyaText(e.target.value)}
                placeholder="वर्तमान ऋतु अनुसार आचरण व सावधानी..."
                rows={3}
                className="w-full text-xs text-slate-800 bg-transparent border-none focus:outline-none resize-none leading-relaxed"
              />
            </div>
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80">
              <span className="text-[10px] font-bold uppercase text-indigo-800 block mb-1">योगासन व प्राणायाम (Yoga &amp; Pranayama)</span>
              <textarea
                value={yogaText}
                onChange={(e) => setYogaText(e.target.value)}
                placeholder="नाड़ी शोधन, शीतली, वज्रासन आदि..."
                rows={3}
                className="w-full text-xs text-indigo-950 bg-transparent border-none focus:outline-none resize-none leading-relaxed font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── LEVEL 4: AUSHADHA (SHAMANA & SHODHANA THERAPEUTICS) ─── */}
      {(activePlanLevel === 'all' || activePlanLevel === 'aushadha') && (
        <div className="space-y-5">
          
          {/* A. SHAMANA CHIKITSA (PALLIATIVE THERAPY) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Pill size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    4A. शमन चिकित्सा (Shamana Therapeutics — Deepana, Pachana &amp; Prashamana)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">दीपन-पाचन एवं शास्त्रीय औषध योग विशिष्ट अनुपान एवं औषधि सेवन काल सहित</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {prescriptions.length > 0 && (
                  <button
                    onClick={handleClearPrescriptions}
                    className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                    title="Clear active prescriptions"
                  >
                    खाली करें (Clear)
                  </button>
                )}

                <button
                  onClick={() => setShowApiImportModal && setShowApiImportModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 border border-amber-200 transition-colors cursor-pointer"
                >
                  <Database size={13} className="text-amber-700" />
                  <span>AYUSH Formulary API से जोड़ें</span>
                </button>
              </div>
            </div>

            {/* If prescriptions are EMPTY: Show clean unprescribed notice + Nidan AI Suggested Regimen Card */}
            {prescriptions.length === 0 ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-1">
                  <div className="inline-flex p-2 rounded-full bg-slate-100 text-slate-400">
                    <Pill size={18} />
                  </div>
                  <p className="text-xs font-bold text-slate-700">अद्यावधि कोई शमन योग निर्धारित नहीं है (No formulations prescribed yet)</p>
                  <p className="text-[11px] text-slate-500">
                    वैद्य स्वयं नीचे दिए गए फॉर्म या Formulary API से औषधियां जोड़ सकते हैं, या Nidan AI सुझाया गया प्रोटोकॉल 1-क्लिक में लागू कर सकते हैं।
                  </p>
                </div>

                {/* Nidan AI Suggested Regimen Card */}
                {suggestedMeds.length > 0 && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-teal-50/50 border border-indigo-200 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                          <Sparkles size={14} />
                        </span>
                        <div>
                          <span className="text-[10px] uppercase font-black tracking-wider text-indigo-900 block">
                            Nidan AI क्लिनिकल सुझाव (Suggested Regimen for Physician Review)
                          </span>
                          <h4 className="text-xs font-black text-slate-900">
                            {aiPlanData?.chikitsaSutra || chikitsa.suggestedProtocol?.protocolTitle || 'Recommended Clinical Regimen'}
                          </h4>
                        </div>
                      </div>

                      <button
                        onClick={handleApplySuggestedMedications}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
                      >
                        <Sparkles size={13} />
                        <span>✨ Nidan AI सुझाई गई औषधियां लागू करें (Apply Regimen)</span>
                      </button>
                    </div>

                    {/* Preview cards of suggested formulations */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {suggestedMeds.map((m, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs text-xs space-y-1">
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-black text-slate-900">{m.name}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{m.kalpana || m.type || 'Vati'}</span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            <span className="font-semibold text-indigo-700">{m.dose}</span> • {m.frequency}
                          </div>
                          <div className="text-[10px] text-amber-800">काल: {m.kaala}</div>
                          <div className="text-[10px] text-teal-800">अनुपान: {m.anupana}</div>
                          {(m.purpose || m.rationale) && (
                            <div className="text-[10px] text-slate-500 italic pt-0.5 border-t border-slate-100">
                              {m.purpose || m.rationale}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Active Prescriptions Table */
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">औषध नाम (Formulation)</th>
                      <th className="py-2.5 px-3">कल्पना (Kalpana)</th>
                      <th className="py-2.5 px-3">मात्रा (Dose)</th>
                      <th className="py-2.5 px-3">आवृत्ति (Frequency)</th>
                      <th className="py-2.5 px-3">सेवन काल (Kaala)</th>
                      <th className="py-2.5 px-3">अनुपान (Anupana)</th>
                      <th className="py-2.5 px-3">अवधि</th>
                      <th className="py-2.5 px-3 text-right">कार्य</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prescriptions.map((med, idx) => (
                      <tr key={med.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {med.name}
                          {med.purpose && <span className="block text-[10px] text-slate-400 font-normal">{med.purpose}</span>}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{med.kalpana || med.type || 'Vati'}</td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-indigo-700">{med.dose}</td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">{med.frequency}</td>
                        <td className="py-2.5 px-3 text-amber-800 font-medium text-[11px]">{med.kaala}</td>
                        <td className="py-2.5 px-3 text-teal-800 font-medium text-[11px]">{med.anupana}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{med.duration}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleRemoveShamana(med.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                            title="Remove formulation"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Quick Formulation Manual Add Form */}
            <form onSubmit={handleAddShamana} className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-8 gap-2 items-end">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">औषध नाम</label>
                <input
                  type="text"
                  placeholder="उदा. सुतशेखर रस"
                  value={newShamanaMed.name}
                  onChange={e => setNewShamanaMed({ ...newShamanaMed, name: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">कल्पना</label>
                <select
                  value={newShamanaMed.kalpana}
                  onChange={e => setNewShamanaMed({ ...newShamanaMed, kalpana: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 mt-0.5"
                >
                  <option value="Vati">Vati (वटी)</option>
                  <option value="Churna">Churna (चूर्ण)</option>
                  <option value="Kwatha">Kwatha (क्वाथ)</option>
                  <option value="Asava">Asava-Arishta</option>
                  <option value="Avaleha">Avaleha</option>
                  <option value="Ghruta">Ghrita</option>
                  <option value="Taila">Taila</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">मात्रा (Dose)</label>
                <input
                  type="text"
                  placeholder="250mg / 5g"
                  value={newShamanaMed.dose}
                  onChange={e => setNewShamanaMed({ ...newShamanaMed, dose: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 mt-0.5 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">आवृत्ति</label>
                <select
                  value={newShamanaMed.frequency}
                  onChange={e => setNewShamanaMed({ ...newShamanaMed, frequency: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 mt-0.5"
                >
                  <option value="BD (Twice Daily)">BD (दो बार)</option>
                  <option value="TDS (Thrice Daily)">TDS (तीन बार)</option>
                  <option value="OD (Once Daily)">OD (एक बार)</option>
                  <option value="HS (Bedtime)">HS (सोते समय)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">सेवन काल</label>
                <select
                  value={newShamanaMed.kaala}
                  onChange={e => setNewShamanaMed({ ...newShamanaMed, kaala: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 mt-0.5 text-[11px]"
                >
                  <option value="Pragbhakta (Before Meals)">प्राग्भक्त (भोजन पूर्व)</option>
                  <option value="Adhobhakta (After Meals)">अधोभक्त (भोजनोपरांत)</option>
                  <option value="Samabhakta (With Meals)">समभक्त (मध्य में)</option>
                  <option value="Nishikala (Night)">निशिकाल (रात्रि)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">अनुपान</label>
                <input
                  type="text"
                  placeholder="गुनगुना जल / दूध"
                  value={newShamanaMed.anupana}
                  onChange={e => setNewShamanaMed({ ...newShamanaMed, anupana: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 mt-0.5"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                  <span>जोड़ें</span>
                </button>
              </div>
            </form>
          </div>

          {/* B. SHODHANA CHIKITSA (PANCHAKARMA PURIFICATION) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Flower2 size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    4B. शोधन चिकित्सा (Shodhana / Panchakarma Purification)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    रोगी की व्यायाम शक्ति ({vyayamaShakti.grade || 'Madhyama'}) एवं सार अनुसार निर्धारित शोधन विधान
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${vyayamaShakti.shodhanaEligible !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                  {vyayamaShakti.shodhanaEligible !== false ? 'शोधन योग्य (Eligible ✓)' : 'शोधन अयोग्य (Contraindicated ✗)'}
                </span>

                {setShowPanchakarmaModal && (
                  <button
                    onClick={() => setShowPanchakarmaModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold flex items-center gap-1.5 border border-purple-200 transition-colors cursor-pointer"
                  >
                    <Calendar size={13} className="text-purple-700" />
                    <span>पंचकर्म सत्र निर्धारित करें</span>
                  </button>
                )}
              </div>
            </div>

            {/* Shodhana Protocol Steps (Purvakarma -> Pradhanakarma -> Paschatkarma) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Purvakarma */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                  1. पूर्वकर्म (Snehana &amp; Swedana)
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {chikitsa.aushadha?.shodhana?.purvakarma || 'Deepana-Pachana with Trikatu followed by graduated Snehana.'}
                </p>
              </div>

              {/* Pradhanakarma */}
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/80">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 block mb-1">
                  2. प्रधानकर्म (Main Cleanse Action)
                </span>
                <p className="text-purple-950 font-bold leading-relaxed">
                  {chikitsa.aushadha?.shodhana?.pradhanakarma || 'Virechana / Basti therapy as indicated for dominant Dosha.'}
                </p>
              </div>

              {/* Paschatkarma */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                  3. पश्चात्कर्म (Samsarjana Krama)
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {chikitsa.aushadha?.shodhana?.paschatkarma || 'Samsarjana Krama 3-7 days: Peya -> Vilepi -> Akrita Yusha -> Krita Yusha.'}
                </p>
              </div>
            </div>

            {/* If NO panchakarma ordered yet: show Nidan AI suggestion CTA */}
            {panchakarmaOrders.length === 0 ? (
              suggestedPanchakarmaList.length > 0 && (
                <div className="mt-4 p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 block">
                      Nidan AI शोधन सुझाव (Suggested Shodhana Protocol)
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {suggestedPanchakarmaList[0].protocolName || suggestedPanchakarmaList[0].procedure || 'Classical Shodhana Protocol'}
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      रोगी की व्यायाम शक्ति ({vyayamaShakti.grade || 'Madhyama'}) एवं दोष स्थिति अनुसार Nidan AI द्वारा प्रस्तावित क्रम।
                    </p>
                  </div>

                  <button
                    onClick={handleApplySuggestedShodhana}
                    className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles size={13} />
                    <span>✨ शोधन प्रक्रिया निर्धारित करें (Order Shodhana)</span>
                  </button>
                </div>
              )
            ) : (
              /* Active Prescribed Panchakarma Orders */
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block">
                    निर्धारित पंचकर्म आदेश (Prescribed Panchakarma Orders)
                  </span>
                  <button
                    onClick={() => setPanchakarmaOrders && setPanchakarmaOrders([])}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    सभी हटाएं (Remove All)
                  </button>
                </div>
                {panchakarmaOrders.map((order, idx) => (
                  <div key={order.id || idx} className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-purple-950 text-sm">{order.procedure}</span>
                        {order.sessions && (
                          <span className="px-2 py-0.5 rounded bg-purple-200/70 text-purple-900 text-[10px] font-bold">
                            {order.sessions}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 text-[11px] mt-0.5">
                        द्रव्य: <b className="text-purple-900">{order.dravya || 'Classical Dravya'}</b> • समय: {order.time || 'Pratah Kala'}
                      </p>
                      {order.notes && <p className="text-slate-500 text-[10px] mt-0.5">{order.notes}</p>}
                    </div>

                    <button
                      onClick={() => setPanchakarmaOrders && setPanchakarmaOrders(prev => prev.filter(p => p.id !== order.id))}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition-colors cursor-pointer"
                      title="Remove panchakarma order"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
