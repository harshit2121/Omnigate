import { useState, useEffect, useMemo } from 'react';
import { Volume2 } from 'lucide-react';
import { OPD_DEMO_CASES } from '../data/opdDemoCases';
import { printDoctorPrescription } from '../utils/prakritiPdfGenerator';
import { ayushCdssService } from '../services/ayushCdssService';
import { AYUSH_NAMASTE_CATALOG } from '../services/clinicalAiService';
import { ayushFormulationsApi, AYUSH_FORMULATIONS_DATA } from '../services/ayushFormulationsApiService';
import MedicationHistory from '../components/dashboard/Patient/MedicationHistory';
import { logAuditEvent } from '../services/auditLog';
import { runDashavidhaEvaluation } from '../services/dashavidhaParikshaEngine';
import { calculateCcrasPrakriti } from '../services/prakritiDetermineService';
import voiceAssistant from '../services/voiceAssistant';

// Modular AYUSH OPD Subcomponents (SOAP Clinical Architecture)
import OpdQueueRoster from '../components/ayush-opd/OpdQueueRoster';
import OpdEncounterHeader from '../components/ayush-opd/OpdEncounterHeader';
import OpdSubjectiveTab from '../components/ayush-opd/tabs/OpdSubjectiveTab';
import OpdObjectiveTab from '../components/ayush-opd/tabs/OpdObjectiveTab';
import OpdAssessmentTab from '../components/ayush-opd/tabs/OpdAssessmentTab';
import OpdPlanTab from '../components/ayush-opd/tabs/OpdPlanTab';
import OpdPatientSummaryTab from '../components/ayush-opd/tabs/OpdPatientSummaryTab';

// Modular AYUSH OPD Modals
import OpdVitalsModal from '../components/ayush-opd/modals/OpdVitalsModal';
import OpdPanchakarmaModal from '../components/ayush-opd/modals/OpdPanchakarmaModal';
import OpdApiImportModal from '../components/ayush-opd/modals/OpdApiImportModal';
import OpdConfirmRxModal from '../components/ayush-opd/modals/OpdConfirmRxModal';
import OpdFhirModal from '../components/ayush-opd/modals/OpdFhirModal';

export default function AyushPhysicianOPD() {
  // Search & Patient Retrieval
  const [searchQuery, setSearchQuery] = useState('AYU-104');
  const [queue, setQueue] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [acceptedCases, setAcceptedCases] = useState([]);
  const [activeTabFilter, setActiveTabFilter] = useState('all');
  
  // Two-view navigation: 'roster' → full-screen queue, 'encounter' → clinical workstation
  const [currentView, setCurrentView] = useState('roster');

  // Hospital HIS Workbench Navigation Tabs - SOAP Clinical Flow
  const [hisActiveTab, setHisActiveTab] = useState('soap_subjective'); 

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
  const [activeRegimenName, setActiveRegimenName] = useState('Amlapitta Shamak Protocol (मानक प्रोटोकॉल)');
  const [dietPathya, setDietPathya] = useState('Warm fresh food, Mudga Yusha (Moong dal soup), Dadima (Pomegranate), Cow Ghee, Lukewarm water.');
  const [dietApathya, setDietApathya] = useState('Excessive spicy, sour, fermented food, curd at night, deep-fried snacks, late-night meals.');
  const [yogaPlanText, setYogaPlanText] = useState('Shitali & Sitkari Pranayama (10 min), Vajrasana post-meal, Bhujangasana, Nadi Shodhana.');
  const [showConfirmRxModal, setShowConfirmRxModal] = useState(false);
  const [isPrescriptionSigned, setIsPrescriptionSigned] = useState(false);

  // Active Prescriptions State for Current Case
  const [prescribingSystem, setPrescribingSystem] = useState('ayurvedic');
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, name: 'Sutshekhar Ras (Gold / Plain)', type: 'Rasaushadhi / Vati', system: 'ayurvedic', dose: '250mg', frequency: 'BD (Twice Daily)', kaala: 'Pragbhakta (Before Meals)', anupana: 'Godugdha (Warm Cow Milk)', duration: '15 Days', source: 'Standard Protocol' },
    { id: 2, name: 'Avipattikar Churna', type: 'Churna', system: 'ayurvedic', dose: '5g', frequency: 'HS (Bedtime)', kaala: 'Nishikala (Night)', anupana: 'Ushnodaka (Lukewarm Water)', duration: '15 Days', source: 'Standard Protocol' },
    { id: 3, name: 'Kamadudha Rasa (Moti Yukta)', type: 'Rasaushadhi / Pishti', system: 'ayurvedic', dose: '250mg', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Amalaki Swarasa / Water', duration: '15 Days', source: 'Standard Protocol' }
  ]);

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

  // Panchakarma & Procedure Orders
  const [showPanchakarmaModal, setShowPanchakarmaModal] = useState(false);
  const [panchakarmaOrders, setPanchakarmaOrders] = useState([
    { id: 1, procedure: 'Mridu Virechana Karma', dravya: 'Eranda Taila + Triphala Kwath', sessions: '3 Days', time: 'Early Morning (Pratah Kala)', notes: 'Empty stomach with lukewarm water' },
    { id: 2, procedure: 'Shirodhara (Cooling Head Drip)', dravya: 'Chandanadi / Ksheerabala Taila', sessions: '7 Sessions (45 min)', time: 'Evening (Sayam Kala)', notes: 'For Pitta-shamana & stress pacification' }
  ]);

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

  // Initialize queue from localStorage or seeded default demo cases
  useEffect(() => {
    const stored = localStorage.getItem('omni_kiosk_queue');
    let loadedCases = OPD_DEMO_CASES;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const combined = [...parsed];
          OPD_DEMO_CASES.forEach(dc => {
            if (!combined.some(c => c.token === dc.token || c.id === dc.id)) {
              combined.push(dc);
            }
          });
          loadedCases = combined;
        }
      } catch (e) {
        console.error('Failed parsing queue:', e);
      }
    }
    setQueue(loadedCases);
    setSelectedCase(loadedCases[0]);
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
    
    const activeAllo = selectedCase.intake?.currentMedications || ['Telmisartan 40mg'];

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

  const handleAcceptCase = async () => {
    if (!selectedCase) return;
    const consultedId = selectedCase.id;
    setAcceptedCases(prev => Array.from(new Set([...prev, consultedId])));
    
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
    alert(`Encounter ${selectedCase.token} (UHID: ${selectedCase.uhid}) signed and marked as CONSULTED in AIIA Central HIS!`);
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
  };

  const handleConfirmDoctorDiagnosis = (confirmed, ghatakas) => {
    setConfirmedDiagnosis(confirmed);
    if (ghatakas) setActiveGhatakas(ghatakas);
    if (selectedCase) {
      const updatedCase = {
        ...selectedCase,
        assessment: {
          ...(selectedCase.assessment || {}),
          confirmedDiagnosis: confirmed,
          ghatakas: ghatakas || selectedCase.assessment?.ghatakas
        }
      };
      setSelectedCase(updatedCase);
      setQueue(prev => prev.map(item => item.id === selectedCase.id ? updatedCase : item));
    }
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
    setPatientPrakritiAnswers(c.pariksha?.ccrasAnswers || c.pariksha?.prakritiAnswers || {});
    setConfirmedDiagnosis(c.assessment?.confirmedDiagnosis || null);
    setActiveGhatakas(c.assessment?.ghatakas || null);
    setDoctorSubjectiveNotes(c.notes?.subjective || '');
    setDoctorAssessmentNotes(c.notes?.assessment || '');

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
  };

  const backToRoster = () => {
    setCurrentView('roster');
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", sans-serif', fontSize: '13px' }}>

      {/* Physician Sub-Header Ribbon */}
      <div style={{ background: '#003F6B', borderBottom: '3px solid #FF6B00', color: 'white' }}>
        <div className="max-w-screen-xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ background: '#FF6B00', color: 'white', padding: '2px 8px', fontSize: '11px', fontWeight: 'bold', borderRadius: '2px' }}>
              AYUSH OPD
            </span>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFD700' }}>
              Physician Clinical Workstation (आयुष बाह्य रोगी विभाग)
            </span>
            <span style={{ color: '#90AAC4', fontSize: '12px' }}>• OPD Room 12 (Unit III)</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div style={{ fontSize: '11px', color: '#D6E4F0' }}>
              Attending: <b style={{ color: 'white' }}>Dr. V. Sharma</b> (BAMS, MD) • Reg: <span style={{ fontFamily: 'monospace', color: '#90C8FF' }}>CCIM-84920</span>
            </div>
            <div style={{ width: 1, height: 18, background: '#005A9C' }} />
            <div style={{ fontSize: '11px', color: '#D6E4F0' }}>
              Queue: <b style={{ color: '#FFD700' }}>{queue.filter(c => !acceptedCases.includes(c.id)).length} Waiting</b> | <b style={{ color: '#4ADE80' }}>{acceptedCases.length} Done</b>
            </div>
            <button
              onClick={handleCallNextToken}
              style={{
                background: '#E05000',
                border: '1px solid #C04000',
                color: 'white',
                padding: '5px 12px',
                borderRadius: '2px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F06010'}
              onMouseLeave={e => e.currentTarget.style.background = '#E05000'}
            >
              <Volume2 size={13} />
              Announce Next
            </button>
          </div>
        </div>
      </div>

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
        />
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
          />

          {/* TAB 1: [S] SUBJECTIVE (लक्षण, इतिहास एवं आहार-विहार) */}
          {hisActiveTab === 'soap_subjective' && (
            <OpdSubjectiveTab
              selectedCase={selectedCase}
              doctorNotes={doctorSubjectiveNotes}
              onUpdateDoctorNotes={setDoctorSubjectiveNotes}
            />
          )}

          {/* TAB 2: [O] OBJECTIVE (परीक्षा, अष्टविध एवं CCRAS प्रकृति) */}
          {hisActiveTab === 'soap_objective' && (
            <OpdObjectiveTab
              selectedCase={selectedCase}
              patientPrakritiAnswers={patientPrakritiAnswers}
              onUpdatePrakritiAnswers={setPatientPrakritiAnswers}
              onConfirmDoctorPrakriti={handleConfirmDoctorPrakriti}
              handleOpenVitalsModal={handleOpenVitalsModal}
            />
          )}

          {/* TAB 3: [A] ASSESSMENT (सम्प्राप्ति घटक, निदान एवं NAMASTE/ICD-11) */}
          {hisActiveTab === 'soap_assessment' && (
            <OpdAssessmentTab
              selectedCase={selectedCase}
              assessmentNotes={doctorAssessmentNotes}
              onUpdateAssessmentNotes={setDoctorAssessmentNotes}
              doctorSubjectiveNotes={doctorSubjectiveNotes}
              ccrasPrakritiResult={ccrasPrakritiResult}
              confirmedDiagnosis={confirmedDiagnosis}
              setConfirmedDiagnosis={setConfirmedDiagnosis}
              activeGhatakas={activeGhatakas}
              setActiveGhatakas={setActiveGhatakas}
              onConfirmDoctorDiagnosis={handleConfirmDoctorDiagnosis}
              onOverrideGhataka={handleOverrideGhataka}
            />
          )}

          {/* TAB 4: [P] PLAN & RX (चिकित्सा सूत्र, औषध योग एवं पथ्यापथ्य) */}
          {hisActiveTab === 'soap_plan' && (
            <OpdPlanTab
              selectedCase={selectedCase}
              confirmedDiagnosis={confirmedDiagnosis}
              activeGhatakas={activeGhatakas}
              doctorSubjectiveNotes={doctorSubjectiveNotes}
              doctorAssessmentNotes={doctorAssessmentNotes}
              ccrasPrakritiResult={ccrasPrakritiResult}
              isPrescriptionSigned={isPrescriptionSigned}
              cdssEvaluation={cdssEvaluation}
              prescriptions={prescriptions}
              setPrescriptions={setPrescriptions}
              handleAddPrescription={handleAddPrescription}
              handleRemovePrescription={handleRemovePrescription}
              newMedForm={newMedForm}
              setNewMedForm={setNewMedForm}
              prescribingSystem={prescribingSystem}
              setPrescribingSystem={setPrescribingSystem}
              dietPathya={dietPathya}
              setDietPathya={setDietPathya}
              dietApathya={dietApathya}
              setDietApathya={setDietApathya}
              yogaPlanText={yogaPlanText}
              setYogaPlanText={setYogaPlanText}
              panchakarmaOrders={panchakarmaOrders}
              setPanchakarmaOrders={setPanchakarmaOrders}
              setShowPanchakarmaModal={setShowPanchakarmaModal}
              setShowConfirmRxModal={setShowConfirmRxModal}
              setShowApiImportModal={setShowApiImportModal}
              printDoctorPrescription={printDoctorPrescription}
            />
          )}

          {/* TAB 5: [SUMMARY & E-SIGN] (रोगी परामर्श पत्र एवं अधिकृत प्रिंट) */}
          {hisActiveTab === 'patient_summary' && (
            <OpdPatientSummaryTab
              selectedCase={selectedCase}
              confirmedDiagnosis={confirmedDiagnosis}
              activeGhatakas={activeGhatakas}
              isPrescriptionSigned={isPrescriptionSigned}
              acceptedCases={acceptedCases}
              ccrasPrakritiResult={ccrasPrakritiResult}
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
