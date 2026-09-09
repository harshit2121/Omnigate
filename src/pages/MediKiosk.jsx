import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KioskLayout from '../components/kiosk/KioskLayout';
import KioskAttractMode from '../components/kiosk/KioskAttractMode';
import LanguageSelectionStep from '../components/kiosk/LanguageSelectionStep';
import AbhaConsentStep from '../components/kiosk/AbhaConsentStep';
import ConversationalIntakeStep from '../components/kiosk/ConversationalIntakeStep';
import AyushParikshaModule from '../components/kiosk/AyushParikshaModule';
import DocumentScannerStep from '../components/kiosk/DocumentScannerStep';
import SummaryConfirmationStep from '../components/kiosk/SummaryConfirmationStep';
import { SAMPLE_DOCUMENTS } from '../services/ocrService';
import { generateFhirCaseBundle } from '../services/fhirService';
import voiceAssistant from '../services/voiceAssistant';

export default function MediKiosk() {
  const navigate = useNavigate();

  // Accessibility State
  const [highContrast, setHighContrast] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentLang, setCurrentLang] = useState('hi'); // 'hi' | 'en' | 'sa' | 'mr' | 'gu' | 'bn'
  const [fontSize, setFontSize] = useState('base'); // 'base' | 'lg' | 'xl'
  const [redFlagAlert, setRedFlagAlert] = useState(null);

  // Kiosk Multi-step Flow State (6 steps total)
  const [isStarted, setIsStarted] = useState(false); // If false, shows dual-video attract screen
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tokenNumber, setTokenNumber] = useState('AYU-104');

  // Intake Clinical Data State - Clean Real Patient Initialization
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    hhid: '',
    abhaId: '',
    phone: '',
    city: '',
    consent: false
  });

  const [intakeData, setIntakeData] = useState({
    complaintId: null,
    complaintLabel: '',
    complaintLabelHi: '',
    clinicalMode: 'ayush',
    answers: {}
  });

  const [parikshaData, setParikshaData] = useState({
    prakritiAnswers: {},
    prakritiResult: {
      vataPct: 0,
      pittaPct: 0,
      kaphaPct: 0,
      dominant: 'निर्धारित नहीं (Pending Assessment)'
    },
    agni: '',
    koshtha: '',
    ashtavidha: {},
    aharaVihara: {}
  });

  const [ocrDocuments, setOcrDocuments] = useState([]);

  // Spoken welcome on mount
  useEffect(() => {
    if (voiceEnabled) {
      voiceAssistant.speak(
        currentLang === 'hi'
          ? 'आयुष मेडी-कियोस्क में आपका स्वागत है। कृपया पंजीकरण के लिए स्क्रीन पर स्पर्श करें।'
          : 'Welcome to the Ayush MediKiosk. Please tap on the screen to begin registration.',
        { lang: currentLang === 'hi' ? 'hi-IN' : 'en-IN' }
      );
    }
  }, []);

  // Handle Real-Time AI NLP Extracted Symptoms from Ayush Sakhi
  const handleAiParsedIntent = (nlpResult) => {
    if (!nlpResult || !nlpResult.understood) return;

    setIntakeData(prev => ({
      ...prev,
      complaintId: nlpResult.complaintId,
      complaintLabel: nlpResult.complaintLabel,
      complaintLabelHi: nlpResult.complaintLabelHi,
      answers: {
        ...prev.answers,
        ...(nlpResult.extractedFields || {})
      }
    }));

    if (nlpResult.doshaAffiliation) {
      if (nlpResult.doshaAffiliation.includes('Pitta')) {
        setParikshaData(prev => ({
          ...prev,
          prakritiResult: {
            vataPct: 30,
            pittaPct: 60,
            kaphaPct: 10,
            dominant: 'Pitta-Vata Prakriti (Amlapitta & Daha Prone)'
          },
          agni: 'tikshna'
        }));
      } else if (nlpResult.doshaAffiliation.includes('Vata')) {
        setParikshaData(prev => ({
          ...prev,
          prakritiResult: {
            vataPct: 65,
            pittaPct: 25,
            kaphaPct: 10,
            dominant: 'Vataja Prakriti (Sandhivata & Shoola Prone)'
          },
          agni: 'vishama'
        }));
      }
    }

    if (nlpResult.isRedFlag && nlpResult.redFlagDetail) {
      setRedFlagAlert(nlpResult.redFlagDetail);
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
      voiceAssistant.playAudioCue('beep');
    } else {
      handleSubmitCase();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      voiceAssistant.playAudioCue('beep');
    } else {
      handleRestartKiosk();
    }
  };

  const handleSubmitCase = () => {
    setIsSubmitted(true);
    const newToken = `AYU-${Math.floor(100 + Math.random() * 900)}`;
    setTokenNumber(newToken);

    // Save to localStorage for Physician OPD room live consumption
    const fhirBundle = generateFhirCaseBundle({
      patient: patientData,
      intakeData,
      parikshaData,
      ocrDocuments
    });

    const newCase = {
      token: newToken,
      id: `case-${Date.now()}`,
      timestamp: new Date().toISOString(),
      patient: patientData,
      intake: intakeData,
      pariksha: parikshaData,
      documents: ocrDocuments,
      fhirBundle,
      status: redFlagAlert ? 'EMERGENCY_PRIORITY' : 'WAITING_OPD',
      redFlag: redFlagAlert
    };

    const existingQueue = JSON.parse(localStorage.getItem('ayush_opd_queue') || '[]');
    localStorage.setItem('ayush_opd_queue', JSON.stringify([newCase, ...existingQueue]));

    voiceAssistant.playAudioCue('success');
    if (voiceEnabled) {
      voiceAssistant.speak(
        currentLang === 'hi'
          ? `आपका केस सफलतापूर्वक जमा हो गया है। आपका टोकन नंबर है ${newToken}।`
          : `Case intake registered. Your consultation token is ${newToken}.`
      );
    }
  };

  const getStepTitles = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Select Language / भाषा चयन',
          titleHi: 'अपनी पसंदीदा भाषा चुनें • Select Language'
        };
      case 2:
        return {
          title: 'Patient Identification & ABHA Consent',
          titleHi: 'मरीज पहचान, आभा (ABHA) व डेटा सुरक्षा सहमति'
        };
      case 3:
        return {
          title: 'Chief Presenting Complaint (Multimodal Intake)',
          titleHi: 'मुख्य शिकायत एवं लक्षण विश्लेषण (SOCRATES)'
        };
      case 4:
        return {
          title: 'Ayurvedic Clinical Pariksha (Dashavidha / Ashtavidha)',
          titleHi: 'आयुर्वेदिक दशविध एवं अष्टविध परीक्षा'
        };
      case 5:
        return {
          title: 'Medical Document Digitization & Timeline',
          titleHi: 'पुराने पर्चे, लैब रिपोर्ट एवं मेडिकल टाइमलाइन'
        };
      case 6:
        return {
          title: 'OPD Token Receipt & Summary',
          titleHi: 'ओपीडी टोकन पर्ची एवं सारांश'
        };
      default:
        return { title: '', titleHi: '' };
    }
  };

  const { title, titleHi } = getStepTitles();

  const handleStartKiosk = () => {
    setIsStarted(true);
    setCurrentStep(1); // Goes directly to Language Selection Step
    setIsSubmitted(false);
  };

  const handleRestartKiosk = () => {
    setIsStarted(false);
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  // 1. If not started, show the pure full-screen dual-video loop Attract Screen with "Tap to Register"
  if (!isStarted) {
    return (
      <div className="w-full h-screen overflow-hidden bg-black">
        <KioskAttractMode
          onStart={handleStartKiosk}
          currentLang={currentLang}
          setCurrentLang={setCurrentLang}
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
        />
      </div>
    );
  }

  // 2. Otherwise render the Multi-Step Touch Registration Interface (6 steps)
  return (
    <KioskLayout
      currentStep={currentStep}
      totalSteps={6}
      stepTitle={title}
      stepTitleHi={titleHi}
      onPrev={handlePrev}
      onNext={handleNext}
      canGoNext={currentStep === 1 || (currentStep === 2 ? Boolean(patientData.consent && patientData.name) : true)}
      highContrast={highContrast}
      setHighContrast={setHighContrast}
      voiceEnabled={voiceEnabled}
      setVoiceEnabled={setVoiceEnabled}
      currentLang={currentLang}
      setCurrentLang={setCurrentLang}
      fontSize={fontSize}
      setFontSize={setFontSize}
      redFlagAlert={redFlagAlert}
      onAiParsedIntent={handleAiParsedIntent}
      patientData={patientData}
      intakeData={intakeData}
      onResetKiosk={handleRestartKiosk}
    >
      {/* STEP 1: MULTILINGUAL LANGUAGE SELECTION */}
      {currentStep === 1 && (
        <LanguageSelectionStep
          currentLang={currentLang}
          setCurrentLang={setCurrentLang}
          onLanguageSelected={(selectedLang) => {
            setCurrentStep(2); // Smoothly moves to Patient Details
          }}
          voiceEnabled={voiceEnabled}
        />
      )}

      {/* STEP 2: PATIENT IDENTIFICATION & ABHA CONSENT */}
      {currentStep === 2 && (
        <AbhaConsentStep
          patientData={patientData}
          setPatientData={setPatientData}
          currentLang={currentLang}
          voiceEnabled={voiceEnabled}
        />
      )}

      {/* STEP 3: CHIEF COMPLAINT (SOCRATES ONE-QUESTION AT A TIME) */}
      {currentStep === 3 && (
        <ConversationalIntakeStep
          intakeData={intakeData}
          setIntakeData={setIntakeData}
          currentLang={currentLang}
          voiceEnabled={voiceEnabled}
          onRedFlagDetected={(flag) => setRedFlagAlert(flag)}
        />
      )}

      {/* STEP 4: AYUSH DASHAVIDHA / PRAKRITI PARIKSHA */}
      {currentStep === 4 && (
        <AyushParikshaModule
          parikshaData={parikshaData}
          setParikshaData={setParikshaData}
          currentLang={currentLang}
          voiceEnabled={voiceEnabled}
          patientData={patientData}
        />
      )}

      {/* STEP 5: DOCUMENT SCANNER & OCR */}
      {currentStep === 5 && (
        <DocumentScannerStep
          ocrDocuments={ocrDocuments}
          setOcrDocuments={setOcrDocuments}
          currentLang={currentLang}
          voiceEnabled={voiceEnabled}
        />
      )}

      {/* STEP 6: SUMMARY REVIEW & TOKEN PRINT */}
      {currentStep === 6 && (
        <SummaryConfirmationStep
          patientData={patientData}
          intakeData={intakeData}
          parikshaData={parikshaData}
          ocrDocuments={ocrDocuments}
          currentLang={currentLang}
          voiceEnabled={voiceEnabled}
          isSubmitted={isSubmitted}
          tokenNumber={tokenNumber}
          onFinishKiosk={handleRestartKiosk}
        />
      )}
    </KioskLayout>
  );
}

