import { motion, AnimatePresence } from 'framer-motion';
import { generateFhirCaseBundle } from '../../../services/fhirService';

export default function OpdFhirModal({
  showFhirModal,
  setShowFhirModal,
  selectedCase
}) {
  if (!showFhirModal || !selectedCase) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          style={{ background: 'white', border: '2px solid #003F6B', maxWidth: 800, width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
        >
          <div style={{ background: '#003F6B', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#FF6B00', color: 'white', padding: '2px 8px', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold', borderRadius: 2 }}>FHIR R4 JSON</span>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>ABDM Interoperable Clinical Intake Bundle</span>
            </div>
            <button onClick={() => setShowFhirModal(false)} style={{ background: '#004D87', border: '1px solid #005A9C', color: 'white', padding: '4px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, borderRadius: 2 }}>
              Close ✕
            </button>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '12px', background: '#0D1117', fontFamily: 'Courier New, monospace', fontSize: 11, color: '#4ADE80', lineHeight: 1.5, whiteSpace: 'pre' }}>
            {JSON.stringify(generateFhirCaseBundle({
              patient: selectedCase.patient,
              intakeData: selectedCase.intake,
              parikshaData: selectedCase.pariksha,
              ocrDocuments: selectedCase.documents
            }), null, 2)}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
