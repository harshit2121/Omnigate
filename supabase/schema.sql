-- ==============================================================================
-- OMNIGATE AYUSH HOSPITAL INFORMATION SYSTEM (HIS)
-- Production PostgreSQL Database Schema for Supabase
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing tables if re-running migration
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS panchakarma_orders CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS opd_queue CASCADE;
DROP TABLE IF EXISTS patients CASCADE;

-- ------------------------------------------------------------------------------
-- Table 1: PATIENTS (Master Demographics & ABDM Identity)
-- ------------------------------------------------------------------------------
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uhid TEXT UNIQUE NOT NULL,                       -- e.g. AIIA-2026-9842
    abha_id TEXT UNIQUE,                             -- e.g. 91-8472-1092-4820
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    phone TEXT,
    address TEXT,
    category TEXT DEFAULT 'AYUSH-OPD',               -- Priority, Senior Citizen, BPL, General
    pmjay_status TEXT DEFAULT 'AB-PMJAY Verified',
    prakriti_dominant TEXT,                         -- Vata-Pitta, Kapha-Pitta, etc.
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Table 2: OPD_QUEUE (Live Patient Queue & MediKiosk Intake)
-- ------------------------------------------------------------------------------
CREATE TABLE opd_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT NOT NULL,                             -- e.g. AYU-101
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    patient_uhid TEXT,
    patient_name TEXT NOT NULL,
    cr_no TEXT,                                      -- Central Registration Number
    department TEXT DEFAULT 'Kaumarbhritya / Kayachikitsa',
    room_no TEXT DEFAULT '12',
    status TEXT DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'IN_CONSULTATION', 'CONSULTED', 'CANCELLED')),
    red_flag BOOLEAN DEFAULT FALSE,
    checkin_time TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Vitals Recorded at Kiosk or Nurse Station
    vitals JSONB DEFAULT '{
        "bp": "124/82",
        "pulse": 76,
        "spo2": 98,
        "temperature": 98.4,
        "bmi": 23.4,
        "weight": 62,
        "height": 163
    }'::jsonb,
    
    -- Multimodal Chief Complaints & SOCRATES Intake
    chief_complaint TEXT NOT NULL,                   -- e.g. Urdhwaga Amlapitta (अम्लपित्त)
    duration TEXT,                                   -- e.g. 6 Months
    site TEXT,                                       -- e.g. Epigastrium & Retrosternal
    onset TEXT,                                      -- e.g. Gradual
    severity_vas INTEGER CHECK (severity_vas BETWEEN 0 AND 10),
    associated_symptoms JSONB DEFAULT '[]'::jsonb,
    
    -- Etiological Triggers (Nidana)
    triggers_ahara JSONB DEFAULT '[]'::jsonb,
    triggers_vihara JSONB DEFAULT '[]'::jsonb,
    triggers_manasika JSONB DEFAULT '[]'::jsonb,
    
    -- Nidan AI Questions & Patient's Recorded Answers from MediKiosk
    kiosk_inquiries JSONB DEFAULT '[]'::jsonb,       -- Array of { questionHi, questionEn, patientAnswer, clinicalReason }
    
    -- Digitize Documents & FHIR Bundle
    documents JSONB DEFAULT '[]'::jsonb,
    fhir_bundle JSONB,
    
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Table 3: CONSULTATIONS (Doctor Clinical Workstation Record)
-- ------------------------------------------------------------------------------
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID REFERENCES opd_queue(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    doctor_id TEXT DEFAULT 'DOC-AYU-842',
    doctor_name TEXT DEFAULT 'Dr. Vaidya V. K. Sharma',
    
    -- Phase 1: Clinical Pariksha findings recorded by doctor
    ashtavidha_pariksha JSONB DEFAULT '{
        "nadi": null,
        "jihva": null,
        "mala": null,
        "mutra": null,
        "shabda": null,
        "sparsha": null,
        "druk": null,
        "akriti": null
    }'::jsonb,
    dashavidha_pariksha JSONB DEFAULT '{}'::jsonb,
    
    -- Clinical Notes (SOAP Notes)
    doctor_notes TEXT,                               -- Direct consultation notes & observations
    assessment_notes TEXT,
    
    -- Phase 2: Confirmed Diagnosis & Classification
    confirmed_diagnosis TEXT,                        -- e.g. Urdhwaga Amlapitta (अम्लपित्त)
    diagnosis_name_hi TEXT,
    namaste_code TEXT,                               -- e.g. AYU-AML-01
    icd11_code TEXT,                                 -- e.g. MD12.0
    diagnosis_confidence INTEGER DEFAULT 95,
    
    -- Phase 3: Comprehensive Chikitsa Guidelines
    chikitsa_plan JSONB DEFAULT '{
        "nidanaParivarjana": [],
        "aharaRules": [],
        "viharaRules": [],
        "yogasana": []
    }'::jsonb,
    
    -- Phase 4: Official E-Signature & ABDM Cryptographic Seal
    is_signed BOOLEAN DEFAULT FALSE,
    e_signed_at TIMESTAMPTZ,
    digital_seal TEXT,                               -- SHA-256 Hash Seal
    
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Table 4: PRESCRIPTIONS (Classical Shamana Aushadha Formulations)
-- ------------------------------------------------------------------------------
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    encounter_id UUID REFERENCES opd_queue(id) ON DELETE CASCADE,
    name TEXT NOT NULL,                              -- e.g. Sutshekhar Ras
    type TEXT,                                       -- Rasa/Bhasma, Churna, Vati, Kwath, etc.
    dosage TEXT,                                     -- e.g. 250 mg
    frequency TEXT,                                  -- e.g. BD (Twice daily)
    timing TEXT,                                     -- Pragbhakta (Before food)
    anupana TEXT,                                    -- e.g. Godugdha (Cow milk)
    duration TEXT,                                   -- e.g. 15 Days
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Table 5: PANCHAKARMA_ORDERS (Classical Shodhana Procedures)
-- ------------------------------------------------------------------------------
CREATE TABLE panchakarma_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    encounter_id UUID REFERENCES opd_queue(id) ON DELETE CASCADE,
    procedure_name TEXT NOT NULL,                    -- e.g. Mridu Virechana Karma
    duration_days INTEGER DEFAULT 7,
    purvakarma TEXT,                                 -- Deepana-Pachana with Trikatu & Snehapana
    pradhanakarma TEXT,                              -- Eranda Taila / Trivrit Leha administration
    paschatkarma TEXT,                               -- Samsarjana Krama
    dietary_guidelines TEXT,                         -- Peyadi Krama
    status TEXT DEFAULT 'ORDERED' CHECK (status IN ('ORDERED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Table 6: AUDIT_LOGS (ABDM Cryptographic Integrity Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,                            -- KIOSK_REGISTRATION, DOCTOR_EXAMINATION, PRESCRIPTION_SIGNED
    actor TEXT NOT NULL,                             -- Doctor ID, Kiosk-01, Patient
    entity_type TEXT,                                -- PATIENT, ENCOUNTER, PRESCRIPTION
    entity_id TEXT,
    details JSONB,
    hash TEXT,                                       -- Cryptographic verification seal
    timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Performance Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX idx_opd_queue_status ON opd_queue(status);
CREATE INDEX idx_opd_queue_token ON opd_queue(token);
CREATE INDEX idx_opd_queue_checkin ON opd_queue(checkin_time DESC);
CREATE INDEX idx_patients_uhid ON patients(uhid);
CREATE INDEX idx_patients_abha ON patients(abha_id);
CREATE INDEX idx_consultations_encounter ON consultations(encounter_id);
CREATE INDEX idx_prescriptions_consultation ON prescriptions(consultation_id);
CREATE INDEX idx_panchakarma_consultation ON panchakarma_orders(consultation_id);

-- ------------------------------------------------------------------------------
-- Supabase Realtime Replication Setup
-- ------------------------------------------------------------------------------
-- Enables realtime broadcast to Doctor Workstation and TV Waiting Display
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'opd_queue'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE opd_queue;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'consultations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE consultations;
  END IF;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- ------------------------------------------------------------------------------
-- Row Level Security (RLS) Configuration
-- (Permissive for local clinical intranet / hospital LAN usage)
-- ------------------------------------------------------------------------------
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE opd_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE panchakarma_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Allow public insert for patients" ON patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for patients" ON patients FOR UPDATE USING (true);

CREATE POLICY "Allow public read for opd_queue" ON opd_queue FOR SELECT USING (true);
CREATE POLICY "Allow public insert for opd_queue" ON opd_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for opd_queue" ON opd_queue FOR UPDATE USING (true);

CREATE POLICY "Allow public read for consultations" ON consultations FOR SELECT USING (true);
CREATE POLICY "Allow public insert for consultations" ON consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for consultations" ON consultations FOR UPDATE USING (true);

CREATE POLICY "Allow public read for prescriptions" ON prescriptions FOR SELECT USING (true);
CREATE POLICY "Allow public insert for prescriptions" ON prescriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for prescriptions" ON prescriptions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for prescriptions" ON prescriptions FOR DELETE USING (true);

CREATE POLICY "Allow public read for panchakarma_orders" ON panchakarma_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert for panchakarma_orders" ON panchakarma_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for panchakarma_orders" ON panchakarma_orders FOR UPDATE USING (true);

CREATE POLICY "Allow public read for audit_logs" ON audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert for audit_logs" ON audit_logs FOR INSERT WITH CHECK (true);
