import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Volume2, ArrowRight, CheckCircle2, Languages
} from 'lucide-react';
import { Badge } from '../ui/badge';
import voiceAssistant from '../../services/voiceAssistant';

const SUPPORTED_LANGUAGES = [
  {
    code: 'hi',
    nameHi: 'हिंदी',
    nameEn: 'Hindi',
    greeting: 'नमस्ते! कृपया आगे बढ़ने के लिए हिंदी चुनें।',
    accent: '#E2861E',
    popular: true
  },
  {
    code: 'en',
    nameHi: 'अंग्रेजी',
    nameEn: 'English',
    greeting: 'Welcome! Please select English to continue.',
    accent: '#0B4C8C',
    popular: true
  },
  {
    code: 'sa',
    nameHi: 'संस्कृतम्',
    nameEn: 'Sanskrit (Ayush Classic)',
    greeting: 'स्वागतम्! आयुर्वेद-पद्धत्या अग्रेसरन्तु।',
    accent: '#0B4C8C'
  },
  {
    code: 'mr',
    nameHi: 'मराठी',
    nameEn: 'Marathi',
    greeting: 'स्वागत आहे! नोंदणी सुरू करण्यासाठी निवडा.',
    accent: '#059669'
  },
  {
    code: 'gu',
    nameHi: 'ગુજરાતી',
    nameEn: 'Gujarati',
    greeting: 'સ્વાગત છે! આગળ વધવા માટે પસંદ કરો.',
    accent: '#D97706'
  },
  {
    code: 'bn',
    nameHi: 'বাংলা',
    nameEn: 'Bengali',
    greeting: 'স্বাগতম! এগিয়ে যেতে নির্বাচন করুন।',
    accent: '#DB2777'
  }
];

export default function LanguageSelectionStep({ 
  currentLang = 'hi', 
  setCurrentLang, 
  onLanguageSelected,
  voiceEnabled 
}) {
  const [selected, setSelected] = useState(currentLang || 'hi');

  const handleSelectLanguage = (langObj) => {
    setSelected(langObj.code);
    setCurrentLang(langObj.code === 'en' ? 'en' : 'hi');
    voiceAssistant.playAudioCue('beep');
    
    if (voiceEnabled) {
      voiceAssistant.speak(langObj.greeting, {
        lang: langObj.code === 'hi' ? 'hi-IN' : 'en-IN'
      });
    }

    // Smooth advance to next step
    setTimeout(() => {
      onLanguageSelected(langObj.code);
    }, 450);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2 font-sans">
      
      {/* Title Header Card */}
      <div className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-[#F5F9FF] border border-[#BFD3E8] px-4 py-1.5 rounded-full text-xs font-black text-[#0B4C8C]">
          <Languages size={16} className="text-[#E2861E]" />
          <span>{currentLang === 'hi' ? 'चरण 1 / 6' : 'Step 1 of 6'}</span>
        </div>

        <h2 
          className="text-2xl sm:text-4xl font-black text-[#16213A] tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {currentLang === 'hi' ? 'अपनी पसंदीदा भाषा चुनें' : 'Select Your Preferred Language'}
        </h2>
        
        <p className="text-sm sm:text-base text-[#5B677E] font-medium max-w-xl mx-auto">
          {currentLang === 'hi'
            ? 'कियोस्क पर आगे की जानकारी और आवाज मार्गदर्शन आपकी चुनी हुई भाषा में प्रदर्शित होगा।'
            : 'All subsequent interview steps, questions, and voice audio will be presented in your chosen language.'}
        </p>
      </div>

      {/* Language Touch Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selected === lang.code;

          return (
            <motion.button
              key={lang.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectLanguage(lang)}
              className={`p-6 rounded-3xl text-left border-2 transition-all flex items-center justify-between shadow-xs cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-[#F5F9FF] text-[#0B4C8C] border-[#0B4C8C] ring-4 ring-blue-100 scale-[1.02]'
                  : 'bg-white hover:bg-[#F1F6FC] text-[#16213A] border-[#DCE3EC] hover:border-[#BFD3E8]'
              }`}
            >
              {/* Left Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#16213A]">
                    {lang.nameHi}
                  </h3>
                  {lang.popular && (
                    <Badge className="bg-[#FFF7ED] text-[#E2861E] border border-[#FED7AA] text-[10px] font-black">
                      Primary
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-bold text-[#5B677E] font-sans">
                  {lang.nameEn}
                </p>
                <p className="text-xs text-[#37455A] font-medium italic pt-1">
                  "{lang.greeting}"
                </p>
              </div>

              {/* Right Selection Indicator */}
              <div className="ml-4 shrink-0">
                {isSelected ? (
                  <div className="w-12 h-12 bg-[#0B4C8C] text-white rounded-2xl flex items-center justify-center shadow-xs">
                    <CheckCircle2 size={26} />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-[#F1F6FC] text-[#5B677E] rounded-2xl flex items-center justify-center border border-[#DCE3EC]">
                    <ArrowRight size={22} />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Voice Prompt Info */}
      <div className="p-4 bg-white rounded-2xl border border-[#DCE3EC] text-center text-xs font-bold text-[#5B677E] flex items-center justify-center gap-2">
        <Volume2 size={16} className="text-[#E2861E]" />
        <span>
          {currentLang === 'hi' 
            ? 'आप किसी भी भाषा को स्क्रीन पर स्पर्श करके चुन सकते हैं' 
            : 'Tap any card above to choose your preferred language and proceed'}
        </span>
      </div>

    </div>
  );
}
