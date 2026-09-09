import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, ArrowLeft, ArrowRight, ShieldCheck,
  Printer, UserCheck, CheckCircle2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import voiceAssistant from '../../services/voiceAssistant';

export default function KioskLayout({ 
  currentStep, 
  totalSteps = 5, 
  stepTitle, 
  stepTitleHi,
  onPrev, 
  onNext, 
  canGoNext = true,
  children, 
  highContrast, 
  setHighContrast,
  voiceEnabled,
  setVoiceEnabled,
  currentLang,
  setCurrentLang,
  fontSize,
  setFontSize,
  redFlagAlert = null,
  onAiParsedIntent,
  patientData = {},
  intakeData = {},
  onResetKiosk
}) {
  const [showSosModal, setShowSosModal] = useState(false);
  const [showAttendantModal, setShowAttendantModal] = useState(false);

  const stepsList = [
    { num: 1, labelEn: 'Language', labelHi: 'भाषा चयन' },
    { num: 2, labelEn: 'Patient Details', labelHi: 'मरीज विवरण' },
    { num: 3, labelEn: 'Chief Complaint', labelHi: 'मुख्य लक्षण' },
    { num: 4, labelEn: 'Ayush Pariksha', labelHi: 'आयुष परीक्षा' },
    { num: 5, labelEn: 'Medical Records', labelHi: 'पुराने पर्चे' },
    { num: 6, labelEn: 'Token Slip', labelHi: 'टोकन पर्ची' },
  ];

  const toggleVoice = () => {
    const nextState = !voiceEnabled;
    setVoiceEnabled(nextState);
    if (nextState) {
      voiceAssistant.speak(
        currentLang === 'hi' 
          ? 'आवाज मार्गदर्शन चालू कर दिया गया है।' 
          : 'Voice guidance is now enabled.',
        { lang: currentLang === 'hi' ? 'hi-IN' : 'en-IN' }
      );
    } else {
      voiceAssistant.stopSpeaking();
    }
  };

  const handleLangChange = (lang) => {
    setCurrentLang(lang);
    voiceAssistant.setLanguage(lang === 'hi' ? 'hi-IN' : 'en-IN');
    if (voiceEnabled) {
      voiceAssistant.speak(lang === 'hi' ? 'हिंदी भाषा चुनी गई है।' : 'English language selected.');
    }
  };

  // Continuous unbroken cursive paths for KioskLayout Header MediKiosk
  const mediPath = "M 55 95 C 55 52, 62 28, 76 28 C 86 28, 92 48, 98 88 L 104 95 C 112 52, 122 28, 134 28 C 145 28, 148 50, 150 78 L 152 95 C 158 97, 170 85, 180 68 C 188 52, 200 52, 200 66 C 200 82, 184 96, 172 96 C 185 96, 204 94, 218 82 C 226 75, 234 62, 246 62 C 258 62, 260 76, 260 95 L 260 22 L 260 95 C 267 97, 278 90, 290 76 L 298 62 L 298 95 C 302 97, 312 95, 322 86";
  const kioskPath = "M 360 22 L 360 95 M 360 32 C 380 18, 400 22, 392 40 C 382 58, 366 68, 385 68 C 400 68, 415 86, 424 95 C 430 97, 440 88, 450 75 L 456 62 L 456 95 C 464 97, 478 97, 488 86 C 498 75, 498 60, 485 60 C 470 60, 466 75, 475 88 C 482 96, 495 94, 506 78 C 514 68, 523 62, 532 62 C 541 62, 542 71, 534 78 C 525 85, 521 89, 528 95 C 535 99, 546 94, 556 82 L 565 62 C 572 44, 577 22, 584 22 C 590 22, 586 44, 582 68 L 579 95 C 586 82, 597 62, 608 62 C 615 62, 613 74, 604 84 C 597 91, 606 95, 616 94 C 628 90, 640 82, 652 70";
  const underlinePath = "M 35 125 C 180 114, 340 112, 480 118 C 540 120, 600 124, 645 112 C 655 110, 648 104, 634 108 C 600 114, 520 124, 440 128";

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      highContrast 
        ? 'bg-black text-yellow-300 font-bold' 
        : 'bg-[#F5F9FF] text-[#16213A]'
    } ${
      fontSize === 'xl' ? 'text-xl' : fontSize === 'lg' ? 'text-lg' : 'text-base'
    }`}>
      
      {/* 1. RED-FLAG EMERGENCY BANNER */}
      <AnimatePresence>
        {redFlagAlert && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="bg-red-600 text-white px-6 py-4 shadow-2xl flex items-center justify-between z-50 sticky top-0 border-b-4 border-yellow-400"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl animate-pulse">
                <AlertTriangle size={28} className="text-yellow-300" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
                  {currentLang === 'hi' ? redFlagAlert.titleHi : redFlagAlert.title}
                </h3>
                <p className="text-xs font-medium text-red-100 mt-0.5">
                  {redFlagAlert.instruction}
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowSosModal(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black px-5 py-2.5 text-sm rounded-xl shadow-lg shrink-0"
            >
              {currentLang === 'hi' ? 'आपातकालीन सहायता' : 'Emergency Triage'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CLEAN OFFICIAL GOVERNMENT KIOSK HEADER */}
      <header className={`relative px-4 sm:px-8 py-3 border-b ${
        highContrast ? 'border-yellow-400 bg-black' : 'border-[#DCE3EC] bg-white shadow-xs'
      } flex items-center justify-between sticky top-0 z-40`}>
        
        {/* Left Side: National Emblem & Ministry of Ayush */}
        <Link to="/" className="relative z-20 flex items-center gap-3 sm:gap-3.5 group shrink-0 focus:outline-hidden">
          <img 
            src="/Emblem_of_India.svg" 
            alt="National Emblem of India" 
            className="h-11 sm:h-12 w-auto object-contain drop-shadow-xs transition-transform group-hover:scale-[1.02]" 
          />
          <div className="flex flex-col justify-center select-none">
            <span className="text-xs sm:text-sm font-medium text-slate-600 tracking-tight leading-tight">
              {currentLang === 'hi' ? 'भारत सरकार' : 'Government of India'}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight group-hover:text-[#0B4C8C] transition-colors">
              {currentLang === 'hi' ? 'आयुष मंत्रालय' : 'Ministry of Ayush'}
            </span>
          </div>
        </Link>

        {/* Center: MediKiosk Signature Branding */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-auto items-center justify-center z-10">
          <svg
            key={currentLang}
            viewBox="0 0 690 145"
            className="h-8 sm:h-9 md:h-10 w-auto overflow-visible drop-shadow-[0_4px_12px_rgba(11,76,140,0.12)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {currentLang !== 'hi' ? (
              <>
                {/* "Medi" */}
                <motion.path
                  d={mediPath}
                  stroke="#0B4C8C"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={false}
                  animate={{ pathLength: 1, opacity: 1 }}
                />
                {/* 'i' Dot for Medi */}
                <circle cx="298" cy="40" r="6" fill="#E2861E" />
                {/* "Kiosk" */}
                <motion.path
                  d={kioskPath}
                  stroke="#E2861E"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={false}
                  animate={{ pathLength: 1, opacity: 1 }}
                />
                {/* 'i' Dot for Kiosk */}
                <circle cx="456" cy="40" r="6" fill="#E2861E" />
              </>
            ) : (
              <>
                <defs>
                  <clipPath id="kioskLayoutHindiInk">
                    <motion.rect
                      x="80"
                      y="0"
                      width="540"
                      height="145"
                      initial={{ width: 0 }}
                      animate={{ width: 540 }}
                      transition={{ duration: 1.2, delay: 0.1, ease: [0.38, 0.04, 0.22, 1] }}
                    />
                  </clipPath>
                </defs>

                <g clipPath="url(#kioskLayoutHindiInk)">
                  <text
                    x="345"
                    y="90"
                    textAnchor="middle"
                    style={{ fontFamily: "'Kalam', 'Noto Sans Devanagari', sans-serif", fontWeight: 700, fontSize: '82px', letterSpacing: '1px' }}
                  >
                    <tspan fill="#0B4C8C">मेडी</tspan>
                    <tspan fill="#E2861E">कियोस्क</tspan>
                  </text>
                </g>
              </>
            )}

            <motion.path
              d={currentLang !== 'hi' ? underlinePath : "M 120 115 C 220 108, 340 106, 460 112 C 505 114, 545 116, 570 108"}
              stroke="#E2861E"
              strokeWidth={currentLang !== 'hi' ? "4" : "5"}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: currentLang !== 'hi' ? 0.3 : 1.5, ease: [0.34, 1.25, 0.64, 1] }}
            />
          </svg>
        </div>

        {/* Right Side: Clean Language Switcher */}
        <div className="relative z-20 flex items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center bg-[#F1F6FC] p-0.5 rounded-lg border border-[#DCE3EC]">
            <button
              onClick={() => handleLangChange('hi')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                currentLang === 'hi' ? 'bg-[#0B4C8C] text-white shadow-xs' : 'text-[#37455A] hover:bg-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => handleLangChange('en')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                currentLang === 'en' ? 'bg-[#0B4C8C] text-white shadow-xs' : 'text-[#37455A] hover:bg-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

      </header>

      {/* 4. STEP PROGRESS BAR */}
      <div className={`px-4 sm:px-8 py-3.5 border-b ${
        highContrast ? 'border-yellow-400/40 bg-black' : 'border-[#DCE3EC] bg-white'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-1 sm:gap-4 overflow-x-auto">
          {stepsList.map((step) => {
            const isCompleted = step.num < currentStep;
            const isCurrent = step.num === currentStep;
            return (
              <div key={step.num} className="flex items-center gap-2.5 shrink-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs transition-all shadow-xs ${
                  isCompleted 
                    ? 'bg-[#0B4C8C] text-white' 
                    : isCurrent 
                      ? 'bg-[#E2861E] text-white ring-4 ring-orange-100 font-black scale-105' 
                      : 'bg-[#F1F6FC] text-[#5B677E] border border-[#DCE3EC]'
                }`}>
                  {isCompleted ? <CheckCircle2 size={16} /> : step.num}
                </div>
                <div className="hidden sm:block text-left">
                  <p className={`text-[10px] font-extrabold uppercase tracking-wider ${isCurrent ? 'text-[#E2861E]' : 'text-[#8B8368]'}`}>
                    {currentLang === 'hi' ? `चरण ${step.num}` : `Step ${step.num}`}
                  </p>
                  <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-[#16213A]' : 'text-[#5B677E]'}`}>
                    {currentLang === 'hi' ? step.labelHi : step.labelEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. MAIN KIOSK BODY */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between">
        
        {/* Top Header Banner for Step */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge className="bg-[#F5F9FF] text-[#0B4C8C] border-[#BFD3E8] text-xs font-bold">
                {currentLang === 'hi' ? `चरण ${currentStep} / ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
              </Badge>
              <span className="text-xs text-[#5B677E] font-semibold">
                • {currentLang === 'hi' ? 'आयुष क्लिनिकल इनटेक' : 'Ayush Clinical Intake'}
              </span>
            </div>
            <h2 
              className="text-2xl sm:text-3xl font-black tracking-tight text-[#16213A]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {currentLang === 'hi' ? stepTitleHi : stepTitle}
            </h2>
          </div>
        </div>

        {/* Dynamic Step Content Area */}
        <div className="flex-1">
          {children}
        </div>

        {/* FOOTER NAVIGATION CONTROLS */}
        <div className="mt-8 pt-4 border-t border-[#DCE3EC] flex items-center justify-between bg-white p-4 rounded-2xl border border-[#DCE3EC] shadow-xs">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={currentStep === 1}
            className="border-[#DCE3EC] bg-white text-[#16213A] hover:bg-[#F1F6FC] px-6 sm:px-8 py-5 text-sm rounded-xl font-bold flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ArrowLeft size={18} />
            <span>{currentLang === 'hi' ? 'पिछला चरण' : 'Previous'}</span>
          </Button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#5B677E]">
            <ShieldCheck size={16} className="text-[#E2861E]" />
            <span>{currentLang === 'hi' ? 'सहमति आधारित सुरक्षित डेटा' : 'Consent-based secure intake'}</span>
          </div>

          <Button
            onClick={onNext}
            disabled={!canGoNext}
            className={`px-8 sm:px-10 py-5 text-sm rounded-xl font-extrabold shadow-sm flex items-center gap-2 transition-all ${
              canGoNext
                ? 'bg-[#0B4C8C] hover:bg-[#08355F] text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>
              {currentStep === totalSteps 
                ? (currentLang === 'hi' ? 'पर्ची प्रिंट व जमा करें' : 'Print Slip & Submit')
                : (currentLang === 'hi' ? 'आगे बढ़ें' : 'Continue')}
            </span>
            {currentStep === totalSteps ? <Printer size={18} /> : <ArrowRight size={18} />}
          </Button>
        </div>
      </main>

      {/* ATTENDANT ASSISTANCE MODAL */}
      <AnimatePresence>
        {showAttendantModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#DCE3EC] rounded-3xl max-w-lg w-full p-6 text-center text-[#16213A] shadow-2xl"
            >
              <div className="w-14 h-14 bg-[#F5F9FF] text-[#0B4C8C] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#BFD3E8]">
                <UserCheck size={28} />
              </div>
              <h3 className="text-xl font-black text-[#0B4C8C] mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                {currentLang === 'hi' ? 'कियोस्क सहायक को सूचित किया गया' : 'Kiosk Attendant Summoned'}
              </h3>
              <p className="text-[#5B677E] text-xs mb-6 leading-relaxed">
                {currentLang === 'hi'
                  ? 'OPD हेल्पडेस्क के सहायक आपके कियोस्क टर्मिनल-04 पर आ रहे हैं। यदि आपको फॉर्म भरने या रिपोर्ट स्कैन करने में कोई कठिनाई है, तो वे आपकी सहायता करेंगे।'
                  : 'An OPD hospital assistant has been dispatched to Kiosk Station #04 to assist you with touch input, scanning, or voice interaction.'}
              </p>
              <Button 
                onClick={() => setShowAttendantModal(false)}
                className="w-full py-3 bg-[#0B4C8C] hover:bg-[#08355F] text-white font-bold text-sm rounded-xl"
              >
                {currentLang === 'hi' ? 'धन्यवाद, समझ गया' : 'Understood (Close)'}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SOS EMERGENCY MODAL */}
      <AnimatePresence>
        {showSosModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-2 border-red-500 rounded-3xl max-w-lg w-full p-6 text-center text-[#16213A] shadow-2xl"
            >
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-black text-red-600 mb-2">
                {currentLang === 'hi' ? 'आपातकालीन सहायता सक्रिय' : 'Emergency Triage Alerted'}
              </h3>
              <p className="text-[#5B677E] text-xs mb-6">
                {currentLang === 'hi'
                  ? 'अस्पताल के आपातकालीन स्टाफ और नर्स को तुरंत सूचित कर दिया गया है। कृपया यहीं प्रतीक्षा करें।'
                  : 'Hospital emergency staff and nursing triage have been notified to assist you at this Kiosk station immediately.'}
              </p>
              <Button 
                onClick={() => setShowSosModal(false)}
                className="w-full py-3 bg-[#0B4C8C] hover:bg-[#08355F] text-white font-bold rounded-xl text-sm"
              >
                {currentLang === 'hi' ? 'बंद करें' : 'Close / Dismiss'}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
