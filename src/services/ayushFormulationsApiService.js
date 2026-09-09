/**
 * Ayurvedic Formulations Dataset Service
 * Imported Comprehensive Pharmacopoeial Dataset (API, CCRAS, Charaka, Sharangadhara, Bhaishajya Ratnavali)
 * Fast Dataset Querying, Indication Filtering, and Prescribing Selector
 */

import { AYUSH_FORMULATIONS_DATASET, MODERN_MEDICATIONS_DATASET } from '../data/ayushFormulationsDataset';
import { AYURGENIX_DATASET } from '../data/ayurGenixDataset';
import { INDIAN_MEDICINES_DATASET } from '../data/indianMedicinesDataset';

export const AYUSH_FORMULATIONS_DATA = AYUSH_FORMULATIONS_DATASET;
export const MODERN_MEDICATIONS_DATA = MODERN_MEDICATIONS_DATASET;

// Standard Clinical Protocols & Order Sets
export const CLINICAL_ORDER_SETS = [
  {
    id: 'amlapitta_protocol',
    title: 'Amlapitta (Acid Peptic / GERD) Protocol',
    titleHi: 'अम्लपित्त शामक चिकित्सा प्रोटोकॉल',
    category: 'Gastroenterology / Annavaha',
    doshaFocus: 'Pitta Shamana & Anulomana',
    medications: [
      { name: 'Sutshekhar Ras (Gold / Plain)', type: 'Rasaushadhi / Vati', system: 'ayurvedic', dose: '250mg', frequency: 'BD (Twice Daily)', kaala: 'Pragbhakta (Before Meals)', anupana: 'Godugdha (Warm Cow Milk)', duration: '15 Days' },
      { name: 'Avipattikar Churna', type: 'Churna', system: 'ayurvedic', dose: '5g', frequency: 'HS (Bedtime)', kaala: 'Nishikala (Night)', anupana: 'Lukewarm Water', duration: '15 Days' },
      { name: 'Kamadudha Rasa (Moti Yukta)', type: 'Rasaushadhi / Pishti', system: 'ayurvedic', dose: '250mg', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Amalaki Swarasa / Water', duration: '15 Days' }
    ],
    panchakarma: [
      { procedure: 'Mridu Virechana Karma', dravya: 'Triphala Kwath + Eranda Taila', sessions: '3 Days', time: 'Pratah Kala (Early Morning)', notes: 'Empty stomach for Pitta evacuation' }
    ]
  },
  {
    id: 'sandhivata_protocol',
    title: 'Sandhivata (Osteoarthritis / Joint Degeneration) Protocol',
    titleHi: 'संधिवात शूलहर चिकित्सा प्रोटोकॉल',
    category: 'Rheumatology / Asthivaha',
    doshaFocus: 'Vata Shamana & Dhatu Poshana',
    medications: [
      { name: 'Yograj Guggulu', type: 'Guggulu Kalpa', system: 'ayurvedic', dose: '500mg', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Rasnadi Kwath / Warm Water', duration: '30 Days' },
      { name: 'Maharasnadi Kwath / Kashayam', type: 'Kashayam', system: 'ayurvedic', dose: '20ml with 40ml water', frequency: 'BD (Twice Daily)', kaala: 'Pragbhakta (Before Meals)', anupana: 'Warm Water', duration: '30 Days' },
      { name: 'Ashwagandha Extract / Churna (Withania somnifera)', type: 'Single Herb / Rasayana', system: 'ayurvedic', dose: '500mg', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Warm Milk + Ghee', duration: '30 Days' }
    ],
    panchakarma: [
      { procedure: 'Janu Basti / Kati Basti', dravya: 'Mahanarayana Taila + Ksheerabala Taila', sessions: '7 Sessions (45 min each)', time: 'Pratah Kala', notes: 'Maintain pool temperature 38-40°C' },
      { procedure: 'Patra Pinda Sweda', dravya: 'Medicated Herbal Poultice', sessions: '7 Sessions', time: 'Post Basti', notes: 'Relieves joint stiffness' }
    ]
  },
  {
    id: 'prameha_protocol',
    title: 'Prameha / Madhumeha (Metabolic & Diabetes) Protocol',
    titleHi: 'प्रमेह व मधुमेह नियंत्रण प्रोटोकॉल',
    category: 'Endocrinology / Medovaha',
    doshaFocus: 'Kapha-Medohara & Kleda Nashana',
    medications: [
      { name: 'Chandraprabha Vati', type: 'Vati / Rasayana', system: 'ayurvedic', dose: '500mg (2 tabs)', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Gokshuradi Kwath / Warm Water', duration: '30 Days' },
      { name: 'Guduchi / Giloy Ghanvati (Tinospora cordifolia)', type: 'Single Herb / Rasayana', system: 'ayurvedic', dose: '500mg', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Warm Water', duration: '30 Days' },
      { name: 'Metformin Hydrochloride (SR)', type: 'Allopathic Antidiabetic', system: 'allopathic', dose: '500mg', frequency: 'BD (Twice Daily)', kaala: 'With Meals', anupana: 'Water', duration: '30 Days' }
    ],
    panchakarma: [
      { procedure: 'Udvartana (Dry Herbal Powder Scrub)', dravya: 'Triphala + Kolakulathadi Churna', sessions: '7 Sessions (30 min)', time: 'Morning', notes: 'Mobilizes Medas and improves peripheral insulin sensitivity' }
    ]
  },
  {
    id: 'hridroga_protocol',
    title: 'Hridroga & Hypertension (Cardiovascular Care) Protocol',
    titleHi: 'हृद्रोग एवं उच्च रक्तचाप प्रोटोकॉल',
    category: 'Cardiology / Rasavaha',
    doshaFocus: 'Pitta-Vata Shamana & Hridya Balya',
    medications: [
      { name: 'Arjunarishta (Parthadyarishta)', type: 'Asava / Arishta', system: 'ayurvedic', dose: '20ml', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Equal quantity of water', duration: '30 Days' },
      { name: 'Saraswatarishta (Gold / Plain)', type: 'Medhya Rasayana', system: 'ayurvedic', dose: '20ml', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Milk / Water', duration: '30 Days' },
      { name: 'Telmisartan Tablets', type: 'Allopathic Antihypertensive', system: 'allopathic', dose: '40mg', frequency: 'OD (Once Daily)', kaala: 'Morning', anupana: 'Water', duration: '30 Days' }
    ],
    panchakarma: [
      { procedure: 'Hrid Basti (Cardio-protective pool)', dravya: 'Bala-Ashwagandha Taila', sessions: '7 Sessions (30 min)', time: 'Morning', notes: 'Soothing temperature for cardiac rhythm stabilization' },
      { procedure: 'Shirodhara (Gentle forehead oil drip)', dravya: 'Chandanadi / Ksheerabala Taila', sessions: '5 Sessions', time: 'Evening', notes: 'Reduces central sympathetic tone' }
    ]
  }
];

class AyushFormulationsDatasetService {
  constructor() {
    this.formulations = AYUSH_FORMULATIONS_DATASET || [];
    this.modernMeds = MODERN_MEDICATIONS_DATASET || [];
    this.orderSets = CLINICAL_ORDER_SETS || [];
    this.ayurGenix = AYURGENIX_DATASET || [];
    this.indianMedicines = INDIAN_MEDICINES_DATASET || [];
  }

  /**
   * Filter and query the comprehensive dataset
   */
  searchDataset(query = '', filterSystem = 'all', filterKalpana = 'all') {
    const cleanQuery = query.toLowerCase().trim();
    let results = [];

    // 1. Classical Ayurvedic Pharmacopoeia Monographs
    if (filterSystem === 'all' || filterSystem === 'ayurvedic') {
      const ayurMatches = this.formulations.filter(f => {
        const matchesQuery = !cleanQuery || 
          f.name.toLowerCase().includes(cleanQuery) ||
          (f.sanskritName && f.sanskritName.includes(cleanQuery)) ||
          (f.code && f.code.toLowerCase().includes(cleanQuery)) ||
          (f.classicalSource && f.classicalSource.toLowerCase().includes(cleanQuery)) ||
          (f.indications && f.indications.some(ind => ind.toLowerCase().includes(cleanQuery))) ||
          (f.ingredients && f.ingredients.some(ing => ing.toLowerCase().includes(cleanQuery)));
        
        const matchesKalpana = filterKalpana === 'all' || (f.kalpana && f.kalpana.toLowerCase().includes(filterKalpana.toLowerCase()));
        return matchesQuery && matchesKalpana;
      });
      results = [...results, ...ayurMatches];
    }

    // 2. AyurGenix Clinical Disease & Herbal Formulations (446 Protocols)
    if (filterSystem === 'all' || filterSystem === 'ayurgenix' || (filterSystem === 'ayurvedic' && cleanQuery)) {
      const diseaseMatches = this.ayurGenix.filter(d => {
        const diseaseName = (d.Disease || '').toLowerCase();
        const hindiName = (d['Hindi Name'] || '').toLowerCase();
        const herbs = (d['Ayurvedic Herbs'] || '').toLowerCase();
        const form = (d['Formulation'] || '').toLowerCase();
        const remedies = (d['Herbal/Alternative Remedies'] || '').toLowerCase();
        const doshas = (d.Doshas || '').toLowerCase();

        const matchesQuery = !cleanQuery ||
          diseaseName.includes(cleanQuery) ||
          hindiName.includes(cleanQuery) ||
          herbs.includes(cleanQuery) ||
          form.includes(cleanQuery) ||
          remedies.includes(cleanQuery) ||
          doshas.includes(cleanQuery);

        return matchesQuery;
      }).slice(0, cleanQuery ? 50 : (filterSystem === 'ayurgenix' ? 100 : 15)).map(d => ({
        id: `AYURGENIX_${d.id}`,
        name: `${d.Disease} Protocol (${d['Hindi Name'] || ''}) - ${d.Formulation || d['Ayurvedic Herbs']}`,
        sanskritName: d['Hindi Name'] || d.Disease,
        system: 'ayurvedic',
        kalpana: 'AyurGenix Protocol',
        category: `Dosha: ${d.Doshas || 'Tridosha'}`,
        code: `AGX-${d.id}`,
        classicalSource: 'AyurGenix Clinical Knowledgebase',
        ingredients: (d['Ayurvedic Herbs'] ? d['Ayurvedic Herbs'].split(',').map(s => s.trim()) : []),
        indications: [d.Disease, d.Symptoms || 'General Protocol'].filter(Boolean),
        standardDose: d.Formulation || 'As directed by Vaidya',
        defaultAnupana: d['Diet and Lifestyle Recommendations'] || 'Warm Water',
        defaultKaala: 'Pragbhakta / Adhobhakta',
        defaultFrequency: 'BD (Twice Daily)',
        yogaRecommendation: d['Yoga & Physical Therapy'] || '',
        dietRecommendation: d['Diet and Lifestyle Recommendations'] || ''
      }));

      results = [...results, ...diseaseMatches];
    }

    // 3. Modern Indian Commercial Medicines (3,500 Formulations)
    if (filterSystem === 'all' || filterSystem === 'allopathic' || filterSystem === 'indian_medicines') {
      // Core hospital modern meds first
      const modernMatches = this.modernMeds.filter(m => {
        return !cleanQuery ||
          m.name.toLowerCase().includes(cleanQuery) ||
          (m.genericName && m.genericName.toLowerCase().includes(cleanQuery)) ||
          (m.category && m.category.toLowerCase().includes(cleanQuery)) ||
          (m.indications && m.indications.some(ind => ind.toLowerCase().includes(cleanQuery)));
      });
      results = [...results, ...modernMatches];

      // Indian commercial medicines
      const indianMatches = this.indianMedicines.filter(m => {
        const name = (m.name || '').toLowerCase();
        const comp = (m.composition || '').toLowerCase();
        const form = (m.form || '').toLowerCase();
        const mfg = (m.manufacturer || '').toLowerCase();

        return !cleanQuery ||
          name.includes(cleanQuery) ||
          comp.includes(cleanQuery) ||
          form.includes(cleanQuery) ||
          mfg.includes(cleanQuery);
      }).slice(0, cleanQuery ? 40 : (filterSystem === 'allopathic' ? 50 : 10)).map(m => ({
        id: `INDMED_${m.id}`,
        name: m.name,
        genericName: m.composition || m.name,
        system: 'allopathic',
        category: `${m.form || 'Tablet'} • ${m.packSize || ''}`,
        code: `IND-${m.id}`,
        price: m.price ? `₹${m.price}` : '',
        manufacturer: m.manufacturer || 'Indian Pharma',
        indications: [m.composition || 'Clinical Pharmacotherapy'],
        standardDose: m.form?.includes('500') ? '500mg' : '1 Unit',
        defaultFrequency: 'BD (Twice Daily)',
        defaultKaala: 'Post Meals',
        defaultAnupana: 'Oral (Water)'
      }));

      results = [...results, ...indianMatches];
    }

    return {
      status: 'SUCCESS',
      source: 'AYUSH Pharmacopoeia of India, AyurGenix Clinical AI & Indian Medicine Formulary',
      total: results.length,
      items: results
    };
  }

  /**
   * Search async compatibility wrapper
   */
  async searchFormulationsAsync(query = '', filterSystem = 'all', filterKalpana = 'all') {
    return this.searchDataset(query, filterSystem, filterKalpana);
  }

  getFormulationMonograph(id) {
    return this.formulations.find(f => f.id === id) || 
      this.modernMeds.find(m => m.id === id) || 
      null;
  }

  getOrderSets() {
    return this.orderSets;
  }
}

export const ayushFormulationsApi = new AyushFormulationsDatasetService();
export default ayushFormulationsApi;
