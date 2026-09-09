/**
 * Ayurvedic Clinical Knowledge Base
 * Developed for Ministry of Ayush / AIIA Case-Taking Platform
 * Covers Trividha, Ashtavidha, Dashavidha Pariksha, Prakriti assessment, Agni, Koshtha, and Ahara-Vihara
 */

export const AYURVEDA_PARIKSHA_DATA = {
  // 1. TRIVIDHA PARIKSHA (Threefold Examination)
  trividha: [
    { id: 'darshana', name: 'Darshana (Inspection / Visual)', hi: 'दर्शन परीक्षा', desc: 'Visual observation of patient gait, skin color, posture, eye sclera, and physical appearance.' },
    { id: 'sparshana', name: 'Sparshana (Palpation / Touch)', hi: 'स्पर्शन परीक्षा', desc: 'Assessment of body temperature, skin texture (snigdha/ruksha), swelling, tenderness, and pulse.' },
    { id: 'prashna', name: 'Prashna (Interrogation / Questioning)', hi: 'प्रश्न परीक्षा', desc: 'Detailed conversational clinical history, symptoms, onset, appetite, sleep, and bowel habits.' },
  ],

  // 2. ASHTAVIDHA PARIKSHA (Eightfold Clinical Assessment)
  ashtavidha: [
    {
      id: 'nadi',
      name: 'Nadi (Pulse)',
      hi: 'नाड़ी परीक्षा',
      options: [
        { value: 'vata', label: 'Sarpa Gati (Vata - Rapid, serpentine)', hi: 'सर्प गति (वात)' },
        { value: 'pitta', label: 'Manduka Gati (Pitta - Jumping, rapid bounding)', hi: 'मण्डूक गति (पित्त)' },
        { value: 'kapha', label: 'Hamsa/Gaja Gati (Kapha - Slow, swan/elephant like)', hi: 'हंस/गज गति (कफ)' },
        { value: 'dwandvaja', label: 'Dwandvaja (Dual Dosha mixed pulse)', hi: 'द्वन्द्वज' },
        { value: 'sannipataja', label: 'Sannipataja (All three doshas irregular)', hi: 'सन्निपातज' },
      ]
    },
    {
      id: 'mutra',
      name: 'Mutra (Urine)',
      hi: 'मूत्र परीक्षा',
      options: [
        { value: 'pandu_shweta', label: 'Clear / Pale (Vata/Kapha dominant)', hi: 'श्वेत / हल्का पीला' },
        { value: 'rakta_peeta', label: 'Deep Yellow / Reddish / Burning (Pitta dominant)', hi: 'गहरा पीला / दाहयुक्त (पित्त)' },
        { value: 'avil_ghana', label: 'Turbid / Heavy / Frothy (Kapha dominant / Prameha)', hi: 'आविल / फेनयुक्त (कफ)' },
        { value: 'normal', label: 'Prakrita (Normal straw yellow)', hi: 'प्राकृत (सामान्य)' },
      ]
    },
    {
      id: 'mala',
      name: 'Mala (Stool & Bowel)',
      hi: 'मल परीक्षा',
      options: [
        { value: 'shuska_grathita', label: 'Hard, Dry, Pellet-like, Constipated (Vata)', hi: 'शुष्क / ग्रथित (कब्ज - वात)' },
        { value: 'peeta_drava', label: 'Loose, Yellowish, Burning, Frequent (Pitta)', hi: 'पीत / द्रव / दाह (पित्त)' },
        { value: 'picchila_sama', label: 'Sticky, Mucus-laden, Heavy, Sinking (Kapha / Ama)', hi: 'पिच्छिल / आमयुक्त (कफ)' },
        { value: 'samyak', label: 'Samyak (Formed, floats in water, regular)', hi: 'सम्यक (सामान्य)' },
      ]
    },
    {
      id: 'jihwa',
      name: 'Jihwa (Tongue)',
      hi: 'जिह्वा परीक्षा',
      options: [
        { value: 'shita_ruksha', label: 'Dry, Cracked, Rough, Darkish (Vata)', hi: 'शीत / रूक्ष / फटी हुई (वात)' },
        { value: 'rakta_shonita', label: 'Red, Inflamed, Ulcerated, Burning (Pitta)', hi: 'रक्त वर्ण / लाल / दाह (पित्त)' },
        { value: 'lipta_shweta', label: 'Thick White Coated, Heaviness (Kapha / Sama)', hi: 'श्वेत लेपित / आम (कफ)' },
        { value: 'niram', label: 'Niram (Pink, clean, moist, healthy)', hi: 'निराम (स्वच्छ गुलाबी)' },
      ]
    },
    {
      id: 'shabda',
      name: 'Shabda (Voice & Speech)',
      hi: 'शब्द परीक्षा',
      options: [
        { value: 'khara_heena', label: 'Hoarse, Feeble, Strained (Vata)', hi: 'क्षीण / खर (वात)' },
        { value: 'spashta_tivra', label: 'Sharp, Loud, Irritable (Pitta)', hi: 'तीव्र / स्पष्ट (पित्त)' },
        { value: 'gambheera_snigdha', label: 'Deep, Resonant, Heavy, Melodious (Kapha)', hi: 'गम्भीर / स्निग्ध (कफ)' },
      ]
    },
    {
      id: 'sparsha',
      name: 'Sparsha (Skin & Tactile)',
      hi: 'स्पर्श परीक्षा',
      options: [
        { value: 'sheeta_ruksha', label: 'Cold, Dry, Rough (Vata)', hi: 'शीत / रूक्ष / खुरदरा (वात)' },
        { value: 'ushna_sweda', label: 'Warm, Moist, Excessive Sweating (Pitta)', hi: 'उष्ण / पसीना युक्त (पित्त)' },
        { value: 'sheeta_snigdha', label: 'Cool, Smooth, Oily, Firm (Kapha)', hi: 'शीत / स्निग्ध / कोमल (कफ)' },
      ]
    },
    {
      id: 'druk',
      name: 'Druk (Eyes & Vision)',
      hi: 'दृक् परीक्षा',
      options: [
        { value: 'ruksha_dhusara', label: 'Dry, Unsteady, Dull, Sunken (Vata)', hi: 'रूक्ष / चंचल / शुष्क (वात)' },
        { value: 'rakta_peeta_daha', label: 'Reddish, Yellow sclera, Burning, Photophobia (Pitta)', hi: 'रक्त / पीत / दाह (पित्त)' },
        { value: 'shweta_snigdha', label: 'White sclera, Lustrous, Large, Watery (Kapha)', hi: 'श्वेत / स्निग्ध / कफयुक्त' },
      ]
    },
    {
      id: 'akriti',
      name: 'Akriti (Physical Build & Facies)',
      hi: 'आकृति परीक्षा',
      options: [
        { value: 'krusha_alpa', label: 'Ectomorphic / Lean / Prominent veins (Vata)', hi: 'कृश / पतला / शिराएं स्पष्ट (वात)' },
        { value: 'madhyama', label: 'Mesomorphic / Medium / Symmetrical (Pitta)', hi: 'मध्यम / सुगठित (पित्त)' },
        { value: 'sthula_pushta', label: 'Endomorphic / Well-built / Broad / Stout (Kapha)', hi: 'स्थूल / पुष्ट / बलिष्ठ (कफ)' },
      ]
    },
  ],

  // 3. DASHAVIDHA PARIKSHA (Tenfold Clinical Examination)
  dashavidha: [
    {
      id: 'prakriti',
      name: 'Prakriti (Constitutional Type)',
      hi: 'प्रकृति',
      desc: 'Genetic and biological inherent psycho-somatic constitution established at conception.',
      values: ['Vataja', 'Pittaja', 'Kaphaja', 'Vata-Pittaja', 'Pitta-Kaphaja', 'Vata-Kaphaja', 'Samadoshaja']
    },
    {
      id: 'vikriti',
      name: 'Vikriti (Current Morbidity / Imbalance)',
      hi: 'विकृति',
      desc: 'State of current dosha aggravation, dushya involvement, and disease manifestation.',
      values: ['Vata Vriddhi', 'Pitta Vriddhi', 'Kapha Vriddhi', 'Dwandvaja', 'Sannipataja', 'Ama Samsrishta']
    },
    {
      id: 'sara',
      name: 'Sara (Tissue Excellence / Dhatu Quality)',
      hi: 'सार परीक्षा',
      desc: 'Qualitative assessment of 7 bodily tissues (Rasa, Rakta, Mamsa, Meda, Asthi, Majja, Shukra, Sattva).',
      values: ['Pravara (Superior)', 'Madhyama (Medium)', 'Avara (Poor)']
    },
    {
      id: 'samhanana',
      name: 'Samhanana (Body Compactness)',
      hi: 'संहनन परीक्षा',
      desc: 'Symmetry, bone density, and compact musculoskeletal architecture.',
      values: ['Susanghata (Well-compacted)', 'Madhyama (Moderate)', 'Hina (Frail / Loose)']
    },
    {
      id: 'pramana',
      name: 'Pramana (Anthropometric Proportions)',
      hi: 'प्रमाण परीक्षा',
      desc: 'Proportionate body height, span (Ayam-Vistar), circumferences and weight.',
      values: ['Pramana Yukta (Normal Proportionate)', 'Heena Pramana (Underdeveloped)', 'Ati Pramana (Disproportionate / Obese)']
    },
    {
      id: 'satmya',
      name: 'Satmya (Adaptability / Habituation)',
      hi: 'सात्म्य परीक्षा',
      desc: 'Wholesome adaptability to foods, climate, geographic region (Desha Satmya), and routines.',
      values: ['Sarva-Rasa Satmya (Pravara - High Adaptability)', 'Madhyama Satmya', 'Eka-Rasa / Avara Satmya (Low Adaptability)']
    },
    {
      id: 'sattva',
      name: 'Sattva (Mental Endurance & Resilience)',
      hi: 'सत्त्व परीक्षा',
      desc: 'Psychological strength, stress tolerance, pain threshold, and willpower.',
      values: ['Pravara Sattva (High Mental Resilience)', 'Madhyama Sattva (Moderate)', 'Avara Sattva (Timid / Low Threshold)']
    },
    {
      id: 'ahara_shakti',
      name: 'Ahara Shakti (Digestive & Ingestion Power)',
      hi: 'आहार शक्ति (अभ्यवहरण व जरण शक्ति)',
      desc: 'Capacity to ingest (Abhyavaharana) and digest/metabolize food (Jarana Shakti).',
      values: ['Uttama (Strong)', 'Madhyama (Moderate)', 'Heena (Poor)']
    },
    {
      id: 'vyayama_shakti',
      name: 'Vyayama Shakti (Physical Work Capacity)',
      hi: 'व्यायाम शक्ति',
      desc: 'Cardiorespiratory stamina, muscular endurance, and physical work capacity.',
      values: ['Pravara (High Stamina)', 'Madhyama (Moderate)', 'Avara (Easily Fatigued)']
    },
    {
      id: 'vaya',
      name: 'Vaya (Age & Biological Stage)',
      hi: 'वय परीक्षा',
      desc: 'Chronological and biological age stratification.',
      values: ['Bala (Childhood <16 yrs - Kapha predominance)', 'Madhyama (Youth/Adult 16-60 yrs - Pitta predominance)', 'Vriddha (Elderly >60 yrs - Vata predominance)']
    }
  ],

  // 4. AGNI (Digestive Fire) & KOSHTHA (Bowel Character)
  agniTypes: [
    {
      id: 'sama',
      name: 'Sama Agni (Balanced Metabolism)',
      hi: 'समाग्नि (संतुलित पाचन)',
      desc: 'Food digests smoothly on time without gas, acidity, or heaviness.'
    },
    {
      id: 'vishama',
      name: 'Vishama Agni (Irregular / Vata Agni)',
      hi: 'विषमाग्नि (अनियमित - वात)',
      desc: 'Erratic appetite, bloating, gas, variable digestion from day to day.'
    },
    {
      id: 'tikshna',
      name: 'Tikshna Agni (Hyperactive / Pitta Agni)',
      hi: 'तीक्ष्णाग्नि (अति तीव्र - पित्त)',
      desc: 'Excessive hunger, hyperacidity, burning sensation, heartburn, intolerance to skipped meals.'
    },
    {
      id: 'manda',
      name: 'Mandagni (Hypoactive / Kapha Agni)',
      hi: 'मन्दाग्नि (मन्द पाचन - कफ)',
      desc: 'Poor appetite, slow digestion, post-prandial heaviness, coated tongue, lethargy.'
    }
  ],

  koshthaTypes: [
    {
      id: 'mridu',
      name: 'Mridu Koshtha (Soft Bowel - Pitta)',
      hi: 'मृदु कोष्ठ (सुगम / शीघ्र मल प्रवृत्ति)',
      desc: 'Bowel easily stimulated by simple intake of warm milk or fruit juices; tendency towards loose motions.'
    },
    {
      id: 'madhyama',
      name: 'Madhyama Koshtha (Moderate Bowel - Kapha/Sama)',
      hi: 'मध्यम कोष्ठ (नियमित सामान्य मल)',
      desc: 'Normal daily morning evacuation without strain or excessive laxative requirement.'
    },
    {
      id: 'krura',
      name: 'Krura Koshtha (Hard Bowel - Vata)',
      hi: 'क्रूर कोष्ठ (कठिन मल / तीव्र विबन्ध)',
      desc: 'Habitual chronic constipation, hard dry stools, requires strong purgatives to evacuate.'
    }
  ],

  // 5. PRAKRITI SELF-ASSESSMENT QUESTIONS (Bilingual Voice & Touch)
  prakritiQuiz: [
    {
      id: 'body_frame',
      questionEn: 'How would you describe your natural physical body frame?',
      questionHi: 'आपकी स्वाभाविक शारीरिक बनावट कैसी है?',
      options: [
        { dosha: 'Vata', textEn: 'Slim, lean, prominent joints/veins, difficult to gain weight', textHi: 'पतला, दुबला, नसें उभरी हुई, वजन मुश्किल से बढ़ता है' },
        { dosha: 'Pitta', textEn: 'Medium athletic build, good muscle definition, balanced weight', textHi: 'मध्यम सुगठित शरीर, सामान्य मांसपेशियां' },
        { dosha: 'Kapha', textEn: 'Broad, heavy, solid bone structure, easy to gain weight', textHi: 'चौड़ा, भारी, पुष्ट शरीर, वजन आसानी से बढ़ता है' }
      ]
    },
    {
      id: 'skin_hair',
      questionEn: 'What is the natural nature of your skin and hair?',
      questionHi: 'आपकी त्वचा और बालों का स्वाभाविक स्वरूप कैसा है?',
      options: [
        { dosha: 'Vata', textEn: 'Dry, rough skin; brittle or coarse hair; cracks in winter', textHi: 'रूखी, शुष्क त्वचा; पतले या रूखे बाल' },
        { dosha: 'Pitta', textEn: 'Warm, reddish, prone to moles/freckles/acne; early graying/thinning hair', textHi: 'उष्ण, तैलीय, तिल/मुंहासों की प्रवृत्ति; समय से पूर्व सफेद बाल' },
        { dosha: 'Kapha', textEn: 'Thick, oily, soft, glowing skin; dense, lustrous, dark wavy hair', textHi: 'मुलायम, स्निग्ध, चमकदार त्वचा; घने और मजबूत बाल' }
      ]
    },
    {
      id: 'appetite_digestion',
      questionEn: 'How is your daily appetite and hunger pattern?',
      questionHi: 'आपकी भूख और भोजन पचाने की शक्ति कैसी रहती है?',
      options: [
        { dosha: 'Vata', textEn: 'Variable & irregular (sometimes very hungry, sometimes forget to eat)', textHi: 'अनियमित (कभी ज्यादा भूख, कभी बिल्कुल नहीं)' },
        { dosha: 'Pitta', textEn: 'Intense & strong (get irritable or headachy if meals are delayed)', textHi: 'तीव्र व असहनशील (समय पर खाना न मिले तो गुस्सा/सिरदर्द)' },
        { dosha: 'Kapha', textEn: 'Constant but slow (can skip meals easily without discomfort)', textHi: 'मंद व स्थिर (भोजन देर से भी मिले तो कोई परेशानी नहीं)' }
      ]
    },
    {
      id: 'sleep_pattern',
      questionEn: 'How is your regular sleep quality?',
      questionHi: 'आपकी नींद का स्वरूप कैसा रहता है?',
      options: [
        { dosha: 'Vata', textEn: 'Light, interrupted, easily disturbed by slight noise, dreams of flying/movement', textHi: 'हल्की, बार-बार टूटने वाली, स्वप्न अधिक आना' },
        { dosha: 'Pitta', textEn: 'Moderate, sound, awakening feeling warm, vivid or fiery dreams', textHi: 'मध्यम, गहरी, गर्मी महसूस होना' },
        { dosha: 'Kapha', textEn: 'Deep, heavy, long hours, difficult to wake up in the morning', textHi: 'बहुत गहरी, भारी, सुबह उठने में आलस्य' }
      ]
    },
    {
      id: 'weather_preference',
      questionEn: 'Which weather or climate do you find most uncomfortable?',
      questionHi: 'आपको किस प्रकार का मौसम सबसे अधिक परेशान करता है?',
      options: [
        { dosha: 'Vata', textEn: 'Cold, windy, and dry weather (prefer warm sun and cozy places)', textHi: 'ठंडा व हवादार मौसम (गर्मी पसंद है)' },
        { dosha: 'Pitta', textEn: 'Hot, humid summer and direct sun (prefer cool, airy places)', textHi: 'अधिक गर्मी व धूप (ठंडक पसंद है)' },
        { dosha: 'Kapha', textEn: 'Cold, damp, cloudy and rainy weather (prefer dry warmth)', textHi: 'सर्द, नम व बारिश का मौसम' }
      ]
    },
    {
      id: 'mind_emotions',
      questionEn: 'How do you typically react under stress or mental pressure?',
      questionHi: 'तनाव या दबाव की स्थिति में आपका स्वभाव कैसा होता है?',
      options: [
        { dosha: 'Vata', textEn: 'Anxious, worrying, overthinking, restless, speaks quickly', textHi: 'चिंता, घबराहट, अत्यधिक सोचना, बेचैनी' },
        { dosha: 'Pitta', textEn: 'Irritable, critical, angry, impatient, perfectionist', textHi: 'गुस्सा, चिड़चिड़ापन, अधीरता' },
        { dosha: 'Kapha', textEn: 'Calm, patient, slow to react, may withdraw or procrastinate', textHi: 'शांत, धैर्यवान, धीमी प्रतिक्रिया' }
      ]
    }
  ],

  // 6. AHARA-VIHARA (Lifestyle & Dietary Factors)
  aharaViharaFactors: [
    { id: 'diet_type', name: 'Dietary Habit (Ahara Prakara)', options: ['Shakahari (Vegetarian)', 'Mamsahari (Non-Veg)', 'Mishra (Mixed)', 'Sattvic'] },
    { id: 'dominant_rasa', name: 'Dominant Taste Preference (Rasa Satmya)', options: ['Madhura (Sweet)', 'Amla (Sour)', 'Lavana (Salty)', 'Katu (Pungent/Spicy)', 'Tikta (Bitter)', 'Kashaya (Astringent)'] },
    { id: 'water_intake', name: 'Daily Fluid Intake (Jala Pana)', options: ['Low (<1.5 L/day)', 'Moderate (1.5 - 3 L/day)', 'High (>3 L/day)', 'Lukewarm (Ushnodaka)', 'Refrigerated Cold'] },
    { id: 'divaswapna', name: 'Daytime Sleep (Divaswapna)', options: ['Never', 'Occasional (15-30 mins)', 'Regular post-lunch (>1 hour)'] },
    { id: 'ratrijagarana', name: 'Late Night Awakeness (Ratri Jagarana)', options: ['Sleep before 10:30 PM', 'Awake until Midnight', 'Late Night Shift Work (Past 1 AM)'] },
    { id: 'stress_vyayama', name: 'Physical Activity & Exercise (Vyayama)', options: ['Sedentary / Nil', 'Light Walking / Yoga', 'Moderate Gym / Sports', 'Intense Hard Labor'] }
  ]
};

export default AYURVEDA_PARIKSHA_DATA;
