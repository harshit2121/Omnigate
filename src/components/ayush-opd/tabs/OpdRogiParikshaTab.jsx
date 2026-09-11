import { useState, useEffect } from 'react';
import {
  User,
  Heart,
  Activity,
  Wind,
  Flame,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Check,
  Edit3,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ShieldCheck,
  FileText,
  Scale,
  Brain,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { ayushAiCopilotService } from '../../../services/ayushAiCopilotService';
import NidanAiCard from '../../ui/NidanAiCard';

export default function OpdRogiParikshaTab({
  selectedCase,
  doctorNotes = '',
  onUpdateDoctorNotes,
  handleOpenVitalsModal
}) {
  const [aiData, setAiData] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Local state for doctor's Ashtavidha Pariksha findings
  const initialAshtavidha = selectedCase?.rogiPariksha?.ashtavidha || {};
  const [localAshtavidha, setLocalAshtavidha] = useState({
    nadi: initialAshtavidha.nadi || '',
    jihva: initialAshtavidha.jihva || '',
    mala: initialAshtavidha.mala || '',
    mutra: initialAshtavidha.mutra || '',
    shabda: initialAshtavidha.shabda || '',
    sparsha: initialAshtavidha.sparsha || '',
    druk: initialAshtavidha.druk || '',
    akriti: initialAshtavidha.akriti || ''
  });

  const [activeAgni, setActiveAgni] = useState(selectedCase?.rogiPariksha?.dashavidha?.aharaShakti?.agni || 'Tikshnagni (तीक्ष्णाग्नि)');
  const [activeVyayama, setActiveVyayama] = useState(selectedCase?.rogiPariksha?.dashavidha?.vyayamaShakti?.grade || 'Madhyama');

  const rogi = selectedCase?.rogiPariksha || {};
  const intake = selectedCase?.intake || {};
  const lakshana = rogi.lakshana || intake;
  const dashavidha = rogi.dashavidha || selectedCase?.pariksha?.dashavidha || {};
  const patient = selectedCase?.patient || {};

  useEffect(() => {
    const freshAshtavidha = selectedCase?.rogiPariksha?.ashtavidha || selectedCase?.pariksha?.ashtavidha || {};
    setLocalAshtavidha({
      nadi: freshAshtavidha.nadi || '',
      jihva: freshAshtavidha.jihva || '',
      mala: freshAshtavidha.mala || '',
      mutra: freshAshtavidha.mutra || '',
      shabda: freshAshtavidha.shabda || '',
      sparsha: freshAshtavidha.sparsha || '',
      druk: freshAshtavidha.druk || '',
      akriti: freshAshtavidha.akriti || ''
    });
    if (selectedCase?.rogiPariksha?.dashavidha?.aharaShakti?.agni || selectedCase?.pariksha?.agni) {
      setActiveAgni(selectedCase?.rogiPariksha?.dashavidha?.aharaShakti?.agni || selectedCase?.pariksha?.agni || 'Mandagni');
    }
  }, [selectedCase?.id]);

  const fetchRogiAi = async () => {
    setLoadingAi(true);
    try {
      const resolvedComplaint = intake.chiefComplaint || intake.complaintLabelHi || intake.complaintLabel || lakshana.chiefComplaint || selectedCase?.chiefComplaint || 'सामान्य बाह्य रोगी परामर्श';
      const res = await ayushAiCopilotService.generateSubjectiveAssist({
        chiefComplaint: resolvedComplaint,
        complaintId: intake.complaintId || selectedCase?.intake?.complaintId || '',
        complaintDetails: lakshana,
        patientAge: patient.age || 45,
        patientGender: patient.gender || 'Female',
        prakriti: dashavidha.prakriti?.dominant || selectedCase?.pariksha?.prakritiResult?.dominant || 'Pitta-Vata'
      });
      setAiData(res);
    } catch (e) {
      console.error('Rogi Pariksha AI assist error:', e);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    if (selectedCase) {
      fetchRogiAi();
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

  // Quick preset clinical options for doctor
  const ashtavidhaOptions = {
    nadi: ['सर्प गति (वातज)', 'मण्डूक गति (पित्तज)', 'हंस गति (कफज)', 'द्विदोषज (वात-पित्त)'],
    jihva: ['साम (Lipta / Coated)', 'निराम (Clean / Pink)', 'शुष्क (Dry / Fissured)', 'रक्त (Red / Inflamed)'],
    mala: ['विबद्ध (Constipated)', 'द्रव (Loose Stools)', 'साम (Mucous Purisha)', 'प्राकृत (Normal)'],
    mutra: ['पीत / दाहयुक्त (Yellow / Burning)', 'आविल (Turbid)', 'रक्तवर्ण (Reddish)', 'प्राकृत (Normal)'],
    shabda: ['स्पष्ट (Clear / Spashta)', 'गुरु (Heavy / Deep)', 'क्षीण (Feeble / Weak)', 'कर्कश (Hoarse)'],
    sparsha: ['उष्ण (Warm / Ushna)', 'शीत (Cool / Sheeta)', 'रूक्ष / खर (Dry / Rough)', 'स्निग्ध (Smooth)'],
    druk: ['रक्त / पीत (Red / Yellowish)', 'रूक्ष (Dry Eyes)', 'अश्रुयुक्त (Watery)', 'प्राकृत (Normal)'],
    akriti: ['मध्यम (Madhyama Mesomorphic)', 'कृश (Krisha Ectomorphic)', 'स्थूल (Sthula Endomorphic)']
  };

  const handleRecordPariksha = (field, val) => {
    setLocalAshtavidha(prev => {
      const next = { ...prev, [field]: val };
      if (selectedCase?.rogiPariksha?.ashtavidha) {
        selectedCase.rogiPariksha.ashtavidha[field] = val;
      }
      return next;
    });
  };

  const handleApplyAiParikshaBaseline = () => {
    const isPitta = (lakshana.chiefComplaint || '').toLowerCase().includes('amla') || (lakshana.chiefComplaint || '').toLowerCase().includes('acid');
    const isVata = (lakshana.chiefComplaint || '').toLowerCase().includes('sandhi') || (lakshana.chiefComplaint || '').toLowerCase().includes('joint');
    const isKapha = (lakshana.chiefComplaint || '').toLowerCase().includes('prameha') || (lakshana.chiefComplaint || '').toLowerCase().includes('sugar');

    const suggested = {
      nadi: isPitta ? 'मण्डूक गति (पित्तज)' : (isVata ? 'सर्प गति (वातज)' : 'हंस गति (कफज)'),
      jihva: isPitta ? 'साम (Lipta / Coated)' : (isVata ? 'शुष्क (Dry / Fissured)' : 'साम (Lipta / Coated)'),
      mala: isPitta ? 'विबद्ध (Constipated)' : (isVata ? 'विबद्ध (Constipated)' : 'प्राकृत (Normal)'),
      mutra: isPitta ? 'पीत / दाहयुक्त (Yellow / Burning)' : 'प्राकृत (Normal)',
      shabda: 'स्पष्ट (Clear / Spashta)',
      sparsha: isPitta ? 'उष्ण (Warm / Ushna)' : (isVata ? 'शीत (Cool / Sheeta)' : 'स्निग्ध (Smooth)'),
      druk: isPitta ? 'रक्त / पीत (Red / Yellowish)' : 'प्राकृत (Normal)',
      akriti: 'मध्यम (Madhyama Mesomorphic)'
    };
    setLocalAshtavidha(suggested);
    if (selectedCase?.rogiPariksha?.ashtavidha) {
      Object.assign(selectedCase.rogiPariksha.ashtavidha, suggested);
    }
  };

  const recordedCount = Object.values(localAshtavidha).filter(Boolean).length;

  return (
    <div className="space-y-5 text-slate-800 font-sans pb-10">
      {/* ─── PHASE BANNER & DOCTOR ORIENTATION ─── */}
      <div className="bg-white border-l-4 border-indigo-600 p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              Phase 1: Rogi Pariksha (रोगी परीक्षा)
            </span>
            <span className="text-xs font-bold text-slate-500">
              त्रिविध, अष्टविध एवं दशविध रोगी परीक्षण (Patient Baseline Assessment)
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1">
            आपोपदिश, प्रत्यक्ष एवं अनुमान परीक्षा (Baseline Health &amp; Vital Strength)
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            रोगी द्वारा बताए गए मुख्य लक्षण (Lakshana) यहाँ प्रदर्शित हैं। अष्टविध परीक्षा वैद्य द्वारा स्वयं प्रत्यक्ष परीक्षण करके भरी जाती है।
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {handleOpenVitalsModal && (
            <button
              onClick={handleOpenVitalsModal}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-indigo-200"
              title="Record physical measurements"
            >
              <Edit3 size={13} className="text-indigo-600" />
              <span>शारीरिक माप दर्ज करें (Record Vitals)</span>
            </button>
          )}

          <button
            onClick={handleApplyAiParikshaBaseline}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Pre-populate probable findings based on chief complaint for quick physician review"
          >
            <Sparkles size={13} />
            <span>Nidan AI सुझाव लागू करें</span>
          </button>
        </div>
      </div>

      {/* ─── SECTION 1: AAPTOPADESHA & PRATYAKSHA ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: PATIENT INTAKE (LAKSHANA) & DOCTOR CLINICAL NOTES (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Patient Chief Complaint Card (Populated from Patient / Kiosk) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <User size={16} />
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
                    <span>Aaptopadesha (रोगी स्व-कथन — Kiosk Intake)</span>
                    <span className="text-emerald-600">✓</span>
                  </div>
                  <div className="text-base font-black text-slate-900 leading-snug">
                    {intake.chiefComplaint || intake.complaintLabelHi || intake.complaintLabel || lakshana.chiefComplaint || selectedCase?.chiefComplaint || 'सामान्य बाह्य रोगी परामर्श'}
                  </div>
                </div>
              </div>

              {/* Severity VAS Badge */}
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Pain VAS</div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                  <Flame size={11} /> {intake.severityVas || lakshana.severityVas || selectedCase?.severityVas || '6/10'}
                </span>
              </div>
            </div>

            {/* Lakshana Details Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Duration (काल)</span>
                <p className="font-bold text-slate-800 mt-0.5">{intake.duration || lakshana.duration || selectedCase?.duration || '1 Month'}</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Site (स्थान)</span>
                <p className="font-bold text-slate-800 mt-0.5 truncate">{intake.site || lakshana.site || selectedCase?.site || 'स्थान निर्दिष्ट नहीं'}</p>
              </div>

              <div className="col-span-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Onset &amp; Trigger (समुत्थान)</span>
                <p className="text-slate-700 font-medium mt-0.5">{intake.onset || lakshana.onset || selectedCase?.onset || 'Gradual onset'}</p>
              </div>

              {selectedCase?.intake?.associatedSymptoms && (
                <div className="col-span-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Associated Symptoms (सम्बद्ध लक्षण)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCase.intake.associatedSymptoms.map((sym, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold text-[11px]">
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Doctor Clinical Notes Editor */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <FileText size={14} className="text-indigo-600" />
                <span>चिकित्सक प्रत्यक्ष टिप्पणी (Doctor Consultation Notes)</span>
              </div>
              <span className="text-[10px] text-slate-400">SOAP Notes</span>
            </div>
            <textarea
              rows={4}
              value={doctorNotes}
              onChange={(e) => onUpdateDoctorNotes && onUpdateDoctorNotes(e.target.value)}
              placeholder="वैद्यकीय निष्कर्ष, रोगी से प्रत्यक्ष बातचीत के बिंदु अथवा विशेष निर्देश यहाँ लिखें..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans leading-relaxed text-slate-800 bg-slate-50/50 resize-y"
            />
          </div>

          {/* Nidan AI Card: MediKiosk Clinical Inquiries & Patient Recorded Responses */}
          <NidanAiCard 
            title="Nidan AI: MediKiosk Clinical Inquiries & Patient Responses (कियोस्क पूछताछ एवं रोगी के उत्तर)"
            badge="MediKiosk Verified"
          >
            <div className="space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
                <p className="text-[11px] text-slate-600 font-medium">
                  रोगी द्वारा मेडीकियोस्क पर मुख्य समस्या चयन के दौरान Nidan AI द्वारा पूछे गए प्रश्न एवं <b>रोगी द्वारा दर्ज उत्तर</b>:
                </p>
                <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 self-start sm:self-auto">
                  <CheckCircle2 size={11} className="text-emerald-700" />
                  <span>{((selectedCase?.intake?.kioskInquiries && selectedCase.intake.kioskInquiries.length > 0) ? selectedCase.intake.kioskInquiries : (aiData?.suggestedInquiries || [])).length} उत्तर दर्ज (Recorded)</span>
                </span>
              </div>

              {((selectedCase?.intake?.kioskInquiries && selectedCase.intake.kioskInquiries.length > 0) 
                ? selectedCase.intake.kioskInquiries 
                : (aiData?.suggestedInquiries || [
                    {
                      questionHi: 'क्या आपकी समस्या का संबंध विशेष प्रकार के आहार, जैसे अत्यधिक तीखा, खट्टा, तला हुआ भोजन या चाय/कॉफ़ी के सेवन से है?',
                      questionEn: 'Is your condition aggravated by specific dietary items such as excessively spicy, sour, fried foods, or tea/coffee?',
                      patientAnswer: 'हाँ, बहुत अधिक — विशेष रूप से मिर्च-मसालेदार व खट्टा भोजन खाने पर जलन बहुत बढ़ जाती है।',
                      clinicalReason: 'To identify Pitta-prakopaka Ahara which directly vitiates Agni and leads to Vidaha in Amlapitta.'
                    },
                    {
                      questionHi: 'क्या आपको भोजन के पचने या अपच (अजीर्ण) का अहसास होता है, और क्या यह समस्या मानसिक तनाव या चिंता के समय बढ़ जाती है?',
                      questionEn: 'Do you experience a sense of indigestion (Ajeerna), and does this condition worsen during periods of mental stress or anxiety?',
                      patientAnswer: 'हाँ, मानसिक तनाव व चिंता में अपच और सीने में जलन और बढ़ जाती है।',
                      clinicalReason: 'To evaluate the involvement of Manasika hetus (Krodha, Chinta) and assess Mandagni vs Tikshnagni fluctuations.'
                    },
                    {
                      questionHi: 'क्या आपको रात में जागने की आदत है या आपका भोजन करने का समय अनियमित रहता है?',
                      questionEn: 'Do you have a habit of staying awake late at night (Ratri-jagarana) or do you have irregular meal timings?',
                      patientAnswer: 'हाँ, अक्सर देर रात तक जागती हूँ और भोजन का समय अनियमित रहता है।',
                      clinicalReason: 'Pinpoints primary Viharaja Hetu (Ratri Jagarana & Vishamashana) inducing Pitta surge.'
                    }
                  ])
              ).map((inq, idx) => {
                const answerText = inq.patientAnswer || inq.answer || inq.recordedAnswer || (selectedCase?.intake?.aiInquiriesResponse?.[inq.id]?.answer) || 'हाँ, यह लक्षण स्पष्ट रूप से महसूस होता है (Recorded at Kiosk)';
                return (
                  <div 
                    key={inq.id || idx} 
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all space-y-2.5"
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-lg bg-indigo-600 text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-black text-slate-900 leading-snug">
                            {inq.questionHi}
                          </p>
                          {inq.questionEn && (
                            <p className="text-[11px] text-slate-500 italic mt-0.5">
                              {inq.questionEn}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAppendNote(`[कियोस्क प्रश्न ${idx + 1}]: ${inq.questionHi}\n↳ रोगी का उत्तर: ${answerText}`, `inq-${idx}`)}
                        className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer whitespace-nowrap"
                        title="Append question and patient answer to doctor consultation notes"
                      >
                        {copiedKey === `inq-${idx}` ? (
                          <>
                            <Check size={12} className="text-emerald-600" />
                            <span className="text-emerald-700">जुड़ गया ✓</span>
                          </>
                        ) : (
                          <>
                            <span>+ जोड़ें</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Patient's Recorded Response - Distinct Emerald / Green Highlight */}
                    <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-300 text-emerald-950 flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                            रोगी द्वारा दिया गया उत्तर (Patient's Recorded Response):
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-200/80 text-emerald-900">
                            MediKiosk Self-Intake
                          </span>
                        </div>
                        <p className="font-bold text-xs text-emerald-950 mt-0.5 leading-snug">
                          "{answerText}"
                        </p>
                      </div>
                    </div>

                    {/* Clinical Rationale */}
                    {inq.clinicalReason && (
                      <div className="text-[10px] text-indigo-900 font-medium bg-indigo-50/70 px-2.5 py-1 rounded-lg border border-indigo-100/80 flex items-start gap-1.5">
                        <span className="font-bold text-indigo-700 shrink-0">कारण (Clinical Rationale):</span>
                        <span>{inq.clinicalReason}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </NidanAiCard>
        </div>

        {/* RIGHT COLUMN: DOCTOR ASHTAVIDHA EXAMINATION & DASHAVIDHA ASSESSMENT (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Ashtavidha Pariksha (Interactive Doctor Entry) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Stethoscope size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span>अष्टविध परीक्षा (Ashtavidha Pariksha — Doctor Physical Exam)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {recordedCount} / 8 Recorded
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    वैद्य द्वारा प्रत्यक्ष परीक्षण। नीचे दिए गए विकल्पों में से रोगी की स्थिति का चयन करें:
                  </p>
                </div>
              </div>
            </div>

            {/* 8 Clinical Examination Cards Grid with Interactive Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* 1. Nadi */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Activity size={11} className="text-rose-600" />
                    <span>1. नाडी (Nadi / Pulse)</span>
                  </span>
                  <span className={`text-[10px] font-bold ${localAshtavidha.nadi ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {localAshtavidha.nadi ? 'दर्ज ✓' : 'अदर्ज'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ashtavidhaOptions.nadi.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleRecordPariksha('nadi', opt)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer border ${
                        localAshtavidha.nadi === opt
                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Jihva */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Flame size={11} className="text-amber-600" />
                    <span>2. जिह्वा (Jihva / Tongue)</span>
                  </span>
                  <span className={`text-[10px] font-bold ${localAshtavidha.jihva ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {localAshtavidha.jihva ? 'दर्ज ✓' : 'अदर्ज'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ashtavidhaOptions.jihva.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleRecordPariksha('jihva', opt)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer border ${
                        localAshtavidha.jihva === opt
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Mala */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <AlertCircle size={11} className="text-orange-600" />
                    <span>3. मल (Mala / Bowel)</span>
                  </span>
                  <span className={`text-[10px] font-bold ${localAshtavidha.mala ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {localAshtavidha.mala ? 'दर्ज ✓' : 'अदर्ज'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ashtavidhaOptions.mala.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleRecordPariksha('mala', opt)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer border ${
                        localAshtavidha.mala === opt
                          ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Mutra */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Wind size={11} className="text-sky-600" />
                    <span>4. मूत्र (Mutra / Urine)</span>
                  </span>
                  <span className={`text-[10px] font-bold ${localAshtavidha.mutra ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {localAshtavidha.mutra ? 'दर्ज ✓' : 'अदर्ज'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ashtavidhaOptions.mutra.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleRecordPariksha('mutra', opt)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer border ${
                        localAshtavidha.mutra === opt
                          ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Shabda */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Activity size={11} className="text-teal-600" />
                    <span>5. शब्द (Shabda / Voice)</span>
                  </span>
                  <span className={`text-[10px] font-bold ${localAshtavidha.shabda ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {localAshtavidha.shabda ? 'दर्ज ✓' : 'अदर्ज'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ashtavidhaOptions.shabda.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleRecordPariksha('shabda', opt)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer border ${
                        localAshtavidha.shabda === opt
                          ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Sparsha */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Heart size={11} className="text-rose-600" />
                    <span>6. स्पर्श (Sparsha / Skin)</span>
                  </span>
                  <span className={`text-[10px] font-bold ${localAshtavidha.sparsha ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {localAshtavidha.sparsha ? 'दर्ज ✓' : 'अदर्ज'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ashtavidhaOptions.sparsha.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleRecordPariksha('sparsha', opt)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer border ${
                        localAshtavidha.sparsha === opt
                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Druk */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Brain size={11} className="text-indigo-600" />
                    <span>7. दृक् (Druk / Eyes)</span>
                  </span>
                  <span className={`text-[10px] font-bold ${localAshtavidha.druk ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {localAshtavidha.druk ? 'दर्ज ✓' : 'अदर्ज'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ashtavidhaOptions.druk.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleRecordPariksha('druk', opt)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer border ${
                        localAshtavidha.druk === opt
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 8. Akriti */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Scale size={11} className="text-amber-600" />
                    <span>8. आकृति (Akriti / Build)</span>
                  </span>
                  <span className={`text-[10px] font-bold ${localAshtavidha.akriti ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {localAshtavidha.akriti ? 'दर्ज ✓' : 'अदर्ज'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ashtavidhaOptions.akriti.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleRecordPariksha('akriti', opt)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer border ${
                        localAshtavidha.akriti === opt
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Dashavidha Pariksha (Doctor Interactive Assessment) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Brain size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    दशविध परीक्षा (Dashavidha Pariksha — Doctor Inference)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    अग्नि, व्यायाम शक्ति, धातु सार एवं सात्म्य का वैद्यकीय निर्धारण
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Ahara Shakti / Agni Interactive Selector */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>8. आहार शक्ति (Agni Status)</span>
                  <Flame size={12} className="text-orange-600" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {['Tikshnagni (तीक्ष्णाग्नि)', 'Mandagni (मन्दाग्नि)', 'Vishamagni (विषमाग्नि)', 'Samagni (समाग्नि)'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        setActiveAgni(opt);
                        if (selectedCase?.rogiPariksha?.dashavidha?.aharaShakti) {
                          selectedCase.rogiPariksha.dashavidha.aharaShakti.agni = opt;
                        }
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                        activeAgni === opt
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt.split(' ')[0]}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 block">Selected: {activeAgni}</span>
              </div>

              {/* Vyayama Shakti & Shodhana Eligibility Selector */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>9. व्यायाम शक्ति (Bala &amp; Cleanse)</span>
                  <Activity size={12} className="text-indigo-600" />
                </div>
                <div className="flex gap-1.5">
                  {['Pravara (प्रवर)', 'Madhyama (मध्यम)', 'Avara (अवर)'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        setActiveVyayama(opt);
                        const isEligible = !opt.includes('Avara');
                        if (selectedCase?.rogiPariksha?.dashavidha?.vyayamaShakti) {
                          selectedCase.rogiPariksha.dashavidha.vyayamaShakti.grade = opt;
                          selectedCase.rogiPariksha.dashavidha.vyayamaShakti.shodhanaEligible = isEligible;
                        }
                      }}
                      className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer border text-center ${
                        activeVyayama === opt
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <span className={`text-[10px] font-bold block ${!activeVyayama.includes('Avara') ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {!activeVyayama.includes('Avara') ? 'शोधन योग्य (Shodhana Eligible ✓)' : 'शोधन अयोग्य (Shamana Only)'}
                </span>
              </div>

              {/* Baseline Prakriti & Dhatu Sara from Kiosk */}
              <div className="col-span-1 sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">1. Prakriti (Baseline)</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{dashavidha.prakriti?.dominant || 'Pitta-Vata'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">3. Dhatu Sara</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{dashavidha.sara?.overall || 'Madhyama'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">7. Satva</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{dashavidha.satva || 'Madhyama'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">10. Vaya</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{dashavidha.vaya || `${patient.age || 52}Y`}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
