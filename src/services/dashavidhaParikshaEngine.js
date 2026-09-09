/**
 * Dashavidha Pariksha Clinical Scoring Engine (Layers 1 & 2)
 * Classical 10-Fold Ayurvedic Clinical Examination Framework
 * 
 * Dimensions:
 * 1. Prakriti (Baseline Genotypic/Phenotypic Constitution - V/P/K %)
 * 2. Vikriti (Current Pathological Imbalance - V/P/K % & Delta Vector)
 * 3. Sara (8 Dhatu Structural & Functional Integrity: Twak, Rakta, Mamsa, Meda, Asthi, Majja, Shukra, Sattva)
 * 4. Samhanana (Compactness & Skeletal-Muscular Architecture)
 * 5. Pramana (Anthropometric Proportions: BMI, WHR, Angula Proportions)
 * 6. Satmya (Adaptability & 6-Rasa Compatibility Profile)
 * 7. Sattva (Psychological Resilience & Pain Tolerance)
 * 8. Ahara Shakti (Metabolic Capacity: Abhyavaharana + Jarana Shakti & Agni Type)
 * 9. Vyayama Shakti (Physical Stamina & Shodhana Eligibility)
 * 10. Vaya (Chronological & Biological Age Stage with Physiological Dosha)
 */

import { PRAKRITI_20_QUESTIONS, determinePrakriti } from './prakritiDetermineService';

// ---------------------------------------------------------------------------
// 1. VIKRITI 12-QUESTION ACUTE/CURRENT STATE QUESTIONNAIRE
// ---------------------------------------------------------------------------
export const VIKRITI_QUESTIONS = [
  {
    id: 'v_sleep',
    labelEn: 'Current Sleep Pattern (Last 2-4 weeks)',
    labelHi: 'वर्तमान में नींद का स्वरूप (पिछले २-४ सप्ताह)',
    options: [
      { value: 'vata', score: { v: 10, p: 0, k: 0 }, labelEn: 'Disturbed, interrupted, insomnia, light sleep', labelHi: 'अशांत, टूटी हुई नींद, अनिद्रा या कम नींद' },
      { value: 'pitta', score: { v: 0, p: 10, k: 0 }, labelEn: 'Moderate sleep, vivid/fiery dreams, wakes up warm', labelHi: 'मध्यम नींद, तेज सपने, पसीने व गर्मी से जागना' },
      { value: 'kapha', score: { v: 0, p: 0, k: 10 }, labelEn: 'Excessive sleep, daytime drowsiness, heavy morning feeling', labelHi: 'अत्यधिक नींद, दिन में आलस्य व सुबह भारीपन' }
    ]
  },
  {
    id: 'v_digestion',
    labelEn: 'Current Digestion & Gut Comfort',
    labelHi: 'वर्तमान पाचन एवं पेट की स्थिति',
    options: [
      { value: 'vata', score: { v: 10, p: 0, k: 0 }, labelEn: 'Gas, flatulence, bloating, variable appetite (Vishamagni)', labelHi: 'गैस, पेट फूलना, अनियमित भूख (विषमाग्नि)' },
      { value: 'pitta', score: { v: 0, p: 10, k: 0 }, labelEn: 'Burning acid reflux, excessive intense hunger, heartburn (Tikshnagni)', labelHi: 'खट्टी डकारें, सीने में जलन, तेज भूख (तीक्ष्णाग्नि)' },
      { value: 'kapha', score: { v: 0, p: 0, k: 10 }, labelEn: 'Sluggish digestion, heaviness in chest/abdomen after eating, low appetite (Mandagni)', labelHi: 'धीमा पाचन, भोजन बाद भारीपन, कम भूख (मंदाग्नि)' }
    ]
  },
  {
    id: 'v_bowel',
    labelEn: 'Current Bowel Evacuation Pattern',
    labelHi: 'वर्तमान मल त्याग की स्थिति',
    options: [
      { value: 'vata', score: { v: 10, p: 0, k: 0 }, labelEn: 'Constipated, hard dry stools, irregular frequency', labelHi: 'कब्ज, सूखा व कड़ा मल, अनियमित' },
      { value: 'pitta', score: { v: 0, p: 10, k: 0 }, labelEn: 'Loose, frequent, burning sensation during defecation', labelHi: 'ढीला मल, बार-बार जाना, शौच के समय जलन' },
      { value: 'kapha', score: { v: 0, p: 0, k: 10 }, labelEn: 'Sticky, mucus-laden (Ama), heavy, slow evacuation', labelHi: 'चिपचिपा, आंवयुक्त, भारी व देर से साफ होना' }
    ]
  },
  {
    id: 'v_temperature',
    labelEn: 'Current Temperature & Weather Sensitivity',
    labelHi: 'तापमान व मौसम के प्रति संवेदनशीलता',
    options: [
      { value: 'vata', score: { v: 10, p: 0, k: 0 }, labelEn: 'Extreme cold intolerance, cold extremities, relief with warmth', labelHi: 'अधिक ठंड लगना, हाथ-पैर ठंडे रहना, गर्माहट से राहत' },
      { value: 'pitta', score: { v: 0, p: 10, k: 0 }, labelEn: 'Heat intolerance, hot flushes, profuse sweating, thirst', labelHi: 'गर्मी बिल्कुल सहन न होना, अधिक पसीना व प्यास' },
      { value: 'kapha', score: { v: 0, p: 0, k: 10 }, labelEn: 'Dislike of damp/cold humid weather, congestion in winters', labelHi: 'नम व ठंडे मौसम से परेशानी, कफ जमना' }
    ]
  },
  {
    id: 'v_joints_muscles',
    labelEn: 'Current Joint & Muscular Sensation',
    labelHi: 'जोड़ों व मांसपेशियों की वर्तमान स्थिति',
    options: [
      { value: 'vata', score: { v: 10, p: 0, k: 0 }, labelEn: 'Sharp, shifting aches, cracking sounds (crepitus), stiffness', labelHi: 'तीव्र बदलता दर्द, चटकने की आवाज, जकड़न' },
      { value: 'pitta', score: { v: 0, p: 10, k: 0 }, labelEn: 'Inflammation, redness, burning joint warmth, tenderness', labelHi: 'जोड़ों में लाली, जलन, गर्माहट व सूजन' },
      { value: 'kapha', score: { v: 0, p: 0, k: 10 }, labelEn: 'Heavy, sluggish joints, dull persistent ache, water retention/edema', labelHi: 'भारीपन, सुन्नता, मंद दर्द, जलभराव/सूजन' }
    ]
  },
  {
    id: 'v_skin_hair',
    labelEn: 'Current Skin & Scalp Condition',
    labelHi: 'त्वचा एवं सिर की वर्तमान स्थिति',
    options: [
      { value: 'vata', score: { v: 10, p: 0, k: 0 }, labelEn: 'Extremely dry, peeling, rough skin, brittle hair', labelHi: 'अत्यधिक रूखापन, त्वचा फटना, बाल झड़ना' },
      { value: 'pitta', score: { v: 0, p: 10, k: 0 }, labelEn: 'Rashes, urticaria, redness, acne, burning sensations', labelHi: 'पित्ती, लाल चकत्ते, मुंहासे, जलन' },
      { value: 'kapha', score: { v: 0, p: 0, k: 10 }, labelEn: 'Oily skin, clogged pores, excessive moisture/itching', labelHi: 'अत्यधिक तैलीय त्वचा, खुजली, चिपचिपापन' }
    ]
  },
  {
    id: 'v_mind_emotion',
    labelEn: 'Current Emotional & Mental State',
    labelHi: 'वर्तमान मानसिक व भावनात्मक स्थिति',
    options: [
      { value: 'vata', score: { v: 10, p: 0, k: 0 }, labelEn: 'Anxiety, restlessness, racing thoughts, worry, forgetfulness', labelHi: 'चिंता, घबराहट, मन की चंचलता, भय' },
      { value: 'pitta', score: { v: 0, p: 10, k: 0 }, labelEn: 'Irritability, anger, frustration, impatient, critical', labelHi: 'क्रोध, चिड़चिड़ापन, अधीरता, गुस्सा आना' },
      { value: 'kapha', score: { v: 0, p: 0, k: 10 }, labelEn: 'Lethargy, attachment, lack of motivation, dullness, depression', labelHi: 'आलस्य, वैराग्य का अभाव, उदासी, भारीपन' }
    ]
  },
  {
    id: 'v_mouth_taste',
    labelEn: 'Current Taste in Mouth (Mukha Vairasya)',
    labelHi: 'मुंह का वर्तमान स्वाद',
    options: [
      { value: 'vata', score: { v: 10, p: 0, k: 0 }, labelEn: 'Astringent (Kashaya) or bitter dry taste', labelHi: 'कसैला या सूखा कड़वा स्वाद' },
      { value: 'pitta', score: { v: 0, p: 10, k: 0 }, labelEn: 'Sour (Amla) or pungent/metallic taste', labelHi: 'खट्टा, कड़वा या जलनदार स्वाद' },
      { value: 'kapha', score: { v: 0, p: 0, k: 10 }, labelEn: 'Sweet (Madhura), salty, or slimy coated feeling', labelHi: 'मीठा स्वाद या चिपचिपा लारयुक्त अहसास' }
    ]
  }
];

// ---------------------------------------------------------------------------
// 2. SARA (8 DHATUS) ASSESSMENT QUESTIONNAIRE & METRICS
// ---------------------------------------------------------------------------
export const SARA_DHATU_METRICS = [
  {
    dhatuId: 'rasa_twak',
    nameEn: 'Twak / Rasa Sara (Lymphatic & Integumentary Essence)',
    nameHi: 'त्वक् / रस सार (रस धातु एवं त्वचा सौष्ठव)',
    subQuestions: [
      { id: 'twak_texture', labelEn: 'Skin luster, unctuousness, smoothness, soft thin body hair', labelHi: 'त्वचा की चमक, स्निग्धता, कोमलता व सूक्ष्म रोम' },
      { id: 'twak_glow', labelEn: 'Resistance to dry skin diseases & youthful glow', labelHi: 'त्वचा रोगों से रक्षा व कान्ति' }
    ]
  },
  {
    dhatuId: 'rakta',
    nameEn: 'Rakta Sara (Hemic / Blood Tissue Essence)',
    nameHi: 'रक्त सार (रक्त धातु व परिसंचरण)',
    subQuestions: [
      { id: 'rakta_color', labelEn: 'Radiant copper-pink nails, lips, palate, tongue, palms & conjunctiva', labelHi: 'ताम्र-गुलाबी होंठ, जीभ, तालु, नाखून व हथेलियां' },
      { id: 'rakta_vitality', labelEn: 'High vitality, normal thermo-regulation, healthy circulation', labelHi: 'उत्तम तेज, रक्त संचार व जीवन शक्ति' }
    ]
  },
  {
    dhatuId: 'mamsa',
    nameEn: 'Mamsa Sara (Muscle Tissue Essence)',
    nameHi: 'मांस सार (मांसपेशी संहति व स्थिरता)',
    subQuestions: [
      { id: 'mamsa_bulk', labelEn: 'Firm, well-covered temples, forehead, nape, shoulders, calves & joints', labelHi: 'शंख, ग्रीवा, स्कंध व पिंडलियों में दृढ़ मांसपेशियां' },
      { id: 'mamsa_strength', labelEn: 'High muscular endurance, courage, forgiveness & resilience to physical wear', labelHi: 'शारीरिक बल, क्षमाशीलता व स्थिरता' }
    ]
  },
  {
    dhatuId: 'meda',
    nameEn: 'Meda Sara (Adipose & Lipid Essence)',
    nameHi: 'मेद सार (स्नेह व अस्थि-संधि पोषकता)',
    subQuestions: [
      { id: 'meda_lubrication', labelEn: 'Lustrous, unctuous eyes, hair, teeth, sweet resonant voice, graceful physique', labelHi: 'नेत्र, केश व दांतों में प्राकृतिक स्निग्धता, मधुर स्वर' },
      { id: 'meda_endurance', labelEn: 'Healthy joint lubrication without excessive pathological obesity', labelHi: 'जोड़ों में उत्तम स्निग्धता व सुखमय सहिष्णुता' }
    ]
  },
  {
    dhatuId: 'asthi',
    nameEn: 'Asthi Sara (Osseous / Bone Tissue Essence)',
    nameHi: 'अस्थि सार (हड्डी व दंत ढांचा)',
    subQuestions: [
      { id: 'asthi_structure', labelEn: 'Dense, prominent head, chin, clavicles, ankles, teeth and large sturdy bones', labelHi: 'सिर, ठोड़ी, कंधे, कलाई, टखने व मजबूत दांत' },
      { id: 'asthi_stamina', labelEn: 'High skeletal load tolerance, freedom from osteoporosis/crepitus', labelHi: 'वजन उठाने की क्षमता, जोड़ों में चटकन का अभाव' }
    ]
  },
  {
    dhatuId: 'majja',
    nameEn: 'Majja Sara (Marrow & Neuro-tissue Essence)',
    nameHi: 'मज्जा सार (अस्थिमज्जा व तंत्रिका शक्ति)',
    subQuestions: [
      { id: 'majja_complexion', labelEn: 'Soft radiant body, prominent large rounded joints, deep melodic voice', labelHi: 'कोमल कान्ति, बड़े व पुष्ट जोड़, गंभीर स्वर' },
      { id: 'majja_intellect', labelEn: 'High intelligence, deep wisdom, sharp cognitive processing & clarity', labelHi: 'गंभीर बुद्धि, धारणा शक्ति व स्पष्ट समझ' }
    ]
  },
  {
    dhatuId: 'shukra',
    nameEn: 'Shukra Sara (Reproductive & Vitality Essence)',
    nameHi: 'शुक्र सार (प्रजनन व ओजस सार)',
    subQuestions: [
      { id: 'shukra_luster', labelEn: 'Bright captivating eyes, pleasing radiant smile, strong white teeth', labelHi: 'सौम्य-स्निग्ध आंखें, आकर्षक मुस्कान, चमकदार दांत' },
      { id: 'shukra_vigor', labelEn: 'High reproductive vitality, cheerfulness, robust immune vitality (Ojas)', labelHi: 'ओजस्वी स्वभाव, प्रसन्नता व दीर्घकालिक आरोग्य' }
    ]
  },
  {
    dhatuId: 'sattva_sara',
    nameEn: 'Sattva Sara (Mental & Consciousness Essence)',
    nameHi: 'सत्त्व सार (मनोबल व आत्मबल)',
    subQuestions: [
      { id: 'sattva_calm', labelEn: 'Steadfast mind under severe crisis, gratitude, courage, high moral strength', labelHi: 'विपत्ति में धैर्य, कृतज्ञता, शुचिता व साहस' },
      { id: 'sattva_memory', labelEn: 'Superior long-term memory, emotional mastery, meditative stability', labelHi: 'उत्तम स्मृति, ध्यान व मानसिक समता' }
    ]
  }
];

// ---------------------------------------------------------------------------
// 3. LAYER 2 NORMALIZED SCORING ENGINE
// ---------------------------------------------------------------------------

/**
 * Computes Vikriti percentage ratio and delta vector relative to Prakriti
 */
export function calculateVikritiScore(vikritiAnswers = {}, baselinePrakriti = { vataPct: 33, pittaPct: 33, kaphaPct: 34 }) {
  let vRaw = 0;
  let pRaw = 0;
  let kRaw = 0;
  let totalCount = 0;

  VIKRITI_QUESTIONS.forEach((q) => {
    const ansVal = vikritiAnswers[q.id];
    if (ansVal) {
      const opt = q.options.find(o => o.value === ansVal);
      if (opt && opt.score) {
        vRaw += opt.score.v;
        pRaw += opt.score.p;
        kRaw += opt.score.k;
        totalCount++;
      }
    }
  });

  // Default fallback if sparse
  if (totalCount === 0) {
    vRaw = baselinePrakriti.vataPct || 33;
    pRaw = baselinePrakriti.pittaPct || 33;
    kRaw = baselinePrakriti.kaphaPct || 34;
  }

  const sum = Math.max(1, vRaw + pRaw + kRaw);
  const vataPct = Math.round((vRaw / sum) * 100);
  const pittaPct = Math.round((pRaw / sum) * 100);
  const kaphaPct = 100 - (vataPct + pittaPct);

  // Calculate Critical Delta: Delta = Vikriti - Prakriti
  const pV = baselinePrakriti.vataPct || 33;
  const pP = baselinePrakriti.pittaPct || 33;
  const pK = baselinePrakriti.kaphaPct || 34;

  const deltaVata = vataPct - pV;
  const deltaPitta = pittaPct - pP;
  const deltaKapha = kaphaPct - pK;

  // Determine dominant Vikriti dosha
  let dominant = 'Sama (Balanced)';
  if (vataPct >= 45 && vataPct > pittaPct && vataPct > kaphaPct) dominant = 'Vataja Vikriti (Vata Vriddhi)';
  else if (pittaPct >= 45 && pittaPct > vataPct && pittaPct > kaphaPct) dominant = 'Pittaja Vikriti (Pitta Vriddhi)';
  else if (kaphaPct >= 45 && kaphaPct > vataPct && kaphaPct > pittaPct) dominant = 'Kaphaja Vikriti (Kapha Vriddhi)';
  else if (vataPct >= 35 && pittaPct >= 35) dominant = 'Vata-Pitta Vikriti (Samsarga)';
  else if (pittaPct >= 35 && kaphaPct >= 35) dominant = 'Pitta-Kapha Vikriti (Samsarga)';
  else if (vataPct >= 35 && kaphaPct >= 35) dominant = 'Vata-Kapha Vikriti (Samsarga)';
  else dominant = 'Tridoshaja Vikriti (Sannipata)';

  return {
    vataPct,
    pittaPct,
    kaphaPct,
    dominant,
    delta: {
      vata: deltaVata,
      pitta: deltaPitta,
      kapha: deltaKapha
    },
    rawScore: { vRaw, pRaw, kRaw }
  };
}

/**
 * Computes individual 8-fold Sara scores and classifies into Pravara / Madhyama / Avara
 */
export function calculateSaraScores(saraAnswers = {}) {
  const result = {};

  SARA_DHATU_METRICS.forEach((dhatu) => {
    let scoreSum = 0;
    let maxScore = dhatu.subQuestions.length * 2; // scale: 0 (Avara), 1 (Madhyama), 2 (Pravara)

    dhatu.subQuestions.forEach((q) => {
      const val = saraAnswers[q.id] !== undefined ? Number(saraAnswers[q.id]) : 1; // default Madhyama
      scoreSum += val;
    });

    const pct = Math.round((scoreSum / maxScore) * 100);
    let grade = 'Madhyama';
    let gradeHi = 'मध्यम सार';
    if (pct >= 75) {
      grade = 'Pravara';
      gradeHi = 'प्रवर सार (उत्तम)';
    } else if (pct < 45) {
      grade = 'Avara';
      gradeHi = 'अवर सार (हीन)';
    }

    result[dhatu.dhatuId] = {
      nameEn: dhatu.nameEn,
      nameHi: dhatu.nameHi,
      percentage: pct,
      grade,
      gradeHi,
      isWeak: grade === 'Avara'
    };
  });

  return result;
}

/**
 * Calculates Pramana Anthropometrics (BMI, WHR, Angula proportion flags)
 */
export function calculatePramana(heightCm = 170, weightKg = 68, waistCm = 80, hipCm = 95, gender = 'male') {
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  const whr = Number((waistCm / Math.max(1, hipCm)).toFixed(2));

  let bmiCategory = 'Sama (Normal Proportion)';
  let bmiClass = 'normal';
  if (bmi < 18.5) {
    bmiCategory = 'Atikrisha (Underweight / Emaciated)';
    bmiClass = 'atikrisha';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Sthula (Overweight / Medovriddhi)';
    bmiClass = 'sthula';
  } else if (bmi >= 30) {
    bmiCategory = 'Atisthula (Obese / Ati-medas)';
    bmiClass = 'atisthula';
  }

  const isWhrElevated = gender.toLowerCase() === 'female' ? whr > 0.85 : whr > 0.90;

  // Classical Angula stature indicators
  const statureFlag = heightCm > 185 ? 'Atidirgha (Excessively Tall)' : (heightCm < 150 ? 'Atihrasva (Short Stature)' : 'Sama Pramana');

  return {
    heightCm,
    weightKg,
    bmi,
    whr,
    bmiCategory,
    bmiClass,
    isWhrElevated,
    statureFlag,
    balaPrognosis: (bmiClass === 'normal' && !isWhrElevated) ? 'Pravara' : ((bmiClass === 'atisthula' || bmiClass === 'atikrisha') ? 'Avara' : 'Madhyama')
  };
}

/**
 * Calculates Ahara Shakti (Abhyavaharana + Jarana) & Agni status
 */
export function calculateAharaShakti(intake = 'moderate', jaranaTimeHours = 4, postMealFeeling = 'normal') {
  let agniType = 'Samagni (Balanced)';
  let agniCode = 'sama';
  let aharaBala = 'Madhyama';

  if (jaranaTimeHours <= 2.5 && postMealFeeling === 'burning_hunger') {
    agniType = 'Tikshnagni (Hyperactive / Rapid)';
    agniCode = 'tikshna';
    aharaBala = intake === 'high' ? 'Pravara' : 'Madhyama';
  } else if (jaranaTimeHours >= 6 || postMealFeeling === 'heaviness_bloating') {
    agniType = 'Mandagni (Sluggish / Hypoactive)';
    agniCode = 'manda';
    aharaBala = 'Avara';
  } else if (postMealFeeling === 'irregular_gas') {
    agniType = 'Vishamagni (Erratic / Fluctuating)';
    agniCode = 'vishama';
    aharaBala = 'Madhyama';
  } else {
    agniType = 'Samagni (Balanced)';
    agniCode = 'sama';
    aharaBala = 'Pravara';
  }

  return {
    intakeCapacity: intake,
    jaranaTimeHours,
    postMealFeeling,
    agniType,
    agniCode,
    aharaBala
  };
}

/**
 * Evaluates Vaya (Age stage & Dosha dominance)
 */
export function calculateVaya(age = 45) {
  if (age < 16) {
    return {
      stage: 'Bala (Childhood / Growth Stage)',
      stageHi: 'बाल्यावस्था',
      doshaDominance: 'Kapha',
      chikitsaNote: 'Mridu Chikitsa, Ksheerapa/Annada, Avoid rigorous Shodhana'
    };
  } else if (age <= 60) {
    return {
      stage: 'Madhyama (Adult / Maintenance Stage)',
      stageHi: 'मध्यमावस्था',
      doshaDominance: 'Pitta',
      chikitsaNote: 'High Vyayama tolerance, suitable for full Panchakarma Shodhana'
    };
  } else {
    return {
      stage: 'Vriddha (Geriatric / Degenerative Stage)',
      stageHi: 'वृद्धावस्था',
      doshaDominance: 'Vata',
      chikitsaNote: 'Rasayana, Brimhana & Snehana Chikitsa, Avoid excessive Langhana'
    };
  }
}

/**
 * Unified Dashavidha Pariksha Master Evaluator (Layer 2)
 * Compiles all 10 dimensions into a structured, standardized clinical assessment document.
 */
export function runDashavidhaEvaluation({
  prakritiAnswers = {},
  vikritiAnswers = {},
  saraAnswers = {},
  samhanana = 'Madhyama',
  pramanaData = { heightCm: 168, weightKg: 65, waistCm: 82, hipCm: 96, gender: 'male' },
  satmya = 'Madhyama', // Pravara (Sarva-rasa), Madhyama, Avara (Eka-rasa)
  sattva = 'Madhyama', // Pravara (High stamina), Madhyama, Avara (Low)
  aharaInputs = { intake: 'moderate', jaranaTimeHours: 4, postMealFeeling: 'normal' },
  vyayamaShakti = 'Madhyama', // Pravara, Madhyama, Avara
  age = 45
}) {
  // 1. Prakriti
  const prakriti = determinePrakriti(prakritiAnswers);

  // 2. Vikriti & Delta
  const vikriti = calculateVikritiScore(vikritiAnswers, {
    vataPct: prakriti.vataPct,
    pittaPct: prakriti.pittaPct,
    kaphaPct: prakriti.kaphaPct
  });

  // 3. Sara (8 Dhatus)
  const sara = calculateSaraScores(saraAnswers);

  // 4. Samhanana
  const samhananaScore = {
    grade: samhanana,
    description: samhanana === 'Pravara' ? 'Su-samhata (Excellent Compactness)' : (samhanana === 'Avara' ? 'Heena-samhata (Poor Compactness)' : 'Madhyama-samhata (Moderate Compactness)')
  };

  // 5. Pramana
  const pramana = calculatePramana(
    pramanaData.heightCm,
    pramanaData.weightKg,
    pramanaData.waistCm,
    pramanaData.hipCm,
    pramanaData.gender
  );

  // 6. Satmya
  const satmyaScore = {
    grade: satmya,
    adaptation: satmya === 'Pravara' ? 'Sarva-Rasa Satmya (High Tolerance to all 6 tastes & climates)' : (satmya === 'Avara' ? 'Eka-Rasa Satmya (Low dietary flexibility)' : 'Madhyama Satmya (Moderate adaptation)')
  };

  // 7. Sattva
  const sattvaScore = {
    grade: sattva,
    approach: sattva === 'Pravara' ? 'Yuktivyapasraya + High mental resilience' : (sattva === 'Avara' ? 'Daivavyapasraya & Sattvavajaya (Psychological Support Needed)' : 'Balanced Yuktivyapasraya')
  };

  // 8. Ahara Shakti
  const aharaShakti = calculateAharaShakti(
    aharaInputs.intake,
    aharaInputs.jaranaTimeHours,
    aharaInputs.postMealFeeling
  );

  // 9. Vyayama Shakti
  const vyayama = {
    grade: vyayamaShakti,
    shodhanaEligible: vyayamaShakti !== 'Avara',
    exercisePrescription: vyayamaShakti === 'Pravara' ? 'Ardhshakti Vyayama (High Cardio/Asanas)' : (vyayamaShakti === 'Avara' ? 'Laghu Vyayama & Pranayama Only' : 'Madhyama Vyayama (Moderate)')
  };

  // 10. Vaya
  const vaya = calculateVaya(age);

  return {
    timestamp: new Date().toISOString(),
    layer: 'Layer_2_Normalized_Dashavidha',
    dimensions: {
      prakriti,
      vikriti,
      sara,
      samhanana: samhananaScore,
      pramana,
      satmya: satmyaScore,
      sattva: sattvaScore,
      aharaShakti,
      vyayamaShakti: vyayama,
      vaya
    },
    summarySignal: {
      dominantPrakriti: prakriti.dominant,
      dominantVikriti: vikriti.dominant,
      deltaSignal: vikriti.delta,
      primaryAgni: aharaShakti.agniType,
      weakDhatus: Object.keys(sara).filter(k => sara[k].isWeak),
      overallBala: (samhanana === 'Pravara' && sattva === 'Pravara' && vyayamaShakti === 'Pravara') ? 'Pravara Bala' : ((samhanana === 'Avara' || sattva === 'Avara' || vyayamaShakti === 'Avara') ? 'Avara Bala' : 'Madhyama Bala')
    }
  };
}
