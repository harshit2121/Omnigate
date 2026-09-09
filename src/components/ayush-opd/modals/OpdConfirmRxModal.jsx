import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock } from 'lucide-react';

export default function OpdConfirmRxModal({
  showConfirmRxModal,
  setShowConfirmRxModal,
  selectedCase,
  prescriptions,
  dietPathya,
  yogaPlanText,
  prescriptionHash,
  handleConfirmSignPrescription
}) {
  if (!showConfirmRxModal || !selectedCase) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          style={{ background: 'white', border: '2px solid #1A7A3C', maxWidth: 750, width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
        >
          {/* Modal Header */}
          <div style={{ background: '#003F6B', padding: '10px 16px', borderBottom: '2px solid #1A7A3C', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: '#1A7A3C', border: '2px solid #A0D8B0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>
                <CheckCircle2 size={20} style={{ color: 'white' }} />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                  Confirm & Issue Official E-Prescription — ई-प्रिस्क्रिप्शन डिजिटल हस्ताक्षर
                </div>
                <div style={{ color: '#90AAC4', fontSize: 10, marginTop: 2 }}>
                  All India Institute of Ayurveda (AIIA) • Ministry of Ayush Certified Electronic Health Record
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowConfirmRxModal(false)}
              style={{ background: '#004D87', border: '1px solid #005A9C', color: 'white', padding: '4px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, borderRadius: 2 }}
            >
              Edit / Back ✕
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ overflowY: 'auto', flex: 1, padding: 14, background: '#F5F8FC' }}>
            
            {/* Patient Summary Box */}
            <div style={{ background: 'white', border: '1px solid #C5D5E5', padding: '10px 14px', marginBottom: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #E5EDF5', fontSize: 11 }}>
                {[
                  { label: 'Patient Name', val: selectedCase.patient?.name, bold: true },
                  { label: 'Age / Gender', val: `${selectedCase.patient?.age}Y / ${selectedCase.patient?.gender}`, bold: false },
                  { label: 'UHID / Token', val: `${selectedCase.uhid} (${selectedCase.token})`, mono: true },
                  { label: 'Prakriti / Agni', val: selectedCase.pariksha?.prakritiResult?.dominant || 'Pitta-Vata', color: '#8B4500' }
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 9, color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontWeight: f.bold ? 'bold' : '600', color: f.color || (f.mono ? '#003F6B' : '#1A1A2E'), fontFamily: f.mono ? 'monospace' : 'inherit', fontSize: f.bold ? 13 : 11 }}>{f.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                <span style={{ fontSize: 9, color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Diagnosis:</span>
                <span style={{ fontWeight: 'bold', color: '#1A1A2E' }}>{selectedCase.intake?.complaintLabel || 'Amlapitta'}</span>
                <span style={{ background: '#EFF5FF', border: '1px solid #B0C8E0', color: '#003F6B', padding: '1px 7px', fontSize: 9, fontFamily: 'monospace', borderRadius: 2 }}>
                  {selectedCase.intake?.namasteCode || 'NAMASTE-AYU-AML-01'}
                </span>
              </div>
            </div>

            {/* Prescribed Medicines Table */}
            <div style={{ background: 'white', border: '1px solid #C5D5E5', marginBottom: 10 }}>
              <div style={{ background: '#F0F5FA', padding: '7px 12px', borderBottom: '2px solid #003F6B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: '#003F6B', fontSize: 12, textTransform: 'uppercase' }}>
                  Prescribed Medicines ({prescriptions.length} items)
                </span>
                <span style={{ background: '#1A7A3C', color: 'white', padding: '1px 8px', fontSize: 9, fontWeight: 'bold', borderRadius: 2 }}>
                  CDSS VERIFIED SAFE
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: '#F8FBFE', borderBottom: '1px solid #C5D5E5' }}>
                    {['#', 'Medicine', 'Dose', 'Frequency', 'Timing', 'Anupana', 'Duration'].map(h => (
                      <th key={h} style={{ padding: '4px 8px', textAlign: 'left', color: '#666', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((med, idx) => (
                    <tr key={med.id || idx} style={{ borderBottom: '1px solid #E5EDF5', background: idx % 2 === 0 ? 'white' : '#F8FBFE' }}>
                      <td style={{ padding: '5px 8px', color: '#888', fontFamily: 'monospace', fontSize: 10 }}>{idx + 1}</td>
                      <td style={{ padding: '5px 8px' }}>
                        <div style={{ fontWeight: 'bold', color: '#1A1A2E' }}>{med.name}</div>
                        <span style={{ background: med.system === 'ayurvedic' ? '#FFF5E8' : '#EFF5FF', border: `1px solid ${med.system === 'ayurvedic' ? '#F0D0A0' : '#B0C8E0'}`, color: med.system === 'ayurvedic' ? '#8B4500' : '#003F6B', padding: '0px 5px', fontSize: 8, fontWeight: 'bold', borderRadius: 2 }}>
                          {med.type || med.system}
                        </span>
                      </td>
                      <td style={{ padding: '5px 8px', fontFamily: 'monospace', fontWeight: 'bold', color: '#1A1A2E' }}>{med.dose}</td>
                      <td style={{ padding: '5px 8px', color: '#333' }}>{med.frequency}</td>
                      <td style={{ padding: '5px 8px', color: '#555', fontSize: 10 }}>{med.kaala}</td>
                      <td style={{ padding: '5px 8px', color: '#555', fontSize: 10 }}>{med.anupana}</td>
                      <td style={{ padding: '5px 8px', fontWeight: 'bold', color: '#003F6B' }}>{med.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Diet & Yoga Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
              <div style={{ background: '#FFF5E8', border: '1px solid #F0D0A0', padding: '8px 12px' }}>
                <div style={{ fontSize: 9, fontWeight: 'bold', color: '#8B4500', textTransform: 'uppercase', marginBottom: 4 }}>🥗 Dietary Advice (पथ्यापथ्य)</div>
                <p style={{ fontSize: 10, color: '#444', lineHeight: 1.6 }}><b>Pathya:</b> {dietPathya}</p>
              </div>
              <div style={{ background: '#EAF7EE', border: '1px solid #A0D8B0', padding: '8px 12px' }}>
                <div style={{ fontSize: 9, fontWeight: 'bold', color: '#1A7A3C', textTransform: 'uppercase', marginBottom: 4 }}>🧘 Yoga & Lifestyle (योग व दिनचर्या)</div>
                <p style={{ fontSize: 10, color: '#444', lineHeight: 1.6 }}>{yogaPlanText}</p>
              </div>
            </div>

            {/* Digital Signature Stamp */}
            <div style={{ background: '#E8EFF5', border: '2px solid #003F6B', padding: '10px 14px', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1A1A2E' }}>Digitally Signed by: Dr. V. Sharma (BAMS, MD Ayu)</div>
                  <div style={{ color: '#555', fontFamily: 'monospace', fontSize: 10, marginTop: 2 }}>Reg. No: AYU-DEL-8942 • AIIA Department of Kayachikitsa • CCIM Registered</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#1A7A3C' }}>ABDM QR Code Generated</div>
                  <div style={{ color: '#888', fontFamily: 'monospace', fontSize: 10 }}>{new Date().toLocaleDateString('en-IN')}</div>
                </div>
              </div>
              <div style={{ padding: '4px 8px', background: 'white', border: '1px solid #CBD5E1', fontSize: 10, fontFamily: 'ui-monospace, monospace', color: '#003F6B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span><b>Tamper-Proof SHA-256 Digest:</b> {prescriptionHash}</span>
                <span style={{ color: '#16A34A', fontWeight: 'bold' }}>✓ INTEGRITY SEALED</span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{ padding: '10px 14px', background: 'white', borderTop: '1px solid #C5D5E5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <button
              onClick={() => setShowConfirmRxModal(false)}
              style={{ background: 'white', border: '1px solid #B0C5D8', color: '#444', padding: '7px 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, borderRadius: 2 }}
            >
              Cancel & Edit
            </button>
            <button
              onClick={handleConfirmSignPrescription}
              style={{ background: '#1A7A3C', border: '1px solid #155C2E', color: 'white', padding: '8px 28px', cursor: 'pointer', fontWeight: 'bold', fontSize: 12, display: 'flex', alignItems: 'center', gap: 7, borderRadius: 2, boxShadow: '0 2px 8px rgba(26,122,60,0.3)' }}
            >
              <Lock size={14} />
              🔒 Confirm & Issue Official E-Prescription
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
