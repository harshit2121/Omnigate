import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, Mic, MicOff, Activity, 
  Stethoscope, ChevronDown, ChevronUp,
  Cpu
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import voiceAssistant from '../../services/voiceAssistant';

const STEP_GUIDELINES = {
  1: {
    stageHi: 'पहचान एवं सहमति सत्यापन',
    stageEn: 'Identity & Consent Verification',
    promptHi: 'कृपया अपना 14-अंकीय आभा (ABHA) नंबर दर्ज करें या कार्ड स्कैनर पर प्रस्तुत करें। त्वरित परीक्षण हेतु डेमो प्रोफाइल का भी उपयोग किया जा सकता है।',
    promptEn: 'Please provide your 14-digit ABHA ID or tap your health card on the terminal scanner. You may also select a pre-configured demo profile.'
  },
  2: {
    stageHi: 'मुख्य लक्षण एवं नैदानिक इतिहास',
    stageEn: 'Chief Complaint & Clinical History',
    promptHi: 'आप अपनी वर्तमान स्वास्थ्य समस्या का चयन कर सकते हैं या बोलकर बता सकते हैं। प्रणाली स्वतः संरचित केस शीट तैयार करेगी।',
    promptEn: 'Select or describe your symptoms. The system will map them to standard clinical NAMASTE / SNOMED terminologies.'
  },
  3: {
    stageHi: 'आयुर्वेदिक प्रकृति व अग्नि परीक्षण',
    stageEn: 'Ayurvedic Prakriti & Agni Assessment',
    promptHi: 'दोषानुबंध (वात, पित्त, कफ) और पाचन क्षमता (अग्नि) का निर्धारण करने के लिए अपनी स्वाभाविक शारीरिक प्रवृत्तियों का चयन करें।',
    promptEn: 'Select attributes corresponding to your baseline physiological tendencies to evaluate your dominant Prakriti and metabolic Agni.'
  },
  4: {
    stageHi: 'पुराने रिकॉर्ड एवं लैब रिपोर्ट डिजिटाइजेशन',
    stageEn: 'Prior Prescriptions & Records Digitization',
    promptHi: 'अपने पुराने नुस्खे या रक्त-मूत्र जांच रिपोर्ट स्कैनर ट्रे में रखें। ओसीआर प्रणाली दवाओं और असामान्य मानों को डिजिटाइज करेगी।',
    promptEn: 'Place prior physical prescriptions or lab reports on the scanner tray for automated OCR entity extraction and safety reconciliation.'
  },
  5: {
    stageHi: 'केस सारांश सत्यापन एवं टोकन डिस्पैच',
    stageEn: 'Case Synthesis & Token Dispatch',
    promptHi: 'आपका संरचित क्लिनिकल सारांश ओपीडी परामर्श कक्ष में प्रेषित कर दिया गया है। कृपया अपनी टोकन पर्ची प्रिंट करें।',
    promptEn: 'Your structured clinical bundle has been routed to the AIIA Physician OPD desk. Please collect your printed token slip.'
  }
};

export default function AyushSakhiAssistant({
  currentStep = 1,
  currentLang = 'hi',
  voiceEnabled = true,
  onAiParsedIntent,
  patientData = {},
  intakeData = {}
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [nlpInference, setNlpInference] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentGuideline = STEP_GUIDELINES[currentStep] || STEP_GUIDELINES[1];

  useEffect(() => {
    if (voiceEnabled) {
      speakGuidance(currentLang === 'hi' ? currentGuideline.promptHi : currentGuideline.promptEn);
    }
  }, [currentStep, currentLang]);

  const speakGuidance = (text) => {
    setIsSpeaking(true);
    voiceAssistant.speak(text, {
      lang: currentLang === 'hi' ? 'hi-IN' : 'en-IN',
      onEnd: () => setIsSpeaking(false)
    });
  };

  const handleToggleListening = () => {
    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      setSpokenText('');
      setNlpInference(null);

      voiceAssistant.startListening({
        lang: currentLang === 'hi' ? 'hi-IN' : 'en-IN',
        onResult: ({ text }) => {
          setSpokenText(text);
          processUserInputWithAi(text);
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false)
      });
    }
  };

  const processUserInputWithAi = (text) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const mockInference = {
        understood: true,
        complaintLabel: 'Chest Pain / Acid Reflux',
        complaintLabelHi: 'छाती में दर्द व जलन',
        complaintId: 'chest_pain',
        doshaAffiliation: 'Pitta-Vata',
        doshaAffiliationHi: 'पित्त-वात',
        severity: currentLang === 'hi' ? 'मध्यम' : 'Moderate',
        extractedDuration: '3 days',
        extractedDurationHi: '3 दिन से',
        aiText: currentLang === 'hi'
          ? 'मैंने आपके लक्षण "छाती में दर्द व जलन" दर्ज कर लिए हैं। क्या यह भोजन के बाद बढ़ता है?'
          : 'Understood: "Chest Pain / Burning". Does this discomfort worsen after meals?'
      };
      setNlpInference(mockInference);
      if (onAiParsedIntent) {
        onAiParsedIntent(mockInference);
      }
      speakGuidance(mockInference.aiText);
    }, 800);
  };

  return (
    <div className="bg-white border-2 border-[#DCE3EC] rounded-2xl overflow-hidden shadow-xs font-sans">
      
      {/* Assistant Header Strip */}
      <div className="bg-[#0B2A4A] text-white px-4 py-2.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <Stethoscope size={16} className="text-[#F2941E]" />
          </div>
          <div>
            <h4 className="text-xs font-black tracking-wide text-white">
              {currentLang === 'hi' ? 'आयुष सखी • ओपीडी वॉइस असिस्टेंट' : 'Ayush Sakhi • OPD Voice Companion'}
            </h4>
            <span className="text-[10px] text-[#C9D6E6] font-medium hidden sm:inline">
              {currentLang === 'hi' ? 'द्विभाषी क्लिनिकल संवाद व आवाज विश्लेषण' : 'Bilingual Clinical Dialogue & Speech Assistant'}
            </span>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => speakGuidance(nlpInference?.aiText || (currentLang === 'hi' ? currentGuideline.promptHi : currentGuideline.promptEn))}
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg h-8 px-2 text-xs font-semibold"
            title="Replay Audio Guidance"
          >
            <Volume2 size={15} className="mr-1 text-[#F2941E]" />
            <span className="hidden sm:inline">{currentLang === 'hi' ? 'पुनः सुनें' : 'Replay'}</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>

      {/* Assistant Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-[#F5F9FF] border-t border-[#DCE3EC] space-y-3"
          >
            {/* Live Clinical Stage Dialogue Box */}
            <div className="bg-white rounded-xl p-3.5 border border-[#DCE3EC] shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F5F9FF] border border-[#BFD3E8] flex items-center justify-center shrink-0 mt-0.5">
                <Stethoscope size={18} className="text-[#0B4C8C]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B4C8C]">
                    {currentLang === 'hi' ? currentGuideline.stageHi : currentGuideline.stageEn}
                  </span>
                  <span className="text-[10px] font-mono text-[#5B677E]">
                    {currentLang === 'hi' ? `चरण ${currentStep}/5` : `Step ${currentStep}/5`}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#16213A] font-medium leading-relaxed">
                  {nlpInference?.aiText || (currentLang === 'hi' ? currentGuideline.promptHi : currentGuideline.promptEn)}
                </p>
              </div>
            </div>

            {/* REAL-TIME CLINICAL INFERENCE CARD (When patient speaks) */}
            {spokenText && (
              <div className="bg-white rounded-xl p-3.5 border-2 border-[#BFD3E8] shadow-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#DCE3EC] pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#16213A]">
                    <Activity size={14} className="text-[#E2861E]" />
                    <span>{currentLang === 'hi' ? 'नैदानिक विश्लेषण' : 'Clinical Case Analysis'}</span>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                    Confidence: 96.4%
                  </Badge>
                </div>

                <div className="text-xs bg-[#F5F9FF] p-2.5 rounded-lg border border-[#DCE3EC] font-medium text-[#37455A]">
                  <span className="text-[#5B677E] font-bold block text-[10px] uppercase">
                    {currentLang === 'hi' ? 'मरीज का वक्तव्य:' : 'Patient Utterance:'}
                  </span>
                  "{spokenText}"
                </div>

                {nlpInference && nlpInference.understood && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                    <div className="bg-[#F5F9FF] p-2 rounded-lg border border-[#BFD3E8]">
                      <span className="text-[10px] text-[#5B677E] font-bold block">
                        {currentLang === 'hi' ? 'पहचाना गया लक्षण' : 'Mapped Complaint'}
                      </span>
                      <span className="font-extrabold text-[#0B4C8C]">
                        {currentLang === 'hi' ? nlpInference.complaintLabelHi : nlpInference.complaintLabel}
                      </span>
                    </div>

                    <div className="bg-[#FFF7ED] p-2 rounded-lg border border-[#FED7AA]">
                      <span className="text-[10px] text-[#5B677E] font-bold block">
                        {currentLang === 'hi' ? 'दोषानुबंध' : 'Ayush Constitution'}
                      </span>
                      <span className="font-extrabold text-amber-900">
                        {currentLang === 'hi' ? (nlpInference.doshaAffiliationHi || nlpInference.doshaAffiliation) : nlpInference.doshaAffiliation}
                      </span>
                    </div>

                    <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-[#5B677E] font-bold block">
                        {currentLang === 'hi' ? 'अवधि व तीव्रता' : 'Duration & Severity'}
                      </span>
                      <span className="font-extrabold text-emerald-900">
                        {currentLang === 'hi' ? `${nlpInference.extractedDurationHi} • ${nlpInference.severity}` : `${nlpInference.extractedDuration} • ${nlpInference.severity}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Interactive Input Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5B677E] w-full sm:w-auto">
                <Cpu size={14} className="text-[#0B4C8C]" />
                <span>
                  {currentLang === 'hi' ? 'प्राकृतिक भाषा में बोलकर या छूकर उत्तर दें' : 'Speak naturally or use tactile controls'}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {/* Voice Input Trigger Button */}
                <Button
                  onClick={handleToggleListening}
                  className={`text-xs font-bold rounded-xl h-9 px-4 flex items-center gap-2 transition-all shadow-xs ${
                    isListening
                      ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                      : 'bg-[#0B4C8C] hover:bg-[#08355F] text-white'
                  }`}
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  <span>
                    {isListening
                      ? (currentLang === 'hi' ? 'रिकॉर्डिंग रोकें' : 'Stop Listening')
                      : (currentLang === 'hi' ? 'बोलकर बताएं' : 'Speak to Assistant')}
                  </span>
                </Button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
