// Common Laboratory Test Templates for Indian Hospitals
export const labTestTemplates = [
  {
    id: 'cbc',
    name: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    parameters: [
      { name: 'Hemoglobin (Hb)', unit: 'g/dL', range: { min: 12, max: 16 }, maleRange: { min: 13.5, max: 17.5 }, femaleRange: { min: 12, max: 15.5 } },
      { name: 'Total WBC Count', unit: '×10³/μL', range: { min: 4, max: 11 } },
      { name: 'RBC Count', unit: '×10⁶/μL', range: { min: 4.5, max: 5.5 } },
      { name: 'Platelet Count', unit: '×10³/μL', range: { min: 150, max: 400 } },
      { name: 'Hematocrit (PCV)', unit: '%', range: { min: 36, max: 46 } },
      { name: 'MCV', unit: 'fL', range: { min: 80, max: 96 } },
      { name: 'MCH', unit: 'pg', range: { min: 27, max: 32 } },
      { name: 'MCHC', unit: 'g/dL', range: { min: 32, max: 36 } },
      { name: 'Neutrophils', unit: '%', range: { min: 40, max: 75 } },
      { name: 'Lymphocytes', unit: '%', range: { min: 20, max: 45 } },
      { name: 'Monocytes', unit: '%', range: { min: 2, max: 10 } },
      { name: 'Eosinophils', unit: '%', range: { min: 1, max: 6 } },
      { name: 'Basophils', unit: '%', range: { min: 0, max: 2 } },
    ]
  },
  {
    id: 'lft',
    name: 'Liver Function Test (LFT)',
    category: 'Biochemistry',
    parameters: [
      { name: 'Bilirubin Total', unit: 'mg/dL', range: { min: 0.3, max: 1.2 } },
      { name: 'Bilirubin Direct', unit: 'mg/dL', range: { min: 0, max: 0.3 } },
      { name: 'Bilirubin Indirect', unit: 'mg/dL', range: { min: 0.2, max: 0.9 } },
      { name: 'SGOT (AST)', unit: 'U/L', range: { min: 5, max: 40 } },
      { name: 'SGPT (ALT)', unit: 'U/L', range: { min: 5, max: 41 } },
      { name: 'Alkaline Phosphatase', unit: 'U/L', range: { min: 30, max: 120 } },
      { name: 'Total Protein', unit: 'g/dL', range: { min: 6, max: 8 } },
      { name: 'Albumin', unit: 'g/dL', range: { min: 3.5, max: 5.5 } },
      { name: 'Globulin', unit: 'g/dL', range: { min: 2, max: 3.5 } },
      { name: 'A/G Ratio', unit: '', range: { min: 1, max: 2 } },
      { name: 'GGT', unit: 'U/L', range: { min: 6, max: 50 } },
    ]
  },
  {
    id: 'rft',
    name: 'Renal Function Test (RFT/KFT)',
    category: 'Biochemistry',
    parameters: [
      { name: 'Blood Urea', unit: 'mg/dL', range: { min: 15, max: 40 } },
      { name: 'Serum Creatinine', unit: 'mg/dL', range: { min: 0.6, max: 1.2 } },
      { name: 'Uric Acid', unit: 'mg/dL', range: { min: 3.5, max: 7.2 } },
      { name: 'Sodium (Na+)', unit: 'mEq/L', range: { min: 135, max: 145 } },
      { name: 'Potassium (K+)', unit: 'mEq/L', range: { min: 3.5, max: 5 } },
      { name: 'Chloride (Cl-)', unit: 'mEq/L', range: { min: 98, max: 107 } },
      { name: 'Bicarbonate', unit: 'mEq/L', range: { min: 22, max: 29 } },
      { name: 'eGFR', unit: 'mL/min/1.73m²', range: { min: 90, max: 120 } },
    ]
  },
  {
    id: 'lipid',
    name: 'Lipid Profile',
    category: 'Biochemistry',
    parameters: [
      { name: 'Total Cholesterol', unit: 'mg/dL', range: { min: 0, max: 200 }, desirable: '< 200' },
      { name: 'Triglycerides', unit: 'mg/dL', range: { min: 0, max: 150 }, desirable: '< 150' },
      { name: 'HDL Cholesterol', unit: 'mg/dL', range: { min: 40, max: 60 }, desirable: '> 40' },
      { name: 'LDL Cholesterol', unit: 'mg/dL', range: { min: 0, max: 100 }, desirable: '< 100' },
      { name: 'VLDL Cholesterol', unit: 'mg/dL', range: { min: 5, max: 40 } },
      { name: 'Total Chol/HDL Ratio', unit: '', range: { min: 0, max: 5 } },
      { name: 'LDL/HDL Ratio', unit: '', range: { min: 0, max: 3 } },
      { name: 'Non-HDL Cholesterol', unit: 'mg/dL', range: { min: 0, max: 130 } },
    ]
  },
  {
    id: 'thyroid',
    name: 'Thyroid Function Test (TFT)',
    category: 'Endocrinology',
    parameters: [
      { name: 'T3 (Triiodothyronine)', unit: 'ng/dL', range: { min: 80, max: 200 } },
      { name: 'T4 (Thyroxine)', unit: 'μg/dL', range: { min: 5, max: 12 } },
      { name: 'TSH', unit: 'μIU/mL', range: { min: 0.4, max: 4.5 } },
      { name: 'Free T3', unit: 'pg/mL', range: { min: 2, max: 4.4 } },
      { name: 'Free T4', unit: 'ng/dL', range: { min: 0.8, max: 1.8 } },
    ]
  },
  {
    id: 'blood-sugar',
    name: 'Blood Sugar Tests',
    category: 'Biochemistry',
    parameters: [
      { name: 'Fasting Blood Sugar (FBS)', unit: 'mg/dL', range: { min: 70, max: 100 } },
      { name: 'Post Prandial Blood Sugar (PPBS)', unit: 'mg/dL', range: { min: 70, max: 140 } },
      { name: 'Random Blood Sugar (RBS)', unit: 'mg/dL', range: { min: 70, max: 140 } },
      { name: 'HbA1c', unit: '%', range: { min: 4, max: 5.6 } },
    ]
  },
  {
    id: 'electrolytes',
    name: 'Serum Electrolytes',
    category: 'Biochemistry',
    parameters: [
      { name: 'Sodium (Na+)', unit: 'mEq/L', range: { min: 135, max: 145 } },
      { name: 'Potassium (K+)', unit: 'mEq/L', range: { min: 3.5, max: 5 } },
      { name: 'Chloride (Cl-)', unit: 'mEq/L', range: { min: 98, max: 107 } },
      { name: 'Calcium', unit: 'mg/dL', range: { min: 8.5, max: 10.5 } },
      { name: 'Magnesium', unit: 'mg/dL', range: { min: 1.7, max: 2.2 } },
      { name: 'Phosphorus', unit: 'mg/dL', range: { min: 2.5, max: 4.5 } },
    ]
  },
  {
    id: 'cardiac',
    name: 'Cardiac Markers',
    category: 'Biochemistry',
    parameters: [
      { name: 'Troponin I', unit: 'ng/mL', range: { min: 0, max: 0.04 } },
      { name: 'Troponin T', unit: 'ng/mL', range: { min: 0, max: 0.01 } },
      { name: 'CK-MB', unit: 'ng/mL', range: { min: 0, max: 5 } },
      { name: 'CPK (Total)', unit: 'U/L', range: { min: 30, max: 200 } },
      { name: 'LDH', unit: 'U/L', range: { min: 140, max: 280 } },
      { name: 'Myoglobin', unit: 'ng/mL', range: { min: 0, max: 110 } },
    ]
  },
  {
    id: 'coagulation',
    name: 'Coagulation Profile',
    category: 'Hematology',
    parameters: [
      { name: 'PT (Prothrombin Time)', unit: 'seconds', range: { min: 11, max: 13.5 } },
      { name: 'INR', unit: '', range: { min: 0.8, max: 1.2 } },
      { name: 'APTT', unit: 'seconds', range: { min: 25, max: 35 } },
      { name: 'Bleeding Time', unit: 'minutes', range: { min: 1, max: 5 } },
      { name: 'Clotting Time', unit: 'minutes', range: { min: 5, max: 10 } },
    ]
  },
  {
    id: 'urine-routine',
    name: 'Urine Routine Examination',
    category: 'Clinical Pathology',
    parameters: [
      { name: 'Color', unit: '', range: { min: 'Pale Yellow', max: 'Amber' } },
      { name: 'Appearance', unit: '', range: { min: 'Clear', max: 'Clear' } },
      { name: 'Specific Gravity', unit: '', range: { min: 1.005, max: 1.030 } },
      { name: 'pH', unit: '', range: { min: 4.5, max: 8 } },
      { name: 'Protein', unit: '', range: { min: 'Nil', max: 'Nil' } },
      { name: 'Glucose', unit: '', range: { min: 'Nil', max: 'Nil' } },
      { name: 'Ketones', unit: '', range: { min: 'Negative', max: 'Negative' } },
      { name: 'Blood', unit: '', range: { min: 'Nil', max: 'Nil' } },
      { name: 'Pus Cells', unit: '/HPF', range: { min: 0, max: 5 } },
      { name: 'RBC', unit: '/HPF', range: { min: 0, max: 2 } },
      { name: 'Epithelial Cells', unit: '/HPF', range: { min: 'Few', max: 'Few' } },
      { name: 'Bacteria', unit: '', range: { min: 'Absent', max: 'Absent' } },
    ]
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D (25-OH)',
    category: 'Endocrinology',
    parameters: [
      { name: 'Vitamin D Total', unit: 'ng/mL', range: { min: 30, max: 100 }, interpretation: 'Deficient: <20, Insufficient: 20-30, Sufficient: 30-100' },
    ]
  },
  {
    id: 'iron-studies',
    name: 'Iron Studies',
    category: 'Hematology',
    parameters: [
      { name: 'Serum Iron', unit: 'μg/dL', range: { min: 60, max: 170 } },
      { name: 'TIBC', unit: 'μg/dL', range: { min: 250, max: 450 } },
      { name: 'Transferrin Saturation', unit: '%', range: { min: 20, max: 50 } },
      { name: 'Serum Ferritin', unit: 'ng/mL', range: { min: 30, max: 400 } },
    ]
  },
];

// Group tests by category
export const labTestCategories = [
  { name: 'All Tests', value: 'all' },
  { name: 'Hematology', value: 'Hematology' },
  { name: 'Biochemistry', value: 'Biochemistry' },
  { name: 'Endocrinology', value: 'Endocrinology' },
  { name: 'Clinical Pathology', value: 'Clinical Pathology' },
];
