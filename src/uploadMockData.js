import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import { mockPatients, mockMedications, administrationLogs } from './data/mockData';

export async function uploadMockData() {
  try {
    console.log('🔄 Uploading mock data to Firebase...');

    // Upload Patients
    const patientsRef = collection(db, 'patients');
    for (const patient of mockPatients) {
      await addDoc(patientsRef, patient);
    }
    console.log('✅ Patients uploaded');

    // Upload Medications
    const medsRef = collection(db, 'medications');
    for (const med of mockMedications) {
      await addDoc(medsRef, med);
    }
    console.log('✅ Medications uploaded');

    // Upload Administration Logs
    const logsRef = collection(db, 'administrationLogs');
    for (const log of administrationLogs) {
      await addDoc(logsRef, log);
    }
    console.log('✅ Administration logs uploaded');

    console.log('🎉 All data uploaded successfully!');
  } catch (error) {
    console.error('❌ Error uploading data:', error);
  }
}
