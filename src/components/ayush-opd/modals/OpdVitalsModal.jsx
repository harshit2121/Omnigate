import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Save } from 'lucide-react';

export default function OpdVitalsModal({
  showVitalsModal,
  setShowVitalsModal,
  selectedCase,
  vitalsForm,
  setVitalsForm,
  handleSaveVitals
}) {
  if (!showVitalsModal || !selectedCase) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          style={{ background: 'white', border: '2px solid #003F6B', maxWidth: 780, width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
        >
          {/* Modal Header */}
          <div style={{ background: '#003F6B', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #FF6B00' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <HeartPulse size={20} style={{ color: '#FFD700' }} />
              <div>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                  Physician Vitals & Pariksha Entry — चिकित्सक नैदानिक ​​प्रविष्टि
                </div>
                <div style={{ color: '#90AAC4', fontSize: 10, marginTop: 2 }}>
                  Encounter Vitals for {selectedCase.patient?.name} • UHID: {selectedCase.uhid}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowVitalsModal(false)}
              style={{ background: '#004D87', border: '1px solid #005A9C', color: 'white', padding: '4px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, borderRadius: 2 }}
            >
              Close ✕
            </button>
          </div>

          {/* Modal Form */}
          <div style={{ overflowY: 'auto', flex: 1, padding: 16, background: '#F8FBFE' }}>
            
            {/* Section A: Modern Hemodynamic & Physical Vitals */}
            <div style={{ marginBottom: 14, background: 'white', border: '1px solid #CBD5E1', padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', color: '#003F6B', marginBottom: 10, borderBottom: '1px solid #E2E8F0', paddingBottom: 4 }}>
                📊 1. Physical & Hemodynamic Telemetry (शारीरिक परीक्षण)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>BP Systolic (mmHg)</label>
                  <input
                    type="number"
                    value={vitalsForm.bpSystolic}
                    onChange={e => setVitalsForm({ ...vitalsForm, bpSystolic: e.target.value })}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 12, fontWeight: 'bold', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>BP Diastolic (mmHg)</label>
                  <input
                    type="number"
                    value={vitalsForm.bpDiastolic}
                    onChange={e => setVitalsForm({ ...vitalsForm, bpDiastolic: e.target.value })}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 12, fontWeight: 'bold', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Pulse Rate (bpm)</label>
                  <input
                    type="number"
                    value={vitalsForm.pulseRate}
                    onChange={e => setVitalsForm({ ...vitalsForm, pulseRate: e.target.value })}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 12, fontWeight: 'bold', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>SpO2 (%)</label>
                  <input
                    type="number"
                    value={vitalsForm.spo2}
                    onChange={e => setVitalsForm({ ...vitalsForm, spo2: e.target.value })}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 12, fontWeight: 'bold', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Body Temp (°F)</label>
                  <input
                    type="text"
                    value={vitalsForm.temp}
                    onChange={e => setVitalsForm({ ...vitalsForm, temp: e.target.value })}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 12, fontWeight: 'bold', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Weight (kg)</label>
                  <input
                    type="number"
                    value={vitalsForm.weight}
                    onChange={e => {
                      const w = parseFloat(e.target.value) || 0;
                      const h = parseFloat(vitalsForm.height) || 165;
                      const b = (w / ((h / 100) * (h / 100))).toFixed(1);
                      setVitalsForm({ ...vitalsForm, weight: e.target.value, bmi: b, bmiCategory: parseFloat(b) > 25 ? 'Sthaulya' : (parseFloat(b) < 18.5 ? 'Krisha' : 'Sama') });
                    }}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 12, fontWeight: 'bold', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Height (cm)</label>
                  <input
                    type="number"
                    value={vitalsForm.height}
                    onChange={e => {
                      const h = parseFloat(e.target.value) || 165;
                      const w = parseFloat(vitalsForm.weight) || 60;
                      const b = (w / ((h / 100) * (h / 100))).toFixed(1);
                      setVitalsForm({ ...vitalsForm, height: e.target.value, bmi: b, bmiCategory: parseFloat(b) > 25 ? 'Sthaulya' : (parseFloat(b) < 18.5 ? 'Krisha' : 'Sama') });
                    }}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 12, fontWeight: 'bold', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Calculated BMI</label>
                  <div style={{ border: '1px solid #CBD5E1', padding: '6px 8px', background: '#F1F5F9', fontSize: 12, fontWeight: 'bold', color: '#003F6B', height: 33, boxSizing: 'border-box', display: 'flex', alignItems: 'center' }}>
                    {vitalsForm.bmi} ({vitalsForm.bmiCategory})
                  </div>
                </div>
              </div>
            </div>

            {/* Section B: Classical Ayurvedic Pariksha Vitals */}
            <div style={{ marginBottom: 14, background: 'white', border: '1px solid #CBD5E1', padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', color: '#8B4500', marginBottom: 10, borderBottom: '1px solid #E2E8F0', paddingBottom: 4 }}>
                🌿 2. Classical Ayurvedic Pariksha (नाड़ी, अग्नि एवं कोष्ठ परीक्षा)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Nadi Gati (नाड़ी गति)</label>
                  <select
                    value={vitalsForm.nadiType}
                    onChange={e => setVitalsForm({ ...vitalsForm, nadiType: e.target.value })}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 11, background: 'white' }}
                  >
                    <option value="Manduka Gati (Pitta - Rapid/Bounding)">Manduka Gati (Pitta - Jumping/Rapid)</option>
                    <option value="Sarpa Gati (Vata - Thin/Fast/Curving)">Sarpa Gati (Vata - Thin/Snake-like)</option>
                    <option value="Hamsa Gati (Kapha - Slow/Full/Stable)">Hamsa Gati (Kapha - Slow/Swan-like)</option>
                    <option value="Sannipata Gati (Mixed/Irregular)">Sannipata Gati (Tridoshic/Irregular)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Agni Status (अग्नि)</label>
                  <select
                    value={vitalsForm.agni}
                    onChange={e => setVitalsForm({ ...vitalsForm, agni: e.target.value })}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 11, background: 'white' }}
                  >
                    <option value="Tikshnagni (Hyperactive / High Pitta)">Tikshnagni (Hyperactive / High Pitta)</option>
                    <option value="Mandagni (Sluggish / High Kapha)">Mandagni (Sluggish / High Kapha)</option>
                    <option value="Vishamagni (Irregular / High Vata)">Vishamagni (Irregular / High Vata)</option>
                    <option value="Samagni (Balanced / Tridosha Sama)">Samagni (Balanced / Tridosha Sama)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Koshtha (कोष्ठ)</label>
                  <select
                    value={vitalsForm.koshtha}
                    onChange={e => setVitalsForm({ ...vitalsForm, koshtha: e.target.value })}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 11, background: 'white' }}
                  >
                    <option value="Krura (Hard / Constipated / Vata)">Krura (Hard / Constipated / Vata)</option>
                    <option value="Mrudu (Soft / Loose / Pitta)">Mrudu (Soft / Loose / Pitta)</option>
                    <option value="Madhyama (Normal / Kapha-Pitta)">Madhyama (Normal / Balanced)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Pain VAS Scale (0 - 10)</label>
                  <select
                    value={vitalsForm.painScale}
                    onChange={e => setVitalsForm({ ...vitalsForm, painScale: e.target.value })}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 11, background: 'white' }}
                  >
                    {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n.toString()}>{n} / 10 {n === 0 ? '(No Pain)' : n < 4 ? '(Mild)' : n < 7 ? '(Moderate)' : '(Severe)'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Pain Character (वेदना स्वरूप)</label>
                  <select
                    value={vitalsForm.painType}
                    onChange={e => setVitalsForm({ ...vitalsForm, painType: e.target.value })}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 11, background: 'white' }}
                  >
                    <option value="Burning Pain (Vidaha / Daha - Pitta)">Burning Pain (Vidaha / Daha - Pitta)</option>
                    <option value="Pricking / Sharp Shooting (Toda - Vata)">Pricking / Sharp Shooting (Toda - Vata)</option>
                    <option value="Dull Heaviness & Aching (Gaurava - Kapha)">Dull Heaviness & Aching (Gaurava - Kapha)</option>
                    <option value="Spasmodic / Cramping (Shoola)">Spasmodic / Cramping (Shoola)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Blood Glucose (mg/dL)</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <input
                      type="number"
                      value={vitalsForm.sugar}
                      onChange={e => setVitalsForm({ ...vitalsForm, sugar: e.target.value })}
                      style={{ width: '65%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 12, fontWeight: 'bold' }}
                    />
                    <select
                      value={vitalsForm.sugarType}
                      onChange={e => setVitalsForm({ ...vitalsForm, sugarType: e.target.value })}
                      style={{ width: '35%', border: '1px solid #94A3B8', fontSize: 10, background: 'white' }}
                    >
                      <option value="RBS">RBS</option>
                      <option value="FBS">FBS</option>
                      <option value="PPBS">PPBS</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div style={{ padding: '10px 16px', background: 'white', borderTop: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setShowVitalsModal(false)}
              style={{ background: 'white', border: '1px solid #CBD5E1', color: '#475569', padding: '6px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, borderRadius: 2 }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveVitals}
              style={{ background: '#003F6B', border: '1px solid #002D4E', color: 'white', padding: '7px 20px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, borderRadius: 2 }}
            >
              <Save size={13} />
              Save Vitals & Recalculate Diagnostic Matrices
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
