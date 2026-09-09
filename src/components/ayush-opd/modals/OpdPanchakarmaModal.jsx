import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, Plus } from 'lucide-react';

export default function OpdPanchakarmaModal({
  showPanchakarmaModal,
  setShowPanchakarmaModal,
  newPanchakarmaForm,
  setNewPanchakarmaForm,
  handleAddPanchakarmaOrder
}) {
  if (!showPanchakarmaModal) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          style={{ background: 'white', border: '2px solid #003F6B', maxWidth: 750, width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
        >
          {/* Modal Header */}
          <div style={{ background: '#003F6B', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #FF6B00' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Flower2 size={20} style={{ color: '#FFD700' }} />
              <div>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                  Order Panchakarma & External Therapies — पंचकर्म प्रक्रिया आदेश
                </div>
                <div style={{ color: '#90AAC4', fontSize: 10, marginTop: 2 }}>
                  AIIA Panchakarma Unit • Classical Shodhana & Shamana Procedures
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPanchakarmaModal(false)}
              style={{ background: '#004D87', border: '1px solid #005A9C', color: 'white', padding: '4px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, borderRadius: 2 }}
            >
              Close ✕
            </button>
          </div>

          {/* Modal Content */}
          <div style={{ overflowY: 'auto', flex: 1, padding: 16, background: '#F8FBFE' }}>
            
            {/* Quick Presets */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', color: '#64748B', marginBottom: 6 }}>
                ⚡ Rapid Standard Protocols (Select to Auto-Fill):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  { name: 'Mridu Virechana Karma', dravya: 'Eranda Taila + Triphala Kwatha', sessions: '3 Days', time: 'Early Morning (Pratah Kala)', notes: 'Empty stomach with lukewarm water. Observe Vegas.' },
                  { name: 'Shirodhara (Head Drip)', dravya: 'Chandanadi / Ksheerabala Taila', sessions: '7 Sessions (45 min)', time: 'Evening (Sayam Kala)', notes: 'For Pitta-Vata shamana, insomnia and mental stress.' },
                  { name: 'Janu Basti (Knee Retention)', dravya: 'Mahanarayana + Ksheerabala Taila', sessions: '7 Sessions (30 min)', time: 'Morning (Pratah Kala)', notes: 'Follow with localized Nadi Swedana for Sandhigata Vata.' },
                  { name: 'Kati Basti (Lumbar Oil Retention)', dravya: 'Dhanwantaram Taila 101', sessions: '7 Sessions (35 min)', time: 'Morning (Pratah Kala)', notes: 'For Gridhrasi / Lumbar Spondylosis.' },
                  { name: 'Nasya Karma (Nasal Errhine)', dravya: 'Anu Taila / Shadbindu Taila', sessions: '7 Days (4-4 drops)', time: 'Early Morning', notes: 'Prior Mukha Abhyanga & Bashpa Sweda.' },
                  { name: 'Takradhara (Medicated Buttermilk)', dravya: 'Musta-Kwatha Siddha Takra', sessions: '7 Sessions (45 min)', time: 'Mid-Morning', notes: 'For Pittaja Shiroroga and scalp psoriasis.' }
                ].map(p => (
                  <button
                    key={p.name}
                    onClick={() => setNewPanchakarmaForm({ procedure: p.name, dravya: p.dravya, sessions: p.sessions, time: p.time, notes: p.notes })}
                    style={{
                      background: newPanchakarmaForm.procedure === p.name ? '#003F6B' : 'white',
                      color: newPanchakarmaForm.procedure === p.name ? 'white' : '#003F6B',
                      border: '1px solid #CBD5E1',
                      padding: '4px 8px',
                      fontSize: 10,
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      borderRadius: 2
                    }}
                  >
                    + {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ background: 'white', border: '1px solid #CBD5E1', padding: 14 }}>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Procedure Name (कर्म नाम)</label>
                <input
                  type="text"
                  value={newPanchakarmaForm.procedure}
                  onChange={e => setNewPanchakarmaForm({ ...newPanchakarmaForm, procedure: e.target.value })}
                  style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 11, fontWeight: 'bold', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Dravya / Oil / Kwatha Medium (द्रव्य / तैल)</label>
                  <input
                    type="text"
                    value={newPanchakarmaForm.dravya}
                    onChange={e => setNewPanchakarmaForm({ ...newPanchakarmaForm, dravya: e.target.value })}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 11, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Sessions / Duration (सत्र अवधि)</label>
                  <input
                    type="text"
                    value={newPanchakarmaForm.sessions}
                    onChange={e => setNewPanchakarmaForm({ ...newPanchakarmaForm, sessions: e.target.value })}
                    style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 11, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Recommended Time of Day (सेवन काल)</label>
                <select
                  value={newPanchakarmaForm.time}
                  onChange={e => setNewPanchakarmaForm({ ...newPanchakarmaForm, time: e.target.value })}
                  style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 11, background: 'white' }}
                >
                  <option value="Early Morning (Pratah Kala - Empty Stomach)">Early Morning (Pratah Kala - Empty Stomach)</option>
                  <option value="Morning (9:00 AM - 11:00 AM)">Morning (9:00 AM - 11:00 AM)</option>
                  <option value="Evening (Sayam Kala - 4:00 PM - 6:00 PM)">Evening (Sayam Kala - 4:00 PM - 6:00 PM)</option>
                  <option value="Night (Nisha Kala - Bedtime)">Night (Nisha Kala - Bedtime)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 3 }}>Special Clinical Notes & Pre-Procedure Instructions</label>
                <textarea
                  rows={3}
                  value={newPanchakarmaForm.notes}
                  onChange={e => setNewPanchakarmaForm({ ...newPanchakarmaForm, notes: e.target.value })}
                  style={{ width: '100%', border: '1px solid #94A3B8', padding: '6px 8px', fontSize: 11, boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{ padding: '10px 16px', background: 'white', borderTop: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setShowPanchakarmaModal(false)}
              style={{ background: 'white', border: '1px solid #CBD5E1', color: '#475569', padding: '6px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, borderRadius: 2 }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddPanchakarmaOrder}
              style={{ background: '#003F6B', border: '1px solid #002D4E', color: 'white', padding: '7px 20px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, borderRadius: 2 }}
            >
              <Plus size={13} />
              Add to Panchakarma Orders
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
