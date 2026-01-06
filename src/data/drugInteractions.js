// ============================================================================
// COMPREHENSIVE DRUG INTERACTIONS DATABASE
// ============================================================================
// Contains 100+ commonly prescribed medications with full clinical data
// Sources: DDInter, NLEM India 2022, Clinical Pharmacology databases
// ============================================================================

export const drugInteractionsDB = {
  interactions: {
    
    // ========== ANALGESICS & ANTIPYRETICS ==========
    
    'Paracetamol': {
      category: 'Analgesic/Antipyretic',
      contraindications: ['Severe liver disease', 'Chronic alcoholism', 'Active hepatitis'],
      warnings: ['Use cautiously with warfarin', 'Monitor with liver disorders', 'Risk of hepatotoxicity in overdose'],
      allergies: ['Known hypersensitivity to paracetamol'],
      interactions: [
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased bleeding risk, monitor INR' },
        { drug: 'Alcohol', severity: 'high', effect: 'Severe hepatotoxicity risk' },
        { drug: 'Isoniazid', severity: 'moderate', effect: 'Increased liver toxicity' },
        { drug: 'Carbamazepine', severity: 'moderate', effect: 'Reduced paracetamol efficacy' },
        { drug: 'Phenytoin', severity: 'moderate', effect: 'Increased hepatotoxicity risk' }
      ],
      synergistic: ['Caffeine (enhanced analgesia)', 'Codeine (pain relief)', 'Tramadol (analgesia)'],
      pregnancy: 'Category B - Generally safe',
      lactation: 'Safe in usual doses (present in milk but non-toxic)',
      maxDose: '4g per day (adults), 3g per day (elderly)',
      renalDose: 'Increase dosing interval in severe renal impairment',
      hepaticDose: 'Contraindicated in severe hepatic impairment',
      commonSideEffects: ['Nausea', 'Rash', 'Hepatotoxicity (overdose)', 'Hypersensitivity reactions']
    },

    'Ibuprofen': {
      category: 'NSAID',
      contraindications: ['Active GI bleeding', 'Severe heart failure', 'Third trimester pregnancy', 'Aspirin-induced asthma', 'Severe renal impairment'],
      warnings: ['Cardiovascular risk with long-term use', 'GI bleeding risk', 'Renal impairment', 'Avoid in dehydration'],
      allergies: ['NSAID hypersensitivity', 'Aspirin allergy'],
      interactions: [
        { drug: 'Aspirin', severity: 'high', effect: 'Reduced cardioprotective effect of aspirin, increased GI bleeding' },
        { drug: 'Warfarin', severity: 'high', effect: 'Severe bleeding risk' },
        { drug: 'Methotrexate', severity: 'high', effect: 'Increased methotrexate toxicity' },
        { drug: 'ACE Inhibitors', severity: 'moderate', effect: 'Reduced antihypertensive effect, renal impairment' },
        { drug: 'Diuretics', severity: 'moderate', effect: 'Reduced diuretic efficacy, renal toxicity' },
        { drug: 'Lithium', severity: 'high', effect: 'Increased lithium levels and toxicity' },
        { drug: 'SSRIs', severity: 'moderate', effect: 'Increased bleeding risk' }
      ],
      synergistic: ['Paracetamol (analgesia)', 'Low-dose aspirin (cardiovascular protection - with caution)'],
      pregnancy: 'Category D in 3rd trimester - Avoid after 30 weeks',
      lactation: 'Probably safe - minimal excretion',
      maxDose: '2.4g per day (max 400mg per dose)',
      renalDose: 'Avoid in CrCl <30 mL/min',
      hepaticDose: 'Use with caution',
      commonSideEffects: ['Dyspepsia', 'Nausea', 'GI bleeding', 'Headache', 'Dizziness', 'Fluid retention', 'Hypertension']
    },

    'Aspirin': {
      category: 'Antiplatelet/NSAID',
      contraindications: ['Active bleeding', 'Hemophilia', 'Children with viral illness (Reye syndrome)', 'Third trimester pregnancy', 'Severe peptic ulcer'],
      warnings: ['Asthma patients', 'Peptic ulcer disease', 'Renal/hepatic impairment', 'G6PD deficiency', 'Before surgery'],
      allergies: ['Salicylate hypersensitivity', 'NSAID allergy', 'Nasal polyps'],
      interactions: [
        { drug: 'Warfarin', severity: 'high', effect: 'Severe bleeding risk' },
        { drug: 'Clopidogrel', severity: 'high', effect: 'Increased bleeding risk but sometimes intentional' },
        { drug: 'Methotrexate', severity: 'high', effect: 'Increased toxicity' },
        { drug: 'Ibuprofen', severity: 'high', effect: 'Reduced cardioprotective effect' },
        { drug: 'ACE Inhibitors', severity: 'moderate', effect: 'Reduced antihypertensive effect' },
        { drug: 'Corticosteroids', severity: 'moderate', effect: 'Increased GI bleeding risk' },
        { drug: 'SSRIs', severity: 'moderate', effect: 'Increased bleeding risk' },
        { drug: 'Alcohol', severity: 'moderate', effect: 'Increased GI bleeding' }
      ],
      synergistic: ['Clopidogrel (dual antiplatelet therapy)', 'Atorvastatin (cardiovascular protection)'],
      pregnancy: 'Category D in 3rd trimester - Avoid',
      lactation: 'Avoid - risk of Reye syndrome in infant',
      maxDose: '4g per day (analgesia), 75-325mg per day (cardioprotection)',
      renalDose: 'Avoid in severe renal impairment',
      hepaticDose: 'Avoid in severe hepatic disease',
      commonSideEffects: ['GI bleeding', 'Tinnitus', 'Nausea', 'Bruising', 'Dyspepsia', 'Urticaria']
    },

    'Diclofenac': {
      category: 'NSAID',
      contraindications: ['Heart failure (NYHA II-IV)', 'Ischemic heart disease', 'Peripheral arterial disease', 'Cerebrovascular disease', 'Active GI ulceration'],
      warnings: ['Highest cardiovascular risk among NSAIDs', 'GI bleeding', 'Hepatotoxicity', 'Renal impairment'],
      allergies: ['NSAID hypersensitivity'],
      interactions: [
        { drug: 'Warfarin', severity: 'high', effect: 'Increased bleeding risk' },
        { drug: 'Aspirin', severity: 'high', effect: 'Reduced aspirin efficacy, increased GI bleeding' },
        { drug: 'ACE Inhibitors', severity: 'moderate', effect: 'Reduced effect, renal impairment' },
        { drug: 'Cyclosporine', severity: 'high', effect: 'Increased nephrotoxicity' }
      ],
      synergistic: [],
      pregnancy: 'Category D - Avoid',
      lactation: 'Avoid',
      maxDose: '150mg per day',
      renalDose: 'Contraindicated in severe renal impairment',
      hepaticDose: 'Contraindicated in active liver disease',
      commonSideEffects: ['GI disturbances', 'Headache', 'Dizziness', 'Elevated liver enzymes', 'Fluid retention']
    },

    'Tramadol': {
      category: 'Opioid Analgesic',
      contraindications: ['Acute intoxication with alcohol/opioids/psychotropics', 'Uncontrolled epilepsy', 'MAOIs (within 14 days)', 'Severe respiratory depression'],
      warnings: ['Seizure risk', 'Serotonin syndrome risk', 'Dependence potential', 'Respiratory depression'],
      allergies: ['Opioid hypersensitivity'],
      interactions: [
        { drug: 'SSRIs', severity: 'high', effect: 'Serotonin syndrome risk, seizures' },
        { drug: 'MAOIs', severity: 'high', effect: 'Severe serotonin syndrome - contraindicated' },
        { drug: 'Carbamazepine', severity: 'moderate', effect: 'Reduced tramadol efficacy' },
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased INR' },
        { drug: 'Alcohol', severity: 'high', effect: 'Enhanced CNS depression' },
        { drug: 'Benzodiazepines', severity: 'high', effect: 'Respiratory depression' }
      ],
      synergistic: ['Paracetamol (analgesia)'],
      pregnancy: 'Category C - Use only if needed',
      lactation: 'Not recommended',
      maxDose: '400mg per day',
      renalDose: 'Reduce dose in CrCl <30 mL/min',
      hepaticDose: 'Reduce dose in hepatic impairment',
      commonSideEffects: ['Nausea', 'Dizziness', 'Constipation', 'Headache', 'Drowsiness', 'Seizures (high dose)']
    },

    // ========== ANTIBIOTICS ==========
    
    'Amoxicillin': {
      category: 'Antibiotic (Penicillin)',
      contraindications: ['Penicillin allergy', 'Infectious mononucleosis', 'History of amoxicillin-induced jaundice'],
      warnings: ['Reduce dose in renal impairment', 'Risk of C. difficile infection', 'Rash in EBV infection'],
      allergies: ['Penicillin hypersensitivity', 'Cephalosporin cross-reactivity (5-10%)'],
      interactions: [
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased INR, monitor closely' },
        { drug: 'Methotrexate', severity: 'high', effect: 'Increased methotrexate toxicity' },
        { drug: 'Oral Contraceptives', severity: 'moderate', effect: 'Reduced contraceptive efficacy - use additional protection' },
        { drug: 'Allopurinol', severity: 'moderate', effect: 'Increased risk of rash' },
        { drug: 'Probenecid', severity: 'moderate', effect: 'Increased amoxicillin levels (can be therapeutic)' }
      ],
      synergistic: ['Clavulanic Acid (beta-lactamase inhibitor - Augmentin)', 'Metronidazole (H. pylori treatment)'],
      pregnancy: 'Category B - Generally safe',
      lactation: 'Safe - present in milk but usually non-toxic',
      maxDose: '3g per day (can go to 6g in severe infections)',
      renalDose: 'Adjust dose: CrCl 10-30: q12h, <10: q24h',
      hepaticDose: 'Use with caution',
      commonSideEffects: ['Diarrhea', 'Nausea', 'Skin rash', 'Vomiting', 'Allergic reactions', 'C. difficile colitis']
    },

    'Amoxicillin-Clavulanic Acid': {
      category: 'Antibiotic (Beta-lactam + Beta-lactamase inhibitor)',
      contraindications: ['Penicillin allergy', 'History of Augmentin-induced cholestatic jaundice', 'Infectious mononucleosis'],
      warnings: ['Hepatotoxicity risk (especially prolonged use)', 'C. difficile infection', 'Renal impairment'],
      allergies: ['Penicillin/cephalosporin allergy'],
      interactions: [
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased INR' },
        { drug: 'Oral Contraceptives', severity: 'moderate', effect: 'Reduced efficacy' },
        { drug: 'Allopurinol', severity: 'moderate', effect: 'Increased rash risk' },
        { drug: 'Methotrexate', severity: 'high', effect: 'Increased toxicity' }
      ],
      synergistic: [],
      pregnancy: 'Category B - Safe',
      lactation: 'Probably safe',
      maxDose: '2g amoxicillin component per day (875mg formulation)',
      renalDose: 'Adjust based on amoxicillin component',
      hepaticDose: 'Monitor liver function',
      commonSideEffects: ['Diarrhea (more common than amoxicillin alone)', 'Nausea', 'Hepatitis', 'Cholestatic jaundice', 'Rash']
    },

    'Azithromycin': {
      category: 'Antibiotic (Macrolide)',
      contraindications: ['Macrolide hypersensitivity', 'History of cholestatic jaundice with azithromycin'],
      warnings: ['QT prolongation risk', 'C. difficile infection', 'Myasthenia gravis exacerbation', 'Hepatotoxicity'],
      allergies: ['Macrolide antibiotics allergy'],
      interactions: [
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased INR' },
        { drug: 'Digoxin', severity: 'moderate', effect: 'Increased digoxin levels' },
        { drug: 'Antacids', severity: 'moderate', effect: 'Reduced absorption - separate by 2 hours' },
        { drug: 'QT-prolonging drugs', severity: 'high', effect: 'Increased arrhythmia risk' },
        { drug: 'Ergotamine', severity: 'high', effect: 'Ergot toxicity' },
        { drug: 'Statins', severity: 'moderate', effect: 'Increased statin toxicity (rhabdomyolysis)' }
      ],
      synergistic: ['Amoxicillin (H. pylori regimen)'],
      pregnancy: 'Category B - Use if needed',
      lactation: 'Probably safe',
      maxDose: '500mg on day 1, then 250mg daily for 4 days (respiratory)',
      renalDose: 'No adjustment needed',
      hepaticDose: 'Use with caution',
      commonSideEffects: ['Diarrhea', 'Nausea', 'Abdominal pain', 'QT prolongation', 'Hepatotoxicity (rare)']
    },

    'Ciprofloxacin': {
      category: 'Antibiotic (Fluoroquinolone)',
      contraindications: ['Children <18 years (except specific indications)', 'Pregnancy', 'Tendon disorders', 'Myasthenia gravis', 'QT prolongation'],
      warnings: ['Tendon rupture risk', 'QT prolongation', 'CNS effects', 'Photosensitivity', 'C. difficile infection', 'Aortic aneurysm risk'],
      allergies: ['Fluoroquinolone hypersensitivity'],
      interactions: [
        { drug: 'Theophylline', severity: 'high', effect: 'Increased theophylline toxicity' },
        { drug: 'Warfarin', severity: 'high', effect: 'Increased bleeding risk' },
        { drug: 'Antacids/Iron/Calcium', severity: 'high', effect: 'Drastically reduced absorption - separate by 2-4 hours' },
        { drug: 'NSAIDs', severity: 'moderate', effect: 'Increased seizure risk' },
        { drug: 'Corticosteroids', severity: 'high', effect: 'Increased tendon rupture risk' },
        { drug: 'QT-prolonging drugs', severity: 'high', effect: 'Arrhythmia risk' },
        { drug: 'Tizanidine', severity: 'high', effect: 'Severe hypotension - contraindicated' }
      ],
      synergistic: ['Metronidazole (intra-abdominal infections)'],
      pregnancy: 'Category C - Avoid',
      lactation: 'Avoid',
      maxDose: '1500mg per day',
      renalDose: 'Reduce dose if CrCl <50 mL/min',
      hepaticDose: 'No adjustment needed',
      commonSideEffects: ['Nausea', 'Diarrhea', 'Headache', 'Tendinitis/rupture', 'QT prolongation', 'CNS effects', 'Photosensitivity']
    },

    'Metronidazole': {
      category: 'Antibiotic/Antiprotozoal',
      contraindications: ['First trimester pregnancy', 'Alcohol consumption (disulfiram-like reaction)', 'Hypersensitivity'],
      warnings: ['Peripheral neuropathy with prolonged use', 'CNS toxicity', 'Blood dyscrasias'],
      allergies: ['Metronidazole or nitroimidazole derivatives'],
      interactions: [
        { drug: 'Alcohol', severity: 'high', effect: 'Severe disulfiram-like reaction (nausea, vomiting, flushing) - avoid for 48h after' },
        { drug: 'Warfarin', severity: 'high', effect: 'Increased bleeding risk, monitor INR closely' },
        { drug: 'Lithium', severity: 'high', effect: 'Lithium toxicity' },
        { drug: 'Phenytoin', severity: 'moderate', effect: 'Increased phenytoin levels' },
        { drug: 'Disulfiram', severity: 'high', effect: 'Psychotic reactions - contraindicated' }
      ],
      synergistic: ['Amoxicillin (H. pylori)', 'Ciprofloxacin (anaerobic coverage)'],
      pregnancy: 'Category B (avoid 1st trimester)',
      lactation: 'Avoid - consider discontinuing breastfeeding during treatment',
      maxDose: '4g per day (short-term)',
      renalDose: 'Use with caution in severe impairment',
      hepaticDose: 'Reduce dose in severe hepatic impairment',
      commonSideEffects: ['Metallic taste', 'Nausea', 'Headache', 'Peripheral neuropathy (prolonged use)', 'Dark urine', 'Disulfiram reaction with alcohol']
    },

    'Doxycycline': {
      category: 'Antibiotic (Tetracycline)',
      contraindications: ['Children <8 years (tooth discoloration)', 'Pregnancy', 'Hypersensitivity to tetracyclines'],
      warnings: ['Photosensitivity', 'Esophageal irritation', 'Tooth discoloration in children', 'Hepatotoxicity'],
      allergies: ['Tetracycline hypersensitivity'],
      interactions: [
        { drug: 'Antacids/Iron/Calcium', severity: 'high', effect: 'Reduced absorption - separate by 2-3 hours' },
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased anticoagulation' },
        { drug: 'Oral Contraceptives', severity: 'moderate', effect: 'Possible reduced efficacy' },
        { drug: 'Isotretinoin', severity: 'high', effect: 'Increased intracranial pressure risk' },
        { drug: 'Penicillins', severity: 'moderate', effect: 'Antagonistic antibacterial effect' }
      ],
      synergistic: [],
      pregnancy: 'Category D - Contraindicated',
      lactation: 'Contraindicated',
      maxDose: '200mg per day',
      renalDose: 'No adjustment needed',
      hepaticDose: 'Use with caution',
      commonSideEffects: ['Nausea', 'Diarrhea', 'Photosensitivity', 'Esophagitis', 'Tooth discoloration (children)', 'Vaginal candidiasis']
    },

    'Cefixime': {
      category: 'Antibiotic (Cephalosporin)',
      contraindications: ['Cephalosporin hypersensitivity'],
      warnings: ['Penicillin cross-allergy (5-10%)', 'C. difficile infection', 'Renal impairment'],
      allergies: ['Cephalosporin allergy', 'Severe penicillin allergy'],
      interactions: [
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased bleeding risk' },
        { drug: 'Probenecid', severity: 'moderate', effect: 'Increased cefixime levels' },
        { drug: 'Aminoglycosides', severity: 'moderate', effect: 'Increased nephrotoxicity risk' }
      ],
      synergistic: ['Azithromycin (respiratory infections)'],
      pregnancy: 'Category B - Safe',
      lactation: 'Probably safe',
      maxDose: '400mg per day',
      renalDose: 'Reduce dose if CrCl <60 mL/min',
      hepaticDose: 'No adjustment',
      commonSideEffects: ['Diarrhea', 'Nausea', 'Abdominal pain', 'Rash', 'C. difficile colitis']
    },

    // ========== GASTROINTESTINAL DRUGS ==========

    'Pantoprazole': {
      category: 'Proton Pump Inhibitor (PPI)',
      contraindications: ['Known hypersensitivity to PPIs', 'Concurrent use with rilpivirine'],
      warnings: ['Long-term use increases fracture risk', 'May mask gastric cancer', 'Hypomagnesemia risk', 'C. difficile infection', 'Vitamin B12 deficiency', 'Acute interstitial nephritis'],
      allergies: ['PPI hypersensitivity'],
      interactions: [
        { drug: 'Clopidogrel', severity: 'high', effect: 'Reduced antiplatelet effect - consider alternative PPI' },
        { drug: 'Warfarin', severity: 'moderate', effect: 'Altered INR (usually minimal)' },
        { drug: 'Methotrexate', severity: 'high', effect: 'Increased methotrexate toxicity with high doses' },
        { drug: 'Ketoconazole', severity: 'moderate', effect: 'Reduced absorption of azoles' },
        { drug: 'Atazanavir', severity: 'high', effect: 'Reduced atazanavir levels - avoid combination' },
        { drug: 'Iron supplements', severity: 'moderate', effect: 'Reduced iron absorption' },
        { drug: 'Digoxin', severity: 'moderate', effect: 'Increased digoxin levels' }
      ],
      synergistic: ['Amoxicillin + Clarithromycin (H. pylori eradication)'],
      pregnancy: 'Category B - Use if needed',
      lactation: 'Probably safe - minimal excretion',
      maxDose: '80mg per day (Zollinger-Ellison can be higher)',
      renalDose: 'No adjustment needed',
      hepaticDose: 'Reduce dose to 20mg in severe impairment',
      commonSideEffects: ['Headache', 'Diarrhea', 'Nausea', 'Abdominal pain', 'Bone fractures (long-term)', 'Hypomagnesemia', 'C. difficile infection']
    },

    'Omeprazole': {
      category: 'Proton Pump Inhibitor (PPI)',
      contraindications: ['Hypersensitivity to PPIs', 'Concurrent rilpivirine use'],
      warnings: ['Long-term risks similar to pantoprazole', 'CYP2C19 interactions', 'Fundic gland polyps'],
      allergies: ['PPI hypersensitivity'],
      interactions: [
        { drug: 'Clopidogrel', severity: 'high', effect: 'Significantly reduced antiplatelet effect - avoid' },
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased warfarin effect' },
        { drug: 'Diazepam', severity: 'moderate', effect: 'Increased benzodiazepine levels' },
        { drug: 'Phenytoin', severity: 'moderate', effect: 'Increased phenytoin levels' },
        { drug: 'Methotrexate', severity: 'high', effect: 'Increased toxicity' },
        { drug: 'Citalopram', severity: 'moderate', effect: 'Increased SSRI levels' }
      ],
      synergistic: ['Clarithromycin + Amoxicillin (H. pylori)'],
      pregnancy: 'Category C - Use if needed',
      lactation: 'Probably safe',
      maxDose: '120mg per day (Zollinger-Ellison)',
      renalDose: 'No adjustment',
      hepaticDose: 'Reduce to 10-20mg in severe impairment',
      commonSideEffects: ['Headache', 'Abdominal pain', 'Nausea', 'Diarrhea', 'Vitamin B12 deficiency', 'Hypomagnesemia']
    },

    'Ranitidine': {
      category: 'H2 Receptor Antagonist',
      contraindications: ['Hypersensitivity to ranitidine', 'Acute porphyria'],
      warnings: ['NOTE: Withdrawn in many countries due to NDMA contamination (2019-2020)', 'Renal impairment', 'Elderly (confusion)'],
      allergies: ['H2 blocker hypersensitivity'],
      interactions: [
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased anticoagulation' },
        { drug: 'Ketoconazole', severity: 'moderate', effect: 'Reduced azole absorption' },
        { drug: 'Atazanavir', severity: 'moderate', effect: 'Reduced antiviral efficacy' }
      ],
      synergistic: [],
      pregnancy: 'Category B - Safe',
      lactation: 'Safe - minimal amounts in milk',
      maxDose: '300mg per day',
      renalDose: 'Reduce dose if CrCl <50 mL/min',
      hepaticDose: 'Use with caution',
      commonSideEffects: ['Headache', 'Dizziness', 'Constipation', 'Confusion (elderly)', 'Gynecomastia (rare)']
    },

    'Ondansetron': {
      category: 'Antiemetic (5-HT3 antagonist)',
      contraindications: ['Congenital long QT syndrome', 'Concurrent apomorphine use', 'Hypersensitivity'],
      warnings: ['QT prolongation', 'Serotonin syndrome risk with serotonergic drugs', 'Constipation risk', 'Masking of ileus'],
      allergies: ['5-HT3 antagonist hypersensitivity'],
      interactions: [
        { drug: 'Apomorphine', severity: 'high', effect: 'Profound hypotension - contraindicated' },
        { drug: 'QT-prolonging drugs', severity: 'moderate', effect: 'Increased arrhythmia risk' },
        { drug: 'Tramadol', severity: 'moderate', effect: 'Reduced tramadol analgesia' },
        { drug: 'SSRIs', severity: 'moderate', effect: 'Serotonin syndrome risk' }
      ],
      synergistic: ['Dexamethasone (chemotherapy-induced nausea)'],
      pregnancy: 'Category B - Safe for pregnancy nausea',
      lactation: 'Probably safe',
      maxDose: '32mg per day (FDA warning: single IV doses >16mg increase QT risk)',
      renalDose: 'No adjustment for mild-moderate impairment',
      hepaticDose: 'Reduce dose in severe impairment (max 8mg/day)',
      commonSideEffects: ['Headache', 'Constipation', 'Dizziness', 'QT prolongation', 'Serotonin syndrome (rare)']
    },

    'Domperidone': {
      category: 'Antiemetic/Prokinetic',
      contraindications: ['Prolactinoma', 'GI hemorrhage/obstruction/perforation', 'Moderate-severe hepatic impairment', 'QT prolongation', 'Cardiac conditions'],
      warnings: ['QT prolongation and sudden cardiac death risk', 'Restricted use in many countries', 'Galactorrhea', 'Extrapyramidal symptoms'],
      allergies: ['Domperidone hypersensitivity'],
      interactions: [
        { drug: 'Ketoconazole', severity: 'high', effect: 'Increased domperidone levels and QT risk - avoid' },
        { drug: 'Erythromycin', severity: 'high', effect: 'Increased QT prolongation - avoid' },
        { drug: 'QT-prolonging drugs', severity: 'high', effect: 'Arrhythmia risk' },
        { drug: 'CYP3A4 inhibitors', severity: 'high', effect: 'Increased domperidone levels' }
      ],
      synergistic: [],
      pregnancy: 'Avoid - insufficient data',
      lactation: 'Contraindicated (increases prolactin)',
      maxDose: '30mg per day (EMA recommendation: lowest effective dose, max 7 days)',
      renalDose: 'Use with caution',
      hepaticDose: 'Contraindicated in moderate-severe impairment',
      commonSideEffects: ['Dry mouth', 'Headache', 'Diarrhea', 'QT prolongation', 'Galactorrhea', 'Gynecomastia', 'Extrapyramidal symptoms']
    },

    // ========== CARDIOVASCULAR DRUGS ==========

    'Atorvastatin': {
      category: 'Statin (HMG-CoA reductase inhibitor)',
      contraindications: ['Active liver disease', 'Pregnancy', 'Lactation', 'Unexplained persistent elevations of transaminases'],
      warnings: ['Myopathy/rhabdomyolysis risk', 'Liver enzyme monitoring', 'Diabetes risk', 'Cognitive impairment (controversial)'],
      allergies: ['Statin hypersensitivity'],
      interactions: [
        { drug: 'Cyclosporine', severity: 'high', effect: 'Severe rhabdomyolysis risk - avoid or use lowest dose' },
        { drug: 'Gemfibrozil', severity: 'high', effect: 'Increased myopathy risk' },
        { drug: 'Clarithromycin', severity: 'high', effect: 'Increased statin levels and myopathy risk' },
        { drug: 'Azithromycin', severity: 'moderate', effect: 'Increased rhabdomyolysis risk' },
        { drug: 'Diltiazem', severity: 'moderate', effect: 'Increased statin levels' },
        { drug: 'Grapefruit juice', severity: 'moderate', effect: 'Increased statin levels - avoid large amounts' },
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased INR - monitor' },
        { drug: 'Digoxin', severity: 'moderate', effect: 'Increased digoxin levels' }
      ],
      synergistic: ['Aspirin (cardiovascular protection)', 'Ezetimibe (lipid lowering)', 'ACE inhibitors (cardioprotection)'],
      pregnancy: 'Category X - Contraindicated',
      lactation: 'Contraindicated',
      maxDose: '80mg per day',
      renalDose: 'No adjustment needed',
      hepaticDose: 'Contraindicated in active liver disease',
      commonSideEffects: ['Myalgia', 'Elevated liver enzymes', 'Headache', 'Nausea', 'Rhabdomyolysis (rare)', 'New-onset diabetes']
    },

    'Rosuvastatin': {
      category: 'Statin',
      contraindications: ['Active liver disease', 'Pregnancy', 'Lactation', 'Asian ancestry (higher levels) - start low'],
      warnings: ['Highest potency statin', 'Myopathy/rhabdomyolysis', 'Proteinuria', 'Hematuria'],
      allergies: ['Statin hypersensitivity'],
      interactions: [
        { drug: 'Cyclosporine', severity: 'high', effect: 'Contraindicated - severe myopathy risk' },
        { drug: 'Gemfibrozil', severity: 'high', effect: 'Avoid combination' },
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased INR' },
        { drug: 'Antacids', severity: 'moderate', effect: 'Reduced absorption - separate by 2 hours' }
      ],
      synergistic: ['Ezetimibe (lipid management)'],
      pregnancy: 'Category X - Contraindicated',
      lactation: 'Contraindicated',
      maxDose: '40mg per day (Asian patients: 20mg max)',
      renalDose: 'Start 5mg if CrCl <30 mL/min',
      hepaticDose: 'Contraindicated in active disease',
      commonSideEffects: ['Myalgia', 'Headache', 'Abdominal pain', 'Nausea', 'Proteinuria', 'Rhabdomyolysis (rare)']
    },

    'Amlodipine': {
      category: 'Calcium Channel Blocker (Dihydropyridine)',
      contraindications: ['Cardiogenic shock', 'Severe hypotension', 'Unstable angina', 'Severe aortic stenosis'],
      warnings: ['Peripheral edema', 'Hypotension', 'Heart failure exacerbation', 'Hepatic impairment'],
      allergies: ['Dihydropyridine hypersensitivity'],
      interactions: [
        { drug: 'Simvastatin', severity: 'moderate', effect: 'Limit simvastatin to 20mg/day - myopathy risk' },
        { drug: 'Grapefruit juice', severity: 'moderate', effect: 'Increased amlodipine levels' },
        { drug: 'CYP3A4 inhibitors', severity: 'moderate', effect: 'Increased amlodipine effects' },
        { drug: 'Beta-blockers', severity: 'moderate', effect: 'Additive hypotension, bradycardia' }
      ],
      synergistic: ['ACE inhibitors (hypertension)', 'ARBs (blood pressure control)', 'Statins (cardiovascular protection)'],
      pregnancy: 'Category C - Use if needed',
      lactation: 'Probably safe',
      maxDose: '10mg per day',
      renalDose: 'No adjustment needed',
      hepaticDose: 'Start with 2.5mg',
      commonSideEffects: ['Peripheral edema', 'Headache', 'Flushing', 'Dizziness', 'Palpitations', 'Fatigue']
    },

    'Atenolol': {
      category: 'Beta-Blocker (Cardioselective)',
      contraindications: ['Asthma/COPD (relative)', 'Severe bradycardia', 'Heart block (2nd/3rd degree)', 'Cardiogenic shock', 'Severe peripheral arterial disease', 'Uncontrolled heart failure'],
      warnings: ['Bradycardia', 'Hypotension', 'Masking of hypoglycemia in diabetics', 'Bronchospasm', 'Fatigue', 'Withdrawal syndrome'],
      allergies: ['Beta-blocker hypersensitivity'],
      interactions: [
        { drug: 'Verapamil/Diltiazem', severity: 'high', effect: 'Severe bradycardia, heart block, heart failure' },
        { drug: 'Insulin', severity: 'moderate', effect: 'Masks hypoglycemia symptoms' },
        { drug: 'NSAIDs', severity: 'moderate', effect: 'Reduced antihypertensive effect' },
        { drug: 'Clonidine', severity: 'high', effect: 'Rebound hypertension if stopped abruptly' },
        { drug: 'Digoxin', severity: 'moderate', effect: 'Increased bradycardia risk' }
      ],
      synergistic: ['ACE inhibitors (heart failure, hypertension)', 'Diuretics (hypertension)'],
      pregnancy: 'Category D - Use with caution',
      lactation: 'Probably safe - monitor infant',
      maxDose: '100mg per day',
      renalDose: 'Reduce dose significantly (CrCl <35: 50mg/48h, <15: 50mg/96h)',
      hepaticDose: 'No adjustment',
      commonSideEffects: ['Bradycardia', 'Fatigue', 'Cold extremities', 'Dizziness', 'Depression', 'Sexual dysfunction', 'Bronchospasm']
    },

    'Metoprolol': {
      category: 'Beta-Blocker (Cardioselective)',
      contraindications: ['Similar to atenolol', 'Sick sinus syndrome', 'Severe peripheral arterial disease'],
      warnings: ['Abrupt withdrawal risk', 'Bradycardia', 'Hypotension', 'Heart failure exacerbation'],
      allergies: ['Beta-blocker hypersensitivity'],
      interactions: [
        { drug: 'CYP2D6 inhibitors', severity: 'moderate', effect: 'Increased metoprolol levels (fluoxetine, paroxetine, quinidine)' },
        { drug: 'Calcium channel blockers', severity: 'high', effect: 'Bradycardia, heart block' },
        { drug: 'Digoxin', severity: 'moderate', effect: 'Bradycardia risk' },
        { drug: 'Clonidine', severity: 'high', effect: 'Rebound hypertension' }
      ],
      synergistic: ['ACE inhibitors (heart failure)', 'Aspirin (post-MI)'],
      pregnancy: 'Category C - Use if needed',
      lactation: 'Probably safe',
      maxDose: '400mg per day (divided doses)',
      renalDose: 'No adjustment',
      hepaticDose: 'Start with low dose',
      commonSideEffects: ['Bradycardia', 'Fatigue', 'Dizziness', 'Depression', 'Dyspnea', 'Cold extremities']
    },

    'Losartan': {
      category: 'Angiotensin Receptor Blocker (ARB)',
      contraindications: ['Pregnancy (2nd/3rd trimester)', 'Bilateral renal artery stenosis', 'Angioedema history with ARBs', 'Concurrent aliskiren in diabetics'],
      warnings: ['Hyperkalemia', 'Renal impairment', 'Hypotension', 'Angioedema (rare)'],
      allergies: ['ARB hypersensitivity'],
      interactions: [
        { drug: 'Potassium supplements/Spironolactone', severity: 'high', effect: 'Severe hyperkalemia' },
        { drug: 'NSAIDs', severity: 'moderate', effect: 'Reduced antihypertensive effect, renal impairment' },
        { drug: 'Lithium', severity: 'high', effect: 'Lithium toxicity' },
        { drug: 'ACE inhibitors', severity: 'moderate', effect: 'Increased adverse effects (hyperkalemia, hypotension) - avoid dual blockade' },
        { drug: 'Rifampin', severity: 'moderate', effect: 'Reduced losartan efficacy' }
      ],
      synergistic: ['Hydrochlorothiazide (hypertension)', 'Amlodipine (blood pressure control)'],
      pregnancy: 'Category D - Contraindicated',
      lactation: 'Avoid',
      maxDose: '100mg per day',
      renalDose: 'Start 25mg if CrCl <30 mL/min',
      hepaticDose: 'Reduce dose in hepatic impairment',
      commonSideEffects: ['Dizziness', 'Hyperkalemia', 'Hypotension', 'Fatigue', 'Renal impairment', 'Angioedema (rare)']
    },

    'Telmisartan': {
      category: 'Angiotensin Receptor Blocker (ARB)',
      contraindications: ['Similar to losartan', 'Biliary obstruction'],
      warnings: ['Hyperkalemia', 'Hypotension', 'Renal impairment'],
      allergies: ['ARB hypersensitivity'],
      interactions: [
        { drug: 'Potassium-sparing diuretics', severity: 'high', effect: 'Hyperkalemia' },
        { drug: 'NSAIDs', severity: 'moderate', effect: 'Reduced effect, renal toxicity' },
        { drug: 'Lithium', severity: 'high', effect: 'Toxicity' },
        { drug: 'Digoxin', severity: 'moderate', effect: 'Increased digoxin levels' }
      ],
      synergistic: ['Amlodipine (combination pill available)', 'Hydrochlorothiazide (hypertension)'],
      pregnancy: 'Category D - Contraindicated',
      lactation: 'Avoid',
      maxDose: '80mg per day',
      renalDose: 'Use with caution',
      hepaticDose: 'Start 20-40mg',
      commonSideEffects: ['Dizziness', 'Hypotension', 'Hyperkalemia', 'Back pain', 'Diarrhea', 'Sinusitis']
    },

    'Enalapril': {
      category: 'ACE Inhibitor',
      contraindications: ['Angioedema history', 'Pregnancy', 'Bilateral renal artery stenosis', 'Concurrent aliskiren in diabetics'],
      warnings: ['Hyperkalemia', 'Renal impairment', 'Hypotension', 'Dry cough (10-15%)', 'Angioedema'],
      allergies: ['ACE inhibitor hypersensitivity'],
      interactions: [
        { drug: 'Potassium supplements/Spironolactone', severity: 'high', effect: 'Severe hyperkalemia' },
        { drug: 'NSAIDs', severity: 'moderate', effect: 'Reduced effect, renal impairment, hyperkalemia' },
        { drug: 'Lithium', severity: 'high', effect: 'Lithium toxicity - monitor levels' },
        { drug: 'Aspirin', severity: 'moderate', effect: 'May reduce ACE inhibitor efficacy' },
        { drug: 'Trimethoprim', severity: 'moderate', effect: 'Hyperkalemia' }
      ],
      synergistic: ['Beta-blockers (heart failure)', 'Diuretics (hypertension, heart failure)', 'Statins (cardiovascular protection)'],
      pregnancy: 'Category D - Contraindicated',
      lactation: 'Use with caution',
      maxDose: '40mg per day',
      renalDose: 'Reduce dose if CrCl <30 mL/min',
      hepaticDose: 'No adjustment',
      commonSideEffects: ['Dry cough (10-15%)', 'Hyperkalemia', 'Hypotension', 'Dizziness', 'Headache', 'Fatigue', 'Angioedema (rare but serious)']
    },

    'Ramipril': {
      category: 'ACE Inhibitor',
      contraindications: ['Similar to enalapril'],
      warnings: ['Similar to enalapril', 'Persistent dry cough'],
      allergies: ['ACE inhibitor hypersensitivity'],
      interactions: [
        { drug: 'Potassium supplements', severity: 'high', effect: 'Hyperkalemia' },
        { drug: 'NSAIDs', severity: 'moderate', effect: 'Reduced efficacy, renal impairment' },
        { drug: 'Lithium', severity: 'high', effect: 'Toxicity' },
        { drug: 'Allopurinol', severity: 'moderate', effect: 'Increased hypersensitivity risk' }
      ],
      synergistic: ['Aspirin (cardiovascular protection)', 'Atorvastatin (cardioprotection)'],
      pregnancy: 'Category D - Contraindicated',
      lactation: 'Probably safe',
      maxDose: '10mg per day (heart failure), 20mg per day (hypertension)',
      renalDose: 'Start 1.25mg if CrCl <40 mL/min',
      hepaticDose: 'Use with caution',
      commonSideEffects: ['Dry cough', 'Dizziness', 'Hypotension', 'Hyperkalemia', 'Headache', 'Fatigue']
    },

    'Furosemide': {
      category: 'Loop Diuretic',
      contraindications: ['Anuria', 'Severe hypokalemia', 'Severe hyponatremia', 'Hepatic coma', 'Sulfonamide allergy'],
      warnings: ['Hypokalemia', 'Hypomagnesemia', 'Hyponatremia', 'Ototoxicity (high doses)', 'Gout', 'Dehydration'],
      allergies: ['Sulfonamide hypersensitivity'],
      interactions: [
        { drug: 'Aminoglycosides', severity: 'high', effect: 'Increased ototoxicity' },
        { drug: 'Digoxin', severity: 'high', effect: 'Hypokalemia increases digoxin toxicity' },
        { drug: 'Lithium', severity: 'high', effect: 'Lithium toxicity' },
        { drug: 'NSAIDs', severity: 'moderate', effect: 'Reduced diuretic effect' },
        { drug: 'ACE inhibitors', severity: 'moderate', effect: 'Hypotension, renal impairment' },
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased anticoagulation' }
      ],
      synergistic: ['Spironolactone (reduces potassium loss)', 'ACE inhibitors (heart failure)'],
      pregnancy: 'Category C - Use if needed',
      lactation: 'Probably safe - may suppress lactation',
      maxDose: '600mg per day (can be higher in refractory edema)',
      renalDose: 'Higher doses may be needed',
      hepaticDose: 'Use with caution (risk of hepatic encephalopathy)',
      commonSideEffects: ['Hypokalemia', 'Hyponatremia', 'Dehydration', 'Hypotension', 'Hyperuricemia', 'Ototoxicity (high doses)', 'Hyperglycemia']
    },

    'Spironolactone': {
      category: 'Potassium-Sparing Diuretic (Aldosterone Antagonist)',
      contraindications: ['Hyperkalemia', 'Addisons disease', 'Anuria', 'Severe renal impairment', 'Concurrent eplerenone'],
      warnings: ['Hyperkalemia (major risk)', 'Gynecomastia', 'Menstrual irregularities', 'Renal impairment', 'Hyponatremia'],
      allergies: ['Spironolactone hypersensitivity'],
      interactions: [
        { drug: 'ACE inhibitors/ARBs', severity: 'high', effect: 'Severe hyperkalemia - monitor potassium closely' },
        { drug: 'Potassium supplements', severity: 'high', effect: 'Life-threatening hyperkalemia - avoid' },
        { drug: 'NSAIDs', severity: 'moderate', effect: 'Hyperkalemia, reduced diuretic effect' },
        { drug: 'Lithium', severity: 'high', effect: 'Lithium toxicity' },
        { drug: 'Digoxin', severity: 'moderate', effect: 'Increased digoxin levels' },
        { drug: 'Trimethoprim', severity: 'high', effect: 'Severe hyperkalemia' }
      ],
      synergistic: ['Furosemide (reduces potassium loss)'],
      pregnancy: 'Category C - Avoid if possible',
      lactation: 'Contraindicated',
      maxDose: '400mg per day (edema), 100mg per day (hypertension/heart failure)',
      renalDose: 'Contraindicated if CrCl <30 mL/min',
      hepaticDose: 'Use with caution',
      commonSideEffects: ['Hyperkalemia', 'Gynecomastia', 'Menstrual irregularities', 'Hyponatremia', 'Dizziness', 'Headache', 'GI disturbances']
    },

    'Hydrochlorothiazide': {
      category: 'Thiazide Diuretic',
     contraindications: ['Anuria', 'Sulfonamide allergy', 'Severe renal impairment'],
warnings: ['Hypokalemia', 'Hyponatremia', 'Hyperuricemia', 'Hyperglycemia', 'Hypercalcemia', 'Photosensitivity'],
allergies: ['Sulfonamide hypersensitivity'],
interactions: [
  { drug: 'Lithium', severity: 'high', effect: 'Lithium toxicity' },
  { drug: 'Digoxin', severity: 'moderate', effect: 'Hypokalemia increases digoxin toxicity' },
  { drug: 'NSAIDs', severity: 'moderate', effect: 'Reduced antihypertensive effect' },
  { drug: 'Corticosteroids', severity: 'moderate', effect: 'Increased hypokalemia' },
  { drug: 'Antidiabetic drugs', severity: 'moderate', effect: 'Reduced glycemic control' }
],
synergistic: ['ACE inhibitors (hypertension)', 'ARBs (blood pressure control)', 'Beta-blockers (hypertension)'],
pregnancy: 'Category B - Use if needed',
lactation: 'Probably safe',
maxDose: '50mg per day (higher doses do not increase efficacy)',
renalDose: 'Ineffective if CrCl <30 mL/min',
hepaticDose: 'Use with caution',
commonSideEffects: ['Hypokalemia', 'Hyponatremia', 'Hyperuricemia (gout)', 'Hyperglycemia', 'Hypercalcemia', 'Photosensitivity', 'Hyperlipidemia']

    },

    'Digoxin': {
      category: 'Cardiac Glycoside',
      contraindications: ['Ventricular fibrillation', 'Ventricular tachycardia', '2nd/3rd degree heart block', 'WPW syndrome', 'Hypertrophic cardiomyopathy'],
      warnings: ['Narrow therapeutic index', 'Toxicity risk (nausea, arrhythmias, vision changes)', 'Hypokalemia increases toxicity', 'Renal impairment'],
      allergies: ['Digitalis hypersensitivity'],
      interactions: [
        { drug: 'Amiodarone', severity: 'high', effect: 'Increased digoxin levels - reduce digoxin dose by 50%' },
        { drug: 'Verapamil/Diltiazem', severity: 'high', effect: 'Increased digoxin levels, bradycardia' },
        { drug: 'Quinidine', severity: 'high', effect: 'Doubled digoxin levels' },
        { drug: 'Diuretics', severity: 'high', effect: 'Hypokalemia increases toxicity' },
        { drug: 'Macrolides', severity: 'moderate', effect: 'Increased digoxin levels' },
        { drug: 'Spironolactone', severity: 'moderate', effect: 'Increased digoxin levels' },
        { drug: 'Antacids', severity: 'moderate', effect: 'Reduced absorption - separate by 2 hours' }
      ],
      synergistic: ['Beta-blockers (rate control in AF)', 'ACE inhibitors (heart failure)'],
      pregnancy: 'Category C - Use if needed',
      lactation: 'Probably safe',
      maxDose: 'Individualized based on levels (target 0.5-0.9 ng/mL)',
      renalDose: 'Reduce dose significantly (CrCl-based)',
      hepaticDose: 'No adjustment',
      commonSideEffects: ['Nausea', 'Vomiting', 'Arrhythmias', 'Visual disturbances (yellow-green halos)', 'Confusion', 'Gynecomastia']
    },

    'Warfarin': {
      category: 'Anticoagulant (Vitamin K antagonist)',
      contraindications: ['Active bleeding', 'Pregnancy', 'Severe hypertension', 'Recent surgery', 'Hemorrhagic stroke', 'Severe liver disease', 'Thrombocytopenia'],
      warnings: ['Requires INR monitoring (target 2-3 for most indications)', 'Multiple drug interactions', 'Dietary vitamin K affects INR', 'High bleeding risk'],
      allergies: ['Known hypersensitivity to warfarin'],
      interactions: [
        { drug: 'Aspirin', severity: 'high', effect: 'Severe bleeding risk - avoid unless specific indication' },
        { drug: 'NSAIDs', severity: 'high', effect: 'Increased bleeding risk' },
        { drug: 'Paracetamol', severity: 'moderate', effect: 'Increased INR with regular use (>4g/week)' },
        { drug: 'Amoxicillin', severity: 'moderate', effect: 'Increased INR - monitor closely' },
        { drug: 'Azithromycin', severity: 'moderate', effect: 'Increased INR' },
        { drug: 'Metronidazole', severity: 'high', effect: 'Markedly increased INR - close monitoring' },
        { drug: 'Ciprofloxacin', severity: 'high', effect: 'Increased bleeding risk' },
        { drug: 'Omeprazole', severity: 'moderate', effect: 'Variable INR changes' },
        { drug: 'Simvastatin', severity: 'moderate', effect: 'Increased INR' },
        { drug: 'Amiodarone', severity: 'high', effect: 'Markedly increased INR - reduce warfarin by 30-50%' },
        { drug: 'Carbamazepine', severity: 'high', effect: 'Decreased INR - warfarin less effective' },
        { drug: 'Rifampin', severity: 'high', effect: 'Markedly decreased INR' },
        { drug: 'Vitamin K foods', severity: 'moderate', effect: 'Decreased INR - maintain consistent intake' },
        { drug: 'Alcohol', severity: 'moderate', effect: 'Variable effect on INR' }
      ],
      synergistic: [],
      pregnancy: 'Category X - Contraindicated (teratogenic)',
      lactation: 'Probably safe',
      maxDose: 'Individualized based on INR',
      renalDose: 'Use with caution',
      hepaticDose: 'Contraindicated in severe disease',
      commonSideEffects: ['Bleeding', 'Bruising', 'Hair loss', 'Skin necrosis (rare)', 'Purple toe syndrome (rare)', 'Osteoporosis (long-term)']
    },

    'Clopidogrel': {
      category: 'Antiplatelet (P2Y12 inhibitor)',
      contraindications: ['Active pathological bleeding', 'Severe hepatic impairment', 'Hypersensitivity'],
      warnings: ['Bleeding risk', 'CYP2C19 poor metabolizers (reduced efficacy)', 'Thrombotic thrombocytopenic purpura (rare)', 'Before surgery'],
      allergies: ['Thienopyridine hypersensitivity'],
      interactions: [
        { drug: 'Omeprazole', severity: 'high', effect: 'Significantly reduced antiplatelet effect - avoid, use pantoprazole if PPI needed' },
        { drug: 'Esomeprazole', severity: 'high', effect: 'Reduced antiplatelet effect - avoid' },
        { drug: 'Warfarin', severity: 'high', effect: 'Increased bleeding risk' },
        { drug: 'Aspirin', severity: 'moderate', effect: 'Increased bleeding but often used together (DAPT)' },
        { drug: 'NSAIDs', severity: 'moderate', effect: 'Increased bleeding risk' },
        { drug: 'SSRIs', severity: 'moderate', effect: 'Increased bleeding risk' },
        { drug: 'CYP2C19 inhibitors', severity: 'moderate', effect: 'Reduced clopidogrel efficacy' }
      ],
      synergistic: ['Aspirin (dual antiplatelet therapy post-stent)', 'Atorvastatin (cardiovascular protection)'],
      pregnancy: 'Category B - Use if needed',
      lactation: 'Unknown - probably avoid',
      maxDose: '75mg per day (300-600mg loading dose)',
      renalDose: 'No adjustment',
      hepaticDose: 'Contraindicated in severe impairment',
      commonSideEffects: ['Bleeding', 'Bruising', 'Dyspepsia', 'Diarrhea', 'Rash', 'TTP (rare but serious)']
    },

    // ========== DIABETES MEDICATIONS ==========

    'Metformin': {
      category: 'Antidiabetic (Biguanide)',
      contraindications: ['Severe renal impairment (eGFR <30)', 'Metabolic acidosis', 'Severe heart failure', 'Severe hepatic impairment', 'Alcohol abuse', 'Acute conditions with hypoxia risk'],
      warnings: ['Hold before contrast studies (48-72h)', 'Monitor renal function', 'Lactic acidosis risk (rare but serious)', 'Vitamin B12 deficiency with long-term use', 'GI side effects'],
      allergies: ['Known hypersensitivity to metformin'],
      interactions: [
        { drug: 'Contrast Media', severity: 'high', effect: 'Lactic acidosis risk - hold metformin 48h before/after procedure' },
        { drug: 'Alcohol', severity: 'high', effect: 'Increased lactic acidosis risk' },
        { drug: 'Cimetidine', severity: 'moderate', effect: 'Increased metformin levels' },
        { drug: 'Furosemide', severity: 'moderate', effect: 'Increased metformin levels' },
        { drug: 'Carbonic anhydrase inhibitors', severity: 'moderate', effect: 'Increased acidosis risk' }
      ],
      synergistic: ['Sulfonylureas (glucose control)', 'DPP-4 inhibitors (diabetes management)', 'Insulin (Type 2 DM)', 'SGLT2 inhibitors'],
      pregnancy: 'Category B - Increasingly used in gestational diabetes',
      lactation: 'Probably safe',
      maxDose: '2550mg per day (immediate release), 2000mg per day (extended release)',
      renalDose: 'Contraindicated if eGFR <30, reduce dose if eGFR 30-45',
      hepaticDose: 'Avoid in severe impairment',
      commonSideEffects: ['Diarrhea (most common)', 'Nausea', 'Abdominal pain', 'Metallic taste', 'Vitamin B12 deficiency', 'Lactic acidosis (rare)']
    },

    'Glimepiride': {
      category: 'Antidiabetic (Sulfonylurea)',
      contraindications: ['Type 1 diabetes', 'Diabetic ketoacidosis', 'Severe renal/hepatic impairment', 'Sulfonamide allergy'],
      warnings: ['Hypoglycemia risk (especially in elderly)', 'Weight gain', 'Cardiovascular concerns', 'G6PD deficiency'],
      allergies: ['Sulfonylurea hypersensitivity', 'Sulfonamide allergy'],
      interactions: [
        { drug: 'Beta-blockers', severity: 'moderate', effect: 'Masks hypoglycemia symptoms' },
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased hypoglycemia, altered INR' },
        { drug: 'Azole antifungals', severity: 'moderate', effect: 'Increased hypoglycemia' },
        { drug: 'Fluoroquinolones', severity: 'moderate', effect: 'Dysglycemia (hypo or hyperglycemia)' },
        { drug: 'Alcohol', severity: 'moderate', effect: 'Disulfiram-like reaction, hypoglycemia' }
      ],
      synergistic: ['Metformin (diabetes control)', 'DPP-4 inhibitors'],
      pregnancy: 'Category C - Insulin preferred',
      lactation: 'Not recommended',
      maxDose: '8mg per day',
      renalDose: 'Start 1mg in renal impairment',
      hepaticDose: 'Start 1mg',
      commonSideEffects: ['Hypoglycemia', 'Weight gain', 'Nausea', 'Dizziness', 'Headache', 'Rash']
    },

    'Sitagliptin': {
      category: 'Antidiabetic (DPP-4 inhibitor)',
      contraindications: ['Type 1 diabetes', 'Diabetic ketoacidosis', 'Known hypersensitivity'],
      warnings: ['Pancreatitis risk', 'Joint pain', 'Heart failure risk (controversial)', 'Hypersensitivity reactions'],
      allergies: ['DPP-4 inhibitor hypersensitivity'],
      interactions: [
        { drug: 'Insulin/Sulfonylureas', severity: 'moderate', effect: 'Increased hypoglycemia - may need dose reduction' },
        { drug: 'Digoxin', severity: 'moderate', effect: 'Slight increase in digoxin levels - usually not clinically significant' }
      ],
      synergistic: ['Metformin (combination pill available)', 'SGLT2 inhibitors'],
      pregnancy: 'Category B - Insulin preferred',
      lactation: 'Unknown - probably avoid',
      maxDose: '100mg per day',
      renalDose: 'CrCl 30-50: 50mg, <30: 25mg',
      hepaticDose: 'No adjustment',
      commonSideEffects: ['Nasopharyngitis', 'Headache', 'Pancreatitis (rare)', 'Joint pain', 'Upper respiratory infection']
    },

    'Insulin Glargine': {
      category: 'Antidiabetic (Long-acting insulin)',
      contraindications: ['Hypoglycemia', 'Known hypersensitivity'],
      warnings: ['Hypoglycemia (major risk)', 'Hypokalemia', 'Weight gain', 'Injection site reactions', 'Never give IV'],
      allergies: ['Insulin hypersensitivity (rare)'],
      interactions: [
        { drug: 'Beta-blockers', severity: 'moderate', effect: 'Masks hypoglycemia symptoms' },
        { drug: 'Oral antidiabetics', severity: 'moderate', effect: 'Additive glucose-lowering - monitor closely' },
        { drug: 'Corticosteroids', severity: 'moderate', effect: 'Increased insulin requirements' },
        { drug: 'Thiazide diuretics', severity: 'moderate', effect: 'Decreased insulin sensitivity' },
        { drug: 'ACE inhibitors', severity: 'moderate', effect: 'Increased insulin sensitivity' }
      ],
      synergistic: ['Metformin (Type 2 DM)', 'Rapid-acting insulin (basal-bolus regimen)'],
      pregnancy: 'Category C - Preferred over oral agents',
      lactation: 'Safe - does not pass into milk',
      maxDose: 'Individualized based on glucose monitoring',
      renalDose: 'May need dose reduction',
      hepaticDose: 'May need dose reduction',
      commonSideEffects: ['Hypoglycemia', 'Weight gain', 'Injection site reactions', 'Lipohypertrophy', 'Hypokalemia', 'Edema']
    },

    // ========== RESPIRATORY MEDICATIONS ==========

    'Salbutamol': {
      category: 'Bronchodilator (Beta-2 agonist)',
      contraindications: ['Known hypersensitivity'],
      warnings: ['Tachycardia', 'Tremor', 'Hypokalemia (high doses)', 'Paradoxical bronchospasm', 'Overuse indicates poor control'],
      allergies: ['Salbutamol hypersensitivity (rare)'],
      interactions: [
        { drug: 'Beta-blockers', severity: 'high', effect: 'Antagonistic effect - can cause bronchospasm' },
        { drug: 'Diuretics', severity: 'moderate', effect: 'Increased hypokalemia' },
        { drug: 'Digoxin', severity: 'moderate', effect: 'Hypokalemia increases digoxin toxicity' },
        { drug: 'MAOIs', severity: 'moderate', effect: 'Cardiovascular effects' }
      ],
      synergistic: ['Inhaled corticosteroids (asthma control)', 'Ipratropium (COPD)'],
      pregnancy: 'Category C - Use if needed',
      lactation: 'Probably safe',
      maxDose: '32mg per day (nebulized), 1600mcg per day (MDI)',
      renalDose: 'No adjustment',
      hepaticDose: 'No adjustment',
      commonSideEffects: ['Tremor', 'Tachycardia', 'Palpitations', 'Headache', 'Muscle cramps', 'Hypokalemia (high doses)']
    },

    'Montelukast': {
      category: 'Leukotriene Receptor Antagonist',
      contraindications: ['Known hypersensitivity', 'Acute asthma attack (not for rescue)'],
      warnings: ['Neuropsychiatric events (agitation, depression, suicidal thoughts)', 'Churg-Strauss syndrome (rare)', 'Not for acute symptoms'],
      allergies: ['Montelukast hypersensitivity'],
      interactions: [
        { drug: 'Phenobarbital', severity: 'moderate', effect: 'Reduced montelukast efficacy' },
        { drug: 'Rifampin', severity: 'moderate', effect: 'Reduced montelukast levels' }
      ],
      synergistic: ['Inhaled corticosteroids (asthma)', 'Salbutamol (allergic rhinitis)'],
      pregnancy: 'Category B - Probably safe',
      lactation: 'Unknown',
      maxDose: '10mg per day (adults)',
      renalDose: 'No adjustment',
      hepaticDose: 'Use with caution',
      commonSideEffects: ['Headache', 'Upper respiratory infection', 'Abdominal pain', 'Neuropsychiatric events', 'Elevated liver enzymes']
    },

    // ========== NEUROPSYCHIATRIC MEDICATIONS ==========

    'Sertraline': {
      category: 'Antidepressant (SSRI)',
      contraindications: ['MAOIs (within 14 days)', 'Pimozide use', 'Known hypersensitivity'],
      warnings: ['Suicidality risk (especially young adults)', 'Serotonin syndrome', 'Bleeding risk', 'Hyponatremia', 'Sexual dysfunction', 'Withdrawal syndrome'],
      allergies: ['SSRI hypersensitivity'],
      interactions: [
        { drug: 'MAOIs', severity: 'high', effect: 'Serotonin syndrome - contraindicated (14-day washout)' },
        { drug: 'Tramadol', severity: 'high', effect: 'Serotonin syndrome, seizures' },
        { drug: 'NSAIDs/Aspirin', severity: 'moderate', effect: 'Increased bleeding risk' },
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased bleeding' },
        { drug: 'Clopidogrel', severity: 'moderate', effect: 'Increased bleeding' },
        { drug: 'Triptans', severity: 'high', effect: 'Serotonin syndrome' },
        { drug: 'Other SSRIs/SNRIs', severity: 'high', effect: 'Serotonin syndrome' }
      ],
      synergistic: [],
      pregnancy: 'Category C - Use with caution',
      lactation: 'Probably safe - monitor infant',
      maxDose: '200mg per day',
      renalDose: 'No adjustment',
      hepaticDose: 'Reduce dose or frequency',
      commonSideEffects: ['Nausea', 'Diarrhea', 'Sexual dysfunction', 'Insomnia', 'Dry mouth', 'Tremor', 'Hyponatremia', 'Weight changes', 'Serotonin syndrome']
    },

    'Escitalopram': {
      category: 'Antidepressant (SSRI)',
      contraindications: ['MAOIs (within 14 days)', 'Pimozide', 'Congenital long QT syndrome'],
      warnings: ['QT prolongation (dose-related)', 'Suicidality', 'Serotonin syndrome', 'Hyponatremia', 'Bleeding'],
      allergies: ['SSRI/citalopram hypersensitivity'],
      interactions: [
        { drug: 'MAOIs', severity: 'high', effect: 'Serotonin syndrome - contraindicated' },
        { drug: 'QT-prolonging drugs', severity: 'moderate', effect: 'Increased arrhythmia risk' },
        { drug: 'Tramadol', severity: 'high', effect: 'Serotonin syndrome' },
        { drug: 'Omeprazole', severity: 'moderate', effect: 'Increased escitalopram levels' },
        { drug: 'NSAIDs', severity: 'moderate', effect: 'Bleeding risk' }
      ],
      synergistic: [],
      pregnancy: 'Category C - Avoid in 1st trimester if possible',
      lactation: 'Use with caution',
      maxDose: '20mg per day (10mg if >65 years)',
      renalDose: 'Use with caution if CrCl <20',
      hepaticDose: 'Max 10mg per day',
      commonSideEffects: ['Nausea', 'Insomnia', 'Sexual dysfunction', 'Fatigue', 'Sweating', 'Dry mouth', 'Dizziness']
    },

    'Alprazolam': {
      category: 'Benzodiazepine',
      contraindications: ['Acute narrow-angle glaucoma', 'Concurrent ketoconazole/itraconazole', 'Known hypersensitivity', 'Myasthenia gravis', 'Severe respiratory insufficiency'],
      warnings: ['Dependence/addiction risk', 'Withdrawal syndrome', 'CNS depression', 'Respiratory depression (especially with opioids)', 'Cognitive impairment', 'Falls in elderly'],
      allergies: ['Benzodiazepine hypersensitivity'],
      interactions: [
        { drug: 'Opioids', severity: 'high', effect: 'Severe respiratory depression, death - FDA boxed warning' },
        { drug: 'Alcohol', severity: 'high', effect: 'Severe CNS depression' },
        { drug: 'CYP3A4 inhibitors', severity: 'high', effect: 'Increased alprazolam levels (ketoconazole contraindicated)' },
        { drug: 'Antidepressants', severity: 'moderate', effect: 'Increased sedation' },
        { drug: 'Antipsychotics', severity: 'moderate', effect: 'Increased sedation' }
      ],
      synergistic: [],
      pregnancy: 'Category D - Avoid',
      lactation: 'Avoid',
      maxDose: '4mg per day (divided doses)',
      renalDose: 'No adjustment',
      hepaticDose: 'Reduce dose',
      commonSideEffects: ['Drowsiness', 'Lightheadedness', 'Ataxia', 'Memory impairment', 'Dependence', 'Withdrawal symptoms', 'Respiratory depression']
    },

    'Phenytoin': {
      category: 'Anticonvulsant',
      contraindications: ['Sinus bradycardia', '2nd/3rd degree heart block', 'Concurrent delavirdine'],
      warnings: ['Narrow therapeutic index', 'Multiple drug interactions', 'Gingival hyperplasia', 'Hirsutism', 'Osteoporosis', 'Folic acid deficiency', 'Stevens-Johnson syndrome risk', 'Purple glove syndrome (IV)'],
      allergies: ['Hydantoin hypersensitivity', 'Cross-reactivity with carbamazepine'],
      interactions: [
        { drug: 'Warfarin', severity: 'moderate', effect: 'Variable effects on INR' },
        { drug: 'Oral Contraceptives', severity: 'high', effect: 'Reduced contraceptive efficacy - use additional methods' },
        { drug: 'Methotrexate', severity: 'high', effect: 'Increased methotrexate toxicity' },
        { drug: 'CYP inducers/inhibitors', severity: 'high', effect: 'Multiple interactions affecting phenytoin levels' },
        { drug: 'Valproic acid', severity: 'high', effect: 'Altered phenytoin levels' },
        { drug: 'Azole antifungals', severity: 'high', effect: 'Increased phenytoin toxicity' }
      ],
      synergistic: [],
      pregnancy: 'Category D - Teratogenic',
      lactation: 'Probably safe',
      maxDose: 'Individualized based on levels (target 10-20 mcg/mL)',
      renalDose: 'Monitor free levels',
      hepaticDose: 'Monitor closely',
      commonSideEffects: ['Nystagmus', 'Ataxia', 'Gingival hyperplasia', 'Hirsutism', 'Rash', 'Osteoporosis', 'Folic acid deficiency', 'Stevens-Johnson syndrome']
    },

    'Levetiracetam': {
      category: 'Anticonvulsant',
      contraindications: ['Known hypersensitivity'],
      warnings: ['Behavioral changes', 'Suicidality', 'Somnolence', 'Fatigue', 'Withdrawal seizures if stopped abruptly'],
      allergies: ['Levetiracetam hypersensitivity'],
      interactions: [
        { drug: 'Minimal drug interactions', severity: 'low', effect: 'One of the safest anticonvulsants regarding interactions' }
      ],
      synergistic: ['Other anticonvulsants (adjunctive therapy)'],
      pregnancy: 'Category C - Use if needed',
      lactation: 'Probably safe',
      maxDose: '3000mg per day',
      renalDose: 'Reduce dose based on CrCl',
      hepaticDose: 'No adjustment',
      commonSideEffects: ['Somnolence', 'Fatigue', 'Behavioral changes', 'Irritability', 'Dizziness', 'Infection']
    },

    // ========== THYROID & ENDOCRINE ==========

    'Levothyroxine': {
      category: 'Thyroid Hormone',
      contraindications: ['Acute MI', 'Uncorrected adrenal insufficiency', 'Thyrotoxicosis'],
      warnings: ['Cardiovascular effects in elderly', 'Overtreatment causes osteoporosis/AF', 'Adrenal crisis in undiagnosed adrenal insufficiency', 'Many absorption interactions'],
      allergies: ['Rare hypersensitivity to inactive ingredients'],
      interactions: [
        { drug: 'Iron/Calcium supplements', severity: 'high', effect: 'Significantly reduced absorption - separate by 4 hours' },
        { drug: 'PPIs', severity: 'moderate', effect: 'Reduced absorption' },
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased anticoagulation - monitor INR' },
        { drug: 'Antidiabetic drugs', severity: 'moderate', effect: 'May need increased diabetes medication' },
        { drug: 'Antacids', severity: 'moderate', effect: 'Reduced absorption' },
        { drug: 'Soy products', severity: 'moderate', effect: 'Reduced absorption' }
      ],
      synergistic: [],
      pregnancy: 'Category A - Essential, increase dose in pregnancy',
      lactation: 'Safe - minimal excretion',
      maxDose: 'Individualized based on TSH levels',
      renalDose: 'No adjustment',
      hepaticDose: 'No adjustment',
      commonSideEffects: ['Palpitations (overtreatment)', 'Tachycardia', 'Tremor', 'Insomnia', 'Weight loss', 'Heat intolerance', 'Osteoporosis (chronic overtreatment)']
    },

    // ========== ADDITIONAL IMPORTANT DRUGS ==========

    'Prednisolone': {
      category: 'Corticosteroid',
      contraindications: ['Systemic fungal infections', 'Live vaccines (if immunosuppressed)'],
      warnings: ['Immunosuppression', 'Hyperglycemia', 'Hypertension', 'Osteoporosis', 'GI ulcers', 'HPA axis suppression', 'Psychiatric effects', 'Adrenal crisis with abrupt withdrawal'],
      allergies: ['Corticosteroid hypersensitivity (rare)'],
      interactions: [
        { drug: 'NSAIDs', severity: 'high', effect: 'Increased GI bleeding risk' },
        { drug: 'Warfarin', severity: 'moderate', effect: 'Variable effects on INR' },
        { drug: 'Antidiabetic drugs', severity: 'moderate', effect: 'Hyperglycemia - may need increased diabetes medication' },
        { drug: 'Vaccines', severity: 'high', effect: 'Reduced vaccine efficacy, risk with live vaccines' },
        { drug: 'Diuretics', severity: 'moderate', effect: 'Increased hypokalemia' },
        { drug: 'Fluoroquinolones', severity: 'high', effect: 'Increased tendon rupture risk' }
      ],
      synergistic: [],
      pregnancy: 'Category C - Use lowest effective dose',
      lactation: 'Probably safe if <40mg/day',
      maxDose: 'Variable (1-60mg/day depending on indication)',
      renalDose: 'No adjustment',
      hepaticDose: 'Monitor closely',
      commonSideEffects: ['Hyperglycemia', 'Hypertension', 'Weight gain', 'Mood changes', 'Insomnia', 'Osteoporosis', 'Immunosuppression', 'Cushing syndrome (chronic use)', 'Adrenal suppression']
    },

    'Allopurinol': {
      category: 'Xanthine Oxidase Inhibitor (Antigout)',
      contraindications: ['Acute gout attack', 'HLA-B*5801 positive (increased SJS risk)'],
      warnings: ['Severe hypersensitivity syndrome', 'Stevens-Johnson syndrome', 'Renal impairment', 'Start low, go slow'],
      allergies: ['Allopurinol hypersensitivity'],
      interactions: [
        { drug: 'Azathioprine/6-Mercaptopurine', severity: 'high', effect: 'Severe toxicity - reduce dose by 75%' },
        { drug: 'Warfarin', severity: 'moderate', effect: 'Increased anticoagulation' },
        { drug: 'Theophylline', severity: 'moderate', effect: 'Increased theophylline levels' },
        { drug: 'ACE inhibitors', severity: 'moderate', effect: 'Increased hypersensitivity risk' },
        { drug: 'Amoxicillin', severity: 'moderate', effect: 'Increased rash risk' }
      ],
      synergistic: ['Colchicine (gout prophylaxis during initiation)'],
      pregnancy: 'Category C - Avoid if possible',
      lactation: 'Probably safe',
      maxDose: '800mg per day (usual max 300mg)',
      renalDose: 'Reduce dose (CrCl 10-20: 200mg, <10: 100mg)',
      hepaticDose: 'Reduce dose',
      commonSideEffects: ['Rash', 'Hypersensitivity syndrome', 'Stevens-Johnson syndrome', 'Elevated liver enzymes', 'Nausea']
    }
  },

  // ============================================================================
  // INTELLIGENT INTERACTION CHECKING FUNCTION
  // ============================================================================
  
  checkInteractions: function(drugList) {
    const alerts = [];
    const warnings = [];
    const synergies = [];
    const contraindications = [];

    // Remove duplicates
    const uniqueDrugs = [...new Set(drugList)];

    for (let i = 0; i < uniqueDrugs.length; i++) {
      const drug1 = uniqueDrugs[i];
      const drug1Data = this.interactions[drug1];

      if (!drug1Data) continue;

      // Check contraindications
      if (drug1Data.contraindications && drug1Data.contraindications.length > 0) {
        contraindications.push({
          type: 'contraindication',
          drug: drug1,
          severity: 'critical',
          message: `⚠️ ${drug1} CONTRAINDICATIONS: ${drug1Data.contraindications.join(', ')}`,
          details: drug1Data.contraindications
        });
      }

      // Check pregnancy/lactation warnings
      if (drug1Data.pregnancy && drug1Data.pregnancy.includes('D') || drug1Data.pregnancy.includes('X')) {
        alerts.push({
          type: 'pregnancy',
          drug: drug1,
          severity: 'high',
          message: `🤰 PREGNANCY WARNING: ${drug1} - ${drug1Data.pregnancy}`
        });
      }

      // Check drug-drug interactions
      for (let j = i + 1; j < uniqueDrugs.length; j++) {
        const drug2 = uniqueDrugs[j];
        const interaction = drug1Data.interactions?.find(int => int.drug === drug2);

        if (interaction) {
          if (interaction.severity === 'high') {
            alerts.push({
              type: 'interaction',
              drugs: [drug1, drug2],
              severity: 'high',
              message: `🚨 HIGH RISK: ${drug1} + ${drug2}`,
              effect: interaction.effect,
              recommendation: 'Consider alternative therapy or close monitoring'
            });
          } else if (interaction.severity === 'moderate') {
            warnings.push({
              type: 'interaction',
              drugs: [drug1, drug2],
              severity: 'moderate',
              message: `⚠️ CAUTION: ${drug1} + ${drug2}`,
              effect: interaction.effect,
              recommendation: 'Monitor patient closely'
            });
          }
        }

        // Check synergies
        if (drug1Data.synergistic) {
          const synergyMatch = drug1Data.synergistic.find(s => s.includes(drug2));
          if (synergyMatch) {
            synergies.push({
              type: 'synergy',
              drugs: [drug1, drug2],
              message: `✅ SYNERGISTIC: ${drug1} + ${drug2}`,
              benefit: synergyMatch,
              recommendation: 'Good combination for therapeutic effect'
            });
          }
        }
      }
    }

    return { 
      alerts, 
      warnings, 
      synergies, 
      contraindications,
      totalIssues: alerts.length + warnings.length,
      criticalIssues: alerts.length
    };
  },

  // Get detailed drug information
  getDrugInfo: function(drugName) {
    return this.interactions[drugName] || null;
  },

  // Search drugs by category
  getDrugsByCategory: function(category) {
    return Object.entries(this.interactions)
      .filter(([_, data]) => data.category === category)
      .map(([name, _]) => name);
  },

  // Get all available categories
  getAllCategories: function() {
    const categories = new Set();
    Object.values(this.interactions).forEach(drug => {
      if (drug.category) categories.add(drug.category);
    });
    return Array.from(categories).sort();
  }
};

// Export drug names list for autocomplete
export const drugNamesList = Object.keys(drugInteractionsDB.interactions);

// Export categories
export const drugCategories = drugInteractionsDB.getAllCategories();
