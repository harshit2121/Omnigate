import React, { useState, useEffect } from 'react';
import { Volume2, Users, Clock, AlertTriangle, ShieldCheck, ArrowLeft, RefreshCw, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { voiceAssistant } from '../services/voiceAssistant';

export default function OpdWaitingDisplay() {
  const [queue, setQueue] = useState([]);
  const [activeCase, setActiveCase] = useState(null);
  const [lastAnnouncedToken, setLastAnnouncedToken] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Keep clock running
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll / Read from localStorage for live synchronization with doctor's workstation
  const loadQueueData = () => {
    try {
      const storedQueue = localStorage.getItem('omni_kiosk_queue');
      const storedActive = localStorage.getItem('omni_active_opd_case');

      if (storedQueue) {
        const parsed = JSON.parse(storedQueue);
        if (Array.isArray(parsed)) {
          setQueue(parsed);
        }
      }

      if (storedActive) {
        const parsedActive = JSON.parse(storedActive);
        setActiveCase(parsedActive);
      } else {
        // Fallback: check if any in queue has IN_CONSULTATION
        if (storedQueue) {
          const parsed = JSON.parse(storedQueue);
          const activeInQ = parsed.find(c => c.status === 'IN_CONSULTATION');
          if (activeInQ) setActiveCase(activeInQ);
        }
      }
    } catch (e) {
      console.error('Error loading OPD queue for TV display:', e);
    }
  };

  useEffect(() => {
    loadQueueData();
    const interval = setInterval(loadQueueData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Announce token with chime
  const announceToken = (c) => {
    if (!c) return;
    setLastAnnouncedToken(c.token);
    voiceAssistant.playAudioCue('alert');
    voiceAssistant.speak(`टोकन नंबर ${c.token}, मरीज ${c.patient?.name}, परामर्श कक्ष 12 में आएं। Token number ${c.token}, please proceed to OPD Room 12.`);
  };

  const waitingPatients = queue.filter(c => c.status !== 'CONSULTED' && c.id !== activeCase?.id);
  const consultedPatients = queue.filter(c => c.status === 'CONSULTED');

  const dateStr = currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between select-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. TOP HOSPITAL IDENTITY BANNER */}
      <header className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-b-4 border-amber-500 px-6 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/ayush-opd" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition">
              <ArrowLeft size={14} /> Back to Doctor OPD
            </Link>
            <div className="w-10 h-10 bg-amber-500 rounded flex items-center justify-center text-xl font-black text-slate-900 shadow">
              🌿
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                भारत सरकार • Ministry of Ayush • AIIA New Delhi
              </div>
              <h1 className="text-xl font-black text-white tracking-wide">
                AYUSH OPD REAL-TIME PATIENT CALLING & WAITING DISPLAY
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6 text-right">
            <div className="bg-slate-800/80 border border-slate-700 px-4 py-1.5 rounded text-left">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">OPD Room / Unit</div>
              <div className="text-sm font-black text-amber-400">ROOM 12 • KAYA CHIKITSA</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400 font-mono tracking-wider">{timeStr}</div>
              <div className="text-xs text-slate-400 font-medium">{dateStr}</div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN TV DISPLAY AREA */}
      <main className="max-w-7xl mx-auto w-full flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (7 COLS): ACTIVE TOKEN CALLOUT HERO */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* NOW CALLING CARD */}
          <div className="bg-gradient-to-b from-blue-950 to-slate-900 border-2 border-amber-500/80 rounded-lg p-6 shadow-2xl relative overflow-hidden">
            {/* Blinking Live Indicator */}
            <div className="flex items-center justify-between border-b border-blue-900/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-black tracking-widest text-emerald-400 uppercase">
                  ● NOW CALLING IN ROOM 12 (वर्तमान टोकन)
                </span>
              </div>
              
              {activeCase && (
                <button
                  onClick={() => announceToken(activeCase)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-1.5 rounded text-xs flex items-center gap-2 shadow transition"
                >
                  <Volume2 size={15} /> Repeat Audio Call
                </button>
              )}
            </div>

            {activeCase ? (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Token Number</span>
                    <div className="text-6xl font-black text-amber-400 font-mono tracking-tight drop-shadow-md">
                      {activeCase.token}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consulting Room</span>
                    <div className="text-4xl font-black text-white">ROOM 12</div>
                    <div className="text-xs text-amber-400 font-semibold">Unit III • Ground Floor</div>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-md p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Patient Name (रोगी का नाम)</div>
                    <div className="text-2xl font-black text-white tracking-wide">{activeCase.patient?.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {activeCase.patient?.age}Y / {activeCase.patient?.gender} • CR: <span className="font-mono text-slate-300">{activeCase.crNo}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-bold uppercase">Attending Vaidya</div>
                    <div className="text-sm font-bold text-emerald-400">Dr. V. Sharma</div>
                    <div className="text-[10px] text-slate-400">Senior Consultant (Kaya Chikitsa)</div>
                  </div>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-700/40 rounded p-3 flex items-center gap-3">
                  <div className="text-lg">📢</div>
                  <div className="text-xs text-emerald-300 font-medium leading-relaxed">
                    कृपया मरीज <b>{activeCase.patient?.name} (टोकन: {activeCase.token})</b> अपनी पर्ची के साथ तुरंत परामर्श कक्ष 12 में उपस्थित हों।
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <div className="text-4xl mb-2 opacity-40">⏳</div>
                <div className="text-lg font-bold text-slate-300">Doctor preparing for next patient</div>
                <div className="text-xs text-slate-500 mt-1">Please keep your OPD registration card ready</div>
              </div>
            )}
          </div>

          {/* SUMMARY METRICS STRIP */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Patients Waiting</div>
              <div className="text-3xl font-black text-amber-400 font-mono mt-1">{waitingPatients.length}</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Consultations Done</div>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-1">{consultedPatients.length}</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Avg. Consultation</div>
              <div className="text-3xl font-black text-sky-400 font-mono mt-1">~8 min</div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN (5 COLS): UPCOMING QUEUE TABLE */}
        <section className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-lg overflow-hidden shadow-xl flex flex-col">
          <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-amber-400" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Upcoming Queue (प्रतीक्षारत टोकन)
              </h2>
            </div>
            <span className="bg-slate-700 text-amber-400 text-xs font-mono font-bold px-2 py-0.5 rounded">
              {waitingPatients.length} IN LINE
            </span>
          </div>

          <div className="overflow-y-auto max-h-[440px] divide-y divide-slate-700/60">
            {waitingPatients.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <div className="text-2xl mb-1">✓</div>
                <div className="text-sm font-bold">No patients waiting in queue</div>
              </div>
            ) : (
              waitingPatients.map((p, idx) => (
                <div
                  key={p.id || p.token}
                  className={`p-3.5 flex items-center justify-between transition ${
                    idx === 0 ? 'bg-amber-950/20 border-l-4 border-amber-500' : 'hover:bg-slate-700/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-center text-xs font-mono text-slate-400 font-bold">
                      #{idx + 1}
                    </div>
                    <span className="bg-slate-900 text-amber-400 font-mono font-black text-sm px-2.5 py-1 rounded border border-slate-700">
                      {p.token}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-100">{p.patient?.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {p.patient?.age}Y / {p.patient?.gender} • {p.intake?.complaintLabel?.slice(0, 24)}...
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {p.redFlag ? (
                      <span className="bg-red-950 text-red-400 border border-red-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                        Urgent
                      </span>
                    ) : idx === 0 ? (
                      <span className="bg-amber-950 text-amber-300 border border-amber-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase animate-pulse">
                        Next in Line
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">{p.waitTime}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-800/90 border-t border-slate-700 p-2.5 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
            <Radio size={12} className="text-emerald-400 animate-pulse" />
            Live ABDM Queue Synchronized • Refreshing in real-time
          </div>
        </section>

      </main>

      {/* 3. PUBLIC ANNOUNCEMENT SCROLLING TICKER */}
      <footer className="bg-blue-950 border-t-2 border-amber-500 px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-amber-400">
          <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black">NOTICE</span>
          <span>कृपया टोकन पुकारे जाने पर ही परामर्श कक्ष में प्रवेश करें। आपातकालीन स्थिति में तुरंत नर्सिंग डेस्क से संपर्क करें।</span>
        </div>
        <div className="text-slate-400 text-[11px] flex items-center gap-3">
          <span>National Ayush Mission (NAM)</span>
          <span>•</span>
          <span>AIIA Central HMIS v2.4</span>
        </div>
      </footer>

    </div>
  );
}
