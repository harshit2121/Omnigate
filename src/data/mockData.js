export const mockPatients = [
  {
    hhid: 'HH001',
    name: 'Rajesh Kumar',
    age: 45,
    sex: 'M',
    weight: 72,
    height: 175,
    ward: 'General Medicine',
    bed: '12A',
    diagnosis: 'Type 2 Diabetes, Hypertension',
    provisionalDiagnosis: 'Controlled with medication',
    status: 'critical',
    admissionDate: '2026-12-28'
  },
  {
    hhid: 'HH002',
    name: 'Priya Sharma',
    age: 32,
    sex: 'F',
    weight: 58,
    height: 162,
    ward: 'Cardiology',
    bed: '5B',
    diagnosis: 'Angina Pectoris',
    provisionalDiagnosis: 'Under observation',
    status: 'stable',
    admissionDate: '2025-12-30'
  },
  {
    hhid: 'HH003',
    name: 'Amit Patel',
    age: 56,
    sex: 'M',
    weight: 85,
    height: 180,
    ward: 'General Medicine',
    bed: '8C',
    diagnosis: 'Pneumonia',
    provisionalDiagnosis: 'Improving',
    status: 'stable',
    admissionDate: '2025-12-29'
  },
  {
    hhid: 'HH004',
    name: 'Sneha Reddy',
    age: 28,
    sex: 'F',
    weight: 62,
    height: 165,
    ward: 'Orthopedics',
    bed: '3A',
    diagnosis: 'Fracture - Right Femur',
    provisionalDiagnosis: 'Post-operative care',
    status: 'stable',
    admissionDate: '2026-12-27'
  },
  {
    hhid: 'HH005',
    name: 'Mohammed Ali',
    age: 67,
    sex: 'M',
    weight: 70,
    height: 168,
    ward: 'ICU',
    bed: '1',
    diagnosis: 'Acute Myocardial Infarction',
    provisionalDiagnosis: 'Critical - Under intensive care',
    status: 'critical',
    admissionDate: '2026-01-01'
  }
];

export const mockMedications = [
  {
    id: 'MED001',
    patientHHID: 'HH001',
    drugName: 'Metformin',
    dose: '500mg',
    frequency: 'Twice daily',
    route: 'Oral',
    startDate: '2026-12-28',
    timing: ['08:00', '20:00'],
    rackId: 'A12',
    status: 'active',
    lastAdministered: '2026-01-01T08:00:00',
    nextDue: '2026-01-01T20:00:00',
    instructions: 'Take with food'
  },
  {
    id: 'MED002',
    patientHHID: 'HH001',
    drugName: 'Amlodipine',
    dose: '5mg',
    frequency: 'Once daily',
    route: 'Oral',
    startDate: '2026-12-28',
    timing: ['09:00'],
    rackId: 'A15',
    status: 'active',
    lastAdministered: '2026-01-01T09:00:00',
    nextDue: '2026-01-02T09:00:00',
    instructions: 'Morning dose'
  },
  {
    id: 'MED003',
    patientHHID: 'HH002',
    drugName: 'Aspirin',
    dose: '75mg',
    frequency: 'Once daily',
    route: 'Oral',
    startDate: '2025-12-30',
    timing: ['08:00'],
    rackId: 'B03',
    status: 'active',
    lastAdministered: '2026-01-01T08:00:00',
    nextDue: '2026-01-02T08:00:00',
    instructions: 'After breakfast'
  },
  {
    id: 'MED004',
    patientHHID: 'HH003',
    drugName: 'Amoxicillin',
    dose: '500mg',
    frequency: 'Three times daily',
    route: 'Oral',
    startDate: '2025-12-29',
    timing: ['08:00', '14:00', '20:00'],
    rackId: 'C07',
    status: 'active',
    lastAdministered: '2026-01-01T08:00:00',
    nextDue: '2026-01-01T14:00:00',
    instructions: 'Complete full course'
  },
  {
    id: 'MED005',
    patientHHID: 'HH005',
    drugName: 'Nitroglycerin',
    dose: '0.4mg',
    frequency: 'As needed',
    route: 'Sublingual',
    startDate: '2026-01-01',
    timing: ['PRN'],
    rackId: 'ICU-02',
    status: 'active',
    lastAdministered: '2026-01-01T10:30:00',
    nextDue: 'PRN',
    instructions: 'Emergency use only'
  }
];

export const mockNurseData = [
  {
    nurseId: 'N001',
    name: 'Sister Anita',
    shift: 'Morning',
    authorized: true
  },
  {
    nurseId: 'N002',
    name: 'Nurse Rahul',
    shift: 'Evening',
    authorized: true
  }
];

export const administrationLogs = [
  {
    id: 'LOG001',
    patientHHID: 'HH001',
    medId: 'MED001',
    nurseId: 'N001',
    nurseName: 'Sister Anita',
    timestamp: '2026-01-01T08:00:00',
    status: 'administered',
    rackId: 'A12'
  },
  {
    id: 'LOG002',
    patientHHID: 'HH002',
    medId: 'MED003',
    nurseId: 'N001',
    nurseName: 'Sister Anita',
    timestamp: '2026-01-01T08:05:00',
    status: 'administered',
    rackId: 'B03'
  }
];
