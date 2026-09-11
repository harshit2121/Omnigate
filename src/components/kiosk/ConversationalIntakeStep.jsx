import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, 
  CheckCircle2, ArrowRight, Stethoscope, Flower2,
  ChevronLeft, Building2, History, AlertCircle, Pill,
  HeartPulse, ShieldAlert, Plus, X, Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import HealthIcon from '../ui/HealthIcon';
import { CLINICAL_DEPARTMENTS, CHIEF_COMPLAINTS, evaluateRedFlags } from '../../data/socratesFramework';
import dynamicClinicalAiService from '../../services/dynamicClinicalAiService';
import { ayushAiCopilotService } from '../../services/ayushAiCopilotService';
import voiceAssistant from '../../services/voiceAssistant';
import NidanAiCard from '../ui/NidanAiCard';
import NidanAiLogo from '../ui/NidanAiLogo';

export default function ConversationalIntakeStep({
  intakeData,
  setIntakeData,
  currentLang = 'hi',
  voiceEnabled,
  onRedFlagDetected
}) {
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(intakeData.complaintId || null);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState(intakeData.answers || {});
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [clinicalMode, setClinicalMode] = useState(intakeData.clinicalMode || 'ayush');
  const [activeIntakeTab, setActiveIntakeTab] = useState('hpi'); // 'hpi' | 'ai_inquiries' | 'past_history' | 'current_meds'

  // Dynamic AI Clinical Inquiries for Kiosk Patient (5 High-Yield Questions)
  const [kioskAiInquiries, setKioskAiInquiries] = useState(intakeData.kioskAiInquiries || []);
  const [aiInquiriesResponse, setAiInquiriesResponse] = useState(intakeData.aiInquiriesResponse || {});
  const [isLoadingAiInquiries, setIsLoadingAiInquiries] = useState(false);
  const [currentAiInqIndex, setCurrentAiInqIndex] = useState(0);

  // Past Clinical History & Medications State (Current + Previous, Modern + Ayurvedic)
  const [pastConditions, setPastConditions] = useState(intakeData.pastConditions || []);
  const [knownAllergies, setKnownAllergies] = useState(intakeData.knownAllergies || []);
  const [currentMedications, setCurrentMedications] = useState(intakeData.currentMedications || ['Telmisartan 40mg', 'Metformin 500mg']);
  const [previousMedications, setPreviousMedications] = useState(intakeData.previousMedications || [
    { name: 'Diclofenac 50mg', system: 'allopathic', reason: 'Adverse Gastric Irritation (पेट में जलन)' },
    { name: 'Avipattikar Churna 5g', system: 'ayurvedic', reason: 'Course Completed (उपचार पूर्ण)' }
  ]);
  const [newMedInput, setNewMedInput] = useState('');
  const [newMedSystem, setNewMedSystem] = useState('ayurvedic');
  const [medHistoryType, setMedHistoryType] = useState('current'); // 'current' | 'previous'
  const [discontinueReason, setDiscontinueReason] = useState('Course Completed (उपचार पूर्ण)');

  const activeDept = CLINICAL_DEPARTMENTS.find(d => d.id === selectedDeptId);
  const deptComplaints = selectedDeptId 
    ? CHIEF_COMPLAINTS.filter(c => c.departmentId === selectedDeptId)
    : CHIEF_COMPLAINTS;

  const currentQuestion = activeQuestions[currentQIndex];

  // Helper to get options in current language
  const getQuestionOptions = (q) => {
    if (!q) return [];
    if (currentLang === 'hi') {
      return q.optionsHi && q.optionsHi.length > 0 ? q.optionsHi : (q.options || []);
    }
    return q.optionsEn && q.optionsEn.length > 0 ? q.optionsEn : (q.options || []);
  };

  useEffect(() => {
    if (selectedComplaint && currentQuestion && voiceEnabled && activeIntakeTab === 'hpi') {
      const qText = currentLang === 'hi' ? currentQuestion.textHi : currentQuestion.textEn;
      voiceAssistant.speak(qText);
    }
  }, [selectedComplaint, currentQIndex, currentLang, voiceEnabled, activeQuestions, activeIntakeTab]);

  // Voice narration for NIDAAN AI Inquiries
  useEffect(() => {
    if (selectedComplaint && activeIntakeTab === 'ai_inquiries' && voiceEnabled && kioskAiInquiries.length > 0) {
      const inq = kioskAiInquiries[currentAiInqIndex];
      if (inq) {
        const qText = currentLang === 'hi' ? inq.questionHi : inq.questionEn;
        voiceAssistant.speak(qText);
      }
    }
  }, [selectedComplaint, currentAiInqIndex, currentLang, voiceEnabled, kioskAiInquiries, activeIntakeTab]);

  const handleSelectDepartment = (dept) => {
    setSelectedDeptId(dept.id);
    voiceAssistant.playAudioCue('beep');
    if (voiceEnabled) {
      const text = currentLang === 'hi'
        ? `${dept.nameHi} चुना गया। अब अपनी मुख्य समस्या चुनें।`
        : `Selected ${dept.nameEn}. Please choose your specific symptom.`;
      voiceAssistant.speak(text);
    }
  };

  const handleSelectComplaint = async (complaint) => {
    setSelectedComplaint(complaint.id);
    setIsLoadingQuestions(true);
    setIsLoadingAiInquiries(true);
    setCurrentQIndex(0);
    setCurrentAiInqIndex(0);

    // AI immediately takes over clinical intake upon symptom selection
    setActiveIntakeTab('ai_inquiries');

    setIntakeData(prev => ({
      ...prev,
      complaintId: complaint.id,
      complaintLabel: complaint.label,
      complaintLabelHi: complaint.hi,
      departmentId: selectedDeptId,
      departmentName: activeDept?.nameEn,
      clinicalMode,
      pastConditions,
      knownAllergies,
      currentMedications
    }));

    if (voiceEnabled) {
      const text = currentLang === 'hi'
        ? `${complaint.hi} चुना गया। NIDAAN AI पूर्व-परामर्श मूल्यांकन शुरू हो रहा है...`
        : `Selected ${complaint.label}. Starting NIDAAN AI clinical pre-consultation assessment...`;
      voiceAssistant.speak(text);
    }

    try {
      const [dynamicQs, inquiries] = await Promise.all([
        dynamicClinicalAiService.generateQuestionsForComplaint(
          selectedDeptId,
          complaint,
          currentLang
        ),
        ayushAiCopilotService.generateKioskInquiries({
          chiefComplaint: complaint.label,
          complaintId: complaint.id,
          currentLang
        })
      ]);

      setActiveQuestions(dynamicQs);
      setKioskAiInquiries(inquiries);
      setIntakeData(prev => ({
        ...prev,
        kioskAiInquiries: inquiries,
        kioskInquiries: inquiries.map(item => ({
          id: item.id,
          questionHi: item.questionHi,
          questionEn: item.questionEn,
          patientAnswer: prev.aiInquiriesResponse?.[item.id]?.answer || null,
          clinicalReason: item.clinicalReason
        }))
      }));
    } catch (err) {
      console.warn('Failed generating dynamic questions / inquiries:', err);
    } finally {
      setIsLoadingQuestions(false);
      setIsLoadingAiInquiries(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      setSpokenTranscript('');
      voiceAssistant.startListening({
        lang: currentLang === 'hi' ? 'hi-IN' : 'en-IN',
        onResult: ({ text }) => {
          setSpokenTranscript(text);
          if (currentQuestion && activeIntakeTab === 'hpi') {
            const opts = getQuestionOptions(currentQuestion);
            const matchedOpt = opts.find(opt => 
              text.toLowerCase().includes(opt.toLowerCase()) || 
              (typeof opt === 'string' && opt.toLowerCase().includes(text.toLowerCase()))
            );
            if (matchedOpt) {
              handleAnswerSelect(currentQuestion.field, matchedOpt);
            }
          }
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false)
      });
    }
  };

  const handleAnswerSelect = (field, option) => {
    let updatedAnswers;
    if (currentQuestion.isMulti) {
      const currentList = answers[field] || [];
      if (currentList.includes(option)) {
        updatedAnswers = { ...answers, [field]: currentList.filter(item => item !== option) };
      } else {
        updatedAnswers = { ...answers, [field]: [...currentList, option] };
      }
    } else {
      updatedAnswers = { ...answers, [field]: option };
    }

    setAnswers(updatedAnswers);
    setIntakeData(prev => ({ 
      ...prev, 
      answers: updatedAnswers,
      pastConditions,
      knownAllergies,
      currentMedications
    }));

    const redFlagResult = evaluateRedFlags(selectedComplaint, updatedAnswers);
    if (redFlagResult.hasRedFlag) {
      voiceAssistant.playAudioCue('alert');
      if (onRedFlagDetected) {
        onRedFlagDetected(redFlagResult.flags[0]);
      }
    }

    if (!currentQuestion.isMulti && currentQIndex < activeQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQIndex(prev => prev + 1);
      }, 350);
    }
  };

  const togglePastCondition = (cond) => {
    const updated = pastConditions.includes(cond)
      ? pastConditions.filter(c => c !== cond)
      : [...pastConditions, cond];
    setPastConditions(updated);
    setIntakeData(prev => ({ ...prev, pastConditions: updated }));
  };

  const toggleAllergy = (allg) => {
    const updated = knownAllergies.includes(allg)
      ? knownAllergies.filter(a => a !== allg)
      : [...knownAllergies, allg];
    setKnownAllergies(updated);
    setIntakeData(prev => ({ ...prev, knownAllergies: updated }));
  };

  const handleAddMedication = () => {
    if (!newMedInput.trim()) return;

    if (medHistoryType === 'current') {
      const updated = [...currentMedications, newMedInput.trim()];
      setCurrentMedications(updated);
      setIntakeData(prev => ({ ...prev, currentMedications: updated }));
    } else {
      const updated = [
        ...previousMedications,
        {
          name: newMedInput.trim(),
          system: newMedSystem,
          reason: discontinueReason
        }
      ];
      setPreviousMedications(updated);
      setIntakeData(prev => ({ ...prev, previousMedications: updated }));
    }

    setNewMedInput('');
    voiceAssistant.playAudioCue('beep');
  };

  const handleRemoveMedication = (idx, isPrevious = false) => {
    if (!isPrevious) {
      const updated = currentMedications.filter((_, i) => i !== idx);
      setCurrentMedications(updated);
      setIntakeData(prev => ({ ...prev, currentMedications: updated }));
    } else {
      const updated = previousMedications.filter((_, i) => i !== idx);
      setPreviousMedications(updated);
      setIntakeData(prev => ({ ...prev, previousMedications: updated }));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Clinical Navigation Bar (HPI vs Past History vs Medication History) */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-2 rounded-2xl border-2 border-[#DCE3EC] shadow-xs gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1">
          {[
            { id: 'hpi', labelEn: '1. Present Illness (HPI - SOCRATES)', labelHi: '१. मुख्य समस्या (HPI)', icon: Stethoscope },
            { id: 'ai_inquiries', labelEn: '2. NIDAAN AI Inquiries', labelHi: '२. निदान AI पूछताछ', icon: NidanAiLogo },
            { id: 'past_history', labelEn: '3. Past History & Allergies', labelHi: '३. पुराना इतिहास व एलर्जी', icon: History },
            { id: 'current_meds', labelEn: '4. Medication History', labelHi: '४. दवा इतिहास', icon: Pill }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeIntakeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveIntakeTab(tab.id)}
                className={`py-2 px-3 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0B4C8C] text-white shadow-xs'
                    : 'text-[#5B677E] hover:bg-[#F1F6FC] hover:text-[#16213A]'
                }`}
              >
                <Icon size={14} />
                <span>{currentLang === 'hi' ? tab.labelHi : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-2">
          <Badge className="bg-[#FFF7ED] text-[#E2861E] border border-[#FED7AA] text-[10px] font-black uppercase">
            {clinicalMode === 'ayush' ? 'AIIA Ayush Case' : 'Allopathic Mode'}
          </Badge>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRESENT ILLNESS (HPI - SOCRATES SYMPTOM INTAKE)                    */}
      {/* ========================================================================= */}
      {activeIntakeTab === 'hpi' && (
        <div>
          {!selectedComplaint ? (
            <div className="space-y-5">
              {!selectedDeptId ? (
                <div className="space-y-4">
                  <div className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0B4C8C]"></span>
                        <span className="text-xs font-black text-[#0B4C8C] uppercase tracking-wider">
                          {currentLang === 'hi' ? 'चरण 1 : संबंधित चिकित्सा विभाग चुनें' : 'Step 1: Select Clinical Department'}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#16213A] mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
                        {currentLang === 'hi' ? 'अपनी समस्या का विभाग चुनें' : 'Choose Problem Category'}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5B677E] font-medium mt-0.5">
                        {currentLang === 'hi'
                          ? 'उदाहरण: पेट व पाचन के लिए "उदर एवं पाचन", हड्डी व जोड़ के लिए "हड्डी एवं जोड़" चुनें।'
                          : 'Select your relevant clinical specialty department.'}
                      </p>
                    </div>

                    <Badge className="bg-[#F5F9FF] text-[#0B4C8C] border-2 border-[#BFD3E8] text-xs font-black px-3.5 py-1.5 shrink-0 rounded-xl">
                      {CLINICAL_DEPARTMENTS.length} {currentLang === 'hi' ? 'ओपीडी विभाग' : 'OPD Departments'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {CLINICAL_DEPARTMENTS.map((dept) => (
                      <motion.button
                        key={dept.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectDepartment(dept)}
                        className="p-5 sm:p-6 rounded-3xl text-left border-2 border-[#DCE3EC] hover:border-[#0B4C8C] bg-white hover:bg-[#F5F9FF]/80 transition-all duration-150 flex flex-col justify-between min-h-[195px] group cursor-pointer shadow-xs hover:shadow-md relative"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3.5">
                            <div className="w-13 h-13 rounded-2xl bg-[#F5F9FF] group-hover:bg-[#0B4C8C] text-[#0B4C8C] group-hover:text-white flex items-center justify-center transition-colors duration-200 border border-[#DCE3EC] p-2.5">
                              <HealthIcon
                                category={dept.healthIcon?.category || 'specialties'}
                                name={dept.healthIcon?.name || 'cardiology'}
                                size={28}
                                className="text-current"
                                alt={dept.nameEn}
                              />
                            </div>
                            <Badge className="bg-[#F1F6FC] text-[#16213A] border border-[#DCE3EC] text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
                              {currentLang === 'hi' ? dept.badge : dept.nameEn.split(' ')[0]}
                            </Badge>
                          </div>

                          <h4 className="font-black text-[#16213A] text-base sm:text-lg leading-tight">
                            <span className="block text-[#16213A] group-hover:text-[#0B4C8C] transition-colors">
                              {currentLang === 'hi' ? dept.nameHi : dept.nameEn}
                            </span>
                          </h4>
                        </div>

                        <div className="pt-3 border-t border-[#DCE3EC] flex items-center justify-between text-xs font-black mt-3">
                          <span className="text-[11px] text-[#5B677E] font-medium truncate max-w-[170px]">
                            {dept.description}
                          </span>
                          <div className="w-7 h-7 rounded-lg bg-[#F1F6FC] group-hover:bg-[#0B4C8C] text-[#5B677E] group-hover:text-white flex items-center justify-center transition-colors shrink-0 ml-2">
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-5 shadow-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => setSelectedDeptId(null)}
                        variant="outline"
                        className="border-2 border-[#DCE3EC] text-[#16213A] hover:bg-[#F1F6FC] h-11 px-4 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-2xs"
                      >
                        <ChevronLeft size={16} />
                        <span>{currentLang === 'hi' ? '← विभाग बदलें' : '← Change Department'}</span>
                      </Button>

                      <div>
                        <span className="text-xs font-extrabold text-[#0B4C8C] uppercase tracking-wider">
                          {currentLang === 'hi' ? 'चयनित विभाग' : 'Selected Department'}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-[#16213A]">
                          {currentLang === 'hi' ? activeDept?.nameHi : activeDept?.nameEn}
                        </h3>
                      </div>
                    </div>

                    <Badge className="bg-emerald-50 text-emerald-900 border-2 border-emerald-300 text-xs font-black px-3 py-1 shrink-0 rounded-xl">
                      {deptComplaints.length} {currentLang === 'hi' ? 'लक्षण' : 'Symptoms'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deptComplaints.map((complaint) => (
                      <motion.button
                        key={complaint.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectComplaint(complaint)}
                        className="bg-white hover:bg-amber-50/30 border-2 border-[#DCE3EC] hover:border-[#E2861E] p-5 sm:p-6 rounded-3xl text-left transition-all shadow-xs hover:shadow-md group flex flex-col justify-between min-h-[140px] cursor-pointer"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div className="w-11 h-11 rounded-xl bg-[#F5F9FF] text-[#0B4C8C] group-hover:bg-[#E2861E] group-hover:text-white flex items-center justify-center transition-colors shrink-0 border border-[#DCE3EC] p-2">
                              <HealthIcon
                                category={complaint.healthIcon?.category || 'conditions'}
                                name={complaint.healthIcon?.name || 'pain'}
                                size={22}
                                className="text-current"
                                alt={complaint.label}
                              />
                            </div>
                          </div>

                          <h5 className="font-black text-[#16213A] text-base sm:text-lg group-hover:text-[#E2861E] leading-snug">
                            {currentLang === 'hi' ? complaint.hi : complaint.label}
                          </h5>
                        </div>

                        <div className="text-xs text-[#E2861E] font-black flex items-center justify-between mt-3 pt-2.5 border-t border-[#DCE3EC]">
                          <span>{currentLang === 'hi' ? 'प्रश्नावली शुरू करें' : 'Start Assessment'}</span>
                          <ArrowRight size={14} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#DCE3EC] shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b-2 border-[#DCE3EC] pb-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-[#0B4C8C] text-white border-0 font-black text-xs px-3.5 py-1.5 rounded-xl">
                    {currentLang === 'hi' ? (intakeData.complaintLabelHi || intakeData.complaintLabel) : (intakeData.complaintLabel || intakeData.complaintLabelHi)}
                  </Badge>
                  {!isLoadingQuestions && (
                    <span className="text-xs text-[#5B677E] font-bold">
                      {currentLang === 'hi' ? `प्रश्न ${currentQIndex + 1} / ${activeQuestions.length}` : `Question ${currentQIndex + 1} of ${activeQuestions.length}`}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-xs text-[#E2861E] hover:text-[#C2410C] font-black bg-[#FFF7ED] px-3.5 py-2 rounded-xl border border-[#FED7AA] hover:bg-orange-100 cursor-pointer"
                >
                  {currentLang === 'hi' ? '← लक्षण बदलें' : '← Change Symptom'}
                </button>
              </div>

              {isLoadingQuestions ? (
                <div className="py-14 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#0B4C8C] animate-spin"></div>
                    <Stethoscope className="absolute inset-0 m-auto text-[#0B4C8C]" size={24} />
                  </div>
                  <h4 className="text-base font-black text-[#16213A]">
                    {currentLang === 'hi' ? 'क्लिनिकल केस-टेकिंग प्रश्नावली लोड हो रही है...' : 'Loading Clinical Assessment...'}
                  </h4>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4 bg-[#F5F9FF] p-5 rounded-2xl border border-[#DCE3EC]">
                    <div className="space-y-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0B4C8C]">
                        {currentLang === 'hi' ? `क्लिनिकल प्रश्न ${currentQIndex + 1}` : `Clinical Assessment ${currentQIndex + 1}`}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[#16213A] leading-snug" style={{ fontFamily: "'Fraunces', serif" }}>
                        {currentLang === 'hi' ? currentQuestion?.textHi : currentQuestion?.textEn}
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        const text = currentLang === 'hi' ? currentQuestion?.textHi : currentQuestion?.textEn;
                        voiceAssistant.speak(text);
                      }}
                      className="p-3.5 bg-white hover:bg-[#F1F6FC] border-2 border-[#DCE3EC] rounded-2xl text-[#0B4C8C] shrink-0"
                    >
                      <Volume2 size={22} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {getQuestionOptions(currentQuestion).map((option, idx) => {
                      const isSelected = currentQuestion.isMulti
                        ? (answers[currentQuestion.field] || []).includes(option)
                        : answers[currentQuestion.field] === option;

                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            voiceAssistant.playAudioCue('beep');
                            handleAnswerSelect(currentQuestion.field, option);
                          }}
                          className={`p-5 rounded-2xl text-left font-black text-sm sm:text-base border-2 transition-all flex items-center justify-between min-h-[68px] shadow-xs cursor-pointer ${
                            isSelected
                              ? 'bg-[#F5F9FF] text-[#0B4C8C] border-[#0B4C8C] ring-2 ring-[#0B4C8C]/20 shadow-sm'
                              : 'bg-white hover:bg-[#F1F6FC] text-[#16213A] border-[#DCE3EC] hover:border-[#BFD3E8]'
                          }`}
                        >
                          <span className="leading-snug">{option}</span>
                          {isSelected ? (
                            <CheckCircle2 size={24} className="text-[#0B4C8C] shrink-0 ml-3" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-[#DCE3EC] shrink-0 ml-3" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Voice Input Controller */}
              <div className="bg-[#F5F9FF] border border-[#DCE3EC] rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    onClick={toggleListening}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-[#E2861E] text-white font-bold'
                    }`}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </Button>
                  <div>
                    <p className="text-xs font-bold text-[#16213A]">
                      {isListening ? (currentLang === 'hi' ? 'बोलिए...' : 'Listening...') : (currentLang === 'hi' ? 'माइक द्वारा बोलकर उत्तर दें' : 'Tap Mic to Speak Answer')}
                    </p>
                    <p className="text-[11px] text-[#5B677E] font-medium truncate max-w-[280px]">
                      {spokenTranscript || (currentLang === 'hi' ? 'सहज भाषा में उत्तर दें' : 'Speak naturally')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex(prev => prev - 1)}
                    className="border-[#DCE3EC] text-[#16213A] rounded-lg h-8 px-3 text-xs font-bold"
                  >
                    {currentLang === 'hi' ? 'पिछला' : 'Prev'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentQIndex === activeQuestions.length - 1}
                    onClick={() => setCurrentQIndex(prev => prev + 1)}
                    className="border-[#DCE3EC] text-[#16213A] rounded-lg h-8 px-3 text-xs font-bold"
                  >
                    {currentLang === 'hi' ? 'अगला' : 'Next'}
                  </Button>
                  <Button
                    onClick={() => setActiveIntakeTab('ai_inquiries')}
                    className="bg-[#0B4C8C] hover:bg-[#072d54] text-white rounded-lg h-8 px-3 text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <NidanAiLogo size={14} />
                    <span>{currentLang === 'hi' ? 'निदान AI प्रश्न →' : 'NIDAAN AI Inquiries →'}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: NIDAAN AI CLINICAL INQUIRIES (REDEVELOPED & PROMOTED)              */}
      {/* ========================================================================= */}
      {activeIntakeTab === 'ai_inquiries' && (
        <div className="space-y-5">
          {/* 1. PROFESSIONAL CENTERED NIDAAN AI HERO PROMOTION */}
          <div className="bg-white rounded-3xl border-2 border-[#DCE3EC] p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Subtle luminous background aura */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5F9FF]/80 via-white to-white pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-1">
              <img
                src="/nidaan_ai_full.png"
                alt="NIDAAN AI - Caring Intelligence. Transforming Diagnostics."
                className="h-20 sm:h-28 md:h-32 w-auto object-contain transition-transform duration-300 hover:scale-[1.02] drop-shadow-xs"
                onError={(e) => { e.currentTarget.src = '/nidaan_ai_logo.png'; }}
              />
            </div>
          </div>

          {!selectedComplaint ? (
            /* No Symptom Selected Yet Prompt */
            <div className="bg-white rounded-3xl border-2 border-[#DCE3EC] p-8 sm:p-12 text-center space-y-5 shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#0B4C8C] flex items-center justify-center mx-auto border-2 border-blue-100 shadow-xs">
                <Stethoscope size={32} />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  {currentLang === 'hi' ? 'कृपया पहले अपनी मुख्य समस्या चुनें' : 'Please Select Chief Symptom First'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {currentLang === 'hi'
                    ? 'निदान एआई आपकी समस्या के अनुसार ५ विशिष्ट नैदानिक प्रश्न तैयार करेगा।'
                    : 'NIDAAN AI will generate 5 targeted diagnostic assessment questions for your specific condition.'}
                </p>
              </div>
              <Button
                onClick={() => setActiveIntakeTab('hpi')}
                className="bg-[#0B4C8C] hover:bg-[#072d54] text-white font-black px-6 py-2.5 rounded-2xl text-xs sm:text-sm cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <span>{currentLang === 'hi' ? '← चरण 1 : समस्या चुनें' : '← Step 1: Select Symptom'}</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          ) : isLoadingAiInquiries ? (
            /* Loading State */
            <div className="bg-white rounded-3xl border-2 border-[#DCE3EC] p-12 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 border-4 border-[#0B4C8C] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="space-y-1">
                <p className="text-base font-black text-slate-900">
                  {currentLang === 'hi' ? 'NIDAAN AI नैदानिक प्रश्न तैयार कर रहा है...' : 'NIDAAN AI is generating tailored clinical inquiries...'}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {currentLang === 'hi' ? 'आयुष ज्ञानकोश एवं लक्षण विश्लेषण लोड हो रहा है' : 'Synthesizing symptom pathology and dosha markers'}
                </p>
              </div>
            </div>
          ) : (
            /* ACTIVE 5-QUESTION CLINICAL ASSESSMENT FLOW (MATCHING REFERENCE DESIGN) */
            <div className="space-y-4">
              {(() => {
                const activeList = kioskAiInquiries.length > 0 ? kioskAiInquiries : [
                  {
                    id: 'inq_1',
                    questionHi: 'पीठ अथवा कमर के दर्द की प्रकृति और फैलाव का सबसे सटीक वर्णन क्या है?',
                    questionEn: 'What best describes the nature and radiation of your back or lumbar pain?',
                    optionsHi: [
                      'कमर से शुरू होकर पैरों में घुटने के नीचे तक तेज खिंचाव व झुनझुनी वाला दर्द (Sciatica / Gridhrasi)',
                      'निचली पीठ में केवल स्थानीय भारीपन व जकड़न (Local Lumbar Strain / Katigraha)',
                      'रीढ़ की हड्डी में जलन व लगातार चुभन वाला तेज दर्द (Vata-Pitta Spasm)',
                      'उठने-बैठने पर अचानक बिजली जैसा झटका या सुई चुभने जैसी सनसनाहट'
                    ],
                    optionsEn: [
                      'Sharp shooting pain radiating down one or both legs past the knee (Sciatica / Gridhrasi)',
                      'Dull localized lower back ache and stiffness with no leg radiation (Katigraha)',
                      'Deep burning and constant throbbing ache along spinal column (Vata-Pitta)',
                      'Sudden electric shock sensation or needle-like prick upon movement'
                    ],
                    clinicalReason: 'Differentiates lumbar radiculopathy from localized Katigraha'
                  }
                ];

                const currentInquiry = activeList[Math.min(currentAiInqIndex, activeList.length - 1)] || activeList[0];
                const activeOptions = currentLang === 'hi'
                  ? (currentInquiry.optionsHi || currentInquiry.optionsEn || [])
                  : (currentInquiry.optionsEn || currentInquiry.optionsHi || []);
                const recordedResponse = aiInquiriesResponse[currentInquiry.id]?.answer;
                const totalQuestions = activeList.length;
                const answeredCount = activeList.filter(item => aiInquiriesResponse[item.id]?.answer).length;

                return (
                  <div className="space-y-4">
                    {/* Top Symptom Bar & Question Counter */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-[#DCE3EC] shadow-2xs">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <div className="px-4 py-1.5 rounded-full bg-slate-900 text-white font-black text-xs sm:text-sm tracking-wide shadow-xs flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>
                            {currentLang === 'hi' 
                              ? (intakeData.complaintLabelHi || intakeData.complaintLabel || 'मुख्य समस्या') 
                              : (intakeData.complaintLabel || intakeData.complaintLabelHi || 'Chief Complaint')}
                          </span>
                        </div>
                        <Badge className="bg-blue-50 text-[#0B4C8C] border border-blue-200 text-xs font-black px-3 py-1 rounded-xl">
                          {currentLang === 'hi'
                            ? `प्रश्न ${currentAiInqIndex + 1} / ${totalQuestions}`
                            : `Question ${currentAiInqIndex + 1} of ${totalQuestions}`}
                        </Badge>
                        <Badge className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-2.5 py-1 rounded-xl">
                          {answeredCount} / {totalQuestions} {currentLang === 'hi' ? 'उत्तर दिए गए' : 'Answered'}
                        </Badge>
                      </div>

                      <Button
                        onClick={() => {
                          setSelectedComplaint(null);
                          setActiveIntakeTab('hpi');
                        }}
                        variant="outline"
                        size="sm"
                        className="border-2 border-[#DCE3EC] hover:border-slate-400 text-[#16213A] rounded-xl text-xs font-black h-9 px-3.5 cursor-pointer shadow-2xs shrink-0"
                      >
                        <ChevronLeft size={14} className="mr-1" />
                        <span>{currentLang === 'hi' ? '← लक्षण बदलें' : '← Change Symptom'}</span>
                      </Button>
                    </div>

                    {/* MAIN CLINICAL ASSESSMENT CARD (MATCHING REFERENCE DESIGN) */}
                    <motion.div
                      key={currentInquiry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-3xl border-2 border-[#DCE3EC] p-6 sm:p-8 shadow-xs space-y-6"
                    >
                      {/* Question Header & Speaker Button */}
                      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                        <div className="space-y-2">
                          <span className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-blue-50 text-[#0B4C8C] border border-blue-200/80">
                            CLINICAL ASSESSMENT {currentAiInqIndex + 1}
                          </span>
                          <h3 
                            className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug"
                            style={{ fontFamily: "'Fraunces', serif" }}
                          >
                            {currentLang === 'hi' ? currentInquiry.questionHi : currentInquiry.questionEn}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 font-medium italic">
                            {currentLang === 'hi' ? currentInquiry.questionEn : currentInquiry.questionHi}
                          </p>
                        </div>

                        {/* Speaker Voice Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const qText = currentLang === 'hi' ? currentInquiry.questionHi : currentInquiry.questionEn;
                            voiceAssistant.speak(qText);
                          }}
                          title={currentLang === 'hi' ? 'प्रश्न सुनें' : 'Listen to Question'}
                          className="w-12 h-12 rounded-2xl bg-amber-50 hover:bg-amber-100 text-[#E2861E] border-2 border-amber-200/80 flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                        >
                          <Volume2 size={24} />
                        </button>
                      </div>

                      {/* 2x2 GRID OF CLINICAL OPTION CARDS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeOptions.map((optionText, optIdx) => {
                          const isSelected = recordedResponse === optionText;

                          return (
                            <motion.button
                              key={optIdx}
                              whileHover={{ scale: 1.015 }}
                              whileTap={{ scale: 0.985 }}
                              type="button"
                              onClick={() => {
                                voiceAssistant.playAudioCue('beep');
                                const updatedResponses = {
                                  ...aiInquiriesResponse,
                                  [currentInquiry.id]: {
                                    questionHi: currentInquiry.questionHi,
                                    questionEn: currentInquiry.questionEn,
                                    answer: optionText,
                                    clinicalReason: currentInquiry.clinicalReason
                                  }
                                };
                                const updatedInquiries = activeList.map(item => {
                                  const ans = item.id === currentInquiry.id ? optionText : (aiInquiriesResponse[item.id]?.answer || null);
                                  return {
                                    id: item.id,
                                    questionHi: item.questionHi,
                                    questionEn: item.questionEn,
                                    patientAnswer: ans,
                                    clinicalReason: item.clinicalReason
                                  };
                                });

                                setAiInquiriesResponse(updatedResponses);
                                setIntakeData(prev => ({
                                  ...prev,
                                  aiInquiriesResponse: updatedResponses,
                                  kioskAiInquiries: activeList,
                                  kioskInquiries: updatedInquiries
                                }));

                                if (voiceEnabled) {
                                  voiceAssistant.speak(optionText);
                                }

                                // Smooth auto-advance to next inquiry after 350ms
                                if (currentAiInqIndex < totalQuestions - 1) {
                                  setTimeout(() => {
                                    setCurrentAiInqIndex(prev => prev + 1);
                                  }, 350);
                                }
                              }}
                              className={`p-5 sm:p-6 rounded-2xl text-left border-2 transition-all flex items-center justify-between min-h-[90px] cursor-pointer shadow-xs ${
                                isSelected
                                  ? 'bg-[#F5F9FF] text-[#0B4C8C] border-[#0B4C8C] ring-3 ring-[#0B4C8C]/20 shadow-md'
                                  : 'bg-white hover:bg-slate-50/90 text-slate-800 border-[#DCE3EC] hover:border-slate-300'
                              }`}
                            >
                              <span className="font-extrabold text-sm sm:text-base leading-relaxed pr-3">
                                {optionText}
                              </span>

                              {/* Circular Radio Checkbox Indicator */}
                              {isSelected ? (
                                <div className="w-7 h-7 rounded-full bg-[#0B4C8C] text-white flex items-center justify-center shrink-0 shadow-xs ring-2 ring-white">
                                  <CheckCircle2 size={18} />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-300 shrink-0" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Clinical Reason Insight Footer */}
                      {currentInquiry.clinicalReason && (
                        <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <span className="font-bold text-[#0B4C8C]">Diagnostic Value:</span>
                          <span>{currentInquiry.clinicalReason}</span>
                        </div>
                      )}

                      {/* STEPPER NAVIGATION CONTROLS */}
                      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Prev Button */}
                        <Button
                          variant="outline"
                          disabled={currentAiInqIndex === 0}
                          onClick={() => setCurrentAiInqIndex(prev => Math.max(0, prev - 1))}
                          className="border-2 border-[#DCE3EC] text-slate-700 hover:bg-slate-50 rounded-xl h-11 px-5 text-xs font-bold w-full sm:w-auto cursor-pointer"
                        >
                          <ChevronLeft size={16} className="mr-1" />
                          <span>{currentLang === 'hi' ? 'पिछला प्रश्न' : 'Previous Inquiry'}</span>
                        </Button>

                        {/* Step Dots */}
                        <div className="flex items-center gap-2">
                          {activeList.map((q, idx) => {
                            const isAnswered = !!aiInquiriesResponse[q.id]?.answer;
                            const isCurrent = idx === currentAiInqIndex;

                            return (
                              <button
                                key={q.id || idx}
                                type="button"
                                onClick={() => setCurrentAiInqIndex(idx)}
                                className={`w-8 h-8 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer ${
                                  isCurrent
                                    ? 'bg-[#0B4C8C] text-white shadow-xs scale-110'
                                    : isAnswered
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>

                        {/* Next / Complete Button */}
                        {currentAiInqIndex < totalQuestions - 1 ? (
                          <Button
                            onClick={() => setCurrentAiInqIndex(prev => prev + 1)}
                            className="bg-[#0B4C8C] hover:bg-[#072d54] text-white rounded-xl h-11 px-6 text-xs font-black shadow-md w-full sm:w-auto cursor-pointer flex items-center gap-2"
                          >
                            <span>{currentLang === 'hi' ? 'अगला प्रश्न' : 'Next Inquiry'}</span>
                            <ArrowRight size={16} />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => setActiveIntakeTab('past_history')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 text-xs font-black shadow-md w-full sm:w-auto cursor-pointer flex items-center gap-2"
                          >
                            <CheckCircle2 size={16} />
                            <span>{currentLang === 'hi' ? 'मूल्यांकन पूर्ण — आगे बढ़ें →' : 'Complete Intake — Next Step →'}</span>
                          </Button>
                        )}
                      </div>
                    </motion.div>

                    {/* COMPLETED ASSESSMENT SUMMARY CARD (IF ALL 5 ANSWERED) */}
                    {answeredCount >= totalQuestions && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50/80 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 text-center sm:text-left">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <CheckCircle2 size={24} />
                          </div>
                          <div>
                            <h4 className="text-base font-black text-emerald-950">
                              {currentLang === 'hi' ? 'सभी ५ NIDAAN AI प्रश्न सफलतापूर्वक दर्ज हो चुके हैं!' : 'All 5 NIDAAN AI Inquiries Successfully Completed!'}
                            </h4>
                            <p className="text-xs text-emerald-800 font-medium">
                              {currentLang === 'hi'
                                ? 'आपके उत्तर सुरक्षित रूप से OPD चिकित्सक वर्कस्टेशन से लिंक हो गए हैं।'
                                : 'Your responses are linked to the physician consultation report.'}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => setActiveIntakeTab('past_history')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer shrink-0"
                        >
                          <span>{currentLang === 'hi' ? 'आगे बढ़ें : पुराना इतिहास →' : 'Proceed to Past History →'}</span>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PAST MEDICAL HISTORY & KNOWN ALLERGIES                             */}
      {/* ========================================================================= */}
      {activeIntakeTab === 'past_history' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Past Chronic Illnesses */}
          <div className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#0B4C8C] font-black text-base border-b border-[#DCE3EC] pb-3">
              <HeartPulse size={20} className="text-[#E2861E]" />
              <span>{currentLang === 'hi' ? 'पूर्व चिकित्सीय इतिहास (Past Illnesses)' : 'Past Medical Conditions'}</span>
            </div>

            <p className="text-xs text-[#5B677E] font-medium">
              {currentLang === 'hi' ? 'लागू होने वाले सभी रोगों का चयन करें:' : 'Select all chronic or past medical illnesses that apply:'}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'diabetes', en: 'Diabetes Mellitus (मधुमेह)', hi: 'मधुमेह (शुगर)' },
                { id: 'hypertension', en: 'Hypertension (उच्च रक्तचाप)', hi: 'हाई बीपी (उच्च रक्तचाप)' },
                { id: 'asthma', en: 'Bronchial Asthma (दमा)', hi: 'दमा / श्वास रोग' },
                { id: 'thyroid', en: 'Thyroid Disorder (थायराइड)', hi: 'थायराइड' },
                { id: 'acid_peptic', en: 'Acid Peptic Disease (अम्लपित्त)', hi: 'अम्लपित्त / एसिडिटी' },
                { id: 'osteoarthritis', en: 'Osteoarthritis (संधिवात)', hi: 'संधिवात / जोड़ों का दर्द' },
                { id: 'ckd', en: 'Kidney Disease (गुर्दा रोग)', hi: 'गुर्दा / किडनी रोग' },
                { id: 'cvd', en: 'Heart Disease (हृदय रोग)', hi: 'हृदय रोग' }
              ].map(item => {
                const isSelected = pastConditions.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => togglePastCondition(item.id)}
                    className={`p-3.5 rounded-2xl text-left text-xs font-bold border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#F5F9FF] text-[#0B4C8C] border-[#0B4C8C] shadow-2xs font-black'
                        : 'bg-[#F1F6FC] hover:bg-white text-[#16213A] border-[#DCE3EC]'
                    }`}
                  >
                    <span>{currentLang === 'hi' ? item.hi : item.en}</span>
                    {isSelected && <CheckCircle2 size={16} className="text-[#0B4C8C]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Known Allergies & Sensitivities */}
          <div className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-red-700 font-black text-base border-b border-[#DCE3EC] pb-3">
              <ShieldAlert size={20} className="text-red-600" />
              <span>{currentLang === 'hi' ? 'दवा व भोजन एलर्जी (Allergies)' : 'Known Drug & Food Allergies'}</span>
            </div>

            <p className="text-xs text-[#5B677E] font-medium">
              {currentLang === 'hi' ? 'ज्ञात एलर्जी पर टिक करें ताकि सुरक्षित दवाएं सुझाई जा सकें:' : 'Select any known allergies to prevent adverse drug reactions:'}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'penicillin', en: 'Penicillin / Amoxicillin', hi: 'पेनिसिलिन एंटीबायोटिक' },
                { id: 'sulfa', en: 'Sulfa Drugs', hi: 'सल्फा दवाएं' },
                { id: 'nsaids', en: 'NSAIDs (Painkillers/Aspirin)', hi: 'दर्द निवारक (NSAIDs / एस्पिरिन)' },
                { id: 'dairy', en: 'Dairy / Lactose Intolerance', hi: 'दूध / डेयरी उत्पाद' },
                { id: 'gluten', en: 'Gluten / Wheat Allergy', hi: 'गेहूं / ग्लूटेन एलर्जी' },
                { id: 'dust_pollen', en: 'Dust / Pollen (Rhinitis)', hi: 'धूल / पराग कण एलर्जी' }
              ].map(item => {
                const isSelected = knownAllergies.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleAllergy(item.id)}
                    className={`p-3.5 rounded-2xl text-left text-xs font-bold border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-red-50 text-red-800 border-red-400 shadow-2xs font-black'
                        : 'bg-[#F1F6FC] hover:bg-white text-[#16213A] border-[#DCE3EC]'
                    }`}
                  >
                    <span>{currentLang === 'hi' ? item.hi : item.en}</span>
                    {isSelected && <CheckCircle2 size={16} className="text-red-600" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MEDICATION HISTORY (CURRENT ACTIVE & PREVIOUS DISCONTINUED)        */}
      {/* ========================================================================= */}
      {activeIntakeTab === 'current_meds' && (
        <div className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE3EC] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#F0FDF4] text-emerald-800 border border-[#BBF7D0] text-[10px] font-black uppercase">
                  NIH RxNav API & Pharmacopoeia Guard
                </Badge>
                <span className="text-xs font-bold text-emerald-700">● LIVE API Connected</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#16213A] mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
                {currentLang === 'hi' ? 'दवा इतिहास (वर्तमान व पूर्व दवाएं)' : 'Patient Medication History'}
              </h3>
              <p className="text-xs text-[#5B677E] font-medium mt-0.5">
                {currentLang === 'hi'
                  ? 'वर्तमान में चल रही और पहले बंद की गई दवाएं जोड़ें — सिस्टम रीयल-टाइम में टकराव व कारण रिकॉर्ड करेगा।'
                  : 'Record active ongoing prescriptions vs past discontinued therapies (Modern & Ayurvedic) for CDSS safety analysis.'}
              </p>
            </div>

            {/* Sub-tab switcher: Current vs Previous */}
            <div className="flex items-center gap-1 bg-[#F1F6FC] p-1 rounded-2xl border border-[#DCE3EC]">
              <button
                type="button"
                onClick={() => setMedHistoryType('current')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  medHistoryType === 'current'
                    ? 'bg-[#0B4C8C] text-white shadow-2xs'
                    : 'text-[#5B677E] hover:text-[#16213A]'
                }`}
              >
                {currentLang === 'hi' ? `वर्तमान (${currentMedications.length})` : `Active (${currentMedications.length})`}
              </button>

              <button
                type="button"
                onClick={() => setMedHistoryType('previous')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  medHistoryType === 'previous'
                    ? 'bg-[#E2861E] text-white shadow-2xs'
                    : 'text-[#5B677E] hover:text-[#16213A]'
                }`}
              >
                {currentLang === 'hi' ? `पूर्व / बंद (${previousMedications.length})` : `Previous (${previousMedications.length})`}
              </button>
            </div>
          </div>

          {/* Add Medicine Bar */}
          <div className="space-y-3 bg-[#F8FAFC] p-4 rounded-2xl border border-[#DCE3EC]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs font-black text-[#16213A] uppercase tracking-wider">
                {medHistoryType === 'current'
                  ? (currentLang === 'hi' ? '+ वर्तमान चल रही दवा जोड़ें:' : '+ Add Active Ongoing Medication:')
                  : (currentLang === 'hi' ? '+ पूर्व में ली गई / बंद की गई दवा जोड़ें:' : '+ Add Past Discontinued Medication:')}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-bold">System:</span>
                <select
                  value={newMedSystem}
                  onChange={(e) => setNewMedSystem(e.target.value)}
                  className="bg-white border border-[#DCE3EC] rounded-lg text-xs font-bold px-2 py-1"
                >
                  <option value="ayurvedic">🌿 Ayurvedic</option>
                  <option value="allopathic">💊 Allopathic</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={newMedInput}
                onChange={(e) => setNewMedInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMedication()}
                placeholder={currentLang === 'hi' ? 'दवा का नाम लिखें (e.g. Warfarin 5mg, Metformin 500mg, Sutshekhar Ras)...' : 'Enter medicine name (e.g. Warfarin 5mg, Metformin, Sutshekhar Ras)...'}
                className="flex-1 bg-white border border-[#DCE3EC] rounded-xl h-11 px-4 text-xs font-bold focus:border-[#0B4C8C] w-full"
              />

              {medHistoryType === 'previous' && (
                <select
                  value={discontinueReason}
                  onChange={(e) => setDiscontinueReason(e.target.value)}
                  className="bg-white border border-red-300 text-red-950 rounded-xl h-11 px-3 text-xs font-bold shrink-0 w-full sm:w-auto"
                >
                  <option value="Course Completed (उपचार पूर्ण)">Course Completed (उपचार पूर्ण)</option>
                  <option value="Adverse Reaction / Gastritis (अम्लपित्त / एलर्जी)">Adverse Reaction / Gastritis</option>
                  <option value="Ineffective / No Relief (लाभ न होना)">Ineffective / No Relief</option>
                  <option value="Switched by Physician (चिकित्सक द्वारा बदली गई)">Switched by Physician</option>
                </select>
              )}

              <Button
                onClick={handleAddMedication}
                className={`h-11 px-5 text-xs font-extrabold rounded-xl shrink-0 w-full sm:w-auto flex items-center justify-center gap-1.5 text-white ${
                  medHistoryType === 'current' ? 'bg-[#0B4C8C] hover:bg-[#08355F]' : 'bg-[#E2861E] hover:bg-[#C2410C]'
                }`}
              >
                <Plus size={16} />
                <span>{currentLang === 'hi' ? 'जोड़ें' : 'Add'}</span>
              </Button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500 font-bold">{currentLang === 'hi' ? 'सुझाव:' : 'Quick:'}</span>
              {['Telmisartan 40mg', 'Metformin 500mg', 'Sutshekhar Ras 250mg', 'Avipattikar Churna 5g', 'Ashwagandha 500mg', 'Warfarin 5mg', 'Pantoprazole 40mg'].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setNewMedInput(preset);
                  }}
                  className="bg-white hover:bg-slate-100 border border-[#DCE3EC] text-[#16213A] px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Render List: Current Active */}
          {medHistoryType === 'current' && (
            <div className="space-y-2">
              <span className="text-xs font-black text-[#16213A] uppercase tracking-wider">
                {currentLang === 'hi' ? 'सक्रिय दवा सूची (Live API द्वारा जांची जाएगी):' : 'Active Medications (Monitored by Live CDSS):'}
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentMedications.map((med, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F5F9FF] border-2 border-[#DCE3EC] p-3.5 rounded-2xl flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Pill size={16} className="text-[#0B4C8C]" />
                      <div>
                        <span className="text-xs font-black text-[#16213A] block">{typeof med === 'string' ? med : med.name}</span>
                        <span className="text-[10px] text-emerald-700 font-bold">● Active Ongoing</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(idx, false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render List: Previous Discontinued */}
          {medHistoryType === 'previous' && (
            <div className="space-y-2">
              <span className="text-xs font-black text-[#16213A] uppercase tracking-wider">
                {currentLang === 'hi' ? 'पूर्व में ली गई दवाएं (कारण सहित):' : 'Past Discontinued Therapies (with Rationales):'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {previousMedications.map((med, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FFFDF9] border-2 border-[#FED7AA] p-3.5 rounded-2xl space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <History size={15} className="text-[#E2861E]" />
                        <span className="text-xs font-black text-[#16213A] line-through opacity-85">
                          {typeof med === 'string' ? med : med.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(idx, true)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="text-[11px] text-red-800 bg-red-50/70 p-1.5 rounded-lg border border-red-200">
                      <b>कारण (Reason):</b> {med.reason || 'Course Completed'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
