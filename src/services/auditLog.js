import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ✅ EXPORT the logAuditEvent function
export const logAuditEvent = async (eventData) => {
  try {
    const auditRef = collection(db, 'auditLogs');
    
    const auditEntry = {
      eventType: eventData.eventType, // 'medication_administered', 'patient_updated', 'patient_created', etc.
      performedBy: eventData.performedBy, // User name or ID
      performedByRole: eventData.performedByRole, // 'nurse', 'doctor', 'pharmacist', 'admin'
      targetType: eventData.targetType, // 'patient', 'medication', 'system'
      targetId: eventData.targetId, // Patient HHID, Medication ID, etc.
      targetName: eventData.targetName, // Patient name, drug name, etc.
      action: eventData.action, // Human-readable action description
      details: eventData.details || {}, // Additional data (old values, new values, etc.)
      ipAddress: eventData.ipAddress || 'N/A',
      timestamp: serverTimestamp(),
      status: eventData.status || 'success', // 'success', 'failed', 'warning'
    };

    const docRef = await addDoc(auditRef, auditEntry);
    console.log('✅ Audit log created:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error creating audit log:', error);
    return { success: false, error: error.message };
  }
};

// Optional: Additional helper functions
export const logMedicationAdministration = async (medicationData, nurseName) => {
  return await logAuditEvent({
    eventType: 'medication_administered',
    performedBy: nurseName || 'Unknown Nurse',
    performedByRole: 'nurse',
    targetType: 'medication',
    targetId: medicationData.patientHHID,
    targetName: `${medicationData.drugName} - ${medicationData.patientHHID}`,
    action: `Administered ${medicationData.drugName} (${medicationData.dose}) to patient ${medicationData.patientHHID}`,
    details: {
      drugName: medicationData.drugName,
      dose: medicationData.dose,
      route: medicationData.route,
      patientHHID: medicationData.patientHHID,
    },
    status: 'success',
  });
};
