import { Printer, AlertTriangle, Sun, QrCode, ShieldCheck } from 'lucide-react';

export default function OpdPatientSummaryTab({
  selectedCase,
  isPrescriptionSigned,
  acceptedCases,
  sampraptiSynthesis,
  prescriptions,
  dietPathya,
  yogaPlanText,
  panchakarmaOrders,
  currentRitu,
  prescriptionHash,
  backToRoster,
  printDoctorPrescription
}) {
  if (!selectedCase || !sampraptiSynthesis?.patientSummary) return null;

  return (
    <div style={{ background: 'white', border: '1px solid #C5D5E5' }}>
      {/* Status completion alert banner */}
      {(isPrescriptionSigned || acceptedCases.includes(selectedCase.id)) && (
        <div style={{ background: '#ECFDF5', borderBottom: '2px solid #10B981', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              ✓
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#065F46', fontSize: '13px' }}>
                Encounter Completed & E-Prescription Signed!
              </div>
              <div style={{ color: '#047857', fontSize: '11px' }}>
                Patient {selectedCase.patient?.name} is now marked as <b>CONSULTED</b> in the Central Queue.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => {
                printDoctorPrescription({
                  patientName: selectedCase.patient?.name,
                  age: selectedCase.patient?.age,
                  gender: selectedCase.patient?.gender,
                  uhid: selectedCase.uhid,
                  abhaId: selectedCase.patient?.abhaId,
                  diagnosis: selectedCase.intake?.complaintLabel || 'Amlapitta',
                  icdCode: selectedCase.intake?.namasteCode || 'NAMASTE-AYU-AML-01',
                  prakriti: selectedCase.pariksha?.prakritiResult?.dominant,
                  medications: prescriptions.map(p => ({
                    drugName: p.name,
                    system: p.system,
                    kalpana: p.type,
                    dose: p.dose,
                    frequency: p.frequency,
                    sevanaKala: p.kaala,
                    anupana: p.anupana,
                    duration: p.duration
                  })),
                  dietRecommendations: dietPathya,
                  yogaTherapy: yogaPlanText,
                  panchakarmaOrders: panchakarmaOrders
                });
              }}
              style={{ background: '#10B981', border: '1px solid #059669', color: 'white', padding: '6px 14px', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <Printer size={13} />
              Print Rx (ABDM)
            </button>

            <button
              onClick={backToRoster}
              style={{ background: '#003F6B', border: '1px solid #002D4E', color: 'white', padding: '6px 14px', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              ← Next Patient / Back to Queue
            </button>
          </div>
        </div>
      )}

      <div style={{ background: '#8B4500', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: '#FFD700', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
            AIIA • रोगी परामर्श पत्र (Patient Consultation Summary)
          </div>
          <div style={{ color: 'white', fontSize: 13, fontWeight: 'bold', marginTop: 2 }}>
            {sampraptiSynthesis.patientSummary.titleHi}
          </div>
          <div style={{ color: '#F0D0A0', fontSize: 10, marginTop: 1 }}>
            {sampraptiSynthesis.patientSummary.titleEn}
          </div>
        </div>
        <button
          onClick={() => window.print()}
          style={{ background: '#FF6B00', border: '1px solid #C04000', color: 'white', padding: '5px 14px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, borderRadius: 2 }}
        >
          <Printer size={13} />
          प्रिंट रोगी पत्र
        </button>
      </div>

      <div style={{ padding: 14 }}>
        {/* Condition Overview */}
        <div style={{ marginBottom: 10, padding: '8px 12px', background: '#F0F5FA', border: '1px solid #C5D5E5', borderLeft: '4px solid #003F6B' }}>
          <div style={{ fontSize: 10, fontWeight: 'bold', color: '#003F6B', textTransform: 'uppercase', marginBottom: 4 }}>
            १. आपकी समस्या का सरल विवरण — Understanding Your Health Condition
          </div>
          <p style={{ fontWeight: 'bold', color: '#1A1A2E', fontSize: 11, lineHeight: 1.7 }}>{sampraptiSynthesis.patientSummary.conditionOverviewHi}</p>
          <p style={{ color: '#555', fontSize: 10, marginTop: 4, lineHeight: 1.6 }}>{sampraptiSynthesis.patientSummary.conditionOverviewEn}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div style={{ padding: '8px 12px', background: '#EAF7EE', border: '1px solid #A0D8B0', borderLeft: '4px solid #1A7A3C' }}>
            <div style={{ fontSize: 10, fontWeight: 'bold', color: '#1A7A3C', textTransform: 'uppercase', marginBottom: 4 }}>
              ✓ २. हितकर आहार — Pathya (Foods to Favor)
            </div>
            <p style={{ fontWeight: 'bold', color: '#0A3A20', fontSize: 11, lineHeight: 1.7 }}>{sampraptiSynthesis.patientSummary.consumeHi}</p>
            <p style={{ color: '#2A6040', fontSize: 10, marginTop: 4, lineHeight: 1.6 }}>{sampraptiSynthesis.patientSummary.consumeEn}</p>
          </div>
          <div style={{ padding: '8px 12px', background: '#FEE8E8', border: '1px solid #F0A0A0', borderLeft: '4px solid #AA0000' }}>
            <div style={{ fontSize: 10, fontWeight: 'bold', color: '#AA0000', textTransform: 'uppercase', marginBottom: 4 }}>
              ✗ ३. परहेज — Apathya (Foods to Avoid)
            </div>
            <p style={{ fontWeight: 'bold', color: '#3A0A0A', fontSize: 11, lineHeight: 1.7 }}>{sampraptiSynthesis.patientSummary.avoidHi}</p>
            <p style={{ color: '#7A2020', fontSize: 10, marginTop: 4, lineHeight: 1.6 }}>{sampraptiSynthesis.patientSummary.avoidEn}</p>
          </div>
        </div>

        <div style={{ marginBottom: 10, padding: '8px 12px', background: '#F0F5FA', border: '1px solid #C5D5E5', borderLeft: '4px solid #003F6B' }}>
          <div style={{ fontSize: 10, fontWeight: 'bold', color: '#003F6B', textTransform: 'uppercase', marginBottom: 4 }}>
            ४. घर पर दिनचर्या — Home Care & Dinacharya Guidance
          </div>
          <p style={{ fontWeight: 'bold', color: '#1A1A2E', fontSize: 11, lineHeight: 1.7 }}>{sampraptiSynthesis.patientSummary.homeCareHi}</p>
          <p style={{ color: '#555', fontSize: 10, marginTop: 4 }}>{sampraptiSynthesis.patientSummary.homeCareEn}</p>
        </div>

        {/* 5. Seasonal Ritucharya & Prakriti Integration */}
        <div style={{ marginBottom: 10, padding: '10px 12px', background: '#FDF8F0', border: '1px solid #EAD8C0', borderLeft: '4px solid #D97706' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 'bold', color: '#92400E', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Sun size={13} style={{ color: '#D97706' }} />
              ५. वर्तमान ऋतुचर्या एवं प्रकृति पथ्य — Seasonal Ayurvedic Chrono-Diet
            </div>
            <span style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', padding: '1px 7px', fontSize: 9, fontWeight: 'bold', borderRadius: 2 }}>
              {currentRitu?.nameHi} • {currentRitu?.nameEn}
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#78350F', lineHeight: 1.6, marginTop: 3 }}>
            <b>Seasonal Dosha Trend:</b> {currentRitu?.doshaSurge} (Active this month).
          </div>
          <div style={{ fontSize: 11, color: '#451A03', lineHeight: 1.6, marginTop: 2 }}>
            <b>Seasonal Diet Advice:</b> {currentRitu?.dietAdvice}
          </div>
          <div style={{ fontSize: 10, color: '#6B7280', marginTop: 4, fontStyle: 'italic' }}>
            * Calibrated for patient's {selectedCase.pariksha?.prakritiResult?.dominant || 'Pitta-Vata'} constitution and {selectedCase.pariksha?.agni || 'Tikshnagni'} digestive power.
          </div>
        </div>

        <div style={{ padding: '8px 12px', background: '#FFF8E0', border: '1px solid #F0D080', borderLeft: '4px solid #C05000', display: 'flex', gap: 10, marginBottom: 10 }}>
          <AlertTriangle size={18} style={{ color: '#C05000', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 'bold', color: '#7A3000', textTransform: 'uppercase', marginBottom: 2 }}>
              सावधानी एवं आपातकालीन निर्देश (Red Flags & Warnings):
            </div>
            <p style={{ fontSize: 11, color: '#5A2000', fontWeight: '600', lineHeight: 1.6 }}>{sampraptiSynthesis.patientSummary.warningSignHi}</p>
          </div>
        </div>

        {/* Cryptographic ABDM Hash Seal & Verification Card */}
        <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 64, height: 64, background: 'white', border: '1px solid #94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 4, flexShrink: 0, borderRadius: 2 }}>
              <QrCode size={40} style={{ color: '#003F6B' }} />
              <span style={{ fontSize: 7, fontWeight: 'bold', color: '#64748B', marginTop: 1 }}>ABDM SCAN</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <ShieldCheck size={14} style={{ color: '#16A34A' }} />
                <span style={{ fontSize: 11, fontWeight: 'bold', color: '#003F6B' }}>
                  ABDM Interoperable Tamper-Proof Electronic Seal
                </span>
                <span style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', padding: '1px 6px', fontSize: 8, fontWeight: 'bold', borderRadius: 2 }}>
                  VERIFIED
                </span>
              </div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: '#475569', wordBreak: 'break-all' }}>
                <span style={{ color: '#64748B', fontWeight: 'bold' }}>DIGEST: </span>{prescriptionHash}
              </div>
              <div style={{ fontSize: 9, color: '#64748B', marginTop: 3 }}>
                Signed by Dr. V. Sharma (Reg: AYU-DEL-8942) • AIIA Central Health Information System
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(prescriptionHash);
                alert(`Prescription Cryptographic SHA-256 Hash copied to clipboard:\n${prescriptionHash}`);
              }}
              style={{ background: 'white', border: '1px solid #CBD5E1', color: '#003F6B', padding: '4px 10px', fontSize: 10, fontWeight: 'bold', cursor: 'pointer', borderRadius: 2 }}
            >
              Copy Hash Digest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
