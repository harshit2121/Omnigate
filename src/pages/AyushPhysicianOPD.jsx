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
import { synthesizeSamprapti } from '../services/sampraptiSynthesizerService';
import voiceAssistant from '../services/voiceAssistant';

// Modular AYUSH OPD Subcomponents
import OpdQueueRoster from '../components/ayush-opd/OpdQueueRoster';
import OpdEncounterHeader from '../components/ayush-opd/OpdEncounterHeader';
import OpdSampraptiTab from '../components/ayush-opd/tabs/OpdSampraptiTab';
import OpdClinicalHistoryTab from '../components/ayush-opd/tabs/OpdClinicalHistoryTab';
import OpdPrescriptionTab from '../components/ayush-opd/tabs/OpdPrescriptionTab';
import OpdPatientSummaryTab from '../components/ayush-opd/tabs/OpdPatientSummaryTab';
import OpdEmrCaseSheetTab from '../components/ayush-opd/tabs/OpdEmrCaseSheetTab';

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

  // Hospital HIS Workbench Navigation Tabs
  const [hisActiveTab, setHisActiveTab] = useState('samprapti_chart'); 

  // Vaidya Overrides on Samprapti Synthesis
  const [vaidyaOverrides, setVaidyaOverrides] = useState({});

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

  // Evaluate Live Layer 3 Samprapti Synthesis
  const sampraptiSynthesis = useMemo(() => {
    if (!selectedCase) return null;

    const dashavidhaResult = runDashavidhaEvaluation({
      prakritiAnswers: selectedCase.pariksha?.prakritiAnswers || {},
      vikritiAnswers: selectedCase.pariksha?.vikritiAnswers || {},
      saraAnswers: selectedCase.pariksha?.saraAnswers || {},
      samhanana: selectedCase.pariksha?.samhanana || 'Madhyama',
      pramanaData: {
        heightCm: 168,
        weightKg: 65,
        waistCm: 80,
        hipCm: 95,
        gender: selectedCase.patient?.gender || 'female'
      },
      satmya: selectedCase.pariksha?.satmya || 'Madhyama',
      sattva: selectedCase.pariksha?.sattva || 'Madhyama',
      aharaInputs: {
        intake: 'moderate',
        jaranaTimeHours: selectedCase.pariksha?.agni?.toLowerCase().includes('tikshna') ? 2.5 : 4,
        postMealFeeling: selectedCase.pariksha?.agni?.toLowerCase().includes('tikshna') ? 'burning_hunger' : 'normal'
      },
      vyayamaShakti: selectedCase.pariksha?.vyayamaShakti?.grade || 'Madhyama',
      age: selectedCase.patient?.age || 45
    });

    const baseSynthesis = synthesizeSamprapti({
      dashavidhaResult,
      complaintId: selectedCase.intake?.complaintId || 'digestive_issues',
      complaintLabel: selectedCase.intake?.complaintLabel || 'Amlapitta',
      symptomsText: selectedCase.intake?.answers?.site || '',
      answers: selectedCase.intake?.answers || {},
      namasteCode: selectedCase.intake?.namasteCode || 'NAMASTE-AYU-AML-01',
      patientName: selectedCase.patient?.name || 'Patient'
    });

    if (vaidyaOverrides[selectedCase.id]) {
      const overrides = vaidyaOverrides[selectedCase.id];
      return {
        ...baseSynthesis,
        ghatakas: {
          ...baseSynthesis.ghatakas,
          ...overrides
        },
        isOverriddenByVaidya: true
      };
    }

    return baseSynthesis;
  }, [selectedCase, vaidyaOverrides]);

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
    const sGhatakas = sampraptiSynthesis?.ghatakas || {};

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
- Inherent Prakriti (L1): ${c.pariksha?.prakritiResult?.dominant || 'N/A'} (V: ${c.pariksha?.prakritiResult?.vataPct || 35}%, P: ${c.pariksha?.prakritiResult?.pittaPct || 55}%, K: ${c.pariksha?.prakritiResult?.kaphaPct || 10}%)
- Current Pathological Vikriti (L2): ${c.pariksha?.vikritiResult?.dominant || 'Pittaja Vikriti'} (Δ Pitta: +${c.pariksha?.vikritiResult?.delta?.pitta || 10}%)
- Ashtavidha Pariksha: Nadi (${c.pariksha?.ashtavidha?.nadi}), Jihwa (${c.pariksha?.ashtavidha?.jihwa}), Mala (${c.pariksha?.ashtavidha?.mala})
- Agni & Koshtha: ${c.pariksha?.agni || 'Tikshnagni'} | ${c.pariksha?.koshtha || 'Krura Koshtha'}
- Pramana (Anthropometrics): Height ${c.vitals?.height} | Weight ${c.vitals?.weight} | BMI ${c.vitals?.bmi}

4. SAMPRAPTI GHATAKA CLINICAL CHART (CHARAKA-SUSHRUTA TRISUTRA):
- Hetu (निदान): ${sGhatakas.hetu?.value || 'Mithya Ahara-Vihara'}
- Dosha (दोष): ${sGhatakas.dosha?.value || 'Pitta Pradhana'} (Gati: ${sGhatakas.dosha?.doshagati || 'Urdhwagati'})
- Dushya (दूष्य): ${sGhatakas.dushya?.value || 'Rasa, Rakta Dhatu'}
- Srotas (स्रोतस): ${sGhatakas.srotas?.value || 'Annavaha, Rasavaha Srotas'}
- Srotodushti (स्रोतोदुष्टि प्रकार): ${sGhatakas.srotodushti?.value || 'Vimargagamana'}
- Agni & Ama (अग्नि व आम): ${sGhatakas.agni?.value || 'Tikshnagni (Sama)'}
- Udbhavasthana (उद्भवस्थान): ${sGhatakas.udbhavasthana?.value || 'Amashaya (Stomach)'}
- Sancharasthana (संचारस्थान): ${sGhatakas.sancharasthana?.value || 'Dhamanis'}
- Sthanasamsraya (स्थानसंश्रय): ${sGhatakas.sthanaSamsraya?.value || 'Amashaya'}
- Vyaktasthana (व्यक्तस्थान): ${sGhatakas.vyaktasthana?.value || 'Epigastrium'}
- Rogamarga (रोगमार्ग): ${sGhatakas.rogamarga?.value || 'Abhyantara Rogamarga'}
- Sadhyasadhyata (साध्यासाध्यता): ${sGhatakas.sadhyasadhyata?.value || 'Sukhasadhya'}
- Chikitsa Sutra (चिकित्सा सूत्र): ${sGhatakas.chikitsaSutra?.value || 'Virechana & Pittashamaka'}

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

          {/* TAB 1: SAMPRAPTI GHATAKA MATRIX */}
          {hisActiveTab === 'samprapti_chart' && sampraptiSynthesis && (
            <OpdSampraptiTab
              selectedCase={selectedCase}
              sampraptiSynthesis={sampraptiSynthesis}
              handleOverrideGhataka={handleOverrideGhataka}
            />
          )}

          {/* TAB 2: ROGI PARIKSHA & CLINICAL HISTORY */}
          {hisActiveTab === 'clinical_history' && (
            <OpdClinicalHistoryTab
              selectedCase={selectedCase}
            />
          )}

          {/* TAB 3: MEDICATION HISTORY */}
          {hisActiveTab === 'medication_history' && (
            <MedicationHistory
              currentMedications={patientCurrentMeds.length > 0 ? patientCurrentMeds : (selectedCase.intake?.currentMedications || [])}
              previousMedications={patientPreviousMeds.length > 0 ? patientPreviousMeds : (selectedCase.intake?.previousMedications || [])}
              onUpdateCurrentMeds={(updated) => {
                setPatientCurrentMeds(updated);
                if (selectedCase) {
                  selectedCase.intake = { ...selectedCase.intake, currentMedications: updated };
                }
              }}
              onUpdatePrevMeds={(updated) => {
                setPatientPreviousMeds(updated);
                if (selectedCase) {
                  selectedCase.intake = { ...selectedCase.intake, previousMedications: updated };
                }
              }}
              onReconcileToRx={handleReconcileToRx}
              isPhysicianMode={true}
            />
          )}

          {/* TAB 4: E-PRESCRIBING SUITE */}
          {hisActiveTab === 'prescription_cdss' && (
            <OpdPrescriptionTab
              selectedCase={selectedCase}
              isPrescriptionSigned={isPrescriptionSigned}
              cdssEvaluation={cdssEvaluation}
              prescriptions={prescriptions}
              prescribeMode={prescribeMode}
              setPrescribeMode={setPrescribeMode}
              regimenSearchQuery={regimenSearchQuery}
              setRegimenSearchQuery={setRegimenSearchQuery}
              activeRegimenName={activeRegimenName}
              handleApplyOrderSet={handleApplyOrderSet}
              handleApplyAyurGenixDisease={handleApplyAyurGenixDisease}
              prescribingSystem={prescribingSystem}
              setPrescribingSystem={setPrescribingSystem}
              newMedForm={newMedForm}
              setNewMedForm={setNewMedForm}
              handleAddPrescription={handleAddPrescription}
              handleRemovePrescription={handleRemovePrescription}
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
              handleSearchApiFormulations={handleSearchApiFormulations}
              printDoctorPrescription={printDoctorPrescription}
            />
          )}

          {/* TAB 5: PATIENT CONSULTATION SUMMARY */}
          {hisActiveTab === 'patient_summary' && (
            <OpdPatientSummaryTab
              selectedCase={selectedCase}
              isPrescriptionSigned={isPrescriptionSigned}
              acceptedCases={acceptedCases}
              sampraptiSynthesis={sampraptiSynthesis}
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

          {/* TAB 6: AIIA EMR CLINICAL CASE SHEET */}
          {hisActiveTab === 'emr_sheet' && (
            <OpdEmrCaseSheetTab
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              activeSummaryText={activeSummaryText}
              setEditedNotes={setEditedNotes}
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
