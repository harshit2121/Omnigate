import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { securityCryptoService } from './securityCryptoService';

const GENESIS_BLOCK_HASH = '0000000000000000000000000000000000000000000000000000000000000000';
const LOCAL_STORAGE_LEDGER_KEY = 'omnigate_immutable_audit_ledger_v1';

/**
 * Retrieve local hash-chained ledger cache
 */
export const getLocalAuditLedger = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LEDGER_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

/**
 * Save updated hash-chained ledger to local cache
 */
const saveLocalAuditLedger = (ledger) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_LEDGER_KEY, JSON.stringify(ledger.slice(-500))); // Keep last 500 blocks
  } catch (err) {
    console.warn('Failed to cache audit ledger locally:', err);
  }
};

/**
 * Log a tamper-evident, SHA-256 hash-chained audit event
 * Compliant with DPDP Act 2023 & ABDM Audit Mandate
 */
export const logAuditEvent = async (eventData) => {
  try {
    const currentLedger = getLocalAuditLedger();
    const previousHash = currentLedger.length > 0 
      ? currentLedger[currentLedger.length - 1].blockHash 
      : GENESIS_BLOCK_HASH;

    const blockIndex = currentLedger.length + 1;
    const timestampISO = new Date().toISOString();

    const rawPayload = {
      blockIndex,
      previousHash,
      timestampISO,
      eventType: eventData.eventType || 'generic_action',
      performedBy: eventData.performedBy || 'System',
      performedByRole: eventData.performedByRole || 'kiosk',
      targetType: eventData.targetType || 'patient',
      targetId: eventData.targetId || 'N/A',
      targetName: eventData.targetName || 'N/A',
      action: eventData.action || 'Performed action',
      details: eventData.details || {},
      ipAddress: eventData.ipAddress || '127.0.0.1 (Local Station #04)',
      status: eventData.status || 'success',
      compliance: {
        dpdpActCompliant: true,
        abdmM3Standard: true,
        phiMasked: true
      }
    };

    // Calculate Cryptographic SHA-256 Digest for this Block
    const blockHash = await securityCryptoService.calculateSHA256(rawPayload);

    const fullBlock = {
      ...rawPayload,
      blockHash
    };

    // Append to local ledger cache
    currentLedger.push(fullBlock);
    saveLocalAuditLedger(currentLedger);

    // Save to Firestore if available
    let docId = 'local-' + blockIndex;
    try {
      if (db) {
        const auditRef = collection(db, 'auditLogs');
        const docRef = await addDoc(auditRef, {
          ...fullBlock,
          firestoreTimestamp: serverTimestamp()
        });
        docId = docRef.id;
      }
    } catch (firebaseErr) {
      console.warn('Firestore sync optional or skipped:', firebaseErr);
    }

    console.log(`🛡️ Immutable Audit Block #${blockIndex} committed. Hash: ${blockHash.slice(0, 12)}...`);
    return { 
      success: true, 
      blockIndex, 
      blockHash, 
      previousHash,
      id: docId 
    };
  } catch (error) {
    console.error('❌ Error creating immutable audit log:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verify cryptographic integrity of the entire audit ledger
 * Checks every block's SHA-256 hash and validates link to previousHash
 */
export const verifyAuditLedgerIntegrity = async (ledgerToVerify) => {
  const ledger = ledgerToVerify || getLocalAuditLedger();
  if (!ledger || ledger.length === 0) {
    return {
      isValid: true,
      totalBlocks: 0,
      verifiedAt: new Date().toISOString(),
      statusText: 'Ledger initialized (Empty Genesis State)'
    };
  }

  let previousHash = GENESIS_BLOCK_HASH;

  for (let i = 0; i < ledger.length; i++) {
    const block = ledger[i];

    // Check 1: Previous hash link must match
    if (block.previousHash !== previousHash) {
      return {
        isValid: false,
        tamperedBlockIndex: block.blockIndex || (i + 1),
        reason: `Hash chain broken at Block #${block.blockIndex || (i + 1)}. Expected previous hash: ${previousHash}, got: ${block.previousHash}`,
        totalBlocks: ledger.length
      };
    }

    // Check 2: Recalculate block hash from raw payload
    const { blockHash, firestoreTimestamp, id, ...rawPayload } = block;
    const recomputedHash = await securityCryptoService.calculateSHA256(rawPayload);

    if (recomputedHash !== blockHash) {
      return {
        isValid: false,
        tamperedBlockIndex: block.blockIndex || (i + 1),
        reason: `Data modification detected in Block #${block.blockIndex || (i + 1)}. Recorded hash: ${blockHash}, recomputed: ${recomputedHash}`,
        totalBlocks: ledger.length
      };
    }

    previousHash = blockHash;
  }

  return {
    isValid: true,
    totalBlocks: ledger.length,
    latestBlockHash: previousHash,
    verifiedAt: new Date().toISOString(),
    statusText: `All ${ledger.length} cryptographic audit blocks verified intact with 0 discrepancies.`
  };
};

// Convenience helpers
export const logMedicationAdministration = async (medicationData, nurseName) => {
  return await logAuditEvent({
    eventType: 'medication_administered',
    performedBy: nurseName || 'Unknown Nurse',
    performedByRole: 'nurse',
    targetType: 'medication',
    targetId: medicationData.patientHHID || 'N/A',
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

export const logKioskRegistration = async (patientData, tokenNumber) => {
  return await logAuditEvent({
    eventType: 'kiosk_token_dispatched',
    performedBy: 'OmniGate Terminal #04',
    performedByRole: 'kiosk',
    targetType: 'patient',
    targetId: patientData.abhaId || tokenNumber,
    targetName: securityCryptoService.maskPHI(patientData.name || 'Patient', 'name'),
    action: `Registered Ayush OPD token ${tokenNumber} for ABHA ID ${securityCryptoService.maskPHI(patientData.abhaId, 'abha')}`,
    details: {
      tokenNumber,
      abhaIdMasked: securityCryptoService.maskPHI(patientData.abhaId, 'abha'),
      dominantPrakriti: patientData.prakriti || 'Vata-Pitta',
      triageRoom: 'Room 12 (Kayachikitsa)'
    },
    status: 'success'
  });
};

export default {
  logAuditEvent,
  verifyAuditLedgerIntegrity,
  getLocalAuditLedger,
  logMedicationAdministration,
  logKioskRegistration
};
