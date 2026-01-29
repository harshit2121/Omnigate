// 💉 IV DILUTION DATABASE - Hospital Antimicrobial Chart
export const dilutionDatabase = {
  drugs: [
    {
      id: 'DIL001',
      genericName: 'ACYCLOVIR',
      brandNames: ['ZOVIRAX', 'ACIVIR', 'UNIVIR'],
      strengths: ['250MG'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '0-350MG',
          step1: '10ml sterile water',
          step2: '50ML',
          diluents: ['D5W', 'NS'],
          duration: '1 hour',
          minVol: '50ML',
          maxVol: '50ML'
        },
        {
          doseRange: '351-700MG',
          step1: '20ml sterile water',
          step2: '100ML',
          diluents: ['D5W', 'NS'],
          duration: '1 hour',
          minVol: '100ML',
          maxVol: '100ML'
        }
      ],
      warning: 'Administer slowly over 1 hour to prevent renal toxicity'
    },
    {
      id: 'DIL002',
      genericName: 'AMIKACIN',
      brandNames: ['MIKACIN', 'AMIREACH'],
      strengths: ['100mg', '250mg', '500mg'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '0-1000MG',
          step1: 'Ready to use',
          step2: '100ML',
          diluents: ['NS', 'D5W'],
          duration: '30-60 min',
          minVol: '100ml',
          maxVol: '100ml'
        }
      ],
      warning: 'Monitor renal function'
    },
    {
      id: 'DIL003',
      genericName: 'GENTAMICIN',
      brandNames: ['GENTICYN'],
      strengths: ['20mg', '60mg', '80mg'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '0-40mg',
          step1: 'Ready',
          step2: '50ml',
          diluents: ['NS', 'D5W'],
          duration: '30 min',
          minVol: '50ml',
          maxVol: '50ml'
        },
        {
          doseRange: '>40mg',
          step1: 'Ready',
          step2: '100ml',
          diluents: ['NS', 'D5W'],
          duration: '30 min',
          minVol: '100ml',
          maxVol: '100ml'
        }
      ],
      warning: 'Aminoglycoside - monitor ototoxicity'
    },
    {
      id: 'DIL004',
      genericName: 'CEFTRIAXONE',
      brandNames: ['MONOCEF', 'SUPRAVA', 'CEFOGLARE'],
      strengths: ['250MG', '500MG', '1GM'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '250MG-1GM',
          step1: '9.6 ML sterile water',
          step2: '50-100ML',
          diluents: ['NS', 'D5W', 'WFI'],
          duration: '30 min (Neonates: 60 min)',
          minVol: '50ML',
          maxVol: '100ML'
        }
      ],
      warning: 'Neonates require 60 minutes infusion'
    },
    {
      id: 'DIL005',
      genericName: 'MEROPENEM',
      brandNames: ['M NEM', 'MEROWIN', 'PENMER'],
      strengths: ['500MG', '1000MG'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '500-1000MG',
          step1: '5ml sterile water per 250mg',
          step2: '50-200ML',
          diluents: ['NS', 'D5W'],
          duration: '15-30 min',
          minVol: '10ml',
          maxVol: '20ml'
        }
      ],
      warning: 'Carbapenem - broad spectrum'
    },
    {
      id: 'DIL006',
      genericName: 'VANCOMYCIN',
      brandNames: ['VANCOCIN', 'VANLID', 'KABIMYCIN'],
      strengths: ['500MG'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '500-1000MG',
          step1: '10 ML sterile water',
          step2: '100 ML',
          diluents: ['D5W', 'NS'],
          duration: '60 min',
          minVol: '100ml',
          maxVol: '250ml'
        }
      ],
      warning: '⚠️ RED MAN SYNDROME RISK - Infuse slowly over 60 min minimum'
    },
    {
      id: 'DIL007',
      genericName: 'PIPERACILLIN',
      brandNames: ['BRODACTUM', 'FUTAZ', 'TAZIRA', 'ZOSYN'],
      strengths: ['4.5GM'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '4.5GM',
          step1: '20 ML water for injection',
          step2: '50-100ML',
          diluents: ['D5W', 'NS', 'WFI'],
          duration: '20-30 min',
          minVol: '50ml',
          maxVol: '100ml'
        }
      ],
      warning: 'Beta-lactamase inhibitor'
    },
    {
      id: 'DIL008',
      genericName: 'AMPHOTERICIN B',
      brandNames: ['FUNGIZONE', 'AMFOCAN'],
      strengths: ['50MG'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '50MG',
          step1: '10 mL Sterile Water',
          step2: '0.25 mg/ml concentration',
          diluents: ['D5W ONLY'],
          duration: '4-6 hours',
          minVol: '200ml',
          maxVol: '500ml'
        }
      ],
      warning: '🚨 CRITICAL: Test dose required. D5W ONLY - NOT compatible with NS'
    },
    {
      id: 'DIL009',
      genericName: 'CEFOPERAZONE',
      brandNames: ['MAGNEX', 'ZOSTUM'],
      strengths: ['1GM', '2GM', '3GM'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '1GM',
          step1: '3.4ML sterile water',
          step2: '20 ML',
          diluents: ['NS', 'D5W', 'WFI'],
          duration: '15-60 min',
          minVol: '20ml',
          maxVol: '100ml'
        },
        {
          doseRange: '2GM',
          step1: '6.7ML sterile water',
          step2: '20 ML',
          diluents: ['NS', 'D5W', 'WFI'],
          duration: '15-60 min',
          minVol: '20ml',
          maxVol: '100ml'
        }
      ],
      warning: 'For infusion only'
    },
    {
      id: 'DIL010',
      genericName: 'TIGECYCLINE',
      brandNames: ['TYGACIL', 'TYGARAY', 'TIGEPLUG'],
      strengths: ['50MG'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '50MG',
          step1: '5.3ML diluent',
          step2: 'Withdraw 5ML, add to 100ML IV bag',
          diluents: ['Lactated Ringer', 'NS', 'D5W'],
          duration: '30-60 min',
          minVol: '100ml',
          maxVol: '100ml'
        }
      ],
      warning: 'Last-line antibiotic for resistant organisms'
    },
    {
      id: 'DIL011',
      genericName: 'CEFEPIME',
      brandNames: ['CELRIM', 'NOVAPIME', 'EPIME'],
      strengths: ['500MG', '1000MG', '2000MG'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '0-2000mg',
          step1: '500mg-5ml, 1gm-10ml, 2gm-10ml',
          step2: '50ML',
          diluents: ['D5W', 'NS'],
          duration: '30 minutes',
          minVol: '50ml',
          maxVol: '50ml'
        }
      ],
      warning: '4th generation cephalosporin'
    },
    {
      id: 'DIL012',
      genericName: 'IMIPENEM',
      brandNames: ['ZIENAM', 'IMILAN'],
      strengths: ['500MG'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '250-500MG',
          step1: '10 ML diluent in vial, shake well',
          step2: 'Transfer to 100ML infusion',
          diluents: ['NS', 'D5W', '10% Dextrose'],
          duration: '≤500MG: 20-30min, >500MG: 40-60min',
          minVol: '100ml',
          maxVol: '250ml'
        }
      ],
      warning: 'Carbapenem with cilastatin'
    },
    {
      id: 'DIL013',
      genericName: 'AZITHROMYCIN',
      brandNames: ['AZEE', 'AZITHRAL'],
      strengths: ['500mg'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '500MG',
          step1: '5 ML sterile water',
          step2: 'Transfer to 250-500ML',
          diluents: ['D5W', 'NS', '0.45 NaCl', 'Lactated Ringer'],
          duration: 'NOT less than 60 min',
          minVol: '250ml',
          maxVol: '500ml'
        }
      ],
      warning: 'Minimum 60 minutes infusion time'
    },
    {
      id: 'DIL014',
      genericName: 'COLISTIMETHATE',
      brandNames: ['XYLISTIN', 'COLY-MONAS', 'PROMISTIN'],
      strengths: ['1MIU', '2MIU', '3MIU', '4.5MIU'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: 'All doses',
          step1: '10-50ML NS',
          step2: 'Dilute with NS',
          diluents: ['D5W', 'NS'],
          duration: '30-60 min',
          minVol: '50ml',
          maxVol: '100ml'
        }
      ],
      warning: 'Polymyxin antibiotic - last resort'
    },
    {
      id: 'DIL015',
      genericName: 'TEICOPLANIN',
      brandNames: ['TARGOCID', 'T-PLANIN', 'TICORAY'],
      strengths: ['200MG', '400MG'],
      hasDilution: true,
      dilutionSteps: [
        {
          doseRange: '200-400MG',
          step1: 'Add entire water ampoule slowly',
          step2: 'Can inject directly or dilute',
          diluents: ['NS', 'Compound Sodium Lactate', 'D5W'],
          duration: 'IV rapid: 3-5 min, IV infusion: 30 min',
          minVol: '50ml',
          maxVol: '100ml'
        }
      ],
      warning: 'Glycopeptide antibiotic'
    }
    // Add remaining 45+ drugs from Excel...
  ],

  searchDrug(query) {
    if (!query || query.length < 2) return [];
    const lower = query.toLowerCase();
    return this.drugs.filter(d =>
      d.genericName.toLowerCase().includes(lower) ||
      d.brandNames.some(b => b.toLowerCase().includes(lower))
    );
  },

  getDilutionInfo(drugName) {
    return this.drugs.find(d =>
      d.genericName.toLowerCase() === drugName.toLowerCase() ||
      d.brandNames.some(b => b.toLowerCase() === drugName.toLowerCase())
    );
  },

  requiresDilution(drugName) {
    const drug = this.getDilutionInfo(drugName);
    return drug?.hasDilution || false;
  }
};

export default dilutionDatabase;
