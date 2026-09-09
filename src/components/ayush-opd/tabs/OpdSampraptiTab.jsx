export default function OpdSampraptiTab({
  selectedCase,
  sampraptiSynthesis,
  handleOverrideGhataka
}) {
  if (!sampraptiSynthesis) return null;

  return (
    <div style={{ background: 'white', border: '1px solid #C5D5E5' }}>
      
      <div style={{ background: '#003F6B', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: '#FFD700', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
            AIIA Clinical Workstation • निदान-संप्राप्ति पत्रक
          </div>
          <div style={{ color: 'white', fontSize: 13, fontWeight: 'bold', marginTop: 2 }}>
            Samprapti Ghataka Diagnostic Chart — Classical Ayurvedic Pathophysiology
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ background: '#FF6B00', color: 'white', padding: '2px 8px', fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold', borderRadius: 2 }}>
            {selectedCase?.intake?.namasteCode || 'NAMASTE-AYU-AML-01'}
          </span>
          <span style={{ background: '#004D87', border: '1px solid #005A9C', color: '#90C8FF', padding: '2px 8px', fontSize: 9, fontFamily: 'monospace', borderRadius: 2 }}>
            ICD-11: {selectedCase?.intake?.icd11Code || 'MD12.0'}
          </span>
        </div>
      </div>

      {/* Ghataka Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr style={{ background: '#F0F5FA', borderBottom: '2px solid #003F6B' }}>
            <th style={{ padding: '6px 12px', textAlign: 'left', width: '35%', color: '#003F6B', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', borderRight: '1px solid #C5D5E5' }}>
              Ghataka (घटक) — Clinical Factor
            </th>
            <th style={{ padding: '6px 12px', textAlign: 'left', color: '#003F6B', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>
              Synthesized Clinical Value (AI-Assisted Samprapti)
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            { key: 'hetu', labelHi: '1. निदान / हेतु — Etiological Factors', val: sampraptiSynthesis.ghatakas?.hetu?.value },
            { key: 'dosha', labelHi: '2. दोष एवं गति — Dosha & Doshagati', val: `${sampraptiSynthesis.ghatakas?.dosha?.value || ''} • Gati: ${sampraptiSynthesis.ghatakas?.dosha?.doshagati || ''} • Δ Surge: +${sampraptiSynthesis.ghatakas?.dosha?.deltaSurge || 10}%` },
            { key: 'dushya', labelHi: '3. दूष्य — Afflicted Dhatu / Tissues', val: sampraptiSynthesis.ghatakas?.dushya?.value },
            { key: 'srotas', labelHi: '4. स्रोतस एवं मूल — Srotas Involved', val: sampraptiSynthesis.ghatakas?.srotas?.value },
            { key: 'srotodushti', labelHi: '5. स्रोतोदुष्टि — Srotodushti Mode', isOverrideSelect: true, val: sampraptiSynthesis.ghatakas?.srotodushti?.value },
            { key: 'agni', labelHi: '6. अग्नि एवं आम — Agni & Ama State', val: sampraptiSynthesis.ghatakas?.agni?.value },
            { key: 'udbhavasthana', labelHi: '7. उद्भवस्थान — Primary Accumulation Site', val: sampraptiSynthesis.ghatakas?.udbhavasthana?.value },
            { key: 'sancharasthana', labelHi: '8. संचारस्थान — Dissemination Pathway', val: sampraptiSynthesis.ghatakas?.sancharasthana?.value },
            { key: 'sthanaSamsraya', labelHi: '9. स्थानसंश्रय — Site of Relocalization', val: sampraptiSynthesis.ghatakas?.sthanaSamsraya?.value },
            { key: 'vyaktasthana', labelHi: '10. व्यक्तस्थान — Clinical Manifestation', val: sampraptiSynthesis.ghatakas?.vyaktasthana?.value },
            { key: 'rogamarga', labelHi: '11. रोगमार्ग — Disease Pathway', val: sampraptiSynthesis.ghatakas?.rogamarga?.value },
            { key: 'sadhyasadhyata', labelHi: '12. साध्यासाध्यता — Prognosis', val: sampraptiSynthesis.ghatakas?.sadhyasadhyata?.value },
            { key: 'chikitsaSutra', labelHi: '13. चिकित्सा सूत्र — Line of Treatment', val: sampraptiSynthesis.ghatakas?.chikitsaSutra?.value }
          ].map((row, idx) => (
            <tr key={row.key} style={{ background: idx % 2 === 0 ? '#F8FBFE' : 'white', borderBottom: '1px solid #E0EAF2' }}>
              <td style={{ padding: '7px 12px', borderRight: '1px solid #C5D5E5', verticalAlign: 'middle' }}>
                <span style={{ fontWeight: 'bold', color: '#003F6B', fontSize: 11 }}>{row.labelHi}</span>
              </td>
              <td style={{ padding: '7px 12px', verticalAlign: 'middle' }}>
                {row.isOverrideSelect ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <select
                      value={sampraptiSynthesis.ghatakas?.srotodushti?.value || 'Vimargagamana'}
                      onChange={(e) => handleOverrideGhataka('srotodushti', e.target.value)}
                      style={{ flex: 1, border: '2px solid #AA0000', padding: '3px 6px', fontSize: 11, fontWeight: 'bold', color: '#1A1A2E', background: '#FFF8F8', cursor: 'pointer' }}
                    >
                      <option value="Vimargagamana (Reversed / False Flow)">Vimargagamana (Reversed Flow / Reflux)</option>
                      <option value="Sanga (Obstruction / Functional Stasis)">Sanga (Obstruction / Stasis)</option>
                      <option value="Atipravritti (Excessive Outflow / Hypersecretion)">Atipravritti (Excessive Flow)</option>
                      <option value="Siragranthi (Dilation / Nodular Formation)">Siragranthi (Nodules / Dilation)</option>
                    </select>
                    <span style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '2px 6px', fontSize: 9, fontWeight: 'bold', borderRadius: 2, whiteSpace: 'nowrap' }}>
                      Vaidya Override
                    </span>
                  </div>
                ) : (
                  <span style={{ fontWeight: 'bold', color: '#1A1A2E' }}>{row.val}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Rationale Box */}
      <div style={{ margin: 12, padding: '10px 14px', background: '#EFF5FB', border: '1px solid #B0C8E0', borderLeft: '4px solid #003F6B' }}>
        <div style={{ color: '#003F6B', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 6 }}>
          वैद्यकीय संप्राप्ति विवेचन — Physician Pathophysiological Rationale
        </div>
        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#333', lineHeight: 1.7 }}>
          {sampraptiSynthesis.traceableRationale?.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
