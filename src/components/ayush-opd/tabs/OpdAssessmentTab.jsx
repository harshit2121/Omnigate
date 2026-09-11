import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Check, 
  Layers, 
  AlertCircle, 
  Compass, 
  ShieldCheck, 
  Edit3, 
  CheckCircle2, 
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Award
} from 'lucide-react';
import { ayushAiCopilotService } from '../../../services/ayushAiCopilotService';
import NidanAiCard from '../../ui/NidanAiCard';

export default function OpdAssessmentTab({
  selectedCase,
  assessmentNotes = '',
  onUpdateAssessmentNotes,
  doctorSubjectiveNotes = '',
  ccrasPrakritiResult,
  confirmedDiagnosis: propConfirmedDiagnosis,
  setConfirmedDiagnosis: propSetConfirmedDiagnosis,
  activeGhatakas: propActiveGhatakas,
  setActiveGhatakas: propSetActiveGhatakas,
  onConfirmDoctorDiagnosis,
  onOverrideGhataka
}) {
  const [aiData, setAiData] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Physician Confirmation State — Controlled from parent or local fallback
  const [localConfirmedDiagnosis, setLocalConfirmedDiagnosis] = useState(
    selectedCase?.assessment?.confirmedDiagnosis || null
  );
  const confirmedDiagnosis = propConfirmedDiagnosis !== undefined ? propConfirmedDiagnosis : localConfirmedDiagnosis;
  const setConfirmedDiagnosis = propSetConfirmedDiagnosis || setLocalConfirmedDiagnosis;

  // Custom diagnosis input by doctor
  const [customDiagInput, setCustomDiagInput] = useState('');
  const [srotodushtiVal, setSrotodushtiVal] = useState('Vimargagamana (Reversed Flow / Reflux)');
  const [sadhyataVal, setSadhyataVal] = useState('Sukha Sadhya (Easily curable with Pathya & Shamana)');

  const fetchAssessmentAi = async () => {
    setLoadingAi(true);
    try {
      const res = await ayushAiCopilotService.generateAssessmentAssist({
        patientAge: selectedCase?.patient?.age || 45,
        patientGender: selectedCase?.patient?.gender || 'Female',
        chiefComplaint: selectedCase?.intake?.chiefComplaint || selectedCase?.intake?.complaintLabelHi || selectedCase?.intake?.complaintLabel || selectedCase?.chiefComplaint || 'सामान्य बाह्य रोगी परामर्श',
        complaintId: selectedCase?.intake?.complaintId || '',
        socrates: {
          site: selectedCase?.intake?.answers?.site,
          onset: selectedCase?.intake?.answers?.onset,
          character: selectedCase?.intake?.answers?.character,
          radiation: selectedCase?.intake?.answers?.radiation,
          associatedSymptoms: selectedCase?.intake?.answers?.associatedSymptoms,
          exacerbating: selectedCase?.intake?.answers?.exacerbating,
          painScale: selectedCase?.vitals?.painScale
        },
        kioskInquiries: selectedCase?.intake?.aiInquiriesResponse || selectedCase?.intake?.aiInquiries || selectedCase?.intake?.answers || {},
        doctorSubjectiveNotes: doctorSubjectiveNotes || '',
        prakriti: ccrasPrakritiResult?.dominantPrakriti || selectedCase?.pariksha?.prakritiResult?.dominant || 'Pitta-Vata',
        prakritiPercentages: ccrasPrakritiResult?.percentages || { vata: 35, pitta: 55, kapha: 10 },
        vitals: selectedCase?.vitals || {},
        ashtavidha: selectedCase?.pariksha?.ashtavidha || {},
        agni: selectedCase?.pariksha?.agni || 'Tikshnagni',
        koshtha: selectedCase?.pariksha?.koshtha || 'Krura'
      });
      setAiData(res);
      if (res?.ghatakas && propSetActiveGhatakas) {
        propSetActiveGhatakas(res.ghatakas);
      }
    } catch (e) {
      console.error('Assessment AI error:', e);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    if (selectedCase) {
      fetchAssessmentAi();
    }
  }, [selectedCase?.id]);

  const activeGhatakas = propActiveGhatakas || aiData?.ghatakas || {
    dosha: 'Pachaka Pitta (Prakopa), Samana & Apana Vayu (Vimargagamana)',
    dushya: 'Rasa Dhatu, Amashayagata Anna-Rasa',
    agni: 'Tikshnagni with Vidaha (Pitta-Vaidharmya)',
    ama: 'Saama State (Amashayagata Metabolic Toxins)',
    srotas: 'Annavaha, Purishavaha, Rasavaha Srotas',
    srotodushti: srotodushtiVal,
    udbhavasthana: 'Amashaya (Stomach)',
    sancharasthana: 'Rasayani & Urdhva Marga (Gastro-esophageal tract)',
    vyaktasthana: 'Hridaya, Kantha, Mukha (Chest, Throat, Mouth)',
    rogamarga: 'Abhyantara Rogamarga (Internal Gastrointestinal Pathway)',
    sadhyasadhyata: sadhyataVal
  };

  const handleConfirmDiagnosis = (diagObj) => {
    const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const confirmed = {
      name: diagObj.name,
      nameHi: diagObj.nameHi || diagObj.name,
      namasteCode: diagObj.namasteCode || 'AYU-AML-01',
      icd11Code: diagObj.icd11Code || 'MD12.0',
      confirmedBy: 'Dr. V. Sharma (BAMS, MD Ayu)',
      registrationNo: 'AYU-DEL-2018-9412',
      confirmedAt: now
    };

    setConfirmedDiagnosis(confirmed);

    if (onConfirmDoctorDiagnosis) {
      onConfirmDoctorDiagnosis(confirmed, activeGhatakas);
    }

    // Record into assessment notes
    const summary = `निदान (Confirmed Diagnosis): ${confirmed.name} (${confirmed.nameHi}) • NAMASTE: ${confirmed.namasteCode} • ICD-11: ${confirmed.icd11Code}\nप्रमाणित चिकित्सक: ${confirmed.confirmedBy} [दिनांक: ${confirmed.confirmedAt}]\nसम्प्राप्ति: ${activeGhatakas.dosha} • दूष्य: ${activeGhatakas.dushya} • स्रोतस: ${activeGhatakas.srotas} (स्रोतोदुष्टि: ${srotodushtiVal}) • साध्यासाध्यता: ${sadhyataVal}`;
    if (onUpdateAssessmentNotes) {
      onUpdateAssessmentNotes(summary);
    }
  };

  const handleResetDiagnosis = () => {
    setConfirmedDiagnosis(null);
    if (onConfirmDoctorDiagnosis) {
      onConfirmDoctorDiagnosis(null, activeGhatakas);
    }
  };

  // AI Diagnostic Suggestions List (Synthesized from correlated data)
  const aiSuggestions = [
    {
      name: aiData?.primaryDiagnosis || 'Urdhvaga Amlapitta (Hyperchlorhydria / GERD)',
      nameHi: aiData?.primaryDiagnosisHi || 'ऊर्ध्वग अम्लपित्त (पाचक पित्त विदाह)',
      namasteCode: aiData?.namasteCode || 'AYU-AML-01',
      icd11Code: aiData?.icd11Code || 'MD12.0',
      confidence: aiData?.confidence || '95% High Clinical Match',
      confidenceColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      rationale: aiData?.confidenceRationale || 'Post-prandial burning + Tikshnagni + Manduka Gati pulse in Pitta-Vata Prakriti.'
    },
    ...(Array.isArray(aiData?.differentialDiagnoses) && aiData.differentialDiagnoses.length > 0
      ? aiData.differentialDiagnoses.map((d, i) => ({
          name: d.name,
          nameHi: d.nameHi || d.name,
          namasteCode: d.namasteCode || `AYU-DIFF-0${i + 2}`,
          icd11Code: d.icd11Code || 'MD12.X',
          confidence: d.confidence || 'Differential Consideration',
          confidenceColor: i === 0 ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-800 border-slate-300',
          rationale: d.differentiatingFeature || 'Clinical sign considered during differential diagnosis.'
        }))
      : [
          {
            name: 'Annadrava Shula (Peptic / Gastric Ulcer Disease)',
            nameHi: 'अन्नद्रव शूल (आमाशय व्रण)',
            namasteCode: 'AYU-SHU-02',
            icd11Code: 'MD12.1',
            confidence: '68% Differential Consideration',
            confidenceColor: 'bg-amber-100 text-amber-800 border-amber-300',
            rationale: 'Pain somewhat relieved immediately post-meal but recurring with severe burning.'
          },
          {
            name: 'Pitta-Vataja Grahani Dosha (Functional Dyspepsia)',
            nameHi: 'पित्त-वातज ग्रहणी दोष',
            namasteCode: 'AYU-GRA-03',
            icd11Code: 'MD12.5',
            confidence: '52% Secondary Consideration',
            confidenceColor: 'bg-slate-100 text-slate-800 border-slate-300',
            rationale: 'Irregular bowel habit (Baddha/Drava) accompanied by upper abdominal discomfort.'
          }
        ]
    )
  ];

  return (
    <div className="space-y-6 text-slate-800 font-sans pb-12">

      {/* ─── SECTION TITLE & DOCTOR ORIENTATION ─── */}
      <div className="bg-white border-l-4 border-indigo-700 p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-700 text-white text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              SOAP: A — Assessment
            </span>
            <span className="text-xs font-bold text-slate-500">
              सम्प्राप्ति घटक एवं रोग-विनिश्चय (Clinical Assessment &amp; Diagnosis)
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1">
            व्याधि विनिश्चय, सम्प्राप्ति घटक एवं साध्यासाध्यता (Pathophysiological Synthesis)
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            अंतिम निदान स्वतः नहीं भरा जाता। नीचे दिए गए एआई सुझावों की समीक्षा करें और पुष्टि करें, अथवा अपना स्वतंत्र निदान दर्ज करें।
          </p>
        </div>

        <button
          onClick={fetchAssessmentAi}
          disabled={loadingAi}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={13} className={loadingAi ? 'animate-spin text-indigo-700' : ''} />
          <span>{loadingAi ? 'विश्लेषण जारी...' : 'पुनः विश्लेषण (Refresh AI)'}</span>
        </button>
      </div>

      {/* ─── CORRELATED CLINICAL INPUTS BAR (AI MULTI-MODAL SYNTHESIS) ─── */}
      <NidanAiCard
        badge="NIDAAN AI"
        title="NIDAAN AI बहु-आयामी सहसंबंध (Multi-Modal Clinical Evidence)"
        subtitle="सभी इनपुट (लक्षण, पूछताछ, परीक्षा, प्रकृति) को एकीकृत कर तैयार किया गया"
        innerClassName="p-4 space-y-3"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white/90 p-2 rounded-lg border border-indigo-100 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">१. लक्षण एवं पूछताछ</div>
            <div className="font-extrabold text-slate-900 truncate">
              {selectedCase?.intake?.chiefComplaint || selectedCase?.intake?.complaintLabelHi || selectedCase?.intake?.complaintLabel || selectedCase?.chiefComplaint || 'सामान्य परामर्श'}
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">
              ✓ किओस्क पूछताछ उत्तर शामिल
            </div>
          </div>

          <div className="bg-white/90 p-2 rounded-lg border border-indigo-100 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">२. अष्टविध परीक्षा</div>
            <div className="font-extrabold text-slate-900 truncate">
              {selectedCase?.pariksha?.ashtavidha?.nadi || 'Manduka Gati'}
            </div>
            <div className="text-[10px] text-slate-600">
              जिह्वा: {selectedCase?.pariksha?.ashtavidha?.jihwa || 'Saama'}
            </div>
          </div>

          <div className="bg-white/90 p-2 rounded-lg border border-indigo-100 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">३. अग्नि एवं कोष्ठ</div>
            <div className="font-extrabold text-amber-900 truncate">
              {selectedCase?.pariksha?.agni || 'Tikshnagni'}
            </div>
            <div className="text-[10px] text-slate-600">
              कोष्ठ: {selectedCase?.pariksha?.koshtha || 'Krura'}
            </div>
          </div>

          <div className="bg-white/90 p-2 rounded-lg border border-indigo-100 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">४. सीसीआरएएस प्रकृति</div>
            <div className="font-extrabold text-indigo-900 truncate">
              {ccrasPrakritiResult?.dominantPrakriti || selectedCase?.pariksha?.prakritiResult?.dominant || 'Pitta-Vata'}
            </div>
            <div className="text-[10px] text-indigo-700 font-bold">
              V:{ccrasPrakritiResult?.percentages?.vata || 35}% • P:{ccrasPrakritiResult?.percentages?.pitta || 55}% • K:{ccrasPrakritiResult?.percentages?.kapha || 10}%
            </div>
          </div>
        </div>

        {aiData?.correlationSummary && (
          <div className="bg-white/90 border border-indigo-200 rounded-lg p-2.5 text-xs text-indigo-950 font-medium flex items-start gap-2">
            <Sparkles size={14} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-indigo-900 font-bold">निदान AI नैदानिक सहसंबंध: </strong>
              {aiData.correlationSummary}
            </div>
          </div>
        )}
      </NidanAiCard>

      {/* ─── 1. PHYSICIAN CONFIRMATION STATUS BANNER ─── */}
      {confirmedDiagnosis ? (
        // STATE A: CONFIRMED BY PHYSICIAN
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <span className="bg-emerald-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono">
                  ✓ Confirmed Clinical Diagnosis (प्रमाणित अंतिम निदान)
                </span>
                <div className="text-xl font-black mt-1">
                  {confirmedDiagnosis.name}
                </div>
                <div className="text-xs text-emerald-200">
                  {confirmedDiagnosis.nameHi}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="bg-white/15 border border-white/20 text-emerald-100 px-3 py-1.5 rounded-xl font-mono text-xs font-bold">
                NAMASTE: {confirmedDiagnosis.namasteCode}
              </div>
              <div className="bg-white/15 border border-white/20 text-emerald-100 px-3 py-1.5 rounded-xl font-mono text-xs font-bold">
                ICD-11: {confirmedDiagnosis.icd11Code}
              </div>
              <button
                onClick={handleResetDiagnosis}
                className="px-3 py-1.5 bg-red-800/80 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                title="Change or re-evaluate diagnosis"
              >
                निदान बदलें (Change)
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-emerald-200/90 pt-1">
            <span>सत्यापित वैद्य: <strong>{confirmedDiagnosis.confirmedBy}</strong> (Reg: {confirmedDiagnosis.registrationNo})</span>
            <span className="font-mono">{confirmedDiagnosis.confirmedAt}</span>
          </div>
        </div>
      ) : (
        // STATE B: PENDING CONFIRMATION — DO NOT AUTO-FEED!
        <NidanAiCard
          badge="NIDAAN AI"
          title="NIDAAN AI रोग-विनिश्चय अनुशंसा (Diagnostic Suggestions)"
          subtitle="अंतिम निदान की पुष्टि चिकित्सक द्वारा की जानी शेष है — एआई केवल नैदानिक सुझाव प्रस्तुत करता है"
          innerClassName="p-5 space-y-4"
        >
          <div className="flex items-start gap-3 border-b border-indigo-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 mt-0.5">
              <ShieldAlert size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono">
                  Pending Physician Confirmation (निदान सत्यापन प्रतीक्षित)
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-1">
                अंतिम निदान की पुष्टि चिकित्सक द्वारा की जानी शेष है
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                निदान AI केवल नैदानिक सुझाव प्रस्तुत करता है। कृपया नीचे दिए गए 3 सुझावों में से उपयुक्त निदान चुनें और <strong>"पुष्टि करें"</strong> पर क्लिक करें, अथवा अपना स्वतंत्र निदान दर्ज करें।
              </p>
            </div>
          </div>

          {/* AI Diagnostic Suggestions Cards */}
          <div className="space-y-3">
            <span className="text-[11px] font-black text-indigo-950 uppercase tracking-wider block">
              निदान AI द्वारा अनुशंसित संभावित निदान (Clinical Diagnostic Suggestions):
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiSuggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-indigo-100 hover:border-indigo-400 p-4 rounded-xl shadow-2xs space-y-2 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sug.confidenceColor}`}>
                        {sug.confidence}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {sug.namasteCode}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 leading-snug group-hover:text-indigo-900 transition-colors">
                      {sug.name}
                    </h4>
                    <p className="text-[11px] text-amber-900 font-semibold mt-0.5">
                      {sug.nameHi}
                    </p>
                    <p className="text-[11px] text-slate-500 italic mt-1 leading-snug">
                      {sug.rationale}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConfirmDiagnosis(sug)}
                    className="w-full py-2 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <CheckCircle2 size={13} />
                    <span>इस निदान की पुष्टि करें (Confirm)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Diagnosis Input by Physician */}
          <div className="pt-3 border-t border-indigo-100 flex flex-col sm:flex-row items-center gap-2 text-xs">
            <span className="text-slate-800 font-black whitespace-nowrap">
              अथवा स्वतंत्र निदान दर्ज करें (Or Enter Custom Diagnosis):
            </span>
            <input
              type="text"
              value={customDiagInput}
              onChange={(e) => setCustomDiagInput(e.target.value)}
              placeholder="e.g. Amlapitta (Vidahi Janya) / Sandhivata..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="button"
              disabled={!customDiagInput.trim()}
              onClick={() => handleConfirmDiagnosis({
                name: customDiagInput.trim(),
                nameHi: customDiagInput.trim(),
                namasteCode: 'AYU-CUSTOM-01',
                icd11Code: 'MD12.0'
              })}
              className="px-4 py-1.5 rounded-xl bg-[#003F6B] hover:bg-[#06234a] text-white font-bold cursor-pointer disabled:opacity-40 transition-all whitespace-nowrap"
            >
              ✓ मेरे निदान की पुष्टि करें
            </button>
          </div>
        </NidanAiCard>
      )}

      {/* ─── 2. CLASSICAL SAMPRAPTI GHATAKA MATRIX ─── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Compass size={15} className="text-[#003F6B]" />
              <span>सम्प्राप्ति घटक पत्रक (Classical Samprapti Ghataka Diagnostic Chart)</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              चरक संहिता एवं अष्टांग हृदय मानक अनुसार रोग उत्पत्ति प्रक्रिया
            </p>
          </div>

          <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
            {confirmedDiagnosis ? 'सत्यापित सम्प्राप्ति' : 'प्रारूप सम्प्राप्ति (Draft Assessment)'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-black text-slate-600 uppercase">
                <th className="p-3.5 w-1/3">Ghataka (घटक)</th>
                <th className="p-3.5">Clinical Evaluation &amp; Vaidya Override (नैदानिक स्थिति)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#003F6B] bg-slate-50/50">1. Dosha &amp; Gati (दोष एवं गति)</td>
                <td className="p-3.5 font-semibold text-slate-900">{activeGhatakas.dosha}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#003F6B] bg-slate-50/50">2. Dushya (दूष्य धातु)</td>
                <td className="p-3.5 font-semibold text-slate-900">{activeGhatakas.dushya}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#003F6B] bg-slate-50/50">3. Agni &amp; Ama (अग्नि एवं आम)</td>
                <td className="p-3.5 font-semibold text-slate-900">{activeGhatakas.agni} • {activeGhatakas.ama}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#003F6B] bg-slate-50/50">4. Srotas Involved (स्रोतस)</td>
                <td className="p-3.5 font-semibold text-slate-900">{activeGhatakas.srotas}</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-amber-50/30">
                <td className="p-3.5 font-bold text-amber-900 bg-amber-50/70">5. Srotodushti Mode (स्रोतोदुष्टि प्रकार)</td>
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <select
                      value={srotodushtiVal}
                      onChange={(e) => {
                        setSrotodushtiVal(e.target.value);
                        if (onOverrideGhataka) onOverrideGhataka('srotodushti', e.target.value);
                      }}
                      className="flex-1 bg-white border-2 border-amber-500 rounded-lg p-1.5 text-xs font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="Vimargagamana (Reversed Flow / Reflux)">Vimargagamana (विमार्गगमन — Retrograde Flow)</option>
                      <option value="Sanga (Obstruction / Stasis)">Sanga (सङ्ग — Stasis / Obstruction)</option>
                      <option value="Atipravritti (Hypersecretion)">Atipravritti (अतिप्रवृत्ति — Excessive Flow)</option>
                      <option value="Siragranthi (Nodular dilation)">Siragranthi (सिराग्रन्थि — Structural Stenosis)</option>
                    </select>
                    <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2 py-1 rounded whitespace-nowrap">
                      Vaidya Override
                    </span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#003F6B] bg-slate-50/50">6. Udbhavasthana (उद्भवस्थान)</td>
                <td className="p-3.5 font-semibold text-slate-900">{activeGhatakas.udbhavasthana}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#003F6B] bg-slate-50/50">7. Sanchara &amp; Vyakti Sthana</td>
                <td className="p-3.5 font-semibold text-slate-900">{activeGhatakas.sancharasthana} → {activeGhatakas.vyaktasthana}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#003F6B] bg-slate-50/50">8. Rogamarga (रोगमार्ग)</td>
                <td className="p-3.5 font-semibold text-slate-900">{activeGhatakas.rogamarga}</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-emerald-50/30">
                <td className="p-3.5 font-bold text-emerald-900 bg-emerald-50/70">9. Sadhyasadhyata (साध्यासाध्यता / Prognosis)</td>
                <td className="p-3.5">
                  <select
                    value={sadhyataVal}
                    onChange={(e) => setSadhyataVal(e.target.value)}
                    className="w-full bg-white border border-emerald-500 rounded-lg p-1.5 text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="Sukha Sadhya (Easily curable with Pathya & Shamana)">Sukha Sadhya (सुखसाध्य — Good prognosis)</option>
                    <option value="Krichra Sadhya (Curable with difficulty / Chronic)">Krichra Sadhya (कृच्छ्रसाध्य — Moderate / Relapsing)</option>
                    <option value="Yapya (Manageable lifelong)">Yapya (याप्य — Maintenance required)</option>
                    <option value="Asadhya (Incurable)">Asadhya (असाध्य — Incurable)</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 3. PATHOPHYSIOLOGICAL RATIONALE & DOCTOR ASSESSMENT NOTES ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Rationale Steps */}
        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-5 space-y-2">
          <div className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen size={14} className="text-indigo-600" />
            <span>वैद्यकीय सम्प्राप्ति विवेचन (Physician Pathological Rationale)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
            {(aiData?.pathophysiologicalRationale || [
              '1. अत्यधिक विदाही व तीक्ष्ण आहार से पाचक पित्त का विदाह (Vidaha) होकर अम्लता बढ़ती है।',
              '2. अपान वायु की गति विमार्गगामी होकर अम्लीय रस को आमाशय से ग्रसिका (Esophagus) की ओर धकेलती है।',
              '3. श्लेषक व क्लेदक कफ के क्षय से श्लैष्मिक कला में तीव्र दाह व अम्ल उद्गार उत्पन्न होते हैं।'
            ]).map((step, i) => (
              <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-indigo-100">
                <span className="text-indigo-600 font-bold">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Doctor Assessment Summary Note Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Edit3 size={14} className="text-[#003F6B]" />
              <span>चिकित्सक नैदानिक समीक्षा (Doctor Assessment Summary Note)</span>
            </label>
            <span className="text-[10px] text-slate-400">Official Consultation Sheet</span>
          </div>
          <textarea
            rows={5}
            value={assessmentNotes}
            onChange={(e) => onUpdateAssessmentNotes && onUpdateAssessmentNotes(e.target.value)}
            placeholder="अंतिम नैदानिक निष्कर्ष, सम्प्राप्ति का सारांश अथवा विशेष वैद्यकीय टिप्पणी यहाँ दर्ज करें..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-slate-400 leading-relaxed font-medium"
          />
        </div>
      </div>

    </div>
  );
}
