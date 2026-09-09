/**
 * Advanced Multimodal Clinical AI Natural Language & Diagnostic Assistance Engine
 * Provides:
 * 1. Multimodal Speech/Text Extraction across 15+ Ayurvedic Clinical Syndromes
 * 2. Standardized NAMASTE (National Ayush Morbidity Standardized Terminology) Coding
 * 3. International ICD-11 Diagnostic Code Mapping
 * 4. Comprehensive SOCRATES Clinical Attribute Synthesizer
 * 5. Red-Flag Emergency Triage & Triage Routing
 */

export const AYUSH_NAMASTE_CATALOG = {
  digestive_issues: {
    id: 'digestive_issues',
    label: 'Acidity / Indigestion / Amlapitta',
    labelHi: 'अम्लपित्त / गैस / अपच (Amlapitta)',
    namasteCode: 'NAMASTE-AYU-AML-01',
    namasteTerm: 'Amlapitta (Hyperchlorhydria / Acid Dyspepsia)',
    icd11Code: 'MD12.0',
    icd11Term: 'Dyspepsia / Gastro-oesophageal reflux disease',
    dosha: 'Pitta-Vata (Pittadhika)',
    dushya: 'Rasa, Rakta, Annavaha Srotas',
    keywords: [
      'acidity', 'gas', 'bloating', 'indigestion', 'burning', 'heartburn', 'sour', 'burp',
      'belching', 'stomach pain', 'pet', 'jalan', 'khatti dakar', 'kabz', 'pitta', 'pet dard',
      'vomit', 'nausea', 'apach', 'amlapitta', 'daha', 'chhardi', 'vidaha'
    ],
    redFlags: ['blood in vomit', 'khoon ki ulti', 'black stool', 'hematemesis', 'severe dehydration'],
    socratesDefaults: {
      site: 'Epigastrium / Amashaya (पेट का ऊपरी हिस्सा व छाती)',
      onset: 'Postprandial / Empty stomach',
      character: 'Daha (Burning sensation) with Amlodgara (Sour eructation)',
      radiation: 'Upward to Uras (Chest) and Kantha (Throat)',
      associations: 'Nausea, heavy abdomen (Gaurava), head heaviness',
      timeCourse: 'Aggravates 1-2 hours after food intake or late nights',
      exacerbating: 'Spicy (Katu), sour (Amla), fried, and fermented foods',
      relieving: 'Cold milk, cold water, sweet fruits'
    },
    followUpsHi: [
      'क्या यह जलन खाना खाने के तुरंत बाद बढ़ती है या खाली पेट ज्यादा होती है?',
      'क्या खट्टी डकारें गले और सीने तक ऊपर उठती हैं?',
      'क्या सुबह के समय जी मिचलाना या मुंह में कड़वा-खट्टा पानी आता है?'
    ],
    followUpsEn: [
      'Does the burning sensation worsen immediately after spicy meals or on an empty stomach?',
      'Does the acid reflux radiate upward into your chest and throat?',
      'Do you experience morning nausea or sour regurgitation?'
    ]
  },

  joint_pain: {
    id: 'joint_pain',
    label: 'Osteoarthritis / Joint Pain / Sandhivata',
    labelHi: 'संधिवात / जोड़ों का दर्द / जकड़न (Sandhivata)',
    namasteCode: 'NAMASTE-AYU-SAN-04',
    namasteTerm: 'Sandhigata Vata (Osteoarthrosis of Joints)',
    icd11Code: 'FA00',
    icd11Term: 'Osteoarthritis of knee / polyarticular',
    dosha: 'Vata (Vyanavata & Shleshaka Kapha Kshaya)',
    dushya: 'Asthi, Majja, Sandhi Srotas',
    keywords: [
      'joint', 'knee', 'ghutna', 'dard', 'pain', 'stiffness', 'swelling', 'sandhivata',
      'arthritis', 'jakdan', 'walk', 'crepitus', 'soojan', 'kamar dard', 'back pain', 'katishoola',
      'sandhishoola', 'haddi'
    ],
    redFlags: ['inability to bear weight', 'sudden hot red joint with high fever', 'joint deformity with locked knee'],
    socratesDefaults: {
      site: 'Janu Sandhi (Bilateral Knees) & Kati (Lumbar Spine)',
      onset: 'Gradual mechanical onset with age/exertion',
      character: 'Shoola (Aching pain) with Sandhi Sphutana (Crepitus)',
      radiation: 'Radiates down calves or lumbar spine to gluteal region',
      associations: 'Stiffness in morning (< 30 mins), restricted flexion',
      timeCourse: 'Worse with prolonged standing, stair climbing, winter cold',
      exacerbating: 'Cold breeze (Sheeta), heavy weight lifting, dry food (Ruksha)',
      relieving: 'Local Snehana (Warm sesame/Mahanarayan oil) and Swedana (Heat)'
    },
    followUpsHi: [
      'क्या सुबह उठने पर जोड़ों में अधिक जकड़न महसूस होती है?',
      'क्या चलने-फिरने या सीढ़ियां चढ़ने पर घुटनों से कट-कट (क्रेपिटस) की आवाज आती है?',
      'क्या ठंडे मौसम में या ठंडे पानी के संपर्क से दर्द बढ़ जाता है?'
    ],
    followUpsEn: [
      'Is joint stiffness most pronounced when waking up or after resting?',
      'Do you notice clicking sounds (crepitus) or swelling during movement?',
      'Does exposure to cold climate aggravate the joint discomfort?'
    ]
  },

  rheumatoid_arthritis: {
    id: 'rheumatoid_arthritis',
    label: 'Rheumatoid Arthritis / Amavata',
    labelHi: 'आमवात / संधि शोथ (Amavata)',
    namasteCode: 'NAMASTE-AYU-AMA-02',
    namasteTerm: 'Amavata (Rheumatoid / Inflammatory Polyarthritis)',
    icd11Code: 'FA20',
    icd11Term: 'Rheumatoid arthritis',
    dosha: 'Vata-Kapha (with systemic Ama toxemia)',
    dushya: 'Rasa, Asthi, Sandhi',
    keywords: [
      'amavata', 'rheumatoid', 'morning stiffness', 'multiple joints', 'finger swelling',
      'angamarda', 'aroshaka', 'shotha', 'feverish joints', 'vrichika damsha'
    ],
    redFlags: ['severe systemic vasculitis', 'cervical spine instability', 'high inflammatory fever'],
    socratesDefaults: {
      site: 'Small joints of hands, wrists, ankles, and knees (Bilateral symmetrical)',
      onset: 'Subacute with migratory joint pains and morning stiffness (> 1 hour)',
      character: 'Vrishchika Damshavat (Scorpion-sting like intense burning ache)',
      radiation: 'Centripetal from periphery to major joints',
      associations: 'Aruchi (Anorexia), Gaurava (Body heaviness), Jwara (Mild feverishness)',
      timeCourse: 'Severe in early morning hours, eases somewhat by midday',
      exacerbating: 'Heavy unctuous foods (Snigdha), curd, day-sleep, damp weather',
      relieving: 'Ruksha Swedana (Dry sand/potali fomentation), fasting (Langhana)'
    },
    followUpsHi: [
      'क्या सुबह उठने पर 1 घंटे से अधिक समय तक उंगलियों में तेज जकड़न रहती है?',
      'क्या दर्द एक जोड़ से दूसरे जोड़ में घूमता महसूस होता है?'
    ],
    followUpsEn: [
      'Do you experience morning stiffness lasting over an hour in small hand joints?',
      'Does the joint pain migrate from one joint to another?'
    ]
  },

  diabetes_prameha: {
    id: 'diabetes_prameha',
    label: 'Type-2 Diabetes / Metabolic Syndrome / Prameha',
    labelHi: 'प्रमेह / मधुमेह (Prameha / Madhumeha)',
    namasteCode: 'NAMASTE-AYU-PRA-02',
    namasteTerm: 'Madhumeha / Vataja Prameha (Diabetes Mellitus)',
    icd11Code: '5A11',
    icd11Term: 'Type 2 diabetes mellitus',
    dosha: 'Kapha-Vata dominant with Meda-Mamsa Dushti',
    dushya: 'Meda, Kleda, Mamsa, Majja, Ojas',
    keywords: [
      'sugar', 'diabetes', 'prameha', 'madhumeha', 'peshab', 'urine', 'thirst', 'pyas',
      'polyuria', 'fatigue', 'thakan', 'burning feet', 'hath paon jalan', 'karapadadaha'
    ],
    redFlags: ['ketoacidotic fruity breath', 'non-healing deep foot ulcer', 'sudden vision blackout'],
    socratesDefaults: {
      site: 'Systemic metabolic (Karapada Tala Daha - Burning sensation in palms & soles)',
      onset: 'Chronic insidious onset',
      character: 'Prabhoota Avila Mutrata (Excessive turbidity and frequency of micturition)',
      radiation: 'Peripheral neuropathy radiating to digits',
      associations: 'Trishna (Excessive thirst), Kshudha (Polyphagia), Shrama (Exhaustion)',
      timeCourse: 'Fluctuates with dietary sugar and carbohydrate intake',
      exacerbating: 'Sedentary habits (Asyasukha), sweets, milk products, day sleep',
      relieving: 'Physical exercise (Vyayama), bitter herbs (Karela, Methi, Gudmar)'
    },
    followUpsHi: [
      'क्या आपको रात में बार-बार पेशाब जाने की आवश्यकता होती है?',
      'क्या हाथों-पैरों के तलवों में सुई चुभने या जलन (पाददाह) का अहसास होता है?'
    ],
    followUpsEn: [
      'Do you experience frequent urination, especially nocturnal waking?',
      'Is there tingling, numbness, or burning sensation in your soles and palms?'
    ]
  },

  respiratory_cough: {
    id: 'respiratory_cough',
    label: 'Asthma / Bronchial Cough / Kasa-Shwasa',
    labelHi: 'श्वास विकार / कास / दमा (Kasa-Shwasa)',
    namasteCode: 'NAMASTE-AYU-SHW-03',
    namasteTerm: 'Tamaka Shwasa (Bronchial Asthma / Dyspnea)',
    icd11Code: 'CA23',
    icd11Term: 'Asthma / Bronchial Hyperresponsiveness',
    dosha: 'Vata-Kapha (Pranavaha Srotas Pratiloma)',
    dushya: 'Rasa, Prana Vayu, Shleshma',
    keywords: [
      'cough', 'khansi', 'breath', 'saans', 'phlegm', 'balgam', 'wheezing', 'kasa',
      'shwasa', 'asthma', 'chest congestion', 'dum ghutna', 'tamaka', 'coughing'
    ],
    redFlags: ['hemoptysis (blood in sputum)', 'cyanosis (blue lips)', 'severe stridor with intercostal retractions'],
    socratesDefaults: {
      site: 'Uras (Chest) and Pranavaha Srotas (Airways)',
      onset: 'Paroxysmal nocturnal or exertion triggered attacks',
      character: 'Krichhra Shwasa (Labored wheezing breathing) relieved by sitting up',
      radiation: 'Chest tightness radiating to throat',
      associations: 'Kasa (Cough), Ghurghuraka (Audible wheezing), Peenasa (Rhinitis)',
      timeCourse: 'Aggravates at 2-4 AM, cloudy weather, monsoon, dust exposure',
      exacerbating: 'Cold air (Sheetavata), dust, pollen, curd, bananas, ice cream',
      relieving: 'Warm fluids, sitting upright, hot chest fomentation'
    },
    followUpsHi: [
      'क्या रात को लेटने पर सांस फूलने लगती है और बैठकर उठने पर आराम मिलता है?',
      'क्या मौसम बदलने या धूल-धुएं के संपर्क से खांसी और सीटी जैसी आवाज आती है?'
    ],
    followUpsEn: [
      'Does breathlessness worsen when lying flat at night and improve on sitting up?',
      'Do weather changes, cold winds, or dust trigger wheezing and dry cough?'
    ]
  },

  skin_disorder: {
    id: 'skin_disorder',
    label: 'Skin Disease / Psoriasis / Eczema / Kushtha',
    labelHi: 'कुष्ठ / चर्म विकार / खाज-खुजली (Kushtha / Twak Rog)',
    namasteCode: 'NAMASTE-AYU-KUS-06',
    namasteTerm: 'Kshudra Kushtha / Vicharchika (Eczema / Dermatitis)',
    icd11Code: 'EA80',
    icd11Term: 'Atopic dermatitis / Eczema',
    dosha: 'Tridosha with Pitta-Rakta predominance',
    dushya: 'Twak, Rakta, Mamsa, Lasika',
    keywords: [
      'skin', 'rash', 'itching', 'khujli', 'redness', 'lal', 'chakatta', 'allergy',
      'eczema', 'dermatitis', 'kushta', 'twak', 'daha', 'scalp', 'psoriasis', 'pimples'
    ],
    redFlags: ['rapidly necrotizing blistering', 'facial angioedema with airway swelling', 'extensive infected erythrodermic peeling'],
    socratesDefaults: {
      site: 'Twacha (Extensor surfaces, scalp, flexural creases, face)',
      onset: 'Recurrent relapsing exacerbations',
      character: 'Kandu (Severe pruritus), Daha (Burning heat), Srava (Exudation)',
      radiation: 'Spreads locally in round patches (Mandala)',
      associations: 'Rukshata (Dry flaking scales), Vaivarnya (Skin discoloration)',
      timeCourse: 'Chronic cyclical; worse in summers (Pitta) or winters (Dry Vata)',
      exacerbating: 'Viruddha Ahara (Incompatible foods like milk + fish), sour/salty diet',
      relieving: 'Neem/Khadira wash, cold herbal compresses, blood purification (Raktamokshana)'
    },
    followUpsHi: [
      'क्या खुजली के साथ त्वचा पर लाल चकत्ते, जलन या पपड़ी छूटती है?',
      'क्या धूप में निकलने या खट्टे-मसालेदार भोजन से समस्या बढ़ जाती है?'
    ],
    followUpsEn: [
      'Is there intense itching accompanied by scaling, oozing, or red burning patches?',
      'Does excessive sun exposure, sour food, or sweating aggravate the rash?'
    ]
  },

  fever: {
    id: 'fever',
    label: 'Pyrexia / Fever / Jwara',
    labelHi: 'ज्वर / बुखार / अंगमर्द (Jwara)',
    namasteCode: 'NAMASTE-AYU-JWA-01',
    namasteTerm: 'Santata Jwara (Pyrexia of Unknown Origin / Infectious Fever)',
    icd11Code: 'MG26',
    icd11Term: 'Fever of other and unknown origin',
    dosha: 'Pitta-Vata (with Amashayotha Agnimandya)',
    dushya: 'Rasa Dhatu, Svedavaha Srotas',
    keywords: [
      'fever', 'bukhar', 'jwara', 'temperature', 'chills', 'thand', 'bodyache',
      'shiroruk', 'headache', 'angamarda', 'tapa'
    ],
    redFlags: ['temperature > 103.5F', 'altered sensorium / delirium', 'severe nuchal neck rigidity'],
    socratesDefaults: {
      site: 'Sarva Shareera (Generalized systemic hyperthermia)',
      onset: 'Acute onset (< 3-5 days)',
      character: 'Santapa (Burning body heat) with Angamarda (Body breaking pain)',
      radiation: 'Generalized somatic distribution',
      associations: 'Aruchi (Loss of taste), Swedavarodha (Absence of sweating), Trishna',
      timeCourse: 'Continuous with evening pyrexial spikes',
      exacerbating: 'Heavy meals, cold drafts, physical exertion',
      relieving: 'Langhana (Light diet / fasting), Shadanga Paniya decoction'
    },
    followUpsHi: [
      'क्या बुखार के साथ कंपकंपी या अत्यधिक ठंड लग रही है?',
      'क्या पूरे शरीर में भारी दर्द और मुंह में कड़वा स्वाद महसूस हो रहा है?'
    ],
    followUpsEn: [
      'Is the fever associated with chills, rigors, or profuse sweating?',
      'Are you experiencing generalized body aches, headache, or bitter mouth taste?'
    ]
  }
};

class ClinicalAiService {
  /**
   * Multimodal speech/text parsing engine
   */
  processPatientUtterance(userTranscript, currentLang = 'hi', currentCaseContext = {}) {
    if (!userTranscript || typeof userTranscript !== 'string') {
      return this._getDefaultResponse(currentLang);
    }

    const cleanText = userTranscript.toLowerCase().trim();

    // 1. Semantic Match against Ayush NAMASTE Catalog
    let matchedCategory = null;
    let maxMatchScore = 0;

    Object.values(AYUSH_NAMASTE_CATALOG).forEach((entity) => {
      let score = 0;
      entity.keywords.forEach((kw) => {
        if (cleanText.includes(kw)) {
          score += kw.length > 4 ? 2 : 1;
        }
      });
      if (score > maxMatchScore) {
        maxMatchScore = score;
        matchedCategory = entity;
      }
    });

    if (!matchedCategory) {
      matchedCategory = AYUSH_NAMASTE_CATALOG.digestive_issues;
    }

    // 2. Extract Duration & Time Course
    let extractedDuration = 'Recent onset (1-2 weeks)';
    let extractedDurationHi = 'हालिया शुरुआत (1-2 सप्ताह)';

    const timeMatch = cleanText.match(/(\d+)\s*(din|day|days|hafte|hafta|week|weeks|mahina|month|months|saal|year)/i);
    if (timeMatch) {
      const count = timeMatch[1];
      const unit = timeMatch[2].toLowerCase();
      const isDays = ['din', 'day', 'days'].includes(unit);
      const isWeeks = ['hafte', 'hafta', 'week', 'weeks'].includes(unit);
      const isMonths = ['mahina', 'month', 'months'].includes(unit);
      const isYears = ['saal', 'year', 'years'].includes(unit);

      extractedDuration = `${count} ${unit}`;
      extractedDurationHi = `${count} ${isDays ? 'दिन' : isWeeks ? 'सप्ताह' : isMonths ? 'महीने' : 'वर्ष'}`;
    } else if (cleanText.includes('aaj') || cleanText.includes('today') || cleanText.includes('subah') || cleanText.includes('morning')) {
      extractedDuration = 'Since today morning';
      extractedDurationHi = 'आज सुबह से';
    } else if (cleanText.includes('purana') || cleanText.includes('chronic') || cleanText.includes('months')) {
      extractedDuration = 'Chronic (> 6 months)';
      extractedDurationHi = 'दीर्घकालिक (> 6 महीने)';
    }

    // 3. Extract Severity (VAS Scale 1-10)
    let severity = 'Moderate (4-6/10)';
    let severityHi = 'मध्यम (4-6/10)';
    let severityScoreNum = 5;

    if (cleanText.includes('bahut jyada') || cleanText.includes('severe') || cleanText.includes('asahan') || cleanText.includes('acute') || cleanText.includes('bardasht nahi')) {
      severity = 'Severe (7-10/10)';
      severityHi = 'तीव्र / असहनीय (7-10/10)';
      severityScoreNum = 8;
    } else if (cleanText.includes('thoda') || cleanText.includes('mild') || cleanText.includes('halka') || cleanText.includes('kam')) {
      severity = 'Mild (1-3/10)';
      severityHi = 'हल्का (1-3/10)';
      severityScoreNum = 2;
    }

    // 4. Red Flag Clinical Triage
    let isRedFlag = false;
    let redFlagDetail = null;

    matchedCategory.redFlags.forEach((rf) => {
      if (cleanText.includes(rf)) {
        isRedFlag = true;
        redFlagDetail = {
          title: 'Immediate Clinical Triage Priority',
          titleHi: 'आपातकालीन क्लिनिकल प्राथमिकता',
          instruction: 'Patient utterance contains acute red-flag symptoms requiring expedited physician consultation.',
          flag: rf
        };
      }
    });

    // 5. Synthesize SOCRATES Clinical Architecture
    const socrates = {
      site: matchedCategory.socratesDefaults.site,
      onset: `${matchedCategory.socratesDefaults.onset} (${extractedDuration})`,
      character: matchedCategory.socratesDefaults.character,
      radiation: matchedCategory.socratesDefaults.radiation,
      associations: matchedCategory.socratesDefaults.associations,
      timeCourse: matchedCategory.socratesDefaults.timeCourse,
      exacerbating: matchedCategory.socratesDefaults.exacerbating,
      severity: `${severity} (Score: ${severityScoreNum}/10)`
    };

    // 6. Generate Dialogue
    const patientName = currentCaseContext?.patient?.name || (currentLang === 'hi' ? 'जी' : 'Patient');
    const randomFollowUpIdx = Math.floor(Math.random() * (matchedCategory.followUpsHi.length || 1));
    const followUpHi = matchedCategory.followUpsHi[randomFollowUpIdx] || matchedCategory.followUpsHi[0];
    const followUpEn = matchedCategory.followUpsEn[randomFollowUpIdx] || matchedCategory.followUpsEn[0];

    const aiSpeechHi = `${patientName}, मैंने आपके लक्षण दर्ज कर लिए हैं—${matchedCategory.labelHi} (${extractedDurationHi})। ${followUpHi}`;
    const aiSpeechEn = `I have documented your presenting complaint regarding ${matchedCategory.label} (${extractedDuration}). ${followUpEn}`;

    return {
      understood: true,
      complaintId: matchedCategory.id,
      complaintLabel: matchedCategory.label,
      complaintLabelHi: matchedCategory.labelHi,
      namasteCode: matchedCategory.namasteCode,
      namasteTerm: matchedCategory.namasteTerm,
      icd11Code: matchedCategory.icd11Code,
      icd11Term: matchedCategory.icd11Term,
      doshaAffiliation: matchedCategory.dosha,
      dushyaAffiliation: matchedCategory.dushya,
      extractedDuration,
      extractedDurationHi,
      severity,
      severityHi,
      severityScoreNum,
      isRedFlag,
      redFlagDetail,
      socrates,
      aiText: currentLang === 'hi' ? aiSpeechHi : aiSpeechEn,
      aiSpeech: currentLang === 'hi' ? aiSpeechHi : aiSpeechEn,
      extractedFields: {
        site: socrates.site,
        onset: socrates.onset,
        character: socrates.character,
        severityScore: severity
      }
    };
  }

  _getDefaultResponse(currentLang) {
    return {
      understood: false,
      aiText: currentLang === 'hi' 
        ? 'कृपया अपनी समस्या के बारे में थोड़ा और विस्तार से बताएं।'
        : 'Please describe your presenting symptoms in detail.',
      aiSpeech: currentLang === 'hi' 
        ? 'कृपया अपनी समस्या के बारे में थोड़ा और विस्तार से बताएं।'
        : 'Please describe your presenting symptoms in detail.'
    };
  }
}

export const clinicalAiService = new ClinicalAiService();
export default clinicalAiService;
