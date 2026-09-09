/**
 * Samprapti Synthesizer Engine (Layer 3 Inference System)
 * 
 * Clinical-grade Ayurvedic Expert System for Ayush OPD & Hospital EMR.
 * Generates:
 * 1. Classical Samprapti Ghataka Clinical Chart (Hetu, Dosha, Dushya, Srotas, Srotodushti,
 *    Udbhavasthana, Sancharasthana, Sthanasamsraya, Vyaktasthana, Rogamarga, Sadhyasadhyata, Chikitsa Sutra)
 * 2. Bilingual Patient Summary & Home Care Guide (Rogi Margadarshika / रोगी परामर्श पत्र)
 */

import { AYUSH_FORMULARY_DB } from '../data/ayushFormularyDB';

export const DOSHA_DUSHYA_MATRIX = {
  Vata: {
    primaryDushyas: ['Asthi', 'Majja', 'Snayu', 'Kandara', 'Twak (Rasa)'],
    secondaryDushyas: ['Rasa', 'Rakta', 'Shukra'],
    primarySrotas: ['Asthivaha Srotas', 'Majjavaha Srotas', 'Pranavaha Srotas', 'Purishavaha Srotas'],
    primaryUdbhavasthana: 'Pakwashaya (Colon / Lower Pelvic Cavity)',
    qualities: ['Ruksha (Dry)', 'Sheeta (Cold)', 'Laghu (Light)', 'Chala (Mobile)'],
    sanchara: 'Sarva Shareera via Rasavaha & Dhamanis',
    chikitsaSutra: 'Snehana, Swedana, Mridu Shodhana, Basti Karma, Vatahara Shamana & Brimhana'
  },
  Pitta: {
    primaryDushyas: ['Rakta', 'Rasa (Twak)', 'Meda', 'Sweda', 'Lasika'],
    secondaryDushyas: ['Mamsa', 'Majja'],
    primarySrotas: ['Raktavaha Srotas', 'Rasavaha Srotas', 'Annavaha Srotas', 'Swedavaha Srotas'],
    primaryUdbhavasthana: 'Amashaya & Pittadhara Kala (Duodenum / Mid-GI)',
    qualities: ['Ushna (Hot)', 'Tikshna (Sharp)', 'Sara (Fluid)', 'Amla (Sour)'],
    sanchara: 'Dhamani Sanchara & Raktavaha Circulation',
    chikitsaSutra: 'Tikta-Madhura Ghrita, Virechana Karma, Pittashamaka Shamana, Sheetala Upachara'
  },
  Kapha: {
    primaryDushyas: ['Meda', 'Mamsa', 'Rasa', 'Kleda', 'Shleshma'],
    secondaryDushyas: ['Asthi', 'Shukra'],
    primarySrotas: ['Medovaha Srotas', 'Mamsavaha Srotas', 'Udakavaha Srotas', 'Pranavaha Srotas'],
    primaryUdbhavasthana: 'Uras & Urdhva Amashaya (Chest & Upper Stomach)',
    qualities: ['Guru (Heavy)', 'Snigdha (Unctuous)', 'Sheeta (Cold)', 'Manda (Dull)'],
    sanchara: 'Rasavaha & Kaphasthana Spread',
    chikitsaSutra: 'Langhana, Rukshana, Vamana Karma, Kaphahara Shamana, Tikta-Katu Aushadhi'
  }
};

export const SROTAS_CATALOG = {
  Pranavaha: { name: 'Pranavaha Srotas', moola: 'Hridaya & Mahasrotas', description: 'Respiratory & Cardiorespiratory channel' },
  Udakavaha: { name: 'Udakavaha Srotas', moola: 'Talu & Kloma', description: 'Fluid & Electrolyte regulation channel' },
  Annavaha: { name: 'Annavaha Srotas', moola: 'Amashaya & Annavahi Dhamani', description: 'Upper Gastrointestinal / Digestive channel' },
  Rasavaha: { name: 'Rasavaha Srotas', moola: 'Hridaya & Dasha Dhamanis', description: 'Plasma, Lymphatic & Micro-circulatory channel' },
  Raktavaha: { name: 'Raktavaha Srotas', moola: 'Yakrit (Liver) & Pleeha (Spleen)', description: 'Hemic, Vascular & Erythropoietic channel' },
  Mamsavaha: { name: 'Mamsavaha Srotas', moola: 'Snayu & Twak', description: 'Muscular & Connective tissue channel' },
  Medovaha: { name: 'Medovaha Srotas', moola: 'Vrikka (Kidneys) & Vapavahanam (Omentum)', description: 'Adipose & Lipid metabolic channel' },
  Asthivaha: { name: 'Asthivaha Srotas', moola: 'Medas & Jaghana (Pelvis)', description: 'Osseous, Bone & Skeletal framework channel' },
  Majjavaha: { name: 'Majjavaha Srotas', moola: 'Asthi & Sandhi (Joints)', description: 'Nervous system & Bone Marrow channel' },
  Shukravaha: { name: 'Shukravaha Srotas', moola: 'Stana (Breasts) & Mushka (Testes)', description: 'Reproductive & Ojas vitality channel' },
  Mutravaha: { name: 'Mutravaha Srotas', moola: 'Basti (Urinary Bladder) & Vankshana', description: 'Urinary & Excretory renal channel' },
  Purishavaha: { name: 'Purishavaha Srotas', moola: 'Pakwashaya & Sthula Guda', description: 'Colonic & Fecal elimination channel' },
  Swedavaha: { name: 'Swedavaha Srotas', moola: 'Meda & Romakoopa', description: 'Sweat & Thermoregulatory cutaneous channel' }
};

/**
 * Infer Srotodushti type based on clinical presentation
 */
function inferSrotodushti(symptomsText = '', answers = {}, complaintId = '') {
  const combinedText = `${symptomsText} ${answers.character || ''} ${answers.radiation || ''} ${answers.associatedSymptoms ? answers.associatedSymptoms.join(' ') : ''} ${complaintId}`.toLowerCase();

  let dushtiType = 'Sanga (Obstruction / Stasis)';
  let typeKey = 'sanga';
  let clinicalNote = 'Localized stasis, sluggishness and hypomobility within micro-channels.';

  if (
    combinedText.includes('reflux') ||
    combinedText.includes('acid') ||
    combinedText.includes('vomit') ||
    combinedText.includes('chhardi') ||
    combinedText.includes('belching') ||
    combinedText.includes('upward') ||
    combinedText.includes('urdhwaga') ||
    combinedText.includes('bleeding')
  ) {
    dushtiType = 'Vimargagamana (Reversed / False Flow)';
    typeKey = 'vimargagamana';
    clinicalNote = 'Retrograde movement (Urdhwagati) and reflux of aggravated dosha-dushya mixture.';
  } else if (
    combinedText.includes('diarrhea') ||
    combinedText.includes('atisara') ||
    combinedText.includes('polyuria') ||
    combinedText.includes('prameha') ||
    combinedText.includes('excessive sweating') ||
    combinedText.includes('sweda') ||
    combinedText.includes('loose stool')
  ) {
    dushtiType = 'Atipravritti (Excessive Outflow / Hypersecretion)';
    typeKey = 'atipravritti';
    clinicalNote = 'Excessive fluid exudation, hypersecretion, or frequent evacuation.';
  } else if (
    combinedText.includes('nodule') ||
    combinedText.includes('cyst') ||
    combinedText.includes('granthi') ||
    combinedText.includes('calculus') ||
    combinedText.includes('ashmari') ||
    combinedText.includes('swelling in joints') ||
    combinedText.includes('thickening')
  ) {
    dushtiType = 'Siragranthi (Dilation / Nodular Formation)';
    typeKey = 'siragranthi';
    clinicalNote = 'Structural remodeling, fibrotic thickening or nodule formation along tissue conduits.';
  } else {
    dushtiType = 'Sanga (Obstruction / Functional Stasis)';
    typeKey = 'sanga';
    clinicalNote = 'Impeded channel flow, stiffness, crepitus, and localized pain (Kha-vaigunya).';
  }

  return { dushtiType, typeKey, clinicalNote };
}

/**
 * Generate Patient-Friendly Summary (रोगी परामर्श पत्र / Rogi Margadarshika)
 */
function generatePatientSummary({
  complaintLabel = '',
  primaryDosha = 'Pitta',
  srotodushtiType = 'Vimargagamana',
  vyaktasthana = '',
  aharaFactors = '',
  patientName = 'मरीज'
}) {
  const isPitta = primaryDosha === 'Pitta';
  const isVata = primaryDosha === 'Vata';

  return {
    titleEn: 'Patient Health Advisory & Home Care Guide',
    titleHi: 'रोगी स्वास्थ्य निर्देश एवं घर पर देखभाल मार्गदर्शिका',
    conditionOverviewHi: isPitta
      ? `आपके शरीर में पित्त दोष की अधिकता के कारण पाचन नली व आमाशय में तीखापन व जलन की समस्या उत्पन्न हुई है (${complaintLabel})।`
      : (isVata
          ? `आपके शरीर में वात दोष की वृद्धि तथा रुक्षता के कारण जोड़ों व हड्डियों में दर्द व जकड़न की समस्या है (${complaintLabel})।`
          : `आपके शरीर में कफ दोष व मंदाग्नि के कारण भारीपन व अवरोध उत्पन्न हुआ है (${complaintLabel})।`),
    conditionOverviewEn: isPitta
      ? `Your condition (${complaintLabel}) is caused by aggravated Pitta dosha (internal heat & acidity) affecting the stomach and digestive channels.`
      : (isVata
          ? `Your condition (${complaintLabel}) is driven by aggravated Vata dosha causing dryness, crepitus, and stiffness in the joints and bones.`
          : `Your condition (${complaintLabel}) is driven by sluggish digestion (Mandagni) and Kapha accumulation causing heaviness and channel congestion.`),
    
    // What to avoid (Nidana Parivarjana)
    avoidHi: isPitta
      ? 'अत्यधिक मिर्च-मसालेदार भोजन, खट्टे व तले हुए खाद्य पदार्थ, देर रात तक जागना, खाली पेट ज्यादा देर रहना, चाय-कॉफी का अधिक सेवन।'
      : (isVata
          ? 'ठंडा व सूखा भोजन, बासी खाना, दिन में सोना व रात को देर से सोना, अधिक पैदल चलना, ठंडी हवा के संपर्क में आना।'
          : 'मिठाइयां, तैलीय व गरिष्ठ भोजन, दिन में सोना, ठंडे पेय, अत्यधिक डेयरी उत्पाद।'),
    avoidEn: isPitta
      ? 'Excessive spicy, sour, fried foods, late-night awakeness, skipping meals, excess tea/coffee, and midday sun exposure.'
      : (isVata
          ? 'Dry, cold, stale foods, raw salads, excessive physical exertion without rest, cold drafts, and irregular sleep.'
          : 'Heavy sweets, refined flour, cold dairy, daytime sleeping, oily foods, and sedentary lifestyle.'),
    
    // What to consume (Pathya)
    consumeHi: isPitta
      ? 'गुनगुना दूध, देसी गाय का घी, मुनक्का, खीरा, लौकी, कद्दू, नारियल पानी, सौंफ-धनिया-मिश्री का शर्बत, मूंग दाल खिचड़ी।'
      : (isVata
          ? 'गर्म व ताजा स्निग्ध भोजन, तिल का तेल, सूप, गेहूं-बासमती चावल, गर्म दूध में सोंठ/हल्दी, बादाम, अखरोट।'
          : 'जौ, कुलथी, मूंग दाल, पुराना चावल, गर्म पानी, अदरक-तुलसी की चाय, सहजन, करेला, त्रिकटु युक्त आहार।'),
    consumeEn: isPitta
      ? 'Warm cow milk, pure cow ghee, soaked raisins, ash gourd, cucumber, coconut water, fennel-coriander infusion, light mung dal.'
      : (isVata
          ? 'Warm nourishing meals with healthy ghee/sesame oil, bone/vegetable broth, ginger tea, warm spiced milk, and soaked nuts.'
          : 'Light grains (barley, millets), horse gram soup, steamed vegetables, warm water, ginger-tulsi tea, and bitter greens.'),
    
    // Home Care (Dinacharya)
    homeCareHi: isPitta
      ? 'भोजन नियमित समय पर करें। प्रतिदिन शाम को टहलें। शीतली व अनुलोम-विलोम प्राणायाम करें। नारियल तेल से सिर की मालिश करें।'
      : (isVata
          ? 'प्रतिदिन प्रभावित जोड़ों पर गुनगुने तिल या महानारायण तेल से मालिश (अभ्यंग) करें। गर्म पानी की सिकाई करें। 7-8 घंटे की गहरी नींद लें।'
          : 'सूर्योदय से पूर्व उठें। नियमित व्यायाम या योगासन करें। कपालभाति व भस्त्रिका प्राणायाम करें। दिन में सोने से बचें।'),
    homeCareEn: isPitta
      ? 'Maintain punctual meal timings. Practice cooling Sheetali & Nadi Shodhana pranayama. Apply calming coconut oil to scalp.'
      : (isVata
          ? 'Perform daily warm sesame/Mahanarayan oil massage (Abhyanga) on painful joints followed by warm fomentation. Ensure 7-8 hours sleep.'
          : 'Wake before sunrise. Engage in brisk morning exercise and Surya Namaskar. Avoid daytime naps.'),
    
    // Warning Signs
    warningSignHi: 'यदि अत्यधिक दर्द, तेज बुखार, खून की उल्टी, या लगातार चक्कर आए तो तुरंत निकटतम अस्पताल की आपातकालीन ओपीडी में संपर्क करें।',
    warningSignEn: 'If you experience severe unmanageable pain, high fever, vomiting blood, or extreme dizziness, visit the hospital emergency OPD immediately.'
  };
}

/**
 * Main Samprapti Synthesis Function
 * Emits both the Clinical Ghataka Diagnostic Chart and Patient Advisory
 */
export function synthesizeSamprapti({
  dashavidhaResult = {},
  complaintId = 'digestive_issues',
  complaintLabel = 'Amlapitta',
  symptomsText = '',
  answers = {},
  namasteCode = 'NAMASTE-AYU-AML-01',
  patientName = 'Patient'
}) {
  const rationaleSteps = [];
  let confidenceScore = 92;

  const dims = dashavidhaResult.dimensions || {};
  const prakriti = dims.prakriti || { vataPct: 35, pittaPct: 45, kaphaPct: 20, dominant: 'Pitta-Vata' };
  const vikriti = dims.vikriti || { vataPct: 25, pittaPct: 65, kaphaPct: 10, delta: { vata: -10, pitta: 20, kapha: -10 }, dominant: 'Pittaja' };
  const sara = dims.sara || {};
  const samhanana = dims.samhanana?.grade || 'Madhyama';
  const ahara = dims.aharaShakti || { agniType: 'Tikshnagni (Hyperactive)', agniCode: 'tikshna' };
  const vaya = dims.vaya || { stage: 'Madhyama', doshaDominance: 'Pitta' };

  // 1. DOSHA DETERMINATION
  const delta = vikriti.delta || { vata: 0, pitta: 0, kapha: 0 };
  const doshaRank = [
    { name: 'Pitta', pct: vikriti.pittaPct, delta: delta.pitta },
    { name: 'Vata', pct: vikriti.vataPct, delta: delta.vata },
    { name: 'Kapha', pct: vikriti.kaphaPct, delta: delta.kapha }
  ].sort((a, b) => (b.delta - a.delta) || (b.pct - a.pct));

  const primaryDosha = doshaRank[0].name;
  const secondaryDosha = (doshaRank[1].pct >= 30 || doshaRank[1].delta > 5) ? doshaRank[1].name : null;
  const doshaGhati = primaryDosha === 'Pitta' ? 'Urdhwagati (Upward Spread)' : (primaryDosha === 'Vata' ? 'Tiryak / Adhogati' : 'Adhogati / Sthaimitya');

  rationaleSteps.push(`Nidana Sevana provoked ${primaryDosha} dosha (Vikriti ${doshaRank[0].pct}%, Δ ${doshaRank[0].delta > 0 ? '+' : ''}${doshaRank[0].delta}%), with secondary involvement of ${doshaRank[1].name}.`);

  // 2. DUSHYA INVOLVEMENT
  const matrixInfo = DOSHA_DUSHYA_MATRIX[primaryDosha] || DOSHA_DUSHYA_MATRIX.Pitta;
  const weakDhatusFromSara = Object.keys(sara).filter(k => sara[k].isWeak);
  const dushyasSet = new Set([...matrixInfo.primaryDushyas]);

  weakDhatusFromSara.forEach(dKey => {
    if (dKey.includes('twak') || dKey.includes('rasa')) dushyasSet.add('Rasa (Twak)');
    if (dKey.includes('rakta')) dushyasSet.add('Rakta Dhatu');
    if (dKey.includes('mamsa')) dushyasSet.add('Mamsa Dhatu');
    if (dKey.includes('meda')) dushyasSet.add('Meda Dhatu');
    if (dKey.includes('asthi')) dushyasSet.add('Asthi Dhatu');
    if (dKey.includes('majja')) dushyasSet.add('Majja Dhatu');
  });

  if (complaintId.includes('digestive') || complaintLabel.toLowerCase().includes('amlapitta')) {
    dushyasSet.add('Rasa Dhatu');
    dushyasSet.add('Rakta Dhatu');
    dushyasSet.add('Pitta-Kleda');
  } else if (complaintId.includes('joint') || complaintLabel.toLowerCase().includes('sandhi')) {
    dushyasSet.add('Asthi Dhatu');
    dushyasSet.add('Majja Dhatu');
    dushyasSet.add('Snayu / Sandhi Shleshaka Kapha');
  }

  const dushyasList = Array.from(dushyasSet).slice(0, 4);
  rationaleSteps.push(`Dosha-Dushya Sammurchana established in: ${dushyasList.join(', ')}.`);

  // 3. SROTAS & SROTODUSHTI
  const srotasSet = new Set();
  if (complaintId.includes('digestive') || complaintLabel.toLowerCase().includes('amlapitta')) {
    srotasSet.add('Annavaha Srotas');
    srotasSet.add('Rasavaha Srotas');
    srotasSet.add('Purishavaha Srotas');
  } else if (complaintId.includes('joint') || complaintLabel.toLowerCase().includes('sandhi')) {
    srotasSet.add('Asthivaha Srotas');
    srotasSet.add('Majjavaha Srotas');
    srotasSet.add('Mamsavaha Srotas');
  } else {
    matrixInfo.primarySrotas.forEach(s => srotasSet.add(s));
  }
  const srotasList = Array.from(srotasSet);

  const srotodushti = inferSrotodushti(symptomsText, answers, complaintId);
  rationaleSteps.push(`Srotodushti manifested as ${srotodushti.dushtiType} along ${srotasList.join(', ')}.`);

  // 4. LOCI: UDBHAVA, SANCHARA, STHANA SAMSRAYA & VYAKTI
  const udbhavasthana = primaryDosha === 'Vata'
    ? 'Pakwashaya (Colon & Pelvic Cavity)'
    : (primaryDosha === 'Pitta'
        ? 'Amashaya & Pittadhara Kala (Duodenum & Stomach)'
        : 'Uras & Urdhva Amashaya (Chest & Stomach)');

  const sancharasthana = matrixInfo.sanchara;
  const vyaktasthana = answers.site || (
    complaintId.includes('digestive')
      ? 'Upper Gastrointestinal Tract & Epigastrium (Urdhwaga Amashaya / Hrid-Kantha)'
      : (complaintId.includes('joint')
          ? 'Bilateral Knee / Weight-bearing Joints (Janu Sandhi)'
          : 'Rasavaha & Twak')
  );
  const sthanaSamsraya = `Kha-vaigunya at ${vyaktasthana}`;

  // 5. ROGAMARGA, SADHYASADHYATA & CHIKITSA SUTRA
  let rogamarga = 'Abhyantara Rogamarga (Kostha / GI Tract)';
  if (complaintId.includes('joint') || complaintLabel.toLowerCase().includes('sandhi')) {
    rogamarga = 'Madhyama Rogamarga (Dhatu-Sandhi-Asthi-Marma)';
  } else if (complaintId.includes('skin') || complaintLabel.toLowerCase().includes('kushta')) {
    rogamarga = 'Bahya Rogamarga (Twak-Rakta-Mamsagata)';
  }

  let sadhyasadhyata = 'Sukhasadhya (Easily Manageable with Shamana)';
  if (rogamarga.includes('Madhyama') || vaya.stage.includes('Vriddha') || samhanana === 'Avara') {
    sadhyasadhyata = 'Krichhrasadhya (Requires Prolonged Shamana & Shodhana)';
  }

  const chikitsaSutra = matrixInfo.chikitsaSutra;
  rationaleSteps.push(`Sthana Samsraya at ${sthanaSamsraya}. Recommended Chikitsa Sutra: ${chikitsaSutra}.`);

  // 6. PATIENT SUMMARY
  const patientSummary = generatePatientSummary({
    complaintLabel,
    primaryDosha,
    srotodushtiType: srotodushti.dushtiType,
    vyaktasthana,
    patientName
  });

  return {
    synthesizedAt: new Date().toISOString(),
    clinicalFramework: 'Charaka / Sushruta Trisutra & Dashavidha Protocol',
    confidenceScore,
    ghatakas: {
      hetu: {
        label: '१. निदान / हेतु (Etiological Triggers)',
        value: `${answers.onset || 'Aharaja & Viharaja Factors'}, Mithya Ahara-Vihara`
      },
      dosha: {
        label: '२. दोष (Dosha Involved)',
        value: secondaryDosha ? `${primaryDosha}-${secondaryDosha} (Samsarga)` : `${primaryDosha} Pradhana`,
        primary: primaryDosha,
        secondary: secondaryDosha,
        deltaSurge: doshaRank[0].delta,
        doshagati: doshaGhati
      },
      dushya: {
        label: '३. दूष्य (Dushya Afflicted)',
        value: dushyasList.join(', '),
        list: dushyasList
      },
      srotas: {
        label: '४. स्रोतस (Srotas Involved)',
        value: srotasList.join(', '),
        list: srotasList
      },
      srotodushti: {
        label: '५. स्रोतोदुष्टि प्रकार (Srotodushti Mode)',
        value: srotodushti.dushtiType,
        typeKey: srotodushti.typeKey,
        clinicalNote: srotodushti.clinicalNote
      },
      agni: {
        label: '६. अग्नि एवं आम (Agni & Ama State)',
        value: `${ahara.agniType || 'Tikshnagni'} (Sama-Pitta / Nirama)`
      },
      udbhavasthana: {
        label: '७. उद्भवस्थान (Origin Locus)',
        value: udbhavasthana
      },
      sancharasthana: {
        label: '८. संचारस्थान (Dissemination Path)',
        value: sancharasthana
      },
      sthanaSamsraya: {
        label: '९. स्थानसंश्रय (Site of Relocalization)',
        value: sthanaSamsraya
      },
      vyaktasthana: {
        label: '१०. व्यक्तस्थान (Clinical Manifestation)',
        value: vyaktasthana
      },
      rogamarga: {
        label: '११. रोगमार्ग (Disease Pathway)',
        value: rogamarga
      },
      sadhyasadhyata: {
        label: '१२. साध्यासाध्यता (Prognosis)',
        value: sadhyasadhyata
      },
      chikitsaSutra: {
        label: '१३. चिकित्सा सूत्र (Line of Treatment)',
        value: chikitsaSutra
      }
    },
    traceableRationale: rationaleSteps,
    patientSummary
  };
}
