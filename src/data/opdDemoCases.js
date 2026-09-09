import { SAMPLE_DOCUMENTS } from '../services/ocrService';

export const OPD_DEMO_CASES = [
  {
    token: 'AYU-104',
    crNo: '2026/AIIA/9842',
    uhid: 'UHID-2026-89421',
    id: 'case-demo-1',
    timestamp: new Date().toISOString(),
    waitTime: '8m ago',
    triageLevel: 'Urgent (Pitta Aggravation)',
    patient: {
      name: 'Sunita Devi',
      age: 52,
      gender: 'Female',
      hhid: 'HH-2026-894',
      abhaId: '91-8472-1092-4820',
      phone: '9876543210',
      bloodGroup: 'B +ve',
      category: 'Ayushman Bharat (PM-JAY)'
    },
    vitals: {
      bp: '128/84 mmHg',
      pulse: '78 bpm (Manduka Gati / Pitta-Vata)',
      spo2: '98%',
      temp: '98.4 °F',
      weight: '64 kg',
      height: '162 cm',
      bmi: '24.4 (Sama Pramana)',
      painScale: '6 / 10 (Moderate Burning)',
      sugar: '112 mg/dL (RBS)'
    },
    intake: {
      complaintId: 'digestive_issues',
      complaintLabel: 'Amlapitta & Severe Burning Epigastric Pain (अम्लपित्त)',
      namasteCode: 'NAMASTE-AYU-AML-01',
      namasteTerm: 'Amlapitta (Hyperchlorhydria / Acid Dyspepsia)',
      icd11Code: 'MD12.0',
      clinicalMode: 'ayush',
      pastConditions: ['hypertension', 'acid_peptic'],
      knownAllergies: ['sulfa'],
      currentMedications: ['Telmisartan 40mg', 'Pantoprazole 40mg'],
      answers: {
        site: 'Upper abdomen & Epigastrium (Amashaya / Hrid-Kantha)',
        onset: 'Gradual onset over 6 months, severe acute flare-up post spicy meals',
        character: 'Intense burning sensation (Vidaha / Daha) with acid belching',
        radiation: 'Spreads upwards into chest and retrosternal throat (Urdhwaga Amlapitta)',
        associatedSymptoms: ['Acid Reflux / Burping', 'Nausea / Vomiting (Chhardi)', 'Sour Belching (Amla Udgara)', 'Headache'],
        timing: 'Empty stomach & late night',
        severityScore: 'Moderate (VAS 6 / 10)'
      }
    },
    pariksha: {
      prakritiResult: {
        vataPct: 35,
        pittaPct: 55,
        kaphaPct: 10,
        dominant: 'Pitta-Vata Prakriti (Pittadhika)'
      },
      vikritiResult: {
        vataPct: 25,
        pittaPct: 65,
        kaphaPct: 10,
        dominant: 'Pittaja Vikriti (Pitta Vriddhi)',
        delta: { vata: -10, pitta: 10, kapha: 0 }
      },
      sara: {
        rasa_twak: { grade: 'Madhyama', percentage: 60, isWeak: false },
        rakta: { grade: 'Avara', percentage: 40, isWeak: true },
        mamsa: { grade: 'Madhyama', percentage: 65, isWeak: false },
        meda: { grade: 'Pravara', percentage: 80, isWeak: false },
        asthi: { grade: 'Madhyama', percentage: 55, isWeak: false },
        majja: { grade: 'Madhyama', percentage: 60, isWeak: false },
        shukra: { grade: 'Madhyama', percentage: 70, isWeak: false },
        sattva_sara: { grade: 'Madhyama', percentage: 60, isWeak: false }
      },
      pramana: {
        bmi: 24.4,
        bmiCategory: 'Sama (Normal Proportion)',
        whr: 0.81
      },
      samhanana: 'Madhyama',
      satmya: 'Madhyama (6-Rasa partial tolerance)',
      sattva: 'Madhyama',
      vyayamaShakti: { grade: 'Madhyama', shodhanaEligible: true },
      agni: 'Tikshnagni (Hyperactive / Rapid Digestion)',
      koshtha: 'Krura (Chronic Constipation / Vata Koshtha)',
      ashtavidha: {
        nadi: 'Manduka Gati (Pitta - Rapid Bounding)',
        mutra: 'Rakta-Peeta (Deep Yellow with Burning)',
        mala: 'Shuska-Grathita (Hard Dry Pellets)',
        jihwa: 'Lipta Shweta (Thick White Coated - Sama)',
        shabda: 'Spashta Tivra (Sharp Voice)',
        sparsha: 'Ushna Sweda (Warm & Sweaty)',
        druk: 'Rakta Peeta Daha (Reddish Sclera with Burning)',
        akriti: 'Madhyama Mesomorphic'
      },
      aharaVihara: {
        diet_type: 'Shakahari (Vegetarian)',
        dominant_rasa: 'Katu, Amla & Lavana (Spicy & Sour)',
        water_intake: 'Low (<1.5 L/day)',
        ratrijagarana: 'Late Night Awakeness (>12 AM)',
        stress_vyayama: 'Sedentary / Nil'
      }
    },
    documents: SAMPLE_DOCUMENTS,
    status: 'IN_CONSULTATION',
    redFlag: null
  },
  {
    token: 'AYU-105',
    crNo: '2026/AIIA/9843',
    uhid: 'UHID-2026-89422',
    id: 'case-demo-2',
    timestamp: new Date().toISOString(),
    waitTime: '16m ago',
    triageLevel: 'Routine (Vata Vyadhi)',
    patient: {
      name: 'Rameshwar Lal Sharma',
      age: 64,
      gender: 'Male',
      hhid: 'HH-2026-895',
      abhaId: '91-3829-5729-1029',
      phone: '9811223344',
      bloodGroup: 'O +ve',
      category: 'Senior Citizen (BPL)'
    },
    vitals: {
      bp: '136/88 mmHg',
      pulse: '72 bpm (Sarpa Gati / Vata)',
      spo2: '97%',
      temp: '98.2 °F',
      weight: '60 kg',
      height: '168 cm',
      bmi: '21.2 (Sama)',
      painScale: '7 / 10 (Severe Knee Stiffness)',
      sugar: '104 mg/dL (RBS)'
    },
    intake: {
      complaintId: 'joint_pain',
      complaintLabel: 'Sandhigata Vata & Severe Knee Stiffness (संधिवात)',
      namasteCode: 'NAMASTE-AYU-SAN-04',
      namasteTerm: 'Sandhigata Vata (Osteoarthrosis of Joints)',
      icd11Code: 'FA00',
      clinicalMode: 'ayush',
      pastConditions: ['osteoarthritis'],
      knownAllergies: [],
      currentMedications: ['Paracetamol 650mg PRN'],
      answers: {
        site: 'Bilateral Knee Joints (Janu Sandhi & Asthi-Snayu)',
        onset: 'Chronic >2 years, aggravated during winter and walking',
        character: 'Cracking crepitus (Sandhisphutana), severe morning stiffness',
        radiation: 'Localized to knee joints, calf and lower leg',
        associatedSymptoms: ['Difficulty climbing stairs', 'Swelling in joints', 'Sleep disturbance from pain'],
        severityScore: 'Severe (VAS 7 / 10)'
      }
    },
    pariksha: {
      prakritiResult: {
        vataPct: 65,
        pittaPct: 20,
        kaphaPct: 15,
        dominant: 'Vata-Pitta Prakriti (Vatadhika)'
      },
      vikritiResult: {
        vataPct: 75,
        pittaPct: 15,
        kaphaPct: 10,
        dominant: 'Vataja Vikriti (Vata Vriddhi)',
        delta: { vata: 10, pitta: -5, kapha: -5 }
      },
      sara: {
        rasa_twak: { grade: 'Madhyama', percentage: 55, isWeak: false },
        rakta: { grade: 'Madhyama', percentage: 60, isWeak: false },
        mamsa: { grade: 'Avara', percentage: 38, isWeak: true },
        meda: { grade: 'Madhyama', percentage: 50, isWeak: false },
        asthi: { grade: 'Avara', percentage: 35, isWeak: true },
        majja: { grade: 'Avara', percentage: 40, isWeak: true },
        shukra: { grade: 'Madhyama', percentage: 60, isWeak: false },
        sattva_sara: { grade: 'Madhyama', percentage: 55, isWeak: false }
      },
      pramana: {
        bmi: 21.2,
        bmiCategory: 'Sama (Normal Proportion)',
        whr: 0.88
      },
      samhanana: 'Avara (Loose Joint Structure)',
      satmya: 'Madhyama',
      sattva: 'Madhyama',
      vyayamaShakti: { grade: 'Avara', shodhanaEligible: false },
      agni: 'Visham (Irregular Agni)',
      koshtha: 'Krura (Hard Bowels)',
      ashtavidha: {
        nadi: 'Sarpa Gati (Vata - Rapid & Irregular)',
        mutra: 'Prakruta (Clear Normal)',
        mala: 'Vibandha (Constipated)',
        jihwa: 'Nirlipta (Uncoated)',
        shabda: 'Ksheena (Feeble)',
        sparsha: 'Sheeta Ruksha (Cold & Dry)',
        druk: 'Ruksha (Dry Sclera)',
        akriti: 'Krisha (Lean)'
      },
      aharaVihara: {
        diet_type: 'Shakahari',
        dominant_rasa: 'Kashaya & Katu',
        water_intake: 'Adequate',
        ratrijagarana: 'Nil',
        stress_vyayama: 'Moderate'
      }
    },
    documents: [],
    status: 'WAITING_OPD',
    redFlag: null
  },
  {
    token: 'AYU-106',
    crNo: '2026/AIIA/9844',
    uhid: 'UHID-2026-89423',
    id: 'case-demo-3',
    timestamp: new Date().toISOString(),
    waitTime: '22m ago',
    triageLevel: 'Routine (Prameha)',
    patient: {
      name: 'Rajesh Verma',
      age: 48,
      gender: 'Male',
      hhid: 'HH-2026-896',
      abhaId: '91-5821-4920-3021',
      phone: '9822334455',
      bloodGroup: 'B +ve',
      category: 'CGHS Beneficiary'
    },
    vitals: {
      bp: '130/82 mmHg',
      pulse: '76 bpm (Manduka-Hamsa)',
      spo2: '98%',
      temp: '98.6 °F',
      weight: '78 kg',
      height: '170 cm',
      bmi: '27.0 (Sthaulya)',
      painScale: '2 / 10 (Mild Burning Feet)',
      sugar: '184 mg/dL (PPBS)'
    },
    intake: {
      complaintId: 'diabetes_issues',
      complaintLabel: 'Madhumeha & Hastapada Daha / Peripheral Neuropathy (प्रमेह)',
      namasteCode: 'NAMASTE-AYU-PRA-02',
      namasteTerm: 'Madhumeha (Diabetes Mellitus Type-2)',
      icd11Code: '5A11',
      clinicalMode: 'ayush',
      pastConditions: ['diabetes', 'dyslipidemia'],
      knownAllergies: [],
      currentMedications: ['Metformin 500mg BD'],
      answers: {
        site: 'Both Feet & Hands (Hasta-Pada Tala)',
        onset: 'Gradual polyuria and burning soles over 8 months',
        character: 'Pricking sensation (Suptata / Toda) and excessive thirst (Trishna)',
        radiation: 'Distal extremities',
        associatedSymptoms: ['Prabhuta Mutrata (Excessive Urination)', 'Avila Mutrata (Turbid Urine)', 'Fatigue (Klama)'],
        severityScore: 'Moderate (VAS 5 / 10)'
      }
    },
    pariksha: {
      prakritiResult: {
        vataPct: 20,
        pittaPct: 35,
        kaphaPct: 45,
        dominant: 'Kapha-Pitta Prakriti (Kaphadhika)'
      },
      vikritiResult: {
        vataPct: 20,
        pittaPct: 30,
        kaphaPct: 50,
        dominant: 'Kaphaja Vikriti (Kleda Vriddhi)',
        delta: { vata: 0, pitta: -5, kapha: 5 }
      },
      sara: {
        rasa_twak: { grade: 'Madhyama', percentage: 60, isWeak: false },
        rakta: { grade: 'Madhyama', percentage: 60, isWeak: false },
        mamsa: { grade: 'Madhyama', percentage: 55, isWeak: false },
        meda: { grade: 'Pravara', percentage: 85, isWeak: false },
        asthi: { grade: 'Madhyama', percentage: 60, isWeak: false },
        majja: { grade: 'Madhyama', percentage: 50, isWeak: false },
        shukra: { grade: 'Madhyama', percentage: 55, isWeak: false },
        sattva_sara: { grade: 'Madhyama', percentage: 60, isWeak: false }
      },
      pramana: {
        bmi: 27.0,
        bmiCategory: 'Atisthaulya Grade 1',
        whr: 0.94
      },
      samhanana: 'Madhyama-Shithila',
      satmya: 'Madhyama',
      sattva: 'Madhyama',
      vyayamaShakti: { grade: 'Madhyama', shodhanaEligible: true },
      agni: 'Mandagni (Sluggish Digestion)',
      koshtha: 'Madhyama',
      ashtavidha: {
        nadi: 'Hamsa Gati (Kapha - Slow & Full)',
        mutra: 'Avila-Prabhuta (Turbid Pale)',
        mala: 'Snigdha-Guru (Heavy Mucous)',
        jihwa: 'Lipta Upadeha (Coated Thick)',
        shabda: 'Gambheera (Deep)',
        sparsha: 'Snigdha Sheeta (Cool & Moist)',
        druk: 'Snigdha (Oily Sclera)',
        akriti: 'Sthoola (Obese/Heavyset)'
      },
      aharaVihara: {
        diet_type: 'Mishrahari (Non-Veg / High Carb)',
        dominant_rasa: 'Madhura & Lavana',
        water_intake: 'High (>3.5 L/day)',
        ratrijagarana: 'Divaswapna (Day Sleeping)',
        stress_vyayama: 'Nil / Sedentary Desk Job'
      }
    },
    documents: [],
    status: 'WAITING_OPD',
    redFlag: null
  },
  {
    token: 'AYU-107',
    crNo: '2026/AIIA/9845',
    uhid: 'UHID-2026-89424',
    id: 'case-demo-4',
    timestamp: new Date().toISOString(),
    waitTime: '31m ago',
    triageLevel: 'Routine (Metabolic / Stree Roga)',
    patient: {
      name: 'Anita Kumari',
      age: 34,
      gender: 'Female',
      hhid: 'HH-2026-897',
      abhaId: '91-7482-9102-5819',
      phone: '9833445566',
      bloodGroup: 'A +ve',
      category: 'General / OPD'
    },
    vitals: {
      bp: '122/80 mmHg',
      pulse: '74 bpm (Kapha-Vata)',
      spo2: '99%',
      temp: '98.4 °F',
      weight: '72 kg',
      height: '155 cm',
      bmi: '29.9 (Sthaulya)',
      painScale: '4 / 10 (Lower Abdominal Heaviness)',
      sugar: '98 mg/dL (RBS)'
    },
    intake: {
      complaintId: 'general_wellness',
      complaintLabel: 'Sthaulya, Artava Dushti & Granthi Roga / PCOD (स्थौल्य एवं आर्तव दृष्टि)',
      namasteCode: 'NAMASTE-AYU-STH-01',
      namasteTerm: 'Sthaulya & Artava Kshaya (PCOD / Obesity)',
      icd11Code: '5B81',
      clinicalMode: 'ayush',
      pastConditions: ['polycystic_ovaries'],
      knownAllergies: [],
      currentMedications: ['Myo-Inositol Supplement'],
      answers: {
        site: 'Lower Abdomen & Generalised Adiposity (Kati & Medo Dhatu)',
        onset: 'Irregular menstrual cycle (Kritchra Artava) and weight gain over 1 year',
        character: 'Heaviness (Gaurava), lethargy (Alasya) and delayed cycles (>45 days)',
        radiation: 'Lumbar and pelvic region',
        associatedSymptoms: ['Facial acne', 'Facial hirsutism (Mukhadushika)', 'Mood swings'],
        severityScore: 'Moderate (VAS 4 / 10)'
      }
    },
    pariksha: {
      prakritiResult: {
        vataPct: 30,
        pittaPct: 20,
        kaphaPct: 50,
        dominant: 'Kapha-Vata Prakriti (Kaphadhika)'
      },
      vikritiResult: {
        vataPct: 35,
        pittaPct: 15,
        kaphaPct: 50,
        dominant: 'Kapha-Vataja Vikriti (Medo-Vaha Srotodushti)',
        delta: { vata: 5, pitta: -5, kapha: 0 }
      },
      sara: {
        rasa_twak: { grade: 'Madhyama', percentage: 55, isWeak: false },
        rakta: { grade: 'Avara', percentage: 40, isWeak: true },
        mamsa: { grade: 'Madhyama', percentage: 60, isWeak: false },
        meda: { grade: 'Pravara', percentage: 90, isWeak: false },
        asthi: { grade: 'Madhyama', percentage: 55, isWeak: false },
        majja: { grade: 'Madhyama', percentage: 55, isWeak: false },
        shukra: { grade: 'Avara', percentage: 35, isWeak: true },
        sattva_sara: { grade: 'Madhyama', percentage: 50, isWeak: false }
      },
      pramana: {
        bmi: 29.9,
        bmiCategory: 'Atisthaulya Grade 1',
        whr: 0.89
      },
      samhanana: 'Shithila (Loose Tissue Tone)',
      satmya: 'Madhyama',
      sattva: 'Madhyama',
      vyayamaShakti: { grade: 'Avara', shodhanaEligible: true },
      agni: 'Mandagni (Impaired Agni)',
      koshtha: 'Madhyama',
      ashtavidha: {
        nadi: 'Manda Hamsa Gati (Kapha Dominant)',
        mutra: 'Shweta Prakruta',
        mala: 'Vibandha Yukta (Constipated tendency)',
        jihwa: 'Sama Lipta (Thick White Coating)',
        shabda: 'Madhyama',
        sparsha: 'Sheeta Snigdha (Cold & Smooth)',
        druk: 'Prakruta',
        akriti: 'Sthoola (Overweight)'
      },
      aharaVihara: {
        diet_type: 'Shakahari (Bakery & Dairy Heavy)',
        dominant_rasa: 'Madhura & Amla',
        water_intake: 'Low (<1.5 L/day)',
        ratrijagarana: 'Late sleeping (>1 AM)',
        stress_vyayama: 'High stress / Sedentary'
      }
    },
    documents: [],
    status: 'WAITING_OPD',
    redFlag: null
  },
  {
    token: 'AYU-108',
    crNo: '2026/AIIA/9846',
    uhid: 'UHID-2026-89425',
    id: 'case-demo-5',
    timestamp: new Date().toISOString(),
    waitTime: '38m ago',
    triageLevel: 'Urgent (Pranavaha Sroto-Vikara)',
    patient: {
      name: 'Mohammed Irfan',
      age: 42,
      gender: 'Male',
      hhid: 'HH-2026-898',
      abhaId: '91-9201-3849-2048',
      phone: '9844556677',
      bloodGroup: 'AB +ve',
      category: 'Ayushman Bharat (PM-JAY)'
    },
    vitals: {
      bp: '134/86 mmHg',
      pulse: '88 bpm (Sarpa-Manduka Gati)',
      spo2: '94%',
      temp: '98.8 °F',
      weight: '62 kg',
      height: '165 cm',
      bmi: '22.8 (Sama)',
      painScale: '5 / 10 (Chest Constriction)',
      sugar: '108 mg/dL (RBS)'
    },
    intake: {
      complaintId: 'respiratory_issues',
      complaintLabel: 'Tamaka Shwasa & Nocturnal Paroxysmal Cough (तमक श्वास)',
      namasteCode: 'NAMASTE-AYU-SHW-03',
      namasteTerm: 'Tamaka Shwasa (Bronchial Asthma)',
      icd11Code: 'CA23',
      clinicalMode: 'ayush',
      pastConditions: ['asthma', 'allergic_rhinitis'],
      knownAllergies: ['dust', 'pollen'],
      currentMedications: ['Salbutamol Inhaler SOS'],
      answers: {
        site: 'Chest & Throat (Urah & Pranavaha Srotas)',
        onset: 'Recurrent wheezing attacks triggered by cold breeze and dust exposure',
        character: 'Ghurghuraka (Wheezing rattle), severe cough paroxysms at midnight (Nishi Kala)',
        radiation: 'Upper chest and neck',
        associatedSymptoms: ['Peenasa (Cold / Coryza)', 'Kasa (Spasmodic Cough)', 'Anidra (Sleep Disturbance)'],
        severityScore: 'Urgent (VAS 7 / 10)'
      }
    },
    pariksha: {
      prakritiResult: {
        vataPct: 50,
        pittaPct: 15,
        kaphaPct: 35,
        dominant: 'Vata-Kapha Prakriti (Vatadhika)'
      },
      vikritiResult: {
        vataPct: 60,
        pittaPct: 10,
        kaphaPct: 30,
        dominant: 'Vata-Kaphaja Vikriti (Pranavaha Avarana)',
        delta: { vata: 10, pitta: -5, kapha: -5 }
      },
      sara: {
        rasa_twak: { grade: 'Avara', percentage: 40, isWeak: true },
        rakta: { grade: 'Madhyama', percentage: 55, isWeak: false },
        mamsa: { grade: 'Madhyama', percentage: 55, isWeak: false },
        meda: { grade: 'Madhyama', percentage: 50, isWeak: false },
        asthi: { grade: 'Madhyama', percentage: 55, isWeak: false },
        majja: { grade: 'Madhyama', percentage: 55, isWeak: false },
        shukra: { grade: 'Madhyama', percentage: 60, isWeak: false },
        sattva_sara: { grade: 'Madhyama', percentage: 50, isWeak: false }
      },
      pramana: {
        bmi: 22.8,
        bmiCategory: 'Sama',
        whr: 0.84
      },
      samhanana: 'Madhyama',
      satmya: 'Avara (Hypersensitive to cold & allergens)',
      sattva: 'Madhyama',
      vyayamaShakti: { grade: 'Avara', shodhanaEligible: false },
      agni: 'Vishamagni (Irregular Digestive Fire)',
      koshtha: 'Krura',
      ashtavidha: {
        nadi: 'Sarpa-Manduka (Rapid / Spasmodic)',
        mutra: 'Prakruta',
        mala: 'Grathita',
        jihwa: 'Shweta Lipta',
        shabda: 'Ghurghura (Wheezing Voice)',
        sparsha: 'Sheeta (Cold Peripheral)',
        druk: 'Prakruta',
        akriti: 'Madhyama'
      },
      aharaVihara: {
        diet_type: 'Mishrahari',
        dominant_rasa: 'Katu & Lavana',
        water_intake: 'Adequate',
        ratrijagarana: 'Disturbed sleep due to cough',
        stress_vyayama: 'Nil'
      }
    },
    documents: [],
    status: 'WAITING_OPD',
    redFlag: 'SpO2 94% with Wheeze'
  },
  {
    token: 'AYU-109',
    crNo: '2026/AIIA/9847',
    uhid: 'UHID-2026-89426',
    id: 'case-demo-6',
    timestamp: new Date().toISOString(),
    waitTime: '45m ago',
    triageLevel: 'Routine (Twak Vikara)',
    patient: {
      name: 'Priya Nambiar',
      age: 29,
      gender: 'Female',
      hhid: 'HH-2026-899',
      abhaId: '91-3490-1849-5920',
      phone: '9855667788',
      bloodGroup: 'O -ve',
      category: 'General / OPD'
    },
    vitals: {
      bp: '118/76 mmHg',
      pulse: '76 bpm (Manduka Gati / Pitta)',
      spo2: '99%',
      temp: '98.4 °F',
      weight: '54 kg',
      height: '160 cm',
      bmi: '21.1 (Sama)',
      painScale: '6 / 10 (Severe Pruritus / Kandu)',
      sugar: '92 mg/dL (RBS)'
    },
    intake: {
      complaintId: 'skin_issues',
      complaintLabel: 'Vicharchika & Severe Pruritus with Erythematous Plaques (विचर्चिका / क्षुद्रकुष्ठ)',
      namasteCode: 'NAMASTE-AYU-VIC-01',
      namasteTerm: 'Vicharchika (Eczema / Dermatitis)',
      icd11Code: 'EA80',
      clinicalMode: 'ayush',
      pastConditions: ['atopic_dermatitis'],
      knownAllergies: ['synthetic_detergents'],
      currentMedications: ['Cetirizine 10mg PRN'],
      answers: {
        site: 'Bilateral Flexor Forearms & Popliteal Creases (Sandhi Sthana)',
        onset: 'Exacerbated post summer and spicy food over 4 months',
        character: 'Tivra Kandu (Intense Itching), Srava (Serous Oozing) & Shyavavarna (Lichenified Dark Skin)',
        radiation: 'Distal limbs',
        associatedSymptoms: ['Daha (Burning Sensation)', 'Pidaka (Papular Eruptions)', 'Dryness (Rukshata)'],
        severityScore: 'Moderate (VAS 6 / 10)'
      }
    },
    pariksha: {
      prakritiResult: {
        vataPct: 25,
        pittaPct: 55,
        kaphaPct: 20,
        dominant: 'Pitta-Vata Prakriti (Pittadhika)'
      },
      vikritiResult: {
        vataPct: 20,
        pittaPct: 60,
        kaphaPct: 20,
        dominant: 'Pittaja Vikriti (Rakta Dhatu Dushti)',
        delta: { vata: -5, pitta: 5, kapha: 0 }
      },
      sara: {
        rasa_twak: { grade: 'Avara', percentage: 32, isWeak: true },
        rakta: { grade: 'Avara', percentage: 38, isWeak: true },
        mamsa: { grade: 'Madhyama', percentage: 55, isWeak: false },
        meda: { grade: 'Madhyama', percentage: 50, isWeak: false },
        asthi: { grade: 'Madhyama', percentage: 60, isWeak: false },
        majja: { grade: 'Madhyama', percentage: 60, isWeak: false },
        shukra: { grade: 'Madhyama', percentage: 65, isWeak: false },
        sattva_sara: { grade: 'Madhyama', percentage: 55, isWeak: false }
      },
      pramana: {
        bmi: 21.1,
        bmiCategory: 'Sama',
        whr: 0.78
      },
      samhanana: 'Madhyama',
      satmya: 'Madhyama',
      sattva: 'Madhyama',
      vyayamaShakti: { grade: 'Madhyama', shodhanaEligible: true },
      agni: 'Tikshnagni (Sharp Fire)',
      koshtha: 'Mrudu (Loose Stools on milk)',
      ashtavidha: {
        nadi: 'Manduka Gati (Pitta Dominant)',
        mutra: 'Peeta Varna (Yellowish)',
        mala: 'Prakruta',
        jihwa: 'Rakta-Lipta (Red Edges)',
        shabda: 'Spashta',
        sparsha: 'Ushna Ruksha (Warm & Dry Plaques)',
        druk: 'Rakta Varna',
        akriti: 'Madhyama'
      },
      aharaVihara: {
        diet_type: 'Shakahari',
        dominant_rasa: 'Amla, Katu & Lavana (Fermented Foods)',
        water_intake: 'Low (<1.5 L/day)',
        ratrijagarana: 'Late sleeping (>12:30 AM)',
        stress_vyayama: 'Moderate'
      }
    },
    documents: [],
    status: 'WAITING_OPD',
    redFlag: null
  },
  {
    token: 'AYU-110',
    crNo: '2026/AIIA/9848',
    uhid: 'UHID-2026-89427',
    id: 'case-demo-7',
    timestamp: new Date().toISOString(),
    waitTime: '54m ago',
    triageLevel: 'Urgent (Vata Vyadhi / Acute Pain)',
    patient: {
      name: 'Harish Chandra',
      age: 58,
      gender: 'Male',
      hhid: 'HH-2026-900',
      abhaId: '91-6712-4920-1123',
      phone: '9866778899',
      bloodGroup: 'B -ve',
      category: 'Senior Citizen'
    },
    vitals: {
      bp: '138/88 mmHg',
      pulse: '80 bpm (Sarpa Gati / Vata)',
      spo2: '97%',
      temp: '98.2 °F',
      weight: '67 kg',
      height: '172 cm',
      bmi: '22.6 (Sama)',
      painScale: '8 / 10 (Severe Shooting Pain)',
      sugar: '110 mg/dL (RBS)'
    },
    intake: {
      complaintId: 'joint_pain',
      complaintLabel: 'Gridhrasi & Severe Radiating Lumbo-Sciatic Pain (गृध्रसी / सायटिका)',
      namasteCode: 'NAMASTE-AYU-GRI-01',
      namasteTerm: 'Gridhrasi (Sciatica / Lumbar Radiculopathy)',
      icd11Code: 'FA80',
      clinicalMode: 'ayush',
      pastConditions: ['lumbar_spondylosis', 'l4_l5_disc_bulge'],
      knownAllergies: [],
      currentMedications: ['Pregabalin 75mg', 'Tramadol PRN'],
      answers: {
        site: 'Lumbar Spine radiating down to Right Gluteal, Thigh, Calf & Foot (Kati-Sphik-Uru-Janu-Jangha-Pada)',
        onset: 'Acute flare-up post lifting heavy object 2 weeks ago',
        character: 'Toda (Pricking/Shooting Pain), Stambha (Spinal Stiffness) & Spandana (Fasciculations)',
        radiation: 'Down right lower extremity',
        associatedSymptoms: ['Suptata (Numbness in toes)', 'Difficulty walking (Gati Sanga)', 'Aggravated by bending forward'],
        severityScore: 'Severe (VAS 8 / 10)'
      }
    },
    pariksha: {
      prakritiResult: {
        vataPct: 70,
        pittaPct: 20,
        kaphaPct: 10,
        dominant: 'Vata Prakriti (Kevala Vata)'
      },
      vikritiResult: {
        vataPct: 80,
        pittaPct: 15,
        kaphaPct: 5,
        dominant: 'Vataja Vikriti (Dhatukshaya Janya Vata Prakopa)',
        delta: { vata: 10, pitta: -5, kapha: -5 }
      },
      sara: {
        rasa_twak: { grade: 'Madhyama', percentage: 50, isWeak: false },
        rakta: { grade: 'Madhyama', percentage: 55, isWeak: false },
        mamsa: { grade: 'Avara', percentage: 40, isWeak: true },
        meda: { grade: 'Madhyama', percentage: 50, isWeak: false },
        asthi: { grade: 'Avara', percentage: 30, isWeak: true },
        majja: { grade: 'Avara', percentage: 35, isWeak: true },
        shukra: { grade: 'Madhyama', percentage: 55, isWeak: false },
        sattva_sara: { grade: 'Madhyama', percentage: 50, isWeak: false }
      },
      pramana: {
        bmi: 22.6,
        bmiCategory: 'Sama',
        whr: 0.86
      },
      samhanana: 'Avara (Weak Spine & Connective Tissue)',
      satmya: 'Madhyama',
      sattva: 'Madhyama',
      vyayamaShakti: { grade: 'Avara', shodhanaEligible: false },
      agni: 'Vishamagni',
      koshtha: 'Krura (Severe Constipation tendency)',
      ashtavidha: {
        nadi: 'Vataja Sarpa Gati (Rapid & Thin)',
        mutra: 'Prakruta',
        mala: 'Vibandha',
        jihwa: 'Nirlipta Shushka (Dry)',
        shabda: 'Ksheena',
        sparsha: 'Sheeta Ruksha',
        druk: 'Ruksha',
        akriti: 'Krisha (Lean)'
      },
      aharaVihara: {
        diet_type: 'Shakahari',
        dominant_rasa: 'Katu & Tikta',
        water_intake: 'Low (<1 L/day)',
        ratrijagarana: 'Severe sleep disturbance from pain',
        stress_vyayama: 'Heavy travel on motorcycle / Physical strain'
      }
    },
    documents: [],
    status: 'WAITING_OPD',
    redFlag: 'Severe SLR Test +ve (30° Right Leg)'
  }
];
