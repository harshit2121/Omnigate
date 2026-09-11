import { useState, useEffect } from 'react';
import { 
  User, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  Plus, 
  Check, 
  CheckCircle2,
  HelpCircle, 
  FileText, 
  Heart, 
  Coffee, 
  Moon, 
  Utensils, 
  Flame, 
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ayushAiCopilotService } from '../../../services/ayushAiCopilotService';
import NidanAiCard from '../../ui/NidanAiCard';

export default function OpdSubjectiveTab({
  selectedCase,
  doctorNotes = '',
  onUpdateDoctorNotes
}) {
  const [aiData, setAiData] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showAiDrawer, setShowAiDrawer] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);

  const intake = selectedCase?.intake || {};
  const patient = selectedCase?.patient || {};
  const answers = intake.answers || {};

  const fetchSubjectiveAi = async () => {
    setLoadingAi(true);
    try {
      const res = await ayushAiCopilotService.generateSubjectiveAssist({
        chiefComplaint: intake.complaintLabel || 'Digestive Acid Peptic Distress',
        complaintId: intake.complaintId || '',
        complaintDetails: answers,
        patientAge: patient.age || 45,
        patientGender: patient.gender || 'Female',
        prakriti: selectedCase?.pariksha?.prakritiResult?.dominant || 'Pitta-Vata'
      });
      setAiData(res);
    } catch (e) {
      console.error('Subjective AI assist error:', e);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    if (selectedCase) {
      fetchSubjectiveAi();
    }
  }, [selectedCase?.id]);

  const handleAppendNote = (text, key) => {
    const updated = doctorNotes ? `${doctorNotes}\n• ${text}` : `• ${text}`;
    if (onUpdateDoctorNotes) {
      onUpdateDoctorNotes(updated);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-5 text-slate-800 font-sans pb-10">

      {/* ─── SECTION TITLE & DOCTOR ORIENTATION ─── */}
      <div className="bg-white border-l-4 border-[#003F6B] p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#003F6B] text-white text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              SOAP: S — Subjective
            </span>
            <span className="text-xs font-bold text-slate-500">
              रोगी वृत्तान्त एवं पूर्ववृत्त (Patient Reported History)
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1">
            मुख्य लक्षण, रोग इतिहास एवं आहार-विहार (Chief Complaints &amp; HPI)
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            रोगी द्वारा किओस्क एवं प्रत्यक्ष साक्षात्कार में बताए गए लक्षण। नीचे दिए गए एआई परामर्श केवल सहायक हैं; वैद्य का निर्णय सर्वोपरि है।
          </p>
        </div>

        <button
          onClick={fetchSubjectiveAi}
          disabled={loadingAi}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#003F6B] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          title="Refresh AI Clinical Inquiry Suggestions"
        >
          <RefreshCw size={13} className={loadingAi ? 'animate-spin text-blue-600' : ''} />
          <span>{loadingAi ? 'परामर्श अद्यतन...' : 'पुनः विश्लेषण (Refresh AI)'}</span>
        </button>
      </div>

      {/* ─── GRID: PATIENT INTAKE & SOCRATES BREAKDOWN (STREAMLINED 2-COLUMN SOAP) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* COL 1: Primary Chief Complaints & Ahara-Vihara Lifestyle Matrix */}
        <div className="space-y-4">

          {/* Chief Complaint Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#003F6B] flex items-center justify-center font-bold">
                  <User size={16} />
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                    Primary Presenting Complaint (प्रधान वेदना)
                  </div>
                  <div className="text-base font-black text-slate-900">
                    {intake.complaintLabel || 'Acid Peptic Flare-up (अम्लपित्त)'}
                  </div>
                </div>
              </div>

              {/* Severity VAS Badge */}
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Pain Severity</div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-50 text-red-700 border border-red-200">
                  <Flame size={12} /> VAS {selectedCase?.vitals?.painScale || '6'}/10
                </span>
              </div>
            </div>

            {/* Standard SOCRATES / Dashavidha HPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-extrabold text-slate-500 text-[11px] block">1. Sthana (स्थान / Site):</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{answers.site || 'Amashaya (Epigastrium & Retrosternal)'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-extrabold text-slate-500 text-[11px] block">2. Kala (काल / Onset &amp; Duration):</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{answers.onset || 'Chronic (6 months, acute exacerbation past 5 days)'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-extrabold text-slate-500 text-[11px] block">3. Rupa (रूप / Character):</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{answers.character || 'Vidaha (Intense Burning & Acid Sour Regurgitation)'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-extrabold text-slate-500 text-[11px] block">4. Prasara (प्रसार / Radiation):</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{answers.radiation || 'Urdhva Marga (Upward to throat & chest)'}</span>
              </div>
            </div>

            {/* Associated Symptoms Pills */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">
                संबद्ध लक्षण (Associated Symptoms):
              </span>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(answers.associatedSymptoms) ? answers.associatedSymptoms : ['Hrid-Daha (Chest burning)', 'Tikta-Amla Udgara', 'Utklesha (Nausea)', 'Aruchi (Loss of taste)']).map((sym, idx) => (
                  <span key={idx} className="bg-blue-50/80 border border-blue-200 text-blue-900 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <span>•</span> {sym}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ahara-Vihara & Lifestyle Patterns Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
              <Utensils size={16} className="text-amber-600" />
              <span>आहार-विहार एवं दिनचर्या परीक्षण (Diet &amp; Lifestyle Habits)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                <div className="text-[10px] text-amber-800 font-bold uppercase">Diet Pattern</div>
                <div className="font-extrabold text-slate-900 mt-0.5">{selectedCase?.pariksha?.aharaVihara?.diet_type || 'Mixed (मिश्राहार)'}</div>
                <div className="text-[11px] text-amber-700 font-medium mt-0.5">Vidahi &amp; Spicy</div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80">
                <div className="text-[10px] text-blue-800 font-bold uppercase">Agni (Appetite)</div>
                <div className="font-extrabold text-slate-900 mt-0.5">{selectedCase?.pariksha?.agni || 'Tikshnagni (तीक्ष्णाग्नि)'}</div>
                <div className="text-[11px] text-blue-700 font-medium mt-0.5">High digestion heat</div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Koshtha (Bowels)</div>
                <div className="font-extrabold text-slate-900 mt-0.5">{selectedCase?.pariksha?.koshtha || 'Krura (क्रूर कोष्ठ)'}</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Mild constipation</div>
              </div>

              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/80">
                <div className="text-[10px] text-purple-800 font-bold uppercase">Sleep / Nidra</div>
                <div className="font-extrabold text-slate-900 mt-0.5">Disturbed (खंडित)</div>
                <div className="text-[11px] text-purple-700 font-medium mt-0.5">Late night meals</div>
              </div>
            </div>

            {/* Allergies & Past Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-red-50/60 border border-red-200 p-3 rounded-xl flex items-start gap-2">
                <ShieldAlert size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-red-950 block">Known Drug Allergies (सात्म्यता / एलर्जी):</span>
                  <span className="text-red-800 font-medium">
                    {intake.knownAllergies?.length ? intake.knownAllergies.join(', ') : 'Nil Known Drug Allergies (NKDA)'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start gap-2">
                <Clock size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Past Medical History (पूर्ववृत्त):</span>
                  <span className="text-slate-600 font-medium">
                    {intake.pastConditions?.length ? intake.pastConditions.join(', ') : 'No prior chronic surgical interventions reported'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COL 2: NIDAN AI KIOSK PATIENT INQUIRIES & DOCTOR CLINICAL NOTES */}
        <div className="space-y-4">

          {/* ─── NIDAN AI KIOSK PATIENT INQUIRY RESPONSES ─── */}
          <NidanAiCard
            title="रोगी नैदानिक पूछताछ उत्तर (Kiosk Patient Responses)"
            subtitle="रोगी ने किओस्क पर मुख्य समस्या चुनने के बाद इन शास्त्रीय प्रश्नों के उत्तर स्वयं दिए हैं"
            badge="Nidan AI"
            headerRight={
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-2.5 py-0.5 rounded-full">
                ✓ Recorded at MediKiosk
              </span>
            }
          >
            <div className="space-y-3 pt-1">
              {((Array.isArray(intake.kioskInquiries) && intake.kioskInquiries.length > 0)
                ? intake.kioskInquiries.map((q, idx) => [q.id || `inq_${idx}`, {
                    questionHi: q.questionHi,
                    questionEn: q.questionEn,
                    answer: q.patientAnswer || q.answer || 'दर्ज उत्तर',
                    clinicalReason: q.clinicalReason
                  }])
                : (intake.aiInquiriesResponse ? Object.entries(intake.aiInquiriesResponse) : [])
              ).map(([inqId, data], idx) => (
                <div key={inqId} className="p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-2 hover:border-indigo-300 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-slate-900 leading-snug">
                        {idx + 1}. {data.questionHi}
                      </div>
                      <div className="text-[11px] text-slate-500 italic">
                        {data.questionEn}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAppendNote(`रोगी उत्तर: "${data.questionHi}" → उत्तर: ${data.answer} (${data.clinicalReason})`, inqId)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white border border-indigo-200 hover:bg-indigo-50 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs transition-all"
                      title="Add to Doctor Clinical Notes"
                    >
                      {copiedKey === inqId ? <Check size={12} className="text-emerald-600" /> : <Plus size={12} />}
                      <span>{copiedKey === inqId ? 'जोड़ दिया' : '+ टिप्पणी में जोड़ें'}</span>
                    </button>
                  </div>

                  {/* Patient Answer Highlight Pill */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                      <CheckCircle2 size={13} className="text-emerald-700" />
                      <span>रोगी का उत्तर: "{data.answer}"</span>
                    </span>

                    <span className="text-[11px] text-indigo-900 bg-white border border-indigo-200 px-2.5 py-0.5 rounded-lg font-medium">
                      💡 <strong>नैदानिक संकेत:</strong> {data.clinicalReason}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </NidanAiCard>

          {/* Doctor's Subjective Clinical Examination Notes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <FileText size={14} className="text-[#003F6B]" />
                चिकित्सक रोगी वृत्तान्त टिप्पणी (Doctor's Subjective Clinical Notes)
              </label>
              <span className="text-[11px] text-slate-400">रोगी के उत्तर ऊपर से 1-क्लिक में जोड़ें</span>
            </div>
            <textarea
              rows={4}
              value={doctorNotes}
              onChange={(e) => onUpdateDoctorNotes && onUpdateDoctorNotes(e.target.value)}
              placeholder="रोगी से बातचीत के मुख्य निष्कर्ष, खान-पान की आदतें, एवं अतिरिक्त लक्षण यहाँ दर्ज करें..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003F6B] placeholder-slate-400 leading-relaxed font-medium"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
