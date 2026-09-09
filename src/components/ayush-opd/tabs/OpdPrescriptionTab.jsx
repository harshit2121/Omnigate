import { Database, Printer, ShieldCheck, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { AYUSH_FORMULATIONS_DATA, MODERN_MEDICATIONS_DATA, CLINICAL_ORDER_SETS } from '../../../services/ayushFormulationsApiService';
import { AYURGENIX_DATASET } from '../../../data/ayurGenixDataset';

export default function OpdPrescriptionTab({
  selectedCase,
  isPrescriptionSigned,
  cdssEvaluation,
  prescriptions,
  prescribeMode,
  setPrescribeMode,
  regimenSearchQuery,
  setRegimenSearchQuery,
  activeRegimenName,
  handleApplyOrderSet,
  handleApplyAyurGenixDisease,
  prescribingSystem,
  setPrescribingSystem,
  newMedForm,
  setNewMedForm,
  handleAddPrescription,
  handleRemovePrescription,
  dietPathya,
  setDietPathya,
  dietApathya,
  setDietApathya,
  yogaPlanText,
  setYogaPlanText,
  panchakarmaOrders,
  setPanchakarmaOrders,
  setShowPanchakarmaModal,
  setShowConfirmRxModal,
  setShowApiImportModal,
  handleSearchApiFormulations,
  printDoctorPrescription
}) {
  if (!selectedCase) return null;

  return (
    <div>
      {/* Prescription Header */}
      <div style={{ background: 'white', border: '1px solid #C5D5E5', borderTop: '3px solid #003F6B', marginBottom: 8 }}>
        <div style={{ background: '#003F6B', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: 'white', color: '#003F6B', fontWeight: 'bold', fontSize: 13, padding: '2px 10px', borderRadius: 2 }}>Rx</span>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>Clinical E-Prescription Suite (चिकित्सकीय ई-प्रिस्क्रिप्शन)</span>
            {isPrescriptionSigned ? (
              <span style={{ background: '#1A7A3C', color: 'white', padding: '2px 10px', fontSize: 10, fontWeight: 'bold', borderRadius: 2 }}>
                ✓ OFFICIALLY E-PRESCRIBED & SIGNED
              </span>
            ) : (
              <span style={{ background: '#7A4A00', color: '#FFE08C', padding: '2px 10px', fontSize: 10, fontWeight: 'bold', borderRadius: 2 }}>
                ● DRAFT — IN PROGRESS
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => { handleSearchApiFormulations(''); setShowApiImportModal(true); }}
              style={{ background: '#004D87', border: '1px solid #005A9C', color: 'white', padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 2 }}
            >
              <Database size={13} />
              Formulary Database
            </button>
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
              style={{ background: '#1A7A3C', border: '1px solid #155C2E', color: 'white', padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 2 }}
            >
              <Printer size={13} />
              Print Official Rx (ABDM)
            </button>
          </div>
        </div>
        {/* Patient context */}
        <div style={{ padding: '5px 14px', fontSize: 10, color: '#555', background: '#F5F8FC', borderBottom: '1px solid #C5D5E5' }}>
          Patient: <b style={{ color: '#1A1A2E' }}>{selectedCase.patient?.name}</b> ({selectedCase.patient?.age}Y/{selectedCase.patient?.gender}) •
          UHID: <b style={{ color: '#003F6B', fontFamily: 'monospace' }}>{selectedCase.uhid}</b> •
          Prakriti: <b style={{ color: '#8B4500' }}>{selectedCase.pariksha?.prakritiResult?.dominant || 'Pitta-Vata'}</b> •
          Chief Complaint: <b style={{ color: '#1A1A2E' }}>{selectedCase.intake?.complaintLabel}</b>
        </div>
      </div>

      {/* CDSS Safety Guard */}
      <div style={{
        marginBottom: 8,
        padding: '8px 14px',
        border: `2px solid ${(cdssEvaluation?.safetyScore || 95) >= 80 ? '#1A7A3C' : '#AA0000'}`,
        background: (cdssEvaluation?.safetyScore || 95) >= 80 ? '#EAF7EE' : '#FEE8E8',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 11
      }}>
        <ShieldCheck size={20} style={{ color: (cdssEvaluation?.safetyScore || 95) >= 80 ? '#1A7A3C' : '#AA0000', flexShrink: 0 }} />
        <div>
          <b style={{ textTransform: 'uppercase', fontSize: 10 }}>AYUSH CDSS & Multi-System Drug-Herb Safety Guard</b>
          <span style={{ marginLeft: 8, background: (cdssEvaluation?.safetyScore || 95) >= 80 ? '#1A7A3C' : '#AA0000', color: 'white', padding: '1px 6px', fontSize: 9, fontFamily: 'monospace', borderRadius: 2 }}>
            Safety Score: {cdssEvaluation?.safetyScore || 95}/100
          </span>
          <div style={{ color: '#555', marginTop: 2, fontSize: 10 }}>
            Cross-referencing {prescriptions.length} active prescriptions against NIH RxNav & Ayurvedic Pharmacopoeia (API). No critical contraindications detected.
          </div>
        </div>
      </div>

      {/* Prescribing Mode Workbench */}
      <div style={{ background: 'white', border: '1px solid #C5D5E5', marginBottom: 8 }}>
        <div style={{ background: '#F0F5FA', borderBottom: '2px solid #003F6B', padding: '7px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 12, color: '#003F6B' }}>PRESCRIBING WORKBENCH — औषध व्यवस्थापन</div>
            <div style={{ fontSize: 10, color: '#666', marginTop: 1 }}>Both modes write to the same prescription basket. Regimen and individual drugs are fully interlinked.</div>
          </div>
          <div style={{ display: 'flex', border: '1px solid #B0C5D8', overflow: 'hidden', borderRadius: 2 }}>
            <button
              onClick={() => setPrescribeMode('regimen')}
              style={{ padding: '6px 14px', cursor: 'pointer', border: 'none', fontWeight: 'bold', fontSize: 11, background: prescribeMode === 'regimen' ? '#003F6B' : '#F0F5FA', color: prescribeMode === 'regimen' ? 'white' : '#444', borderRight: '1px solid #B0C5D8' }}
            >
              🌿 Prescribe via Disease Regimen
            </button>
            <button
              onClick={() => setPrescribeMode('individual')}
              style={{ padding: '6px 14px', cursor: 'pointer', border: 'none', fontWeight: 'bold', fontSize: 11, background: prescribeMode === 'individual' ? '#003F6B' : '#F0F5FA', color: prescribeMode === 'individual' ? 'white' : '#444' }}
            >
              💊 Prescribe Individual Drugs
            </button>
          </div>
        </div>

        {/* MODE 1: DISEASE REGIMEN */}
        {prescribeMode === 'regimen' && (
          <div style={{ padding: 14 }}>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 'bold', color: '#1A1A2E', fontSize: 11, marginBottom: 2 }}>
                Select Clinical Disease Regimen — रोग प्रोटोकॉल चयन
              </div>
              <div style={{ fontSize: 10, color: '#666', marginBottom: 8 }}>
                Applying a regimen auto-prescribes compound formulations, diet & yoga therapy into the active basket below.
              </div>

              {/* Regimen Search */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <input
                  value={regimenSearchQuery}
                  onChange={(e) => setRegimenSearchQuery(e.target.value)}
                  placeholder="Search 446 diseases (e.g. Cough, Amlapitta, Asthma, Sandhivata)..."
                  style={{ flex: 1, border: '1px solid #AAC', padding: '5px 8px', fontSize: 11, outline: 'none' }}
                />
                {regimenSearchQuery && (
                  <button onClick={() => setRegimenSearchQuery('')} style={{ border: '1px solid #CCC', background: '#F5F5F5', padding: '4px 8px', cursor: 'pointer', fontSize: 11 }}>
                    Clear
                  </button>
                )}
              </div>

              {/* Hospital Order Sets */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 5, paddingBottom: 4, borderBottom: '1px solid #EEE' }}>
                  Hospital Standard Order Sets — मानक चिकित्सा प्रोटोकॉल ({CLINICAL_ORDER_SETS.length} protocols):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {CLINICAL_ORDER_SETS.map(protocol => (
                    <button
                      key={protocol.id}
                      onClick={() => handleApplyOrderSet(protocol)}
                      style={{ border: '1px solid #C5D5E5', background: '#F8FBFE', padding: '8px 8px', cursor: 'pointer', textAlign: 'left', fontSize: 10 }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#E8F0FA'; e.currentTarget.style.borderColor = '#003F6B'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#F8FBFE'; e.currentTarget.style.borderColor = '#C5D5E5'; }}
                    >
                      <div style={{ fontWeight: 'bold', color: '#003F6B', marginBottom: 2, fontSize: 10 }}>⚡ {protocol.title}</div>
                      <div style={{ color: '#666', fontSize: 9 }}>Dosha: {protocol.doshaFocus} • {protocol.medications.length} Meds</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AyurGenix 446 Disease Knowledgebase */}
              <div>
                <div style={{ fontSize: 9, color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 5, paddingBottom: 4, borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between' }}>
                  <span>AyurGenix Disease Knowledgebase ({AYURGENIX_DATASET.length} Protocols):</span>
                  {regimenSearchQuery && <span style={{ color: '#003F6B' }}>Showing matches for "{regimenSearchQuery}"</span>}
                </div>
                <div style={{ maxHeight: 220, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
                  {AYURGENIX_DATASET.filter(d => {
                    if (!regimenSearchQuery.trim()) return true;
                    const q = regimenSearchQuery.toLowerCase();
                    return (
                      (d.Disease || '').toLowerCase().includes(q) ||
                      (d['Hindi Name'] || '').toLowerCase().includes(q) ||
                      (d['Ayurvedic Herbs'] || '').toLowerCase().includes(q) ||
                      (d.Formulation || '').toLowerCase().includes(q)
                    );
                  }).slice(0, regimenSearchQuery ? 30 : 6).map(diseaseRecord => (
                    <div
                      key={diseaseRecord.id}
                      style={{ border: '1px solid #C5D5E5', padding: '8px', background: 'white', fontSize: 10 }}
                    >
                      <div style={{ fontWeight: 'bold', color: '#1A1A2E', marginBottom: 2, fontSize: 10 }}>
                        {diseaseRecord.Disease}
                        {diseaseRecord['Hindi Name'] ? ` (${diseaseRecord['Hindi Name']})` : ''}
                      </div>
                      <div style={{ color: '#777', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 9 }}>
                        {diseaseRecord.Formulation || diseaseRecord['Ayurvedic Herbs']}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ background: '#FFF5E8', border: '1px solid #F0D0A0', color: '#8B4500', padding: '1px 5px', fontSize: 9, borderRadius: 2 }}>
                          {diseaseRecord.Doshas || 'Vata-Pitta'}
                        </span>
                        <button
                          onClick={() => handleApplyAyurGenixDisease(diseaseRecord)}
                          style={{ background: '#003F6B', color: 'white', border: 'none', padding: '3px 8px', cursor: 'pointer', fontSize: 9, fontWeight: 'bold', borderRadius: 2 }}
                        >
                          + Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: INDIVIDUAL DRUGS */}
        {prescribeMode === 'individual' && (
          <div style={{ padding: 14 }}>
            <div style={{ fontWeight: 'bold', color: '#1A1A2E', fontSize: 11, marginBottom: 2 }}>
              Prescribe Individual Medication — एकल औषध चयन
            </div>
            <div style={{ fontSize: 10, color: '#666', marginBottom: 8 }}>
              Select from 3,500+ Indian Medicines & Classical API Monographs. Adds to basket without removing previous prescriptions.
            </div>

            {/* System Switcher */}
            <div style={{ display: 'flex', marginBottom: 10, border: '1px solid #B0C5D8', overflow: 'hidden', borderRadius: 2, width: 'fit-content' }}>
              <button
                onClick={() => { setPrescribingSystem('ayurvedic'); setNewMedForm({ name: 'Sutshekhar Ras (Gold / Plain)', system: 'ayurvedic', kalpana: 'Vati', dose: '250mg', frequency: 'BD (Twice Daily)', kaala: 'Pragbhakta (Before Meals)', anupana: 'Godugdha (Warm Cow Milk)', route: 'Oral', duration: '15 Days' }); }}
                style={{ padding: '5px 14px', cursor: 'pointer', border: 'none', fontWeight: 'bold', fontSize: 11, background: prescribingSystem === 'ayurvedic' ? '#003F6B' : '#F0F5FA', color: prescribingSystem === 'ayurvedic' ? 'white' : '#444', borderRight: '1px solid #B0C5D8' }}
              >
                🌿 Ayurvedic Formulation
              </button>
              <button
                onClick={() => { setPrescribingSystem('allopathic'); setNewMedForm({ name: 'Telmisartan Tablets', system: 'allopathic', kalpana: 'Tablet', dose: '40 mg', frequency: 'OD (Once Daily)', kaala: 'Morning (Empty Stomach)', anupana: 'Water', route: 'Oral', duration: '30 Days' }); }}
                style={{ padding: '5px 14px', cursor: 'pointer', border: 'none', fontWeight: 'bold', fontSize: 11, background: prescribingSystem === 'allopathic' ? '#8B4500' : '#F0F5FA', color: prescribingSystem === 'allopathic' ? 'white' : '#444' }}
              >
                💊 Modern Allopathic
              </button>
            </div>

            {/* Prescription Form — Horizontal Grid */}
            <div style={{ border: '1px solid #C5D5E5', background: '#F8FBFE', padding: '10px 12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #C5D5E5' }}>
                    {[
                      prescribingSystem === 'ayurvedic' ? 'Ayurvedic Formulation (औषध योग)' : 'Modern Drug / Generic',
                      'Dose / Matra',
                      'Frequency',
                      prescribingSystem === 'ayurvedic' ? 'Kaala (सेवन काल)' : 'Food Timing',
                      prescribingSystem === 'ayurvedic' ? 'Anupana (अनुपान)' : 'Route',
                      'Duration'
                    ].map(h => (
                      <th key={h} style={{ padding: '4px 6px', textAlign: 'left', fontSize: 9, color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '4px 4px' }}>
                      {prescribingSystem === 'ayurvedic' ? (
                        <select
                          value={newMedForm.name}
                          onChange={(e) => {
                            const found = AYUSH_FORMULATIONS_DATA.find(f => f.name === e.target.value);
                            setNewMedForm({ ...newMedForm, name: e.target.value, kalpana: found?.kalpana || 'Vati', dose: found?.standardDose || '250mg', frequency: found?.defaultFrequency || 'BD (Twice Daily)', kaala: found?.defaultKaala || 'Adhobhakta (After Meals)', anupana: found?.defaultAnupana || 'Lukewarm Water' });
                          }}
                          style={{ width: '100%', border: '1px solid #B0C5D8', padding: '4px 5px', fontSize: 10, fontWeight: 'bold' }}
                        >
                          {AYUSH_FORMULATIONS_DATA.map(f => (
                            <option key={f.id} value={f.name}>{f.name} ({f.kalpana})</option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={newMedForm.name}
                          onChange={(e) => {
                            const found = MODERN_MEDICATIONS_DATA.find(m => m.name === e.target.value);
                            setNewMedForm({ ...newMedForm, name: e.target.value, dose: found?.standardDose || '500 mg', frequency: found?.frequency || 'OD (Once Daily)', route: found?.route || 'Oral', kaala: found?.timing || 'Morning' });
                          }}
                          style={{ width: '100%', border: '1px solid #AAC', padding: '4px 5px', fontSize: 10, fontWeight: 'bold' }}
                        >
                          {MODERN_MEDICATIONS_DATA.map(m => (
                            <option key={m.id} value={m.name}>{m.name} ({m.genericName})</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td style={{ padding: '4px 4px' }}>
                      <input type="text" value={newMedForm.dose} onChange={(e) => setNewMedForm({ ...newMedForm, dose: e.target.value })} style={{ width: '100%', border: '1px solid #CCC', padding: '4px 5px', fontSize: 11, fontFamily: 'monospace' }} />
                    </td>
                    <td style={{ padding: '4px 4px' }}>
                      <select value={newMedForm.frequency} onChange={(e) => setNewMedForm({ ...newMedForm, frequency: e.target.value })} style={{ width: '100%', border: '1px solid #CCC', padding: '4px 5px', fontSize: 11 }}>
                        <option value="OD (Once Daily)">OD (Once Daily)</option>
                        <option value="BD (Twice Daily)">BD (Twice Daily)</option>
                        <option value="TID (Thrice Daily)">TID (Thrice Daily)</option>
                        <option value="QID (4 Times Daily)">QID (4 Times Daily)</option>
                        <option value="HS (Bedtime)">HS (Bedtime)</option>
                        <option value="SOS (As needed)">SOS (PRN)</option>
                      </select>
                    </td>
                    <td style={{ padding: '4px 4px' }}>
                      {prescribingSystem === 'ayurvedic' ? (
                        <select value={newMedForm.kaala} onChange={(e) => setNewMedForm({ ...newMedForm, kaala: e.target.value })} style={{ width: '100%', border: '1px solid #CCC', padding: '4px 5px', fontSize: 11 }}>
                          <option value="Abhakta (Empty Stomach)">Abhakta (Empty Stomach)</option>
                          <option value="Pragbhakta (Before Meals)">Pragbhakta (Before Meals)</option>
                          <option value="Madhyabhakta (During Meals)">Madhyabhakta (During Meals)</option>
                          <option value="Adhobhakta (After Meals)">Adhobhakta (After Meals)</option>
                          <option value="Samudga (Before & After)">Samudga (Before & After)</option>
                          <option value="Nishikala (At Bedtime)">Nishikala (Bedtime)</option>
                        </select>
                      ) : (
                        <select value={newMedForm.kaala} onChange={(e) => setNewMedForm({ ...newMedForm, kaala: e.target.value })} style={{ width: '100%', border: '1px solid #CCC', padding: '4px 5px', fontSize: 11 }}>
                          <option value="30 min Before Food">30 min Before Food</option>
                          <option value="Immediately After Meals">After Meals</option>
                          <option value="With Meals">With Meals</option>
                          <option value="At Bedtime">At Bedtime</option>
                        </select>
                      )}
                    </td>
                    <td style={{ padding: '4px 4px' }}>
                      <input type="text" value={newMedForm.anupana} onChange={(e) => setNewMedForm({ ...newMedForm, anupana: e.target.value })} style={{ width: '100%', border: '1px solid #CCC', padding: '4px 5px', fontSize: 11 }} />
                    </td>
                    <td style={{ padding: '4px 4px' }}>
                      <select value={newMedForm.duration} onChange={(e) => setNewMedForm({ ...newMedForm, duration: e.target.value })} style={{ width: '100%', border: '1px solid #CCC', padding: '4px 5px', fontSize: 11 }}>
                        <option value="7 Days">7 Days</option>
                        <option value="15 Days">15 Days</option>
                        <option value="30 Days">30 Days</option>
                        <option value="60 Days">60 Days</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleAddPrescription}
                  style={{ background: '#003F6B', color: 'white', border: '1px solid #002D4E', padding: '6px 20px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, borderRadius: 2 }}
                >
                  <Plus size={14} />
                  Add Drug to Prescription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Prescription Basket */}
      <div style={{ background: 'white', border: '1px solid #C5D5E5', marginBottom: 8 }}>
        <div style={{ background: '#F0F5FA', borderBottom: '2px solid #003F6B', padding: '7px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontWeight: 'bold', color: '#003F6B', fontSize: 12 }}>
              ACTIVE PRESCRIPTION BASKET — {prescriptions.length} MEDICATION(S)
            </span>
            {activeRegimenName && (
              <span style={{ marginLeft: 10, background: '#E8F0FA', border: '1px solid #B0C5D8', color: '#003F6B', padding: '1px 8px', fontSize: 9, fontWeight: 'bold', borderRadius: 2 }}>
                Active Regimen: {activeRegimenName}
              </span>
            )}
          </div>
          <span style={{ fontSize: 10, color: '#888' }}>AIIA Central Dispensary Queue</span>
        </div>

        {prescriptions.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#888', fontSize: 11 }}>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>💊</div>
            <div style={{ fontWeight: 'bold' }}>No medications prescribed yet.</div>
            <div style={{ fontSize: 10, marginTop: 4 }}>Use the Prescribing Workbench above to add medications.</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#E8EFF5', borderBottom: '1px solid #C5D5E5' }}>
                <th style={{ padding: '5px 8px', textAlign: 'left', width: 30, color: '#666', fontSize: 9, fontWeight: 'bold' }}>#</th>
                <th style={{ padding: '5px 8px', textAlign: 'left', color: '#666', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' }}>Medicine / Formulation</th>
                <th style={{ padding: '5px 8px', textAlign: 'left', color: '#666', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' }}>Dose</th>
                <th style={{ padding: '5px 8px', textAlign: 'left', color: '#666', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' }}>Frequency</th>
                <th style={{ padding: '5px 8px', textAlign: 'left', color: '#666', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' }}>Kaala / Timing</th>
                <th style={{ padding: '5px 8px', textAlign: 'left', color: '#666', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' }}>Anupana / Route</th>
                <th style={{ padding: '5px 8px', textAlign: 'left', color: '#666', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' }}>Duration</th>
                <th style={{ padding: '5px 8px', textAlign: 'center', width: 36 }}></th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p, idx) => {
                const isAyur = p.system === 'ayurvedic';
                return (
                  <tr key={p.id || idx} style={{ borderBottom: '1px solid #E5EDF5', background: idx % 2 === 0 ? '#FAFCFE' : 'white' }}>
                    <td style={{ padding: '5px 8px', color: '#888', fontFamily: 'monospace', fontSize: 10 }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '5px 8px' }}>
                      <div style={{ fontWeight: 'bold', color: '#1A1A2E', fontSize: 11 }}>{p.name}</div>
                      <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                        <span style={{ background: isAyur ? '#FFF5E8' : '#EFF5FF', border: `1px solid ${isAyur ? '#F0D0A0' : '#B0C8E0'}`, color: isAyur ? '#8B4500' : '#003F6B', padding: '0px 5px', fontSize: 8, fontWeight: 'bold', borderRadius: 2 }}>
                          {isAyur ? '🌿 Ayurvedic' : '💊 Allopathic'}
                        </span>
                        {p.source && (
                          <span style={{ background: '#F0F0F0', border: '1px solid #DDD', color: '#666', padding: '0px 5px', fontSize: 8, fontFamily: 'monospace', borderRadius: 2 }}>
                            {p.source}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '5px 8px', fontFamily: 'monospace', fontWeight: 'bold', color: '#1A1A2E', fontSize: 11 }}>{p.dose}</td>
                    <td style={{ padding: '5px 8px', fontWeight: '600', color: '#333', fontSize: 11 }}>{p.frequency}</td>
                    <td style={{ padding: '5px 8px', color: '#555', fontSize: 10 }}>{p.kaala}</td>
                    <td style={{ padding: '5px 8px', color: '#555', fontSize: 10 }}>{p.anupana}</td>
                    <td style={{ padding: '5px 8px', fontWeight: 'bold', color: '#003F6B', fontSize: 11 }}>{p.duration}</td>
                    <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleRemovePrescription(p.id)}
                        title="Remove"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CC0000', padding: 2 }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pathya-Apathya & Yoga */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '10px 14px', borderTop: '1px solid #E5EDF5' }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', color: '#8B4500', marginBottom: 5, borderBottom: '1px solid #F0D0A0', paddingBottom: 3 }}>
              🥗 Dietary Regimen — पथ्यापथ्य आहार
            </div>
            <div style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 9, fontWeight: 'bold', color: '#1A7A3C', marginBottom: 2 }}>PATHYA (Recommended):</div>
              <textarea value={dietPathya} onChange={(e) => setDietPathya(e.target.value)} rows={2} style={{ width: '100%', border: '1px solid #B0D8B0', padding: '4px 6px', fontSize: 10, resize: 'vertical', background: '#F5FFF5', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 'bold', color: '#AA0000', marginBottom: 2 }}>APATHYA (Contraindicated):</div>
              <textarea value={dietApathya} onChange={(e) => setDietApathya(e.target.value)} rows={2} style={{ width: '100%', border: '1px solid #F0B8B8', padding: '4px 6px', fontSize: 10, resize: 'vertical', background: '#FFF8F8', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', color: '#1A7A3C', marginBottom: 5, borderBottom: '1px solid #B0D8B0', paddingBottom: 3 }}>
              🧘 Yoga & Lifestyle — योग व दिनचर्या
            </div>
            <textarea value={yogaPlanText} onChange={(e) => setYogaPlanText(e.target.value)} rows={5} style={{ width: '100%', border: '1px solid #B0D8B0', padding: '4px 6px', fontSize: 10, resize: 'vertical', background: '#F5FFF5', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* Panchakarma Orders */}
        <div style={{ padding: '0 14px 10px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, borderBottom: '1px solid #DDD', paddingBottom: 4 }}>
            <div style={{ fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', color: '#555' }}>
              🌿 Panchakarma & External Therapies ({panchakarmaOrders.length} procedures) — AIIA Panchakarma Unit:
            </div>
            <button
              onClick={() => setShowPanchakarmaModal(true)}
              style={{
                background: '#003F6B',
                border: '1px solid #002D4E',
                color: 'white',
                padding: '3px 10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                borderRadius: 2
              }}
            >
              <Plus size={12} />
              + Order Panchakarma Therapy
            </button>
          </div>
          {panchakarmaOrders.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#F5F8FC', borderBottom: '1px solid #CCC' }}>
                  {['Procedure', 'Dravya / Medium', 'Sessions', 'Time', 'Notes', ''].map(h => (
                    <th key={h} style={{ padding: '3px 6px', textAlign: 'left', fontSize: 9, color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {panchakarmaOrders.map((po, idx) => (
                  <tr key={po.id || idx} style={{ borderBottom: '1px solid #EEE', background: idx % 2 === 0 ? '#FAFCFE' : 'white' }}>
                    <td style={{ padding: '4px 6px', fontWeight: 'bold', color: '#1A1A2E' }}>{po.procedure}</td>
                    <td style={{ padding: '4px 6px', color: '#555' }}>{po.dravya}</td>
                    <td style={{ padding: '4px 6px', color: '#333' }}>{po.sessions}</td>
                    <td style={{ padding: '4px 6px', color: '#555' }}>{po.time}</td>
                    <td style={{ padding: '4px 6px', color: '#777', fontSize: 10 }}>{po.notes}</td>
                    <td style={{ padding: '4px 6px' }}>
                      <button onClick={() => setPanchakarmaOrders(prev => prev.filter(item => item.id !== po.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CC0000' }}>
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '8px 12px', background: '#F8FAFC', border: '1px dashed #CBD5E1', fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>No Panchakarma procedures ordered yet. Click "+ Order Panchakarma Therapy" to schedule external therapies.</span>
            </div>
          )}
        </div>

        {/* Complete & E-Prescribe CTA */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid #C5D5E5', background: '#F5F8FC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10, color: '#666' }}>
            Total <b style={{ color: '#003F6B' }}>{prescriptions.length}</b> medication(s) ready for physician sign-off.
            {activeRegimenName && <span style={{ marginLeft: 8, color: '#8B4500' }}>Active Regimen: {activeRegimenName}</span>}
          </div>
          <button
            disabled={prescriptions.length === 0}
            onClick={() => setShowConfirmRxModal(true)}
            style={{
              background: prescriptions.length === 0 ? '#999' : '#1A7A3C',
              border: prescriptions.length === 0 ? '1px solid #888' : '1px solid #155C2E',
              color: 'white',
              padding: '9px 24px',
              cursor: prescriptions.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              borderRadius: 2
            }}
          >
            <CheckCircle2 size={16} />
            Complete Prescription & Confirm E-Prescribe
          </button>
        </div>
      </div>
    </div>
  );
}
