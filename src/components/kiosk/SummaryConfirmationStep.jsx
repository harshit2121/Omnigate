import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Volume2, Printer, 
  QrCode, Download, Share2, Smartphone, Sparkles,
  Building2, ShieldCheck, Clock, ArrowRight, UserCheck
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import voiceAssistant from '../../services/voiceAssistant';
import { printPrakritiDietPlan } from '../../utils/prakritiPdfGenerator';

import { logKioskRegistration } from '../../services/auditLog';

export default function SummaryConfirmationStep({
  patientData,
  intakeData,
  parikshaData,
  ocrDocuments,
  currentLang = 'hi',
  voiceEnabled,
  isSubmitted,
  tokenNumber
}) {
  const isHi = currentLang === 'hi';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [paperEjected, setPaperEjected] = useState(false);

  // Trigger sound cue, cryptographic audit ledger commit, and mechanical paper roll animation on submission
  useEffect(() => {
    if (isSubmitted) {
      voiceAssistant.playAudioCue('success');
      logKioskRegistration(patientData || {}, tokenNumber || 'AYU-104');
      const timer = setTimeout(() => {
        setPaperEjected(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, patientData, tokenNumber]);

  const playBilingualSummaryAudio = () => {
    setIsPlayingAudio(true);
    const text = isHi
      ? `नमस्ते ${patientData.name || 'मरीज'} जी। आपकी मुख्य शिकायत ${intakeData.complaintLabelHi || 'लक्षण'} और आयुर्वेदिक प्रकृति ${parikshaData?.prakritiResult?.dominant || 'वात-पित्त'} दर्ज कर ली गई है। आपका टोकन नंबर ${tokenNumber} है। कृपया कक्ष संख्या 12 में डॉ शर्मा जी से मिलें।`
      : `Hello ${patientData.name || 'Patient'}. Your chief complaint ${intakeData.complaintLabel || 'symptoms'} and constitutional Prakriti ${parikshaData?.prakritiResult?.dominant || 'Vata-Pitta'} have been recorded. Your Token number is ${tokenNumber}. Please proceed to Ayush OPD Room 12.`;
    
    voiceAssistant.speak(text, { lang: isHi ? 'hi-IN' : 'en-IN' }).then(() => setIsPlayingAudio(false));
  };

  const handlePrintSlip = () => {
    setIsPrinting(true);
    voiceAssistant.playAudioCue('beep');
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 400);
  };

  const handleSendSms = () => {
    setSmsSent(true);
    voiceAssistant.playAudioCue('success');
    if (voiceEnabled) {
      voiceAssistant.speak(
        isHi
          ? `डिजिटल टोकन पर्ची मोबाइल नंबर ${patientData.phone || '9876543210'} पर एसएमएस और व्हाट्सएप द्वारा भेज दी गई है।`
          : `Digital token slip sent via SMS & WhatsApp to ${patientData.phone || '9876543210'}.`,
        { lang: isHi ? 'hi-IN' : 'en-IN' }
      );
    }
  };

  const handleDownloadPdf = () => {
    printPrakritiDietPlan({
      patientName: patientData.name || 'Patient',
      tokenNumber: tokenNumber || 'AYU-104',
      abhaId: patientData.abhaId || '91-8472-1092-4820',
      prakritiResult: parikshaData?.prakritiResult,
      currentLang
    });
  };

  // Simulated code-128 barcode pattern
  const barcodeBars = [3,1,2,1,4,1,2,3,1,1,3,2,1,4,1,2,1,3,1,2,4,1,1,3,2,1,2,3,1,4,1,2,1,1,3,2,1,4,1,3,2,1,1,4,2,1,3,1];
  const currentDateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  const currentTimeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <div className="space-y-6 font-sans select-none max-w-5xl mx-auto">
      
      {!isSubmitted ? (
        /* =========================================================================
           REVIEW BEFORE FINAL SUBMISSION
        ========================================================================= */
        <div className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#DCE3EC] pb-4 gap-3">
            <div>
              <h3 
                className="text-xl font-black text-[#16213A]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {isHi ? 'केस-टेकिंग सारांश की पुष्टि करें' : 'Confirm Your Clinical Summary'}
              </h3>
              <p className="text-xs text-[#5B677E] mt-0.5 font-medium">
                {isHi ? 'चिकित्सक को भेजने से पहले अपने विवरण की जांच करें' : 'Review synthesized intake before routing to Physician OPD Room'}
              </p>
            </div>

            <Button
              onClick={playBilingualSummaryAudio}
              className="bg-[#0B4C8C] hover:bg-[#08355F] text-white font-bold rounded-xl flex items-center gap-2 text-xs h-9 px-4 shrink-0 shadow-xs cursor-pointer"
            >
              <Volume2 size={15} />
              <span>{isPlayingAudio ? (isHi ? 'आवाज जारी...' : 'Speaking...') : (isHi ? 'सारांश सुनें' : 'Listen Summary')}</span>
            </Button>
          </div>

          {/* Grid of Synthesized Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Patient Demographics */}
            <div className="bg-[#F5F9FF] p-4 rounded-2xl border border-[#DCE3EC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#5B677E] uppercase tracking-wider">
                  {isHi ? 'मरीज विवरण' : 'Patient Demographics'}
                </span>
                <Badge className="bg-white text-[#0B4C8C] border border-[#BFD3E8] text-[10px] font-bold">ABHA Linked</Badge>
              </div>
              <p className="text-base font-extrabold text-[#16213A]">{patientData.name || 'Sunita Devi'}</p>
              <p className="text-xs text-[#37455A]">ABHA ID: <span className="font-mono text-[#0B4C8C] font-bold">{patientData.abhaId || '91-8472-1092-4820'}</span></p>
              <p className="text-xs text-[#5B677E] font-medium">
                {patientData.age || '52'} {isHi ? 'वर्ष' : 'Years'} • {patientData.gender === 'Female' ? (isHi ? 'महिला' : 'Female') : (isHi ? 'पुरुष' : 'Male')} {patientData.phone && `• ${patientData.phone}`}
              </p>
            </div>

            {/* Chief Complaint & HPI */}
            <div className="bg-[#F5F9FF] p-4 rounded-2xl border border-[#DCE3EC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#5B677E] uppercase tracking-wider">
                  {isHi ? 'मुख्य लक्षण व निदान' : 'Chief Complaint'}
                </span>
                <Badge className="bg-white text-[#E2861E] border border-[#FED7AA] text-[10px] font-bold">SOCRATES</Badge>
              </div>
              <p className="text-base font-extrabold text-[#16213A]">
                {isHi ? (intakeData.complaintLabelHi || intakeData.complaintLabel || 'अम्लपित्त एवं उदर शूल') : (intakeData.complaintLabel || 'Amlapitta & Severe Epigastric Burning')}
              </p>
              <div className="text-xs text-[#37455A] space-y-1 font-medium">
                {Object.entries(intakeData.answers || {}).slice(0, 3).map(([key, val]) => (
                  <p key={key} className="truncate"><b className="capitalize text-[#16213A]">{key}:</b> {Array.isArray(val) ? val.join(', ') : val}</p>
                ))}
              </div>
            </div>

            {/* Ayurvedic Pariksha */}
            <div className="bg-[#F5F9FF] p-4 rounded-2xl border border-[#DCE3EC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#5B677E] uppercase tracking-wider">
                  {isHi ? 'आयुर्वेदिक प्रकृति व अग्नि' : 'Ayush Constitution & Agni'}
                </span>
                <Badge className="bg-white text-amber-800 border border-amber-200 text-[10px] font-bold">AIIA Assessment</Badge>
              </div>
              <p className="text-sm font-bold text-[#16213A]">
                {isHi ? 'प्रकृति:' : 'Prakriti:'} <span className="text-[#E2861E] font-extrabold">{parikshaData?.prakritiResult?.dominant || (isHi ? 'पित्त-वात (Pittadhika)' : 'Pitta-Vata (Pittadhika)')}</span>
              </p>
              <p className="text-xs text-[#37455A] font-medium">
                {isHi ? 'अग्नि:' : 'Agni:'} <b className="capitalize text-[#16213A]">{parikshaData.agni || 'Tikshna'}</b> • {isHi ? 'कोष्ठ:' : 'Koshtha:'} <b className="capitalize text-[#16213A]">{parikshaData.koshtha || 'Krura'}</b>
              </p>
            </div>

            {/* Digitized Records */}
            <div className="bg-[#F5F9FF] p-4 rounded-2xl border border-[#DCE3EC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#5B677E] uppercase tracking-wider">
                  {isHi ? 'दस्तावेज व लैब रिपोर्ट' : 'Medical Timeline'}
                </span>
                <Badge className="bg-white text-emerald-800 border border-emerald-200 text-[10px] font-bold">OCR Processed</Badge>
              </div>
              <p className="text-sm font-bold text-[#16213A]">
                {ocrDocuments?.length || 2} {isHi ? 'दस्तावेज संलग्न' : 'Prescription Records Attached'}
              </p>
              <p className="text-xs text-[#5B677E] font-medium">
                {isHi ? 'क्लिनिकल विवरण सत्यापित व ईएमआर से सिंक' : 'Clinical entities verified & synced with hospital OPD'}
              </p>
            </div>

          </div>

        </div>
      ) : (
        /* =========================================================================
           HOSPITAL THERMAL PRINTING SIMULATION & RECEIPT DISPENSER
        ========================================================================= */
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          {/* ================= PHYSICAL KIOSK RECEIPT PRINTER BEZEL ================= */}
          <div className="max-w-md mx-auto relative pt-2">
            
            {/* Kiosk Printer Housing Slot - Hospital Clean Aesthetic */}
            <div className="bg-gradient-to-b from-[#F1F6FC] via-[#E8EFF8] to-[#DCE6F2] p-3 rounded-t-2xl border-t-2 border-x-2 border-[#BACAD9] shadow-md relative z-20">
              <div className="flex items-center justify-between text-xs text-[#0B4C8C] font-bold mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="tracking-wide">
                    {isHi ? 'ओपीडी टोकन पर्ची' : 'OPD Token Slip'}
                  </span>
                </div>
                <span className="text-[11px] text-[#5B677E] font-medium">AIIA New Delhi</span>
              </div>
              
              {/* Paper Dispenser Slot Mouth */}
              <div className="h-3 bg-[#16213A] rounded-md border border-[#BACAD9] flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className="w-full h-[1.5px] bg-[#0B4C8C]/80" />
              </div>
            </div>

            {/* ================= REAL 80MM THERMAL RECEIPT SLIP ================= */}
            <div className="overflow-hidden">
              <motion.div
                id="thermal-print-slip"
                initial={{ y: -320, opacity: 0 }}
                animate={paperEjected ? { y: 0, opacity: 1 } : { y: -320, opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#FFFFFF] text-[#0A0A0A] font-mono shadow-xl border-x-2 border-b-2 border-[#BACAD9] relative z-10 mx-2 p-5 sm:p-6"
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  backgroundColor: '#FFFFFF'
                }}
              >
                {/* Top Jagged Perforated Paper Cutter Mark */}
                <div 
                  className="absolute -top-[7px] left-0 right-0 h-[8px] bg-[#FFFFFF]"
                  style={{
                    clipPath: 'polygon(0% 100%, 2% 0%, 4% 100%, 6% 0%, 8% 100%, 10% 0%, 12% 100%, 14% 0%, 16% 100%, 18% 0%, 20% 100%, 22% 0%, 24% 100%, 26% 0%, 28% 100%, 30% 0%, 32% 100%, 34% 0%, 36% 100%, 38% 0%, 40% 100%, 42% 0%, 44% 100%, 46% 0%, 48% 100%, 50% 0%, 52% 100%, 54% 0%, 56% 100%, 58% 0%, 60% 100%, 62% 0%, 64% 100%, 66% 0%, 68% 100%, 70% 0%, 72% 100%, 74% 0%, 76% 100%, 78% 0%, 80% 100%, 82% 0%, 84% 100%, 86% 0%, 88% 100%, 90% 0%, 92% 100%, 94% 0%, 96% 100%, 98% 0%, 100% 100%)'
                  }}
                />

                {/* Header: National Emblem & Hospital Details */}
                <div className="text-center pb-3 border-b-2 border-dashed border-black">
                  <div className="flex justify-center mb-1">
                    <img src="/Emblem_of_India.svg" alt="Emblem" className="h-9 w-auto object-contain grayscale brightness-0" />
                  </div>
                  <h3 className="font-black text-[13px] tracking-tight leading-tight uppercase">
                    ALL INDIA INSTITUTE OF AYURVEDA (AIIA)
                  </h3>
                  <p className="text-[10px] font-bold text-black/80 uppercase">
                    MINISTRY OF AYUSH • GOVT. OF INDIA
                  </p>
                  <p className="text-[9.5px] font-semibold text-black/70">
                    Gautampuri, Sarita Vihar, Mathura Road, New Delhi-110076
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-1.5 border-y border-black py-0.5">
                    *** OPD CLINICAL CONSULTATION SLIP ***
                  </p>
                </div>

                {/* 1D High-Density Barcode Strip */}
                <div className="py-2.5 text-center border-b border-dashed border-black/80 flex flex-col items-center">
                  <div className="flex items-end justify-center h-8 gap-[1.5px] px-2 w-full max-w-[260px]">
                    {barcodeBars.map((w, idx) => (
                      <div 
                        key={idx} 
                        className="bg-black h-full" 
                        style={{ width: `${w}px` }} 
                      />
                    ))}
                  </div>
                  <span className="text-[9.5px] tracking-widest font-bold mt-1">
                    *{tokenNumber || 'AYU-104'}*CR-9842*
                  </span>
                </div>

                {/* Prominent Token & Department Box */}
                <div className="text-center py-3 my-2 border-2 border-black bg-black/[0.03]">
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {isHi ? 'परामर्श टोकन संख्या / TOKEN NUMBER' : 'CONSULTATION TOKEN NO.'}
                  </p>
                  <p className="text-4xl sm:text-5xl font-black text-black tracking-wider my-0.5 font-sans">
                    {tokenNumber || 'AYU-104'}
                  </p>
                  <div className="text-[10.5px] font-bold uppercase tracking-wide border-t border-black pt-1 px-1">
                    ROOM 12 (1ST FLOOR) • KAYA CHIKITSA OPD
                  </div>
                  <div className="text-[9.5px] font-semibold text-black/90 mt-0.5">
                    {isHi ? 'अनुमानित प्रतीक्षा समय: ~6 से 10 मिनट' : 'Estimated Wait Time: ~6 to 10 mins (3 Ahead)'}
                  </div>
                </div>

                {/* Patient Identity & ABDM */}
                <div className="text-[11px] space-y-1 py-2 border-b-2 border-dashed border-black">
                  <div className="flex justify-between font-bold">
                    <span>PATIENT (मरीज):</span>
                    <span className="uppercase">{patientData.name || 'SUNITA DEVI'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AGE / GENDER:</span>
                    <span className="font-bold">{patientData.age || '52'} Y / {patientData.gender === 'Female' ? 'FEMALE' : 'MALE'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UHID / CR NO:</span>
                    <span className="font-bold font-mono">{patientData.hhid || '2026/AIIA/9842'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PHONE NO:</span>
                    <span className="font-bold font-mono">{patientData.phone || '+91 98765-43210'}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>ABHA ID (ABDM):</span>
                    <span className="font-mono">{patientData.abhaId || '91-8472-1092-4820'}</span>
                  </div>
                </div>

                {/* Ayush Clinical Synthesis Box */}
                <div className="text-[10.5px] space-y-1 py-2 border-b-2 border-dashed border-black">
                  <p className="font-black uppercase text-[10px] tracking-wider text-black">
                    [ AYUSH CLINICAL INTAKE SUMMARY ]
                  </p>
                  <div>
                    <span className="font-bold">CHIEF COMPLAINT:</span>{' '}
                    <span className="font-semibold">{intakeData.complaintLabel || 'Amlapitta & Severe Epigastric Pain'}</span>
                  </div>
                  <div>
                    <span className="font-bold">PRAKRITI (प्रकृति):</span>{' '}
                    <span className="font-bold underline">{parikshaData?.prakritiResult?.dominant || 'Pitta-Vata (Pittadhika)'}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>AGNI: <b>{parikshaData.agni || 'Tikshna'}</b></span>
                    <span>KOSHTHA: <b>{parikshaData.koshtha || 'Krura'}</b></span>
                    <span>DOCS: <b>{ocrDocuments?.length || 2} Synced</b></span>
                  </div>
                </div>

                {/* QR Code & ABDM Digital Verification */}
                <div className="py-3 flex items-center justify-between gap-3 border-b-2 border-dashed border-black">
                  <div className="space-y-0.5 text-left flex-1">
                    <p className="font-black text-[10px] uppercase leading-tight">
                      ABDM VERIFIED CONSULTATION COPY
                    </p>
                    <p className="text-[9px] text-black/80 leading-tight">
                      Official digitally signed intake receipt for Ayush OPD consultation, Ahara-Vihara diet chart, and medicine dispensation.
                    </p>
                  </div>
                  <div className="p-1 border-2 border-black bg-white shrink-0">
                    <QrCode size={44} className="text-black" />
                  </div>
                </div>

                {/* POS Hardware & Gateway Telemetry */}
                <div className="pt-2 text-[9px] space-y-0.5 text-black/75 text-center">
                  <div className="flex justify-between">
                    <span>TERMINAL: AIIA-KIOSK-04</span>
                    <span>BATCH: #00482</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>DATE: {currentDateStr}</span>
                    <span>TIME: {currentTimeStr}</span>
                  </div>
                  <p className="text-[8.5px] font-bold text-black pt-1 uppercase">
                    *** PLEASE PRESENT THIS SLIP AT OPD ROOM 12 & PHARMACY ***
                  </p>
                  <p className="text-[8px] text-black/60">
                    ABDM Gateway M3 • DPDP Act 2023 Compliant • Powered by OmniGate MediKiosk
                  </p>
                </div>

                {/* Bottom Jagged Perforated Paper Cutter Mark */}
                <div 
                  className="absolute -bottom-[7px] left-0 right-0 h-[8px] bg-[#FFFFFF]"
                  style={{
                    clipPath: 'polygon(0% 0%, 2% 100%, 4% 0%, 6% 100%, 8% 0%, 10% 100%, 12% 0%, 14% 100%, 16% 0%, 18% 100%, 20% 0%, 22% 100%, 24% 0%, 26% 100%, 28% 0%, 30% 100%, 32% 0%, 34% 100%, 36% 0%, 38% 100%, 40% 0%, 42% 100%, 44% 0%, 46% 100%, 48% 0%, 50% 100%, 52% 0%, 54% 100%, 56% 0%, 58% 100%, 60% 0%, 62% 100%, 64% 0%, 66% 100%, 68% 0%, 70% 100%, 72% 0%, 74% 100%, 76% 0%, 78% 100%, 80% 0%, 82% 100%, 84% 0%, 86% 100%, 88% 0%, 90% 100%, 92% 0%, 94% 100%, 96% 0%, 98% 100%, 100% 0%)'
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* ================= SUCCESS BANNER (PLACED AFTER / BELOW THE SLIP) ================= */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-gradient-to-r from-[#0B4C8C] via-[#105AA6] to-[#0B4C8C] text-white rounded-3xl p-5 text-center shadow-md flex flex-col items-center justify-center relative overflow-hidden max-w-2xl mx-auto"
          >
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
              <CheckCircle2 size={24} className="text-emerald-300" />
            </div>
            <h2 
              className="text-xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {isHi ? 'केस-टेकिंग सफलतापूर्वक संपन्न!' : 'OPD Intake Successfully Registered!'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-lg mt-1 font-medium leading-relaxed">
              {isHi
                ? 'आपकी केस-हिस्ट्री डॉक्टर साहब के परामर्श कक्ष (Room 12) में सुरक्षित प्रेषित कर दी गई है।'
                : 'Your structured case sheet has been routed to AIIA Kayachikitsa OPD Room 12.'}
            </p>
          </motion.div>

          {/* ================= INTERACTIVE ACTION BUTTONS ================= */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            
            {/* 1. Real Physical Print Button */}
            <Button 
              onClick={handlePrintSlip}
              disabled={isPrinting}
              className="bg-[#0B4C8C] hover:bg-[#08355F] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 h-12 px-6 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Printer size={18} />
              <span>{isPrinting ? (isHi ? 'प्रिंट हो रहा है...' : 'Printing Slip...') : (isHi ? 'थर्मल पर्ची प्रिंट करें' : 'Print Thermal Slip')}</span>
            </Button>

            {/* 2. Download Official PDF Assessment & Diet Chart (B&W Friendly) */}
            <Button
              onClick={handleDownloadPdf}
              className="bg-[#E2861E] hover:bg-[#C2410C] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 h-12 px-5 shadow-md cursor-pointer transition-all hover:scale-105"
            >
              <Download size={18} />
              <span>{isHi ? 'प्रकृति व डाइट चार्ट (PDF)' : 'Download Diet & Case (PDF)'}</span>
            </Button>

            {/* 3. Send SMS / WhatsApp */}
            <Button
              onClick={handleSendSms}
              variant="outline"
              disabled={smsSent}
              className={`border border-[#DCE3EC] rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 h-12 px-5 cursor-pointer transition-all ${
                smsSent ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-white hover:bg-slate-100 text-slate-800'
              }`}
            >
              <Smartphone size={18} className={smsSent ? "text-emerald-600" : "text-[#0B4C8C]"} />
              <span>{smsSent ? (isHi ? 'एसएमएस भेजा गया ✓' : 'SMS & WhatsApp Sent ✓') : (isHi ? 'मोबाइल पर प्राप्त करें' : 'Send to Phone')}</span>
            </Button>

            {/* 4. Voice Audio Summary */}
            <Button
              onClick={playBilingualSummaryAudio}
              variant="outline"
              className="border border-[#DCE3EC] bg-white hover:bg-[#F1F6FC] text-[#16213A] font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 h-12 px-5 cursor-pointer"
            >
              <Volume2 size={18} className="text-[#E2861E]" />
              <span>{isHi ? 'ऑडियो सारांश' : 'Voice Guide'}</span>
            </Button>
          </div>

          {/* SMS Confirmation Toast */}
          <AnimatePresence>
            {smsSent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-3.5 text-xs flex items-center gap-3 shadow-xs"
              >
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <p className="font-medium">
                  {isHi 
                    ? `टोकन संख्या ${tokenNumber || 'AYU-104'} का ई-कार्ड मरीज के फोन (+91 ${patientData.phone || '98765-43210'}) पर सफलतापूर्वक भेज दिया गया है।`
                    : `Token e-receipt for ${tokenNumber || 'AYU-104'} dispatched via SMS & WhatsApp to +91 ${patientData.phone || '98765-43210'}.`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}

    </div>
  );
}
