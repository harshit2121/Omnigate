/**
 * Comprehensive Ayurvedic Formulary & Clinical Pharmacopoeia Database
 * Based on Ayurvedic Pharmacopoeia of India (API), Charaka Samhita & CCRAS Standard Guidelines
 */

export const AYUSH_FORMULARY_DB = {
  // Classical Categories
  categories: [
    'Rasaushadhi & Vati (Herbomineral Tablets)',
    'Guggulu Kalpa (Purified Commiphora Formulations)',
    'Churna & Kashayam (Powders & Decoctions)',
    'Asava & Arishta (Fermented Biomedicinals)',
    'Rasayana & Ghrita (Rejuvenatives & Medicated Ghee)',
    'Single Classical Herbs (Eka Dravya)'
  ],

  // Formulations & Single Herbs
  formulations: {
    'Sutshekhar Ras': {
      id: 'sutshekhar_ras',
      name: 'Sutshekhar Ras (Gold / Plain)',
      type: 'Rasaushadhi / Vati',
      apiCode: 'API-KAY-042',
      classicalText: 'Bhaishajya Ratnavali - Amlapitta Rogadhikara',
      ingredients: ['Shuddha Parada', 'Shuddha Gandhaka', 'Tamra Bhasma', 'Shankha Bhasma', 'Shunthi', 'Maricha', 'Pippali', 'Dhatura Swarasa'],
      rasa: ['Tikta (Bitter)', 'Katu (Pungent)', 'Kashaya (Astringent)'],
      virya: 'Sheeta (Cooling)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: { vata: -1, pitta: -2, kapha: 0 }, // -2 means strongly pacifies Pitta
      indications: ['Amlapitta (Hyperacidity)', 'Chhardi (Vomiting)', 'Gulma (Abdominal Colic)', 'Shirahshoola (Migraine/Headache)', 'Grahani (IBS)'],
      prakritiSuitability: {
        'Pitta': 'Highly Recommended (उत्कृष्ट)',
        'Pitta-Vata': 'Recommended (अनुकूल)',
        'Pitta-Kapha': 'Recommended (अनुकूल)',
        'Kapha-Vata': 'Use with Caution (सतर्कता)'
      },
      standardDose: '125mg - 250mg twice daily',
      agniCalibration: {
        'Tikshna': 'Standard dose (250mg BD) with cold milk / pomegranate juice',
        'Manda': '125mg BD with warm water and roasted cumin',
        'Visham': '125mg BD with ghee or licorice water',
        'Sama': '250mg BD with warm water'
      },
      anupana: ['Dugdha (Cold Milk)', 'Ghrita (Cow Ghee)', 'Amalaki Swarasa', 'Lukewarm Water'],
      contraindications: ['Pregnancy (due to Dhatura purification trace)', 'Severe Renal Failure'],
      interactions: [
        { drug: 'Antacids (Allopathic)', severity: 'low', effect: 'Additive acid neutralization; separate by 1 hour.' },
        { drug: 'Digoxin', severity: 'moderate', effect: 'May alter absorption kinetics of cardiac glycosides.' }
      ]
    },

    'Avipattikar Churna': {
      id: 'avipattikar_churna',
      name: 'Avipattikar Churna',
      type: 'Churna (Herbal Powder)',
      apiCode: 'API-KAY-018',
      classicalText: 'Bhaishajya Ratnavali - Amlapitta Chikitsa',
      ingredients: ['Trikatu (Sunthi, Maricha, Pippali)', 'Triphala (Haritaki, Bibhitaki, Amalaki)', 'Musta', 'Vidanga', 'Ela', 'Tejpatra', 'Lavanga', 'Trivrit (Operculina turpethum)', 'Sharkara (Unrefined Sugar)'],
      rasa: ['Madhura (Sweet)', 'Tikta (Bitter)', 'Katu (Pungent)'],
      virya: 'Sheeta (Cooling)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: { vata: 0, pitta: -2, kapha: -1 },
      indications: ['Amlapitta (Acid Peptic Disorder)', 'Vibandha (Constipation)', 'Agnimandya (Dyspepsia)', 'Arsha (Piles)', 'Prameha (Metabolic Heat)'],
      prakritiSuitability: {
        'Pitta': 'Highly Recommended',
        'Pitta-Vata': 'Recommended',
        'Kapha': 'Moderate (contains Sharkara - monitor sugars)',
        'Vata': 'Use with warm water or ghee'
      },
      standardDose: '3g - 6g twice daily before meals or at bedtime',
      agniCalibration: {
        'Tikshna': '5g with cold water or coconut water before lunch & dinner',
        'Manda': '3g with warm water after meals',
        'Visham': '3g with lukewarm ghee'
      },
      anupana: ['Lukewarm Water (Ushnodaka)', 'Cow Milk (Godugdha)', 'Honey (Madhu)'],
      contraindications: ['Uncontrolled Type-2 Diabetes (due to Sharkara 50% formulation weight - use sugar-free tablet alternative)', 'Severe Diarrhea / Atisara'],
      interactions: [
        { drug: 'Metformin', severity: 'moderate', effect: 'Sugar content in raw churna may counter glycemic control. Use Trivrit extract tablets instead.' },
        { drug: 'Diuretics (Furosemide)', severity: 'moderate', effect: 'Trivrit purgative action may compound electrolyte depletion.' }
      ]
    },

    'Yograj Guggulu': {
      id: 'yograj_guggulu',
      name: 'Yograj Guggulu',
      type: 'Guggulu Kalpa',
      apiCode: 'API-VAT-009',
      classicalText: 'Bhaishajya Ratnavali - Amavata Rogadhikara',
      ingredients: ['Shuddha Guggulu', 'Chitrak', 'Pippalimoola', 'Yavani', 'Ajmoda', 'Jeeraka', 'Devdaru', 'Rasna', 'Gokshura', 'Triphala', 'Trikatu'],
      rasa: ['Katu (Pungent)', 'Tikta (Bitter)', 'Kashaya (Astringent)'],
      virya: 'Ushna (Heating)',
      vipaka: 'Katu (Pungent)',
      doshaKarma: { vata: -2, pitta: 1, kapha: -2 }, // Increases Pitta if taken in excess
      indications: ['Sandhivata (Osteoarthritis)', 'Amavata (Rheumatoid Arthritis)', 'Kati Shoola (Lumbago)', 'Gridhrasi (Sciatica)', 'Snayu Vikara'],
      prakritiSuitability: {
        'Vata': 'Highly Recommended (परम वातहर)',
        'Vata-Kapha': 'Highly Recommended',
        'Kapha': 'Recommended',
        'Pitta': 'Caution - May aggravate burning sensation or acidity (पित्त प्रकोप)'
      },
      standardDose: '500mg - 1000mg twice daily after meals',
      agniCalibration: {
        'Manda': '500mg BD with warm water or ginger decoction (Sunthi Kwath)',
        'Tikshna': 'Reduce to 250mg BD with milk or licorice water to avoid Pitta spike',
        'Visham': '500mg BD with Rasnadi Kwath'
      },
      anupana: ['Rasnadi Kwath', 'Lukewarm Water', 'Dashamoola Kwath', 'Warm Milk'],
      contraindications: ['Active Peptic Ulcer', 'Severe Bleeding Disorders (Raktapitta)', 'Pregnancy & Lactation'],
      interactions: [
        { drug: 'Warfarin', severity: 'high', effect: 'Guggulsterones possess mild antiplatelet properties; concurrent use increases bleeding risk and INR.' },
        { drug: 'Aspirin', severity: 'moderate', effect: 'Additive gastric mucosal irritation and bleeding tendency.' },
        { drug: 'Statins (Atorvastatin)', severity: 'moderate', effect: 'Guggulu alters lipid-lowering CYP3A4 pathway; monitor liver enzymes.' }
      ]
    },

    'Ashwagandha': {
      id: 'ashwagandha',
      name: 'Ashwagandha (Withania somnifera / Churna / Vati)',
      type: 'Single Classical Herb / Rasayana',
      apiCode: 'API-RAS-002',
      classicalText: 'Charaka Samhita - Sutrasthana 4',
      ingredients: ['Withania somnifera root standardized withanolides'],
      rasa: ['Tikta (Bitter)', 'Kashaya (Astringent)', 'Madhura (Sweet)'],
      virya: 'Ushna (Heating)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: { vata: -2, pitta: 1, kapha: -1 },
      indications: ['Daurbalya (General Debility)', 'Klaibya (Vitality)', 'Anidra (Insomnia / Stress)', 'Vata Vyadhi', 'Smriti Mandya'],
      prakritiSuitability: {
        'Vata': 'First-line Rasayana',
        'Vata-Kapha': 'Highly Recommended',
        'Pitta': 'Use with Cooling Anupana (Milk / Ghee / Shatavari)'
      },
      standardDose: '3g - 6g powder or 500mg extract twice daily',
      anupana: ['Warm Milk with Cow Ghee (Godugdha + Ghrita)', 'Sharkara (Unrefined Sugar)', 'Warm Water'],
      contraindications: ['Active Thyrotoxicosis (Hyperthyroidism)', 'Autoimmune flares (acute MS / SLE without supervision)', 'Pregnancy'],
      interactions: [
        { drug: 'Thyroxine (Levothyroxine)', severity: 'high', effect: 'Ashwagandha stimulates thyroid hormone production (T3/T4); may cause iatrogenic hyperthyroidism.' },
        { drug: 'Benzodiazepines (Alprazolam, Clonazepam)', severity: 'high', effect: 'GABA-mimetic action creates potent additive sedation and CNS depression.' },
        { drug: 'Immunosuppressants (Cyclosporine, Tacrolimus)', severity: 'moderate', effect: 'Immunostimulant properties may counter allopathic immunosuppression.' },
        { drug: 'Antidiabetic Drugs (Metformin, Glimepiride)', severity: 'moderate', effect: 'Synergistic hypoglycemia; monitor blood sugar.' }
      ]
    },

    'Arjuna': {
      id: 'arjuna',
      name: 'Arjunarishta / Arjuna Twak Churna (Terminalia arjuna)',
      type: 'Hridya Rasayana / Arishta',
      apiCode: 'API-HRD-005',
      classicalText: 'Chakradatta - Hridroga Chikitsa',
      ingredients: ['Arjuna bark extract', 'Draksha', 'Madhuka', 'Dhataki flowers', 'Guda'],
      rasa: ['Kashaya (Astringent)', 'Tikta (Bitter)'],
      virya: 'Sheeta (Cooling)',
      vipaka: 'Katu (Pungent)',
      doshaKarma: { vata: 0, pitta: -1, kapha: -1 },
      indications: ['Hridroga (Ischemic Heart Disease)', 'Uchharaktachapa (Hypertension)', 'Palpitations', 'Hyperlipidemia', 'Asthibhanga (Bone healing)'],
      prakritiSuitability: {
        'Pitta': 'Excellent Cardiac Tonic',
        'Kapha': 'Highly Recommended',
        'Vata': 'Take with Milk or Ksheerapaka'
      },
      standardDose: '15ml - 20ml Arishta with equal water, or 3g Churna in milk',
      anupana: ['Equal parts Water', 'Arjuna Ksheerapaka (Milk decoction)'],
      contraindications: ['Severe Bradycardia (< 50 bpm) without monitoring'],
      interactions: [
        { drug: 'Digoxin', severity: 'high', effect: 'Arjuna glycosides exert positive inotropic effects; concurrent use can precipitate digitalis toxicity.' },
        { drug: 'Beta-Blockers (Atenolol, Metoprolol)', severity: 'moderate', effect: 'Additive hypotensive and bradycardic effect; monitor heart rate.' },
        { drug: 'Antihypertensives (Amlodipine, Telmisartan)', severity: 'moderate', effect: 'Synergistic blood pressure reduction; monitor for postural hypotension.' }
      ]
    },

    'Guduchi': {
      id: 'guduchi',
      name: 'Guduchi / Giloy Ghanvati (Tinospora cordifolia)',
      type: 'Single Herb / Rasayana / Vati',
      apiCode: 'API-RAS-007',
      classicalText: 'Charaka Samhita - Rasayana Adhyaya',
      ingredients: ['Standardized Tinospora cordifolia aqueous extract'],
      rasa: ['Tikta (Bitter)', 'Kashaya (Astringent)'],
      virya: 'Ushna (Mildly heating yet metabolic cooling)',
      vipaka: 'Madhura (Sweet post-digestive)',
      doshaKarma: { vata: -1, pitta: -1, kapha: -1 }, // Tridosha-shamaka
      indications: ['Jwara (Fever / Recurrent Pyrexia)', 'Prameha (Diabetes / Pre-diabetes)', 'Kushtha (Skin Disorders)', 'Vatarakta (Gout)', 'Yakrit Rog (Hepatoprotective)'],
      prakritiSuitability: {
        'Pitta': 'Ideal Tridosha Balancer',
        'Vata': 'Recommended with Ghee',
        'Kapha': 'Recommended with Honey'
      },
      standardDose: '500mg - 1000mg twice daily after meals',
      anupana: ['Warm Water', 'Madhu (Honey)', 'Ghrita (Ghee)'],
      contraindications: ['Post-organ transplant immunosuppressive therapy'],
      interactions: [
        { drug: 'Immunosuppressants (Methotrexate, Azathioprine)', severity: 'high', effect: 'Potent immunostimulatory action directly opposes pharmacological immunosuppression.' },
        { drug: 'Antidiabetics (Insulin, Sulfonylureas)', severity: 'moderate', effect: 'Enhances insulin sensitivity; check for symptomatic hypoglycemia.' }
      ]
    },

    'Brahmi': {
      id: 'brahmi',
      name: 'Brahmi Vati / Saraswatarishta (Bacopa monnieri)',
      type: 'Medhya Rasayana / Vati',
      apiCode: 'API-MED-003',
      classicalText: 'Ashtanga Hridaya - Uttaratantra',
      ingredients: ['Bacopa monnieri', 'Shankhpushpi', 'Vacha', 'Swarna Bhasma (in Gold variant)'],
      rasa: ['Tikta (Bitter)', 'Kashaya (Astringent)', 'Madhura (Sweet)'],
      virya: 'Sheeta (Cooling)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: { vata: -1, pitta: -1, kapha: -1 },
      indications: ['Smriti Daurbalya (Memory Deficit)', 'Manodvega (Anxiety / Neurosis)', 'Unmada', 'Apasmara (Epilepsy support)', 'Insomnia'],
      prakritiSuitability: {
        'Pitta': 'Prime Medhya Herb',
        'Vata': 'Take with Kalyanaka Ghrita',
        'Kapha': 'Take with Saraswatarishta'
      },
      standardDose: '250mg - 500mg twice daily',
      anupana: ['Cow Ghee', 'Warm Milk', 'Honey'],
      contraindications: ['Severe Emphysema / Asthma with excess bronchial secretions'],
      interactions: [
        { drug: 'Antiepileptics (Phenytoin, Carbamazepine)', severity: 'moderate', effect: 'Brahmi modulates hepatic enzymes; monitor serum antiepileptic drug levels.' },
        { drug: 'Sedatives (Zolpidem, Lorazepam)', severity: 'moderate', effect: 'Synergistic central nervous system relaxation.' }
      ]
    },

    'Triphala Guggulu': {
      id: 'triphala_guggulu',
      name: 'Triphala Guggulu',
      type: 'Guggulu Kalpa',
      apiCode: 'API-GUG-004',
      classicalText: 'Sharngadhara Samhita - Madhyama Khanda 7',
      ingredients: ['Haritaki', 'Bibhitaki', 'Amalaki', 'Pippali', 'Shuddha Guggulu'],
      rasa: ['Kashaya (Astringent)', 'Tikta (Bitter)', 'Katu (Pungent)'],
      virya: 'Ushna (Heating)',
      vipaka: 'Katu (Pungent)',
      doshaKarma: { vata: -1, pitta: 0, kapha: -2 },
      indications: ['Arsha (Piles / Hemorrhoids)', 'Bhagandara (Fistula-in-Ano)', 'Vrana Shotha (Inflammatory swelling)', 'Medoroga (Obesity)'],
      prakritiSuitability: {
        'Kapha': 'Prime Shothahara Drug',
        'Kapha-Vata': 'Highly Recommended',
        'Pitta': 'Use with caution if severe anal burning is present'
      },
      standardDose: '500mg - 1000mg BD after meals',
      anupana: ['Warm Water', 'Triphala Kashaya'],
      contraindications: ['Pregnancy', 'Active Bleeding Piles with heavy fresh hemorrhage'],
      interactions: [
        { drug: 'Oral Iron Supplements', severity: 'moderate', effect: 'Tannins in Triphala chelate elemental iron, reducing absorption; separate by 2 hours.' },
        { drug: 'Warfarin', severity: 'high', effect: 'Increased risk of bleeding due to Guggulu content.' }
      ]
    }
  }
};

export default AYUSH_FORMULARY_DB;
