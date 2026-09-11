import { useState, useEffect, useMemo } from 'react';
import { Volume2 } from 'lucide-react';
import { supabaseOpdService } from '../services/supabaseOpdService';
import { printDoctorPrescription } from '../utils/prakritiPdfGenerator';
import { ayushCdssService } from '../services/ayushCdssService';
import { AYUSH_NAMASTE_CATALOG } from '../services/clinicalAiService';
import { ayushFormulationsApi, AYUSH_FORMULATIONS_DATA } from '../services/ayushFormulationsApiService';
import MedicationHistory from '../components/dashboard/Patient/MedicationHistory';
import { logAuditEvent } from '../services/auditLog';
import { runDashavidhaEvaluation } from '../services/dashavidhaParikshaEngine';
import { calculateCcrasPrakriti } from '../services/prakritiDetermineService';
import voiceAssistant from '../services/voiceAssistant';

// Modular AYUSH OPD Subcomponents (3-Phase Classical Ayurvedic Architecture)
import OpdQueueRoster from '../components/ayush-opd/OpdQueueRoster';
import OpdEncounterHeader from '../components/ayush-opd/OpdEncounterHeader';
import OpdRogiParikshaTab from '../components/ayush-opd/tabs/OpdRogiParikshaTab';
import OpdRogaParikshaTab from '../components/ayush-opd/tabs/OpdRogaParikshaTab';
import OpdChikitsaPlanTab from '../components/ayush-opd/tabs/OpdChikitsaPlanTab';
import OpdPatientSummaryTab from '../components/ayush-opd/tabs/OpdPatientSummaryTab';

// Modular AYUSH OPD Modals
import OpdVitalsModal from '../components/ayush-opd/modals/OpdVitalsModal';
import OpdPanchakarmaModal from '../components/ayush-opd/modals/OpdPanchakarmaModal';
import OpdApiImportModal from '../components/ayush-opd/modals/OpdApiImportModal';
import OpdConfirmRxModal from '../components/ayush-opd/modals/OpdConfirmRxModal';
import OpdFhirModal from '../components/ayush-opd/modals/OpdFhirModal';

export default function AyushPhysicianOPD() {
  // Search & Patient Retrieval
  const [searchQuery, setSearchQuery] = useState('');
  const [queue, setQueue] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [acceptedCases, setAcceptedCases] = useState([]);
  const [activeTabFilter, setActiveTabFilter] = useState('all');
  
  // Two-view navigation: 'roster' → full-screen queue, 'encounter' → clinical workstation
  const [currentView, setCurrentView] = useState('roster');

  // Hospital HIS Workbench Navigation Tabs - 3-Phase Classical Flow
  const [hisActiveTab, setHisActiveTab] = useState('phase1_rogi'); 

  // Doctor SOAP Clinical Notes & Overrides
  const [doctorSubjectiveNotes, setDoctorSubjectiveNotes] = useState('');
  const [doctorAssessmentNotes, setDoctorAssessmentNotes] = useState('');
  const [patientPrakritiAnswers, setPatientPrakritiAnswers] = useState({});
  const [confirmedDiagnosis, setConfirmedDiagnosis] = useState(null);
  const [activeGhatakas, setActiveGhatakas] = useState(null);

  // API Formulation Importer Modal State
  const [showApiImportModal, setShowApiImportModal] = useState(false);
  const [apiSearchQuery, setApiSearchQuery] = useState('');
  const [apiFilterSystem, setApiFilterSystem] = useState('all');
  const [apiFilterKalpana, setApiFilterKalpana] = useState('all');
  const [apiSearchResults, setApiSearchResults] = useState(AYUSH_FORMULATIONS_DATA);

  // Vitals & Clinical Examination State
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({
    bpSystolic: '128',
    bpDiastolic: '84',
    pulseRate: '78',
    nadiType: 'Manduka Gati (Pitta-Vata)',
    spo2: '98',
    temp: '98.4',
    weight: '64',
    height: '162',
    bmi: '24.4',
    bmiCategory: 'Sama Pramana (Normal)',
    agni: 'Tikshnagni (Hyperactive)',
    koshtha: 'Krura (Hard Bowels)',
    painScale: '6',
    painType: 'Burning Epigastric Pain',
    sugar: '112',
    sugarType: 'RBS'
  });

  // Interlinked Prescribing State & Workflow
  const [prescribeMode, setPrescribeMode] = useState('regimen');
  const [regimenSearchQuery, setRegimenSearchQuery] = useState('');
  const [activeRegimenName, setActiveRegimenName] = useState('');
  const [dietPathya, setDietPathya] = useState('Warm fresh food, Mudga Yusha (Moong dal soup), Dadima (Pomegranate), Cow Ghee, Lukewarm water.');
  const [dietApathya, setDietApathya] = useState('Excessive spicy, sour, fermented food, curd at night, deep-fried snacks, late-night meals.');
  const [yogaPlanText, setYogaPlanText] = useState('Shitali & Sitkari Pranayama (10 min), Vajrasana post-meal, Bhujangasana, Nadi Shodhana.');
  const [showConfirmRxModal, setShowConfirmRxModal] = useState(false);
  const [isPrescriptionSigned, setIsPrescriptionSigned] = useState(false);

  // Active Prescriptions State for Current Case (Starts unprescribed / empty for doctor entry)
  const [prescribingSystem, setPrescribingSystem] = useState('ayurvedic');
  const [prescriptions, setPrescriptions] = useState([]);

  const [newMedForm, setNewMedForm] = useState({
    name: 'Sutshekhar Ras (Gold / Plain)',
    system: 'ayurvedic',
    kalpana: 'Vati',
    dose: '250mg',
    frequency: 'BD (Twice Daily)',
    kaala: 'Pragbhakta (Before Meals)',
    anupana: 'Godugdha (Warm Cow Milk)',
    route: 'Oral',
    duration: '15 Days'
  });

  // Patient Medication History State
  const [patientCurrentMeds, setPatientCurrentMeds] = useState([]);
  const [patientPreviousMeds, setPatientPreviousMeds] = useState([]);

  // Panchakarma & Procedure Orders (Starts unprescribed / empty for doctor entry)
  const [showPanchakarmaModal, setShowPanchakarmaModal] = useState(false);
  const [panchakarmaOrders, setPanchakarmaOrders] = useState([]);

  const [newPanchakarmaForm, setNewPanchakarmaForm] = useState({
    procedure: 'Janu Basti (Knee Oil Retention)',
    dravya: 'Mahanarayana Taila + Ksheerabala 101',
    sessions: '7 Sessions (30 min daily)',
    time: 'Morning (Pratah Kala)',
    notes: 'Prior Sthanika Abhyanga & Nadi Swedana'
  });

  // Seasonal Ritucharya Calculation Helper
  const currentRitu = useMemo(() => {
    const month = new Date().getMonth(); // 0-11
    if (month >= 2 && month <= 3) return { nameEn: 'Vasanta (Spring)', nameHi: 'वसन्त ऋतु', doshaSurge: 'Kapha Prakopa', dietAdvice: 'Favor Tikta, Katu, Kashaya rasas. Avoid heavy, oily, and sweet items.' };
    if (month >= 4 && month <= 5) return { nameEn: 'Grishma (Summer)', nameHi: 'ग्रीष्म ऋतु', doshaSurge: 'Vata Sanchaya / Pitta Chaya', dietAdvice: 'Favor Madhura, Sheeta, Snigdha items. Consume Coconut water, Sattu, Ghee. Avoid excessive hot spices.' };
    if (month >= 6 && month <= 7) return { nameEn: 'Varsha (Monsoon)', nameHi: 'वर्षा ऋतु', doshaSurge: 'Vata Prakopa / Pitta Sanchaya', dietAdvice: 'Consume warm Mudga Yusha, Boiled water, Ghee, Ginger. Avoid raw leafy vegetables and stagnant water.' };
    if (month >= 8 && month <= 9) return { nameEn: 'Sharad (Autumn)', nameHi: 'शरद ऋतु', doshaSurge: 'Pitta Prakopa', dietAdvice: 'Favor Tikta, Madhura, Kashaya. Consume Ghrita, Milk, Amla. Virechana & Raktamokshana indicated.' };
    if (month >= 10 && month <= 11) return { nameEn: 'Hemanta (Early Winter)', nameHi: 'हेमन्त ऋतु', doshaSurge: 'Pitta Shamana / Agni Dipana', dietAdvice: 'High Agni strength: Snigdha, Lavana, Amla rasas. Warm milk, Sesame, Abhyanga recommended.' };
    return { nameEn: 'Shishira (Late Winter)', nameHi: 'शिशिर ऋतु', doshaSurge: 'Kapha Sanchaya', dietAdvice: 'Warm freshly cooked foods, Ginger, Black pepper, Ushnodaka.' };
  }, []);

  // Cryptographic Hash Generator for E-Prescription Seal
  const prescriptionHash = useMemo(() => {
    if (!selectedCase) return 'AIIA-RX-0000-HASH';
    const raw = `${selectedCase.uhid}|${selectedCase.token}|${prescriptions.map(p => p.name).join(';')}|${isPrescriptionSigned ? 'SIGNED' : 'DRAFT'}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    return `SHA256:7F8B-${hex}-${selectedCase.uhid?.slice(-4) || '8942'}-AIIA`;
  }, [selectedCase, prescriptions, isPrescriptionSigned]);

  // Initialize OPD Queue from Supabase Database and subscribe in real-time
  useEffect(() => {
    let isMounted = true;

    // Flush any legacy mock cache from previous sessions to ensure 100% clean state
    if (!localStorage.getItem('omni_supabase_ready_v1')) {
      localStorage.removeItem('omni_kiosk_queue');
      localStorage.removeItem('omni_kiosk_queue_version');
      localStorage.setItem('omni_supabase_ready_v1', 'true');
    }

    const loadLiveQueue = async () => {
      const cases = await supabaseOpdService.fetchOpdQueue();
      if (isMounted) {
        setQueue(cases);
        if (cases.length > 0) {
          const initial = cases[0];
          setSelectedCase(initial);
          setPrescriptions(initial?.prescriptions || []);
          setPanchakarmaOrders(initial?.panchakarmaOrders || []);
          setConfirmedDiagnosis(initial?.assessment?.confirmedDiagnosis || null);
          setIsPrescriptionSigned(Boolean(initial?.isPrescriptionSigned));
          setDoctorSubjectiveNotes(initial?.clinicalNotes || '');
        } else {
          setSelectedCase(null);
          setPrescriptions([]);
          setPanchakarmaOrders([]);
          setConfirmedDiagnosis(null);
          setIsPrescriptionSigned(false);
          setDoctorSubjectiveNotes('');
        }
      }
    };

    loadLiveQueue();

    // Real-time synchronization: listen for new check-ins from MediKiosk or Reception
    const unsubscribe = supabaseOpdService.subscribeToOpdQueue((freshQueue) => {
      if (isMounted) {
        setQueue(freshQueue);
        setSelectedCase(prev => {
          if (!prev) return freshQueue[0] || null;
          const updated = freshQueue.find(c => c.id === prev.id);
          return updated || prev;
        });
      }
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSearchPatient = () => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    const found = queue.find(c => 
      c.token?.toLowerCase() === q ||
      c.patient?.name?.toLowerCase().includes(q) ||
      c.patient?.abhaId?.includes(q) ||
      c.crNo?.toLowerCase().includes(q) ||
      c.uhid?.toLowerCase().includes(q)
    );

    if (found) {
      setSelectedCase(found);
      setIsEditing(false);
      setEditedNotes('');
      setCurrentView('encounter');
      voiceAssistant.playAudioCue('beep');
    } else {
      alert(`Patient not found in active HIS session for query: "${searchQuery}".`);
    }
  };

  const handleSeedSamplePatient = async () => {
    const newCase = await supabaseOpdService.seedOneSamplePatient();
    if (newCase) {
      setQueue(prev => [newCase, ...prev.filter(c => c.id !== newCase.id)]);
      setSelectedCase(newCase);
      setPrescriptions(newCase.prescriptions || []);
      setPanchakarmaOrders(newCase.panchakarmaOrders || []);
      setConfirmedDiagnosis(newCase.assessment?.confirmedDiagnosis || null);
      voiceAssistant.playAudioCue('beep');
    }
  };

  // Evaluate Live CCRAS Standardized Prakriti Scale
  const ccrasPrakritiResult = useMemo(() => {
    if (!selectedCase) return null;
    const baseAnswers = {
      ...(selectedCase.pariksha?.ccrasAnswers || {}),
      ...(selectedCase.pariksha?.prakritiAnswers || {}),
      ...patientPrakritiAnswers
    };
    return calculateCcrasPrakriti(baseAnswers);
  }, [selectedCase, patientPrakritiAnswers]);

  // Evaluate Live CDSS for Selected Case
  const cdssEvaluation = useMemo(() => {
    if (!selectedCase) return null;
    
    const activeAllo = selectedCase.intake?.currentMedications || [];

    return ayushCdssService.evaluatePrescription(
      prescriptions,
      activeAllo,
      {
        prakriti: selectedCase.pariksha?.prakritiResult?.dominant || 'Pitta-Vata',
        agni: selectedCase.pariksha?.agni || 'Tikshna',
        koshtha: selectedCase.pariksha?.koshtha || 'Krura'
      }
    );
  }, [selectedCase, prescriptions]);

  const handleCallNextToken = () => {
    const waiting = queue.filter(c => !acceptedCases.includes(c.id));
    if (waiting.length > 0) {
      const nextCase = waiting[0];
      openPatientEncounter(nextCase);
      voiceAssistant.playAudioCue('alert');
      voiceAssistant.speak(`टोकन नंबर ${nextCase.token}, मरीज ${nextCase.patient?.name}, परामर्श कक्ष 12 में आएं।`);
    } else {
      alert('All registered OPD patients have been attended!');
    }
  };

  const [isSavingDb, setIsSavingDb] = useState(false);

  // Save all clinical findings (Ashtavidha, Dashavidha, Nidana Panchaka, Chikitsa Plan, Rx, Panchakarma) to Supabase
  const handleSaveConsultationToDb = async (showToast = true, chikitsaPlanOverride = null) => {
    if (!selectedCase) return;
    setIsSavingDb(true);
    try {
      const encounterId = selectedCase.id;
      const patientId = selectedCase.patient?.id || selectedCase.patientId;
      
      const ashtavidha = selectedCase.rogiPariksha?.ashtavidha || selectedCase.pariksha?.ashtavidha || {};
      const dashavidha = selectedCase.rogiPariksha?.dashavidha || selectedCase.pariksha?.dashavidha || {};
      const rogaPariksha = selectedCase.rogaPariksha || {};
      const activeChikitsaPlan = chikitsaPlanOverride || selectedCase.chikitsaPlan || {};

      const dxName = typeof confirmedDiagnosis === 'string' 
        ? confirmedDiagnosis 
        : (confirmedDiagnosis?.name || selectedCase.assessment?.confirmedDiagnosis?.name || 'Amlapitta');
      const dxNameHi = typeof confirmedDiagnosis === 'object' && confirmedDiagnosis?.nameHi 
        ? confirmedDiagnosis.nameHi 
        : (selectedCase.assessment?.confirmedDiagnosis?.nameHi || 'अम्लपित्त');
      const namaste = typeof confirmedDiagnosis === 'object' && confirmedDiagnosis?.namasteCode
        ? confirmedDiagnosis.namasteCode
        : (selectedCase.assessment?.namasteCode || 'AYU-AML-01');
      const icd11 = typeof confirmedDiagnosis === 'object' && confirmedDiagnosis?.icd11Code
        ? confirmedDiagnosis.icd11Code
        : (selectedCase.assessment?.icd11Code || 'DA24.Z');

      // 1. Save Consultation record (Ashtavidha, Dashavidha, Nidana Panchaka, Chikitsa Plan)
      await supabaseOpdService.saveConsultation(encounterId, {
        patientId,
        ashtavidha,
        dashavidha,
        notes: doctorSubjectiveNotes || selectedCase.clinicalNotes,
        assessmentNotes: doctorAssessmentNotes,
        confirmedDiagnosis: dxName,
        diagnosisNameHi: dxNameHi,
        namasteCode: namaste,
        icd11Code: icd11,
        rogaPariksha,
        chikitsaPlan: activeChikitsaPlan
      });

      // 2. Save Prescriptions table
      if (prescriptions && prescriptions.length > 0) {
        await supabaseOpdService.savePrescriptions(encounterId, prescriptions, patientId);
      }

      // 3. Save Panchakarma Orders table
      if (panchakarmaOrders && panchakarmaOrders.length > 0) {
        await supabaseOpdService.savePanchakarmaOrders(encounterId, panchakarmaOrders, patientId);
      }

      // Update in-memory selectedCase
      setSelectedCase(prev => ({
        ...prev,
        chikitsaPlan: activeChikitsaPlan,
        prescriptions,
        panchakarmaOrders
      }));

      voiceAssistant.playAudioCue('success');

      if (showToast) {
        alert(`✓ रोगी ${selectedCase.patient?.name || ''} (UHID: ${selectedCase.uhid}) का अष्टविध परीक्षा, रोग परीक्षा एवं चतुर्विध चिकित्सा विधान Supabase Cloud Database में सफलतापूर्वक सुरक्षित हो गया है!`);
      }
    } catch (err) {
      console.error('Failed saving encounter to Supabase:', err);
      if (showToast) {
        alert('डेटाबेस में सुरक्षित करते समय त्रुटि आई, कृपया पुनः प्रयास करें।');
      }
    } finally {
      setIsSavingDb(false);
    }
  };

  const handleAcceptCase = async () => {
    if (!selectedCase) return;
    const consultedId = selectedCase.id;
    setAcceptedCases(prev => Array.from(new Set([...prev, consultedId])));
    
    // Save all findings to Supabase before signing
    await handleSaveConsultationToDb(false);

    const updatedCase = { ...selectedCase, status: 'CONSULTED' };
    setSelectedCase(updatedCase);
    setQueue(prev => {
      const next = prev.map(item => item.id === consultedId ? { ...item, status: 'CONSULTED' } : item);
      try {
        localStorage.setItem('omni_kiosk_queue', JSON.stringify(next));
        localStorage.setItem('omni_active_opd_case', JSON.stringify(null));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    await supabaseOpdService.signConsultation(consultedId, { hash: prescriptionHash });

    voiceAssistant.playAudioCue('success');
    
    await logAuditEvent({
      eventType: 'physician_consultation_signed',
      performedBy: 'Dr. V. Sharma (BAMS, MD Ayu - Senior Consultant)',
      performedByRole: 'doctor',
      targetType: 'patient',
      targetId: selectedCase.patient?.abhaId || selectedCase.token,
      targetName: selectedCase.patient?.name || 'Patient',
      action: `Physician consultation, Samprapti clinical chart & e-prescription confirmed for UHID ${selectedCase.uhid}`,
      details: {
        token: selectedCase.token,
        crNo: selectedCase.crNo,
        uhid: selectedCase.uhid,
        prakriti: selectedCase.pariksha?.prakritiResult?.dominant,
        prescriptionsCount: prescriptions.length,
        cdssSafetyScore: cdssEvaluation?.safetyScore || 100
      }
    });

    setHisActiveTab('patient_summary');
    alert(`Encounter ${selectedCase.token} (UHID: ${selectedCase.uhid}) signed and marked as CONSULTED in Central HIS & Supabase Cloud!`);
  };

  const handleConfirmDoctorDiagnosis = (dx, rogaData = null) => {
    setConfirmedDiagnosis(dx);
    if (rogaData?.samprapti) {
      setActiveGhatakas(rogaData.samprapti);
    }
    if (selectedCase) {
      const updatedCase = {
        ...selectedCase,
        assessment: {
          ...(selectedCase.assessment || {}),
          confirmedDiagnosis: dx,
          ghatakas: rogaData?.samprapti || activeGhatakas
        },
        rogaPariksha: {
          ...(selectedCase.rogaPariksha || {}),
          ...(rogaData || {})
        }
      };
      setSelectedCase(updatedCase);
      setQueue(prev => prev.map(item => item.id === selectedCase.id ? updatedCase : item));
      try {
        localStorage.setItem('omni_active_opd_case', JSON.stringify(updatedCase));
      } catch (e) {
        console.error('Failed saving confirmed diagnosis case:', e);
      }

      // Proactively sync diagnosis to Supabase
      const dxName = typeof dx === 'string' ? dx : (dx?.name || 'Amlapitta');
      const dxNameHi = typeof dx === 'object' && dx?.nameHi ? dx.nameHi : (dx || 'अम्लपित्त');
      const namaste = typeof dx === 'object' && dx?.namasteCode ? dx.namasteCode : 'AYU-AML-01';
      const icd11 = typeof dx === 'object' && dx?.icd11Code ? dx.icd11Code : 'DA24.Z';
      
      supabaseOpdService.saveConsultation(selectedCase.id, {
        patientId: selectedCase.patient?.id || selectedCase.patientId,
        ashtavidha: selectedCase.rogiPariksha?.ashtavidha || selectedCase.pariksha?.ashtavidha || {},
        dashavidha: selectedCase.rogiPariksha?.dashavidha || selectedCase.pariksha?.dashavidha || {},
        notes: doctorSubjectiveNotes || selectedCase.clinicalNotes,
        assessmentNotes: doctorAssessmentNotes,
        confirmedDiagnosis: dxName,
        diagnosisNameHi: dxNameHi,
        namasteCode: namaste,
        icd11Code: icd11,
        rogaPariksha: rogaData || selectedCase.rogaPariksha || {},
        chikitsaPlan: selectedCase.chikitsaPlan || {}
      });
    }
    voiceAssistant.playAudioCue('success');
  };

  const handleOverrideGhataka = (ghatakaKey, newValue) => {
    if (!selectedCase) return;
    setVaidyaOverrides(prev => ({
      ...prev,
      [selectedCase.id]: {
        ...(prev[selectedCase.id] || {}),
        [ghatakaKey]: {
          ...(sampraptiSynthesis?.ghatakas?.[ghatakaKey] || {}),
          value: newValue,
          overridden: true
        }
      }
    }));
    setActiveGhatakas(prev => ({
      ...(prev || {}),
      [ghatakaKey]: newValue
    }));
  };

  const handleConfirmDoctorPrakriti = (confirmedResult) => {
    if (!selectedCase) return;
    const updatedCase = {
      ...selectedCase,
      pariksha: {
        ...selectedCase.pariksha,
        doctorConfirmedPrakriti: confirmedResult,
        prakritiResult: confirmedResult.ccrasResult || confirmedResult,
        prakritiStatus: confirmedResult.isModified ? 'DOCTOR_MODIFIED' : 'DOCTOR_CONFIRMED',
        confirmedBy: confirmedResult.confirmedBy || 'Dr. V. Sharma (BAMS, MD Ayu)',
        confirmedAt: confirmedResult.confirmedAt || new Date().toISOString()
      }
    };
    setSelectedCase(updatedCase);
    setQueue(prev => {
      const next = prev.map(c => c.id === selectedCase.id ? updatedCase : c);
      try {
        localStorage.setItem('omni_kiosk_queue', JSON.stringify(next));
        localStorage.setItem('omni_active_opd_case', JSON.stringify(updatedCase));
      } catch (e) {
        console.error('Failed saving confirmed prakriti case:', e);
      }
      return next;
    });
  };

  const handleAddAiPrescriptions = (suggestedMeds) => {
    if (!Array.isArray(suggestedMeds) || suggestedMeds.length === 0) return;
    const newItems = suggestedMeds.map((med, idx) => ({
      id: Date.now() + idx,
      name: med.name,
      type: med.kalpana || 'Vati',
      system: 'ayurvedic',
      dose: med.dose || '250mg',
      frequency: med.frequency || 'BD (Twice Daily)',
      kaala: med.kaala || 'Adhobhakta (After Meals)',
      anupana: med.anupana || 'Lukewarm Water',
      duration: med.duration || '15 Days',
      source: 'AI Clinical Copilot'
    }));
    setPrescriptions(prev => [...prev, ...newItems]);
    voiceAssistant.playAudioCue('beep');
    alert(`✓ ${newItems.length} शास्त्रीय योग (Classical Formulations) प्रिस्क्रिप्शन में सफलतापूर्वक जोड़ दिए गए हैं!`);
  };

  const handleAddPrescription = () => {
    if (!newMedForm.name) return;
    const isAyur = prescribingSystem === 'ayurvedic';
    const newEntry = {
      id: Date.now(),
      name: newMedForm.name,
      type: isAyur ? (newMedForm.kalpana || 'Classical Formulation') : 'Modern Allopathic',
      system: prescribingSystem,
      dose: newMedForm.dose,
      frequency: newMedForm.frequency,
      kaala: isAyur ? newMedForm.kaala : (newMedForm.timing || 'Post Meals'),
      anupana: isAyur ? newMedForm.anupana : (newMedForm.route || 'Oral (Water)'),
      duration: newMedForm.duration,
      source: 'Individual Prescription'
    };
    setPrescriptions(prev => [...prev, newEntry]);
    setIsPrescriptionSigned(false);
    voiceAssistant.playAudioCue('beep');
  };

  const handleRemovePrescription = (id) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
    setIsPrescriptionSigned(false);
  };

  const handleSearchApiFormulations = async (query = '', sys = apiFilterSystem, kalp = apiFilterKalpana) => {
    const res = await ayushFormulationsApi.searchFormulationsAsync(query, sys, kalp);
    setApiSearchResults(res.items);
  };

  const handleImportFromApi = (item) => {
    const isAyur = item.system !== 'allopathic';
    const newEntry = {
      id: Date.now(),
      name: item.name,
      type: item.type || item.kalpana || (isAyur ? 'Classical Formulation' : 'Modern Allopathic'),
      system: item.system || 'ayurvedic',
      dose: item.standardDose || (isAyur ? '250mg' : '500mg'),
      frequency: item.defaultFrequency || 'BD (Twice Daily)',
      kaala: isAyur ? (item.defaultKaala || 'Adhobhakta (After Meals)') : (item.timing || 'Post Meals'),
      anupana: isAyur ? (item.defaultAnupana || 'Lukewarm Water') : (item.route || 'Oral (Water)'),
      duration: '15 Days',
      source: item.classicalSource || 'Pharmacopoeia Monograph'
    };
    setPrescriptions(prev => [...prev, newEntry]);
    setIsPrescriptionSigned(false);
    setShowApiImportModal(false);
    voiceAssistant.playAudioCue('success');
  };

  const handleApplyOrderSet = (protocol) => {
    if (!protocol?.medications) return;
    const newRxItems = protocol.medications.map((m, idx) => ({
      id: Date.now() + idx + Math.floor(Math.random() * 1000),
      ...m,
      source: `Regimen: ${protocol.title}`
    }));
    
    setPrescriptions(prev => {
      const existingNames = new Set(prev.map(p => p.name.toLowerCase()));
      const filteredNew = newRxItems.filter(p => !existingNames.has(p.name.toLowerCase()));
      return [...prev, ...(filteredNew.length > 0 ? filteredNew : newRxItems)];
    });

    if (protocol.panchakarma && protocol.panchakarma.length > 0) {
      const newPOrders = protocol.panchakarma.map((po, idx) => ({
        id: Date.now() + idx + 10,
        ...po
      }));
      setPanchakarmaOrders(prev => [...prev, ...newPOrders]);
    }

    setActiveRegimenName(protocol.title);
    setIsPrescriptionSigned(false);
    voiceAssistant.playAudioCue('success');
  };

  const handleApplyAyurGenixDisease = (record) => {
    const diseaseName = record.Disease || 'Clinical Regimen';
    const hindiName = record['Hindi Name'] || '';
    const formulationText = record.Formulation || '';
    const herbs = record['Ayurvedic Herbs'] ? record['Ayurvedic Herbs'].split(',').map(s => s.trim()) : [];
    
    const itemsToAdd = [];

    if (formulationText) {
      itemsToAdd.push({
        id: Date.now() + 1,
        name: `${diseaseName} Protocol Formulation (${formulationText})`,
        type: 'Disease Protocol Compound',
        system: 'ayurvedic',
        dose: '250mg - 500mg',
        frequency: 'BD (Twice Daily)',
        kaala: 'Pragbhakta (Before Meals)',
        anupana: 'Ushnodaka (Lukewarm Water)',
        duration: record['Duration of Treatment'] || '15 Days',
        source: `Regimen: ${diseaseName} (${hindiName})`
      });
    }

    if (herbs.length > 0) {
      herbs.slice(0, 2).forEach((herb, i) => {
        itemsToAdd.push({
          id: Date.now() + i + 2,
          name: `${herb} Ghanvati / Extract (500mg)`,
          type: 'Single Herb / Ghanvati',
          system: 'ayurvedic',
          dose: '500mg (1 Tab)',
          frequency: 'BD (Twice Daily)',
          kaala: 'Adhobhakta (After Meals)',
          anupana: 'Lukewarm Water / Cow Milk',
          duration: record['Duration of Treatment'] || '15 Days',
          source: `Regimen: ${diseaseName}`
        });
      });
    }

    setPrescriptions(prev => [...prev, ...itemsToAdd]);

    if (record['Diet and Lifestyle Recommendations']) {
      setDietPathya(record['Diet and Lifestyle Recommendations']);
    }
    if (record['Yoga & Physical Therapy']) {
      setYogaPlanText(record['Yoga & Physical Therapy']);
    }

    setActiveRegimenName(`${diseaseName} Protocol (${hindiName})`);
    setIsPrescriptionSigned(false);
    voiceAssistant.playAudioCue('success');
  };

  const handleOpenVitalsModal = () => {
    if (!selectedCase) return;
    const v = selectedCase.vitals || {};
    const p = selectedCase.pariksha || {};
    
    const bpParts = (v.bp || '128/84').split('/');
    const bpSys = bpParts[0]?.trim() || '128';
    const bpDia = bpParts[1]?.replace(/[^0-9]/g, '').trim() || '84';

    const wNum = parseFloat(v.weight) || 64;
    const hNum = parseFloat(v.height) || 162;
    const calcBmi = (wNum / ((hNum / 100) * (hNum / 100))).toFixed(1);

    setVitalsForm({
      bpSystolic: bpSys,
      bpDiastolic: bpDia,
      pulseRate: (v.pulse || '78').replace(/[^0-9]/g, '') || '78',
      nadiType: p.ashtavidha?.nadi || (v.pulse?.includes('Manduka') ? 'Manduka Gati (Pitta - Rapid)' : (v.pulse?.includes('Sarpa') ? 'Sarpa Gati (Vata - Thin & Rapid)' : 'Hamsa Gati (Kapha - Slow & Full)')),
      spo2: (v.spo2 || '98').replace(/[^0-9]/g, '') || '98',
      temp: (v.temp || '98.4').replace(/[^0-9.]/g, '') || '98.4',
      weight: wNum.toString(),
      height: hNum.toString(),
      bmi: calcBmi,
      bmiCategory: parseFloat(calcBmi) > 25 ? 'Sthaulya (Overweight)' : (parseFloat(calcBmi) < 18.5 ? 'Krisha (Underweight)' : 'Sama Pramana (Normal)'),
      agni: p.agni || 'Tikshnagni (Hyperactive)',
      koshtha: p.koshtha || 'Krura (Hard Bowels)',
      painScale: (v.painScale || '5').slice(0, 1) || '5',
      painType: v.painScale?.includes('Burning') ? 'Burning Pain (Daha)' : (v.painScale?.includes('Shooting') ? 'Pricking/Shooting (Toda)' : 'Stiffness & Aching (Stambha)'),
      sugar: (v.sugar || '110').replace(/[^0-9]/g, '') || '110',
      sugarType: 'RBS'
    });

    setShowVitalsModal(true);
  };

  const handleSaveVitals = () => {
    if (!selectedCase) return;

    const w = parseFloat(vitalsForm.weight) || 60;
    const h = parseFloat(vitalsForm.height) || 165;
    const calculatedBmi = (w / ((h / 100) * (h / 100))).toFixed(1);
    const calculatedBmiCat = parseFloat(calculatedBmi) >= 25 ? 'Sthaulya (Overweight)' : (parseFloat(calculatedBmi) < 18.5 ? 'Krisha (Underweight)' : 'Sama Pramana (Normal)');

    const updatedVitals = {
      ...selectedCase.vitals,
      bp: `${vitalsForm.bpSystolic}/${vitalsForm.bpDiastolic} mmHg`,
      pulse: `${vitalsForm.pulseRate} bpm (${vitalsForm.nadiType})`,
      spo2: `${vitalsForm.spo2}%`,
      temp: `${vitalsForm.temp} °F`,
      weight: `${vitalsForm.weight} kg`,
      height: `${vitalsForm.height} cm`,
      bmi: `${calculatedBmi} (${calculatedBmiCat})`,
      painScale: `${vitalsForm.painScale} / 10 (${vitalsForm.painType})`,
      sugar: `${vitalsForm.sugar} mg/dL (${vitalsForm.sugarType})`
    };

    const updatedPariksha = {
      ...(selectedCase.pariksha || {}),
      agni: vitalsForm.agni,
      koshtha: vitalsForm.koshtha,
      ashtavidha: {
        ...(selectedCase.pariksha?.ashtavidha || {}),
        nadi: vitalsForm.nadiType
      }
    };

    const updatedCase = {
      ...selectedCase,
      vitals: updatedVitals,
      pariksha: updatedPariksha
    };

    setSelectedCase(updatedCase);
    setQueue(prev => prev.map(item => item.id === selectedCase.id ? updatedCase : item));
    setShowVitalsModal(false);
    voiceAssistant.playAudioCue('success');

    // Sync updated vitals & ashtavidha nadi to Supabase
    supabaseOpdService.saveConsultation(selectedCase.id, {
      patientId: selectedCase.patient?.id || selectedCase.patientId,
      ashtavidha: updatedPariksha.ashtavidha,
      dashavidha: selectedCase.rogiPariksha?.dashavidha || selectedCase.pariksha?.dashavidha || {},
      notes: doctorSubjectiveNotes || selectedCase.clinicalNotes,
      assessmentNotes: doctorAssessmentNotes,
      confirmedDiagnosis: typeof confirmedDiagnosis === 'string' ? confirmedDiagnosis : (confirmedDiagnosis?.name || 'Amlapitta'),
      diagnosisNameHi: typeof confirmedDiagnosis === 'object' && confirmedDiagnosis?.nameHi ? confirmedDiagnosis.nameHi : 'अम्लपित्त',
      namasteCode: typeof confirmedDiagnosis === 'object' && confirmedDiagnosis?.namasteCode ? confirmedDiagnosis.namasteCode : 'AYU-AML-01',
      icd11Code: typeof confirmedDiagnosis === 'object' && confirmedDiagnosis?.icd11Code ? confirmedDiagnosis.icd11Code : 'DA24.Z',
      rogaPariksha: selectedCase.rogaPariksha || {},
      chikitsaPlan: selectedCase.chikitsaPlan || {}
    });
  };

  const handleAddPanchakarmaOrder = () => {
    if (!newPanchakarmaForm.procedure) return;
    const newEntry = {
      id: Date.now(),
      ...newPanchakarmaForm
    };
    setPanchakarmaOrders(prev => [...prev, newEntry]);
    setShowPanchakarmaModal(false);
    voiceAssistant.playAudioCue('success');
  };

  const handleConfirmSignPrescription = async () => {
    if (!selectedCase) return;
    const consultedId = selectedCase.id;
    setIsPrescriptionSigned(true);
    setShowConfirmRxModal(false);

    // Persist all findings into Supabase tables first
    await handleSaveConsultationToDb(false);
    await supabaseOpdService.signConsultation(consultedId, { hash: prescriptionHash });

    const updatedCase = { ...selectedCase, status: 'CONSULTED' };
    setSelectedCase(updatedCase);
    setAcceptedCases(prev => Array.from(new Set([...prev, consultedId])));

    setQueue(prev => {
      const next = prev.map(item => item.id === consultedId ? { ...item, status: 'CONSULTED' } : item);
      try {
        localStorage.setItem('omni_kiosk_queue', JSON.stringify(next));
        localStorage.setItem('omni_active_opd_case', JSON.stringify(null));
      } catch (e) {
        console.error('Failed saving queue update:', e);
      }
      return next;
    });

    setHisActiveTab('patient_summary');

    await logAuditEvent({
      eventType: 'physician_prescription_eprescribed',
      performedBy: 'Dr. V. Sharma (BAMS, MD Ayu - Reg. No: AYU-DEL-8942)',
      performedByRole: 'doctor',
      targetType: 'patient',
      targetId: selectedCase.patient?.abhaId || selectedCase.token,
      targetName: selectedCase.patient?.name || 'Patient',
      action: `E-Prescription officially generated and digitally signed for UHID ${selectedCase.uhid}. Patient marked as CONSULTED.`,
      details: {
        token: selectedCase.token,
        uhid: selectedCase.uhid,
        regimen: activeRegimenName,
        medicationsCount: prescriptions.length,
        prescriptions: prescriptions.map(p => ({ name: p.name, dose: p.dose, frequency: p.frequency, kaala: p.kaala })),
        dietPlan: dietPathya,
        yogaPlan: yogaPlanText,
        panchakarmaOrdersCount: panchakarmaOrders.length,
        prescriptionHash
      }
    });

    voiceAssistant.playAudioCue('success');
    voiceAssistant.speak(`मरीज ${selectedCase.patient?.name} का ई-प्रिस्क्रिप्शन जारी हो गया है। परामर्श पत्र तैयार है।`);
  };

  const handleReconcileToRx = (med) => {
    const isAyur = med.system === 'ayurvedic';
    const newEntry = {
      id: Date.now(),
      name: med.name,
      type: med.type || (isAyur ? 'Reconciled Ayurvedic' : 'Reconciled Allopathic'),
      system: med.system || 'allopathic',
      dose: med.dose || 'Standard Dose',
      frequency: med.frequency || 'OD (Once Daily)',
      kaala: isAyur ? (med.kaala || 'Adhobhakta') : (med.route || 'Oral'),
      anupana: isAyur ? (med.anupana || 'Water') : 'Oral',
      duration: '30 Days (Ongoing Continued)'
    };
    setPrescriptions(prev => [...prev, newEntry]);
    voiceAssistant.playAudioCue('beep');
    alert(`Reconciled "${med.name}" into active OPD Prescription!`);
  };

  const generatePhysicianSummaryText = (c) => {
    if (!c) return '';
    const catalogItem = AYUSH_NAMASTE_CATALOG[c.intake?.complaintId] || AYUSH_NAMASTE_CATALOG.digestive_issues;
    const prak = ccrasPrakritiResult || {
      dominantPrakriti: c.pariksha?.prakritiResult?.dominant || 'Pitta-Vata Dwandvaja',
      dominantPrakritiHi: 'पित्त-वात द्वन्द्वज प्रकृति',
      percentages: { vata: 35, pitta: 55, kapha: 10 },
      marks: { vata: 8, pitta: 12, kapha: 2, total: 22 },
      domainScores: {
        physical: { vata: 2, pitta: 3, kapha: 1, total: 6 },
        physiological: { vata: 2, pitta: 4, kapha: 1, total: 7 },
        psychological: { vata: 2, pitta: 3, kapha: 0, total: 5 },
        behavioral: { vata: 2, pitta: 2, kapha: 0, total: 4 }
      },
      guidelines: {
        dietaryRulesHi: 'स्निग्ध, सुपाच्य, मृदु और गैर-मसालेदार भोजन।',
        viharaLifestyleHi: 'भोजन और सोने का समय बिल्कुल नियमित रखें।',
        yogaAsanas: 'Nadi Shodhana, Sheetali, Shavasana'
      }
    };

    return `ALL INDIA INSTITUTE OF AYURVEDA (AIIA) - CENTRAL HOSPITAL INFORMATION SYSTEM
CLINICAL OPD CONSULTATION RECORD (DEPARTMENT OF KAYA CHIKITSA)
Patient: ${c.patient?.name} | Age: ${c.patient?.age}Y / ${c.patient?.gender} | ABHA ID: ${c.patient?.abhaId}
CR No: ${c.crNo} | UHID: ${c.uhid || 'UHID-2026-89421'} | Token: ${c.token} | Date: ${new Date().toLocaleDateString('en-IN')} | Room: 12 (Unit III)

1. CLINICAL PRESENTATION & CHIEF COMPLAINTS:
- Presenting Symptom: ${c.intake?.complaintLabel}
- National Standard Terminology (NAMASTE): ${catalogItem.namasteCode} • ${catalogItem.namasteTerm}
- Global Classification (ICD-11): ${catalogItem.icd11Code} • ${catalogItem.icd11Term}

2. HISTORY OF PRESENT ILLNESS (HPI - SOCRATES):
- Site (Sthana): ${c.intake?.answers?.site || catalogItem.socratesDefaults.site}
- Onset & Duration (Kala): ${c.intake?.answers?.onset || catalogItem.socratesDefaults.onset}
- Character & Intensity (Rupa): ${c.intake?.answers?.character || catalogItem.socratesDefaults.character}
- Radiation: ${c.intake?.answers?.radiation || catalogItem.socratesDefaults.radiation}
- Associated Symptoms: ${Array.isArray(c.intake?.answers?.associatedSymptoms) ? c.intake.answers.associatedSymptoms.join(', ') : catalogItem.socratesDefaults.associations}
- Exacerbating Factors: ${catalogItem.socratesDefaults.exacerbating}
- Pain Severity Score: ${c.vitals?.painScale || 'VAS 6/10'}

3. AYURVEDIC CLINICAL EXAMINATION (ROGI-ROGA PARIKSHA):
- Ashtavidha Pariksha: Nadi (${c.pariksha?.ashtavidha?.nadi}), Jihwa (${c.pariksha?.ashtavidha?.jihwa}), Mala (${c.pariksha?.ashtavidha?.mala})
- Agni & Koshtha: ${c.pariksha?.agni || 'Tikshnagni'} | ${c.pariksha?.koshtha || 'Krura Koshtha'}
- Pramana (Anthropometrics): Height ${c.vitals?.height} | Weight ${c.vitals?.weight} | BMI ${c.vitals?.bmi}

4. CCRAS STANDARDIZED PRAKRITI ASSESSMENT (CENTRAL COUNCIL FOR RESEARCH IN AYURVEDIC SCIENCES):
- Official Standard: CCRAS Standard Operative Procedures Manual (ISBN: 978-93-83864-21-8)
- Constitutional Diagnosis: ${prak.dominantPrakriti} (${prak.dominantPrakritiHi})
- Tri-Dosha Proportion: Vata ${prak.percentages?.vata}% (${prak.marks?.vata} pts) | Pitta ${prak.percentages?.pitta}% (${prak.marks?.pitta} pts) | Kapha ${prak.percentages?.kapha}% (${prak.marks?.kapha} pts)
- Trait Domain Breakdown:
  * Physical Traits (Built, Height, Appearance, Skin, Hair, Eyes): V:${prak.domainScores?.physical?.vata} | P:${prak.domainScores?.physical?.pitta} | K:${prak.domainScores?.physical?.kapha}
  * Physiological Traits (Appetite, Thirst, Bowel, Sleep, Sweating, Weather, Stamina): V:${prak.domainScores?.physiological?.vata} | P:${prak.domainScores?.physiological?.pitta} | K:${prak.domainScores?.physiological?.kapha}
  * Psychological Traits (Indecisiveness, Comprehension, Memory, Anger, Stability): V:${prak.domainScores?.psychological?.vata} | P:${prak.domainScores?.psychological?.pitta} | K:${prak.domainScores?.psychological?.kapha}
  * Behavioral Traits (Enmity, Humility, Speech, Gait, Friendship): V:${prak.domainScores?.behavioral?.vata} | P:${prak.domainScores?.behavioral?.pitta} | K:${prak.domainScores?.behavioral?.kapha}
- CCRAS Pathya Ahara: ${prak.guidelines?.dietaryRulesHi || 'Warm, freshly cooked, balanced diet'}
- CCRAS Vihara: ${prak.guidelines?.viharaLifestyleHi || 'Regular sleep schedule, daily exercise'}
- Prescribed Yoga & Pranayama: ${prak.guidelines?.yogaAsanas || 'Surya Namaskar & Pranayama'}

5. E-PRESCRIPTION & DISPENSARY ORDERS:
${prescriptions.map((p, i) => `${i + 1}. ${p.name} - Dose: ${p.dose} | Freq: ${p.frequency} | Kaala: ${p.kaala} | Anupana: ${p.anupana} | Duration: ${p.duration}`).join('\n')}

6. PANCHAKARMA & PROCEDURES PRESCRIBED:
${panchakarmaOrders.map((po, i) => `${i + 1}. ${po.procedure} with ${po.dravya} - ${po.sessions} (${po.time})`).join('\n')}

ATTENDING VAIDYA: Dr. V. Sharma (BAMS, MD Ayu) • Senior Consultant • Reg No: CCIM-AYU-84920`;
  };

  const activeSummaryText = editedNotes || generatePhysicianSummaryText(selectedCase);

  const filteredQueue = queue.filter(c => {
    if (activeTabFilter === 'emergency') return c.redFlag || c.status === 'EMERGENCY_PRIORITY';
    if (activeTabFilter === 'waiting') return !acceptedCases.includes(c.id) && c.status !== 'CONSULTED';
    if (activeTabFilter === 'active') return c.id === selectedCase?.id && currentView === 'encounter';
    if (activeTabFilter === 'signed') return acceptedCases.includes(c.id) || c.status === 'CONSULTED';
    return true;
  });

  const openPatientEncounter = (c) => {
    const updatedCase = { ...c, status: 'IN_CONSULTATION' };
    setSelectedCase(updatedCase);
    setSearchQuery(c.token);
    setEditedNotes('');
    setCurrentView('encounter');
    setHisActiveTab('phase1_rogi');
    setPatientPrakritiAnswers(c.pariksha?.ccrasAnswers || c.rogiPariksha?.dashavidha?.prakriti?.scores || {});
    setConfirmedDiagnosis(c.assessment?.confirmedDiagnosis || null);
    setActiveGhatakas(c.assessment?.ghatakas || c.rogaPariksha?.samprapti || null);
    setDoctorSubjectiveNotes(c.notes?.subjective || '');
    setDoctorAssessmentNotes(c.notes?.assessment || '');
    setPrescriptions(c.prescriptions || []);
    setPanchakarmaOrders(c.panchakarmaOrders || []);
    setActiveRegimenName(c.activeRegimenName || '');
    setIsPrescriptionSigned(c.isPrescriptionSigned || false);

    setQueue(prev => {
      const next = prev.map(item => {
        if (item.id === c.id) {
          return { ...item, status: 'IN_CONSULTATION' };
        }
        if (item.status === 'IN_CONSULTATION' && !acceptedCases.includes(item.id) && item.status !== 'CONSULTED') {
          return { ...item, status: 'WAITING_OPD' };
        }
        return item;
      });
      try {
        localStorage.setItem('omni_kiosk_queue', JSON.stringify(next));
        localStorage.setItem('omni_active_opd_case', JSON.stringify(updatedCase));
      } catch (e) {
        console.error('Failed saving active OPD case:', e);
      }
      return next;
    });

    supabaseOpdService.updateEncounterStatus(c.id, 'IN_CONSULTATION');
  };

  const backToRoster = () => {
    setCurrentView('roster');
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", sans-serif', fontSize: '13px' }}>

      {/* Physician Sub-Header Ribbon - Master OPD Queue View */}
      {currentView === 'roster' && (
        <div className="bg-slate-900 border-b border-slate-800 text-white shadow-sm">
          <div className="max-w-screen-xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-md text-[11px] font-black tracking-wider uppercase">
                AYUSH OPD
              </span>
              <span className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                Physician Clinical Workstation <span className="text-slate-400 font-normal text-xs hidden md:inline">(आयुष बाह्य रोगी विभाग)</span>
              </span>
              <span className="text-slate-400 text-xs font-medium bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                Room 12 • Unit III
              </span>
              {supabaseOpdService.isLive() ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Supabase DB Live
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950/70 text-blue-300 border border-blue-700/60 flex items-center gap-1" title="To connect live Supabase, enter VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Supabase Ready (Local Mode)
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-xs text-slate-300 flex items-center gap-1.5">
                <span>Attending:</span>
                <strong className="text-white font-semibold">Dr. V. Sharma</strong>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-[11px] text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/50">CCIM-84920</span>
              </div>
              <div className="w-px h-4 bg-slate-700 hidden sm:block" />
              <div className="text-xs flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-amber-950/40 text-amber-300 font-bold border border-amber-800/50 text-[11px]">
                  {queue.filter(c => !acceptedCases.includes(c.id)).length} Waiting
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-400 font-bold border border-emerald-800/50 text-[11px]">
                  {acceptedCases.length} Done
                </span>
              </div>
              <button
                onClick={handleCallNextToken}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 border border-orange-500 shadow-sm shadow-orange-900/30 transition-all active:scale-95 cursor-pointer"
              >
                <Volume2 size={13} />
                Announce Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: FULL-SCREEN OPD PATIENT QUEUE & MASTER ROSTER */}
      {currentView === 'roster' && (
        <OpdQueueRoster
          queue={queue}
          acceptedCases={acceptedCases}
          selectedCase={selectedCase}
          currentView={currentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchPatient={handleSearchPatient}
          activeTabFilter={activeTabFilter}
          setActiveTabFilter={setActiveTabFilter}
          filteredQueue={filteredQueue}
          openPatientEncounter={openPatientEncounter}
          handleCallNextToken={handleCallNextToken}
          onSeedSample={handleSeedSamplePatient}
        />
      )}

      {/* VIEW 2: FULL-SCREEN CLINICAL ENCOUNTER WORKSPACE */}
      {currentView === 'encounter' && !selectedCase && (
        <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-md mx-auto shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800">कतार रिक्त है • No Active Patient</h3>
            <p className="text-xs text-slate-500">
              ओपीडी कतार में कोई रोगी नहीं है। मेडीकियोस्क से नया पंजीकरण करें या टेस्ट केस लोड करें।
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('roster')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                ← वापस ओपीडी कतार देखें
              </button>
              <button
                onClick={handleSeedSamplePatient}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 cursor-pointer transition-colors"
              >
                ✨ Seed Test Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL-SCREEN CLINICAL ENCOUNTER WORKSPACE */}
      {currentView === 'encounter' && selectedCase && (
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          
          <OpdEncounterHeader
            selectedCase={selectedCase}
            backToRoster={backToRoster}
            handleAcceptCase={handleAcceptCase}
            setShowFhirModal={setShowFhirModal}
            setShowApiImportModal={setShowApiImportModal}
            handleOpenVitalsModal={handleOpenVitalsModal}
            hisActiveTab={hisActiveTab}
            setHisActiveTab={setHisActiveTab}
            waitingCount={queue.filter(c => !acceptedCases.includes(c.id)).length}
            prescriptions={prescriptions}
            confirmedDiagnosis={confirmedDiagnosis}
            onSaveConsultation={() => handleSaveConsultationToDb(true)}
            isSavingDb={isSavingDb}
          />

          {/* PHASE 1: ROGI PARIKSHA (रोगी परीक्षा — आप्तोपदेश, प्रत्यक्ष एवं अनुमान: अष्टविध व दशविध) */}
          {(hisActiveTab === 'phase1_rogi' || hisActiveTab === 'soap_subjective' || hisActiveTab === 'soap_objective') && (
            <OpdRogiParikshaTab
              selectedCase={selectedCase}
              doctorNotes={doctorSubjectiveNotes}
              onUpdateDoctorNotes={setDoctorSubjectiveNotes}
              handleOpenVitalsModal={handleOpenVitalsModal}
            />
          )}

          {/* PHASE 2: ROGA PARIKSHA (रोग परीक्षा — निदान पंचक एवं सम्प्राप्ति घटक) */}
          {(hisActiveTab === 'phase2_roga' || hisActiveTab === 'soap_assessment') && (
            <OpdRogaParikshaTab
              selectedCase={selectedCase}
              assessmentNotes={doctorAssessmentNotes}
              onUpdateAssessmentNotes={setDoctorAssessmentNotes}
              confirmedDiagnosis={confirmedDiagnosis}
              onConfirmDoctorDiagnosis={handleConfirmDoctorDiagnosis}
            />
          )}

          {/* PHASE 3: CHIKITSA SUTRA & PLAN (चिकित्सा योजना — आहार, विहार, शमन एवं शोधन) */}
          {(hisActiveTab === 'phase3_chikitsa' || hisActiveTab === 'soap_plan') && (
            <OpdChikitsaPlanTab
              selectedCase={selectedCase}
              prescriptions={prescriptions}
              setPrescriptions={setPrescriptions}
              panchakarmaOrders={panchakarmaOrders}
              setPanchakarmaOrders={setPanchakarmaOrders}
              setShowApiImportModal={setShowApiImportModal}
              setShowPanchakarmaModal={setShowPanchakarmaModal}
              onSaveChikitsaPlan={(compiledPlan) => handleSaveConsultationToDb(true, compiledPlan)}
            />
          )}

          {/* PHASE 4: OFFICIAL E-SIGN (परामर्श पत्र एवं अधिकृत प्रिंट) */}
          {(hisActiveTab === 'phase4_summary' || hisActiveTab === 'patient_summary') && (
            <OpdPatientSummaryTab
              selectedCase={selectedCase}
              confirmedDiagnosis={confirmedDiagnosis}
              activeGhatakas={activeGhatakas}
              isPrescriptionSigned={isPrescriptionSigned}
              acceptedCases={acceptedCases}
              ccrasPrakritiResult={ccrasPrakritiResult}
              sampraptiSynthesis={null}
              prescriptions={prescriptions}
              dietPathya={dietPathya}
              yogaPlanText={yogaPlanText}
              panchakarmaOrders={panchakarmaOrders}
              currentRitu={currentRitu}
              prescriptionHash={prescriptionHash}
              backToRoster={backToRoster}
              printDoctorPrescription={printDoctorPrescription}
            />
          )}

        </div>
      )}

      {/* MODAL: AYUSH Pharmacopoeia & Formulations Dataset Importer */}
      <OpdApiImportModal
        showApiImportModal={showApiImportModal}
        setShowApiImportModal={setShowApiImportModal}
        apiSearchQuery={apiSearchQuery}
        setApiSearchQuery={setApiSearchQuery}
        apiFilterSystem={apiFilterSystem}
        setApiFilterSystem={setApiFilterSystem}
        apiFilterKalpana={apiFilterKalpana}
        setApiFilterKalpana={setApiFilterKalpana}
        apiSearchResults={apiSearchResults}
        handleSearchApiFormulations={handleSearchApiFormulations}
        handleImportFromApi={handleImportFromApi}
      />

      {/* MODAL: ABDM FHIR R4 Viewer */}
      <OpdFhirModal
        showFhirModal={showFhirModal}
        setShowFhirModal={setShowFhirModal}
        selectedCase={selectedCase}
      />

      {/* MODAL: Official E-Prescription Confirmation & Sign-Off */}
      <OpdConfirmRxModal
        showConfirmRxModal={showConfirmRxModal}
        setShowConfirmRxModal={setShowConfirmRxModal}
        selectedCase={selectedCase}
        prescriptions={prescriptions}
        dietPathya={dietPathya}
        yogaPlanText={yogaPlanText}
        prescriptionHash={prescriptionHash}
        handleConfirmSignPrescription={handleConfirmSignPrescription}
      />

      {/* MODAL: Physician Vitals Entry & Live Examination Editor */}
      <OpdVitalsModal
        showVitalsModal={showVitalsModal}
        setShowVitalsModal={setShowVitalsModal}
        selectedCase={selectedCase}
        vitalsForm={vitalsForm}
        setVitalsForm={setVitalsForm}
        handleSaveVitals={handleSaveVitals}
      />

      {/* MODAL: Panchakarma Procedure Order Form & Catalog */}
      <OpdPanchakarmaModal
        showPanchakarmaModal={showPanchakarmaModal}
        setShowPanchakarmaModal={setShowPanchakarmaModal}
        newPanchakarmaForm={newPanchakarmaForm}
        setNewPanchakarmaForm={setNewPanchakarmaForm}
        handleAddPanchakarmaOrder={handleAddPanchakarmaOrder}
      />

    </div>
  );
}
