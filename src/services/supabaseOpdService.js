import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const LOCAL_QUEUE_KEY = 'omni_kiosk_queue';

/**
 * Format a database row into the standardized frontend Patient Case schema
 */
function formatCaseFromDb(row, consultation = null, prescriptions = [], panchakarma = []) {
  const fhir = row.fhir_bundle || {};
  const vitals = row.vitals || {};

  // Extract kiosk inquiries (check row.kiosk_inquiries, then fhir_bundle, then rawIntake)
  let kioskInquiries = [];
  if (Array.isArray(row.kiosk_inquiries) && row.kiosk_inquiries.length > 0) {
    kioskInquiries = row.kiosk_inquiries;
  } else if (Array.isArray(fhir.kioskInquiries) && fhir.kioskInquiries.length > 0) {
    kioskInquiries = fhir.kioskInquiries;
  } else if (fhir.rawIntake?.aiInquiriesResponse) {
    kioskInquiries = Object.entries(fhir.rawIntake.aiInquiriesResponse).map(([id, item]) => ({
      id,
      questionHi: item.questionHi,
      questionEn: item.questionEn,
      patientAnswer: item.answer || item.patientAnswer,
      clinicalReason: item.clinicalReason
    }));
  }

  // Extract CCRAS Prakriti and answers
  const ccrasAnswers = vitals.ccrasAnswers || fhir.rawPariksha?.ccrasAnswers || fhir.rawPariksha?.prakritiAnswers || {};
  const prakritiResult = vitals.prakritiResult || fhir.rawPariksha?.prakritiResult || {
    dominant: row.patients?.prakriti_dominant || 'Sama Dosha (Tridoshaja)'
  };

  return {
    id: row.id,
    token: row.token,
    uhid: row.patient_uhid || row.patients?.uhid || 'AIIA-2026-9842',
    crNo: row.cr_no || `2026/AIIA/${Math.floor(10000 + Math.random() * 90000)}`,
    department: row.department || 'Kaumarbhritya / Kayachikitsa',
    roomNo: row.room_no || '12',
    status: row.status || 'WAITING',
    redFlag: Boolean(row.red_flag),
    checkinTime: row.checkin_time || row.created_at,
    patient: {
      id: row.patient_id,
      uhid: row.patient_uhid || row.patients?.uhid,
      name: row.patient_name || row.patients?.name || 'Patient',
      age: row.patients?.age || 45,
      gender: row.patients?.gender || 'Female',
      phone: row.patients?.phone || '',
      abhaId: row.patients?.abha_id || '',
      category: row.patients?.category || 'General',
      pmjayStatus: row.patients?.pmjay_status || 'AB-PMJAY Verified'
    },
    chiefComplaint: row.chief_complaint || '',
    duration: row.duration || '1 Month',
    site: row.site || '',
    intake: {
      chiefComplaint: row.chief_complaint || fhir.rawIntake?.complaintLabelHi || fhir.rawIntake?.complaintLabel || '',
      complaintLabel: fhir.rawIntake?.complaintLabel || row.chief_complaint || '',
      complaintLabelHi: fhir.rawIntake?.complaintLabelHi || row.chief_complaint || '',
      complaintId: fhir.rawIntake?.complaintId || '',
      duration: row.duration || fhir.rawIntake?.answers?.duration || fhir.rawIntake?.answers?.T || fhir.rawIntake?.duration || '1 Month',
      site: (row.site && row.site !== 'उदर / Retrosternal')
        ? row.site
        : (fhir.rawIntake?.answers?.site || fhir.rawIntake?.answers?.S || fhir.rawIntake?.site || (row.chief_complaint?.includes('दर्द') || row.chief_complaint?.includes('संधि') || row.chief_complaint?.includes('जोड़ों') || row.chief_complaint?.includes('घुटने') ? 'घुटने व जोड़ (Janu Sandhi)' : (row.site || 'स्थान निर्दिष्ट नहीं'))),
      onset: row.onset || fhir.rawIntake?.answers?.onset || fhir.rawIntake?.answers?.O || fhir.rawIntake?.onset || 'Gradual',
      severityVas: row.severity_vas || parseInt(fhir.rawIntake?.answers?.S_vas || fhir.rawIntake?.answers?.severity || fhir.rawIntake?.severityVas || 6, 10),
      associatedSymptoms: (Array.isArray(row.associated_symptoms) && row.associated_symptoms.length > 0)
        ? row.associated_symptoms
        : (fhir.rawIntake?.associatedSymptoms || fhir.rawIntake?.answers?.associatedSymptoms || []),
      triggers: {
        ahara: row.triggers_ahara || fhir.rawIntake?.triggers?.ahara || [],
        vihara: row.triggers_vihara || fhir.rawIntake?.triggers?.vihara || [],
        manasika: row.triggers_manasika || fhir.rawIntake?.triggers?.manasika || []
      },
      kioskInquiries,
      currentMedications: fhir.currentMedications || fhir.rawIntake?.currentMedications || [],
      previousMedications: fhir.previousMedications || fhir.rawIntake?.previousMedications || [],
      pastConditions: fhir.pastConditions || fhir.rawIntake?.pastConditions || [],
      knownAllergies: fhir.knownAllergies || fhir.rawIntake?.knownAllergies || [],
      answers: fhir.rawIntake?.answers || {}
    },
    rogiPariksha: {
      lakshana: {
        chiefComplaint: row.chief_complaint || fhir.rawIntake?.complaintLabelHi || fhir.rawIntake?.complaintLabel || '',
        complaintLabel: fhir.rawIntake?.complaintLabel || row.chief_complaint || '',
        complaintLabelHi: fhir.rawIntake?.complaintLabelHi || row.chief_complaint || '',
        duration: row.duration || fhir.rawIntake?.answers?.duration || '1 Month',
        site: row.site || fhir.rawIntake?.answers?.site || '',
        onset: row.onset || fhir.rawIntake?.answers?.onset || 'Gradual',
        severityVas: row.severity_vas || 6,
        associated: row.associated_symptoms || fhir.rawIntake?.associatedSymptoms || []
      },
      ashtavidha: consultation?.ashtavidha_pariksha || vitals.ashtavidha || {},
      dashavidha: consultation?.dashavidha_pariksha || {
        prakriti: prakritiResult,
        aharaShakti: { agni: vitals.agni || 'Mandagni' }
      }
    },
    pariksha: {
      vitals: {
        bp: vitals.bp || '120/80',
        pulse: vitals.pulse || 72,
        spo2: vitals.spo2 || 98,
        temperature: vitals.temperature || 98.4,
        bmi: vitals.bmi || 22.5,
        weight: vitals.weight || 62,
        height: vitals.height || 163
      },
      prakritiResult,
      ccrasAnswers,
      prakritiAnswers: ccrasAnswers,
      agni: vitals.agni || 'Mandagni',
      koshtha: vitals.koshtha || 'Madhyama',
      ashtavidha: consultation?.ashtavidha_pariksha || {
        nadi: null,
        jihva: null,
        mala: null,
        mutra: null,
        shabda: null,
        sparsha: null,
        druk: null,
        akriti: null
      },
      dashavidha: consultation?.dashavidha_pariksha || {}
    },
    assessment: {
      confirmedDiagnosis: consultation?.confirmed_diagnosis ? {
        name: consultation.confirmed_diagnosis,
        nameHi: consultation.diagnosis_name_hi || consultation.confirmed_diagnosis,
        namasteCode: consultation.namaste_code,
        icd11Code: consultation.icd11_code
      } : null,
      diagnosisNameHi: consultation?.diagnosis_name_hi || null,
      namasteCode: consultation?.namaste_code || null,
      icd11Code: consultation?.icd11_code || null,
      confidence: consultation?.diagnosis_confidence || 95
    },
    rogaPariksha: consultation?.chikitsa_plan?.rogaPariksha || {
      nidana: {
        aharaja: row.triggers_ahara || fhir.rawIntake?.triggers?.ahara || [],
        viharaja: row.triggers_vihara || fhir.rawIntake?.triggers?.vihara || [],
        manasika: row.triggers_manasika || fhir.rawIntake?.triggers?.manasika || []
      },
      purvarupa: [],
      rupa: (Array.isArray(row.associated_symptoms) && row.associated_symptoms.length > 0)
        ? row.associated_symptoms
        : (fhir.rawIntake?.associatedSymptoms || []),
      upashayaAnupashaya: { upashaya: [], anupashaya: [] },
      samprapti: {}
    },
    chikitsaPlan: consultation?.chikitsa_plan || {},
    clinicalNotes: consultation?.doctor_notes || '',
    prescriptions: (prescriptions && prescriptions.length > 0) ? prescriptions.map(p => ({
      id: p.id || Date.now(),
      name: p.name,
      dose: p.dosage || p.dose || '250 mg',
      frequency: p.frequency || 'BD (Twice Daily)',
      kaala: p.timing || p.kaala || 'Pragbhakta (Before Meals)',
      anupana: p.anupana || 'Lukewarm Water',
      duration: p.duration || '15 Days',
      kalpana: p.type || 'Classical Formulation',
      type: p.type || 'Classical Formulation',
      system: 'ayurvedic',
      purpose: p.instructions || p.purpose || 'Shamana Chikitsa'
    })) : [],
    panchakarmaOrders: (panchakarma && panchakarma.length > 0) ? panchakarma.map(pk => ({
      id: pk.id || Date.now(),
      procedure: pk.procedure_name || pk.procedure,
      days: pk.duration_days || pk.days || '7 Days',
      purvakarma: pk.purvakarma || '',
      pradhanakarma: pk.pradhanakarma || '',
      paschatkarma: pk.paschatkarma || '',
      status: pk.status || 'ORDERED'
    })) : [],
    isPrescriptionSigned: Boolean(consultation?.is_signed),
    eSignedAt: consultation?.e_signed_at || null,
    digitalSeal: consultation?.digital_seal || null
  };
}

export const supabaseOpdService = {
  /**
   * Check if live Supabase cloud connection is active
   */
  isLive() {
    return isSupabaseConfigured && Boolean(supabase);
  },

  /**
   * Fetch all registered OPD patients from Supabase or local store
   */
  async fetchOpdQueue() {
    if (this.isLive()) {
      try {
        let { data: queueRows, error } = await supabase
          .from('opd_queue')
          .select(`
            *,
            patients (*)
          `)
          .order('checkin_time', { ascending: false });

        if (error) throw error;
        queueRows = queueRows ? [...queueRows] : [];

        // Check if there are any patients in `patients` table not yet queued
        try {
          const { data: allPatients } = await supabase
            .from('patients')
            .select('*')
            .order('created_at', { ascending: false });

          if (allPatients && allPatients.length > 0) {
            const queuedPatientIds = new Set(queueRows.map(r => r.patient_id));
            const unqueued = allPatients.filter(p => !queuedPatientIds.has(p.id));

            for (const p of unqueued) {
              const token = `AYU-${Math.floor(100 + Math.random() * 900)}`;
              const { data: newRow, error: nErr } = await supabase
                .from('opd_queue')
                .insert({
                  token,
                  patient_id: p.id,
                  patient_uhid: p.uhid,
                  patient_name: p.name,
                  status: 'WAITING',
                  chief_complaint: 'सामान्य बाह्य रोगी परामर्श (General OPD Consultation)',
                  checkin_time: p.created_at || new Date().toISOString()
                })
                .select('*, patients(*)')
                .single();

              if (!nErr && newRow) {
                queueRows.unshift(newRow);
              }
            }
          }
        } catch (syncErr) {
          console.warn('Auto-sync unqueued patients check skipped:', syncErr);
        }

        if (queueRows.length === 0) {
          localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify([]));
          return [];
        }

        // Fetch associated consultations, prescriptions, and panchakarma orders
        const queueIds = queueRows.map(r => r.id);

        const [{ data: consultations }, { data: prescriptions }, { data: panchakarma }] = await Promise.all([
          supabase.from('consultations').select('*').in('encounter_id', queueIds),
          supabase.from('prescriptions').select('*').in('encounter_id', queueIds),
          supabase.from('panchakarma_orders').select('*').in('encounter_id', queueIds)
        ]);

        const consultMap = new Map((consultations || []).map(c => [c.encounter_id, c]));
        const rxMap = new Map();
        (prescriptions || []).forEach(p => {
          if (!rxMap.has(p.encounter_id)) rxMap.set(p.encounter_id, []);
          rxMap.get(p.encounter_id).push(p);
        });
        const pkMap = new Map();
        (panchakarma || []).forEach(p => {
          if (!pkMap.has(p.encounter_id)) pkMap.set(p.encounter_id, []);
          pkMap.get(p.encounter_id).push(p);
        });

        const formatted = queueRows.map(row => 
          formatCaseFromDb(
            row, 
            consultMap.get(row.id), 
            rxMap.get(row.id) || [], 
            pkMap.get(row.id) || []
          )
        );

        // Keep local cache synced
        localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(formatted));
        return formatted;
      } catch (err) {
        console.warn('⚠️ Error fetching queue from Supabase, checking local cache:', err);
      }
    }

    // Fallback to local storage (starts empty if clean)
    try {
      const stored = localStorage.getItem(LOCAL_QUEUE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error reading local queue:', e);
    }
    return [];
  },

  /**
   * Subscribe to real-time additions/updates on the OPD Queue and Patients table
   */
  subscribeToOpdQueue(onQueueChange) {
    if (this.isLive()) {
      const channel = supabase
        .channel('public:opd_live_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'opd_queue' },
          async (payload) => {
            console.log('🔄 [Supabase Realtime] OPD Queue updated:', payload.eventType);
            const freshQueue = await this.fetchOpdQueue();
            onQueueChange(freshQueue);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'patients' },
          async (payload) => {
            console.log('🔄 [Supabase Realtime] Patient table updated:', payload.eventType);
            const freshQueue = await this.fetchOpdQueue();
            onQueueChange(freshQueue);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    // Local storage cross-tab synchronization fallback
    const handleStorage = (e) => {
      if (e.key === LOCAL_QUEUE_KEY) {
        try {
          const fresh = JSON.parse(e.newValue || '[]');
          onQueueChange(fresh);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  },

  /**
   * Register a new patient and insert encounter into the OPD Queue (from MediKiosk or Reception)
   */
  async createKioskEncounter(encounterData) {
    const { patient, intake, pariksha, token, redFlag = false } = encounterData;
    const uhid = patient.uhid || `AIIA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    if (this.isLive()) {
      try {
        // 1. Upsert Patient
        const { data: patientRow, error: pErr } = await supabase
          .from('patients')
          .upsert(
            {
              uhid: uhid,
              abha_id: patient.abhaId || null,
              name: patient.name || 'Patient',
              age: parseInt(patient.age, 10) || 45,
              gender: patient.gender || 'Female',
              phone: patient.phone || '',
              category: patient.category || 'AYUSH-OPD',
              pmjay_status: patient.pmjayStatus || 'AB-PMJAY Verified',
              prakriti_dominant: pariksha?.prakritiResult?.dominant || 'Vata-Pitta'
            },
            { onConflict: 'uhid' }
          )
          .select()
          .single();

        if (pErr) throw pErr;

        // 1. Synthesize Nidan AI inquiries & patient answers from Kiosk
        let kioskInquiries = [];
        if (Array.isArray(intake?.kioskInquiries) && intake.kioskInquiries.length > 0) {
          kioskInquiries = intake.kioskInquiries;
        } else if (intake?.aiInquiriesResponse && Object.keys(intake.aiInquiriesResponse).length > 0) {
          kioskInquiries = Object.entries(intake.aiInquiriesResponse).map(([id, item]) => ({
            id,
            questionHi: item.questionHi,
            questionEn: item.questionEn,
            patientAnswer: item.answer || item.patientAnswer,
            clinicalReason: item.clinicalReason
          }));
        } else if (Array.isArray(intake?.kioskAiInquiries) && intake.kioskAiInquiries.length > 0) {
          kioskInquiries = intake.kioskAiInquiries.map(inq => ({
            id: inq.id,
            questionHi: inq.questionHi,
            questionEn: inq.questionEn,
            patientAnswer: intake?.aiInquiriesResponse?.[inq.id]?.answer || null,
            clinicalReason: inq.clinicalReason
          }));
        }

        // 2. Extract SOCRATES symptoms
        let associatedSymptoms = [];
        if (Array.isArray(intake?.associatedSymptoms) && intake.associatedSymptoms.length > 0) {
          associatedSymptoms = intake.associatedSymptoms;
        } else if (Array.isArray(intake?.symptoms) && intake.symptoms.length > 0) {
          associatedSymptoms = intake.symptoms;
        } else if (intake?.answers?.A) {
          associatedSymptoms = Array.isArray(intake.answers.A) ? intake.answers.A : [intake.answers.A];
        }

        // 3. Extract triggers
        const triggersAhara = Array.isArray(intake?.triggers?.ahara) && intake.triggers.ahara.length > 0
          ? intake.triggers.ahara
          : (intake?.answers?.E ? [intake.answers.E] : []);
        const triggersVihara = Array.isArray(intake?.triggers?.vihara) ? intake.triggers.vihara : [];
        const triggersManasika = Array.isArray(intake?.triggers?.manasika) ? intake.triggers.manasika : [];

        // 4. Enrich vitals with Prakriti and CCRAS scale answers
        const richVitals = {
          bp: pariksha?.vitals?.bp || '120/80',
          pulse: pariksha?.vitals?.pulse || 76,
          spo2: pariksha?.vitals?.spo2 || 98,
          temperature: pariksha?.vitals?.temperature || 98.4,
          bmi: pariksha?.vitals?.bmi || 23.4,
          weight: pariksha?.vitals?.weight || 62,
          height: pariksha?.vitals?.height || 163,
          prakritiResult: pariksha?.prakritiResult || { dominant: patient?.prakritiDominant || 'Vata-Pitta' },
          ccrasAnswers: pariksha?.ccrasAnswers || pariksha?.prakritiAnswers || {},
          agni: pariksha?.agni || 'Mandagni',
          koshtha: pariksha?.koshtha || 'Madhyama'
        };

        // 5. Complete FHIR bundle with all raw intake and pariksha data
        const enrichedFhirBundle = {
          ...(encounterData.fhirBundle || {}),
          rawPatient: patient,
          rawIntake: intake,
          rawPariksha: pariksha,
          kioskInquiries,
          currentMedications: intake?.currentMedications || [],
          previousMedications: intake?.previousMedications || [],
          pastConditions: intake?.pastConditions || [],
          knownAllergies: intake?.knownAllergies || []
        };

        // 6. Insert into opd_queue
        const { data: queueRow, error: qErr } = await supabase
          .from('opd_queue')
          .insert({
            token: token || `AYU-${Math.floor(100 + Math.random() * 900)}`,
            patient_id: patientRow.id,
            patient_uhid: uhid,
            patient_name: patient.name || 'Patient',
            cr_no: `2026/AIIA/${Math.floor(10000 + Math.random() * 90000)}`,
            status: 'WAITING',
            red_flag: Boolean(redFlag),
            vitals: richVitals,
            chief_complaint: intake?.complaintLabelHi || intake?.complaintLabel || intake?.chiefComplaint || 'सामान्य परामर्श',
            duration: intake?.answers?.duration || intake?.answers?.T || intake?.duration || '1 Month',
            site: intake?.answers?.site || intake?.answers?.S || intake?.site || (intake?.complaintId === 'joint_pain' || (intake?.complaintLabel || '').toLowerCase().includes('joint') ? 'घुटने व जोड़ (Janu Sandhi)' : 'स्थान निर्दिष्ट नहीं'),
            onset: intake?.answers?.onset || intake?.answers?.O || intake?.onset || 'Gradual',
            severity_vas: parseInt(intake?.answers?.S_vas || intake?.severityVas || 6, 10),
            associated_symptoms: associatedSymptoms,
            triggers_ahara: triggersAhara,
            triggers_vihara: triggersVihara,
            triggers_manasika: triggersManasika,
            kiosk_inquiries: kioskInquiries,
            documents: encounterData.documents || [],
            fhir_bundle: enrichedFhirBundle
          })
          .select()
          .single();

        if (qErr) throw qErr;

        // Re-fetch and return formatted case
        const createdCase = formatCaseFromDb(queueRow, null, [], []);
        return createdCase;
      } catch (err) {
        console.error('Failed creating kiosk encounter in Supabase, saving locally:', err);
      }
    }

    // Local fallback
    const fallbackCase = {
      id: `case-${Date.now()}`,
      token: token || `AYU-${Math.floor(100 + Math.random() * 900)}`,
      uhid,
      crNo: `2026/AIIA/${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'WAITING',
      redFlag: Boolean(redFlag),
      checkinTime: new Date().toISOString(),
      patient: {
        uhid,
        name: patient.name || 'Patient',
        age: patient.age || 45,
        gender: patient.gender || 'Female',
        phone: patient.phone || '',
        abhaId: patient.abhaId || '',
        category: patient.category || 'General',
        pmjayStatus: patient.pmjayStatus || 'AB-PMJAY Verified'
      },
      intake: {
        chiefComplaint: intake?.complaintLabelHi || intake?.complaintLabel || intake?.chiefComplaint || 'सामान्य परामर्श',
        duration: intake?.answers?.T || intake?.duration || '1 Month',
        site: intake?.answers?.S || intake?.site || 'उदर',
        onset: intake?.answers?.O || intake?.onset || 'Gradual',
        severityVas: intake?.answers?.S_vas || intake?.severityVas || 6,
        associatedSymptoms: intake?.associatedSymptoms || [],
        triggers: intake?.triggers || {},
        kioskInquiries: intake?.kioskInquiries || []
      },
      pariksha: {
        vitals: pariksha?.vitals || { bp: '124/82', pulse: 76, spo2: 98, temperature: 98.4, bmi: 23.4 },
        ashtavidha: { nadi: null, jihva: null, mala: null, mutra: null, shabda: null, sparsha: null, druk: null, akriti: null },
        dashavidha: {}
      },
      assessment: { confirmedDiagnosis: null },
      clinicalNotes: '',
      prescriptions: [],
      panchakarmaOrders: [],
      isPrescriptionSigned: false
    };

    const localList = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
    const nextList = [fallbackCase, ...localList];
    localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(nextList));
    return fallbackCase;
  },

  /**
   * Update encounter status (WAITING, IN_CONSULTATION, CONSULTED, CANCELLED)
   */
  async updateEncounterStatus(encounterId, status) {
    if (this.isLive() && encounterId && !encounterId.startsWith('case-')) {
      try {
        await supabase
          .from('opd_queue')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', encounterId);
      } catch (err) {
        console.warn('Could not update status in Supabase:', err);
      }
    }

    // Sync in local store
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
      const updated = stored.map(c => c.id === encounterId ? { ...c, status } : c);
      localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(updated));
    } catch {}
  },

  /**
   * Save doctor consultation record (Notes, Ashtavidha, Dashavidha, Nidana Panchaka, Confirmed Diagnosis, Chikitsa Plan)
   */
  async saveConsultation(encounterId, consultationData) {
    const {
      patientId,
      ashtavidha,
      dashavidha,
      notes,
      assessmentNotes,
      confirmedDiagnosis,
      diagnosisNameHi,
      namasteCode,
      icd11Code,
      rogaPariksha,
      chikitsaPlan
    } = consultationData;

    // Combine chikitsaPlan with rogaPariksha into the JSONB payload
    const combinedChikitsa = {
      ...(chikitsaPlan || {}),
      rogaPariksha: rogaPariksha || chikitsaPlan?.rogaPariksha || {}
    };

    if (this.isLive() && encounterId && !encounterId.startsWith('case-')) {
      try {
        const { error } = await supabase
          .from('consultations')
          .upsert(
            {
              encounter_id: encounterId,
              patient_id: patientId || null,
              ashtavidha_pariksha: ashtavidha || {},
              dashavidha_pariksha: dashavidha || {},
              doctor_notes: notes || '',
              assessment_notes: assessmentNotes || '',
              confirmed_diagnosis: confirmedDiagnosis || null,
              diagnosis_name_hi: diagnosisNameHi || null,
              namaste_code: namasteCode || null,
              icd11_code: icd11Code || null,
              chikitsa_plan: combinedChikitsa,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'encounter_id' }
          );

        if (error) console.warn('Supabase consultation update warning:', error);

        // Also update opd_queue table with updated triggers and symptoms
        if (rogaPariksha?.nidana || rogaPariksha?.rupa) {
          const n = rogaPariksha.nidana || {};
          await supabase.from('opd_queue').update({
            triggers_ahara: n.aharaja || [],
            triggers_vihara: n.viharaja || [],
            triggers_manasika: n.manasika || [],
            associated_symptoms: rogaPariksha.rupa || [],
            updated_at: new Date().toISOString()
          }).eq('id', encounterId);
        }
      } catch (err) {
        console.warn('Failed to update consultation in Supabase:', err);
      }
    }

    // Local storage sync
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
      const updated = stored.map(c => {
        if (c.id === encounterId) {
          return {
            ...c,
            clinicalNotes: notes !== undefined ? notes : c.clinicalNotes,
            rogiPariksha: {
              ...(c.rogiPariksha || {}),
              ashtavidha: ashtavidha || c.rogiPariksha?.ashtavidha,
              dashavidha: dashavidha || c.rogiPariksha?.dashavidha
            },
            pariksha: {
              ...(c.pariksha || {}),
              ashtavidha: ashtavidha || c.pariksha?.ashtavidha
            },
            rogaPariksha: rogaPariksha || c.rogaPariksha,
            chikitsaPlan: combinedChikitsa,
            assessment: {
              ...c.assessment,
              confirmedDiagnosis: confirmedDiagnosis ? {
                name: confirmedDiagnosis,
                nameHi: diagnosisNameHi || confirmedDiagnosis,
                namasteCode: namasteCode || c.assessment?.namasteCode,
                icd11Code: icd11Code || c.assessment?.icd11Code
              } : c.assessment?.confirmedDiagnosis,
              namasteCode: namasteCode || c.assessment?.namasteCode,
              icd11Code: icd11Code || c.assessment?.icd11Code
            }
          };
        }
        return c;
      });
      localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(updated));
    } catch {}
  },

  /**
   * Persist Prescriptions
   */
  async savePrescriptions(encounterId, prescriptions) {
    if (this.isLive() && encounterId && !encounterId.startsWith('case-')) {
      try {
        // Delete previous and reinsert
        await supabase.from('prescriptions').delete().eq('encounter_id', encounterId);
        if (prescriptions && prescriptions.length > 0) {
          const rows = prescriptions.map(rx => ({
            encounter_id: encounterId,
            name: rx.name,
            type: rx.kalpana || rx.type || 'Classical Formulation',
            dosage: rx.dose || rx.dosage || '250 mg',
            frequency: rx.frequency || 'BD (Twice Daily)',
            timing: rx.kaala || rx.timing || 'Pragbhakta (Before Meals)',
            anupana: rx.anupana || 'Lukewarm Water',
            duration: rx.duration || '15 Days',
            instructions: rx.purpose || rx.instructions || 'Shamana Chikitsa'
          }));
          await supabase.from('prescriptions').insert(rows);
        }
      } catch (err) {
        console.warn('Prescriptions save warning:', err);
      }
    }

    // Local storage sync
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
      const updated = stored.map(c => c.id === encounterId ? { ...c, prescriptions } : c);
      localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(updated));
    } catch {}
  },

  /**
   * Persist Panchakarma Orders
   */
  async savePanchakarmaOrders(encounterId, orders) {
    if (this.isLive() && encounterId && !encounterId.startsWith('case-')) {
      try {
        await supabase.from('panchakarma_orders').delete().eq('encounter_id', encounterId);
        if (orders && orders.length > 0) {
          const rows = orders.map(pk => ({
            encounter_id: encounterId,
            procedure_name: pk.procedure || pk.procedure_name || 'Mridu Virechana Karma',
            duration_days: parseInt(pk.days || pk.duration_days || 7, 10),
            purvakarma: pk.purvakarma || '',
            pradhanakarma: pk.pradhanakarma || pk.notes || '',
            paschatkarma: pk.paschatkarma || '',
            status: pk.status || 'ORDERED'
          }));
          await supabase.from('panchakarma_orders').insert(rows);
        }
      } catch (err) {
        console.warn('Panchakarma save warning:', err);
      }
    }

    // Local storage sync
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
      const updated = stored.map(c => c.id === encounterId ? { ...c, panchakarmaOrders: orders } : c);
      localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(updated));
    } catch {}
  },

  /**
   * Digital E-Sign and ABDM cryptographic seal
   */
  async signConsultation(encounterId, sealData) {
    const timestamp = new Date().toISOString();
    if (this.isLive() && encounterId && !encounterId.startsWith('case-')) {
      try {
        await supabase
          .from('consultations')
          .update({
            is_signed: true,
            e_signed_at: timestamp,
            digital_seal: sealData?.hash || null
          })
          .eq('encounter_id', encounterId);

        await supabase
          .from('opd_queue')
          .update({
            status: 'CONSULTED',
            updated_at: timestamp
          })
          .eq('id', encounterId);
      } catch (err) {
        console.warn('Sign consultation warning in Supabase:', err);
      }
    }

    // Local storage sync
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
      const updated = stored.map(c => {
        if (c.id === encounterId) {
          return {
            ...c,
            status: 'CONSULTED',
            isPrescriptionSigned: true,
            eSignedAt: timestamp,
            digitalSeal: sealData?.hash
          };
        }
        return c;
      });
      localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(updated));
    } catch {}
  },

  /**
   * Helper: Quick Seed One Sample Patient into Supabase or Local (for testing/demo)
   */
  async seedOneSamplePatient() {
    const sampleIntake = {
      patient: {
        uhid: `AIIA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: 'Sunita Sharma',
        age: 52,
        gender: 'Female',
        phone: '+91 98765 43210',
        category: 'Priority (Severe Pitta Vidaha)',
        pmjayStatus: 'AB-PMJAY Golden Card Verified'
      },
      intake: {
        chiefComplaint: 'Urdhwaga Amlapitta (छाती व पेट में तीव्र जलन, खट्टी डकारें)',
        duration: '6 Months',
        site: 'Epigastrium & Retrosternal',
        onset: 'Gradual',
        severityVas: 7,
        associatedSymptoms: ['Hrit-Kantha Daha', 'Tikta-Amlodgara', 'Utklesha'],
        triggers: {
          ahara: ['अत्यधिक मिर्च-मसालेदार व तला हुआ भोजन', 'खट्टा व फर्मेंटेड खाद्य'],
          vihara: ['देर रात तक जागना (रात्रि-जागरण)', 'अनियमित भोजन समय'],
          manasika: ['मानसिक तनाव व चिंता']
        },
        kioskInquiries: [
          {
            questionHi: 'क्या आपकी समस्या का संबंध विशेष प्रकार के आहार, जैसे अत्यधिक तीखा, खट्टा, तला हुआ भोजन या चाय/कॉफ़ी के सेवन से है?',
            questionEn: 'Is your condition aggravated by specific dietary items such as excessively spicy, sour, fried foods, or tea/coffee?',
            patientAnswer: 'हाँ, बहुत अधिक — विशेष रूप से मिर्च-मसालेदार व खट्टा भोजन खाने पर जलन बहुत बढ़ जाती है।',
            clinicalReason: 'To identify Pitta-prakopaka Ahara which directly vitiates Agni.'
          },
          {
            questionHi: 'क्या आपको भोजन के पचने या अपच (अजीर्ण) का अहसास होता है, और क्या यह समस्या मानसिक तनाव या चिंता के समय बढ़ जाती है?',
            questionEn: 'Do you experience a sense of indigestion (Ajeerna), and does this condition worsen during periods of mental stress or anxiety?',
            patientAnswer: 'हाँ, मानसिक तनाव व चिंता में अपच और सीने में जलन और बढ़ जाती है।',
            clinicalReason: 'To evaluate the involvement of Manasika hetus.'
          },
          {
            questionHi: 'क्या आपको रात में जागने की आदत है या आपका भोजन करने का समय अनियमित रहता है?',
            questionEn: 'Do you have a habit of staying awake late at night (Ratri-jagarana) or do you have irregular meal timings?',
            patientAnswer: 'हाँ, अक्सर देर रात तक जागती हूँ और भोजन का समय अनियमित रहता है।',
            clinicalReason: 'Pinpoints primary Viharaja Hetu inducing Pitta surge.'
          }
        ]
      },
      pariksha: {
        vitals: { bp: '124/82', pulse: 76, spo2: 98, temperature: 98.4, bmi: 23.4, weight: 62, height: 163 },
        prakritiResult: { dominant: 'Pitta-Vata' }
      },
      token: `AYU-${Math.floor(101 + Math.random() * 90)}`
    };

    return await this.createKioskEncounter(sampleIntake);
  },

  /**
   * Helper: Clear all active queue (for fresh restart)
   */
  async clearAllQueue() {
    if (this.isLive()) {
      try {
        await supabase.from('opd_queue').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (err) {
        console.warn('Clear queue warning:', err);
      }
    }
    localStorage.removeItem(LOCAL_QUEUE_KEY);
    return [];
  }
};
