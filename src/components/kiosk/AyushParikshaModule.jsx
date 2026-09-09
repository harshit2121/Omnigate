import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flower2, Flame, Droplets, Wind, Activity, 
  CheckCircle2, Utensils, HelpCircle, Download,
  Share2, Play, ExternalLink, X, Info, Sparkles,
  ChevronRight, ChevronLeft, Volume2, ShieldAlert,
  Scale, Brain, HeartPulse, Layers, Compass, Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  PRAKRITI_20_QUESTIONS, 
  PRAKRITI_KNOWLEDGE_BASE, 
  PRAKRITI_VIDEOS, 
  determinePrakriti 
} from '../../services/prakritiDetermineService';
import { 
  VIKRITI_QUESTIONS, 
  SARA_DHATU_METRICS,
  calculateVikritiScore, 
  calculateSaraScores, 
  calculatePramana,
  calculateAharaShakti,
  calculateVaya,
  runDashavidhaEvaluation
} from '../../services/dashavidhaParikshaEngine';
import { synthesizeSamprapti } from '../../services/sampraptiSynthesizerService';
import { AYURVEDA_PARIKSHA_DATA } from '../../data/ayurvedaDatabase';
import { printPrakritiDietPlan } from '../../utils/prakritiPdfGenerator';
import voiceAssistant from '../../services/voiceAssistant';

export default function AyushParikshaModule({
  parikshaData = {},
  setParikshaData,
  currentLang = 'hi',
  voiceEnabled,
  patientData = {}
}) {
  const isHi = currentLang === 'hi';
  const [subTab, setSubTab] = useState('prakriti');
  
  // Assessment mode: 'full' (20 questions from Prakriti-Determine v3.7) or 'quick' (6 high-yield questions)
  const [assessmentMode, setAssessmentMode] = useState('full');
  const [prakritiStepIndex, setPrakritiStepIndex] = useState(0);
  const [prakritiAnswers, setPrakritiAnswers] = useState(parikshaData.prakritiAnswers || {});
  
  // Vikriti Answers (Current State)
  const [vikritiAnswers, setVikritiAnswers] = useState(parikshaData.vikritiAnswers || {
    v_sleep: 'pitta',
    v_digestion: 'pitta',
    v_bowel: 'vata',
    v_temperature: 'pitta'
  });

  // Sara (8 Dhatus) Answers
  const [saraAnswers, setSaraAnswers] = useState(parikshaData.saraAnswers || {
    twak_texture: 1, twak_glow: 1,
    rakta_color: 2, rakta_vitality: 2,
    mamsa_bulk: 1, mamsa_strength: 1,
    meda_lubrication: 1, meda_endurance: 1,
    asthi_structure: 1, asthi_stamina: 1,
    majja_complexion: 1, majja_intellect: 2,
    shukra_luster: 2, shukra_vigor: 2,
    sattva_calm: 1, sattva_memory: 2
  });

  // Anthropometrics & Functional
  const [heightCm, setHeightCm] = useState(parikshaData.heightCm || 168);
  const [weightKg, setWeightKg] = useState(parikshaData.weightKg || 68);
  const [waistCm, setWaistCm] = useState(parikshaData.waistCm || 82);
  const [hipCm, setHipCm] = useState(parikshaData.hipCm || 96);
  const [samhanana, setSamhanana] = useState(parikshaData.samhanana || 'Madhyama');
  const [satmya, setSatmya] = useState(parikshaData.satmya || 'Madhyama');
  const [sattva, setSattva] = useState(parikshaData.sattva || 'Madhyama');
  const [vyayama, setVyayama] = useState(parikshaData.vyayama || 'Madhyama');

  // Modals
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Other Ayush legacy tabs
  const [selectedAgni, setSelectedAgni] = useState(parikshaData.agni || 'vishama');
  const [selectedKoshtha, setSelectedKoshtha] = useState(parikshaData.koshtha || 'krura');
  const [ashtavidhaAnswers, setAshtavidhaAnswers] = useState(parikshaData.ashtavidha || {
    nadi: 'vata', mutra: 'normal', mala: 'shuska_grathita', jihwa: 'lipta_shweta'
  });
  const [aharaViharaAnswers, setAharaViharaAnswers] = useState(parikshaData.aharaVihara || {
    diet_type: 'Shakahari (Vegetarian)', dominant_rasa: 'Katu (Pungent/Spicy)'
  });

  // Determine current active question set
  const questionsList = useMemo(() => {
    if (assessmentMode === 'quick') {
      return PRAKRITI_20_QUESTIONS.filter(q => [0, 1, 5, 10, 18, 19].includes(q.id));
    }
    return PRAKRITI_20_QUESTIONS;
  }, [assessmentMode]);

  const currentQuestion = questionsList[prakritiStepIndex] || questionsList[0];

  // Calculate Prakriti using the Prakriti-Determine inference engine
  const prakritiStats = useMemo(() => {
    return determinePrakriti(prakritiAnswers);
  }, [prakritiAnswers]);

  // Calculate Vikriti and Delta
  const vikritiStats = useMemo(() => {
    return calculateVikritiScore(vikritiAnswers, {
      vataPct: prakritiStats.vataPct,
      pittaPct: prakritiStats.pittaPct,
      kaphaPct: prakritiStats.kaphaPct
    });
  }, [vikritiAnswers, prakritiStats]);

  // Calculate Sara (8 Dhatus)
  const saraStats = useMemo(() => {
    return calculateSaraScores(saraAnswers);
  }, [saraAnswers]);

  // Calculate Pramana
  const pramanaStats = useMemo(() => {
    return calculatePramana(Number(heightCm), Number(weightKg), Number(waistCm), Number(hipCm), patientData?.gender || 'male');
  }, [heightCm, weightKg, waistCm, hipCm, patientData?.gender]);

  // Unified Dashavidha Result
  const unifiedDashavidha = useMemo(() => {
    return runDashavidhaEvaluation({
      prakritiAnswers,
      vikritiAnswers,
      saraAnswers,
      samhanana,
      pramanaData: { heightCm: Number(heightCm), weightKg: Number(weightKg), waistCm: Number(waistCm), hipCm: Number(hipCm), gender: patientData?.gender || 'male' },
      satmya,
      sattva,
      aharaInputs: { intake: 'moderate', jaranaTimeHours: 4, postMealFeeling: 'normal' },
      vyayamaShakti: vyayama,
      age: patientData?.age || 45
    });
  }, [prakritiAnswers, vikritiAnswers, saraAnswers, samhanana, heightCm, weightKg, waistCm, hipCm, patientData, satmya, sattva, vyayama]);

  // Live Layer 3 Samprapti Synthesis
  const liveSamprapti = useMemo(() => {
    return synthesizeSamprapti({
      dashavidhaResult: unifiedDashavidha,
      complaintId: patientData?.complaintId || 'digestive_issues',
      complaintLabel: patientData?.complaintLabel || 'Amlapitta',
      symptomsText: patientData?.symptomsText || '',
      answers: patientData?.answers || {},
      namasteCode: patientData?.namasteCode || 'NAMASTE-AYU-AML-01'
    });
  }, [unifiedDashavidha, patientData]);

  const handlePrakritiAnswer = (questionId, optionValue) => {
    const updated = { ...prakritiAnswers, [questionId]: optionValue };
    setPrakritiAnswers(updated);
    const result = determinePrakriti(updated);
    
    setParikshaData(prev => ({
      ...prev,
      prakritiAnswers: updated,
      prakritiResult: result,
      dashavidha: unifiedDashavidha,
      samprapti: liveSamprapti
    }));
  };

  const handleVikritiAnswer = (questionId, optionValue) => {
    const updated = { ...vikritiAnswers, [questionId]: optionValue };
    setVikritiAnswers(updated);
    setParikshaData(prev => ({
      ...prev,
      vikritiAnswers: updated,
      dashavidha: unifiedDashavidha,
      samprapti: liveSamprapti
    }));
  };

  const handleSaraAnswer = (subQId, value) => {
    const updated = { ...saraAnswers, [subQId]: value };
    setSaraAnswers(updated);
    setParikshaData(prev => ({
      ...prev,
      saraAnswers: updated,
      dashavidha: unifiedDashavidha,
      samprapti: liveSamprapti
    }));
  };

  const handlePrintDiet = () => {
    printPrakritiDietPlan({
      patientName: patientData?.name || (isHi ? 'मरीज' : 'Patient'),
      tokenNumber: patientData?.token || 'T-104',
      abhaId: patientData?.abhaId || '91-8765-4321-0987',
      prakritiResult: prakritiStats,
      currentLang
    });
  };

  const handleSharePrakriti = () => {
    const text = isHi
      ? `आयुष दशविध परीक्षा परिणाम:\nप्रकृति: ${prakritiStats.nameHi}\nविकृति: ${vikritiStats.dominant}\nदोष डेल्टा (Δ): Vata ${vikritiStats.delta.vata > 0 ? '+' : ''}${vikritiStats.delta.vata}%, Pitta ${vikritiStats.delta.pitta > 0 ? '+' : ''}${vikritiStats.delta.pitta}%, Kapha ${vikritiStats.delta.kapha > 0 ? '+' : ''}${vikritiStats.delta.kapha}%\n(AIIA MediKiosk Terminal)`
      : `Ayush Dashavidha Assessment Result:\nPrakriti: ${prakritiStats.nameEn}\nVikriti: ${vikritiStats.dominant}\nDosha Delta (Δ): Vata ${vikritiStats.delta.vata > 0 ? '+' : ''}${vikritiStats.delta.vata}%, Pitta ${vikritiStats.delta.pitta > 0 ? '+' : ''}${vikritiStats.delta.pitta}%, Kapha ${vikritiStats.delta.kapha > 0 ? '+' : ''}${vikritiStats.delta.kapha}%\n(AIIA MediKiosk Terminal)`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Sub-Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#F1F6FC] p-1.5 rounded-2xl border border-[#DCE3EC]">
        {[
          { id: 'prakriti', labelEn: '1. Prakriti', labelHi: '१. प्रकृति', icon: Flower2 },
          { id: 'vikriti', labelEn: '2. Vikriti & Delta (Δ)', labelHi: '२. विकृति व डेल्टा', icon: Flame },
          { id: 'sara', labelEn: '3. Sara (8 Dhatus)', labelHi: '३. अष्टधातु सार', icon: Layers },
          { id: 'pramana', labelEn: '4. Pramana & Bala', labelHi: '४. प्रमाण व बल', icon: Scale },
          { id: 'samprapti', labelEn: '5. Samprapti (L3)', labelHi: '५. संप्राप्ति घटक', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`py-3 px-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0B4C8C] text-white shadow-xs font-black'
                  : 'text-[#5B677E] hover:text-[#16213A] hover:bg-white/50'
              }`}
            >
              <Icon size={15} />
              <span className="truncate">{isHi ? tab.labelHi : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: PRAKRITI DETERMINATION                                          */}
      {/* ========================================================================= */}
      {subTab === 'prakriti' && (
        <div className="space-y-6">
          
          {/* Top Control Bar */}
          <div className="bg-white border-2 border-[#DCE3EC] p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#DCE3EC] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#FFF7ED] text-[#E2861E] border border-[#FED7AA] text-[10px] font-black uppercase">
                    Layer 1: Prakriti Genotype
                  </Badge>
                  <span className="text-xs text-[#5B677E] font-semibold">
                    • {isHi ? 'दशविध प्रकृति परीक्षा' : 'Constitutional Dosha Analysis'}
                  </span>
                </div>
                <h3 
                  className="text-xl sm:text-2xl font-black text-[#16213A] mt-1"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {isHi ? prakritiStats.dominantHi : prakritiStats.dominant}
                </h3>
                <p className="text-xs text-[#5B677E] font-medium mt-0.5">
                  {isHi ? prakritiStats.knowledge.elementHi : prakritiStats.knowledge.elementEn} • {isHi ? prakritiStats.knowledge.primaryQualityHi : prakritiStats.knowledge.primaryQualityEn}
                </p>
              </div>

              {/* Mode Toggle & Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-[#F1F6FC] p-1 rounded-xl border border-[#DCE3EC] flex items-center text-xs font-bold">
                  <button
                    onClick={() => {
                      setAssessmentMode('full');
                      setPrakritiStepIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      assessmentMode === 'full' 
                        ? 'bg-[#0B4C8C] text-white shadow-xs font-black' 
                        : 'text-[#5B677E] hover:text-[#16213A]'
                    }`}
                  >
                    {isHi ? 'संपूर्ण (20 प्रश्न)' : 'Complete (20 Qs)'}
                  </button>
                  <button
                    onClick={() => {
                      setAssessmentMode('quick');
                      setPrakritiStepIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      assessmentMode === 'quick' 
                        ? 'bg-[#0B4C8C] text-white shadow-xs font-black' 
                        : 'text-[#5B677E] hover:text-[#16213A]'
                    }`}
                  >
                    {isHi ? 'त्वरित (6 प्रश्न)' : 'Quick (6 Qs)'}
                  </button>
                </div>

                <Button
                  variant="outline"
                  onClick={handlePrintDiet}
                  className="border-[#DCE3EC] bg-white hover:bg-[#F1F6FC] text-[#0B4C8C] font-extrabold rounded-xl h-9 px-3 text-xs flex items-center gap-1.5 shadow-2xs"
                  title="Download / Print Diet Chart PDF"
                >
                  <Download size={14} className="text-[#E2861E]" />
                  <span>{isHi ? 'डाइट चार्ट' : 'Diet PDF'}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSharePrakriti}
                  className="border-[#DCE3EC] bg-white hover:bg-[#F1F6FC] text-[#16213A] font-extrabold rounded-xl h-9 px-3 text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Share2 size={14} className="text-[#0B4C8C]" />
                  <span>{copiedShare ? (isHi ? 'कॉपी हुआ!' : 'Copied!') : (isHi ? 'शेयर' : 'Share')}</span>
                </Button>
              </div>
            </div>

            {/* Dosha Progress Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#F5F9FF] p-3 rounded-2xl border-2 border-[#DCE3EC] shadow-xs">
                <div className="flex items-center justify-between text-xs font-black text-[#5B8DBE] mb-1">
                  <span className="flex items-center gap-1"><Wind size={13} /> Vata</span>
                  <span>{prakritiStats.vataPct}%</span>
                </div>
                <div className="h-2 w-full bg-[#E4EAF2] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#5B8DBE] rounded-full" animate={{ width: `${prakritiStats.vataPct}%` }} />
                </div>
              </div>

              <div className="bg-[#FFF7ED] p-3 rounded-2xl border-2 border-[#FED7AA] shadow-xs">
                <div className="flex items-center justify-between text-xs font-black text-[#F2941E] mb-1">
                  <span className="flex items-center gap-1"><Flame size={13} /> Pitta</span>
                  <span>{prakritiStats.pittaPct}%</span>
                </div>
                <div className="h-2 w-full bg-[#FFEDD5] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#F2941E] rounded-full" animate={{ width: `${prakritiStats.pittaPct}%` }} />
                </div>
              </div>

              <div className="bg-[#F1F6FC] p-3 rounded-2xl border-2 border-[#BFD3E8] shadow-xs">
                <div className="flex items-center justify-between text-xs font-black text-[#0B4C8C] mb-1">
                  <span className="flex items-center gap-1"><Droplets size={13} /> Kapha</span>
                  <span>{prakritiStats.kaphaPct}%</span>
                </div>
                <div className="h-2 w-full bg-[#DCE3EC] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#0B4C8C] rounded-full" animate={{ width: `${prakritiStats.kaphaPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#DCE3EC] pb-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-[#F5F9FF] text-[#0B4C8C] border border-[#BFD3E8] font-black text-xs px-3.5 py-1.5 rounded-xl">
                  {isHi ? `प्रश्न ${prakritiStepIndex + 1} / ${questionsList.length}` : `Question ${prakritiStepIndex + 1} of ${questionsList.length}`}
                </Badge>
                <span className="text-xs text-[#5B677E] font-bold hidden sm:inline">
                  {isHi ? 'स्वाभाविक लक्षण चुनें' : 'Select your lifelong constitutional tendency'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInfoModal(true)}
                  className="flex items-center gap-1.5 p-2 px-3 bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FED7AA] rounded-xl text-[#E2861E] font-bold text-xs shadow-2xs"
                >
                  <HelpCircle size={14} />
                  <span>{isHi ? 'विवरण' : 'Guide'}</span>
                </button>
                <button
                  onClick={() => {
                    const text = isHi ? currentQuestion.questionHi : currentQuestion.questionEn;
                    voiceAssistant.speak(text);
                  }}
                  className="flex items-center gap-1.5 p-2 px-3 bg-[#F5F9FF] hover:bg-[#E4EAF2] border border-[#DCE3EC] rounded-xl text-[#0B4C8C] font-bold text-xs shadow-2xs"
                >
                  <Volume2 size={14} />
                  <span>{isHi ? 'सुनें' : 'Listen'}</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#16213A] leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                {isHi ? currentQuestion.questionHi : currentQuestion.questionEn}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {currentQuestion.options.map((opt) => {
                const isSelected = prakritiAnswers[currentQuestion.id] === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handlePrakritiAnswer(currentQuestion.id, opt.value);
                      voiceAssistant.playAudioCue('beep');
                      if (prakritiStepIndex < questionsList.length - 1) {
                        setTimeout(() => setPrakritiStepIndex(prev => prev + 1), 300);
                      }
                    }}
                    className={`p-5 sm:p-6 rounded-3xl text-left border-2 transition-all flex flex-col justify-between min-h-[150px] shadow-xs relative cursor-pointer ${
                      isSelected
                        ? 'bg-[#F5F9FF] text-[#0B4C8C] border-[#0B4C8C] ring-4 ring-blue-100 shadow-md scale-[1.02]'
                        : 'bg-[#F1F6FC] hover:bg-white text-[#16213A] border-[#DCE3EC] hover:border-[#BFD3E8]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <span className="font-black text-xs uppercase px-3 py-1 bg-white border border-[#DCE3EC] rounded-xl text-[#E2861E] shadow-2xs">
                        {opt.dosha}
                      </span>
                      {isSelected && <CheckCircle2 size={22} className="text-[#0B4C8C]" />}
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm sm:text-base font-black leading-snug">
                        {isHi ? opt.labelHi : opt.labelEn}
                      </p>
                      <p className="text-xs text-[#5B677E] font-medium leading-relaxed">
                        {isHi ? opt.descHi : opt.descEn}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-[#DCE3EC] gap-2">
              <Button
                variant="outline"
                disabled={prakritiStepIndex === 0}
                onClick={() => setPrakritiStepIndex(prev => prev - 1)}
                className="border-2 border-[#DCE3EC] text-[#16213A] font-extrabold rounded-2xl h-12 px-5 text-sm bg-white"
              >
                <ChevronLeft size={16} />
                <span>{isHi ? 'पिछला' : 'Previous'}</span>
              </Button>

              <div className="flex items-center gap-1.5 overflow-x-auto max-w-[280px] sm:max-w-none px-2 py-1">
                {questionsList.map((q, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setPrakritiStepIndex(dotIdx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      prakritiStepIndex === dotIdx 
                        ? 'w-7 bg-[#0B4C8C]' 
                        : prakritiAnswers[q.id] !== undefined
                          ? 'w-2.5 bg-emerald-500'
                          : 'w-2.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                disabled={prakritiStepIndex === questionsList.length - 1}
                onClick={() => setPrakritiStepIndex(prev => prev + 1)}
                className="bg-[#0B4C8C] hover:bg-[#08355F] text-white font-extrabold rounded-2xl h-12 px-5 text-sm"
              >
                <span>{isHi ? 'अगला' : 'Next'}</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: VIKRITI & DIAGNOSTIC DELTA VECTOR (Δ = Vikriti - Prakriti)      */}
      {/* ========================================================================= */}
      {subTab === 'vikriti' && (
        <div className="space-y-6">
          
          {/* Delta Signal Summary Banner */}
          <div className="bg-white border-2 border-[#DCE3EC] p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE3EC] pb-4">
              <div>
                <Badge className="bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] text-[10px] font-black uppercase">
                  Layer 2: Real-time Pathological Signal
                </Badge>
                <h3 className="text-xl sm:text-2xl font-black text-[#16213A] mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
                  {vikritiStats.dominant}
                </h3>
                <p className="text-xs text-[#5B677E] font-semibold mt-0.5">
                  Δ = Vikriti − Prakriti (Core Pathological Driving Vector)
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#5B677E]">Diagnostic Signal</span>
                <p className="text-sm font-black text-[#0B4C8C]">
                  {vikritiStats.delta.pitta > 0 ? `Pitta Surge (+${vikritiStats.delta.pitta}%)` : (vikritiStats.delta.vata > 0 ? `Vata Surge (+${vikritiStats.delta.vata}%)` : 'Balanced Vector')}
                </p>
              </div>
            </div>

            {/* Live Delta Meter Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Vata Delta */}
              <div className="bg-[#F5F9FF] p-4 rounded-2xl border border-[#DCE3EC]">
                <div className="flex items-center justify-between text-xs font-black text-[#5B8DBE] mb-2">
                  <span>Vata (Prakriti: {prakritiStats.vataPct}% → Vikriti: {vikritiStats.vataPct}%)</span>
                  <Badge className={vikritiStats.delta.vata > 0 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                    Δ {vikritiStats.delta.vata > 0 ? `+${vikritiStats.delta.vata}%` : `${vikritiStats.delta.vata}%`}
                  </Badge>
                </div>
                <div className="h-2.5 w-full bg-[#E4EAF2] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#5B8DBE] rounded-full" animate={{ width: `${vikritiStats.vataPct}%` }} />
                </div>
              </div>

              {/* Pitta Delta */}
              <div className="bg-[#FFF7ED] p-4 rounded-2xl border border-[#FED7AA]">
                <div className="flex items-center justify-between text-xs font-black text-[#F2941E] mb-2">
                  <span>Pitta (Prakriti: {prakritiStats.pittaPct}% → Vikriti: {vikritiStats.pittaPct}%)</span>
                  <Badge className={vikritiStats.delta.pitta > 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}>
                    Δ {vikritiStats.delta.pitta > 0 ? `+${vikritiStats.delta.pitta}%` : `${vikritiStats.delta.pitta}%`}
                  </Badge>
                </div>
                <div className="h-2.5 w-full bg-[#FFEDD5] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#F2941E] rounded-full" animate={{ width: `${vikritiStats.pittaPct}%` }} />
                </div>
              </div>

              {/* Kapha Delta */}
              <div className="bg-[#F1F6FC] p-4 rounded-2xl border border-[#BFD3E8]">
                <div className="flex items-center justify-between text-xs font-black text-[#0B4C8C] mb-2">
                  <span>Kapha (Prakriti: {prakritiStats.kaphaPct}% → Vikriti: {vikritiStats.kaphaPct}%)</span>
                  <Badge className={vikritiStats.delta.kapha > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}>
                    Δ {vikritiStats.delta.kapha > 0 ? `+${vikritiStats.delta.kapha}%` : `${vikritiStats.delta.kapha}%`}
                  </Badge>
                </div>
                <div className="h-2.5 w-full bg-[#DCE3EC] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#0B4C8C] rounded-full" animate={{ width: `${vikritiStats.kaphaPct}%` }} />
                </div>
              </div>

            </div>
          </div>

          {/* Vikriti Active Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VIKRITI_QUESTIONS.map((q) => (
              <div key={q.id} className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-[#16213A]">{isHi ? q.labelHi : q.labelEn}</span>
                  <Badge className="bg-[#F5F9FF] text-[#0B4C8C] text-[10px] font-bold">Vikriti</Badge>
                </div>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = vikritiAnswers[q.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleVikritiAnswer(q.id, opt.value)}
                        className={`w-full p-3 rounded-2xl text-left border-2 text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#F5F9FF] text-[#0B4C8C] font-bold border-[#0B4C8C] shadow-xs'
                            : 'bg-[#F1F6FC] hover:bg-white text-[#16213A] border-[#DCE3EC]'
                        }`}
                      >
                        <span>{isHi ? opt.labelHi : opt.labelEn}</span>
                        {isSelected && <Check size={14} className="text-[#0B4C8C]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: SARA (8 DHATUS) ASSESSMENT                                      */}
      {/* ========================================================================= */}
      {subTab === 'sara' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-[#DCE3EC] p-5 rounded-3xl shadow-xs flex items-center justify-between">
            <div>
              <Badge className="bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] text-[10px] font-black uppercase">
                Layer 2: 8 Dhatu Structural Sub-Scores
              </Badge>
              <h3 className="text-xl font-black text-[#16213A] mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
                {isHi ? 'अष्टधातु सार परीक्षा' : 'Ashta Dhatu Sara Pariksha'}
              </h3>
            </div>
            <span className="text-xs text-[#5B677E] font-medium hidden sm:inline">
              Pravara (High) • Madhyama (Medium) • Avara (Low / Dushya Candidate)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SARA_DHATU_METRICS.map((dhatu) => {
              const currentScore = saraStats[dhatu.dhatuId] || { percentage: 50, grade: 'Madhyama' };
              return (
                <div key={dhatu.dhatuId} className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#DCE3EC] pb-2">
                    <span className="font-black text-sm text-[#16213A]">{isHi ? dhatu.nameHi : dhatu.nameEn}</span>
                    <Badge className={
                      currentScore.grade === 'Pravara' ? 'bg-emerald-100 text-emerald-800' :
                      (currentScore.grade === 'Avara' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800')
                    }>
                      {currentScore.grade} ({currentScore.percentage}%)
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {dhatu.subQuestions.map((sq) => {
                      const val = saraAnswers[sq.id] !== undefined ? Number(saraAnswers[sq.id]) : 1;
                      return (
                        <div key={sq.id} className="space-y-1.5">
                          <label className="text-xs font-bold text-[#5B677E]">{isHi ? sq.labelHi : sq.labelEn}</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: 'Avara (Low)', val: 0, color: 'hover:bg-red-50' },
                              { label: 'Madhyama', val: 1, color: 'hover:bg-blue-50' },
                              { label: 'Pravara (High)', val: 2, color: 'hover:bg-emerald-50' }
                            ].map((g) => (
                              <button
                                key={g.val}
                                onClick={() => handleSaraAnswer(sq.id, g.val)}
                                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  val === g.val
                                    ? 'bg-[#0B4C8C] text-white border-[#0B4C8C] shadow-2xs'
                                    : `bg-[#F1F6FC] text-[#16213A] border-[#DCE3EC] ${g.color}`
                                }`}
                              >
                                {g.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: PRAMANA, SAMHANANA, SATMYA, SATTVA & BALA                       */}
      {/* ========================================================================= */}
      {subTab === 'pramana' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pramana Anthropometric Inputs */}
          <div className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#DCE3EC] pb-3">
              <div className="flex items-center gap-2 text-[#0B4C8C] font-black text-base">
                <Scale size={20} className="text-[#E2861E]" />
                <span>{isHi ? 'प्रमाण परीक्षा (Anthropometrics)' : 'Pramana Pariksha'}</span>
              </div>
              <Badge className="bg-[#F5F9FF] text-[#0B4C8C] font-bold text-xs">
                BMI: {pramanaStats.bmi} ({pramanaStats.bmiCategory})
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#5B677E]">{isHi ? 'ऊंचाई (Height cm)' : 'Height (cm)'}</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full bg-[#F5F9FF] border border-[#DCE3EC] rounded-xl h-11 px-3 text-sm font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5B677E]">{isHi ? 'वजन (Weight kg)' : 'Weight (kg)'}</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full bg-[#F5F9FF] border border-[#DCE3EC] rounded-xl h-11 px-3 text-sm font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5B677E]">{isHi ? 'कमर (Waist cm)' : 'Waist (cm)'}</label>
                <input
                  type="number"
                  value={waistCm}
                  onChange={(e) => setWaistCm(e.target.value)}
                  className="w-full bg-[#F5F9FF] border border-[#DCE3EC] rounded-xl h-11 px-3 text-sm font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5B677E]">{isHi ? 'कूल्हा (Hip cm)' : 'Hip (cm)'}</label>
                <input
                  type="number"
                  value={hipCm}
                  onChange={(e) => setHipCm(e.target.value)}
                  className="w-full bg-[#F5F9FF] border border-[#DCE3EC] rounded-xl h-11 px-3 text-sm font-bold mt-1"
                />
              </div>
            </div>

            <div className="bg-[#F5F9FF] p-3 rounded-2xl border border-[#DCE3EC] space-y-1 text-xs">
              <div className="flex justify-between font-bold text-[#16213A]">
                <span>Waist-to-Hip Ratio (WHR):</span>
                <span>{pramanaStats.whr} ({pramanaStats.isWhrElevated ? 'Elevated Medovriddhi' : 'Normal'})</span>
              </div>
              <div className="flex justify-between text-[#5B677E]">
                <span>Angula Proportion Flag:</span>
                <span>{pramanaStats.statureFlag}</span>
              </div>
            </div>
          </div>

          {/* Samhanana, Satmya, Sattva, Vyayama */}
          <div className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#0B4C8C] font-black text-base border-b border-[#DCE3EC] pb-3">
              <Brain size={20} className="text-[#E2861E]" />
              <span>{isHi ? 'संहनन, सात्म्य व सत्त्व परीक्षा' : 'Samhanana, Satmya & Sattva'}</span>
            </div>

            {/* Samhanana */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5B677E]">{isHi ? 'संहनन (Compactness & Structure)' : 'Samhanana (Bone & Joint Compactness)'}</label>
              <div className="grid grid-cols-3 gap-2">
                {['Pravara', 'Madhyama', 'Avara'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSamhanana(s)}
                    className={`py-2 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      samhanana === s ? 'bg-[#0B4C8C] text-white border-[#0B4C8C]' : 'bg-[#F1F6FC] text-[#16213A] border-[#DCE3EC]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Sattva */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5B677E]">{isHi ? 'सत्त्व (Mental Stamina & Pain Tolerance)' : 'Sattva (Mental Resilience & Pain Tolerance)'}</label>
              <div className="grid grid-cols-3 gap-2">
                {['Pravara', 'Madhyama', 'Avara'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSattva(s)}
                    className={`py-2 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      sattva === s ? 'bg-[#0B4C8C] text-white border-[#0B4C8C]' : 'bg-[#F1F6FC] text-[#16213A] border-[#DCE3EC]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Vyayama Shakti */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5B677E]">{isHi ? 'व्यायाम शक्ति (Exercise Tolerance)' : 'Vyayama Shakti (Physical Endurance)'}</label>
              <div className="grid grid-cols-3 gap-2">
                {['Pravara', 'Madhyama', 'Avara'].map(s => (
                  <button
                    key={s}
                    onClick={() => setVyayama(s)}
                    className={`py-2 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      vyayama === s ? 'bg-[#0B4C8C] text-white border-[#0B4C8C]' : 'bg-[#F1F6FC] text-[#16213A] border-[#DCE3EC]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 5: LIVE LAYER 3 SAMPRAPTI SYNTHESIS PREVIEW                        */}
      {/* ========================================================================= */}
      {subTab === 'samprapti' && (
        <div className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE3EC] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#FFF7ED] text-[#E2861E] border border-[#FED7AA] text-[10px] font-black uppercase">
                  Layer 3: Deterministic Samprapti Synthesizer
                </Badge>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  {liveSamprapti.disclaimer}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#16213A] mt-2" style={{ fontFamily: "'Fraunces', serif" }}>
                Samprapti Ghataka Chain Flow
              </h3>
            </div>

            <Badge className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1.5 rounded-xl border border-emerald-300">
              Confidence Score: {liveSamprapti.confidenceScore}%
            </Badge>
          </div>

          {/* Flow Visual Chain */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: '1. Dosha', val: liveSamprapti.ghatakas.dosha.value, sub: `Surge: Δ ${liveSamprapti.ghatakas.dosha.deltaSurge > 0 ? '+' : ''}${liveSamprapti.ghatakas.dosha.deltaSurge}%`, bg: 'bg-[#FFF7ED]', border: 'border-[#FED7AA]' },
              { title: '2. Dushya', val: liveSamprapti.ghatakas.dushya.value, sub: 'Afflicted Tissues', bg: 'bg-[#F5F9FF]', border: 'border-[#DCE3EC]' },
              { title: '3. Srotas', val: liveSamprapti.ghatakas.srotas.value, sub: '13 Channels', bg: 'bg-[#F0FDF4]', border: 'border-[#BBF7D0]' },
              { title: '4. Srotodushti', val: liveSamprapti.ghatakas.srotodushti.value, sub: 'Pathological Mode', bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]' },
              { title: '5. Udbhavasthana', val: liveSamprapti.ghatakas.udbhavasthana.value, sub: 'Primary Origin', bg: 'bg-[#F1F6FC]', border: 'border-[#BFD3E8]' },
              { title: '6. Vyaktasthana', val: liveSamprapti.ghatakas.vyaktasthana.value, sub: 'Manifestation Site', bg: 'bg-[#FAF5FF]', border: 'border-[#E9D5FF]' }
            ].map((g, idx) => (
              <div key={idx} className={`${g.bg} border-2 ${g.border} p-4 rounded-2xl space-y-1 shadow-2xs`}>
                <span className="text-[10px] font-black uppercase text-[#5B677E]">{g.title}</span>
                <p className="text-xs font-black text-[#16213A] line-clamp-2">{g.val}</p>
                <p className="text-[10px] text-[#5B677E] font-medium">{g.sub}</p>
              </div>
            ))}
          </div>

          {/* Traceable Rationale */}
          <div className="bg-[#F1F6FC] border border-[#DCE3EC] p-4 rounded-2xl space-y-2">
            <span className="text-xs font-black text-[#0B4C8C] uppercase tracking-wider">Traceable Clinical Inference Rationale:</span>
            <ul className="space-y-1 text-xs text-[#37455A] font-medium">
              {liveSamprapti.traceableRationale.map((step, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2">
                  <span className="text-[#0B4C8C] font-black">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#DCE3EC] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#DCE3EC] pb-3">
                <div className="flex items-center gap-2 text-[#0B4C8C] font-black text-base">
                  <Info size={20} className="text-[#E2861E]" />
                  <span>{isHi ? 'लक्षण स्पष्टीकरण गाइड' : 'Clinical Trait Explanation'}</span>
                </div>
                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
                <p className="font-extrabold text-[#16213A] text-sm">
                  {isHi ? currentQuestion.questionHi : currentQuestion.questionEn}
                </p>

                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt) => (
                    <div key={opt.value} className="bg-[#F5F9FF] p-3 rounded-2xl border border-[#DCE3EC]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-[#0B4C8C]">
                          {isHi ? opt.labelHi : opt.labelEn}
                        </span>
                        <span className="font-black text-[10px] uppercase text-[#E2861E]">
                          {opt.dosha}
                        </span>
                      </div>
                      <p className="text-[#5B677E] font-medium">
                        {isHi ? opt.descHi : opt.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setShowInfoModal(false)}
                className="w-full bg-[#0B4C8C] hover:bg-[#08355F] text-white font-bold rounded-xl py-3 text-xs"
              >
                {isHi ? 'समझ गया (बंद करें)' : 'Got it (Close)'}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
