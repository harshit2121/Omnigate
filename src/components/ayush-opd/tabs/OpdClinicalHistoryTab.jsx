import { Stethoscope, Flower2 } from 'lucide-react';

export default function OpdClinicalHistoryTab({ selectedCase }) {
  if (!selectedCase) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      
      {/* HPI Panel */}
      <div style={{ background: 'white', border: '1px solid #C5D5E5' }}>
        <div style={{ background: '#003F6B', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Stethoscope size={14} style={{ color: '#FFD700' }} />
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Presenting Complaint & HPI</span>
        </div>
        <div style={{ padding: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <tbody>
              {[
                { label: 'NAMASTE Code', val: selectedCase.intake?.namasteTerm },
                { label: 'Site (स्थान)', val: selectedCase.intake?.answers?.site },
                { label: 'Onset & Duration', val: selectedCase.intake?.answers?.onset },
                { label: 'Character (रूप)', val: selectedCase.intake?.answers?.character },
                { label: 'Radiation', val: selectedCase.intake?.answers?.radiation },
                { label: 'Past Conditions', val: selectedCase.intake?.pastConditions?.join(', ') || 'None' },
                { label: 'Known Allergies', val: selectedCase.intake?.knownAllergies?.join(', ') || 'Nil Known' }
              ].map((row, idx) => (
                <tr key={row.label} style={{ background: idx % 2 === 0 ? '#F8FBFE' : 'white', borderBottom: '1px solid #E8EFF5' }}>
                  <td style={{ padding: '5px 8px', color: '#555', width: '35%', fontWeight: 'bold', fontSize: 10, textTransform: 'uppercase', borderRight: '1px solid #E8EFF5' }}>{row.label}</td>
                  <td style={{ padding: '5px 8px', color: '#1A1A2E', fontWeight: '600' }}>{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 8, padding: '6px 8px', background: '#F0F5FA', border: '1px solid #C5D5E5' }}>
            <div style={{ fontSize: 9, color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>Associated Symptoms:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {Array.isArray(selectedCase.intake?.answers?.associatedSymptoms) && selectedCase.intake.answers.associatedSymptoms.map((sym, i) => (
                <span key={i} style={{ background: 'white', border: '1px solid #C5D5E5', color: '#333', padding: '1px 6px', fontSize: 10, borderRadius: 2 }}>
                  {sym}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pariksha Panel */}
      <div style={{ background: 'white', border: '1px solid #C5D5E5' }}>
        <div style={{ background: '#8B4500', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Flower2 size={14} style={{ color: '#FFD700' }} />
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Prakriti, Vikriti (Δ) & Ashtavidha Pariksha</span>
        </div>
        <div style={{ padding: 12 }}>
          {/* Dosha Bars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
            {[
              { name: 'VATA', pct: selectedCase.pariksha?.prakritiResult?.vataPct || 35, delta: selectedCase.pariksha?.vikritiResult?.delta?.vata || -10, color: '#004D87', bg: '#EFF5FF' },
              { name: 'PITTA', pct: selectedCase.pariksha?.prakritiResult?.pittaPct || 55, delta: selectedCase.pariksha?.vikritiResult?.delta?.pitta || 10, color: '#8B4500', bg: '#FFF5E8' },
              { name: 'KAPHA', pct: selectedCase.pariksha?.prakritiResult?.kaphaPct || 10, delta: selectedCase.pariksha?.vikritiResult?.delta?.kapha || 0, color: '#1A5C40', bg: '#EDFAF2' }
            ].map(d => (
              <div key={d.name} style={{ border: '1px solid #D5D5D5', background: d.bg, padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>{d.name}</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: d.color, fontFamily: 'monospace' }}>{d.pct}%</div>
                <div style={{ fontSize: 9, color: d.delta > 0 ? '#C00' : d.delta < 0 ? '#006' : '#888', fontWeight: 'bold' }}>
                  Δ {d.delta > 0 ? '+' : ''}{d.delta}%
                </div>
              </div>
            ))}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <tbody>
              {[
                { label: 'Prakriti (Base)', val: selectedCase.pariksha?.prakritiResult?.dominant },
                { label: 'Vikriti (Active)', val: selectedCase.pariksha?.vikritiResult?.dominant },
                { label: 'Nadi / Pulse', val: selectedCase.pariksha?.ashtavidha?.nadi },
                { label: 'Jihwa / Tongue', val: selectedCase.pariksha?.ashtavidha?.jihwa },
                { label: 'Mala / Stool', val: selectedCase.pariksha?.ashtavidha?.mala },
                { label: 'Agni / Koshtha', val: `${selectedCase.pariksha?.agni || ''} | ${selectedCase.pariksha?.koshtha || ''}` },
                { label: 'Diet Pattern', val: `${selectedCase.pariksha?.aharaVihara?.diet_type || ''} • ${selectedCase.pariksha?.aharaVihara?.dominant_rasa || ''}` }
              ].map((row, idx) => (
                <tr key={row.label} style={{ background: idx % 2 === 0 ? '#F8FBFE' : 'white', borderBottom: '1px solid #E8EFF5' }}>
                  <td style={{ padding: '5px 8px', color: '#555', width: '38%', fontWeight: 'bold', fontSize: 10, textTransform: 'uppercase', borderRight: '1px solid #E8EFF5' }}>{row.label}</td>
                  <td style={{ padding: '5px 8px', color: '#1A1A2E', fontWeight: '600' }}>{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
