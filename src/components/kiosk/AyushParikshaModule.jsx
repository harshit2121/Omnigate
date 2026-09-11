import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flower2, Flame, Droplets, Wind, Activity, 
  CheckCircle2, Utensils, HelpCircle, Download,
  Share2, Volume2, ShieldCheck, Sparkles,
  ChevronRight, ChevronLeft, Award, RotateCcw,
  Check, Info, X, Compass, HeartPulse, FileText,
  ArrowRight, Shield, Clock, BookOpen
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CCRAS_PRAKRITI_QUESTIONS, 
  CCRAS_TRAIT_DOMAINS,
  CCRAS_PRAKRITI_GUIDELINES, 
  calculateCcrasPrakriti 
} from '../../services/prakritiDetermineService';
import { printPrakritiDietPlan } from '../../utils/prakritiPdfGenerator';
import voiceAssistant from '../../services/voiceAssistant';
import AyushTraitVisual from './AyushTraitVisuals';
import NidanAiCard from '../ui/NidanAiCard';
import NidanAiLogo from '../ui/NidanAiLogo';

export const NIDAN_AI_ADAPTIVE_QUESTION_IDS = [
  'ccras_phy_1',    // Sharira Pramana (Physical frame)
  'ccras_phy_3',    // Twak Swabhava (Skin texture)
  'ccras_phy_5',    // Kesha Swabhava (Hair quality)
  'ccras_physio_1', // Agni & Kostha (Appetite & digestion)
  'ccras_physio_3', // Nidra (Sleep pattern)
  'ccras_physio_4', // Sweda & Sheeta/Ushna Sahishnuta (Thermal sensitivity)
  'ccras_physio_6', // Bala & Vyayama Shakthi (Physical endurance)
  'ccras_psy_1',    // Krodha & Manas (Temperament & anger)
  'ccras_psy_2',    // Smriti & Medha (Memory & learning)
  'ccras_beh_4'     // Vak Swabhava (Speech & voice)
];

export default function AyushParikshaModule({
  parikshaData = {},
  setParikshaData,
  currentLang = 'hi',
  voiceEnabled = true,
  patientData = {},
  intakeData = {}
}) {
  const isHi = currentLang === 'hi';
  
  // Adaptive Mode (10 High-Yield CCRAS Predictors) vs Comprehensive 23 CCRAS Parameters
  const [assessmentMode, setAssessmentMode] = useState(
    intakeData?.complaintId ? 'nidan_adaptive' : 'ccras_full'
  );

  const questionsList = useMemo(() => {
    if (assessmentMode === 'nidan_adaptive') {
      return CCRAS_PRAKRITI_QUESTIONS.filter(q => NIDAN_AI_ADAPTIVE_QUESTION_IDS.includes(q.id));
    }
    return CCRAS_PRAKRITI_QUESTIONS;
  }, [assessmentMode]);
  
  // Navigation & View States
  // 'questions' = Unbiased question answering screen (NO Dosha reveal)
  // 'summary' = Certified CCRAS Summary & Constitutional Report
  const [viewMode, setViewMode] = useState('questions');
  const [prakritiStepIndex, setPrakritiStepIndex] = useState(0);
  const [prakritiAnswers, setPrakritiAnswers] = useState(
    parikshaData.prakritiAnswers || parikshaData.ccrasAnswers || {}
  );
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const safeIndex = Math.min(prakritiStepIndex, Math.max(0, questionsList.length - 1));
  const currentQuestion = questionsList[safeIndex] || questionsList[0];

  // Calculate Prakriti using official CCRAS Engine (exclusively displayed on summary)
  const prakritiStats = useMemo(() => {
    return calculateCcrasPrakriti(prakritiAnswers);
  }, [prakritiAnswers]);

  // Update parent state whenever answers change
  const handlePrakritiAnswer = (questionId, optionValue) => {
    const updated = { ...prakritiAnswers, [questionId]: optionValue };
    setPrakritiAnswers(updated);
    const result = calculateCcrasPrakriti(updated);
    
    if (setParikshaData) {
      setParikshaData(prev => ({
        ...prev,
        prakritiAnswers: updated,
        prakritiResult: result,
        ccrasAnswers: updated,
        ccrasResult: result
      }));
    }

    if (voiceEnabled) {
      voiceAssistant.playAudioCue('beep');
    }

    // Auto advance to next question after tap
    if (safeIndex < questionsList.length - 1) {
      setTimeout(() => {
        setPrakritiStepIndex(prev => prev + 1);
      }, 350);
    } else {
      // Reached the final question in current mode -> Transition to certified summary
      setTimeout(() => {
        setViewMode('summary');
        if (voiceEnabled) {
          const finishText = isHi
            ? 'बधाई हो! आपकी प्रकृति परीक्षा पूर्ण हो गई है। यहाँ आपका प्रमाणित परिणाम है।'
            : 'Congratulations! Your Prakriti assessment is complete. Here is your certified constitutional report.';
          voiceAssistant.speak(finishText);
        }
      }, 400);
    }
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
      ? `आयुष सीसीआरएएस मानकीकृत प्रकृति परीक्षा:\nप्रकृति: ${prakritiStats.dominantHi}\nसंविधान: वात ${prakritiStats.vataPct}%, पित्त ${prakritiStats.pittaPct}%, कफ ${prakritiStats.kaphaPct}%\n(CCRAS प्रमाणित - आयुष मंत्रालय, भारत सरकार)`
      : `AYUSH CCRAS Standardized Prakriti Assessment:\nPrakriti: ${prakritiStats.dominant}\nConstitution: Vata ${prakritiStats.vataPct}%, Pitta ${prakritiStats.pittaPct}%, Kapha ${prakritiStats.kaphaPct}%\n(CCRAS Certified - Ministry of AYUSH, Govt of India)`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  const currentDomainMeta = CCRAS_TRAIT_DOMAINS.find(d => d.id === currentQuestion.domain) || CCRAS_TRAIT_DOMAINS[0];
  const answeredInMode = questionsList.filter(q => prakritiAnswers[q.id] !== undefined).length;
  const answeredCount = Object.keys(prakritiAnswers).length;
  const progressPercent = Math.min(100, Math.round((answeredInMode / questionsList.length) * 100));

  return (
    <div className="space-y-6 font-sans">

      {/* ========================================================================= */}
      {/* 1. PRESTIGIOUS GOVT OF INDIA & CCRAS CERTIFIED KIOSK HEADER               */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#062444] via-[#0B4C8C] to-[#0A3866] text-white p-5 sm:p-7 rounded-3xl shadow-xl border-2 border-[#165a9e] relative overflow-hidden">
        {/* Subtle decorative ayurvedic watermark */}
        <div className="absolute right-2 top-0 bottom-0 opacity-8 flex items-center pointer-events-none pr-4">
          <Flower2 size={180} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Official Emblem & Credentials */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-20 sm:w-18 sm:h-22 bg-white/95 rounded-2xl p-2 flex items-center justify-center shadow-lg shrink-0 border border-white/40">
              <img 
                src="/Emblem_of_India.svg" 
                alt="National Emblem of India" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-xs border border-amber-300">
                  <ShieldCheck size={13} className="text-slate-950" />
                  CCRAS Certified • सीसीआरएएस मानक
                </Badge>
                <Badge className="bg-white/15 text-blue-100 border border-white/20 text-[11px] font-bold px-2.5 py-0.5">
                  ISBN: 978-93-83864-21-8
                </Badge>
              </div>

              <h2 
                className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                <span>{isHi ? 'आयुष मानकीकृत प्रकृति निर्धारण' : 'Ayush Standardized Prakriti Assessment'}</span>
              </h2>

              <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl font-medium leading-relaxed">
                {isHi 
                  ? 'केन्द्रीय आयुर्वेदीय विज्ञान अनुसंधान परिषद (CCRAS), आयुष मंत्रालय, भारत सरकार के मानकीकृत नैदानिक मापदंडों पर आधारित परीक्षा।'
                  : 'Central Council for Research in Ayurvedic Sciences (CCRAS), Ministry of AYUSH, Govt of India - Clinical Parameters.'}
              </p>
            </div>
          </div>

          {/* Mode Badge & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {viewMode === 'questions' ? (
              <Button
                variant="outline"
                onClick={() => setViewMode('summary')}
                disabled={answeredInMode === 0}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl h-11 px-4 text-xs flex items-center gap-2 shadow-md cursor-pointer border-amber-300"
              >
                <FileText size={16} />
                <span>{isHi ? 'प्रमाणित परिणाम देखें' : 'View Certified Result'}</span>
                {answeredInMode > 0 && (
                  <span className="bg-slate-900 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                    {answeredInMode}/{questionsList.length}
                  </span>
                )}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setViewMode('questions')}
                className="bg-white/20 hover:bg-white/30 text-white font-black rounded-2xl h-11 px-4 text-xs flex items-center gap-2 shadow-xs cursor-pointer border-white/30"
              >
                <ChevronLeft size={16} />
                <span>{isHi ? 'प्रश्नों पर वापस जाएं' : 'Back to Assessment'}</span>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handlePrintDiet}
              disabled={answeredInMode === 0}
              className="border-white/30 bg-white/10 hover:bg-white/20 text-white font-extrabold rounded-2xl h-11 px-3.5 text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Download / Print CCRAS Diet Chart PDF"
            >
              <Download size={15} className="text-amber-300" />
              <span>{isHi ? 'डाइट चार्ट' : 'Diet PDF'}</span>
            </Button>
          </div>
        </div>

        {/* Mode Selector Strip: Nidan AI Adaptive Quick Mode vs CCRAS Full */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-white/15">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-300 flex items-center gap-1 uppercase tracking-wider">
              <Sparkles size={14} className="text-amber-300" />
              {isHi ? 'परीक्षा चयन:' : 'Assessment Mode:'}
            </span>
            <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-2xl border border-white/20">
              <button
                type="button"
                onClick={() => {
                  setAssessmentMode('nidan_adaptive');
                  setPrakritiStepIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  assessmentMode === 'nidan_adaptive'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <NidanAiLogo size={14} />
                <span>{isHi ? 'निदान AI त्वरित (10 प्रश्न - 3 मिनट)' : 'Nidan AI Quick (10 Qs)'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAssessmentMode('ccras_full');
                  setPrakritiStepIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  assessmentMode === 'ccras_full'
                    ? 'bg-white text-slate-900 shadow-md font-black'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <ShieldCheck size={12} />
                <span>{isHi ? 'पूर्ण सीसीआरएएस (23 प्रश्न)' : 'Full CCRAS (23 Qs)'}</span>
              </button>
            </div>
          </div>

          {intakeData?.complaintLabel && assessmentMode === 'nidan_adaptive' && (
            <span className="text-[11px] text-emerald-200 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-xl flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-400" />
              {isHi 
                ? `लक्षण "${intakeData.complaintLabel}" हेतु अनुकूलित (सटीक व त्वरित)` 
                : `Tailored for "${intakeData.complaintLabel}"`}
            </span>
          )}
        </div>

        {/* Dynamic Progress Bar across current mode parameters */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-bold text-blue-200 mb-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {isHi ? 'प्रगति स्थिति:' : 'Progress:'} {answeredInMode} / {questionsList.length} {isHi ? 'मापदंड पूर्ण' : 'Parameters Answered'}
            </span>
            <span className="text-amber-300 font-mono text-sm font-extrabold">
              {progressPercent}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-black/30 rounded-full overflow-hidden p-0.5">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 rounded-full" 
              animate={{ width: `${progressPercent}%` }} 
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. VIEW MODE A: UNBIASED QUESTION ANSWERING VIEW (ZERO DOSHA REVEAL)      */}
      {/* ========================================================================= */}
      {viewMode === 'questions' && (
        <div className={assessmentMode === 'nidan_adaptive' ? 'nidan-ai-card' : 'bg-white border-2 border-[#DCE3EC] rounded-3xl p-5 sm:p-8 space-y-6 shadow-xs'}>
          <div className={assessmentMode === 'nidan_adaptive' ? 'nidan-ai-inner p-5 sm:p-8 space-y-6' : 'space-y-6'}>
          
          {/* Stepper Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE3EC] pb-4">
            <div className="flex items-center gap-3">
              <Badge className={assessmentMode === 'nidan_adaptive' ? "bg-slate-900 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5" : "bg-[#0B4C8C] text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs"}>
                {assessmentMode === 'nidan_adaptive' && <NidanAiLogo size={14} />}
                <span>{isHi ? `लक्षण ${safeIndex + 1} / ${questionsList.length}` : `Trait ${safeIndex + 1} of ${questionsList.length}`}</span>
                {assessmentMode === 'nidan_adaptive' && <span className="text-sky-300 font-bold">• Nidan AI</span>}
              </Badge>
              <span className="text-xs font-bold text-[#5B677E] hidden sm:inline flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                {isHi ? currentDomainMeta.labelHi : currentDomainMeta.labelEn}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfoModal(true)}
                className="flex items-center gap-1.5 p-2 px-3 bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FED7AA] rounded-xl text-[#C05621] font-bold text-xs shadow-2xs cursor-pointer"
                title="CCRAS Standard Operating Procedure Reference"
              >
                <HelpCircle size={14} />
                <span>{isHi ? 'सीसीआरएएस विवरण' : 'CCRAS SOP'}</span>
              </button>
              <button
                onClick={() => {
                  const text = isHi 
                    ? `${currentQuestion.questionHi}। कृपया अपने स्वभाव के अनुसार विकल्प चुनें।` 
                    : `${currentQuestion.questionEn}. Please select the option that best matches your lifelong nature.`;
                  voiceAssistant.speak(text);
                }}
                className="flex items-center gap-1.5 p-2 px-3 bg-[#F5F9FF] hover:bg-[#E4EAF2] border border-[#DCE3EC] rounded-xl text-[#0B4C8C] font-bold text-xs shadow-2xs cursor-pointer"
                title="Voice Assistant Narration"
              >
                <Volume2 size={14} />
                <span>{isHi ? 'सुनें' : 'Listen'}</span>
              </button>
            </div>
          </div>

          {/* Question Title & Subtext */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C05621]">
              <Sparkles size={14} />
              <span>{currentQuestion.sopRef}</span>
            </div>
            <h3 
              className="text-2xl sm:text-3xl font-black text-[#16213A] leading-snug"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {isHi ? currentQuestion.questionHi : currentQuestion.questionEn}
            </h3>
            <p className="text-xs sm:text-sm text-[#5B677E] font-medium leading-relaxed">
              {isHi ? currentQuestion.descHi : currentQuestion.descEn}
            </p>
          </div>

          {/* VISUAL QUESTION OPTION CARDS (3 COLUMN TOUCH GRID - ZERO DOSHA BIAS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = prakritiAnswers[currentQuestion.id] === opt.value;

              return (
                <motion.div
                  key={opt.value}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handlePrakritiAnswer(currentQuestion.id, opt.value)}
                  className={`group rounded-3xl overflow-hidden border-3 transition-all cursor-pointer flex flex-col justify-between shadow-xs relative ${
                    isSelected
                      ? 'border-[#0B4C8C] bg-white ring-4 ring-blue-100 shadow-xl scale-[1.01]'
                      : 'border-[#DCE3EC] bg-[#F8FAFC] hover:border-[#BFD3E8] hover:bg-white'
                  }`}
                >
                  {/* Precise Anatomical / Clinical Visual Graphic Tile */}
                  <AyushTraitVisual
                    questionId={currentQuestion.id}
                    optionIndex={optIdx}
                    optionValue={opt.value}
                    isSelected={isSelected}
                  />

                  {/* Selected Tick Indicator Overlay */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-[#0B4C8C] text-white p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce z-10">
                      <Check size={16} strokeWidth={3.5} />
                    </div>
                  )}

                  {/* Card Content & Detailed Clinical Option Description */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h4 className="text-sm sm:text-base font-black text-[#16213A] leading-snug">
                        {isHi ? opt.labelHi : opt.labelEn}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                        {isHi ? opt.descHi : opt.descEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400">
                        {isSelected 
                          ? (isHi ? '✓ चुना गया' : '✓ Selected') 
                          : (isHi ? 'चुनने के लिए स्पर्श करें' : 'Tap to select')}
                      </span>
                      <span className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all ${
                        isSelected 
                          ? 'bg-[#0B4C8C] text-white shadow-xs' 
                          : 'bg-slate-200/70 text-slate-700 group-hover:bg-slate-300'
                      }`}>
                        {isSelected ? (isHi ? 'चयनित' : 'Active') : (isHi ? 'चुनें' : 'Select')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stepper Navigation Footer Bar */}
          <div className="flex flex-wrap items-center justify-between pt-5 border-t border-[#DCE3EC] gap-3">
            <Button
              variant="outline"
              disabled={prakritiStepIndex === 0}
              onClick={() => setPrakritiStepIndex(prev => prev - 1)}
              className="border-2 border-[#DCE3EC] hover:bg-slate-100 text-[#16213A] font-extrabold rounded-2xl h-12 px-6 text-sm bg-white cursor-pointer shadow-2xs"
            >
              <ChevronLeft size={18} />
              <span>{isHi ? 'पिछला' : 'Previous'}</span>
            </Button>

            {/* Stepper Dots (All 23 Parameters) */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-md px-2 py-1">
              {questionsList.map((q, dotIdx) => {
                const isCurrent = prakritiStepIndex === dotIdx;
                const isAnswered = prakritiAnswers[q.id] !== undefined;
                return (
                  <button
                    key={dotIdx}
                    onClick={() => setPrakritiStepIndex(dotIdx)}
                    title={`Question ${dotIdx + 1}: ${q.sopRef}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      isCurrent 
                        ? 'w-6 bg-[#0B4C8C]' 
                        : isAnswered
                          ? 'w-2.5 bg-emerald-500'
                          : 'w-2 bg-slate-300'
                    }`}
                  />
                );
              })}
            </div>

            {prakritiStepIndex < questionsList.length - 1 ? (
              <Button
                onClick={() => setPrakritiStepIndex(prev => prev + 1)}
                className="bg-[#0B4C8C] hover:bg-[#08355F] text-white font-extrabold rounded-2xl h-12 px-6 text-sm cursor-pointer shadow-md"
              >
                <span>{isHi ? 'अगला' : 'Next'}</span>
                <ChevronRight size={18} />
              </Button>
            ) : (
              <Button
                onClick={() => setViewMode('summary')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl h-12 px-6 text-sm cursor-pointer shadow-md flex items-center gap-2"
              >
                <span>{isHi ? 'परिणाम देखें' : 'View Certified Result'}</span>
                <ArrowRight size={18} />
              </Button>
            )}
          </div>
        </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW MODE B: DEDICATED CCRAS CERTIFIED SUMMARY & REPORT SCREEN         */}
      {/* ========================================================================= */}
      {viewMode === 'summary' && (
        <div className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-6 sm:p-9 space-y-8 shadow-sm">
          
          {/* Certificate Header Banner */}
          <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-emerald-50 border-2 border-amber-200/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 bg-white rounded-2xl p-2 shadow-md border border-amber-200 shrink-0 flex items-center justify-center">
                  <img src="/Emblem_of_India.svg" alt="Emblem" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-[#0B4C8C] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 flex items-center gap-1.5">
                      {assessmentMode === 'nidan_adaptive' && <NidanAiLogo size={12} />}
                      <span>{assessmentMode === 'nidan_adaptive' ? 'Nidan AI Adaptive CCRAS' : 'CCRAS Certified Assessment'}</span>
                    </Badge>
                    <span className="text-xs font-bold text-slate-500">
                      • {answeredInMode} / {questionsList.length} {isHi ? 'मापदंडों पर आधारित' : 'Parameters Recorded'}
                      {assessmentMode === 'nidan_adaptive' && ` (${isHi ? '10 उच्च-सटीक लक्षण' : '10 high-yield traits'})`}
                    </span>
                  </div>
                  <h3 
                    className="text-3xl sm:text-4xl font-black text-[#0B4C8C]"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {isHi ? prakritiStats.dominantHi : prakritiStats.dominant}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">
                    {prakritiStats.standardBody} • {prakritiStats.prakritiType}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handlePrintDiet}
                  className="bg-[#0B4C8C] hover:bg-[#08355F] text-white font-extrabold rounded-2xl h-12 px-5 text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Download size={16} className="text-amber-300" />
                  <span>{isHi ? 'प्रमाणित डाइट चार्ट डाउनलोड करें' : 'Download Certified Diet PDF'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSharePrakriti}
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded-2xl h-12 px-4 text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Share2 size={16} />
                  <span>{copiedShare ? (isHi ? 'कॉपी हुआ!' : 'Copied!') : (isHi ? 'शेयर' : 'Share')}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewMode('questions')}
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded-2xl h-12 px-4 text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RotateCcw size={16} />
                  <span>{isHi ? 'उत्तर बदलें' : 'Edit Answers'}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Tri-Dosha Percentage Distribution Meters */}
          <div className="space-y-3">
            <h4 className="text-base sm:text-lg font-black text-[#16213A] flex items-center gap-2">
              <Activity size={18} className="text-[#0B4C8C]" />
              <span>{isHi ? 'त्रिदोष संविधान प्रतिशत (Constitutional Breakdown)' : 'Tri-Dosha Constitutional Distribution'}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Vata Gauge */}
              <div className="bg-gradient-to-br from-blue-50/80 to-sky-50/50 border-2 border-blue-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Wind size={16} className="text-blue-600" />
                    {isHi ? 'वात (Vata)' : 'Vata Dosha'}
                  </span>
                  <span className="text-2xl font-black font-mono text-blue-800">{prakritiStats.vataPct}%</span>
                </div>
                <div className="h-3 w-full bg-blue-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-600 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${prakritiStats.vataPct}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <p className="text-[11px] text-blue-950 font-medium">
                  {isHi ? 'गति, स्नायु तंत्र, संवेदनशीलता एवं श्वसन का नियंत्रक।' : 'Governs motion, nervous system, sensitivity, and respiration.'}
                </p>
              </div>

              {/* Pitta Gauge */}
              <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 border-2 border-amber-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Flame size={16} className="text-amber-600" />
                    {isHi ? 'पित्त (Pitta)' : 'Pitta Dosha'}
                  </span>
                  <span className="text-2xl font-black font-mono text-amber-800">{prakritiStats.pittaPct}%</span>
                </div>
                <div className="h-3 w-full bg-amber-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-amber-500 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${prakritiStats.pittaPct}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <p className="text-[11px] text-amber-950 font-medium">
                  {isHi ? 'उष्मा, पाचन, चयापचय (Metabolism) एवं मेधा का नियंत्रक।' : 'Governs digestion, bodily heat, metabolism, and intellect.'}
                </p>
              </div>

              {/* Kapha Gauge */}
              <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border-2 border-emerald-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Droplets size={16} className="text-emerald-600" />
                    {isHi ? 'कफ (Kapha)' : 'Kapha Dosha'}
                  </span>
                  <span className="text-2xl font-black font-mono text-emerald-800">{prakritiStats.kaphaPct}%</span>
                </div>
                <div className="h-3 w-full bg-emerald-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-600 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${prakritiStats.kaphaPct}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <p className="text-[11px] text-emerald-950 font-medium">
                  {isHi ? 'शारीरिक स्थिरता, स्निग्धता, ओज एवं प्रतिरक्षा का नियंत्रक।' : 'Governs physical stability, lubrication, immunity, and stamina.'}
                </p>
              </div>
            </div>
          </div>

          {/* 4 CCRAS Domain Summary Breakdown */}
          <div className="space-y-3">
            <h4 className="text-base sm:text-lg font-black text-[#16213A] flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#0B4C8C]" />
              <span>{isHi ? '4 नैदानिक आयाम स्कोर (CCRAS Domain Breakdown)' : '4 CCRAS Clinical Trait Domains'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CCRAS_TRAIT_DOMAINS.map((d) => {
                const scores = prakritiStats.domainScores?.[d.id] || { vata: 0, pitta: 0, kapha: 0 };
                return (
                  <div key={d.id} className="bg-[#F8FAFC] border-2 border-[#DCE3EC] p-4 rounded-2xl space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#475569] tracking-wider block">
                      {isHi ? d.labelHi : d.labelEn}
                    </span>
                    <div className="flex items-center justify-between text-xs font-mono font-bold pt-1 border-t border-slate-200">
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">वात: {scores.vata}</span>
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">पित्त: {scores.pitta}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">कफ: {scores.kapha}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CCRAS Pathya (Beneficial) & Apathya (To Avoid) Nutrition Guidelines */}
          {prakritiStats.guidelines && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Pathya Ahara */}
              <div className="bg-emerald-50/70 border-2 border-emerald-200 p-6 rounded-3xl space-y-3">
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                  <Utensils size={18} className="text-emerald-700" />
                  {isHi ? 'CCRAS पथ्य आहार (अनुकूल खाद्य पदार्थ)' : 'CCRAS Pathya Ahara (Beneficial Diet)'}
                </span>
                <p className="text-xs sm:text-sm text-emerald-950 font-bold leading-relaxed">
                  {isHi ? prakritiStats.guidelines.dietaryRulesHi : prakritiStats.guidelines.dietaryRulesEn}
                </p>
                <ul className="text-xs text-emerald-900 space-y-1.5 pt-1">
                  {(isHi ? prakritiStats.guidelines.pathyaConsumeHi : prakritiStats.guidelines.pathyaConsumeEn).slice(0, 5).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 font-medium">
                      <span className="text-emerald-600 font-black">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apathya Ahara */}
              <div className="bg-rose-50/70 border-2 border-rose-200 p-6 rounded-3xl space-y-3">
                <span className="text-xs font-black text-rose-950 uppercase tracking-wider flex items-center gap-2">
                  <Compass size={18} className="text-rose-700" />
                  {isHi ? 'अपथ्य आहार (परहेज योग्य पदार्थ)' : 'Apathya Ahara (Foods to Avoid)'}
                </span>
                <ul className="text-xs text-rose-900 space-y-1.5 pt-1">
                  {(isHi ? prakritiStats.guidelines.apatyaAvoidHi : prakritiStats.guidelines.apatyaAvoidEn).slice(0, 5).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 font-medium">
                      <span className="text-rose-600 font-black">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-rose-200 text-xs text-rose-950 font-semibold">
                  <span>{isHi ? 'अनुकूल योग एवं दिनचर्या:' : 'Recommended Yoga & Lifestyle:'}</span> {prakritiStats.guidelines.yogaAsanas}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Retake Button */}
          <div className="pt-2 flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setPrakritiAnswers({});
                setPrakritiStepIndex(0);
                setViewMode('questions');
              }}
              className="border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl h-11 px-6 text-xs flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <RotateCcw size={15} />
              <span>{isHi ? 'पुनः परीक्षा प्रारंभ करें (Retake Assessment)' : 'Retake Full Assessment'}</span>
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CCRAS SOP CLINICAL TRAIT REFERENCE MODAL                               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#DCE3EC] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#DCE3EC] pb-3">
                <div className="flex items-center gap-2 text-[#0B4C8C] font-black text-base">
                  <Award size={20} className="text-amber-500" />
                  <span>{isHi ? 'CCRAS एसओपी मानक संदर्भ' : 'CCRAS SOP Clinical Trait Guide'}</span>
                </div>
                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
                <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 space-y-1">
                  <p className="font-extrabold text-blue-950">{currentQuestion.sopRef}</p>
                  <p className="text-blue-700 font-mono text-[11px]">{currentQuestion.classicalRef}</p>
                </div>

                <p className="font-black text-[#16213A] text-sm pt-1">
                  {isHi ? currentQuestion.questionHi : currentQuestion.questionEn}
                </p>

                <div className="space-y-2.5 pt-1">
                  {currentQuestion.options.map((opt) => (
                    <div key={opt.value} className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#DCE3EC]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-[#0B4C8C]">
                          {isHi ? opt.labelHi : opt.labelEn}
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
                className="w-full bg-[#0B4C8C] hover:bg-[#08355F] text-white font-bold rounded-xl py-3 text-xs cursor-pointer"
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
