import { FileText, Edit3, Save } from 'lucide-react';

export default function OpdEmrCaseSheetTab({
  isEditing,
  setIsEditing,
  activeSummaryText,
  setEditedNotes
}) {
  return (
    <div style={{ background: 'white', border: '1px solid #C5D5E5' }}>
      <div style={{ background: '#003F6B', padding: '7px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={15} style={{ color: '#FFD700' }} />
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Synthesized Clinical Case Sheet — AIIA OPD EMR</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{ background: '#004D87', border: '1px solid #005A9C', color: 'white', padding: '4px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 2 }}
        >
          <Edit3 size={13} />
          {isEditing ? 'View Mode' : 'Edit EMR'}
        </button>
      </div>
      <div style={{ padding: 14 }}>
        {isEditing ? (
          <div>
            <textarea
              value={activeSummaryText}
              onChange={(e) => setEditedNotes(e.target.value)}
              rows={18}
              style={{ width: '100%', border: '1px solid #CCC', padding: '8px', fontFamily: 'Courier New, monospace', fontSize: 11, lineHeight: 1.6, background: '#FAFAFA', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                onClick={() => setIsEditing(false)}
                style={{ background: '#8B4500', border: '1px solid #6A3300', color: 'white', padding: '6px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, borderRadius: 2 }}
              >
                <Save size={13} />
                Save EMR Notes
              </button>
            </div>
          </div>
        ) : (
          <pre style={{ background: '#F5F8FC', padding: '12px 14px', fontSize: 11, fontFamily: 'Courier New, monospace', color: '#1A1A2E', whiteSpace: 'pre-wrap', lineHeight: 1.65, border: '1px solid #C5D5E5', overflowX: 'auto' }}>
            {activeSummaryText}
          </pre>
        )}
      </div>
    </div>
  );
}
