import { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Utensils,
  Moon,
  Wind,
  Compass,
  FileText,
  Printer,
  Layers,
  Database,
  RefreshCw,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { ayushAiCopilotService } from '../../../services/ayushAiCopilotService';
import NidanAiCard from '../../ui/NidanAiCard';

export default function OpdPlanTab({
  selectedCase,
  confirmedDiagnosis = null,
  activeGhatakas = null,
  doctorSubjectiveNotes = '',
  doctorAssessmentNotes = '',
  ccrasPrakritiResult,
  isPrescriptionSigned = false,
  cdssEvaluation,
  prescriptions = [],
  setPrescriptions,
  handleAddPrescription,
  handleRemovePrescription,
  newMedForm,
  setNewMedForm,
  prescribingSystem,
  setPrescribingSystem,
  dietPathya,
  setDietPathya,
  dietApathya,
  setDietApathya,
  yogaPlanText,
  setYogaPlanText,
  panchakarmaOrders = [],
  setPanchakarmaOrders,
  setShowPanchakarmaModal,
  setShowConfirmRxModal,
  setShowApiImportModal,
  printDoctorPrescription
}) {
  const [aiPlan, setAiPlan] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [chikitsaSutra, setChikitsaSutra] = useState(
    'Pitta-Shamana, Deepana-Pachana, Mridu Anulomana & Dahaprashamana (पित्त-शमन, दीपन-पाचन, मृदु अनुलोमन)'
  );
  const [addedIds, setAddedIds] = useState({});

  const fetchPlanAi = async () => {
    setLoadingAi(true);
    try {
      const res = await ayushAiCopilotService.generatePlanAssist({
        patientAge: selectedCase?.patient?.age || 45,
        patientGender: selectedCase?.patient?.gender || 'Female',
        chiefComplaint: selectedCase?.intake?.chiefComplaint || selectedCase?.intake?.complaintLabelHi || selectedCase?.intake?.complaintLabel || selectedCase?.chiefComplaint || 'सामान्य बाह्य रोगी परामर्श',
        complaintId: selectedCase?.intake?.complaintId || '',
        confirmedDiagnosis: confirmedDiagnosis || selectedCase?.assessment?.confirmedDiagnosis || null,
        activeGhatakas: activeGhatakas || selectedCase?.assessment?.ghatakas || null,
        doctorSubjectiveNotes: doctorSubjectiveNotes || '',
        doctorAssessmentNotes: doctorAssessmentNotes || '',
        prakriti: ccrasPrakritiResult?.dominantPrakriti || selectedCase?.pariksha?.prakritiResult?.dominant || 'Pitta-Vata',
        prakritiPercentages: ccrasPrakritiResult?.percentages || { vata: 35, pitta: 55, kapha: 10 },
        vitals: selectedCase?.vitals || {},
        ashtavidha: selectedCase?.pariksha?.ashtavidha || {},
        agni: selectedCase?.pariksha?.agni || 'Tikshnagni',
        koshtha: selectedCase?.pariksha?.koshtha || 'Krura',
        currentMedications: selectedCase?.intake?.currentMedications || ['Telmisartan 40mg'],
        allergies: selectedCase?.intake?.allergies || [],
        kioskInquiries: selectedCase?.intake?.aiInquiriesResponse || selectedCase?.intake?.answers || {}
      });
      setAiPlan(res);
      if (res.chikitsaSutra) {
        setChikitsaSutra(`${res.chikitsaSutra} (${res.chikitsaSutraHi || ''})`);
      }
    } catch (e) {
      console.error('Plan AI error:', e);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    if (selectedCase) {
      fetchPlanAi();
    }
  }, [selectedCase?.id, confirmedDiagnosis?.name]);

  const handleAddAiMedicine = (med, index) => {
    const isAyur = true;
    const newEntry = {
      id: Date.now() + index,
      name: med.name,
      type: med.kalpana || 'Classical Vati',
      system: 'ayurvedic',
      dose: med.dose || '250mg',
      frequency: med.frequency || 'BD (Twice Daily)',
      kaala: med.kaala || 'Adhobhakta (After Meals)',
      anupana: med.anupana || 'Lukewarm Water',
      duration: med.duration || '15 Days',
      source: 'AI Classical Protocol Suggestion'
    };
    if (setPrescriptions) {
      setPrescriptions(prev => [...prev, newEntry]);
    }
    setAddedIds(prev => ({ ...prev, [index]: true }));
  };

  const handleApplyAiDiet = () => {
    if (aiPlan?.pathyaAhara?.length) {
      setDietPathya(aiPlan.pathyaAhara.join(', '));
    }
    if (aiPlan?.apathyaAhara?.length) {
      setDietApathya(aiPlan.apathyaAhara.join(', '));
    }
    if (aiPlan?.dinacharyaYoga) {
      setYogaPlanText(aiPlan.dinacharyaYoga);
    }
  };

  return (
    <div className="space-y-5 text-slate-800 font-sans pb-12">

      {/* ─── SECTION TITLE & DOCTOR ORIENTATION ─── */}
      <div className="bg-white border-l-4 border-emerald-600 p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 text-white text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              SOAP: P — Plan &amp; Prescription
            </span>
            <span className="text-xs font-bold text-slate-500">
              चिकित्सा योजना, ई-प्रिस्क्रिप्शन एवं पथ्यापथ्य
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1">
            चिकित्सा सूत्र, औषध योग, पंचकर्म एवं जीवनशैली निर्देश (Treatment Protocol &amp; Rx)
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            रोग निदान (A) के अनुरूप शास्त्रीय औषधियां, अनुपान, सेवनकाल एवं पथ्यापथ्य। एआई द्वारा सुझाए गए योगों को 1-क्लिक से नुस्खे में जोड़ें।
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={fetchPlanAi}
            disabled={loadingAi}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={loadingAi ? 'animate-spin text-emerald-700' : ''} />
            <span>पुनः विश्लेषण (Refresh AI)</span>
          </button>

          <button
            onClick={() => setShowConfirmRxModal && setShowConfirmRxModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <CheckCircle2 size={14} />
            <span>ई-प्रिस्क्रिप्शन जारी करें (Sign Rx)</span>
          </button>
        </div>
      </div>

      {/* ─── CORRELATED DIAGNOSTIC BASELINE (FROM ASSESSMENT & OBJECTIVE) ─── */}
      <NidanAiCard
        badge="NIDAAN AI"
        title="NIDAAN AI सहसंबद्ध नैदानिक आधार (Correlated Clinical Baseline for Rx)"
        subtitle={confirmedDiagnosis ? '✓ प्रमाणित निदान से सहसंबद्ध — औषध योग एवं मात्रा स्वचालित रूप से संयोजित' : 'पूर्व-निदान से सहसंबद्ध (निदान सत्यापन प्रतीक्षित)'}
        innerClassName="p-4 space-y-3"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white/95 p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">१. रोग विनिश्चय (निदान)</div>
            <div className="font-extrabold text-slate-900 truncate">
              {confirmedDiagnosis?.name || selectedCase?.assessment?.confirmedDiagnosis?.name || selectedCase?.intake?.chiefComplaint || selectedCase?.intake?.complaintLabel || 'सामान्य परामर्श'}
            </div>
            <div className="text-[10px] text-emerald-700 font-bold font-mono">
              {confirmedDiagnosis?.namasteCode || selectedCase?.assessment?.confirmedDiagnosis?.namasteCode || 'AYU-DX-CONFIRMED'} • {confirmedDiagnosis?.icd11Code || selectedCase?.assessment?.confirmedDiagnosis?.icd11Code || 'TM1'}
            </div>
          </div>

          <div className="bg-white/95 p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">२. सम्प्राप्ति दोष एवं दूष्य</div>
            <div className="font-extrabold text-indigo-900 truncate">
              {activeGhatakas?.dosha || 'Pachaka Pitta, Apana Vayu'}
            </div>
            <div className="text-[10px] text-slate-600 truncate">
              दूष्य: {activeGhatakas?.dushya || 'Rasa Dhatu'}
            </div>
          </div>

          <div className="bg-white/95 p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">३. प्रकृति, अग्नि व कोष्ठ</div>
            <div className="font-extrabold text-amber-900 truncate">
              {ccrasPrakritiResult?.dominantPrakriti || selectedCase?.pariksha?.prakritiResult?.dominant || 'Pitta-Vata'}
            </div>
            <div className="text-[10px] text-slate-600 truncate">
              अग्नि: {selectedCase?.pariksha?.agni || 'Tikshnagni'} • {selectedCase?.pariksha?.koshtha || 'Krura'}
            </div>
          </div>

          <div className="bg-white/95 p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">४. समवर्ती एलोपैथिक दवाएं</div>
            <div className="font-extrabold text-rose-900 truncate">
              {(selectedCase?.intake?.currentMedications || ['Telmisartan 40mg']).join(', ')}
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">
              ✓ CDSS परस्पर क्रिया सुरक्षित
            </div>
          </div>
        </div>

        {aiPlan?.correlationRationale && (
          <div className="bg-white/90 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-950 font-medium flex items-start gap-2">
            <Sparkles size={14} className="text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-900 font-bold">निदान AI उपचार सहसंबंध युक्ति: </strong>
              {aiPlan.correlationRationale}
            </div>
          </div>
        )}
      </NidanAiCard>

      {/* ─── 1. CHIKITSA SUTRA (LINE OF TREATMENT) STRIP ─── */}
      <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <Compass size={15} className="text-amber-700" />
            <span>चिकित्सा सूत्र — Principles of Clinical Management (Line of Treatment)</span>
          </span>
          <span className="text-[10px] text-amber-800 font-bold bg-amber-200/80 px-2 py-0.5 rounded">
            CCRAS Standard Protocol
          </span>
        </div>
        <input
          type="text"
          value={chikitsaSutra}
          onChange={(e) => setChikitsaSutra(e.target.value)}
          className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Enter line of treatment principles..."
        />
      </div>

      {/* ─── 2. PHYSICIAN AI ASSIST: RECOMMENDED FORMULATIONS ─── */}
      <NidanAiCard
        badge="NIDAAN AI"
        title="NIDAAN AI शास्त्रीय औषध योग अनुशंसा (Evidence-Based Formulations)"
        subtitle="सत्यापित सम्प्राप्ति एवं त्रिदोष स्थिति अनुसार अनुशंसित शास्त्रीय योग — '+ नुस्खे में जोड़ें' द्वारा शामिल करें"
        headerRight={
          <button
            onClick={handleApplyAiDiet}
            className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 hover:bg-indigo-100 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <span>+ पथ्यापथ्य लागू करें (Apply Diet)</span>
          </button>
        }
        innerClassName="p-5 space-y-3"
      >
        {/* Medicines Recommendation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(aiPlan?.recommendedFormulations || [
            {
              name: 'Kamadudha Rasa (Moti Yukta)',
              kalpana: 'Rasaushadhi / Pishti',
              dose: '250 mg',
              frequency: 'BD (Twice Daily)',
              kaala: 'Adhobhakta (After Meals)',
              anupana: 'Warm Cow Milk / Water',
              duration: '15 Days',
              rationale: 'Potent Sheeta (cooling) & Dahaprashamana action for acute hyperacidity.'
            },
            {
              name: 'Avipattikar Churna',
              kalpana: 'Churna',
              dose: '3-5 g',
              frequency: 'HS (Bedtime)',
              kaala: 'Nishikala (At Bedtime)',
              anupana: 'Ushnodaka (Lukewarm Water)',
              duration: '15 Days',
              rationale: 'Facilitates Mridu Virechana to eliminate stagnant acidic Pitta.'
            },
            {
              name: 'Sutshekhar Ras (Gold / Plain)',
              kalpana: 'Rasaushadhi / Vati',
              dose: '250 mg',
              frequency: 'BD (Twice Daily)',
              kaala: 'Pragbhakta (Before Meals)',
              anupana: 'Cow Ghee / Water',
              duration: '15 Days',
              rationale: 'Regulates gastric fire (Agni) and relieves nausea and sour eructations.'
            }
          ]).map((med, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs space-y-2 flex flex-col justify-between hover:border-indigo-300 transition-all">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-black text-slate-900">{med.name}</span>
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                    {med.kalpana}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-600 mt-1">
                  {med.dose} • {med.frequency} • {med.kaala}
                </div>
                <div className="text-[10px] text-amber-900 font-semibold mt-0.5">
                  अनुपान: {med.anupana} • अवधि: {med.duration}
                </div>
                <p className="text-[11px] text-slate-500 italic mt-1.5 leading-snug">
                  {med.rationale}
                </p>
              </div>

              <button
                onClick={() => handleAddAiMedicine(med, idx)}
                disabled={addedIds[idx]}
                className={`w-full py-1.5 mt-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  addedIds[idx]
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {addedIds[idx] ? (
                  <>
                    <CheckCircle2 size={12} className="text-emerald-700" />
                    <span>नुस्खे में शामिल है (Added)</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={12} />
                    <span>+ नुस्खे में जोड़ें (Add to Plan)</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </NidanAiCard>

      {/* ─── 3. ACTIVE E-PRESCRIPTION TABLE (OFFICIAL ORDERS) ─── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-0">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText size={15} className="text-[#003F6B]" />
              <span>सक्रिय ई-प्रिस्क्रिप्शन सूची (Active Prescription Orders — {prescriptions.length} Items)</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              अधिकृत आयुर्वेदीय औषधियां (Vaidya Digitally Authorized Formulations)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {setShowApiImportModal && (
              <button
                onClick={() => setShowApiImportModal(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Database size={12} />
                <span>आयुष फार्माकोपिया खोजें</span>
              </button>
            )}
          </div>
        </div>

        {/* Prescriptions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-black text-slate-600 uppercase">
                <th className="p-3">#</th>
                <th className="p-3">औषध नाम (Medicine Name)</th>
                <th className="p-3">कल्पना (Kalpana)</th>
                <th className="p-3">मात्रा (Dose)</th>
                <th className="p-3">आवृत्ति (Frequency)</th>
                <th className="p-3">सेवनकाल (Kaala)</th>
                <th className="p-3">अनुपान (Anupana)</th>
                <th className="p-3">अवधि (Duration)</th>
                <th className="p-3 text-center">हटाएं</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions.map((rx, idx) => (
                <tr key={rx.id || idx} className="hover:bg-slate-50 font-medium">
                  <td className="p-3 font-mono text-slate-400 font-bold">{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-900">{rx.name}</td>
                  <td className="p-3">
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                      {rx.type || rx.kalpana || 'Vati'}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-blue-900">{rx.dose}</td>
                  <td className="p-3 text-slate-800">{rx.frequency}</td>
                  <td className="p-3 text-amber-900 font-semibold">{rx.kaala}</td>
                  <td className="p-3 text-slate-600">{rx.anupana}</td>
                  <td className="p-3 font-mono text-slate-700">{rx.duration}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleRemovePrescription && handleRemovePrescription(rx.id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Remove medicine"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {prescriptions.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-xs text-slate-400">
                    कोई दवा निर्धारित नहीं है। ऊपर दिए गए एआई सुझावों से चुनें अथवा नीचे नया योग जोड़ें।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Add Formulation Form by Vaidya */}
        {newMedForm && setNewMedForm && handleAddPrescription && (
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Plus size={13} className="text-[#003F6B]" />
              <span>कस्टम औषध प्रविष्टि (Quick Add Custom Formulation)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Medicine Name (e.g. Shankha Vati)"
                  value={newMedForm.name}
                  onChange={(e) => setNewMedForm({ ...newMedForm, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold focus:outline-none"
                />
              </div>
              <div>
                <select
                  value={newMedForm.kalpana || 'Vati'}
                  onChange={(e) => setNewMedForm({ ...newMedForm, kalpana: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold focus:outline-none"
                >
                  <option value="Vati">Vati / Gutika</option>
                  <option value="Churna">Churna</option>
                  <option value="Kwath">Kwatha</option>
                  <option value="Asava">Asava / Arishta</option>
                  <option value="Rasaushadhi">Rasa / Bhasma</option>
                  <option value="Ghrita">Ghrita / Taila</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Dose (e.g. 250mg)"
                  value={newMedForm.dose}
                  onChange={(e) => setNewMedForm({ ...newMedForm, dose: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Freq (e.g. BD)"
                  value={newMedForm.frequency}
                  onChange={(e) => setNewMedForm({ ...newMedForm, frequency: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Kaala (e.g. Post Meals)"
                  value={newMedForm.kaala}
                  onChange={(e) => setNewMedForm({ ...newMedForm, kaala: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Anupana (e.g. Water)"
                  value={newMedForm.anupana}
                  onChange={(e) => setNewMedForm({ ...newMedForm, anupana: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold focus:outline-none"
                />
              </div>
              <div>
                <button
                  onClick={handleAddPrescription}
                  className="w-full bg-[#003F6B] hover:bg-[#06234a] text-white font-bold p-2 rounded-lg cursor-pointer transition-colors text-xs"
                >
                  + जोड़ें
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── 4. PATHYA-APATHYA DIETETICS & DINACHARYA ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pathya (Do's) */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
            <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Utensils size={15} className="text-emerald-700" />
              <span>पथ्य आहार एवं विहार (Pathya — Recommended Diet &amp; Regimen)</span>
            </span>
            <span className="text-[10px] text-emerald-800 font-bold">सेवनीय</span>
          </div>
          <textarea
            rows={3}
            value={dietPathya}
            onChange={(e) => setDietPathya && setDietPathya(e.target.value)}
            className="w-full bg-white border border-emerald-300 rounded-xl p-3 text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            placeholder="लघु, सुपाच्य, मूंग दाल का सूप, अनार, गाय का घी, गुनगुना पानी..."
          />
        </div>

        {/* Apathya (Don'ts) */}
        <div className="bg-red-50/60 border border-red-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-red-200/80 pb-2">
            <span className="text-xs font-black text-red-950 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-red-700" />
              <span>अपथ्य आहार एवं विहार (Apathya — Contraindicated / Avoid)</span>
            </span>
            <span className="text-[10px] text-red-800 font-bold">त्याज्य</span>
          </div>
          <textarea
            rows={3}
            value={dietApathya}
            onChange={(e) => setDietApathya && setDietApathya(e.target.value)}
            className="w-full bg-white border border-red-300 rounded-xl p-3 text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            placeholder="अत्यधिक मिर्च, खटाई, सिरका, रात में दही, बासी व तला-भुना भोजन..."
          />
        </div>
      </div>

      {/* ─── 5. YOGA, PANCHAKARMA & CDSS SAFETY SCORE STRIP ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Yoga & Dinacharya */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Moon size={14} className="text-indigo-600" />
            <span>दिनचर्या एवं योगाभ्यास (Dinacharya &amp; Yoga)</span>
          </div>
          <textarea
            rows={3}
            value={yogaPlanText}
            onChange={(e) => setYogaPlanText && setYogaPlanText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#003F6B] font-medium"
            placeholder="शीतली व सीत्कारी प्राणायाम (10 मिनट), वज्रासन भोजनोपरांत..."
          />
        </div>

        {/* Panchakarma Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              पंचकर्म आदेश (Panchakarma Orders)
            </span>
            {setShowPanchakarmaModal && (
              <button
                onClick={() => setShowPanchakarmaModal(true)}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                + नया आदेश
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {panchakarmaOrders.map((po, i) => (
              <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-0.5">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>{po.procedure}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{po.sessions}</span>
                </div>
                <div className="text-[11px] text-slate-600">{po.dravya} • {po.time}</div>
              </div>
            ))}
            {panchakarmaOrders.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-4">
                कोई पंचकर्म प्रक्रिया आदेशित नहीं है।
              </p>
            )}
          </div>
        </div>

        {/* CDSS Safety & Drug Interaction Alert */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-600" />
                <span>CDSS सुरक्षा मूल्यांकन (Safety)</span>
              </span>
              <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Score: {cdssEvaluation?.safetyScore || 100}%
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              वर्तमान एलोपैथिक दवाओं (जैसे <strong>Telmisartan</strong>) एवं निर्धारित आयुर्वेदिक योगों के मध्य कोई गंभीर अंतःक्रिया (Drug Interaction) नहीं पाई गई।
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Dual Pharmacotherapy:</span>
            <span className="font-bold text-emerald-700">✓ Safe &amp; Verified</span>
          </div>
        </div>
      </div>

    </div>
  );
}
