import { Users, Volume2, ArrowRight } from 'lucide-react';

export default function OpdQueueRoster({
  queue,
  acceptedCases,
  selectedCase,
  currentView,
  searchQuery,
  setSearchQuery,
  handleSearchPatient,
  activeTabFilter,
  setActiveTabFilter,
  filteredQueue,
  openPatientEncounter,
  handleCallNextToken
}) {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4">

      {/* Session Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Total Registered', val: queue.length, color: '#003F6B', bg: '#E8F0FA', border: '#B0C8E0' },
          { label: 'Waiting in Queue', val: queue.filter(c => !acceptedCases.includes(c.id) && c.status !== 'CONSULTED' && c.id !== (currentView === 'encounter' ? selectedCase?.id : null)).length, color: '#8B4500', bg: '#FFF5E8', border: '#F0D0A0' },
          { label: 'In Room (Active)', val: currentView === 'encounter' && selectedCase ? 1 : (queue.some(c => c.status === 'IN_CONSULTATION') ? 1 : 0), color: '#005A9C', bg: '#EFF6FF', border: '#BFDBFE' },
          { label: 'Consulted / Done', val: acceptedCases.length, color: '#1A7A3C', bg: '#EAF7EE', border: '#A0D8B0' }
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.color}`, padding: '10px 14px', borderRadius: '2px' }}>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: s.color, fontFamily: 'ui-monospace, monospace', lineHeight: 1 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Roster Panel */}
      <div style={{ background: 'white', border: '1px solid #CBD5E1', borderTop: '3px solid #003F6B', borderRadius: '2px' }}>

        {/* Roster Header */}
        <div style={{ background: '#003F6B', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={16} style={{ color: '#FFD700' }} />
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '13px' }}>OPD PATIENT QUEUE & MASTER ROSTER</span>
            <span style={{ background: '#FF6B00', color: 'white', padding: '1px 8px', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', borderRadius: '2px' }}>
              {queue.length} REGISTERED
            </span>
          </div>
          <button
            onClick={handleCallNextToken}
            style={{ background: '#E05000', border: '1px solid #C04000', color: 'white', padding: '6px 14px', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => e.currentTarget.style.background = '#F06010'}
            onMouseLeave={e => e.currentTarget.style.background = '#E05000'}
          >
            <Volume2 size={13} />
            Announce Next Token
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ padding: '10px 16px', background: '#F8FAFC', borderBottom: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flex: 1, minWidth: 280, maxWidth: 420, gap: 0 }}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchPatient()}
              placeholder="Search Token / UHID / CR No / Patient Name..."
              style={{ flex: 1, border: '1px solid #CBD5E1', borderRight: 'none', padding: '7px 10px', fontSize: '11px', outline: 'none', fontFamily: 'monospace' }}
            />
            <button
              onClick={handleSearchPatient}
              style={{ background: '#003F6B', color: 'white', border: '1px solid #002D4E', padding: '7px 14px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
            >
              SEARCH
            </button>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', border: '1px solid #CBD5E1', overflow: 'hidden', borderRadius: '2px' }}>
            {[
              { id: 'all', label: `All (${queue.length})` },
              { id: 'waiting', label: `Waiting (${queue.filter(c => !acceptedCases.includes(c.id) && c.status !== 'CONSULTED' && c.id !== (currentView === 'encounter' ? selectedCase?.id : null)).length})` },
              { id: 'active', label: `Active In Room (${currentView === 'encounter' && selectedCase ? 1 : 0})` },
              { id: 'signed', label: `Consulted (${acceptedCases.length})` }
            ].map((fTab, idx) => (
              <button
                key={fTab.id}
                onClick={() => setActiveTabFilter(fTab.id)}
                style={{
                  padding: '7px 14px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: 'none',
                  borderRight: idx < 3 ? '1px solid #CBD5E1' : 'none',
                  background: activeTabFilter === fTab.id ? '#003F6B' : '#F1F5F9',
                  color: activeTabFilter === fTab.id ? 'white' : '#475569',
                }}
              >
                {fTab.label}
              </button>
            ))}
          </div>

          <span style={{ fontSize: '11px', color: '#64748B', marginLeft: 'auto' }}>
            Click <b>Open Case →</b> to bring patient into consultation room
          </span>
        </div>

        {/* Patient Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#E2E8F0', borderBottom: '2px solid #003F6B' }}>
              {[
                { label: 'Token', w: 80 },
                { label: 'Patient Name', w: 'auto' },
                { label: 'CR No.', w: 130 },
                { label: 'Age / Sex', w: 80 },
                { label: 'ABHA ID', w: 150 },
                { label: 'Chief Complaint', w: 'auto' },
                { label: 'Category', w: 140 },
                { label: 'Wait Time', w: 80 },
                { label: 'OPD Status', w: 130 },
                { label: 'Action', w: 110 }
              ].map(h => (
                <th key={h.label} style={{ padding: '8px 10px', textAlign: 'left', color: '#003F6B', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', width: h.w !== 'auto' ? h.w : undefined, whiteSpace: 'nowrap' }}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredQueue.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '12px' }}>
                  No patients found matching current filter ({activeTabFilter}).
                </td>
              </tr>
            ) : filteredQueue.map((c, idx) => {
              const isSigned = acceptedCases.includes(c.id) || c.status === 'CONSULTED';
              const isActive = (selectedCase?.id === c.id && currentView === 'encounter') || c.status === 'IN_CONSULTATION';
              return (
                <tr
                  key={c.id}
                  style={{
                    background: isSigned ? '#F0FDF4' : isActive ? '#EFF6FF' : idx % 2 === 0 ? 'white' : '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0',
                    borderLeft: isSigned ? '4px solid #1A7A3C' : isActive ? '4px solid #005A9C' : c.redFlag ? '4px solid #AA0000' : '4px solid transparent',
                  }}
                >
                  <td style={{ padding: '9px 10px' }}>
                    <span style={{ background: isSigned ? '#1A7A3C' : isActive ? '#005A9C' : '#003F6B', color: 'white', padding: '2px 7px', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', borderRadius: '2px' }}>
                      {c.token}
                    </span>
                  </td>
                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ fontWeight: 'bold', color: '#0F172A', fontSize: '12px' }}>{c.patient?.name}</div>
                    <div style={{ fontSize: '10px', color: '#64748B', marginTop: 1, fontFamily: 'monospace' }}>UHID: {c.uhid}</div>
                  </td>
                  <td style={{ padding: '9px 10px', fontFamily: 'monospace', fontSize: '11px', color: '#334155' }}>{c.crNo}</td>
                  <td style={{ padding: '9px 10px', fontSize: '11px', color: '#334155' }}>{c.patient?.age}Y / {c.patient?.gender?.[0]}</td>
                  <td style={{ padding: '9px 10px', fontFamily: 'monospace', fontSize: '10px', color: '#003F6B' }}>{c.patient?.abhaId}</td>
                  <td style={{ padding: '9px 10px', fontSize: '11px', color: '#1E293B', maxWidth: 220 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.intake?.complaintLabel}</div>
                    <div style={{ fontSize: '9px', color: '#64748B', fontFamily: 'monospace', marginTop: 1 }}>{c.intake?.namasteCode}</div>
                  </td>
                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ fontSize: '10px', color: '#475569' }}>{c.triageLevel}</div>
                    <div style={{ fontSize: '9px', color: '#64748B', marginTop: 1 }}>{c.patient?.category}</div>
                  </td>
                  <td style={{ padding: '9px 10px', fontSize: '10px', color: '#64748B', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{c.waitTime}</td>
                  <td style={{ padding: '9px 10px' }}>
                    {isSigned ? (
                      <span style={{ background: '#1A7A3C', color: 'white', padding: '3px 8px', fontSize: '10px', fontWeight: 'bold', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        ✓ CONSULTED
                      </span>
                    ) : isActive ? (
                      <span style={{ background: '#005A9C', color: 'white', padding: '3px 8px', fontSize: '10px', fontWeight: 'bold', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        IN CONSULTATION
                      </span>
                    ) : c.redFlag ? (
                      <span style={{ background: '#AA0000', color: 'white', padding: '3px 8px', fontSize: '10px', fontWeight: 'bold', borderRadius: '2px' }}>
                        ⚠ URGENT
                      </span>
                    ) : (
                      <span style={{ background: '#C05000', color: 'white', padding: '3px 8px', fontSize: '10px', fontWeight: 'bold', borderRadius: '2px' }}>
                        ● WAITING
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '9px 10px' }}>
                    <button
                      onClick={() => openPatientEncounter(c)}
                      style={{
                        background: isActive ? '#005A9C' : '#003F6B',
                        border: '1px solid #002D4E',
                        color: 'white',
                        padding: '5px 12px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#005A9C'}
                      onMouseLeave={e => e.currentTarget.style.background = isActive ? '#005A9C' : '#003F6B'}
                    >
                      <ArrowRight size={12} />
                      {isActive ? 'Resume Case' : 'Open Case'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Table Footer */}
        <div style={{ padding: '8px 16px', background: '#F8FAFC', borderTop: '1px solid #CBD5E1', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
          <span>Showing {filteredQueue.length} of {queue.length} registered patients • OPD Room 12 (Unit III)</span>
          <span>AIIA Central HIS • CCIM Registered • ABDM Real-time Queue</span>
        </div>
      </div>
    </div>
  );
}
