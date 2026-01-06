// Indian Hospital Medication Database with Brand Names & Generic Names
export const medicationDictionary = [
  // Analgesics & Antipyretics
  { 
    category: 'Analgesics', 
    name: 'Paracetamol', 
    brandNames: ['Dolo 650', 'Crocin', 'Calpol', 'Metacin', 'Pyrigesic'],
    commonDoses: ['500mg', '650mg', '1g'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['TID', 'QID', 'SOS'] 
  },
  { 
    category: 'Analgesics', 
    name: 'Diclofenac', 
    brandNames: ['Voveran', 'Voltaren', 'Diclomol', 'Diclowin'],
    commonDoses: ['50mg', '75mg', '100mg'], 
    routes: ['Oral', 'IM', 'IV'], 
    frequencies: ['BD', 'TID'] 
  },
  { 
    category: 'Analgesics', 
    name: 'Ibuprofen', 
    brandNames: ['Brufen', 'Advil', 'Ibugesic', 'Combiflam'],
    commonDoses: ['200mg', '400mg', '600mg'], 
    routes: ['Oral'], 
    frequencies: ['TID', 'QID'] 
  },
  { 
    category: 'Analgesics', 
    name: 'Tramadol', 
    brandNames: ['Ultracet', 'Tramazac', 'Tramanyl', 'Tramol'],
    commonDoses: ['50mg', '100mg'], 
    routes: ['Oral', 'IM', 'IV'], 
    frequencies: ['TID', 'QID', 'SOS'] 
  },
  { 
    category: 'Analgesics', 
    name: 'Aceclofenac + Paracetamol', 
    brandNames: ['Zerodol-P', 'Hifenac-P', 'Acenext-P', 'Dolopar'],
    commonDoses: ['100mg + 325mg'], 
    routes: ['Oral'], 
    frequencies: ['BD', 'TID'] 
  },
  
  // Antibiotics
  { 
    category: 'Antibiotics', 
    name: 'Amoxicillin', 
    brandNames: ['Moxikind', 'Novamox', 'Amoxil', 'Zymox'],
    commonDoses: ['250mg', '500mg', '1g'], 
    routes: ['Oral'], 
    frequencies: ['TID', 'BD'] 
  },
  { 
    category: 'Antibiotics', 
    name: 'Amoxicillin + Clavulanic Acid', 
    brandNames: ['Augmentin', 'Clavam', 'Mox-CV', 'Advent'],
    commonDoses: ['625mg', '1g'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['BD', 'TID'] 
  },
  { 
    category: 'Antibiotics', 
    name: 'Azithromycin', 
    brandNames: ['Azithral', 'Azee', 'Zithromax', 'Azax'],
    commonDoses: ['250mg', '500mg'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['OD', 'BD'] 
  },
  { 
    category: 'Antibiotics', 
    name: 'Ciprofloxacin', 
    brandNames: ['Cifran', 'Ciplox', 'Ciprodac', 'Ciplox-TZ'],
    commonDoses: ['250mg', '500mg', '750mg'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['BD'] 
  },
  { 
    category: 'Antibiotics', 
    name: 'Ceftriaxone', 
    brandNames: ['Monocef', 'Taxim', 'Ufoxime', 'Ceftas'],
    commonDoses: ['500mg', '1g', '2g'], 
    routes: ['IM', 'IV'], 
    frequencies: ['OD', 'BD'] 
  },
  { 
    category: 'Antibiotics', 
    name: 'Cefixime', 
    brandNames: ['Taxim-O', 'Cefolac', 'Ceftas', 'Mahacef'],
    commonDoses: ['100mg', '200mg'], 
    routes: ['Oral'], 
    frequencies: ['BD'] 
  },
  { 
    category: 'Antibiotics', 
    name: 'Metronidazole', 
    brandNames: ['Flagyl', 'Metrogyl', 'Metron', 'Aldezol'],
    commonDoses: ['200mg', '400mg', '500mg'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['TID'] 
  },
  { 
    category: 'Antibiotics', 
    name: 'Levofloxacin', 
    brandNames: ['Levoquin', 'Levoflox', 'Tavanic', 'Lquin'],
    commonDoses: ['250mg', '500mg', '750mg'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['OD', 'BD'] 
  },
  
  // Antihypertensives & Cardiovascular
  { 
    category: 'Cardiovascular', 
    name: 'Amlodipine', 
    brandNames: ['Amlong', 'Amlodac', 'Stamlo', 'Amlokind'],
    commonDoses: ['2.5mg', '5mg', '10mg'], 
    routes: ['Oral'], 
    frequencies: ['OD'] 
  },
  { 
    category: 'Cardiovascular', 
    name: 'Atenolol', 
    brandNames: ['Aten', 'Tenormin', 'Ateheal', 'Betacard'],
    commonDoses: ['25mg', '50mg', '100mg'], 
    routes: ['Oral'], 
    frequencies: ['OD', 'BD'] 
  },
  { 
    category: 'Cardiovascular', 
    name: 'Telmisartan', 
    brandNames: ['Telma', 'Telmikind', 'Telsar', 'Telpres'],
    commonDoses: ['20mg', '40mg', '80mg'], 
    routes: ['Oral'], 
    frequencies: ['OD'] 
  },
  { 
    category: 'Cardiovascular', 
    name: 'Enalapril', 
    brandNames: ['Enace', 'Envas', 'Enam', 'Enacard'],
    commonDoses: ['2.5mg', '5mg', '10mg'], 
    routes: ['Oral'], 
    frequencies: ['OD', 'BD'] 
  },
  { 
    category: 'Cardiovascular', 
    name: 'Furosemide', 
    brandNames: ['Lasix', 'Frusemide', 'Frusenex', 'Frulac'],
    commonDoses: ['20mg', '40mg', '80mg'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['OD', 'BD'] 
  },
  { 
    category: 'Cardiovascular', 
    name: 'Metoprolol', 
    brandNames: ['Metolar', 'Betaloc', 'Metpure', 'Metocard'],
    commonDoses: ['25mg', '50mg', '100mg'], 
    routes: ['Oral'], 
    frequencies: ['BD'] 
  },
  { 
    category: 'Cardiovascular', 
    name: 'Atorvastatin', 
    brandNames: ['Atorva', 'Lipitor', 'Tonact', 'Storvas'],
    commonDoses: ['10mg', '20mg', '40mg', '80mg'], 
    routes: ['Oral'], 
    frequencies: ['OD', 'HS'] 
  },
  { 
    category: 'Cardiovascular', 
    name: 'Aspirin', 
    brandNames: ['Ecosprin', 'Disprin', 'Loprin', 'Delisprin'],
    commonDoses: ['75mg', '150mg', '325mg'], 
    routes: ['Oral'], 
    frequencies: ['OD'] 
  },
  
  // Antidiabetics
  { 
    category: 'Antidiabetic', 
    name: 'Metformin', 
    brandNames: ['Glycomet', 'Glucophage', 'Obimet', 'Glyciphage'],
    commonDoses: ['500mg', '850mg', '1g'], 
    routes: ['Oral'], 
    frequencies: ['BD', 'TID'] 
  },
  { 
    category: 'Antidiabetic', 
    name: 'Glimepiride', 
    brandNames: ['Amaryl', 'Glimestar', 'Gemer', 'Glimy'],
    commonDoses: ['1mg', '2mg', '4mg'], 
    routes: ['Oral'], 
    frequencies: ['OD'] 
  },
  { 
    category: 'Antidiabetic', 
    name: 'Glimepiride + Metformin', 
    brandNames: ['Glycomet GP', 'Amaryl M', 'Gemer Forte', 'Glynase MF'],
    commonDoses: ['1mg + 500mg', '2mg + 500mg'], 
    routes: ['Oral'], 
    frequencies: ['BD'] 
  },
  { 
    category: 'Antidiabetic', 
    name: 'Human Insulin (Regular)', 
    brandNames: ['Actrapid', 'Huminsulin R', 'Insuman Rapid', 'Wosulin R'],
    commonDoses: ['4 units', '6 units', '8 units', '10 units'], 
    routes: ['SC'], 
    frequencies: ['TID', 'Before meals'] 
  },
  { 
    category: 'Antidiabetic', 
    name: 'Insulin Glargine', 
    brandNames: ['Lantus', 'Basalog', 'Glaritus', 'Toujeo'],
    commonDoses: ['10 units', '15 units', '20 units'], 
    routes: ['SC'], 
    frequencies: ['OD', 'HS'] 
  },
  
  // Gastrointestinal
  { 
    category: 'Gastrointestinal', 
    name: 'Omeprazole', 
    brandNames: ['Omez', 'Ocid', 'Omezol', 'Omecip'],
    commonDoses: ['20mg', '40mg'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['OD', 'BD'] 
  },
  { 
    category: 'Gastrointestinal', 
    name: 'Pantoprazole', 
    brandNames: ['Pan', 'Pantodac', 'Pantop', 'Pantocid'],
    commonDoses: ['20mg', '40mg'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['OD', 'BD'] 
  },
  { 
    category: 'Gastrointestinal', 
    name: 'Ranitidine', 
    brandNames: ['Aciloc', 'Rantac', 'Zinetac', 'Ranitin'],
    commonDoses: ['150mg', '300mg'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['BD'] 
  },
  { 
    category: 'Gastrointestinal', 
    name: 'Ondansetron', 
    brandNames: ['Emeset', 'Ondem', 'Vomikind', 'Zofran'],
    commonDoses: ['4mg', '8mg'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['BD', 'TID', 'SOS'] 
  },
  { 
    category: 'Gastrointestinal', 
    name: 'Domperidone', 
    brandNames: ['Domstal', 'Vomistop', 'Domcolic', 'Domperi'],
    commonDoses: ['10mg', '20mg'], 
    routes: ['Oral'], 
    frequencies: ['TID'] 
  },
  { 
    category: 'Gastrointestinal', 
    name: 'Rabeprazole', 
    brandNames: ['Rablet', 'Razo', 'Rabicip', 'Happi'],
    commonDoses: ['10mg', '20mg'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['OD', 'BD'] 
  },
  
  // Respiratory
  { 
    category: 'Respiratory', 
    name: 'Salbutamol', 
    brandNames: ['Asthalin', 'Ventolin', 'Salbu', 'Levolin'],
    commonDoses: ['2mg', '4mg', '100mcg/puff'], 
    routes: ['Oral', 'Nebulization', 'Inhaler'], 
    frequencies: ['TID', 'QID', 'SOS'] 
  },
  { 
    category: 'Respiratory', 
    name: 'Budesonide', 
    brandNames: ['Budecort', 'Pulmicort', 'Budamate', 'Foracort'],
    commonDoses: ['200mcg', '400mcg'], 
    routes: ['Inhaler', 'Nebulization'], 
    frequencies: ['BD'] 
  },
  { 
    category: 'Respiratory', 
    name: 'Montelukast', 
    brandNames: ['Montair', 'Montek', 'Airlukast', 'Montelo'],
    commonDoses: ['4mg', '5mg', '10mg'], 
    routes: ['Oral'], 
    frequencies: ['OD', 'HS'] 
  },
  { 
    category: 'Respiratory', 
    name: 'Montelukast + Levocetirizine', 
    brandNames: ['Montair LC', 'Montek LC', 'Lecope M', 'Montina L'],
    commonDoses: ['10mg + 5mg'], 
    routes: ['Oral'], 
    frequencies: ['OD', 'HS'] 
  },
  { 
    category: 'Respiratory', 
    name: 'Cetirizine', 
    brandNames: ['Zyrtec', 'Alerid', 'Cetzine', 'Okacet'],
    commonDoses: ['5mg', '10mg'], 
    routes: ['Oral'], 
    frequencies: ['OD', 'HS'] 
  },
  
  // Anticonvulsants & Neurological
  { 
    category: 'Neurological', 
    name: 'Phenytoin', 
    brandNames: ['Eptoin', 'Dilantin', 'Zentil', 'Fentoin'],
    commonDoses: ['100mg', '300mg'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['BD', 'TID'] 
  },
  { 
    category: 'Neurological', 
    name: 'Levetiracetam', 
    brandNames: ['Levera', 'Keppra', 'Levipil', 'Epitoin'],
    commonDoses: ['250mg', '500mg', '750mg', '1g'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['BD'] 
  },
  { 
    category: 'Neurological', 
    name: 'Gabapentin', 
    brandNames: ['Gabapin', 'Neurontin', 'Gabadoc', 'Gabantin'],
    commonDoses: ['100mg', '300mg', '400mg'], 
    routes: ['Oral'], 
    frequencies: ['TID'] 
  },
  { 
    category: 'Neurological', 
    name: 'Pregabalin', 
    brandNames: ['Pregeb', 'Lyrica', 'Pregalin', 'Pregabid'],
    commonDoses: ['75mg', '150mg', '300mg'], 
    routes: ['Oral'], 
    frequencies: ['BD'] 
  },
  
  // Sedatives/Anxiolytics
  { 
    category: 'Psychiatric', 
    name: 'Alprazolam', 
    brandNames: ['Alprax', 'Zolam', 'Restyl', 'Alzolam'],
    commonDoses: ['0.25mg', '0.5mg', '1mg'], 
    routes: ['Oral'], 
    frequencies: ['BD', 'TID', 'HS'] 
  },
  { 
    category: 'Psychiatric', 
    name: 'Lorazepam', 
    brandNames: ['Ativan', 'Lorazep', 'Lorzem', 'Anzilum'],
    commonDoses: ['1mg', '2mg'], 
    routes: ['Oral', 'IV'], 
    frequencies: ['BD', 'TID', 'SOS'] 
  },
  { 
    category: 'Psychiatric', 
    name: 'Clonazepam', 
    brandNames: ['Clonotril', 'Rivotril', 'Lonazep', 'Klonopin'],
    commonDoses: ['0.5mg', '1mg', '2mg'], 
    routes: ['Oral'], 
    frequencies: ['BD', 'HS'] 
  },
  { 
    category: 'Psychiatric', 
    name: 'Escitalopram', 
    brandNames: ['Nexito', 'Stalopam', 'S-Citadep', 'Escitalent'],
    commonDoses: ['5mg', '10mg', '20mg'], 
    routes: ['Oral'], 
    frequencies: ['OD'] 
  },
  
  // Vitamins & Supplements
  { 
    category: 'Vitamins', 
    name: 'Vitamin B Complex', 
    brandNames: ['Becosules', 'Neurobion', 'Supradyn', 'Polybion'],
    commonDoses: ['1 tablet'], 
    routes: ['Oral'], 
    frequencies: ['OD'] 
  },
  { 
    category: 'Vitamins', 
    name: 'Vitamin D3', 
    brandNames: ['D-Rise', 'Tayo', 'Uprise-D3', 'Calcirol'],
    commonDoses: ['60,000 IU', '1000 IU', '2000 IU'], 
    routes: ['Oral'], 
    frequencies: ['Weekly', 'OD'] 
  },
  { 
    category: 'Vitamins', 
    name: 'Calcium + Vitamin D', 
    brandNames: ['Shelcal', 'Calcimax', 'Supracal', 'Calcivon'],
    commonDoses: ['500mg', '1g'], 
    routes: ['Oral'], 
    frequencies: ['OD', 'BD'] 
  },
  { 
    category: 'Vitamins', 
    name: 'Iron + Folic Acid', 
    brandNames: ['Autrin', 'Fefol', 'Orofer', 'Dexorange'],
    commonDoses: ['100mg + 0.5mg'], 
    routes: ['Oral'], 
    frequencies: ['OD'] 
  },
  { 
    category: 'Vitamins', 
    name: 'Multivitamin', 
    brandNames: ['Revital', 'A to Z', 'HealthVit', 'Supradyn'],
    commonDoses: ['1 tablet'], 
    routes: ['Oral'], 
    frequencies: ['OD'] 
  },
  
  // Emergency Medications
  { 
    category: 'Emergency', 
    name: 'Adrenaline', 
    brandNames: ['Adrenalin', 'Epinephrine', 'EpiPen'],
    commonDoses: ['1mg/ml'], 
    routes: ['IM', 'IV'], 
    frequencies: ['SOS', 'STAT'] 
  },
  { 
    category: 'Emergency', 
    name: 'Atropine', 
    brandNames: ['Atropin', 'Atropine Sulphate'],
    commonDoses: ['0.6mg', '1mg'], 
    routes: ['IV', 'IM'], 
    frequencies: ['SOS', 'STAT'] 
  },
  { 
    category: 'Emergency', 
    name: 'Dexamethasone', 
    brandNames: ['Decadron', 'Dexona', 'Dexa', 'Decdan'],
    commonDoses: ['4mg', '8mg'], 
    routes: ['IV', 'IM', 'Oral'], 
    frequencies: ['BD', 'TID', 'STAT'] 
  },
  { 
    category: 'Emergency', 
    name: 'Hydrocortisone', 
    brandNames: ['Solu-Cortef', 'Hydrocort', 'Efcorlin'],
    commonDoses: ['100mg', '200mg'], 
    routes: ['IV'], 
    frequencies: ['BD', 'TID'] 
  },
];

// Keep frequency options and route options the same...
export const frequencyOptions = [
  { value: 'OD', label: 'OD (Once Daily)', timings: ['09:00'] },
  { value: 'BD', label: 'BD (Twice Daily)', timings: ['09:00', '21:00'] },
  { value: 'TID', label: 'TID (Three Times Daily)', timings: ['09:00', '14:00', '21:00'] },
  { value: 'QID', label: 'QID (Four Times Daily)', timings: ['09:00', '13:00', '17:00', '21:00'] },
  { value: 'HS', label: 'HS (At Bedtime)', timings: ['22:00'] },
  { value: 'SOS', label: 'SOS (If Necessary)', timings: [] },
  { value: 'STAT', label: 'STAT (Immediately)', timings: [] },
  { value: 'Q4H', label: 'Q4H (Every 4 Hours)', timings: ['06:00', '10:00', '14:00', '18:00', '22:00'] },
  { value: 'Q6H', label: 'Q6H (Every 6 Hours)', timings: ['06:00', '12:00', '18:00', '00:00'] },
  { value: 'Q8H', label: 'Q8H (Every 8 Hours)', timings: ['08:00', '16:00', '00:00'] },
  { value: 'Before meals', label: 'Before Meals (AC)', timings: ['08:30', '13:30', '20:30'] },
  { value: 'After meals', label: 'After Meals (PC)', timings: ['09:30', '14:30', '21:30'] },
  { value: 'Weekly', label: 'Once Weekly', timings: [] },
];

export const routeOptions = [
  'Oral',
  'IV (Intravenous)',
  'IM (Intramuscular)',
  'SC (Subcutaneous)',
  'Sublingual',
  'Topical',
  'Inhaler',
  'Nebulization',
  'Rectal',
  'Per Vaginum',
  'Nasal',
  'Eye Drops',
  'Ear Drops',
];
