import { motion, AnimatePresence } from 'framer-motion';
import { Database, Search } from 'lucide-react';

export default function OpdApiImportModal({
  showApiImportModal,
  setShowApiImportModal,
  apiSearchQuery,
  setApiSearchQuery,
  apiFilterSystem,
  setApiFilterSystem,
  apiFilterKalpana,
  setApiFilterKalpana,
  apiSearchResults,
  handleSearchApiFormulations,
  handleImportFromApi
}) {
  if (!showApiImportModal) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          style={{ background: 'white', border: '2px solid #003F6B', maxWidth: 900, width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
        >
          {/* Modal Header */}
          <div style={{ background: '#003F6B', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #FF6B00' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Database size={18} style={{ color: '#FFD700' }} />
              <div>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                  AYUSH Pharmacopoeia & Formulations Dataset — आयुष औषध योग डेटासेट
                </div>
                <div style={{ color: '#90AAC4', fontSize: 10, marginTop: 2 }}>
                  PCIM&H / CCRAS Master Database • Ayurvedic Pharmacopoeia of India (API) • Search & Import
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowApiImportModal(false)}
              style={{ background: '#004D87', border: '1px solid #005A9C', color: 'white', padding: '4px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, borderRadius: 2 }}
            >
              Close ✕
            </button>
          </div>

          {/* Search & Filter Ribbon */}
          <div style={{ padding: '10px 14px', background: '#F0F5FA', borderBottom: '1px solid #C5D5E5' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8 }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#888' }} size={14} />
                <input
                  value={apiSearchQuery}
                  onChange={(e) => { setApiSearchQuery(e.target.value); handleSearchApiFormulations(e.target.value, apiFilterSystem, apiFilterKalpana); }}
                  placeholder="Search Sanskrit name, indication (e.g. Amlapitta), ingredient..."
                  style={{ width: '100%', paddingLeft: 28, padding: '6px 8px 6px 30px', border: '1px solid #B0C5D8', fontSize: 11, fontWeight: 'bold', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <select value={apiFilterSystem} onChange={(e) => { setApiFilterSystem(e.target.value); handleSearchApiFormulations(apiSearchQuery, e.target.value, apiFilterKalpana); }} style={{ border: '1px solid #B0C5D8', padding: '6px 8px', fontSize: 11, background: 'white' }}>
                <option value="all">All Datasets (Ayush + Modern + Disease Protocols)</option>
                <option value="ayurvedic">🌿 Ayurvedic Pharmacopoeia (API Monographs)</option>
                <option value="ayurgenix">🧬 AyurGenix Disease Protocols (446 Diseases)</option>
                <option value="allopathic">💊 Modern Indian Medicines (3,500 Drugs)</option>
              </select>
              <select value={apiFilterKalpana} onChange={(e) => { setApiFilterKalpana(e.target.value); handleSearchApiFormulations(apiSearchQuery, apiFilterSystem, e.target.value); }} style={{ border: '1px solid #B0C5D8', padding: '6px 8px', fontSize: 11, background: 'white' }}>
                <option value="all">All Kalpanas / Types</option>
                <option value="Vati">Vati & Guti (Tablets)</option>
                <option value="Guggulu">Guggulu Kalpas</option>
                <option value="Churna">Churna (Powders)</option>
                <option value="Kwatha">Kwatha / Kashayam</option>
                <option value="Asava">Asava & Arishta</option>
                <option value="Ghrita">Ghrita & Medicated Ghee</option>
                <option value="Taila">Taila (Medicated Oils)</option>
                <option value="Single Herb">Single Herb (Eka Dravya)</option>
              </select>
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: '#555', display: 'flex', justifyContent: 'space-between' }}>
              <span>Found <b>{apiSearchResults?.length || 0}</b> standardized pharmacopoeial monographs</span>
              <span style={{ color: '#003F6B' }}>Click "Import to Rx" to load into current encounter</span>
            </div>
          </div>

          {/* Monograph List */}
          <div style={{ overflowY: 'auto', flex: 1, background: '#F8FBFE', padding: '10px 14px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#E8EFF5', position: 'sticky', top: 0, zIndex: 1 }}>
                  <th style={{ padding: '5px 8px', textAlign: 'left', color: '#003F6B', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #003F6B' }}>Code</th>
                  <th style={{ padding: '5px 8px', textAlign: 'left', color: '#003F6B', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #003F6B' }}>Formulation / Drug Name</th>
                  <th style={{ padding: '5px 8px', textAlign: 'left', color: '#003F6B', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #003F6B' }}>Type / Category</th>
                  <th style={{ padding: '5px 8px', textAlign: 'left', color: '#003F6B', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #003F6B' }}>Indications</th>
                  <th style={{ padding: '5px 8px', textAlign: 'left', color: '#003F6B', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #003F6B' }}>Std. Dose & Anupana</th>
                  <th style={{ padding: '5px 8px', textAlign: 'left', color: '#003F6B', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #003F6B' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {apiSearchResults?.map((item, idx) => {
                  const isAyur = item.system !== 'allopathic';
                  return (
                    <tr key={item.id || idx} style={{ background: idx % 2 === 0 ? 'white' : '#F5F8FC', borderBottom: '1px solid #E0EAF2' }}>
                      <td style={{ padding: '5px 8px', fontFamily: 'monospace', fontSize: 10, color: '#003F6B', fontWeight: 'bold' }}>{item.apiCode || item.rxcui || 'API-STD'}</td>
                      <td style={{ padding: '5px 8px' }}>
                        <div style={{ fontWeight: 'bold', color: '#1A1A2E' }}>{item.name}</div>
                        {item.classicalText && <div style={{ fontSize: 9, color: '#888', fontStyle: 'italic', marginTop: 1 }}>Ref: {item.classicalText}</div>}
                      </td>
                      <td style={{ padding: '5px 8px' }}>
                        <span style={{ background: isAyur ? '#FFF5E8' : '#EFF5FF', border: `1px solid ${isAyur ? '#F0D0A0' : '#B0C8E0'}`, color: isAyur ? '#8B4500' : '#003F6B', padding: '1px 6px', fontSize: 9, fontWeight: 'bold', borderRadius: 2 }}>
                          {isAyur ? item.kalpana : item.category}
                        </span>
                      </td>
                      <td style={{ padding: '5px 8px', fontSize: 10, color: '#444' }}>{item.indications?.join(', ') || 'General therapy'}</td>
                      <td style={{ padding: '5px 8px', fontFamily: 'monospace', fontSize: 10, color: '#333' }}>{item.standardDose} • {item.defaultAnupana || item.foodRelation || 'Lukewarm water'}</td>
                      <td style={{ padding: '5px 8px' }}>
                        <button
                          onClick={() => handleImportFromApi(item)}
                          style={{ background: '#003F6B', border: '1px solid #002D4E', color: 'white', padding: '3px 10px', cursor: 'pointer', fontSize: 10, fontWeight: 'bold', borderRadius: 2, whiteSpace: 'nowrap' }}
                        >
                          + Import to Rx
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Modal Footer */}
          <div style={{ padding: '8px 14px', background: 'white', borderTop: '1px solid #C5D5E5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: '#666' }}>
            <span>National Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H) Compliant</span>
            <button onClick={() => setShowApiImportModal(false)} style={{ background: '#003F6B', border: '1px solid #002D4E', color: 'white', padding: '4px 16px', cursor: 'pointer', fontSize: 11, fontWeight: 'bold', borderRadius: 2 }}>
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
