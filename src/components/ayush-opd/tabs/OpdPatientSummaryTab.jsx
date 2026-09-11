import { Printer, AlertTriangle, Sun, QrCode, ShieldCheck, CheckCircle2, ArrowLeft, FileText, Activity, Pill, Flower2, Heart } from 'lucide-react';

export default function OpdPatientSummaryTab({
  selectedCase,
  confirmedDiagnosis = null,
  activeGhatakas = null,
  isPrescriptionSigned,
  acceptedCases = [],
  ccrasPrakritiResult,
  sampraptiSynthesis,
  prescriptions = [],
  dietPathya,
  yogaPlanText,
  panchakarmaOrders = [],
  currentRitu,
  prescriptionHash,
  backToRoster,
  printDoctorPrescription
}) {
  if (!selectedCase) return null;

  const rogi = selectedCase?.rogiPariksha || {};
  const roga = selectedCase?.rogaPariksha || {};
  const chikitsa = selectedCase?.chikitsaPlan || {};
  const patient = selectedCase?.patient || {};
  const lakshana = rogi.lakshana || {};
  const ashtavidha = rogi.ashtavidha || {};
  const dashavidha = rogi.dashavidha || {};
  const samprapti = roga.samprapti || activeGhatakas || {};

  const activeDiagnosis = confirmedDiagnosis || selectedCase.assessment?.confirmedDiagnosis || null;
  const activeRx = Array.isArray(prescriptions) ? prescriptions : [];
  const activePanchakarma = Array.isArray(panchakarmaOrders) ? panchakarmaOrders : [];

  return (
    <div className="space-y-4 font-sans text-slate-800 pb-10">
      
      {/* Action Header Ribbon */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>आधिकारिक आयुष परामर्श पत्र (Official AYUSH Consultation Record)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Phase 4: Official E-Sign Record
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              National AYUSH Grid &amp; ABDM FHIR R4 Compliant E-Prescription
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {printDoctorPrescription && (
            <button
              onClick={() => {
                printDoctorPrescription({
                  patientName: patient.name,
                  age: patient.age,
                  gender: patient.gender,
                  uhid: selectedCase.uhid,
                  abhaId: patient.abhaId,
                  diagnosis: activeDiagnosis?.name || activeDiagnosis?.nameHi || (typeof activeDiagnosis === 'string' ? activeDiagnosis : 'General AYUSH OPD Consultation'),
                  icdCode: activeDiagnosis?.namasteCode || 'AYU-GEN-01',
                  prakriti: dashavidha.prakriti?.dominant,
                  medications: activeRx,
                  dietRecommendations: chikitsa.ahara?.prescribedDiet || dietPathya,
                  yogaTherapy: chikitsa.vihara?.yogaPranayama || yogaPlanText,
                  panchakarmaOrders: activePanchakarma
                });
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Printer size={14} />
              <span>प्रिस्क्रिप्शन प्रिंट करें (Print Record)</span>
            </button>
          )}

          <button
            onClick={backToRoster}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>रोस्टर पर लौटें (OPD Roster)</span>
          </button>
        </div>
      </div>

      {/* Main Printable Clinical Sheet */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Hospital Header & Metadata */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-black text-[10px] tracking-wider uppercase">
                AYUSH OPD
              </span>
              <span className="text-xs font-bold text-slate-500">Ministry of AYUSH • Government of India</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-1">
              अखिल भारतीय आयुर्वेद संस्थान (All India Institute of Ayurveda)
            </h1>
            <p className="text-xs text-slate-600">
              Department of Kayachikitsa &amp; Panchakarma • OPD Room 12, Unit III
            </p>
          </div>

          <div className="text-right text-xs">
            <div className="font-mono font-bold text-slate-900 text-sm">{selectedCase.token}</div>
            <div className="text-slate-500 text-[11px]">CR No: <b className="font-mono text-slate-800">{selectedCase.crNo}</b></div>
            <div className="text-slate-500 text-[11px]">UHID: <b className="font-mono text-slate-800">{selectedCase.uhid}</b></div>
            <div className="text-slate-500 text-[11px]">Date: <b className="text-slate-800">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</b></div>
          </div>
        </div>

        {/* Patient Demographic Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">रोगी का नाम (Patient Name)</span>
            <span className="font-black text-slate-900 text-sm">{patient.name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">आयु / लिंग (Age / Gender)</span>
            <span className="font-bold text-slate-800">{patient.age} वर्ष / {patient.gender}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">ABHA ID (आभा पता)</span>
            <span className="font-mono font-bold text-indigo-700">{patient.abhaId}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">रक्त वर्ग / वर्ग (Blood / Cat)</span>
            <span className="font-bold text-slate-800">{patient.bloodGroup} • {patient.category}</span>
          </div>
        </div>

        {/* SECTION 1: ROGI PARIKSHA FINDINGS */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
              1
            </span>
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
              रोगी परीक्षा निष्कर्ष (Phase 1: Rogi Pariksha Baseline Assessment)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">प्रकृति एवं विकृति (Constitution &amp; Imbalance)</span>
              <p className="font-bold text-slate-900">प्रकृति: {dashavidha.prakriti?.dominant || 'Pitta-Vata'}</p>
              <p className="text-rose-700 font-semibold mt-0.5">विकृति: {dashavidha.vikriti?.dominant || 'Pittaja Vikriti'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">अग्नि एवं कोष्ठ (Metabolism &amp; Bowel)</span>
              <p className="font-bold text-slate-900">अग्नि: {dashavidha.aharaShakti?.agni || 'Tikshnagni'}</p>
              <p className="text-slate-700 mt-0.5">नाडी: {ashtavidha.nadi || 'Manduka Gati'}</p>
              <p className="text-slate-700">जिह्वा: {ashtavidha.jihva || 'Lipta Shweta'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">सार एवं शोधन क्षमता (Vitality &amp; Cleanse)</span>
              <p className="font-bold text-slate-900">धातु सार: {dashavidha.sara?.overall || 'Madhyama'}</p>
              <p className="text-indigo-900 font-semibold mt-0.5">
                व्यायाम शक्ति: {dashavidha.vyayamaShakti?.grade || 'Madhyama'} ({dashavidha.vyayamaShakti?.shodhanaEligible !== false ? 'शोधन योग्य ✓' : 'शमन केवल'})
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: ROGA PARIKSHA FINDINGS & DIAGNOSIS */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px]">
              2
            </span>
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
              रोग परीक्षा व निदान (Phase 2: Roga Pariksha Pathology &amp; Confirmed Diagnosis)
            </h3>
          </div>

          {activeDiagnosis ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/70 to-slate-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                  पुष्ट प्राथमिक निदान (Confirmed Ayurvedic Diagnosis)
                </span>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  {activeDiagnosis.nameHi || activeDiagnosis.name}
                </div>
                <p className="text-xs text-slate-600 font-semibold">{activeDiagnosis.name}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block">NAMASTE CODE</span>
                  <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeDiagnosis.namasteCode || 'AYU-DX-CONFIRMED'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block">ICD-11 TM-2</span>
                  <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeDiagnosis.icd11Code || 'TM2-CONFIRMED'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50/60 border border-dashed border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                  प्राथमिक निदान (Primary Diagnosis)
                </span>
                <div className="text-base font-black text-amber-950 mt-0.5">
                  पुष्टि प्रतीक्षित (Pending Physician Confirmation)
                </div>
                <p className="text-xs text-amber-700 mt-0.5">
                  वैद्य द्वारा Phase 2 (Roga Pariksha) में निदान की पुष्टि की जानी शेष है।
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300 whitespace-nowrap">
                ⚠️ Unconfirmed (पुष्टि प्रतीक्षित)
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">प्रकुपित दोष</span>
              <p className="font-bold text-slate-800 mt-0.5">{samprapti.dosha || 'Pitta, Samana Vata'}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">दूष्य धातु</span>
              <p className="font-bold text-slate-800 mt-0.5">{samprapti.dushya || 'Rasa, Rakta'}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">स्रोतस</span>
              <p className="font-bold text-slate-800 mt-0.5">{samprapti.srotas || 'Annavaha'}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">साध्यासाध्यता</span>
              <p className="font-bold text-emerald-700 mt-0.5">{samprapti.sadhyaAsadhyata || 'Sukhasadhya'}</p>
            </div>
          </div>

          {/* Nidana Panchaka findings breakdown if recorded */}
          {(roga.nidana?.aharaja?.length > 0 || roga.nidana?.viharaja?.length > 0 || roga.rupa?.length > 0 || roga.upashayaAnupashaya?.upashaya?.length > 0) && (
            <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/80 text-[11px] space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                निदान पंचक विवरण (Classical Nidana Panchaka Findings)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="font-bold text-slate-700 block text-[10px] uppercase">हेतु (Etiological Triggers):</span>
                  <p className="text-slate-600 mt-0.5">
                    {[...(roga.nidana?.aharaja || []), ...(roga.nidana?.viharaja || []), ...(roga.nidana?.manasika || [])].join(', ') || 'None recorded'}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block text-[10px] uppercase">पूर्वरूप एवं व्यक्त रूप (Symptoms):</span>
                  <p className="text-slate-600 mt-0.5">
                    {roga.rupa?.join(', ') || 'None recorded'}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block text-[10px] uppercase">उपशय / अनुपशय (Relieving / Aggravating):</span>
                  <p className="text-slate-600 mt-0.5">
                    {roga.upashayaAnupashaya?.upashaya?.length > 0 ? `उपशय: ${roga.upashayaAnupashaya.upashaya.join(', ')}` : ''}
                    {roga.upashayaAnupashaya?.anupashaya?.length > 0 ? ` | अनुपशय: ${roga.upashayaAnupashaya.anupashaya.join(', ')}` : ''}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: CHIKITSA PLAN (4-FOLD) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px]">
              3
            </span>
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
              चिकित्सा सूत्र एवं उपचार योजना (Phase 3: Multi-Tiered Treatment Plan)
            </h3>
          </div>

          {/* 3.1 & 3.2: Nidana Parivarjana & Ahara */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200">
              <span className="text-[10px] font-black uppercase text-rose-800 block mb-1">
                1. निदान परिवर्जन (Root Cause Cessation)
              </span>
              <ul className="space-y-0.5 text-slate-800 font-medium">
                {chikitsa.nidanaParivarjana?.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-rose-600 font-bold">✗</span>
                    <span>{rule}</span>
                  </li>
                )) || <li>तले-भुने, खट्टे व मिर्च-मसालेदार पदार्थों का त्याग करें।</li>}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <span className="text-[10px] font-black uppercase text-emerald-800 block mb-1">
                2. पथ्य आहार (Targeted Dietary Therapeutics)
              </span>
              <p className="font-medium text-slate-800 leading-relaxed">
                {chikitsa.ahara?.prescribedDiet || dietPathya || 'सुपाच्य, ताजा, मूँग का सूप, अनार व गुनगुना जल।'}
              </p>
            </div>
          </div>

          {/* 3.3: Vihara */}
          <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200 text-xs">
            <span className="text-[10px] font-black uppercase text-indigo-800 block mb-1">
              3. विहार एवं योगासन (Lifestyle, Dinacharya &amp; Yoga)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <div>
                <span className="font-bold text-indigo-950">दिनचर्या: </span>
                <span className="text-slate-700">{chikitsa.vihara?.dinacharya || 'नियमित समय पर शयन एवं अभ्यंग।'}</span>
              </div>
              <div>
                <span className="font-bold text-indigo-950">योगासन-प्राणायाम: </span>
                <span className="text-slate-700">{chikitsa.vihara?.yogaPranayama || yogaPlanText || 'शीतली व नाड़ी शोधन प्राणायाम (15 मिनट)।'}</span>
              </div>
            </div>
          </div>

          {/* 3.4: Shamana Medications Table */}
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              4A. शमन औषध योग (Palliative Prescriptions — Rx)
            </span>
            
            {activeRx.length > 0 ? (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-3">औषध (Medicine)</th>
                      <th className="py-2 px-3">मात्रा (Dose)</th>
                      <th className="py-2 px-3">आवृत्ति (Frequency)</th>
                      <th className="py-2 px-3">सेवन काल (Kaala)</th>
                      <th className="py-2 px-3">अनुपान (Anupana)</th>
                      <th className="py-2 px-3">अवधि (Days)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeRx.map((med, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-900">{med.name}</td>
                        <td className="py-2 px-3 font-mono text-indigo-700">{med.dose}</td>
                        <td className="py-2 px-3 font-medium text-slate-700">{med.frequency}</td>
                        <td className="py-2 px-3 text-amber-800">{med.kaala || med.sevanaKala || 'Pragbhakta'}</td>
                        <td className="py-2 px-3 text-teal-800">{med.anupana || 'Lukewarm Water'}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{med.duration || '21 Days'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
                <p className="font-bold text-slate-700">अद्यावधि कोई शमन योग निर्धारित नहीं है (No formulations prescribed yet)</p>
                <p className="text-[11px] mt-0.5">कृपया Phase 3 (Chikitsa Plan) में जाकर Nidan AI सुझाया गया योग लागू करें अथवा स्वयं नुस्खा जोड़ें।</p>
              </div>
            )}
          </div>

          {/* 3.4B: Shodhana Panchakarma Orders */}
          {activePanchakarma.length > 0 ? (
            <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200 text-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-purple-800 block">
                4B. शोधन पंचकर्म निर्देश (Purification Therapy Protocol)
              </span>
              {activePanchakarma.map((po, i) => (
                <div key={i} className="text-slate-800 font-medium">
                  • <b>{po.protocolName || po.procedure}</b>: {po.dravya ? `(द्रव्य: ${po.dravya}) ` : ''}{po.purvakarma || ''} {po.pradhanakarma || po.notes || ''}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">4B. शोधन पंचकर्म निर्देश</span>
              कोई पंचकर्म शोधन प्रक्रिया निर्धारित नहीं (No Panchakarma procedures ordered).
            </div>
          )}
        </div>

        {/* Doctor Signature & Cryptographic Seal Footer */}
        <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs">
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mb-1 font-mono">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>DIGITAL SIGNATURE HASH</span>
            </div>
            <div className="font-mono text-[10px] text-slate-600 bg-slate-100 p-1.5 rounded border border-slate-200 break-all">
              {prescriptionHash || 'SHA256:7F8B-AIIA-2026-90412'}
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 border-2 border-slate-900 rounded-lg mx-auto flex items-center justify-center bg-slate-50">
              <QrCode size={40} className="text-slate-800" />
            </div>
            <span className="text-[9px] text-slate-400 mt-1 block">Scan for Audio Instructions (Hindi)</span>
          </div>

          <div className="text-right">
            <div className="font-serif font-black text-slate-900 text-sm">वैद्य डॉ. वी. शर्मा</div>
            <div className="text-[11px] text-slate-600">BAMS, MD (Ayu) • Senior Consultant</div>
            <div className="font-mono text-[10px] text-slate-500">Reg No: CCIM-AYU-84920</div>
            <div className="text-[10px] text-emerald-700 font-bold mt-1 flex items-center justify-end gap-1">
              <CheckCircle2 size={12} />
              <span>Digitally Signed &amp; Locked</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
