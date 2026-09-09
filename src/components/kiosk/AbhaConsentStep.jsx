import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, Lock, Volume2, 
  ArrowRight, Sparkles, QrCode, CreditCard, User, Check,
  CheckSquare, X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import voiceAssistant from '../../services/voiceAssistant';

export default function AbhaConsentStep({ 
  patientData, 
  setPatientData, 
  currentLang = 'hi', 
  voiceEnabled 
}) {
  const isHi = currentLang === 'hi';
  
  // Active Mode: null | 'walkin' | 'scanner' | 'abhanumber' | 'completed'
  const [selectedMode, setSelectedMode] = useState(patientData.name ? 'completed' : null);
  
  // Inputs
  const [walkinForm, setWalkinForm] = useState({
    name: patientData.name || '',
    age: patientData.age || '',
    gender: patientData.gender || 'Male',
    phone: patientData.phone || '',
    city: patientData.city || 'New Delhi'
  });

  const [abhaInput, setAbhaInput] = useState(patientData.abhaId || '91-8472-9013-4482');
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Consent Window Modal State
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentGranted, setConsentGranted] = useState(patientData.consent || false);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  // 1. Walk-in Submit -> triggers Consent Window
  const handleWalkinProceed = (e) => {
    e?.preventDefault();
    if (!walkinForm.name.trim() || !walkinForm.age) {
      alert(isHi ? 'कृपया मरीज का नाम और आयु दर्ज करें।' : 'Please enter patient name and age.');
      return;
    }
    const hhid = `HH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    setPatientData({
      ...patientData,
      name: walkinForm.name,
      age: walkinForm.age,
      gender: walkinForm.gender,
      phone: walkinForm.phone || '9876543210',
      city: walkinForm.city || 'New Delhi',
      hhid,
      abhaId: '',
      consent: false
    });
    setShowConsentModal(true);
  };

  // 2. ABHA QR Scanner Trigger
  const handleStartScan = () => {
    setIsScanning(true);
    voiceAssistant.playAudioCue('beep');
    setTimeout(() => {
      setIsScanning(false);
      const scannedProfile = {
        name: isHi ? 'राम शरण शर्मा' : 'Ram Sharan Sharma',
        age: '48',
        gender: 'Male',
        phone: '9811223344',
        city: 'New Delhi',
        hhid: `HH-${new Date().getFullYear()}-847`,
        abhaId: '91-8472-9013-4482',
        consent: false
      };
      setPatientData({
        ...patientData,
        ...scannedProfile
      });
      voiceAssistant.playAudioCue('success');
      setShowConsentModal(true);
    }, 1600);
  };

  // 3. ABHA Number Manual Verify
  const handleVerifyAbha = () => {
    if (!abhaInput.trim() || abhaInput.length < 10) {
      alert(isHi ? 'कृपया वैध 14-अंकीय आभा नंबर दर्ज करें।' : 'Please enter a valid 14-digit ABHA Number.');
      return;
    }
    setIsVerifying(true);
    voiceAssistant.playAudioCue('beep');
    setTimeout(() => {
      setIsVerifying(false);
      const verifiedProfile = {
        name: isHi ? 'सुनीता देवी' : 'Sunita Devi',
        age: '42',
        gender: 'Female',
        phone: '9876501234',
        city: 'New Delhi',
        hhid: `HH-${new Date().getFullYear()}-512`,
        abhaId: abhaInput,
        consent: false
      };
      setPatientData({
        ...patientData,
        ...verifiedProfile
      });
      voiceAssistant.playAudioCue('success');
      setShowConsentModal(true);
    }, 1200);
  };

  // 4. Accept Consent in Modal
  const handleGrantConsent = () => {
    setConsentGranted(true);
    setPatientData((prev) => ({
      ...prev,
      consent: true
    }));
    setShowConsentModal(false);
    setSelectedMode('completed');
    voiceAssistant.playAudioCue('success');
    if (voiceEnabled) {
      voiceAssistant.speak(
        isHi
          ? 'सहमति सफलतापूर्वक दर्ज हो गई है। अब मुख्य लक्षणों के चरण पर आगे बढ़ें।'
          : 'Consent granted successfully. You may now proceed to Chief Complaint.',
        { lang: isHi ? 'hi-IN' : 'en-IN' }
      );
    }
  };

  const playConsentAudio = () => {
    const text = isHi
      ? 'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 और आभा सहमति फ्रेमवर्क के अनुसार, आपकी स्वास्थ्य जानकारी केवल डॉक्टर के परामर्श और चिकित्सा इतिहास तैयार करने के लिए सुरक्षित रूप से उपयोग की जाएगी।'
      : 'In compliance with DPDP Act 2023 and ABDM consent architecture, your clinical history and documents are encrypted and shared solely for physician consultation.';
    voiceAssistant.speak(text, { lang: isHi ? 'hi-IN' : 'en-IN' });
  };

  return (
    <div className="space-y-6 font-sans select-none max-w-5xl mx-auto">
      
      {/* Header Prompt */}
      <div className="text-center space-y-1">
        <h3 
          className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {isHi ? 'मरीज पंजीकरण विधि चुनें' : 'Select Patient Registration Method'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto">
          {isHi 
            ? 'नीचे दिए गए 3 विकल्पों में से किसी एक को चुनें — त्वरित ओपीडी टोकन हेतु'
            : 'Choose from the 3 quick identification methods below to initiate clinical intake'}
        </p>
      </div>

      {/* =========================================================================
          THE 3 INTERACTIVE ANIMATED CARDS
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* ================= CARD 1: WALK-IN REGISTRATION (HIGH-FIDELITY WALKING ANIMATION) ================= */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedMode('walkin')}
          className={`relative rounded-2xl p-5 sm:p-6 border-2 transition-all cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
            selectedMode === 'walkin'
              ? 'border-emerald-600 bg-emerald-50/60 ring-4 ring-emerald-500/15'
              : 'border-slate-200/90 bg-white hover:border-emerald-400/80 hover:bg-emerald-50/20'
          }`}
        >
          {/* Top Tag */}
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
              {isHi ? 'सीधा प्रवेश' : 'Walk-in'}
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <User size={16} />
            </div>
          </div>

          {/* Modern Stylized Vector Patient Walk-in Animation */}
          <div className="h-36 flex flex-col items-center justify-center relative py-1 overflow-hidden">
            <svg viewBox="0 0 220 140" className="w-48 h-32 overflow-visible">
              <defs>
                {/* Gradients for modern flat-vector look */}
                <linearGradient id="walkFloorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.05" />
                  <stop offset="30%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#059669" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="1" />
                </linearGradient>

                <linearGradient id="patientShirt" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>

                <linearGradient id="patientPants" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>

                <linearGradient id="clinicDoorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ECFDF5" />
                  <stop offset="100%" stopColor="#D1FAE5" />
                </linearGradient>

                <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Hospital OPD Entrance Arch on Right */}
              <g transform="translate(170, 24)">
                {/* Door Frame */}
                <rect x="0" y="0" width="36" height="98" rx="6" fill="url(#clinicDoorGrad)" stroke="#A7F3D0" strokeWidth="1.5" />
                <line x1="18" y1="2" x2="18" y2="98" stroke="#6EE7B7" strokeWidth="1" strokeDasharray="3 3" />
                {/* Clinic Cross Sign */}
                <circle cx="18" cy="22" r="11" fill="#10B981" filter="url(#glowGreen)" opacity="0.9" />
                <path d="M 18 16 L 18 28 M 12 22 L 24 22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                {/* OPD Text */}
                <text x="18" y="44" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#065F46" letterSpacing="0.5">OPD</text>
                {/* Floor Sensor Light */}
                <circle cx="18" cy="98" r="4" fill="#34D399" opacity="0.7" />
              </g>

              {/* Animated Hospital Walkway Path */}
              <line x1="10" y1="122" x2="200" y2="122" stroke="url(#walkFloorGrad)" strokeWidth="3" strokeLinecap="round" />
              
              {/* Moving Floor Dots */}
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0 0; -32 0"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
                {[0, 32, 64, 96, 128, 160, 192, 224, 256].map((cx, i) => (
                  <circle key={i} cx={cx} cy="122" r="2.5" fill="#10B981" opacity="0.7" />
                ))}
              </g>

              {/* Soft Walk Dynamic Shadow */}
              <ellipse cx="88" cy="124" rx="20" ry="3.5" fill="#0F172A" opacity="0.22">
                <animate attributeName="rx" values="22; 15; 22; 15; 22" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25; 0.12; 0.25; 0.12; 0.25" dur="0.9s" repeatCount="indefinite" />
              </ellipse>

              {/* Modern Stylized Vector Patient Character */}
              <g transform="translate(16, 0)">
                
                {/* BACK LEG (Left Leg) */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="28 70 80; -28 70 80; 28 70 80"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                  {/* Thigh */}
                  <path d="M 70 80 Q 74 95 78 104" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
                  {/* Calf & Shoe */}
                  <path d="M 78 104 L 84 122 L 94 123" stroke="#1E293B" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* White Sneaker Sole */}
                  <path d="M 83 123 L 95 123" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                {/* BACK ARM (Holding Medical Folder / File) */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="-24 72 56; 24 72 56; -24 72 56"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                  <path d="M 72 56 L 82 72 L 90 78" stroke="#047857" strokeWidth="5" strokeLinecap="round" />
                  {/* OPD Medical Registration File */}
                  <rect x="85" y="70" width="13" height="16" rx="2" fill="#F8FAFC" stroke="#059669" strokeWidth="1.2" transform="rotate(-15, 85, 70)" />
                  <line x1="88" y1="75" x2="94" y2="73" stroke="#10B981" strokeWidth="1.2" />
                  <line x1="87" y1="78" x2="93" y2="76" stroke="#94A3B8" strokeWidth="1" />
                </g>

                {/* TORSO & HEAD (Natural Walking Bob & Gentle Forward Lean) */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 -4; 0 0; 0 -4; 0 0"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                  {/* Stylish Modern Head */}
                  <circle cx="72" cy="34" r="10" fill="#FBBF24" /> {/* Skin Tone */}
                  {/* Modern Hair Silhouette */}
                  <path d="M 64 34 C 64 24 78 22 81 30 C 81 33 76 34 76 35 C 74 34 68 34 64 34 Z" fill="#0F172A" />
                  
                  {/* Face Profile Ear */}
                  <circle cx="73" cy="35" r="1.8" fill="#F59E0B" />

                  {/* Neck */}
                  <path d="M 72 43 L 72 49" stroke="#FBBF24" strokeWidth="4.5" strokeLinecap="round" />

                  {/* Clean Emerald Polo Shirt / Torso */}
                  <path 
                    d="M 64 49 C 64 47 80 47 80 49 L 78 82 C 78 83 66 83 66 82 Z" 
                    fill="url(#patientShirt)" 
                  />
                  {/* Shirt Collar V-line */}
                  <path d="M 69 49 L 72 56 L 75 49" stroke="#A7F3D0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  {/* Hospital Token Badge on Chest */}
                  <rect x="73" y="58" width="4.5" height="6" rx="1" fill="#FFFFFF" opacity="0.9" />
                  <rect x="74" y="59.5" width="2.5" height="1" fill="#059669" />
                </g>

                {/* FRONT LEG (Right Leg - Counter-Phase) */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="-28 72 80; 28 72 80; -28 72 80"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                  {/* Front Thigh */}
                  <path d="M 72 80 Q 68 95 64 104" stroke="#0F172A" strokeWidth="8.5" strokeLinecap="round" />
                  {/* Front Calf & Shoe */}
                  <path d="M 64 104 L 56 122 L 68 123" stroke="#020617" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Emerald Sneaker Accent */}
                  <path d="M 56 123 L 69 123" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                {/* FRONT ARM (Swinging naturally forward) */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="24 71 52; -24 71 52; 24 71 52"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                  {/* Front Sleeve & Arm */}
                  <path d="M 71 52 L 63 68 L 56 78" stroke="#059669" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Hand */}
                  <circle cx="56" cy="78" r="3" fill="#FBBF24" />
                </g>

              </g>

              {/* Gentle Floating Welcome Sparkle near Entrance */}
              <g>
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  values="0.8; 1.25; 0.8"
                  dur="2s"
                  repeatCount="indefinite"
                  additive="sum"
                />
                <path d="M 155 35 L 157 40 L 162 42 L 157 44 L 155 49 L 153 44 L 148 42 L 153 40 Z" fill="#34D399" />
              </g>
            </svg>
          </div>

          {/* Text Content */}
          <div className="mt-2 text-center space-y-1">
            <h4 className="text-base font-black text-slate-900">
              {isHi ? 'सीधा ओपीडी पंजीकरण' : 'Walk-in Registration'}
            </h4>
            <p className="text-xs text-slate-500 leading-snug">
              {isHi ? 'बिना आभा कार्ड का तुरंत मरीज विवरण भरें' : 'Direct manual intake for new & walk-in OPD patients'}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center text-xs font-bold text-emerald-700 gap-1">
            <span>{isHi ? 'विवरण भरें' : 'Enter Details'}</span>
            <ArrowRight size={14} />
          </div>
        </motion.div>


        {/* ================= CARD 2: ABHA QR SCANNER (THEMED CLINICAL BLUE & SAFFRON) ================= */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedMode('scanner')}
          className={`relative rounded-2xl p-5 sm:p-6 border-2 transition-all cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
            selectedMode === 'scanner'
              ? 'border-[#E2861E] bg-amber-50/60 ring-4 ring-amber-500/15'
              : 'border-slate-200/90 bg-white hover:border-amber-400/80 hover:bg-amber-50/20'
          }`}
        >
          {/* Top Tag */}
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              {isHi ? 'सबसे तेज • 2 सेकंड' : 'Fastest • 2 Sec'}
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-[#E2861E] flex items-center justify-center">
              <QrCode size={16} />
            </div>
          </div>

          {/* Themed High-Precision Optical Scanner Graphic */}
          <div className="h-36 flex flex-col items-center justify-center relative py-1">
            <div className="relative w-32 h-32 bg-[#0B2A4A] rounded-2xl p-3 flex items-center justify-center shadow-md border-2 border-[#E2861E]/80 overflow-hidden">
              
              {/* Ayush/NHA Corner Brackets */}
              <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-3 border-l-3 border-[#E2861E] rounded-tl-sm" />
              <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-3 border-r-3 border-[#E2861E] rounded-tr-sm" />
              <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-3 border-l-3 border-[#E2861E] rounded-bl-sm" />
              <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-3 border-r-3 border-[#E2861E] rounded-br-sm" />

              {/* Crisp Vector QR Matrix with Ayush Duo-Tone */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="currentColor">
                {/* 3 Corner Anchor Targets */}
                <rect x="8" y="8" width="26" height="26" rx="3" fill="none" stroke="#E2861E" strokeWidth="5" />
                <rect x="15" y="15" width="12" height="12" rx="1.5" fill="#E2861E" />
                
                <rect x="66" y="8" width="26" height="26" rx="3" fill="none" stroke="#0B4C8C" strokeWidth="5" />
                <rect x="73" y="15" width="12" height="12" rx="1.5" fill="#38BDF8" />

                <rect x="8" y="66" width="26" height="26" rx="3" fill="none" stroke="#0B4C8C" strokeWidth="5" />
                <rect x="15" y="73" width="12" height="12" rx="1.5" fill="#38BDF8" />

                {/* Themed Data Matrix Dots */}
                <rect x="42" y="12" width="7" height="7" rx="1" fill="#E2861E" />
                <rect x="53" y="12" width="7" height="7" rx="1" fill="#FFFFFF" />
                <rect x="42" y="24" width="7" height="7" rx="1" fill="#FFFFFF" />
                <rect x="42" y="44" width="7" height="7" rx="1" fill="#38BDF8" />
                <rect x="53" y="44" width="7" height="7" rx="1" fill="#E2861E" />
                <rect x="64" y="44" width="7" height="7" rx="1" fill="#FFFFFF" />
                <rect x="12" y="44" width="7" height="7" rx="1" fill="#FFFFFF" />
                <rect x="24" y="53" width="7" height="7" rx="1" fill="#E2861E" />
                <rect x="75" y="53" width="7" height="7" rx="1" fill="#38BDF8" />
                <rect x="86" y="64" width="7" height="7" rx="1" fill="#FFFFFF" />
                <rect x="44" y="75" width="7" height="7" rx="1" fill="#FFFFFF" />
                <rect x="55" y="86" width="7" height="7" rx="1" fill="#E2861E" />
                <rect x="75" y="75" width="7" height="7" rx="1" fill="#E2861E" />
                <rect x="86" y="86" width="7" height="7" rx="1" fill="#38BDF8" />

                {/* Central Ayush Cross Badge */}
                <circle cx="50" cy="50" r="10" fill="#0B2A4A" stroke="#E2861E" strokeWidth="2" />
                <path d="M 50 44 L 50 56 M 44 50 L 56 50" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
              </svg>

              {/* Glowing High-Tech Saffron Laser Beam */}
              <motion.div 
                className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#E2861E] to-transparent shadow-[0_0_18px_#E2861E]"
                animate={{ top: ['6%', '90%', '6%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Ambient Laser Sweeping Sheen */}
              <motion.div 
                className="absolute inset-x-0 h-10 bg-gradient-to-b from-[#E2861E]/25 to-transparent pointer-events-none"
                animate={{ top: ['0%', '75%', '0%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="mt-2 text-center space-y-1">
            <h4 className="text-base font-black text-slate-900">
              {isHi ? 'आभा क्यूआर स्कैनर' : 'ABHA QR Scanner'}
            </h4>
            <p className="text-xs text-slate-500 leading-snug">
              {isHi ? 'आयुष्मान कार्ड या आभा ऐप का QR कोड दिखाएं' : 'Instant camera scan for Ayushman & ABHA QR codes'}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center text-xs font-bold text-[#E2861E] gap-1">
            <span>{isHi ? 'QR स्कैन करें' : 'Scan Now'}</span>
            <ArrowRight size={14} />
          </div>
        </motion.div>


        {/* ================= CARD 3: ABHA NUMBER (BIG PROMINENT NUMERIC DIGITS - NO PLASTIC CARD) ================= */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedMode('abhanumber')}
          className={`relative rounded-2xl p-5 sm:p-6 border-2 transition-all cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
            selectedMode === 'abhanumber'
              ? 'border-[#0B4C8C] bg-blue-50/60 ring-4 ring-blue-500/15'
              : 'border-slate-200/90 bg-white hover:border-blue-400/80 hover:bg-blue-50/20'
          }`}
        >
          {/* Top Tag */}
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-blue-100 text-[#0B4C8C] border border-blue-300">
              {isHi ? '14-अंकीय नंबर' : '14 Digits'}
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0B4C8C] flex items-center justify-center">
              <CreditCard size={16} />
            </div>
          </div>

          {/* Big, Prominent, High-Contrast Digital Numeric Digits Display */}
          <div className="h-36 flex flex-col items-center justify-center relative py-1">
            <div className="w-full flex flex-col items-center gap-2">
              
              {/* Primary Bold Segmented Digit Tiles */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {['9', '1'].map((num, i) => (
                  <motion.div 
                    key={i}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
                    className="w-9 h-11 sm:w-10 sm:h-12 rounded-xl bg-gradient-to-b from-[#0B4C8C] to-[#08355F] text-amber-300 font-mono font-black text-xl sm:text-2xl flex items-center justify-center shadow-md border-t border-blue-400/40"
                  >
                    {num}
                  </motion.div>
                ))}
                
                <span className="text-[#0B4C8C] font-black text-xl">-</span>

                {['8', '4', '7', '2'].map((num, i) => (
                  <motion.div 
                    key={i + 2}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, delay: (i + 2) * 0.15, repeat: Infinity }}
                    className="w-9 h-11 sm:w-10 sm:h-12 rounded-xl bg-slate-100 text-[#0B4C8C] font-mono font-black text-xl sm:text-2xl flex items-center justify-center shadow-xs border border-slate-300"
                  >
                    {num}
                  </motion.div>
                ))}
              </div>

              {/* Floating Numeric Keypad Buttons Cue */}
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                <span className="text-[#0B4C8C] font-extrabold">1 2 3</span>
                <span>•</span>
                <span className="text-[#E2861E] font-extrabold">4 5 6</span>
                <span>•</span>
                <span className="text-slate-600 font-extrabold">7 8 9 0</span>
              </div>

            </div>
          </div>

          {/* Text Content */}
          <div className="mt-2 text-center space-y-1">
            <h4 className="text-base font-black text-slate-900">
              {isHi ? '14-अंकीय आभा नंबर दर्ज करें' : 'Enter 14-Digit ABHA ID'}
            </h4>
            <p className="text-xs text-slate-500 leading-snug">
              {isHi ? 'कीपैड या मोबाइल ओटीपी द्वारा सीधे नंबर दर्ज करें' : 'Type your 14-digit number or authenticate via OTP'}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center text-xs font-bold text-[#0B4C8C] gap-1">
            <span>{isHi ? 'नंबर दर्ज करें' : 'Enter ID'}</span>
            <ArrowRight size={14} />
          </div>
        </motion.div>

      </div>


      {/* =========================================================================
          INTERACTIVE ACTION PANELS (When a card is active)
      ========================================================================= */}
      <AnimatePresence mode="wait">
        
        {/* --- 1. WALK-IN DETAILS FORM --- */}
        {selectedMode === 'walkin' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-6 border-2 border-emerald-500/40 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm sm:text-base">
                <User size={18} className="text-emerald-600" />
                <span>{isHi ? 'मरीज का बुनियादी विवरण (सीधा प्रवेश)' : 'Patient Basic Information (Walk-in Entry)'}</span>
              </div>
              <button 
                onClick={() => setSelectedMode(null)} 
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isHi ? 'मरीज का पूरा नाम *' : 'Full Name *'}
                </label>
                <Input
                  value={walkinForm.name}
                  onChange={(e) => setWalkinForm({ ...walkinForm, name: e.target.value })}
                  placeholder={isHi ? 'उदा. राजेश कुमार' : 'e.g. Rajesh Kumar'}
                  className="h-12 bg-slate-50 border-slate-300 font-semibold focus:bg-white text-slate-900 rounded-xl"
                />
              </div>

              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isHi ? 'आयु (वर्ष) *' : 'Age (Years) *'}
                </label>
                <Input
                  type="number"
                  value={walkinForm.age}
                  onChange={(e) => setWalkinForm({ ...walkinForm, age: e.target.value })}
                  placeholder="35"
                  className="h-12 bg-slate-50 border-slate-300 font-semibold focus:bg-white text-slate-900 rounded-xl"
                />
              </div>

              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isHi ? 'लिंग *' : 'Gender *'}
                </label>
                <select
                  value={walkinForm.gender}
                  onChange={(e) => setWalkinForm({ ...walkinForm, gender: e.target.value })}
                  className="w-full h-12 bg-slate-50 border border-slate-300 font-semibold text-slate-900 rounded-xl px-3 focus:bg-white focus:border-[#0B4C8C] outline-none"
                >
                  <option value="Male">{isHi ? 'पुरुष (Male)' : 'Male'}</option>
                  <option value="Female">{isHi ? 'महिला (Female)' : 'Female'}</option>
                  <option value="Other">{isHi ? 'अन्य (Other)' : 'Other'}</option>
                </select>
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isHi ? 'मोबाइल नंबर' : 'Mobile Number'}
                </label>
                <Input
                  type="tel"
                  value={walkinForm.phone}
                  onChange={(e) => setWalkinForm({ ...walkinForm, phone: e.target.value })}
                  placeholder="9876543210"
                  className="h-12 bg-slate-50 border-slate-300 font-semibold focus:bg-white text-slate-900 rounded-xl"
                />
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isHi ? 'शहर / जिला' : 'City / District'}
                </label>
                <Input
                  value={walkinForm.city}
                  onChange={(e) => setWalkinForm({ ...walkinForm, city: e.target.value })}
                  placeholder="New Delhi"
                  className="h-12 bg-slate-50 border-slate-300 font-semibold focus:bg-white text-slate-900 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                onClick={() => setSelectedMode(null)}
                variant="outline"
                className="rounded-xl font-bold text-xs h-11 px-4"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </Button>
              <Button
                onClick={handleWalkinProceed}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm h-11 px-6 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>{isHi ? 'सहमति विंडो पर आगे बढ़ें' : 'Proceed to Consent'}</span>
                <ArrowRight size={15} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* --- 2. ABHA QR SCANNER VIEWPORT --- */}
        {selectedMode === 'scanner' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-amber-500/40 shadow-sm text-center space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm sm:text-base">
                <QrCode size={18} className="text-[#E2861E]" />
                <span>{isHi ? 'ऑप्टिकल आभा क्यूआर स्कैनर' : 'Optical ABHA QR Code Scanner'}</span>
              </div>
              <button 
                onClick={() => setSelectedMode(null)} 
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-w-md mx-auto py-3 space-y-4">
              <div className="relative w-48 h-48 mx-auto bg-slate-950 rounded-2xl p-3 flex items-center justify-center border-2 border-[#E2861E] shadow-lg overflow-hidden">
                <QrCode size={90} className="text-white/90" />
                
                {/* Real-time laser line */}
                <motion.div 
                  className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#E2861E] to-transparent shadow-[0_0_16px_#E2861E]"
                  animate={{ top: ['5%', '92%', '5%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                {isHi 
                  ? 'कृपया अपना आयुष्मान / आभा कार्ड स्कैनर कैमरा के सामने लाएं'
                  : 'Align your Ayushman / ABHA QR code within the scanner viewfinder'}
              </p>

              <div className="flex justify-center gap-3">
                <Button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className="bg-[#E2861E] hover:bg-[#C2410C] text-white font-extrabold text-xs sm:text-sm h-12 px-8 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>{isScanning ? (isHi ? 'स्कैन हो रहा है...' : 'Scanning QR Code...') : (isHi ? 'QR स्कैन प्रारंभ करें' : 'Simulate Scan')}</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- 3. 14-DIGIT ABHA NUMBER FORM --- */}
        {selectedMode === 'abhanumber' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-6 border-2 border-blue-500/40 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#0B4C8C] font-extrabold text-sm sm:text-base">
                <CreditCard size={18} className="text-[#0B4C8C]" />
                <span>{isHi ? '14-अंकीय आभा नंबर दर्ज करें' : 'Enter 14-Digit ABHA ID'}</span>
              </div>
              <button 
                onClick={() => setSelectedMode(null)} 
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-w-xl mx-auto space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{isHi ? 'आभा नंबर (14 अंक)' : 'ABHA Number (14 Digits)'}</span>
                  <span className="text-[11px] text-blue-700 font-semibold">ABDM National Gateway</span>
                </label>
                <Input
                  value={abhaInput}
                  onChange={(e) => setAbhaInput(e.target.value)}
                  placeholder="91-XXXX-XXXX-XXXX"
                  className="h-13 bg-slate-50 border-slate-300 font-mono text-base font-bold tracking-widest text-[#0B4C8C] focus:bg-white rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  onClick={() => setSelectedMode(null)}
                  variant="outline"
                  className="rounded-xl font-bold text-xs h-11 px-4"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleVerifyAbha}
                  disabled={isVerifying}
                  className="bg-[#0B4C8C] hover:bg-[#073562] text-white font-extrabold text-xs sm:text-sm h-11 px-8 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>{isVerifying ? (isHi ? 'सत्यापन हो रहा है...' : 'Verifying Profile...') : (isHi ? 'सत्यापित करें एवं सहमति' : 'Verify & Proceed')}</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>


      {/* =========================================================================
          VERIFIED PATIENT PROFILE SUMMARY (Visible when consent is granted)
      ========================================================================= */}
      {patientData.name && consentGranted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50/90 border-2 border-emerald-500/80 rounded-2xl p-5 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2.5">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm sm:text-base">
              <CheckCircle2 size={19} className="text-emerald-600" />
              <span>{isHi ? 'सत्यापित मरीज प्रोफाइल • सहमति स्वीकृत' : 'Verified Patient Profile • Consent Granted'}</span>
            </div>
            <button
              onClick={() => setShowConsentModal(true)}
              className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
            >
              {isHi ? 'सहमति देखें' : 'View Consent Terms'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
              <p className="text-[10.5px] font-bold text-slate-500 uppercase">{isHi ? 'नाम' : 'Name'}</p>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">{patientData.name}</p>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
              <p className="text-[10.5px] font-bold text-slate-500 uppercase">{isHi ? 'आयु व लिंग' : 'Demographics'}</p>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                {patientData.age} {isHi ? 'वर्ष' : 'Yrs'} • {patientData.gender}
              </p>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
              <p className="text-[10.5px] font-bold text-slate-500 uppercase">{isHi ? 'संदर्भ संख्या (HHID)' : 'HHID Number'}</p>
              <p className="font-mono font-extrabold text-slate-800 text-sm mt-0.5">{patientData.hhid || 'HH-2026-894'}</p>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
              <p className="text-[10.5px] font-bold text-slate-500 uppercase">{isHi ? 'आभा स्थिति' : 'ABHA Status'}</p>
              <p className="font-bold text-emerald-700 text-xs mt-1 flex items-center gap-1">
                <Check size={14} strokeWidth={3} /> {patientData.abhaId ? 'ABDM Linked' : 'Walk-in Active'}
              </p>
            </div>
          </div>
        </motion.div>
      )}


      {/* =========================================================================
          EXECUTIVE ABDM / DPDP ACT 2023 DIGITAL CONSENT WINDOW (MODAL)
      ========================================================================= */}
      <AnimatePresence>
        {showConsentModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-900"
            >
              
              {/* Modal Official Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src="/Emblem_of_India.svg" 
                    alt="National Emblem" 
                    className="h-10 w-auto object-contain" 
                  />
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 block leading-none">
                      {isHi ? 'आयुष मंत्रालय • भारत सरकार' : 'Ministry of Ayush • Govt. of India'}
                    </span>
                    <h3 
                      className="text-lg sm:text-xl font-black text-[#0B2A4A] tracking-tight mt-1"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {isHi ? 'डिजिटल स्वास्थ्य डेटा सहमति ढांचा' : 'National Health Data Consent Agreement'}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={playConsentAudio}
                  className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-[#0B4C8C] transition-colors cursor-pointer"
                  title="Listen to consent audio"
                >
                  <Volume2 size={18} />
                </button>
              </div>

              {/* Patient Profile Summary Capsule */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0B4C8C] text-white flex items-center justify-center font-bold">
                    {patientData.name ? patientData.name.charAt(0) : 'P'}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">{patientData.name}</p>
                    <p className="text-slate-500 font-medium">
                      {patientData.age} {isHi ? 'वर्ष' : 'Yrs'} • {patientData.gender} • {patientData.city || 'New Delhi'}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono font-bold text-slate-700 text-xs">
                  {patientData.abhaId ? (
                    <span className="text-[#0B4C8C] bg-blue-100/80 px-2.5 py-1 rounded-md">
                      ABHA: {patientData.abhaId}
                    </span>
                  ) : (
                    <span className="text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                      {patientData.hhid || 'HH-2026-OPD'}
                    </span>
                  )}
                </div>
              </div>

              {/* 3 Explicit Consent Purposes */}
              <div className="space-y-3 text-xs">
                <p className="text-slate-600 font-medium leading-relaxed">
                  {isHi
                    ? 'डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम 2023 और ABDM दिशानिर्देशों के तहत, मैं निम्नलिखित उद्देश्यों हेतु अपनी सहमति प्रदान करता/करती हूँ:'
                    : 'Pursuant to the Digital Personal Data Protection (DPDP) Act 2023 and ABDM standards, I authorize the following data operations:'}
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    <CheckSquare size={16} className="text-[#0B4C8C] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">{isHi ? '1. नैदानिक केस-टेकिंग एवं प्रकृति परीक्षा' : '1. Clinical Intake & Ayush Prakriti Assessment'}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{isHi ? 'लक्षणों, भाषण इनटेक एवं दशविध परीक्षा डेटा का चिकित्सक समीक्षा हेतु उपयोग।' : 'Processing of symptoms, voice intake, and pulse data for physician review.'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    <CheckSquare size={16} className="text-[#0B4C8C] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">{isHi ? '2. पुराने चिकित्सा पर्चों का एन्क्रिप्टेड डिजिटलीकरण' : '2. Encrypted Document Digitization'}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{isHi ? 'स्कैन की गई लैब रिपोर्ट एवं पर्चों का सुरक्षित FHIR R4 टाइमलाइन निर्माण।' : 'Secure OCR and timeline generation of lab reports under end-to-end 256-bit encryption.'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    <CheckSquare size={16} className="text-[#0B4C8C] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">{isHi ? '3. सहमति वापसी का अधिकार' : '3. Voluntary & Revocable'}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{isHi ? 'आप किसी भी समय इस सहमति को वापस लेने के लिए स्वतंत्र हैं।' : 'Consent is strictly voluntary and can be modified or revoked at any point.'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge Strip */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <Lock size={13} /> 256-Bit TLS ABDM Encrypted
                </span>
                <span>DPDP Act 2023 Compliant</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  onClick={() => setShowConsentModal(false)}
                  variant="outline"
                  className="rounded-xl font-bold text-xs h-11 px-5 border-slate-300 cursor-pointer"
                >
                  {isHi ? 'विवरण बदलें' : 'Edit Details'}
                </Button>

                <Button
                  onClick={handleGrantConsent}
                  className="bg-[#0B4C8C] hover:bg-[#073562] text-white font-extrabold text-xs sm:text-sm h-12 px-8 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={18} />
                  <span>{isHi ? 'सहमति दें एवं आगे बढ़ें' : 'I Agree & Authorize Consent'}</span>
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
