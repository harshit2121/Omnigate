import { CheckCircle2, Database, Layers, Edit3 } from 'lucide-react';

export default function OpdEncounterHeader({
  selectedCase,
  backToRoster,
  handleAcceptCase,
  setShowFhirModal,
  setShowApiImportModal,
  handleOpenVitalsModal,
  hisActiveTab,
  setHisActiveTab
}) {
  if (!selectedCase) return null;

  return (
    <div style={{ background: 'white', border: '1px solid #C5D5E5', borderTop: '3px solid #FF6B00', marginBottom: 8 }}>

      {/* Back nav + Patient Identity strip */}
      <div style={{ background: '#F5F8FC', borderBottom: '1px solid #C5D5E5', padding: '7px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={backToRoster}
            style={{ background: '#E8EFF5', border: '1px solid #B0C5D8', color: '#003F6B', padding: '5px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, borderRadius: 2 }}
            onMouseEnter={e => e.currentTarget.style.background = '#D0E0F0'}
            onMouseLeave={e => e.currentTarget.style.background = '#E8EFF5'}
          >
            ← Back to OPD Roster
          </button>
          <div style={{ width: 1, height: 28, background: '#C5D5E5' }} />
          <div>
            <span style={{ fontSize: 15, fontWeight: 'bold', color: '#1A1A2E' }}>{selectedCase.patient?.name}</span>
            <span style={{ background: '#003F6B', color: 'white', padding: '1px 7px', marginLeft: 8, fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold', borderRadius: 2 }}>{selectedCase.token}</span>
            <span style={{ fontSize: 10, color: '#555', marginLeft: 10 }}>
              {selectedCase.patient?.age}Y / {selectedCase.patient?.gender} • {selectedCase.patient?.bloodGroup} • {selectedCase.patient?.category}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={handleAcceptCase}
            style={{ background: '#1A7A3C', border: '1px solid #155C2E', color: 'white', padding: '5px 14px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, borderRadius: 2 }}
          >
            <CheckCircle2 size={13} />
            E-Sign Encounter
          </button>
          <button
            onClick={() => setShowFhirModal(true)}
            style={{ background: '#003F6B', border: '1px solid #002D4E', color: 'white', padding: '5px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, borderRadius: 2 }}
          >
            <Layers size={13} />
            FHIR R4 Bundle
          </button>
          <button
            onClick={() => setShowApiImportModal(true)}
            style={{ background: '#8B4500', border: '1px solid #6A3300', color: 'white', padding: '5px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, borderRadius: 2 }}
          >
            <Database size={13} />
            Browse API Dataset
          </button>
        </div>
      </div>

      {/* Patient ID Fields Row */}
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, fontSize: '11px' }}>
        {[
          { label: 'UHID', val: selectedCase.uhid || 'UHID-2026-89421', mono: true },
          { label: 'CR No.', val: selectedCase.crNo, mono: true },
          { label: 'ABHA ID', val: selectedCase.patient?.abhaId, mono: true },
          { label: 'Phone', val: selectedCase.patient?.phone, mono: false },
          { label: 'HH ID', val: selectedCase.patient?.hhid || 'HH-2026-894', mono: true }
        ].map(f => (
          <div key={f.label}>
            <div style={{ color: '#64748B', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{f.label}</div>
            <div style={{ color: '#003F6B', fontWeight: 'bold', fontFamily: f.mono ? 'ui-monospace, monospace' : 'inherit', fontSize: '12px' }}>{f.val}</div>
          </div>
        ))}
      </div>

      {/* Vitals Telemetry Strip */}
      <div style={{ padding: '8px 16px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr) auto', gap: 8, fontSize: '11px', alignItems: 'center' }}>
        {[
          { label: 'BP (mmHg)', val: selectedCase.vitals?.bp || '128/84', color: '#003F6B' },
          { label: 'Pulse / Nadi', val: selectedCase.vitals?.pulse || '78 bpm', color: '#003F6B' },
          { label: 'SpO2', val: selectedCase.vitals?.spo2 || '98%', color: '#1A7A3C' },
          { label: 'Temperature', val: selectedCase.vitals?.temp || '98.4°F', color: '#334155' },
          { label: 'BMI / Weight', val: `${selectedCase.vitals?.bmi} (${selectedCase.vitals?.weight})`, color: '#334155' },
          { label: 'Agni Status', val: selectedCase.pariksha?.agni || 'Tikshnagni', color: '#8B4500' },
          { label: 'Pain VAS', val: selectedCase.vitals?.painScale || '6/10', color: '#AA0000' }
        ].map(v => (
          <div key={v.label} style={{ border: '1px solid #CBD5E1', padding: '6px 8px', background: '#F8FAFC', borderRadius: '2px' }}>
            <div style={{ color: '#64748B', fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: 3 }}>{v.label}</div>
            <div style={{ color: v.color, fontWeight: 'bold', fontSize: '12px', fontFamily: 'ui-monospace, monospace' }}>{v.val}</div>
          </div>
        ))}
        <button
          onClick={handleOpenVitalsModal}
          style={{
            border: '1px solid #003F6B',
            background: '#003F6B',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '2px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            height: '100%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          title="Record or Edit Physical & Pariksha Vitals (Doctor Entry)"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Edit3 size={13} />
            <span>Edit Vitals</span>
          </div>
          <span style={{ fontSize: '9px', opacity: 0.85, fontWeight: 'normal' }}>चिकित्सक प्रविष्टि</span>
        </button>
      </div>

      {/* HIS SECTION NAVIGATION TABS */}
      <div style={{ display: 'flex', borderBottom: '2px solid #003F6B', background: 'white', borderTop: '1px solid #CBD5E1' }}>
        {[
          { id: 'samprapti_chart', label: '1. Samprapti Matrix', sub: 'संप्राप्ति' },
          { id: 'clinical_history', label: '2. Pariksha & HPI', sub: 'रोग परीक्षा' },
          { id: 'medication_history', label: '3. Medication Hx', sub: 'दवा इतिहास' },
          { id: 'prescription_cdss', label: '4. E-Prescribing', sub: 'ई-प्रिस्क्रिप्शन' },
          { id: 'patient_summary', label: '5. Patient Summary', sub: 'परामर्श पत्र' },
          { id: 'emr_sheet', label: '6. Case Sheet', sub: 'EMR शीट' }
        ].map((tab, idx) => {
          const isActive = hisActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setHisActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '9px 8px',
                cursor: 'pointer',
                border: 'none',
                borderRight: idx < 5 ? '1px solid #CBD5E1' : 'none',
                borderBottom: isActive ? '3px solid #FF6B00' : '3px solid transparent',
                background: isActive ? '#003F6B' : '#F1F5F9',
                color: isActive ? 'white' : '#334155',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#E2E8F0'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = '#F1F5F9'; }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '11px', letterSpacing: '0.2px' }}>{tab.label}</div>
              <div style={{ fontSize: '10px', opacity: isActive ? 0.9 : 0.75, marginTop: '2px' }}>{tab.sub}</div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
