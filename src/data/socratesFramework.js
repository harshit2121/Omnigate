/**
 * SOCRATES Clinical History Taking Framework & Emergency Red-Flag Detection
 * Designed for OPD Rapid Intake & Triage
 * SOCRATES: Site, Onset, Character, Radiation, Associated factors, Timing, Exacerbating/relieving, Severity
 */

export const CLINICAL_DEPARTMENTS = [
  {
    id: 'cardiology',
    nameEn: 'Cardiology (Heart & Chest)',
    nameHi: 'हृदय रोग विभाग (कार्डियोलॉजी)',
    badge: 'हृदयरोग (Hridaya Roga)',
    description: 'Chest pain, palpitations, breathlessness, blood pressure issues',
    healthIcon: { category: 'specialties', name: 'cardiology' },
    accentColor: '#B91C1C',
    lightBg: 'bg-red-50/70',
    border: 'border-slate-200 hover:border-red-600',
    badgeClass: 'bg-red-50 text-red-900 border-red-200'
  },
  {
    id: 'orthopedics',
    nameEn: 'Orthopedics & Joint Care',
    nameHi: 'हड्डी एवं जोड़ रोग (अस्थि-संधि / ऑर्थो)',
    badge: 'अस्थि-संधि (Asthi-Sandhi)',
    description: 'Joint pain, knee arthritis, backache, spine stiffness, fractures',
    healthIcon: { category: 'specialties', name: 'orthopaedics' },
    accentColor: '#C2410C',
    lightBg: 'bg-amber-50/70',
    border: 'border-slate-200 hover:border-amber-600',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200'
  },
  {
    id: 'gastroenterology',
    nameEn: 'Gastroenterology & Digestion',
    nameHi: 'पेट एवं पाचन तंत्र (उदर / जठराग्नि)',
    badge: 'अन्नवह स्रोतस (Annavaha)',
    description: 'Acidity, severe gas, stomach pain, bloating, constipation, nausea',
    healthIcon: { category: 'specialties', name: 'gastroenterology' },
    accentColor: '#D97706',
    lightBg: 'bg-orange-50/70',
    border: 'border-slate-200 hover:border-orange-600',
    badgeClass: 'bg-orange-50 text-orange-900 border-orange-200'
  },
  {
    id: 'dermatology',
    nameEn: 'Dermatology & Skin Care',
    nameHi: 'त्वचा रोग विभाग (डर्मेटोलॉजी / कुष्ठ)',
    badge: 'त्वचा रोग (Twacha Roga)',
    description: 'Skin rash, allergies, itching, eczema, fungal infections, boils',
    healthIcon: { category: 'body', name: 'tissue' },
    accentColor: '#9333EA',
    lightBg: 'bg-purple-50/70',
    border: 'border-slate-200 hover:border-purple-600',
    badgeClass: 'bg-purple-50 text-purple-900 border-purple-200'
  },
  {
    id: 'respiratory',
    nameEn: 'Pulmonology & Respiratory',
    nameHi: 'श्वसन एवं छाती रोग (कास-श्वास)',
    badge: 'प्राणवह स्रोतस (Pranavaha)',
    description: 'Chronic cough, asthma, throat wheezing, phlegm, breathing distress',
    healthIcon: { category: 'specialties', name: 'respirology' },
    accentColor: '#0284C7',
    lightBg: 'bg-sky-50/70',
    border: 'border-slate-200 hover:border-sky-600',
    badgeClass: 'bg-sky-50 text-sky-900 border-sky-200'
  },
  {
    id: 'general_medicine',
    nameEn: 'General Medicine & Fever',
    nameHi: 'सामान्य चिकित्सा एवं ज्वर (कायचिकित्सा)',
    badge: 'कायचिकित्सा (Kayachikitsa)',
    description: 'Fever, body chills, chronic weakness, infections, generalized pain',
    healthIcon: { category: 'specialties', name: 'outpatient-department' },
    accentColor: '#059669',
    lightBg: 'bg-emerald-50/70',
    border: 'border-slate-200 hover:border-emerald-600',
    badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200'
  },
  {
    id: 'neurology',
    nameEn: 'Neurology & Brain Care',
    nameHi: 'न्यूरोलॉजी एवं तंत्रिका तंत्र (वातव्याधि)',
    badge: 'वातव्याधि (Vata Vyadhi)',
    description: 'Severe headache, migraine, dizziness/vertigo, numbness, nerve pain',
    healthIcon: { category: 'body', name: 'neurology' },
    accentColor: '#4F46E5',
    lightBg: 'bg-indigo-50/70',
    border: 'border-slate-200 hover:border-indigo-600',
    badgeClass: 'bg-indigo-50 text-indigo-900 border-indigo-200'
  },
  {
    id: 'urology',
    nameEn: 'Urology & Kidney Care',
    nameHi: 'मूत्र एवं गुर्दा रोग (मूत्रवह स्रोतस)',
    badge: 'मूत्रवह संस्थान (Mutravaha)',
    description: 'Burning urination, kidney stones, frequent urine, urinary tract pain',
    healthIcon: { category: 'specialties', name: 'urology' },
    accentColor: '#1D4ED8',
    lightBg: 'bg-blue-50/70',
    border: 'border-slate-200 hover:border-blue-600',
    badgeClass: 'bg-blue-50 text-blue-900 border-blue-200'
  }
];

export const CHIEF_COMPLAINTS = [
  // Cardiology
  { id: 'chest_pain', departmentId: 'cardiology', label: 'Chest Pain / Angina / Heaviness', hi: 'छाती में दर्द / भारीपन / दबाव', healthIcon: { category: 'specialties', name: 'coronary-care_unit' }, redFlagPotential: true },
  { id: 'palpitations', departmentId: 'cardiology', label: 'Heart Palpitations / Rapid Pulse', hi: 'दिल की धड़कन तेज होना / घबराहट', healthIcon: { category: 'symbols', name: 'cardiogram' }, redFlagPotential: true },
  { id: 'breathlessness', departmentId: 'cardiology', label: 'Shortness of Breath on Exertion', hi: 'चलने पर सांस फूलना / दम घुटना', healthIcon: { category: 'body', name: 'lungs' }, redFlagPotential: true },

  // Orthopedics
  { id: 'joint_pain', departmentId: 'orthopedics', label: 'Knee / Multiple Joint Pain (Sandhivata)', hi: 'घुटनों व जोड़ों में दर्द / संधिवात', healthIcon: { category: 'body', name: 'joints' }, redFlagPotential: false },
  { id: 'back_pain', departmentId: 'orthopedics', label: 'Lower Backache / Sciatica (Kati Shoola)', hi: 'कमर दर्द / साइटिका / रीढ़ में अकड़न', healthIcon: { category: 'conditions', name: 'back-pain' }, redFlagPotential: false },
  { id: 'neck_shoulder_pain', departmentId: 'orthopedics', label: 'Neck & Shoulder Stiffness (Cervical)', hi: 'गर्दन व कंधे का दर्द / सर्वाइकल', healthIcon: { category: 'body', name: 'spine' }, redFlagPotential: false },

  // Gastroenterology
  { id: 'digestive_issues', departmentId: 'gastroenterology', label: 'Severe Acidity / Bloating / Amlapitta', hi: 'खट्टी डकारें / गैस / अम्लपित्त / जलन', healthIcon: { category: 'body', name: 'stomach' }, redFlagPotential: false },
  { id: 'abdominal_pain', departmentId: 'gastroenterology', label: 'Stomach Ache / Abdominal Cramps', hi: 'पेट में तेज दर्द / मरोड़ / शूल', healthIcon: { category: 'conditions', name: 'intestinal-pain' }, redFlagPotential: false },
  { id: 'constipation_piles', departmentId: 'gastroenterology', label: 'Constipation / Indigestion / Vibandha', hi: 'कब्ज / पेट साफ न होना / अपच', healthIcon: { category: 'body', name: 'intestine' }, redFlagPotential: false },

  // Dermatology
  { id: 'skin_allergy', departmentId: 'dermatology', label: 'Skin Rash / Severe Itching / Eczema', hi: 'त्वचा पर खुजली / दाद / चकत्ते / एलर्जी', healthIcon: { category: 'conditions', name: 'allergies' }, redFlagPotential: false },
  { id: 'skin_lesions', departmentId: 'dermatology', label: 'Dry Patches / Psoriasis / Kushta', hi: 'त्वचा का फटना / सोरायसिस / कुष्ठ', healthIcon: { category: 'body', name: 'tissue' }, redFlagPotential: false },

  // Respiratory
  { id: 'cough', departmentId: 'respiratory', label: 'Chronic Cough / Phlegm / Kasa', hi: 'लगातार खांसी / बलगम / कास', healthIcon: { category: 'conditions', name: 'coughing-alt' }, redFlagPotential: false },
  { id: 'asthma_wheezing', departmentId: 'respiratory', label: 'Asthma / Wheezing Chest Sounds', hi: 'दमा / सांस में सीटी की आवाज / श्वास', healthIcon: { category: 'conditions', name: 'pneumonia' }, redFlagPotential: true },

  // General Medicine
  { id: 'fever', departmentId: 'general_medicine', label: 'Fever / Chills / Shivering (Jwara)', hi: 'तेज बुखार / कपकंपी / पसीना (ज्वर)', healthIcon: { category: 'conditions', name: 'chills-fever' }, redFlagPotential: false },
  { id: 'fatigue_weakness', departmentId: 'general_medicine', label: 'Severe Weakness / Body Fatigue', hi: 'अत्यधिक थकान / कमजोरी / शरीर दर्द', healthIcon: { category: 'conditions', name: 'pain' }, redFlagPotential: false },

  // Neurology
  { id: 'headache', departmentId: 'neurology', label: 'Severe Headache / Migraine (Shiroroga)', hi: 'तेज सिरदर्द / आधासीसी / माइग्रेन', healthIcon: { category: 'conditions', name: 'headache' }, redFlagPotential: true },
  { id: 'dizziness_vertigo', departmentId: 'neurology', label: 'Dizziness / Vertigo / Imbalance (Bhrama)', hi: 'चक्कर आना / सिर घूमना / असंतुलन', healthIcon: { category: 'emotions', name: 'dizzy' }, redFlagPotential: true },

  // Urology
  { id: 'urinary_trouble', departmentId: 'urology', label: 'Burning Urination / Mutrakricchra', hi: 'पेशाब में जलन / बार-बार पेशाब आना', healthIcon: { category: 'body', name: 'bladder' }, redFlagPotential: false },
  { id: 'kidney_stone_pain', departmentId: 'urology', label: 'Flank Pain / Suspected Kidney Stone', hi: 'कमर के बगल में तेज दर्द / पथरी शंका', healthIcon: { category: 'body', name: 'kidneys' }, redFlagPotential: false }
];

// SOCRATES Questions are dynamically generated via dynamicClinicalAiService AI endpoint for all symptoms & departments

// Emergency Red-Flag Triage Engine
export function evaluateRedFlags(complaintId, answers) {
  const flags = [];

  // Cardiorespiratory emergency checks
  if (complaintId === 'chest_pain') {
    const isCrushing = answers.character?.includes('crushing') || answers.character?.includes('squeezing');
    const radiates = answers.radiation?.includes('Left Arm') || answers.radiation?.includes('Jaw');
    const hasSweating = answers.associatedSymptoms?.includes('Profuse Cold Sweating (Diaphoresis)');
    const isSevere = answers.severityScore?.includes('Severe') || answers.severityScore?.includes('Unbearable');

    if (isCrushing || radiates || (hasSweating && isSevere)) {
      flags.push({
        severity: 'EMERGENCY_RED',
        code: 'ACS_ALERT',
        title: 'CRITICAL: Suspected Acute Coronary Syndrome / Myocardial Infarction',
        titleHi: 'आपातकालीन चेतावनी: तीव्र हृदय विकार / हार्ट अटैक की संभावना',
        instruction: 'Immediate ECG, Bedside Triage, IV access, and Cardiology evaluation required immediately. Do not queue for routine OPD.'
      });
    }
  }

  // Dyspnea / Respiratory distress
  if (complaintId === 'breathlessness') {
    if (answers.onset?.includes('Sudden') || answers.severityScore?.includes('Severe') || answers.severityScore?.includes('Unbearable')) {
      flags.push({
        severity: 'EMERGENCY_RED',
        code: 'ACUTE_RESPIRATORY_DISTRESS',
        title: 'CRITICAL: Acute Respiratory Distress',
        titleHi: 'आपातकालीन चेतावनी: गंभीर सांस की रुकावट',
        instruction: 'Check SpO2 immediately, administer high-flow oxygen, keep patient propped up, alert ER resuscitation team.'
      });
    }
  }

  // Neurological red flags
  if (complaintId === 'headache') {
    if (answers.onset?.includes('Sudden and severe') || answers.severityScore?.includes('Unbearable')) {
      flags.push({
        severity: 'EMERGENCY_RED',
        code: 'THUNDERCLAP_HEADACHE',
        title: 'CRITICAL: Thunderclap Headache / Neurological Warning',
        titleHi: 'आपातकालीन चेतावनी: तीव्र मस्तिष्क आघात / स्ट्रोक की संभावना',
        instruction: 'Urgent Non-Contrast Head CT, Stroke Triage Protocol, BP monitoring.'
      });
    }
  }

  return {
    hasRedFlag: flags.length > 0,
    flags
  };
}
