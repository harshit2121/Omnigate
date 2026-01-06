import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { logAuditEvent } from './auditLog';

// Add new patient to Firestore
export const addPatient = async (patientData, labTests = []) => {
  try {
    const patientsRef = collection(db, 'patients');
    
    const newPatient = {
      hhid: patientData.hhid || `HH${Date.now().toString().slice(-6)}`,
      name: patientData.name,
      age: parseInt(patientData.age),
      gender: patientData.gender || 'Not specified',
      sex: patientData.gender?.[0]?.toUpperCase() || 'U',
      weight: parseFloat(patientData.weight),
      height: parseFloat(patientData.height) || 0,
      chiefComplaints: patientData.chiefComplaints,
      historyOfIllness: patientData.historyOfIllness || '',
      pastMedicalHistory: patientData.pastMedicalHistory || '',
      allergies: patientData.allergies || '',
      familyHistory: patientData.familyHistory,
      provisionalDiagnosis: patientData.provisionalDiagnosis || '',
      diagnosis: patientData.provisionalDiagnosis || 'Pending',
      labTests: labTests,
      ward: patientData.ward || 'General Ward',
      bed: patientData.bed || 'Pending',
      status: patientData.status || 'stable',
      
      // ✅ NEW FIELDS
      admissionDate: patientData.admissionDate || new Date().toISOString().split('T')[0],
      dischargeDate: patientData.dischargeDate || null,
      isActive: !patientData.dischargeDate, // Auto-calculate if patient is active
      
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(patientsRef, newPatient);
    
    // Log audit event
    await logAuditEvent({
      eventType: 'patient_created',
      performedBy: 'Registration Desk',
      performedByRole: 'admin',
      targetType: 'patient',
      targetId: newPatient.hhid,
      targetName: newPatient.name,
      action: `New patient registered: ${newPatient.name} (${newPatient.hhid})`,
      details: {
        age: newPatient.age,
        gender: newPatient.gender,
        ward: newPatient.ward,
        admissionDate: newPatient.admissionDate,
        status: newPatient.status,
      },
      status: 'success',
    });

    console.log('✅ Patient added:', docRef.id);
    return { success: true, id: docRef.id, hhid: newPatient.hhid };
  } catch (error) {
    console.error('❌ Error adding patient:', error);
    return { success: false, error: error.message };
  }
};

// Update existing patient
export const updatePatient = async (patientId, patientData, labTests = [], performedBy = 'System') => {
  try {
    const patientRef = doc(db, 'patients', patientId);
    
    const updatedData = {
      name: patientData.name,
      age: parseInt(patientData.age),
      gender: patientData.gender,
      sex: patientData.gender?.[0]?.toUpperCase() || 'U',
      weight: parseFloat(patientData.weight),
      height: parseFloat(patientData.height) || 0,
      ward: patientData.ward,
      bed: patientData.bed,
      status: patientData.status,
      diagnosis: patientData.diagnosis,
      provisionalDiagnosis: patientData.provisionalDiagnosis || '',
      allergies: patientData.allergies || '',
      chiefComplaints: patientData.chiefComplaints || '',
      historyOfIllness: patientData.historyOfIllness || '',
      pastMedicalHistory: patientData.pastMedicalHistory || '',
      familyHistory: patientData.familyHistory || '',
      labTests: labTests,
      
      // ✅ ALLOW UPDATING DISCHARGE DATE
      dischargeDate: patientData.dischargeDate || null,
      isActive: !patientData.dischargeDate, // Update active status
      
      updatedAt: serverTimestamp(),
    };

    await updateDoc(patientRef, updatedData);
    
    // Log audit event
    await logAuditEvent({
      eventType: 'patient_updated',
      performedBy: performedBy,
      performedByRole: 'admin',
      targetType: 'patient',
      targetId: patientData.hhid || 'Unknown',
      targetName: patientData.name,
      action: `Patient record updated: ${patientData.name}`,
      details: {
        updatedFields: Object.keys(updatedData),
        newStatus: patientData.status,
        dischargeDate: patientData.dischargeDate,
      },
      status: 'success',
    });

    console.log('✅ Patient updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating patient:', error);
    
    await logAuditEvent({
      eventType: 'patient_update_failed',
      performedBy: performedBy,
      performedByRole: 'admin',
      targetType: 'patient',
      targetId: patientData.hhid || 'Unknown',
      targetName: patientData.name,
      action: `Failed to update patient: ${patientData.name}`,
      details: { error: error.message },
      status: 'failed',
    });
    
    return { success: false, error: error.message };
  }
};
