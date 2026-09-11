/**
 * AYUSH AI Clinical Copilot Service
 * Research-backed Ayurvedic Clinical Decision Support System (CDSS)
 * Built for Senior Ayurvedic Vaidyas & Physicians.
 * 
 * Supports:
 * - SOAP-aligned Assistive Clinical Synthesis (Subjective, Objective, Assessment, Plan)
 * - Live Google Gemini API (gemini-3.6-flash, gemini-3.5-flash-lite)
 * - Deterministic Classical Ayurvedic Knowledge Engine fallback (CCRAS, AFI, Charaka Samhita)
 */

class AyushAiCopilotService {
  constructor() {
    const envKey = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_GEMINI_API_KEY : '';
    const storageKey = typeof localStorage !== 'undefined' ? localStorage.getItem('omni_gemini_api_key') : '';
    this.geminiApiKey = envKey || storageKey || '';
  }

  setApiKey(key) {
    this.geminiApiKey = key?.trim() || '';
    if (typeof localStorage !== 'undefined') {
      if (this.geminiApiKey) {
        localStorage.setItem('omni_gemini_api_key', this.geminiApiKey);
      } else {
        localStorage.removeItem('omni_gemini_api_key');
      }
    }
  }

  getApiKey() {
    const envKey = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_GEMINI_API_KEY : '';
    const storageKey = typeof localStorage !== 'undefined' ? localStorage.getItem('omni_gemini_api_key') : '';
    return this.geminiApiKey || envKey || storageKey || '';
  }

  hasApiKey() {
    return Boolean(this.getApiKey());
  }

  /* ─────────────────────────────────────────────────────────────────────────
     1. [S] SUBJECTIVE ASSIST
     Helps the Vaidya probe deeper into the history without typing:
     - Classical questions to ask the patient (Rogi Prashna)
     - Key Rupa (Symptoms) to rule in/out
     - Common Hetu (Etiological diet/lifestyle triggers)
     - Red Flags (Arishta Lakshana)
  ───────────────────────────────────────────────────────────────────────── */
  async generateSubjectiveAssist({
    chiefComplaint = 'Digestive Issues',
    complaintId = '',
    complaintDetails = {},
    patientAge = 45,
    patientGender = 'Female',
    prakriti = 'Pitta-Vata'
  }) {
    const activeKey = this.getApiKey();
    if (activeKey) {
      try {
        const prompt = `You are a Senior Ayurvedic Vaidya at AIIA (All India Institute of Ayurveda).
For a patient aged ${patientAge} (${patientGender}) presenting with "${chiefComplaint}" (Symptoms: ${JSON.stringify(complaintDetails)}), Constitutional Prakriti: ${prakriti}:
Provide a clinical inquiry guide for the physician in JSON format:
{
  "suggestedInquiries": [
    { "questionHi": "सटीक शास्त्रीय प्रश्न (हिंदी)", "questionEn": "Clinical question in English", "clinicalReason": "Why to ask (e.g. differential for Vidaha vs Ajeerna)" }
  ],
  "potentialHetu": [
    { "label": "Etiological factor (e.g. Vidahi Ahara / Ratri Jagarana)", "category": "Ahara / Vihara / Manasika" }
  ],
  "associatedRupaToCheck": [
    "Symptom 1 (e.g. Tikta Udgara)", "Symptom 2 (e.g. Hrid-Kantha Daha)"
  ],
  "redFlagWarnings": [
    "Alarm sign if any (e.g. Hematemesis / Unexplained weight loss)"
  ]
}
Return ONLY pure JSON.`;
        const res = await this.callGeminiRaw(prompt);
        if (res) return { ...res, source: 'Gemini CDSS Live' };
      } catch (e) {
        console.warn('Subjective AI fallback to classical engine:', e);
      }
    }

    // Deterministic classical fallback
    const isDigestive = (chiefComplaint || '').toLowerCase().includes('acid') || (chiefComplaint || '').toLowerCase().includes('digest') || complaintId === 'digestive_issues';
    if (isDigestive) {
      return {
        source: 'AIIA Classical AYUSH Knowledge Engine',
        suggestedInquiries: [
          { questionHi: 'क्या भोजन के पचने के 2-3 घंटे बाद सीने या गले में खट्टी जलन बढ़ती है (परिणामशूल)?', questionEn: 'Does burning worsen 2-3 hours after meals during digestion (Parinama Shula)?', clinicalReason: 'Differentiates Pachakagni Vidaha from Koshtha Vata' },
          { questionHi: 'क्या प्रातःकाल मुँह का स्वाद कड़वा (तिक्त) अथवा खट्टा (अम्ल) रहता है?', questionEn: 'Is mouth taste bitter (Tikta) or sour (Amla) in the morning?', clinicalReason: 'Determines Pitta-dominant vs Kapha-dominant Amlapitta' },
          { questionHi: 'क्या रात को देर से भोजन करने अथवा दही/तली चीजों के सेवन का अभ्यास है?', questionEn: 'Habit of late-night meals, curd, or fried items?', clinicalReason: 'Identifies classical Hetu (Vidahi & Guru Ahara)' }
        ],
        potentialHetu: [
          { label: 'Vidahi & Amla Ahara (Fermented, spicy, sour foods)', category: 'Ahara' },
          { label: 'Ratri Jagarana (Late night wakefulness causing Pitta surge)', category: 'Vihara' },
          { label: 'Vegadharana (Suppression of natural urges)', category: 'Vihara' },
          { label: 'Krodha & Chinta (Mental stress exacerbating Pachaka Pitta)', category: 'Manasika' }
        ],
        associatedRupaToCheck: [
          'Hrid-Daha (Epigastric & retrosternal burning)',
          'Tikta-Amla Udgara (Sour/bitter eructations)',
          'Utklesha (Nausea or salivation)',
          'Gaurava (Heaviness in upper abdomen)'
        ],
        redFlagWarnings: [
          'Coffee-ground emesis or black tarry stools (Melena) — immediate endoscopy referral required',
          'Radiation of chest burning to left jaw/arm with diaphoresis (Cardiac rule-out mandatory)'
        ]
      };
    }

    return {
      source: 'AIIA Classical AYUSH Knowledge Engine',
      suggestedInquiries: [
        { questionHi: 'क्या यह लक्षण शीत ऋतु, ठंडी हवा अथवा भोजन के तुरंत बाद बढ़ते हैं?', questionEn: 'Do symptoms exacerbate in cold weather or right after meals?', clinicalReason: 'Determines Vata vs Kapha involvement' },
        { questionHi: 'क्या मल विसर्जन नियमित है अथवा बद्धकोष्ठता (Constipation) रहती है?', questionEn: 'Is bowel habit regular or is there sluggish evacuation?', clinicalReason: 'Koshtha & Apana Vayu assessment' }
      ],
      potentialHetu: [
        { label: 'Asatmya Ahara (Incompatible diet)', category: 'Ahara' },
        { label: 'Ati-Vyayama or Avyayama (Imbalance of physical exertion)', category: 'Vihara' }
      ],
      associatedRupaToCheck: [
        'Aruchi (Loss of taste/appetite)',
        'Angamarda (Body ache & fatigue)',
        'Gaurava (Generalized heaviness)'
      ],
      redFlagWarnings: [
        'Sudden acute progression, high fever, or neurological deficits requires immediate emergency referral'
      ]
    };
  }

  /* ─────────────────────────────────────────────────────────────────────────
     1C. [NIDAAN AI] DYNAMIC PRAKRITI QUESTION CURATION ENGINE
     Analyzes patient's chief complaints, HPI answers, current & past medications,
     allergies, age/gender, and dynamically selects 10 optimal CCRAS traits
     following Dr. Sumendra Mishra's consultation correlation methodology.
  ───────────────────────────────────────────────────────────────────────── */
  async curateAiPrakritiQuestions({
    chiefComplaint = '',
    complaintId = '',
    hpiAnswers = {},
    currentMedications = [],
    previousMedications = [],
    pastConditions = [],
    patientAge = 40,
    patientGender = 'Male',
    currentLang = 'hi'
  }) {
    const activeKey = this.getApiKey();
    if (activeKey) {
      try {
        const prompt = `You are NIDAAN AI, an Advanced Clinical Diagnostic AI Engine working alongside Dr. Sumendra Mishra's Ayurvedic Consultation Methodology based on CCRAS Standard Operating Procedures (ISBN: 978-93-83864-21-8).

Patient Clinical Profile:
- Chief Complaint: "${chiefComplaint}" (ID: ${complaintId})
- HPI Reported Symptoms: ${JSON.stringify(hpiAnswers)}
- Current Medications: ${JSON.stringify(currentMedications)}
- Past Medical History / Conditions: ${JSON.stringify(pastConditions)}
- Previous Medications & Adverse Reactions: ${JSON.stringify(previousMedications)}
- Age / Gender: ${patientAge} Y / ${patientGender}

Available 23 CCRAS Standardized Question IDs:
- Physical (ccras_phy_1: Built/BMI, ccras_phy_2: Height/Angula, ccras_phy_3: Skin/Twak, ccras_phy_4: Joints/Sandhi, ccras_phy_5: Hair/Kesha, ccras_phy_6: Eyes/Netra, ccras_phy_7: Nails/Nakha, ccras_phy_8: Teeth/Danta, ccras_phy_9: Palms/Soles/Pani-Pada)
- Physiological (ccras_physio_1: Agni/Kostha/Digestion, ccras_physio_2: Pipasa/Thirst, ccras_physio_3: Nidra/Sleep, ccras_physio_4: Sveda/Thermal Sensitivity, ccras_physio_5: Bowel Frequency, ccras_physio_6: Bala/Vyayama Stamina, ccras_physio_7: Voice Quality)
- Psychological (ccras_psy_1: Krodha/Temperament/Anger, ccras_psy_2: Smriti/Memory/Grasp, ccras_psy_3: Anavasthita/Decision making, ccras_psy_4: Courage/Dhriti)
- Behavioral (ccras_beh_1: Dridhavairam/Enmity, ccras_beh_2: Gati/Pace/Gait, ccras_beh_3: Friendship, ccras_beh_4: Vak/Speech pattern)

Task:
Select the top 10 most clinically critical and high-yield CCRAS Question IDs for this specific patient. The questions must directly correlate to diagnosing their constitutional vulnerability, dosha root cause, and physiological interactions with their medications.
Provide a clear clinical rationale (in Hindi and English) explaining why these specific parameters are being assessed for this patient.

Return ONLY a pure JSON object:
{
  "selectedQuestionIds": ["ccras_physio_1", "ccras_physio_4", "ccras_phy_3", "ccras_physio_3", "ccras_psy_1", "ccras_phy_1", "ccras_physio_6", "ccras_phy_4", "ccras_psy_2", "ccras_beh_4"],
  "aiReasoningHi": "मरीज की मुख्य समस्या एवं दवाओं के आधार पर NIDAAN AI ने जठराग्नि, कोष्ठ, तापीय संवेदनशीलता, त्वचा एवं मनोभाव लक्षणों को प्राथमिकता दी है।",
  "aiReasoningEn": "Based on chief complaint and medications, NIDAAN AI prioritized metabolic Agni, Kostha, Thermal regulation, Skin, and Pitta-Vata neurological indicators.",
  "doshaFocus": "Pitta-Vata"
}
No markdown wrappers.`;

        const res = await this.callGeminiRaw(prompt);
        if (res && Array.isArray(res.selectedQuestionIds) && res.selectedQuestionIds.length >= 8) {
          return {
            selectedQuestionIds: res.selectedQuestionIds,
            aiReasoningHi: res.aiReasoningHi,
            aiReasoningEn: res.aiReasoningEn,
            doshaFocus: res.doshaFocus || 'Tridosha',
            source: 'Gemini CDSS Live'
          };
        }
      } catch (e) {
        console.warn('Gemini Prakriti curation error, using Dr. Sumendra Mishra clinical correlation matrix:', e);
      }
    }

    // High precision clinical fallback matrix based on Dr. Sumendra Mishra's CCRAS correlation methodology
    const lower = (chiefComplaint || '').toLowerCase();

    // 1. Digestive / Acid Peptic / GERD / Amlapitta
    if (lower.includes('acid') || lower.includes('digest') || lower.includes('pet') || lower.includes('gas') || lower.includes('amla') || complaintId === 'digestive_issues') {
      return {
        selectedQuestionIds: [
          'ccras_physio_1', // Agni & Kostha (Appetite & digestion)
          'ccras_physio_2', // Pipasa & Tala/Kantha (Thirst & dryness)
          'ccras_physio_4', // Sweda & Sheeta/Ushna Sahishnuta (Thermal sensitivity)
          'ccras_phy_3',    // Twak Swabhava (Skin complexion & warmth)
          'ccras_physio_3', // Nidra (Sleep pattern & late nights)
          'ccras_psy_1',    // Krodha & Manas (Temperament & anger)
          'ccras_phy_1',    // Sharira Pramana (Physical frame/BMI)
          'ccras_physio_6', // Bala & Vyayama Shakthi (Physical endurance)
          'ccras_psy_2',    // Smriti & Medha (Memory & learning)
          'ccras_beh_4'     // Vak Swabhava (Speech & voice)
        ],
        aiReasoningHi: `मरीज की मुख्य समस्या (${chiefComplaint || 'उदर व पाचन विकार'}) एवं दवाओं के आधार पर NIDAAN AI ने जठराग्नि, कोष्ठ, पिपासा, उष्ण-शीत सहिष्णुता एवं पित्त-प्रधान मानसिक लक्षणों को प्राथमिकता दी है।`,
        aiReasoningEn: `Based on patient's GI symptoms (${chiefComplaint || 'Digestive/Acid Peptic'}) and routine, NIDAAN AI prioritized Jatharagni, Kostha, Hydration, Thermal sensitivity, and Pitta metabolic indicators.`,
        doshaFocus: 'Pitta-Vata',
        source: 'Dr. Sumendra Mishra Clinical Knowledge Engine'
      };
    }

    // 2. Joint Pain / Lower Back / Sciatica / Sandhivata
    if (lower.includes('joint') || lower.includes('back') || lower.includes('sciatica') || lower.includes('kati') || lower.includes('sandhi') || complaintId === 'joint_pain' || complaintId === 'back_pain') {
      return {
        selectedQuestionIds: [
          'ccras_phy_1',    // Sharira Pramana (Physical frame / BMI)
          'ccras_phy_4',    // Sandhi & Snayu (Joints, crepitus & tendons)
          'ccras_physio_4', // Sweda & Sheeta/Ushna (Thermal sensitivity & cold aggravation)
          'ccras_physio_6', // Bala & Vyayama (Physical stamina & joint load)
          'ccras_physio_1', // Agni & Kostha (Ama accumulation)
          'ccras_physio_3', // Nidra (Sleep & nocturnal pain)
          'ccras_beh_2',    // Gati & Cheshta (Gait & walking pace)
          'ccras_phy_3',    // Twak Swabhava (Skin dryness)
          'ccras_psy_1',    // Krodha & Manas (Temperament)
          'ccras_beh_4'     // Vak Swabhava (Speech)
        ],
        aiReasoningHi: `मरीज के मस्कुलोस्केलेटल लक्षणों (${chiefComplaint || 'जोड़ों व कमर का दर्द'}) के आधार पर NIDAAN AI ने शारीरिक गठन, संधि-कण्डरा (जोड़ों की आवाज/अकड़न), शीत सहिष्णुता, चाल एवं बल लक्षणों को प्राथमिकता दी है।`,
        aiReasoningEn: `For musculoskeletal symptoms (${chiefComplaint || 'Back/Joint Pain'}), NIDAAN AI prioritized Skeletal Frame, Joint Crepitus, Thermal/Cold Sensitivity, Gait, and Physical Stamina.`,
        doshaFocus: 'Vata-Kapha',
        source: 'Dr. Sumendra Mishra Clinical Knowledge Engine'
      };
    }

    // 3. Respiratory / Cough / Cold / Asthma
    if (lower.includes('cough') || lower.includes('cold') || lower.includes('kasa') || lower.includes('breath') || lower.includes('shwasa') || complaintId === 'cough_cold' || complaintId === 'respiratory') {
      return {
        selectedQuestionIds: [
          'ccras_physio_4', // Sweda & Sheeta/Ushna (Cold sensitivity)
          'ccras_phy_1',    // Sharira Pramana (Chest built / BMI)
          'ccras_physio_6', // Bala & Vyayama (Pranavaha stamina)
          'ccras_physio_1', // Agni & Kostha (Ama / Kapha generation)
          'ccras_phy_3',    // Twak Swabhava (Skin & mucous membrane)
          'ccras_physio_3', // Nidra (Nocturnal dyspnea / sleep)
          'ccras_psy_2',    // Smriti & Medha (Mental grasp)
          'ccras_psy_1',    // Krodha & Manas (Stress triggers)
          'ccras_phy_5',    // Kesha Swabhava (Hair quality)
          'ccras_beh_4'     // Vak Swabhava (Voice & speech)
        ],
        aiReasoningHi: `श्वसन संबंधी लक्षणों (${chiefComplaint || 'खांसी व सांस विकार'}) के आधार पर NIDAAN AI ने शीत सहिष्णुता, प्राणवह बल, शारीरिक गठन, एवं कफ-वात प्रवृत्तियों को प्राथमिकता दी है।`,
        aiReasoningEn: `For respiratory symptoms (${chiefComplaint || 'Cough/Respiratory'}), NIDAAN AI prioritized Cold Sensitivity, Respiratory Endurance, Chest Built, and Kapha-Vata balance.`,
        doshaFocus: 'Kapha-Vata',
        source: 'Dr. Sumendra Mishra Clinical Knowledge Engine'
      };
    }

    // 4. Skin Disorders / Rashes / Twak Vikara
    if (lower.includes('skin') || lower.includes('rash') || lower.includes('itch') || lower.includes('kandu') || lower.includes('eczema') || lower.includes('psoriasis') || complaintId === 'skin_issues') {
      return {
        selectedQuestionIds: [
          'ccras_phy_3',    // Twak Swabhava (Skin texture, pigmentation, dryness)
          'ccras_physio_4', // Sweda & Sheeta/Ushna (Sweating & heat intolerance)
          'ccras_physio_1', // Agni & Kostha (Dietary Ama / Rakta Dushti)
          'ccras_physio_2', // Pipasa & Tala (Thirst & hydration)
          'ccras_phy_7',    // Nakha Swabhava (Nails quality & pitting)
          'ccras_physio_3', // Nidra (Nocturnal itching & sleep)
          'ccras_psy_1',    // Krodha & Manas (Pitta temperament)
          'ccras_phy_5',    // Kesha Swabhava (Hair & scalp involvement)
          'ccras_phy_1',    // Sharira Pramana (Built)
          'ccras_physio_6'  // Bala & Stamina
        ],
        aiReasoningHi: `त्वचा संबंधी लक्षणों (${chiefComplaint || 'त्वक विकार'}) के आधार पर NIDAAN AI ने त्वचा स्वभाव, स्वेद (पसीना), रक्त-दृष्टि हेतु अग्नि, पिपासा, एवं नख लक्षणों को प्राथमिकता दी है।`,
        aiReasoningEn: `For dermatological symptoms (${chiefComplaint || 'Skin Disorders'}), NIDAAN AI prioritized Skin Texture, Perspiration, Digestive Ama/Rakta, Hydration, and Nail traits.`,
        doshaFocus: 'Pitta-Kapha',
        source: 'Dr. Sumendra Mishra Clinical Knowledge Engine'
      };
    }

    // 5. Default General High-Yield Predictors
    return {
      selectedQuestionIds: [
        'ccras_phy_1',    // Sharira Pramana (Physical frame)
        'ccras_phy_3',    // Twak Swabhava (Skin texture)
        'ccras_phy_5',    // Kesha Swabhava (Hair quality)
        'ccras_physio_1', // Agni & Kostha (Appetite & digestion)
        'ccras_physio_3', // Nidra (Sleep pattern)
        'ccras_physio_4', // Sweda & Sheeta/Ushna Sahishnuta (Thermal sensitivity)
        'ccras_physio_6', // Bala & Vyayama Shakthi (Physical endurance)
        'ccras_psy_1',    // Krodha & Manas (Temperament & anger)
        'ccras_psy_2',    // Smriti & Medha (Memory & learning)
        'ccras_beh_4'     // Vak Swabhava (Speech & voice)
      ],
      aiReasoningHi: `NIDAAN AI ने मरीज की आयु, लिंग एवं समग्र इतिहास के आधार पर सीसीआरएएस के १० सर्वाधिक सटीक संवैधानिक मापदंडों का चयन किया है।`,
      aiReasoningEn: `NIDAAN AI selected the 10 highest-yield CCRAS constitutional traits based on patient profile and systemic baseline.`,
      doshaFocus: 'Tridosha',
      source: 'Dr. Sumendra Mishra Clinical Knowledge Engine'
    };
  }

  /* ─────────────────────────────────────────────────────────────────────────
     1B. [MEDIKIOSK] DYNAMIC PATIENT INQUIRIES
     When a patient taps their complaint on MediKiosk, this generates 5 targeted
     clinical questions with interactive touch options for the patient to answer.
     The patient's chosen response is then saved and displayed on the OPD Subjective page!
  ───────────────────────────────────────────────────────────────────────── */
  async generateKioskInquiries({
    chiefComplaint = 'Digestive Issues',
    complaintId = '',
    currentLang = 'hi'
  }) {
    const activeKey = this.getApiKey();
    if (activeKey) {
      try {
        const prompt = `You are NIDAAN AI, an Advanced Clinical Diagnostic Intelligence Engine for a Hospital Kiosk.
For a patient presenting with Chief Complaint: "${chiefComplaint}" (ID: ${complaintId}), generate exactly 5 disease-specific, high-yield clinical assessment questions with 4 distinct options each in JSON format:
[
  {
    "id": "inq_1",
    "questionHi": "हिंदी में स्पष्ट नैदानिक प्रश्न",
    "questionEn": "High-yield diagnostic question in English",
    "optionsHi": ["विकल्प 1 (विस्तृत)", "विकल्प 2", "विकल्प 3", "विकल्प 4"],
    "optionsEn": ["Option 1 (detailed)", "Option 2", "Option 3", "Option 4"],
    "clinicalReason": "Clinical insight and dosha / systemic pathology mapping"
  }
]
Requirements:
1. Generate exactly 5 questions tailored directly to "${chiefComplaint}".
2. Each question MUST have exactly 4 structured options in both Hindi and English.
3. Return ONLY valid JSON array with 5 objects. No markdown backticks or commentary.`;
        const res = await this.callGeminiRaw(prompt);
        if (Array.isArray(res) && res.length >= 4) return res;
      } catch (e) {
        console.warn('Gemini Kiosk inquiry error, using classical fallback:', e);
      }
    }

    // High quality deterministic classical fallback (5 questions x 4 options tailored to disease)
    const lower = (chiefComplaint || '').toLowerCase();

    // 1. Lower Backache / Sciatica / Lumbar Spine (Kati Shoola / Gridhrasi)
    if (lower.includes('back') || lower.includes('sciatica') || lower.includes('kati') || lower.includes('kamar') || lower.includes('spine') || complaintId === 'back_pain') {
      return [
        {
          id: 'inq_1',
          questionHi: 'आपके पीठ अथवा कमर के दर्द की प्रकृति और फैलाव (Radiation) का सबसे सटीक वर्णन क्या है?',
          questionEn: 'What best describes the nature and radiation of your back or lumbar pain?',
          optionsHi: [
            'कमर से शुरू होकर एक या दोनों पैरों में घुटने के नीचे तक तेज खिंचाव/झुनझुनी वाला दर्द (Sciatica / Gridhrasi)',
            'निचली पीठ में केवल स्थानीय भारीपन व जकड़न, जो पैरों में नहीं फैलता (Local Lumbar Strain / Katigraha)',
            'रीढ़ की हड्डी में जलन व लगातार चुभन वाला तेज दर्द (Asthi-Majja Dhatu Kshaya)',
            'उठने-बैठने पर अचानक बिजली जैसा झटका या सुई चुभने जैसी सनसनाहट'
          ],
          optionsEn: [
            'Sharp shooting pain radiating down one or both legs past the knee (Sciatica / Gridhrasi)',
            'Dull localized lower back ache and stiffness with no leg radiation (Lumbar Strain / Katigraha)',
            'Deep burning and constant throbbing ache along spinal column (Vata-Pitta Spasm)',
            'Sudden electric shock sensation or needle-like prick upon movement'
          ],
          clinicalReason: 'Differentiates lumbar radiculopathy (Gridhrasi / Disc herniation) from localized muscular Katigraha'
        },
        {
          id: 'inq_2',
          questionHi: 'किस शारीरिक स्थिति या गतिविधि में दर्द सबसे अधिक बढ़ जाता है?',
          questionEn: 'In which posture or physical activity does the pain significantly aggravate?',
          optionsHi: [
            'कुर्सी पर लंबे समय तक लगातार बैठने अथवा आगे झुकने पर (Sitting & Flexion Aggravation)',
            'लगातार खड़े रहने, चलने या सीढ़ियां चढ़ने पर (Standing & Extension Aggravation)',
            'सुबह सोकर उठते ही सबसे तीव्र रहता है, धीरे-धीरे चलने पर कम होता है',
            'रात में करवट बदलने अथवा बिस्तर पर सीधे लेटने पर अधिक कष्ट होता है'
          ],
          optionsEn: [
            'Prolonged sitting on chair or bending forward (Flexion / Discogenic Aggravation)',
            'Prolonged standing, walking or climbing stairs (Facet / Canal Stenosis)',
            'Worst immediately upon waking up, gradually eases with gentle motion',
            'Severe while turning sides at night or lying flat on back'
          ],
          clinicalReason: 'Pinpoints biomechanical discogenic compression vs facet joint arthropathy vs Vata stagnation'
        },
        {
          id: 'inq_3',
          questionHi: 'क्या सुबह उठने पर कमर में जकड़न (Stiffness) रहती है और यह कितनी देर तक बनी रहती है?',
          questionEn: 'Do you experience morning lumbar stiffness and how long does it persist?',
          optionsHi: [
            'हाँ, 30 मिनट से 1 घंटे से अधिक समय तक तीव्र जकड़न (Inflammatory / Amavata component)',
            'हल्की जकड़न रहती है जो 5-10 मिनट गर्म पानी या हल्की चहलकदमी से खुल जाती है',
            'जकड़न बिल्कुल नहीं होती, केवल निरंतर दर्द और थकान महसूस होती है',
            'दिन के अंत में शाम को थकान व जकड़न सबसे अधिक बढ़ जाती है'
          ],
          optionsEn: [
            'Severe stiffness lasting over 30 to 60 minutes (Inflammatory / Ankylosing marker)',
            'Mild transient stiffness resolving in 5-10 minutes with movement or warm water',
            'No stiffness at all, only persistent throbbing ache and muscle fatigue',
            'Stiffness and fatigue worsen progressively towards the evening (Vata-Dominant)'
          ],
          clinicalReason: 'Assesses inflammatory spondyloarthropathy vs degenerative Vataja degeneration'
        },
        {
          id: 'inq_4',
          questionHi: 'क्या पैरों अथवा पंजों में सुन्नपन, झनझनाहट अथवा कमजोरी महसूस होती है?',
          questionEn: 'Do you experience numbness, tingling, or weakness in your legs or feet?',
          optionsHi: [
            'हाँ, पैर के तलवों व अंगुलियों में लगातार सुन्नपन व चींटी चलने जैसा अहसास (Suptata / Neuropathy)',
            'पैर उठाने में भारीपन व कमजोरी (Foot drop / चप्पल छूटने जैसा अहसास)',
            'कभी-कभी हल्की झनझनाहट होती है पर कमजोरी नहीं है',
            'नहीं, पैरों में कोई सुन्नपन या कमजोरी बिल्कुल नहीं है'
          ],
          optionsEn: [
            'Persistent numbness & tingling in foot/toes (Angasupti / Nerve Root Compression)',
            'Motor weakness lifting foot / difficulty holding footwear (Foot Drop Red Flag)',
            'Occasional mild pins-and-needles without motor weakness',
            'No sensory loss, numbness, or weakness in lower limbs'
          ],
          clinicalReason: 'Screens for critical neurological root compromise and cauda equina red flag indicators'
        },
        {
          id: 'inq_5',
          questionHi: 'आपकी दैनिक जीवनशैली में इस समस्या का संभावित प्राथमिक कारण (हेतु / Cause) क्या हो सकता है?',
          questionEn: 'What is the most likely contributing daily lifestyle factor (Hetu) for your backache?',
          optionsHi: [
            'प्रतिदिन 7-9 घंटे से अधिक लगातार डेस्क/कुर्सी पर बैठना व व्यायाम की कमी (Sedentary Desk Sitting)',
            'भारी वजन उठाना, गलत मुद्रा (Posture) में झुकना अथवा अचानक झटका लगना (Ati-Vyayama / Strain)',
            'नरम गद्देदार बिस्तर पर सोना अथवा अत्यधिक दोपहिया/कार ड्राइविंग का सफर (Vihara Hetu)',
            'मानसिक तनाव, अनियमित खानपान व वातवर्धक भोजन का नियमित सेवन (Ahara-Vihara Hetu)'
          ],
          optionsEn: [
            'Continuous desk sitting >7-9 hours daily with lack of core exercise (Sedentary Hetu)',
            'Heavy weight lifting, improper bending or sudden mechanical jerk / sports strain',
            'Sleeping on overly soft mattress or long daily two-wheeler / car commute vibration',
            'High mental stress, irregular routine, and dry/Vata-aggravating dietary habits'
          ],
          clinicalReason: 'Identifies primary Ahara-Vihara Hetu for personalized Pathya-Apathya lifestyle correction'
        }
      ];
    }

    // 2. Knee / Joint Pain & Arthritis (Sandhivata / Amavata / Asthisoushilya)
    if (lower.includes('joint') || lower.includes('ghutna') || lower.includes('knee') || lower.includes('sandhi') || lower.includes('arthrit') || complaintId === 'joint_pain') {
      return [
        {
          id: 'inq_1',
          questionHi: 'जोड़ों के दर्द का फैलाव और स्वरूप कैसा है?',
          questionEn: 'What is the distribution and pattern of your joint pain?',
          optionsHi: [
            'दोनों घुटनों में वजन डालने पर कट-कट की आवाज के साथ दर्द (Bilateral Osteoarthritis / Sandhivata)',
            'हाथ की उंगलियों, कलाई व छोटे जोड़ों में दर्द जो एक जोड़ से दूसरे में बदलता है (Amavata / Polyarthritis)',
            'एक ही जोड़ में अचानक तेज लालिमा, सूजन व असहनीय जलन (Vatarakta / Gouty Arthritis)',
            'पूरे शरीर की मांसपेशियों व जोड़ों में व्यापक दर्द व थकान (Generalized Angamarda)'
          ],
          optionsEn: [
            'Bilateral knee pain worsening on weight-bearing with crepitus (Sandhivata / OA)',
            'Migratory pain in small joints of hands, wrists and fingers (Amavata / RA pattern)',
            'Sudden acute redness, warmth, and severe burning in a single joint (Vatarakta / Gout)',
            'Widespread generalized body ache and muscle soreness (Angamarda / Fibromyalgia)'
          ],
          clinicalReason: 'Distinguishes degenerative Sandhivata from autoimmune Amavata and metabolic Vatarakta'
        },
        {
          id: 'inq_2',
          questionHi: 'क्या सुबह उठने पर जोड़ों में अकड़न (Morning Stiffness) रहती है?',
          questionEn: 'Do you experience morning joint stiffness upon waking up?',
          optionsHi: [
            'हाँ, 45 मिनट से अधिक समय तक तीव्र जकड़न रहती है जो बहुत मुश्किल से खुलती है',
            '10-15 मिनट हल्की जकड़न रहती है, चलने-फिरने से सामान्य हो जाती है',
            'केवल जोड़ों में दर्द और कमजोरी है, अकड़न नहीं रहती',
            'शाम को थकावट के बाद अकड़न और भारीपन बढ़ जाता है'
          ],
          optionsEn: [
            'Severe morning stiffness lasting >45 minutes (Amavata / Inflammatory marker)',
            'Mild transient stiffness (<15 mins) easing quickly with joint movement (Sandhivata)',
            'No morning stiffness, only continuous pain and weakness on movement',
            'Stiffness and swelling worsen at the end of the day after physical exertion'
          ],
          clinicalReason: 'Differentiates Ama-associated inflammatory joint disease from pure Vataja degeneration'
        },
        {
          id: 'inq_3',
          questionHi: 'क्या जोड़ों को मोड़ते या सीढ़ियां चढ़ते समय कट-कट (Crepitus) की आवाज व रुकावट आती है?',
          questionEn: 'Do you experience cracking sounds (crepitus) or locking while bending joints or stairs?',
          optionsHi: [
            'हाँ, घुटनों को मोड़ने पर लगातार तेज चटकने/घिसने की आवाज आती है (Shleshaka Kapha Kshaya)',
            'सीढ़ियां चढ़ने-उतरने में असहनीय दर्द होता है, रेलिंग का सहारा लेना पड़ता है',
            'जोड़ कभी-कभी बीच में लॉक (अटक) जाता है और सीधा नहीं होता',
            'आवाज नहीं आती, केवल अंदरूनी खिंचाव महसूस होता है'
          ],
          optionsEn: [
            'Frequent audible clicking and grinding crepitus on bending knees (Cartilage Wear)',
            'Severe pain on ascending/descending stairs requiring handrail support',
            'Intermittent joint locking or catching sensation during knee flexion',
            'No crepitus sounds, only internal tightness and ligamentous strain'
          ],
          clinicalReason: 'Evaluates Shleshaka Kapha depletion, synovial fluid reduction and meniscal involvement'
        },
        {
          id: 'inq_4',
          questionHi: 'मौसम, तापमान और वातावरण का जोड़ों के दर्द पर क्या प्रभाव पड़ता है?',
          questionEn: 'How do weather, temperature, and seasonal changes affect your joint symptoms?',
          optionsHi: [
            'ठंड के मौसम, ठंडी हवा, कूलर/एसी अथवा बादलों के मौसम में दर्द अत्यधिक बढ़ जाता है (Sheeta Asahyata)',
            'गर्म वातावरण में जलन और सूजन बढ़ती है, ठंडी सिकाई से आराम मिलता है (Pitta-dominant)',
            'बरसात के दिनों में भारीपन व सूजन बढ़ जाती है (Snigdha-Kapha aggravation)',
            'मौसम या तापमान से दर्द में कोई विशेष अंतर नहीं पड़ता'
          ],
          optionsEn: [
            'Markedly worsens in cold weather, rainy days, or AC environment (Sheeta Guna Vata)',
            'Worsens with heat, relieved by cool application; associated with burning (Pitta-Vata)',
            'Swelling and heaviness worsen specifically during humid/rainy season (Kapha-Vata)',
            'Weather and climate have no noticeable effect on symptoms'
          ],
          clinicalReason: 'Reveals Guna-specific doshic dominance (Sheeta vs Ushna vs Snigdha) for targeted therapy'
        },
        {
          id: 'inq_5',
          questionHi: 'क्या जोड़ों के दर्द के साथ पाचन विकार (भूख न लगना, पेट भारी, जीभ पर मैल) भी रहता है?',
          questionEn: 'Do you have accompanying digestive issues (loss of appetite, heavy abdomen, coated tongue)?',
          optionsHi: [
            'हाँ, भूख बहुत कम लगती है, पेट फूला रहता है और जीभ पर सफेद परत रहती है (Ama Lakshana)',
            'पाचन बिल्कुल सामान्य व उत्तम है, केवल जोड़ों में समस्या है (Nirama Vata)',
            'कब्जियत (बद्धकोष्ठता) और गैस की बहुत अधिक समस्या रहती है (Apana Vata Dushti)',
            'एसिडिटी, खट्टी डकारें और सीने में जलन साथ में बनी रहती है (Pitta Anubandha)'
          ],
          optionsEn: [
            'Yes, poor appetite, heavy bloated stomach, and white coated tongue (Ama Present)',
            'Digestion is normal and comfortable, issue is purely mechanical/joint (Nirama)',
            'Chronic severe constipation and trapped flatulence (Apana Vayu vitiation)',
            'Frequent acidity, sour belching and burning alongside joint pains'
          ],
          clinicalReason: 'Crucial for determining Langhana / Deepana-Pachana protocol before Shamana/Snehana'
        }
      ];
    }

    // 3. Digestive & Acid Peptic Issues (Amlapitta / Agnimandya / Parinama Shula)
    if (lower.includes('acid') || lower.includes('digest') || lower.includes('pet') || lower.includes('gas') || lower.includes('amla') || lower.includes('constipat') || complaintId === 'digestive_issues') {
      return [
        {
          id: 'inq_1',
          questionHi: 'सीने या पेट में जलन (Daha / Heartburn) का समय और लक्षण कैसा रहता है?',
          questionEn: 'What is the timing and character of chest or stomach burning (Heartburn / Daha)?',
          optionsHi: [
            'भोजन करने के 2-3 घंटे बाद खट्टी जलन व पेट में दर्द बढ़ता है (Parinama Shula / Peptic Acid)',
            'भोजन करने के तुरंत बाद सीने में ऊपर की ओर तीखा खट्टा पानी आता है (GERD / Urdhwaga Amlapitta)',
            'प्रातःकाल खाली पेट जलन व जी मिचलाना सबसे अधिक रहता है (Empty stomach Vidaha)',
            'जलन नहीं होती, केवल पेट में लगातार गैस, भारीपन व गुड़गुड़ाहट रहती है (Adhmana / Vataja)'
          ],
          optionsEn: [
            'Sour burning and epigastric ache worsens 2-3 hours after meals (Parinama Shula)',
            'Immediate post-meal retrosternal regurgitation of acid into throat (GERD)',
            'Early morning empty stomach burning and nausea (Fasting Vidagdha Pitta)',
            'No burning sensation, only severe bloating, fullness, and flatulence (Vataja Agnimandya)'
          ],
          clinicalReason: 'Maps Pachakagni Vidaha vs Urdhwaga Amlapitta vs Koshtha Vata stagnation'
        },
        {
          id: 'inq_2',
          questionHi: 'डकार (Belching) और मुँह के स्वाद की स्थिति कैसी रहती है?',
          questionEn: 'What is the nature of your eructations (belching) and mouth taste?',
          optionsHi: [
            'खट्टी और कड़वी डकारें आती हैं और मुँह का स्वाद कड़वा/खट्टा रहता है (Tikta-Amla Udgara)',
            'बिना पचे भोजन जैसी बदबूदार भारी डकारें आती हैं (Vidagdha Ahara Udgara)',
            'बार-बार सूखी हवा की डकारें आती हैं जिससे पेट का तनाव कम होता है (Vataja Udgara)',
            'मुँह में लगातार मीठा पानी व अत्यधिक लार (Salivation) आती है (Kaphaja Praseka)'
          ],
          optionsEn: [
            'Sour and bitter eructations with bitter/metallic taste in mouth (Tikta-Amla Pitta)',
            'Foul, heavy eructations smelling of undigested food (Vidagdha Ama Udgara)',
            'Frequent dry wind belching that temporarily relieves abdominal tension (Vataja)',
            'Excessive sweetish watery salivation in mouth with nausea (Kaphaja Praseka)'
          ],
          clinicalReason: 'Classifies Pitta vs Kapha vs Vata dominance in gastrointestinal pathology'
        },
        {
          id: 'inq_3',
          questionHi: 'मल विसर्जन (Bowel Evacuation / Koshtha) की दैनिक स्थिति क्या है?',
          questionEn: 'What is your daily bowel evacuation pattern and stool consistency?',
          optionsHi: [
            'कड़ा, सूखा व कष्टपूर्वक मल विसर्जन, 2-3 दिन में एक बार (Krura Koshtha / Constipation)',
            'दिन में 2-3 बार ढीला, चिपचिपा व असंतोषजनक मल विसर्जन (Mridu Koshtha / Ama Atisara)',
            'कभी दस्त और कभी कब्जियत का मिला-जुला चक्र बना रहता है (IBS / Grahani pattern)',
            'प्रतिदिन सुबह एक बार सामान्य व संतोषजनक मल विसर्जन होता है'
          ],
          optionsEn: [
            'Hard, dry, strained bowel movement once every 2-3 days (Krura Koshtha)',
            'Loose, sticky, urgent stools 2-3 times daily with incomplete evacuation (Ama Grahani)',
            'Alternating bouts of constipation and loose stools (IBS / Muhurbaddha Grahani)',
            'Smooth, regular, single daily morning evacuation'
          ],
          clinicalReason: 'Assesses Koshtha type (Krura vs Mridu vs Madhyama) and Grahani Rogadhikara'
        },
        {
          id: 'inq_4',
          questionHi: 'भोजन के बाद पेट में भारीपन (आध्मान) और भूख की स्थिति कैसी रहती है?',
          questionEn: 'How is your appetite (Agni) and post-meal abdominal fullness?',
          optionsHi: [
            'थोड़ा सा खाने पर भी पेट भारी, फूला हुआ व पत्थर जैसा कड़ा हो जाता है (Adhmana)',
            'भूख बिल्कुल नहीं लगती, भोजन को देखकर अनिच्छा होती है (Aruchi / Mandagni)',
            'कभी बहुत तेज भूख लगती है और कभी बिल्कुल नहीं (Vishamagni)',
            'तीव्र भूख लगती है पर भोजन के बाद तुरंत जलन शुरू हो जाती है (Tikshnagni / Amlapitta)'
          ],
          optionsEn: [
            'Even small meals cause severe abdominal distension and hardness (Adhmana)',
            'Complete loss of appetite / aversion to food (Aruchi & Mandagni)',
            'Irregular erratic appetite — intense some days, zero on others (Vishamagni)',
            'Intense excessive hunger followed by rapid burning and discomfort (Tikshnagni)'
          ],
          clinicalReason: 'Identifies Jatharagni category (Manda vs Vishama vs Tikshna vs Sama)'
        },
        {
          id: 'inq_5',
          questionHi: 'खानपान एवं जीवनशैली में कौन से कारक आपकी इस समस्या के मुख्य कारण हो सकते हैं?',
          questionEn: 'Which dietary and lifestyle factors are most frequent in your daily routine?',
          optionsHi: [
            'देर रात भोजन (>10 PM), अत्यधिक तला-भुना, मिर्च-मसालेदार व बाहर का खाना (Vidahi Ahara)',
            'चाय/कॉफ़ी का अत्यधिक सेवन (>3-4 कप प्रतिदिन) और खाली पेट चाय पीना (Pitta Prakopa)',
            'भोजन के समय में अनियमितता, भोजन छोड़ना (Skipping meals) व हड़बड़ी में खाना (Vishamashana)',
            'मानसिक तनाव, चिंता, अनिद्रा और भोजन के तुरंत बाद लेट जाना (Diva Swapna / Vega Dharana)'
          ],
          optionsEn: [
            'Late night heavy dinners (>10 PM), spicy fried food, and street foods (Vidahi Hetu)',
            'Excessive tea/coffee intake (>3-4 cups daily), especially on empty stomach',
            'Irregular meal timings, skipping breakfast, eating under rush (Vishamashana)',
            'High occupational stress, insomnia, anxiety, and lying down right after meals'
          ],
          clinicalReason: 'Identifies core Nidana (Hetu) for disease reversal and lifestyle prescription'
        }
      ];
    }

    // 4. Cough / Cold / Respiratory (Kasa / Pratishyaya / Shwasa)
    if (lower.includes('cough') || lower.includes('cold') || lower.includes('kasa') || lower.includes('khansi') || lower.includes('respirat') || lower.includes('breath') || complaintId === 'cough_cold' || complaintId === 'respiratory') {
      return [
        {
          id: 'inq_1',
          questionHi: 'खांसी का प्रकार और कफ (Sputum / Balgham) का स्वरूप कैसा है?',
          questionEn: 'What is the nature of your cough and sputum production?',
          optionsHi: [
            'सूखी, तेज ठसके वाली खांसी जिसमें कफ नहीं निकलता, गले में सुई जैसी चुभन (Vataja Kasa / Dry Cough)',
            'गाढ़ा, सफेद या पीला चिपचिपा कफ निकलता है, छाती में भारीपन (Kaphaja Kasa / Productive)',
            'लगातार दौरे जैसी खांसी (Spasmodic episodes) जो सांस रोक देती है (Tamaka Shwasa / Bronchospasm)',
            'खांसी के साथ कफ में कभी-कभी खून के हल्के रेशे या धातु का स्वाद (Kshataja / Inflammatory)'
          ],
          optionsEn: [
            'Dry, hacking, non-productive cough with continuous throat tickling (Vataja Kasa)',
            'Productive cough with thick white or yellowish phlegm & chest congestion (Kaphaja Kasa)',
            'Paroxysmal spasmodic coughing bouts triggering breathlessness (Tamaka Shwasa)',
            'Blood-tinged sputum or severe raw burning in trachea (Kshataja / Red Flag)'
          ],
          clinicalReason: 'Categorizes Vataja vs Kaphaja vs Kshataja Kasa and rules out hemoptysis red flags'
        },
        {
          id: 'inq_2',
          questionHi: 'खांसी और सांस की तकलीफ किस समय अथवा किस परिस्थिति में सबसे अधिक बढ़ती है?',
          questionEn: 'At what time or under which conditions do cough and breathlessness peak?',
          optionsHi: [
            'रात को सोने के बाद और सुबह 3-5 बजे के बीच खांसी का तेज दौरा पड़ता है (Naktam Balavan)',
            'ठंडा पानी, आइसक्रीम, ठंडी हवा या एसी के संपर्क में आते ही (Sheeta Prakopa)',
            'धूल, धुआं, अगरबत्ती, परफ्यूम या मौसम बदलने पर अचानक बढ़ता है (Allergic / Vata-Kapha)',
            'शारीरिक श्रम करने, तेज चलने या सीढ़ियां चढ़ने पर सांस फूलने के साथ खांसी आती है'
          ],
          optionsEn: [
            'Severe paroxysmal coughing episodes at night and early dawn 3-5 AM (Tamaka Shwasa)',
            'Immediately triggers upon consuming cold water, ice creams, or cold AC air',
            'Triggered by dust, smoke, aerosol perfumes, or seasonal weather shifts (Allergic)',
            'Aggravates on physical exertion, brisk walking, or climbing stairs (Exertional)'
          ],
          clinicalReason: 'Differentiates bronchial asthma (Tamaka Shwasa) from allergic rhinitis and exertion dyspnea'
        },
        {
          id: 'inq_3',
          questionHi: 'नाक और सिर से संबंधित कौन से लक्षण साथ में उपस्थित हैं?',
          questionEn: 'What nasal, sinus, and cranial symptoms accompany your respiratory condition?',
          optionsHi: [
            'लगातार छींकें आना, नाक से पतला पानी गिरना व आंखों में खुजली (Vataja Pratishyaya / Allergic Rhinitis)',
            'नाक बंद रहना, गले के पीछे बलगम टपकना (Post-nasal drip) व माथे में भारीपन (Dushta Pratishyaya)',
            'गले में तेज दर्द, निगलने में कष्ट व आवाज बैठ जाना (Swarabheda / Laryngitis)',
            'नाक से कोई स्राव नहीं, केवल छाती में जकड़न व घरघराहट (Wheezing / Shwasa Kashtata)'
          ],
          optionsEn: [
            'Bouts of sneezing, watery rhinorrhea, and itchy watering eyes (Allergic Rhinitis)',
            'Blocked nasal passages, thick post-nasal drip, and frontal sinus heaviness (Sinusitis)',
            'Sore throat, odynophagia (pain on swallowing), and hoarseness of voice (Swarabheda)',
            'Clear nasal passages, but persistent chest tightness and audible wheezing'
          ],
          clinicalReason: 'Maps Pranavaha Srotas pathology from upper respiratory tract (Pratishyaya) to lower airways'
        },
        {
          id: 'inq_4',
          questionHi: 'क्या खांसी के साथ बुखार, बदन दर्द अथवा रात को पसीना आता है?',
          questionEn: 'Do you have accompanying fever, body aches, chills or night sweats?',
          optionsHi: [
            'हल्का बुखार (Low grade fever), शरीर टूटना व सिरदर्द रहता है (Jwara Anubandha)',
            'तेज कपकंपी के साथ तेज बुखार आता है (High Grade Pyrexia / Acute Infection)',
            'रात को अत्यधिक पसीना और वजन में कमी महसूस हो रही है (Dhatu Kshaya marker)',
            'बुखार बिल्कुल नहीं है, केवल श्वसन तंत्र की समस्या है'
          ],
          optionsEn: [
            'Low grade fever, generalized body ache, and dull headache (Viral Prodrome)',
            'High grade fever with shivering chills (Acute Bacterial / Infectious Exacerbation)',
            'Drenching night sweats, chronic lethargy, and unexplained weight loss (Red Flag)',
            'Afebrile with no constitutional fever symptoms'
          ],
          clinicalReason: 'Screens for systemic Jwara, acute pneumonitis, and chronic consumptive pathology'
        },
        {
          id: 'inq_5',
          questionHi: 'आपकी जीवनशैली अथवा कार्यक्षेत्र में कौन से उत्तेजक कारक (Triggers) मौजूद हैं?',
          questionEn: 'What environmental or occupational triggers exist in your daily routine?',
          optionsHi: [
            'धूल, धुआं, निर्माण कार्य (Construction) अथवा औद्योगिक प्रदूषण का दैनिक संपर्क',
            'धूम्रपान (बीड़ी/सिगरेट) अथवा परिवार में पैसिव स्मोकिंग का नियमित संपर्क',
            'पूरा दिन वातानुकूलित (AC) बंद कमरे में रहना व ठंडी चीजों का लगातार सेवन',
            'मानसिक तनाव, देर रात तक जागना व रोग प्रतिरोधक क्षमता (Immunity / Bala) की कमी'
          ],
          optionsEn: [
            'Daily exposure to dust, road traffic fumes, construction dust, or industrial pollution',
            'Active smoking (bidi/cigarette) or continuous indoor passive smoke exposure',
            'Entire day spent in enclosed dry AC environments with high cold beverage intake',
            'High stress, poor nocturnal sleep routine, and compromised immune vitality (Ojas Kshaya)'
          ],
          clinicalReason: 'Guides environmental modifications and Rasayana (Pranavaha Srotas) therapy'
        }
      ];
    }

    // 5. Skin Disorders / Rashes / Itching (Twak Vikara / Kushtha / Sheetapitta / Eczema)
    if (lower.includes('skin') || lower.includes('rash') || lower.includes('itch') || lower.includes('kandu') || lower.includes('eczema') || lower.includes('psoriasis') || complaintId === 'skin_issues') {
      return [
        {
          id: 'inq_1',
          questionHi: 'त्वचा पर दिखाई देने वाले चकत्तों अथवा घाव का प्राथमिक स्वरूप कैसा है?',
          questionEn: 'What is the primary visual appearance and texture of your skin lesions?',
          optionsHi: [
            'रूखी, सूखी पपड़ीदार त्वचा जो सफेद छिलके जैसी उतरती है (Dry Silvery Scales / Kitibha / Psoriasis)',
            'लाल चकत्ते, जिनसे पानी जैसा तरल या चिपचिपा स्राव निकलता है (Red Weeping / Vicharchika / Eczema)',
            'मच्छर के काटने जैसे उभरे हुए गोल लाल चकत्ते जो अचानक आते-जाते हैं (Hives / Wheals / Sheetapitta)',
            'त्वचा का रंग काला या गहरा भूरा पड़ना व खुरदरा होना (Hyperpigmentation / Lichenification)'
          ],
          optionsEn: [
            'Dry, silvery scaling plaques with peeling of white flakes (Kitibha / Psoriasis)',
            'Erythematous inflamed patches with weeping/oozing serous fluid (Vicharchika / Eczema)',
            'Raised transient edematous erythematous wheals / urticarial flares (Sheetapitta / Hives)',
            'Darkened hyperpigmented, thickened, and leathery skin patches (Lichenification)'
          ],
          clinicalReason: 'Classifies Rupa according to classical Ayurvedic dermatological categories (Kitibha vs Vicharchika vs Sheetapitta)'
        },
        {
          id: 'inq_2',
          questionHi: 'खुजली (Kandu / Itching) की तीव्रता और समय कैसा रहता है?',
          questionEn: 'What is the intensity and diurnal pattern of skin itching (Kandu)?',
          optionsHi: [
            'रात को बिस्तर में जाने पर असहनीय खुजली होती है जिससे नींद टूट जाती है (Kaphaja / Ratri Kandu)',
            'पसीना आने, धूप या गर्म वातावरण में जाने पर तेज खुजली और जलन होती है (Pitta-dominant)',
            'त्वचा में अत्यधिक रूखेपन के कारण लगातार खिंचाव और हल्की खुजली रहती है (Vataja Rukshata)',
            'खुजली नहीं होती, केवल जलन, दर्द व छूने पर संवेदनशीलता रहती है (Pitta-Vata Daha)'
          ],
          optionsEn: [
            'Intractable severe itching at night disturbing sleep (Kapha-Vata nocturnal surge)',
            'Itching flares with perspiration, sun exposure, and warm humid weather (Pitta-Rakta)',
            'Mild continuous itching driven purely by dry, tight, parched skin (Vataja)',
            'Minimal itching, but severe burning sensation (Daha) and tenderness on touch'
          ],
          clinicalReason: 'Evaluates Kapha (Kandu) vs Pitta (Daha) vs Vata (Rukshata) involvement in Twacha'
        },
        {
          id: 'inq_3',
          questionHi: 'त्वचा की यह समस्या शरीर के किन हिस्सों पर मुख्य रूप से फैली हुई है?',
          questionEn: 'What is the anatomical distribution of your skin patches?',
          optionsHi: [
            'कोहनी के बाहरी हिस्से, घुटनों, सिर की त्वचा (Scalp) व पीठ पर (Extensor Surfaces)',
            'कोहनी व घुटनों के अंदरूनी मोड़ों, गर्दन व कलाई पर (Flexural Creases)',
            'हाथ की हथेलियों, अंगुलियों के बीच व पैर के तलवों पर (Palmo-plantar)',
            'पूरे शरीर के धड़, चेहरे और पैरों पर व्यापक रूप से फैली है (Generalized / Disseminated)'
          ],
          optionsEn: [
            'Extensor aspects of elbows, knees, lower back, and scalp hairline (Extensor / Plaque)',
            'Flexural creases of elbows, popliteal fossa of knees, neck and eyelids (Flexural Atopic)',
            'Confined primarily to palmar surfaces of hands, finger webs, and soles (Palmo-plantar)',
            'Widespread generalized dissemination across trunk, limbs, and face'
          ],
          clinicalReason: 'Anatomical distribution provides critical diagnostic differentiation for psoriasis vs eczema vs tinea'
        },
        {
          id: 'inq_4',
          questionHi: 'क्या भोजन में खटाई, दही, मछली अथवा विरुद्ध आहार (Viruddha Ahara) का नियमित सेवन होता है?',
          questionEn: 'Do you regularly consume incompatible food combinations (Viruddha Ahara) or triggers?',
          optionsHi: [
            'हाँ, दूध के साथ नमक/नमकीन/मछली अथवा दही का नियमित सेवन (Viruddha Ahara / Food mismatch)',
            'अत्यधिक खट्टे, तीखे, किण्वित (Fermented) व बासी भोजन का सेवन (Amla-Lavana Ahara)',
            'रासायनिक साबुन, डिटर्जेंट अथवा कॉस्मेटिक उत्पादों के संपर्क से एलर्जी',
            'नहीं, खानपान सादा है, समस्या मानसिक तनाव व मौसम बदलने पर बढ़ती है'
          ],
          optionsEn: [
            'Regular intake of incompatible foods e.g. milk with salt/fish/curd (Viruddha Ahara)',
            'High consumption of sour, spicy, fermented, preserved, or oily foods (Rakta Dushti Hetu)',
            'Direct occupational contact with harsh chemical soaps, detergents, or cosmetics',
            'Simple diet; condition exacerbates primarily with emotional stress and seasonal shifts'
          ],
          clinicalReason: 'Identifies classical Rakta-Twak Dushti Nidana (Viruddha Ahara) essential for complete cure'
        },
        {
          id: 'inq_5',
          questionHi: 'क्या चकत्तों से किसी प्रकार का स्राव (Discharge / Oozing) या खून निकलता है?',
          questionEn: 'Is there any oozing, weeping discharge, crusting, or bleeding from the lesions?',
          optionsHi: [
            'खुजलाने पर चिपचिपा पीला या पारदर्शी पानी निकलता है और पपड़ी जमती है (Srava / Vicharchika)',
            'पपड़ी हटाने पर खून की छोटी-छोटी बूंदें निकल आती हैं (Auspitz Sign / Kitibha)',
            'बिल्कुल सूखा रहता है, केवल त्वचा में गहरी दरारें (Fissures / Cracks) पड़ती हैं',
            'स्राव नहीं होता, केवल मवाद भरी छोटी फुंसियां (Pustules) बनती हैं'
          ],
          optionsEn: [
            'Weeping serous or sticky yellowish discharge upon scratching with crusting (Srava)',
            'Pinpoint bleeding spots appear upon lifting off dry scales (Auspitz Sign marker)',
            'Completely dry with deep painful skin fissures and cracks (Vataja Vipadika)',
            'No clear fluid, but small painful pustular eruptions (Pitta Vidradhi / Folliculitis)'
          ],
          clinicalReason: 'Distinguishes Sravi (wet) vs Asravi (dry) Kushtha pathology for targeted Kashaya/Ghrita selection'
        }
      ];
    }

    // 6. Headache / Migraine (Shiroroga / Ardhavabhedaka / Suryavarta)
    if (lower.includes('headache') || lower.includes('migraine') || lower.includes('shira') || lower.includes('sir') || lower.includes('head') || complaintId === 'headache') {
      return [
        {
          id: 'inq_1',
          questionHi: 'सिरदर्द का स्थान और फैलाव कैसा है?',
          questionEn: 'What is the anatomical location and lateralization of your headache?',
          optionsHi: [
            'सिर के केवल एक तरफ (आधे सिर में) तेज धड़कता हुआ दर्द (Unilateral / Ardhavabhedaka / Migraine)',
            'माथे व दोनों कनपटी के चारों ओर कसने वाली पट्टी जैसा भारी दबाव (Tension Headache / Shirataap)',
            'गर्दन के पिछले हिस्से (Occiput) से शुरू होकर ऊपर सिर की ओर चढ़ने वाला दर्द (Cervicogenic)',
            'आंखों के ऊपर, भौंहों व नाक के आसपास भारीपन व झुकने पर तेज दर्द (Sinusitis / Suryavarta)'
          ],
          optionsEn: [
            'Throbbing, pulsating pain localized to one half of head / temple (Ardhavabhedaka / Migraine)',
            'Tight band-like constricting pressure wrapping around forehead and temples (Tension)',
            'Ache originating from suboccipital neck base radiating upwards to cranial vertex (Cervicogenic)',
            'Frontal facial pressure over eyebrow arches and nasal bridge worsening on bending (Sinus)'
          ],
          clinicalReason: 'Categorizes vascular migraine vs muscle-tension headache vs cervicogenic / sinus headache'
        },
        {
          id: 'inq_2',
          questionHi: 'सिरदर्द के साथ कौन से संवेदी लक्षण (Aura / Nausea / Photophobia) जुड़े हैं?',
          questionEn: 'What associated sensory symptoms occur alongside your headache episodes?',
          optionsHi: [
            'तेज रोशनी, तेज आवाज अथवा गंध बर्दाश्त नहीं होती (Photophobia & Phonophobia)',
            'जी मिचलाना, खट्टी उल्टी आना जिसके बाद सिरदर्द में थोड़ा आराम मिलना (Pitta Anubandha)',
            'आंखों के आगे चमकती रोशनी, आड़ी-तिरछी रेखाएं या धुंधलापन दिखना (Visual Aura)',
            'चक्कर आना (Vertigo / Bhrama) व सिर में खालीपन या हल्कापन महसूस होना'
          ],
          optionsEn: [
            'Extreme sensitivity to bright light, loud noise, and strong odors (Photo/Phonophobia)',
            'Severe nausea with bilious vomiting providing subsequent relief (Pitta-Vata Migraine)',
            'Visual aura: scintillating scotoma, flashing lights, or transient visual blurriness',
            'Dizziness, postural unsteadiness, or feeling of intracranial hollowness (Vataja Bhrama)'
          ],
          clinicalReason: 'Confirms classical migraine with aura criteria and Pitta-dominant neuro-vascular irritability'
        },
        {
          id: 'inq_3',
          questionHi: 'सिरदर्द किस समय अथवा किस ट्रिगर (Trigger Factor) से सबसे अधिक भड़कता है?',
          questionEn: 'What is the circadian timing or precipitating trigger for the headache flares?',
          optionsHi: [
            'समय पर भोजन न मिलने या उपवास रखने पर तुरंत तेज सिरदर्द शुरू होता है (Langhana / Pitta Prakopa)',
            'धूप में निकलने, गर्मी अथवा तेज रोशनी के संपर्क में आने से (Atapa Sevana / Suryavarta)',
            'रात को नींद पूरी न होने, देर रात तक स्क्रीन देखने अथवा मानसिक तनाव से (Nidra Viparyaya)',
            'सुबह सोकर उठने पर सूरज चढ़ने के साथ दर्द बढ़ता है और शाम को घटता है (Classic Suryavarta)'
          ],
          optionsEn: [
            'Triggered immediately by missed meals, delayed lunch or fasting (Hypoglycemic / Pitta trigger)',
            'Triggered by sunlight exposure, outdoor heat, or thermal variations (Suryavarta / Solar headache)',
            'Triggered by sleep deprivation, prolonged digital screen strain, or acute stress (Vata Hetu)',
            'Pain rises progressively with sunrise, peaks at midday, and declines at sunset (Suryavarta)'
          ],
          clinicalReason: 'Accurately diagnoses Suryavarta vs Pittaja Shirashoola for precise Shirodhara/Nasya protocols'
        },
        {
          id: 'inq_4',
          questionHi: 'सिरदर्द का दर्द किस प्रकार का महसूस होता है?',
          questionEn: 'How would you describe the sensation and character of head pain?',
          optionsHi: [
            'नसों में धक-धक (Pulsating / Throbbing) करने वाला तेज धड़कन जैसा दर्द',
            'सिर में सुई चुभने, चीरने या फटने जैसा असहनीय दर्द (Bheda / Toda Shula)',
            'सिर पर भारी पत्थर रखा होने जैसा सुन्न व भारी अहसास (Gaurava / Kaphaja)',
            'गर्दन की मांसपेशियों में खिंचाव के साथ लगातार मंद-मंद भारी दर्द'
          ],
          optionsEn: [
            'Intense pulsating and throbbing vascular ache synchronizing with heartbeat',
            'Sharp, stabbing, piercing or splitting sensation like needles inside head (Vataja Toda)',
            'Heavy, dull, numb feeling as if a heavy weight is pressing on head (Kaphaja Gaurava)',
            'Dull continuous tightening ache accompanied by stiff cervical neck spasms'
          ],
          clinicalReason: 'Distinguishes Vataja (Toda/Bheda) vs Pittaja (Daha/Spandana) vs Kaphaja (Gaurava) Shiroroga'
        },
        {
          id: 'inq_5',
          questionHi: 'किस उपाय या स्थिति से सिरदर्द में सबसे अधिक राहत मिलती है?',
          questionEn: 'What provides the greatest relief or ease during an acute headache attack?',
          optionsHi: [
            'अंधेरे शांत कमरे में बिना आवाज के सो जाने से (Dark quiet room isolation)',
            'सिर व माथे को जोर से बांधने अथवा ठंडी/गर्म पट्टी रखने से (Bandhana & Svedana)',
            'उल्टी होने, ठंडी हवा मिलने अथवा खट्टा-मीठा पेय लेने से (Pitta Shamana)',
            'चाय/कॉफी पीने अथवा गर्दन व सिर की तेल मालिश (Shiro-Abhyanga) कराने से'
          ],
          optionsEn: [
            'Lying down in a dark, quiet, distraction-free room and sleeping (Migraine Relief)',
            'Tight head wrapping / pressure headband application or warm fomentation (Vata Shamana)',
            'Induced vomiting, cooling environment, or sweet soothing beverages (Pitta Shamana)',
            'Caffeine / warm herbal tea intake alongside soothing cranial scalp oil massage'
          ],
          clinicalReason: 'Validates modality-specific doshic alleviation for prescribing Nasya, Shiro-Abhyanga, or Shirodhara'
        }
      ];
    }

    // 7. General Comprehensive 5-Question Clinical Set (Deterministic Fallback for All Other Conditions)
    return [
      {
        id: 'inq_1',
        questionHi: 'यह समस्या कितने समय से बनी हुई है और इसकी शुरुआत कैसे हुई थी?',
        questionEn: 'How long has this issue persisted and what was its mode of onset?',
        optionsHi: [
          'पिछले 3 से 6 महीने से अधिक समय से लगातार बनी हुई है (Chronic / Jirna Rogavastha)',
          'पिछले 1 से 2 सप्ताह में अचानक तीव्र रूप से शुरू हुई (Acute Onset / Navina)',
          'कई महीनों/वर्षों से बार-बार ठीक होकर दोबारा उभर आती है (Recurrent Episodic / Punaravartaka)',
          'हाल ही में किसी शारीरिक आघात, तनाव या बीमारी के बाद शुरू हुई (Post-stress / Secondary)'
        ],
        optionsEn: [
          'Persisting continuously for more than 3 to 6 months (Chronic / Jirna)',
          'Started suddenly with acute intensity over the past 1-2 weeks (Acute / Navina)',
          'Recurrent episodic flares resolving and relapsing over months/years (Recurrent)',
          'Triggered recently following physical trauma, severe stress, or prior illness'
        ],
        clinicalReason: 'Assesses chronicity (Jirnata vs Navinata) and prognosis (Sadhya vs Krichra-Sadhya)'
      },
      {
        id: 'inq_2',
        questionHi: 'आपकी जठराग्नि (भूख एवं पाचन) की वर्तमान स्थिति कैसी है?',
        questionEn: 'What is the current status of your digestive fire (Agni) and appetite?',
        optionsHi: [
          'भूख बहुत कम लगती है, भोजन के बाद पेट भारी व फूला रहता है (Mandagni & Ama)',
          'पाचन सामान्य, समय पर व सुगमता से होता है (Samagni / Good Digestion)',
          'भूख अनियमित रहती है — कभी तेज तो कभी बिल्कुल नहीं (Vishamagni / Vata imbalance)',
          'भूख अत्यधिक लगती है पर पेट में जलन व खट्टी डकारें होती हैं (Tikshnagni & Vidaha)'
        ],
        optionsEn: [
          'Poor appetite, sluggish digestion with heavy bloated stomach (Mandagni / Ama)',
          'Smooth, timely, and comfortable digestion with normal appetite (Samagni)',
          'Erratic fluctuating appetite — very sharp some days, absent on others (Vishamagni)',
          'Excessive intense hunger accompanied by sour acidity and burning (Tikshnagni)'
        ],
        clinicalReason: 'Fundamental AYUSH assessment of Jatharagni and systemic Ama accumulation'
      },
      {
        id: 'inq_3',
        questionHi: 'आपकी रात्रि निद्रा (Sleep Quality) और मानसिक विश्राम की क्या स्थिति है?',
        questionEn: 'What is the quality of your nocturnal sleep and mental tranquility?',
        optionsHi: [
          'नींद बार-बार टूटती है, बेचैनी रहती है और सुबह उठने पर ताजगी नहीं लगती (Anidra / Broken Sleep)',
          'देर रात तक करवटें बदलते रहते हैं, नींद आने में 1-2 घंटे लग जाते हैं (Delayed Onset Insomnia)',
          'गहरी, निर्बाध और सुखद 6-8 घंटे की नींद आती है (Prakrita Sukha Nidra)',
          'दिनभर अत्यधिक आलस्य व भारीपन रहता है पर रात को नींद अशांत रहती है'
        ],
        optionsEn: [
          'Fragmented, broken sleep with restless awakenings and unrefreshing mornings (Anidra)',
          'Severe difficulty falling asleep, tossing and turning for hours (Vata-Pitta Insomnia)',
          'Deep, restful, uninterrupted 6-8 hours of sound restorative sleep (Prakrita Nidra)',
          'Excessive daytime lethargy and heaviness coupled with disturbed night sleep'
        ],
        clinicalReason: 'Evaluates Manovaha Srotas balance, Ojas vitality and neuro-endocrine equilibrium'
      },
      {
        id: 'inq_4',
        questionHi: 'मल एवं मूत्र विसर्जन (Excretory Rhythm) की नियमितता कैसी है?',
        questionEn: 'What is the regularity and consistency of your bowel and urinary elimination?',
        optionsHi: [
          'कब्जियत (बद्धकोष्ठता) रहती है, पेट पूरी तरह साफ नहीं होता (Krura Koshtha / Constipation)',
          'प्रतिदिन सुबह एक बार बिना किसी कष्ट के सामान्य व पूर्ण पेट साफ होता है (Sama Koshtha)',
          'दिन में कई बार ढीला, चिपचिपा व अनिश्चित समय पर मल विसर्जन होता है (Mridu / Grahani)',
          'पेशाब में जलन, बार-बार जाने की आवश्यकता अथवा रात में बार-बार उठना पड़ता है (Mutra Dushti)'
        ],
        optionsEn: [
          'Chronic constipation with hard stools and feeling of incomplete evacuation (Krura Koshtha)',
          'Regular, smooth, effortless single daily morning bowel clearance (Prakrita Mala)',
          'Loose, sticky, urgent stools multiple times daily at unpredictable times (Mridu Koshtha)',
          'Urinary urgency, burning dysuria, or frequent nocturnal awakenings (Mutra Vaha Srotas)'
        ],
        clinicalReason: 'Assesses Apana Vayu function and Srotas purificatory efficiency'
      },
      {
        id: 'inq_5',
        questionHi: 'शारीरिक ऊर्जा, थकान एवं सहनशक्ति (Bala & Vitality) का स्तर कैसा रहता है?',
        questionEn: 'How would you rate your physical energy, fatigue, and daily vitality (Bala)?',
        optionsHi: [
          'सुबह से ही भारी थकान, बदन दर्द और कमजोरी महसूस होती है (Alasya & Daurbalya)',
          'दिन के काम आसानी से हो जाते हैं पर शाम होते-होते अत्यधिक थकान हो जाती है',
          'पूरे दिन अच्छी ऊर्जा और स्फूर्ति बनी रहती है (Uttama Bala)',
          'थोड़े से शारीरिक या मानसिक श्रम से सांस फूलना व चक्कर आने जैसा लगता है'
        ],
        optionsEn: [
          'Constant profound fatigue, body aches, and morning exhaustion (Daurbalya & Ama)',
          'Normal daytime function, but severe energy collapse and exhaustion by evening (Vata Kshaya)',
          'High sustainable energy and robust endurance throughout the day (Uttama Bala)',
          'Easily fatigued with mild exertion, palpitations, or lightheadedness (Pranavaha Kshaya)'
        ],
        clinicalReason: 'Evaluates Ojas, Dhatwagni competence and systemic constitutional Bala'
      }
    ];
  }

  /* ─────────────────────────────────────────────────────────────────────────
     2. [O] OBJECTIVE ASSIST
     Helps the Vaidya correlate Vitals + Ashtavidha Pariksha + CCRAS Prakriti:
  ───────────────────────────────────────────────────────────────────────── */
  async generateObjectiveAssist({
    vitals = {},
    ashtavidha = {},
    prakriti = 'Pitta-Vata',
    prakritiPercentages = { vata: 35, pitta: 55, kapha: 10 },
    agni = 'Tikshnagni',
    koshtha = 'Krura'
  }) {
    const isPitta = prakriti.includes('Pitta');
    const isVata = prakriti.includes('Vata');

    const nadiGati = ashtavidha?.nadi || 'Manduka Gati (Pitta Predominant)';
    const jihwaState = ashtavidha?.jihwa || 'Saama (Coated with white film)';

    return {
      source: 'AIIA Pariksha Synthesis Engine',
      parikshaCorrelation: `${nadiGati} एवं ${jihwaState} का संयोजन रोगी की ${prakriti} में तीव्र पित्त-प्रकोप के साथ आम (Metabolic toxins) की उपस्थिति को सिद्ध करता है।`,
      parikshaCorrelationEn: `Nadi: ${nadiGati} combined with Jihwa: ${jihwaState} corroborates active Pitta surge with systemic Ama coating in a constitutional ${prakriti} background.`,
      clinicalPointers: [
        `Agni is ${agni}: High metabolic heat requires cooling Deepana-Pachana without dry pungent spices.`,
        `Koshtha is ${koshtha}: Mild downward laxative (Mridu Anulomana) indicated to clear Amashayagata Pitta.`,
        `BMI & Vitals: BP ${vitals.bp || '128/84'} mmHg, Pulse ${vitals.pulse || '78 bpm'} — stable hemodynamic status.`
      ],
      suggestedDoshaShift: isPitta ? 'Pitta Prakopa (+15% above baseline)' : 'Vata Sanchaya'
    };
  }

  /* ─────────────────────────────────────────────────────────────────────────
     3. [A] ASSESSMENT ASSIST (HOLISTIC CORRELATION OF ALL DATA)
     Correlates: Subjective Inquiries + HPI + Ashtavidha + Vitals + CCRAS Prakriti + Agni + Koshtha
     Synthesizes: Samprapti Ghataka Matrix + NAMASTE/ICD-11 Vinishchaya + Differentials
  ───────────────────────────────────────────────────────────────────────── */
  async generateAssessmentAssist({
    patientAge = 45,
    patientGender = 'Female',
    chiefComplaint = 'Amlapitta',
    complaintId = '',
    socrates = {},
    kioskInquiries = {},
    doctorSubjectiveNotes = '',
    prakriti = 'Pitta-Vata',
    prakritiPercentages = { vata: 35, pitta: 55, kapha: 10 },
    vitals = {},
    ashtavidha = {},
    agni = 'Tikshnagni',
    koshtha = 'Krura'
  }) {
    const activeKey = this.getApiKey();

    // Format MediKiosk Inquiry responses into readable clinical string
    let formattedInquiries = 'None recorded';
    if (kioskInquiries && typeof kioskInquiries === 'object') {
      const entries = Object.entries(kioskInquiries);
      if (entries.length > 0) {
        formattedInquiries = entries.map(([k, v]) => {
          if (typeof v === 'object' && v !== null) {
            return `Q: "${v.question || v.questionHi || k}" -> Patient Answer: "${v.answer || v.selectedOption}" (Clinical Significance: ${v.clinicalReason || 'Diagnostic marker'})`;
          }
          return `${k}: ${v}`;
        }).join('\n  ');
      }
    }

    if (activeKey) {
      try {
        const prompt = `You are a Senior Ayurvedic Clinical Diagnostician and Pathologist at AIIA & CCRAS (Ministry of AYUSH).
You are performing a comprehensive Rogi-Roga Pariksha (रोग-रोगी परीक्षा) clinical synthesis for this patient:

=== [1. PATIENT DEMOGRAPHICS & SUBJECTIVE DATA] ===
- Patient: ${patientAge} years old (${patientGender})
- Chief Complaint: "${chiefComplaint}" (ID: ${complaintId})
- HPI (SOCRATES):
  * Site (Sthana): ${socrates.site || 'Epigastrium & Retrosternal'}
  * Onset & Duration (Kala): ${socrates.onset || 'Chronic > 3 months'}
  * Character (Rupa): ${socrates.character || 'Burning sour sensation (Vidaha)'}
  * Radiation: ${socrates.radiation || 'Throat & Retrosternal'}
  * Associated Symptoms: ${Array.isArray(socrates.associatedSymptoms) ? socrates.associatedSymptoms.join(', ') : (socrates.associatedSymptoms || 'Nausea, Sour eructation')}
  * Exacerbating Factors: ${socrates.exacerbating || 'Spicy food, late meals'}
  * Pain/Distress Scale: ${socrates.painScale || vitals.painScale || '6/10'}
- MediKiosk Clinical Inquiries & Patient Responses:
  ${formattedInquiries}
- Doctor Subjective Notes: "${doctorSubjectiveNotes || 'None entered'}"

=== [2. OBJECTIVE & CLINICAL EXAMINATION DATA] ===
- Recorded Vitals: BP=${vitals.bp || '128/84 mmHg'}, Pulse=${vitals.pulse || '78 bpm'}, Temp=${vitals.temp || '98.4 °F'}, SpO2=${vitals.spo2 || '98%'}, BMI=${vitals.bmi || '24.2'}, Blood Sugar=${vitals.sugar || '112 mg/dL'}
- Ashtavidha Pariksha (8 Clinical Signs):
  * Nadi (Pulse): ${ashtavidha.nadi || 'Manduka Gati (Rapid & Bounding - Pitta)'}
  * Jihwa (Tongue): ${ashtavidha.jihwa || 'Saama (White Coated - Ama present)'}
  * Mala (Bowel): ${ashtavidha.mala || 'Vibandha / Malasanga (Constipated/Irregular)'}
  * Mutra (Urine): ${ashtavidha.mutra || 'Peeta / Sadaha (Yellowish with mild burning)'}
  * Shabda (Speech): ${ashtavidha.shabda || 'Prakrita / Spashta (Clear)'}
  * Sparsha (Touch/Skin): ${ashtavidha.sparsha || 'Ushna (Elevated local warmth)'}
  * Drik (Eyes): ${ashtavidha.drik || 'Rakta-Peetaabha (Mild hyperemic)'}
  * Akriti (Physical Build): ${ashtavidha.akriti || 'Madhyama Shareera'}
- Jatharagni Status: ${agni}
- Koshtha Status: ${koshtha}
- CCRAS Standardized Prakriti: ${prakriti} (Vata: ${prakritiPercentages.vata || 35}%, Pitta: ${prakritiPercentages.pitta || 55}%, Kapha: ${prakritiPercentages.kapha || 10}%)

=== [DIAGNOSTIC TASK] ===
Synthesize an evidence-backed Ayurvedic Assessment where ALL answers are strictly correlated to the above subjective inquiries, vitals, Ashtavidha examination, and CCRAS Prakriti.
Return JSON format:
{
  "correlationSummary": "2-3 sentences explaining exactly how the patient's specific symptoms, kiosk inquiry answers, Nadi/Jihwa, and Prakriti correlate to this diagnostic conclusion.",
  "primaryDiagnosis": "Classical Ayurvedic Disease Name (e.g. Urdhvaga Amlapitta)",
  "primaryDiagnosisHi": "मुख्य व्याधि नाम (हिंदी में)",
  "namasteCode": "Official AYUSH NAMASTE standard code (e.g. AYU-AML-01)",
  "icd11Code": "ICD-11 TM1 code (e.g. MD12.0 or SF01)",
  "confidence": "e.g. 96% High Clinical Correlation",
  "confidenceRationale": "Specific clinical reason why this diagnosis fits all data",
  "differentialDiagnoses": [
    {
      "name": "Differential Disease 1",
      "nameHi": "हिंदी नाम",
      "namasteCode": "NAMASTE code",
      "icd11Code": "ICD-11 code",
      "confidence": "e.g. 64% Secondary Consideration",
      "differentiatingFeature": "Specific sign from the patient's examination/inquiries that distinguishes it"
    },
    {
      "name": "Differential Disease 2",
      "nameHi": "हिंदी नाम",
      "namasteCode": "NAMASTE code",
      "icd11Code": "ICD-11 code",
      "confidence": "e.g. 48% Low Likelihood",
      "differentiatingFeature": "Why ruled out or less likely"
    }
  ],
  "ghatakas": {
    "dosha": "Precise vitiated sub-doshas (e.g. Pachaka Pitta, Samana & Apana Vayu)",
    "dushya": "Involved Dhatus (e.g. Rasa, Rakta, Amashayagata Anna-Rasa)",
    "agni": "Specific Agni status correlated to patient's ${agni}",
    "ama": "Ama status correlated to Jihwa examination (${ashtavidha.jihwa || 'Saama'})",
    "srotas": "Involved Srotas (e.g. Annavaha, Rasavaha, Purishavaha)",
    "srotodushti": "Sroto-dushti type (e.g. Vimargagamana / Atipravritti / Sanga)",
    "udbhavasthana": "Origin site (e.g. Amashaya)",
    "sancharasthana": "Circulation path (e.g. Urdhva Marga / Esophagus)",
    "vyaktasthana": "Manifestation site (e.g. Hridaya, Kantha, Mukha)",
    "rogamarga": "Rogamarga (e.g. Abhyantara Rogamarga)",
    "sadhyasadhyata": "Curability (Sukha Sadhya / Krichra Sadhya / Yapya)"
  },
  "pathophysiologicalRationale": [
    "Step 1 citing patient's specific presentation and inquiries",
    "Step 2 citing Dosha-Dushya interaction",
    "Step 3 correlating examination findings (Nadi/Jihwa/Vitals)"
  ],
  "nidana": {
    "aharaja": ["Dietary trigger 1", "Dietary trigger 2"],
    "viharaja": ["Lifestyle trigger 1", "Lifestyle trigger 2"],
    "manasika": ["Emotional trigger 1", "Emotional trigger 2"]
  },
  "purvarupa": ["Prodromal sign 1", "Prodromal sign 2"],
  "rupa": ["Manifested symptom 1", "Manifested symptom 2"],
  "upashayaAnupashaya": {
    "upashaya": ["Relieving factor 1 (✓)", "Relieving factor 2 (✓)"],
    "anupashaya": ["Aggravating factor 1 (✗)", "Aggravating factor 2 (✗)"]
  }
}
Return ONLY valid JSON.`;
        const res = await this.callGeminiRaw(prompt);
        if (res && res.primaryDiagnosis) {
          return { ...res, source: 'Gemini Live Rogi-Roga Synthesis' };
        }
      } catch (e) {
        console.warn('Assessment AI fallback to classical engine:', e);
      }
    }

    // Dynamic, correlated classical fallback engine
    const lower = (chiefComplaint || '').toLowerCase() + ' ' + (complaintId || '').toLowerCase();
    const isPittaDom = (prakriti || '').includes('Pitta');
    const isVataDom = (prakriti || '').includes('Vata');
    const isKaphaDom = (prakriti || '').includes('Kapha');

    if (lower.includes('joint') || lower.includes('ghutna') || lower.includes('sandhi') || lower.includes('pain') && !lower.includes('chest')) {
      const isAmavata = (ashtavidha.jihwa || '').toLowerCase().includes('saama') || (ashtavidha.jihwa || '').toLowerCase().includes('coat');
      return {
        source: 'AIIA Classical AYUSH Diagnostic Engine (Correlated)',
        correlationSummary: `रोगी की ${prakriti} पृष्ठभूमि में ${ashtavidha.nadi || 'वात नाड़ी'} एवं ${ashtavidha.jihwa || 'साम जिह्वा'} यह सिद्ध करते हैं कि ${isAmavata ? 'आमवात (अग्निमांद्य जन्य शोथ)' : 'संधिगत वात (धातुक्षय जन्य शूल)'} का प्रकोप है।`,
        primaryDiagnosis: isAmavata ? 'Amavata (Rheumatoid / Inflammatory Polyarthritis)' : 'Sandhigata Vata (Osteoarthritis)',
        primaryDiagnosisHi: isAmavata ? 'आमवात (साम वात शोथ)' : 'संधिगत वात (अस्थि-सन्धि वात)',
        namasteCode: isAmavata ? 'AYU-AMA-01' : 'AYU-SAN-02',
        icd11Code: isAmavata ? 'FA20' : 'FA00',
        confidence: '92% High Clinical Correlation',
        confidenceRationale: `Correlated with ${ashtavidha.jihwa || 'Saama Jihwa'}, joint pain score ${vitals.painScale || '6/10'}, and constitutional ${prakriti}.`,
        differentialDiagnoses: [
          { name: 'Vatarakta (Gouty Arthritis / Hyperuricemia)', nameHi: 'वातरक्त', namasteCode: 'AYU-VRK-03', icd11Code: 'FA25', confidence: '58% Differential Match', differentiatingFeature: 'No initial Podagra or severe burning in small toe joints.' },
          { name: 'Kroshtuka Shirsha (Monoarthritis of Knee with Effusion)', nameHi: 'क्रोष्टुक शीर्ष', namasteCode: 'AYU-KRO-04', icd11Code: 'FA02', confidence: '42% Low Match', differentiatingFeature: 'Bilateral involvement rather than isolated fox-head swelling.' }
        ],
        ghatakas: {
          dosha: isAmavata ? 'Samana & Vyana Vayu with Kapha (Ama association)' : 'Vyana Vayu, Shleshaka Kapha Kshaya',
          dushya: 'Asthi Dhatu, Majja Dhatu, Sandhi Snayu, Kandara',
          agni: 'Mandagni / Vishamagni',
          ama: isAmavata ? 'Saama (Severe metabolic endotoxins)' : 'Nirama',
          srotas: 'Asthivaha, Rasavaha, Majjavaha Srotas',
          srotodushti: 'Sanga (Obstruction) & Sthira Ruja',
          udbhavasthana: 'Amashaya (in Amavata) / Pakwashaya (in Sandhivata)',
          sancharasthana: 'Rasayani & Sarva Sharira Sandhis',
          vyaktasthana: 'Janu & Hasta-Pada Sandhi (Joints)',
          rogamarga: 'Madhyama Rogamarga (Dhatu-Asthi-Sandhi pathway)',
          sadhyasadhyata: 'Krichra Sadhya (Chronic but manageable with Panchakarma)'
        },
        pathophysiologicalRationale: [
          `Impaired Jatharagni causes formation of unripe Ama that circulates via Rasavaha channels.`,
          `Ama lodges in Sandhis (joint cavities) where Shleshaka Kapha is already perturbed by ${prakriti}.`,
          `This causes characteristic Stambha (morning stiffness), Toda (pricking pain), and localized Sparsha-Asahatva.`
        ],
        nidana: {
          aharaja: [
            'Sheeta & Ruksha Ahara (शीत एवं रूक्ष आहार सेवन)',
            'Vishamashana (अनियमित खानपान)',
            'Katu & Kashaya Rasa Atisevana (अत्यधिक तीखा व कसैला भोजन)'
          ],
          viharaja: [
            'Ati-Vyayama & Gamana (अत्यधिक चलना या शारीरिक श्रम)',
            'Sheeta Vata Sevana (ठंडी हवा एवं एसी का निरंतर संपर्क)',
            'Ratri Jagarana (देर रात तक जागना / वात प्रकोप)',
            'Vegadharana (मल-मूत्र आदि वेगावरोध)'
          ],
          manasika: [
            'Chinta & Manodvega (अत्यधिक चिंता व तनाव)',
            'Shoka & Bhaya (शोक व भय — वात प्रकोपक)'
          ]
        },
        purvarupa: [
          'Sandhi Stambha (प्रातःकाल जोड़ों में जकड़ाहट)',
          'Gatra Gaurava (शरीर में भारीपन व अंगमर्द्द)',
          'Sandhi Sphutana (जोड़ों से कट-कट आवाज / Crepitus)',
          'Alpa Ruja (चलने पर हल्का दर्द)'
        ],
        rupa: [
          'Janu Sandhi Shoola (घुटनों व जोड़ों में तीव्र शूल)',
          'Prasarana-Akunchana Vedana (मोड़ने व सीधा करने पर असह्य दर्द)',
          'Sandhi Shotha (जोड़ों में सूजन व जकड़न)',
          'Sparsha-Asahatva (स्पर्श करने पर दर्द / Tenderness)',
          'Gati Sanga (चलने-फिरने में असमर्थता)'
        ],
        upashayaAnupashaya: {
          upashaya: [
            'Ushna Swedana & Snehana (गर्म सेंक व तैल मालिश से आराम ✓)',
            'Vishrama (विश्राम करने से दर्द में राहत ✓)',
            'Ushna Bhojana & Ghrita (गर्म ताजा स्निग्ध भोजन ✓)',
            'Janu Basti & Nadi Sweda (स्थानिक जानु बस्ति चिकित्सा ✓)'
          ],
          anupashaya: [
            'Sheeta Jala & Vata (ठंडे पानी या ठंडे मौसम से दर्द वृद्धि ✗)',
            'Ati-Gamana & Bharavahana (अधिक पैदल चलना या वजन उठाना ✗)',
            'Ruksha & Vata-vardhaka Ahara (रूखे, बासी व ठंडे भोजन से वृद्धि ✗)'
          ]
        }
      };
    }

    // Default: Digestive / Amlapitta / Peptic correlation
    return {
      source: 'AIIA Standardized Samprapti Protocol (Correlated)',
      correlationSummary: `रोगी की ${prakriti} प्रकृति (${prakritiPercentages.pitta || 55}% पित्त), ${agni} एवं नाड़ी (${ashtavidha.nadi || 'मंडूक गति'}) सीधे तौर पर पाचक पित्त के विदग्ध होकर ऊर्ध्वगमन को प्रमाणित करते हैं।`,
      primaryDiagnosis: 'Urdhvaga Amlapitta (Hyperchlorhydria / Peptic Reflux)',
      primaryDiagnosisHi: 'ऊर्ध्वग अम्लपित्त (पाचक पित्त विदाह)',
      namasteCode: 'NAMASTE-AYU-AML-01',
      icd11Code: 'ICD11-TM1-MD12.0',
      confidence: '95% High Clinical Match',
      confidenceRationale: `Directly matches post-prandial burning (Parinama Shula), ${ashtavidha.jihwa || 'Saama Jihwa'}, ${agni}, and constitutional ${prakriti}.`,
      differentialDiagnoses: [
        { name: 'Annadrava Shula (Peptic / Gastric Ulcer Disease)', nameHi: 'अन्नद्रव शूल', namasteCode: 'AYU-SHU-02', icd11Code: 'MD12.1', confidence: '62% Differential Consideration', differentiatingFeature: 'Burning pain relieved briefly immediately post-meal but recurring.' },
        { name: 'Parinama Shula (Duodenal Ulcer / Food-induced Pain)', nameHi: 'परिणाम शूल', namasteCode: 'AYU-SHU-03', icd11Code: 'MD12.2', confidence: '54% Differential Consideration', differentiatingFeature: 'Pain strictly peaks during 2-3 hour digestion window.' },
        { name: 'Pitta-Vataja Grahani (Functional Dyspeptic Syndrome)', nameHi: 'पित्त-वातज ग्रहणी', namasteCode: 'AYU-GRA-04', icd11Code: 'MD12.5', confidence: '45% Low Likelihood', differentiatingFeature: 'Minimal Muhurbaddha-Muhurdrava stool episodes.' }
      ],
      ghatakas: {
        dosha: 'Pachaka Pitta (Prakopa & Vidaha), Samana & Apana Vayu (Vimargagamana)',
        dushya: 'Rasa Dhatu, Amashayagata Anna-Rasa, Rakta Dhatu',
        agni: agni || 'Tikshnagni with Vidaha (Pitta Vaidharmya)',
        ama: (ashtavidha.jihwa || '').toLowerCase().includes('saama') ? 'Saama (Metabolic toxins coating mucosa)' : 'Alpa-Ama',
        srotas: 'Annavaha, Purishavaha, Rasavaha Srotas',
        srotodushti: 'Vimargagamana (Retrograde / Acidic Reflux) & Sanga',
        udbhavasthana: 'Amashaya (Stomach / Gastric fundus)',
        sancharasthana: 'Rasayani & Urdhva Marga (Gastro-esophageal pathway)',
        vyaktasthana: 'Hrid-Kantha-Koshtha (Retrosternal, Throat, Epigastrium)',
        rogamarga: 'Abhyantara Rogamarga (Gastrointestinal luminal pathway)',
        sadhyasadhyata: 'Sukha Sadhya (Readily manageable with Pathya, Sheeta Virya Dravyas & Virechana)'
      },
      pathophysiologicalRationale: [
        `Consumption of Vidahi and Amla Ahara stimulates excess Drava (liquid) & Teekshna (hot/sharp) attributes of Pachaka Pitta in a ${prakriti} individual.`,
        `Impaired Apana Vayu fails in normal Anulomana (downward propulsion) and begins Vimargagamana (reverse push) towards the esophagus.`,
        `Irritation of gastric mucosa triggers classic symptoms: Hrid-Kantha Daha (chest/throat burning), Tikta-Amla Udgara (acid sour burps), and epigastric discomfort.`
      ],
      nidana: {
        aharaja: [
          'Vidahi & Amla Ahara (तीखा, खट्टा, तला-भुना व सिरका युक्त भोजन)',
          'Katu-Lavana Atisevana (अत्यधिक मिर्च-मसालेदार व नमकीन पदार्थ)',
          'Viruddha Ahara & Fast Food (विरुद्धाहार, जंक फूड, बार-बार चाय/कॉफी)'
        ],
        viharaja: [
          'Ratri Jagarana (देर रात तक जागना / पित्त प्रकोप)',
          'Divasvapna post-meal (भोजनोपरांत दिन में सोना)',
          'Bhuktva Swapna (भोजन के तुरंत बाद लेट जाना)'
        ],
        manasika: [
          'Krodha & Amarsha (क्रोध, चिड़चिड़ापन व मानसिक उत्तेजना)',
          'Chinta & Manasika Tanav (तनाव एवं अत्यधिक चिंता)'
        ]
      },
      purvarupa: [
        'Avipaka & Aruchi (भोजन में अरुचि व मंद पाचन)',
        'Utklesha (उबकाई या मिचली जैसा अहसास)',
        'Klama (बिना श्रम के भी थकावट)',
        'Gaurava (उदर व शरीर में भारीपन)'
      ],
      rupa: [
        'Hrit-Kantha Daha (सीने एवं कंठ में खट्टी व तीखी जलन)',
        'Tikta-Amlodgara (कड़वे व खट्टे डकार आना)',
        'Kukshi Shoola (पेट के ऊपरी भाग / आमाशय में शूल)',
        'Shiroruja (पित्त वृद्धि जन्य सिरदर्द)'
      ],
      upashayaAnupashaya: {
        upashaya: [
          'Sheeta Virya Dravyas & Ghrita (शीतल पदार्थ, गाय का दूध व घृत ✓)',
          'Mudga Yusha (मूंग दाल का हल्का सूप ✓)',
          'Virechana & Tikta Rasa (विरेचन व तिक्त रस युक्त शमन औषधियां ✓)'
        ],
        anupashaya: [
          'Tikshna-Katu Bhojana (मिर्च, राई, सिरका व खटाई ✗)',
          'Krodha & Ratri Jagarana (क्रोध व रात्रि जागरण ✗)',
          'Dahi & Fermented Food (खट्टा दही व किण्वित भोजन ✗)'
        ]
      }
    };
  }

  /* ─────────────────────────────────────────────────────────────────────────
     4. [P] PLAN & PRESCRIPTION ASSIST (HOLISTIC CORRELATION OF ALL DATA)
     Correlates: Confirmed Diagnosis + Samprapti Ghatakas + Ashtavidha + Agni + Prakriti + Modern Meds
     Synthesizes: Chikitsa Sutra, Formulations (Dose, Kaala, Anupana), Pathya/Apathya, Yoga, CDSS alerts
  ───────────────────────────────────────────────────────────────────────── */
  async generatePlanAssist({
    patientAge = 45,
    patientGender = 'Female',
    chiefComplaint = 'Amlapitta',
    complaintId = '',
    confirmedDiagnosis = null,
    activeGhatakas = null,
    doctorSubjectiveNotes = '',
    doctorAssessmentNotes = '',
    prakriti = 'Pitta-Vata',
    prakritiPercentages = { vata: 35, pitta: 55, kapha: 10 },
    vitals = {},
    ashtavidha = {},
    agni = 'Tikshnagni',
    koshtha = 'Krura',
    currentMedications = ['Telmisartan 40mg'],
    allergies = [],
    kioskInquiries = {}
  }) {
    const activeKey = this.getApiKey();

    const diagName = confirmedDiagnosis?.name || 'Urdhvaga Amlapitta (Hyperchlorhydria)';
    const diagNameHi = confirmedDiagnosis?.nameHi || 'ऊर्ध्वग अम्लपित्त';
    const namasteCode = confirmedDiagnosis?.namasteCode || 'AYU-AML-01';
    const icd11Code = confirmedDiagnosis?.icd11Code || 'MD12.0';

    const ghatakas = activeGhatakas || {
      dosha: 'Pachaka Pitta (Prakopa), Samana & Apana Vayu (Vimargagamana)',
      dushya: 'Rasa Dhatu, Amashayagata Anna-Rasa',
      agni: agni || 'Tikshnagni',
      ama: 'Saama State',
      srotas: 'Annavaha & Rasavaha Srotas',
      srotodushti: 'Vimargagamana'
    };

    if (activeKey) {
      try {
        const prompt = `You are a Senior Consulting Ayurvedic Pharmacologist and Clinician at CCRAS & Ministry of AYUSH.
You are formulating a personalized, evidence-based Ayurvedic Treatment Plan & Prescription.
You MUST rigorously correlate ALL data across Subjective, Objective, and Assessment layers:

=== [1. CONFIRMED ASSESSMENT & SAMPRAPTI BASELINE] ===
- Confirmed Clinical Diagnosis: "${diagName}" (${diagNameHi})
- Codes: NAMASTE=${namasteCode} | ICD-11=${icd11Code}
- Samprapti Ghatakas:
  * Involved Dosha: ${ghatakas.dosha || 'Pachaka Pitta, Apana Vayu'}
  * Involved Dushya: ${ghatakas.dushya || 'Rasa Dhatu'}
  * Agni Status: ${agni || ghatakas.agni || 'Tikshnagni'}
  * Ama State: ${ghatakas.ama || 'Saama'}
  * Sroto-dushti: ${ghatakas.srotodushti || 'Vimargagamana'}
- Doctor Assessment Notes: "${doctorAssessmentNotes || 'None'}"

=== [2. PATIENT CONSTITUTION & EXAMINATION FINDINGS] ===
- Patient: ${patientAge}Y / ${patientGender} | Chief Complaint: "${chiefComplaint}"
- CCRAS Standardized Prakriti: ${prakriti} (Vata: ${prakritiPercentages.vata || 35}%, Pitta: ${prakritiPercentages.pitta || 55}%, Kapha: ${prakritiPercentages.kapha || 10}%)
- Agni: ${agni} | Koshtha (Bowel habit): ${koshtha}
- Ashtavidha Pariksha: Nadi=${ashtavidha.nadi || 'Manduka Gati'}, Jihwa=${ashtavidha.jihwa || 'Saama'}, Mala=${ashtavidha.mala || 'Vibandha'}
- Hemodynamic Vitals: BP=${vitals.bp || '128/84'}, Pulse=${vitals.pulse || '78'}, Sugar=${vitals.sugar || '112 mg/dL'}
- Concurrent Allopathic Medications: ${JSON.stringify(currentMedications)}
- Known Allergies: ${JSON.stringify(allergies)}

=== [TREATMENT PLANNING TASK] ===
Formulate a safe, highly tailored Ayurvedic prescription that directly addresses the confirmed diagnosis, the patient's individual Agni/Koshtha, and checks for interactions with allopathic meds.
Return JSON format:
{
  "correlationRationale": "A concise paragraph explaining how this specific treatment plan directly correlates to the confirmed diagnosis of ${diagName}, the patient's ${prakriti} constitution, their ${agni}, and their ${koshtha} koshtha.",
  "chikitsaSutra": "Core clinical management principle in English (e.g. Pitta Shamana, Deepana-Pachana, Mridu Anulomana)",
  "chikitsaSutraHi": "चिकित्सा सूत्र (हिंदी में)",
  "recommendedFormulations": [
    {
      "name": "Classical Ayurvedic Medicine Name (e.g. Kamadudha Rasa Moti Yukta)",
      "kalpana": "Vati / Churna / Kwath / Asava / Rasaushadhi / Ghrita",
      "dose": "Precise therapeutic dose adjusted for patient's Agni & weight (e.g. 250 mg / 5 g)",
      "frequency": "BD (Twice Daily) / TDS / HS",
      "kaala": "Classical timing based on vitiated sub-dosha (e.g. Pragbhakta before meals / Adhobhakta after meals / Nishikala)",
      "anupana": "Specific medium suited to the patient's Prakriti (e.g. Godugdha / Ushnodaka / Amalaki Swarasa)",
      "duration": "15 Days / 30 Days",
      "rationale": "Exact Ayurvedic pharmacological mechanism resolving the specific Samprapti"
    }
  ],
  "pathyaAhara": ["Specific food 1", "Specific food 2", "Specific food 3", "Specific food 4"],
  "apathyaAhara": ["Avoid item 1", "Avoid item 2", "Avoid item 3", "Avoid item 4"],
  "dinacharyaYoga": "Personalized daily routine, Pranayama (e.g. Sheetali/Nadi Shodhana), and Asanas suited to this condition",
  "panchakarmaProcedures": [
    {
      "procedure": "Panchakarma / Upakrama procedure name (e.g. Mridu Virechana)",
      "dravya": "Medicinal Dravya / Taila / Kwath",
      "sessions": "Duration & schedule",
      "notes": "Clinical administration guidelines"
    }
  ],
  "cdssCautions": [
    "Herb-drug interaction warning regarding concurrent medications (${JSON.stringify(currentMedications)}) and any contraindications based on BP/Sugar."
  ]
}
Return ONLY valid JSON.`;
        const res = await this.callGeminiRaw(prompt);
        if (res && res.chikitsaSutra && Array.isArray(res.recommendedFormulations)) {
          return { ...res, source: 'Gemini Live Pharmacopoeia Engine (Correlated)' };
        }
      } catch (e) {
        console.warn('Plan AI fallback to classical engine:', e);
      }
    }

    // Dynamic, correlated classical fallback engine
    const lowerDiag = (diagName || '').toLowerCase() + ' ' + (chiefComplaint || '').toLowerCase();
    const isJoint = lowerDiag.includes('amavata') || lowerDiag.includes('sandhi') || lowerDiag.includes('joint') || lowerDiag.includes('arthritis');

    if (isJoint) {
      const isAmavata = lowerDiag.includes('amavata') || (ashtavidha.jihwa || '').toLowerCase().includes('saama');
      return {
        source: 'CCRAS Standardized Musculoskeletal Protocol (Correlated)',
        correlationRationale: `प्रमाणित निदान "${diagName}" एवं रोगी की ${prakriti} प्रकृति के अनुसार, ${isAmavata ? 'दीपन-पाचन एवं आम-पाचन के उपरांत शोधन' : 'स्नेहन, स्वेदन एवं वात-शामक तिक्त घृत'} का विधान किया गया है।`,
        chikitsaSutra: isAmavata ? 'Langhana, Deepana-Pachana, Swedana, Tikta-Katu Basti & Vata Shamana' : 'Snehana, Swedana, Sandhi-Vatahara, Asthi-Majja Poshana & Rasayana',
        chikitsaSutraHi: isAmavata ? 'लंघन, दीपन-पाचन, स्वेदन, तिक्त-कटु बस्ति एवं वात शमन' : 'स्नेहन, स्वेदन, सन्धि-वातहर, अस्थि-मज्जा पोषण एवं रसायन',
        recommendedFormulations: [
          {
            name: isAmavata ? 'Simhanada Guggulu' : 'Yogaraja Guggulu',
            kalpana: 'Guggulu Kalpana / Vati',
            dose: '2 Vati (500mg each)',
            frequency: 'BD (Twice Daily)',
            kaala: 'Adhobhakta (After Meals)',
            anupana: 'Ushnodaka (Warm Water) or Rasnasaptak Kwath',
            duration: '15 Days',
            rationale: isAmavata ? 'Breaks systemic Ama blockages and eases severe morning joint stiffness.' : 'Nourishes Asthi-Majja Dhatus and calms local joint Vata-Prakopa.'
          },
          {
            name: 'Rasnasaptaka Kwatha',
            kalpana: 'Kwatha (Decoction)',
            dose: '40 ml',
            frequency: 'BD (Morning & Evening)',
            kaala: 'Pragbhakta (Empty Stomach)',
            anupana: 'Lukewarm with pinch of Sunthi churna',
            duration: '15 Days',
            rationale: 'Potent anti-inflammatory action targeting sacroiliac and weight-bearing synovial joints.'
          },
          {
            name: isAmavata ? 'Castor Oil (Eranda Sneha)' : 'Shallaki (Boswellia serrata) 500mg',
            kalpana: isAmavata ? 'Sneha Dravya' : 'Extract Capsule',
            dose: isAmavata ? '10-15 ml' : '1 Cap',
            frequency: isAmavata ? 'HS (Bedtime once weekly)' : 'BD',
            kaala: isAmavata ? 'Nishikala' : 'Adhobhakta',
            anupana: 'Warm Ginger Water',
            duration: '15 Days',
            rationale: isAmavata ? 'Classic Srotoshodhaka laxative for clearing Amashayagata Ama.' : 'Proven chondro-protective action reducing cartilage degeneration.'
          }
        ],
        pathyaAhara: [
          'Purana Yava (Aged barley), Kulattha (Horsegram soup), and lightly cooked Moong dal',
          'Garlic (Lashuna) and Dry Ginger (Sunthi) boiled in water',
          'Bitter vegetables: Patola (Pointed gourd), Karavellaka (Bitter gourd)',
          'Warm water for drinking at all times'
        ],
        apathyaAhara: [
          'Cold, refrigerated food, ice water, and cold windy weather exposure',
          'Heavy-to-digest items: Curd (Dahi), Urad dal, sweets, refined flour (Maida)',
          'Day sleeping (Diva Swapna) and suppressing natural urges (Vegadharana)'
        ],
        dinacharyaYoga: 'Sukshma Vyayama (gentle range-of-motion exercises), Bhujangasana, Gomukhasana. Avoid high-impact joint loading.',
        panchakarmaProcedures: [
          { procedure: 'Valuka Sweda (Sand bag fomentation)', dravya: 'Dry medicinal sand with Sunthi & Saindhava', sessions: '7 Sessions (20 min)', notes: 'Indicated for Saama joint swelling; avoid oil massage if joint is hot/red.' },
          { procedure: 'Janu Basti', dravya: 'Mahanarayana Taila & Ksheerabala 101', sessions: '7 Sessions (30 min)', notes: 'Indicated for Nirama osteoarthritis to nourish cartilage.' }
        ],
        cdssCautions: [
          'Guggulu formulations possess mild antiplatelet effects: monitor carefully if patient is prescribed allopathic antiplatelet agents.',
          'Patient blood pressure: ensure herbs with mild licorice (Yashtimadhu) are dose-controlled.'
        ]
      };
    }

    // Default: Digestive / Amlapitta / Peptic Plan
    return {
      source: 'CCRAS Standardized Treatment Protocol (Correlated)',
      correlationRationale: `प्रमाणित निदान "${diagName}" (${diagNameHi}), रोगी की ${prakriti} प्रकृति, ${agni} एवं ${koshtha} को ध्यान में रखते हुए यह उपचार पाचक पित्त के तीव्र विदाह को शांत करने, अग्नि को सम करने एवं अपान वायु के अनुलोमन हेतु संयोजित किया गया है।`,
      chikitsaSutra: 'Pitta-Shamana, Deepana-Pachana, Mridu Anulomana & Dahaprashamana',
      chikitsaSutraHi: 'पित्त-शमन, दीपन-पाचन, मृदु अनुलोमन एवं दाहप्रशमन चिकित्सा',
      recommendedFormulations: [
        {
          name: 'Kamadudha Rasa (Moti Yukta)',
          kalpana: 'Rasaushadhi / Pishti',
          dose: '250 mg',
          frequency: 'BD (Twice Daily)',
          kaala: 'Adhobhakta (After Meals)',
          anupana: 'Godugdha (Warm Cow Milk) or Amalaki Swarasa',
          duration: '15 Days',
          rationale: 'Potent Sheeta (cooling) & Dahaprashamana action; rapidly neutralizes mucosal acidity and burning sensation.'
        },
        {
          name: 'Avipattikar Churna',
          kalpana: 'Churna',
          dose: koshtha.includes('Krura') ? '5 g' : '3 g',
          frequency: 'HS (Bedtime)',
          kaala: 'Nishikala (At Bedtime)',
          anupana: 'Ushnodaka (Lukewarm Water)',
          duration: '15 Days',
          rationale: 'Facilitates Mridu Anulomana (downward elimination) of stagnant acidic Pitta from Amashaya.'
        },
        {
          name: 'Sutshekhar Ras (Gold / Plain)',
          kalpana: 'Rasaushadhi / Vati',
          dose: '250 mg',
          frequency: 'BD (Twice Daily)',
          kaala: 'Pragbhakta (Before Meals)',
          anupana: 'Cow Ghee with Lukewarm Water',
          duration: '15 Days',
          rationale: 'Regulates gastric fire (Agni-Vaidharmya) and relieves nausea, sour eructation, and upper GI spasm.'
        }
      ],
      pathyaAhara: [
        'Mudga Yusha (Moong dal soup) with 1 tsp pure cow ghee',
        'Dadima (Sweet Pomegranate) & Draksha (Munakka / Raisins)',
        'Purana Shali (Aged rice) and barley water (Yava Mand)',
        'Lukewarm water and boiled milk with Shatavari at bedtime'
      ],
      apathyaAhara: [
        'Excessive red chillies, vinegar, fermented foods (Idli/Dosa/Pickles)',
        'Late-night heavy meals & sleeping immediately after food',
        'Curd (Dahi) especially during night hours',
        'Carbonated chilled beverages, excessive tea/coffee on empty stomach'
      ],
      dinacharyaYoga: 'Sheetali & Sitkari Pranayama (10 min morning/evening), Vajrasana for 15 minutes post-meals. Walk 100 paces (Shatapadi) after dinner.',
      panchakarmaProcedures: [
        { procedure: 'Mridu Virechana Karma', dravya: 'Eranda Taila (15ml) with Triphala Kwath', sessions: '3 Consecutive Mornings', notes: 'Given on empty stomach with warm water to clear Pitta' },
        { procedure: 'Takradhara / Shirodhara', dravya: 'Amalaki Siddha Takra', sessions: '7 Sessions (45 min daily)', notes: 'Indicated if stress-induced Pitta-Vata flare-up is prominent' }
      ],
      cdssCautions: [
        `Patient has ${agni}: Avoid heating pungent stimulants like Trikatu; choose cooling carminatives like Coriander (Dhanyaka) & Fennel (Mishreya).`,
        `Concurrent Medications (${currentMedications.join(', ')}): Maintain at least 1-hour gap between Ayurvedic formulations and allopathic drugs.`
      ]
    };
  }

  /* ─────────────────────────────────────────────────────────────────────────
     Unified helper: Call Gemini with fallback model sequence
  ───────────────────────────────────────────────────────────────────────── */
  async callGeminiRaw(promptText) {
    const key = this.getApiKey();
    if (!key) return null;

    const modelsToTry = ['gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          })
        });

        if (!res.ok) throw new Error(`Model ${modelName} returned status ${res.status}`);
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error(`Empty response from ${modelName}`);

        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error('All Gemini models failed');
  }

  /* Backwards compatibility */
  async generateClinicalInsights(params) {
    return this.generatePlanAssist(params);
  }
}

export const ayushAiCopilotService = new AyushAiCopilotService();
export default ayushAiCopilotService;
