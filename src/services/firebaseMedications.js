import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, arrayUnion, query, where, getDocs } from 'firebase/firestore';
import { logAuditEvent } from './auditLog';

// ========================================
// ADD NEW MEDICATION PRESCRIPTION
// ========================================
export const addMedication = async (medicationData) => {
  try {
    const medicationsRef = collection(db, 'medications');
    
    const newMedication = {
      patientHHID: medicationData.patientHHID,
      patientName: medicationData.patientName,
      drugName: medicationData.drugName,
      dose: medicationData.dose,
      route: medicationData.route,
      frequency: medicationData.frequency,
      timing: medicationData.timing || [],
      instructions: medicationData.instructions || '',
      duration: medicationData.duration || '',
      status: medicationData.status || 'active',
      rackId: medicationData.rackId || 'Not assigned',
      prescribedBy: medicationData.prescribedBy || 'Doctor',
      administrationLogs: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(medicationsRef, newMedication);

    // ✅ Log audit event
    await logAuditEvent({
      eventType: 'medication_prescribed',
      performedBy: medicationData.prescribedBy || 'Pharmacist',
      performedByRole: 'pharmacist',
      targetType: 'medication',
      targetId: medicationData.patientHHID,
      targetName: `${medicationData.drugName} for ${medicationData.patientName}`,
      action: `Prescribed ${medicationData.drugName} (${medicationData.dose}) to ${medicationData.patientName}`,
      details: {
        drugName: medicationData.drugName,
        dose: medicationData.dose,
        route: medicationData.route,
        frequency: medicationData.frequency,
        duration: medicationData.duration,
      },
      status: 'success',
    });

    console.log('✅ Medication prescribed successfully:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error prescribing medication:', error);
    
    // ✅ Log failed event
    await logAuditEvent({
      eventType: 'medication_prescription_failed',
      performedBy: medicationData.prescribedBy || 'Pharmacist',
      performedByRole: 'pharmacist',
      targetType: 'medication',
      targetId: medicationData.patientHHID || 'Unknown',
      targetName: medicationData.drugName || 'Unknown Drug',
      action: `Failed to prescribe medication`,
      details: { error: error.message },
      status: 'failed',
    });
    
    return { success: false, error: error.message };
  }
};

// ========================================
// UPDATE EXISTING MEDICATION
// ========================================
export const updateMedication = async (medicationId, updatedData) => {
  try {
    const medicationRef = doc(db, 'medications', medicationId);
    
    const updatePayload = {
      ...updatedData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(medicationRef, updatePayload);

    // ✅ Log audit event
    await logAuditEvent({
      eventType: 'medication_updated',
      performedBy: updatedData.updatedBy || 'Pharmacist',
      performedByRole: 'pharmacist',
      targetType: 'medication',
      targetId: updatedData.patientHHID || medicationId,
      targetName: updatedData.drugName || 'Medication',
      action: `Updated medication details`,
      details: updatedData,
      status: 'success',
    });

    console.log('✅ Medication updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating medication:', error);
    return { success: false, error: error.message };
  }
};

// ========================================
// DELETE/DISCONTINUE MEDICATION
// ========================================
export const discontinueMedication = async (medicationId, reason, discontinuedBy) => {
  try {
    const medicationRef = doc(db, 'medications', medicationId);
    
    await updateDoc(medicationRef, {
      status: 'discontinued',
      discontinuedAt: serverTimestamp(),
      discontinuedBy: discontinuedBy,
      discontinuationReason: reason,
      updatedAt: serverTimestamp(),
    });

    // ✅ Log audit event
    await logAuditEvent({
      eventType: 'medication_discontinued',
      performedBy: discontinuedBy,
      performedByRole: 'doctor',
      targetType: 'medication',
      targetId: medicationId,
      targetName: 'Medication',
      action: `Discontinued medication - Reason: ${reason}`,
      details: { reason, medicationId },
      status: 'success',
    });

    console.log('✅ Medication discontinued successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error discontinuing medication:', error);
    return { success: false, error: error.message };
  }
};

// ========================================
// PERMANENTLY DELETE MEDICATION
// ========================================
export const deleteMedication = async (medicationId, deletedBy) => {
  try {
    const medicationRef = doc(db, 'medications', medicationId);
    await deleteDoc(medicationRef);

    // ✅ Log audit event
    await logAuditEvent({
      eventType: 'medication_deleted',
      performedBy: deletedBy,
      performedByRole: 'admin',
      targetType: 'medication',
      targetId: medicationId,
      targetName: 'Medication',
      action: `Permanently deleted medication record`,
      details: { medicationId },
      status: 'success',
    });

    console.log('✅ Medication deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting medication:', error);
    return { success: false, error: error.message };
  }
};

// ========================================
// ADD ADMINISTRATION LOG
// ========================================
export const addAdministrationLog = async (logData, medicationId) => {
  try {
    // 1. Add to administrationLogs collection
    const logsRef = collection(db, 'administrationLogs');
    const logEntry = {
      patientHHID: logData.patientHHID,
      medicationId: medicationId,
      drugName: logData.drugName,
      dose: logData.dose,
      route: logData.route,
      nurseName: logData.nurseName,
      scheduledTime: logData.scheduledTime || 'Not specified',
      status: logData.status || 'administered',
      notes: logData.notes || '',
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    const logDocRef = await addDoc(logsRef, logEntry);

    // 2. Update medication document with embedded log
    if (medicationId) {
      const medicationRef = doc(db, 'medications', medicationId);
      await updateDoc(medicationRef, {
        administrationLogs: arrayUnion({
          logId: logDocRef.id,
          patientHHID: logData.patientHHID,
          drugName: logData.drugName,
          dose: logData.dose,
          route: logData.route,
          nurseName: logData.nurseName,
          scheduledTime: logData.scheduledTime || 'Not specified',
          status: logData.status || 'administered',
          notes: logData.notes || '',
          timestamp: new Date().toISOString(),
        }),
        lastAdministered: serverTimestamp(),
        lastAdministeredBy: logData.nurseName,
        updatedAt: serverTimestamp(),
      });
    }

    // 3. Log audit event
    await logAuditEvent({
      eventType: 'medication_administered',
      performedBy: logData.nurseName,
      performedByRole: 'nurse',
      targetType: 'medication',
      targetId: logData.patientHHID,
      targetName: `${logData.drugName} - ${logData.patientHHID}`,
      action: `Administered ${logData.drugName} (${logData.dose}) to patient ${logData.patientHHID}`,
      details: {
        drugName: logData.drugName,
        dose: logData.dose,
        route: logData.route,
        scheduledTime: logData.scheduledTime,
        actualTime: new Date().toISOString(),
        notes: logData.notes,
      },
      status: 'success',
    });

    console.log('✅ Administration logged successfully:', logDocRef.id);
    return { success: true, logId: logDocRef.id };
  } catch (error) {
    console.error('❌ Error logging administration:', error);
    
    // ✅ Log failed administration
    await logAuditEvent({
      eventType: 'medication_administration_failed',
      performedBy: logData.nurseName || 'Unknown Nurse',
      performedByRole: 'nurse',
      targetType: 'medication',
      targetId: logData.patientHHID || 'Unknown',
      targetName: logData.drugName || 'Unknown Drug',
      action: `Failed to log medication administration`,
      details: { error: error.message },
      status: 'failed',
    });
    
    return { success: false, error: error.message };
  }
};

// ========================================
// GET PATIENT MEDICATIONS
// ========================================
export const getPatientMedications = async (patientHHID) => {
  try {
    const medicationsRef = collection(db, 'medications');
    const q = query(medicationsRef, where('patientHHID', '==', patientHHID));
    const querySnapshot = await getDocs(q);
    
    const medications = [];
    querySnapshot.forEach((doc) => {
      medications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { success: true, medications };
  } catch (error) {
    console.error('❌ Error fetching patient medications:', error);
    return { success: false, error: error.message, medications: [] };
  }
};

// ========================================
// GET PATIENT ADMINISTRATION LOGS
// ========================================
export const getPatientAdministrationLogs = async (patientHHID) => {
  try {
    const logsRef = collection(db, 'administrationLogs');
    const q = query(logsRef, where('patientHHID', '==', patientHHID));
    const querySnapshot = await getDocs(q);
    
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(doc.data().timestamp),
      });
    });

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return { success: true, logs };
  } catch (error) {
    console.error('❌ Error fetching administration logs:', error);
    return { success: false, error: error.message, logs: [] };
  }
};

// ========================================
// UPDATE MEDICATION STATUS (ACTIVE/COMPLETED)
// ========================================
export const updateMedicationStatus = async (medicationId, newStatus, updatedBy) => {
  try {
    const medicationRef = doc(db, 'medications', medicationId);
    
    await updateDoc(medicationRef, {
      status: newStatus,
      statusUpdatedAt: serverTimestamp(),
      statusUpdatedBy: updatedBy,
      updatedAt: serverTimestamp(),
    });

    // ✅ Log audit event
    await logAuditEvent({
      eventType: 'medication_status_changed',
      performedBy: updatedBy,
      performedByRole: 'pharmacist',
      targetType: 'medication',
      targetId: medicationId,
      targetName: 'Medication',
      action: `Changed medication status to: ${newStatus}`,
      details: { newStatus, medicationId },
      status: 'success',
    });

    console.log('✅ Medication status updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating medication status:', error);
    return { success: false, error: error.message };
  }
};

// ========================================
// BULK ADD MEDICATIONS (FOR PRESCRIPTIONS)
// ========================================
export const bulkAddMedications = async (medicationsArray, prescribedBy) => {
  try {
    const results = [];
    
    for (const med of medicationsArray) {
      const result = await addMedication({
        ...med,
        prescribedBy,
      });
      results.push(result);
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    console.log(`✅ Bulk prescription: ${successCount} success, ${failCount} failed`);
    return { success: true, successCount, failCount, results };
  } catch (error) {
    console.error('❌ Error in bulk prescription:', error);
    return { success: false, error: error.message };
  }
};

// ========================================
// GET DUE MEDICATIONS (FOR NURSE DASHBOARD)
// ========================================
export const getDueMedications = async () => {
  try {
    const medicationsRef = collection(db, 'medications');
    const q = query(medicationsRef, where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const dueMedications = [];
    
    querySnapshot.forEach((doc) => {
      const med = { id: doc.id, ...doc.data() };
      
      // Check if medication is due now (within 1 hour window)
      if (med.timing && med.timing.length > 0) {
        const isDue = med.timing.some(timeStr => {
          const [hours, minutes] = timeStr.split(':').map(Number);
          const scheduledTimeInMinutes = hours * 60 + minutes;
          const timeDifference = Math.abs(currentTimeInMinutes - scheduledTimeInMinutes);
          return timeDifference <= 60;
        });
        
        if (isDue) {
          dueMedications.push(med);
        }
      }
    });

    return { success: true, medications: dueMedications };
  } catch (error) {
    console.error('❌ Error fetching due medications:', error);
    return { success: false, error: error.message, medications: [] };
  }
};
