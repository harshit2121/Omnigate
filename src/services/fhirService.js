/**
 * ABDM & FHIR Interoperability Service
 * Generates FHIR R4 Standard Clinical Intake Bundles compliant with Ayushman Bharat Digital Mission (ABDM)
 */

export function generateFhirCaseBundle({ patient, intakeData, parikshaData, ocrDocuments }) {
  const timestamp = new Date().toISOString();
  const bundleId = `urn:uuid:bundle-${Date.now()}`;
  const patientRef = `urn:uuid:patient-${patient.hhid || 'guest'}`;

  // 1. Patient Resource
  const patientResource = {
    fullUrl: patientRef,
    resource: {
      resourceType: 'Patient',
      id: patient.hhid || 'patient-temp',
      identifier: [
        {
          system: 'https://healthid.ndhm.gov.in',
          type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MR', display: 'ABHA ID' }] },
          value: patient.abhaId || patient.hhid || '91-9876-5432-1098'
        }
      ],
      name: [{ text: patient.name, family: patient.name?.split(' ').slice(1).join(' ') || '', given: [patient.name?.split(' ')[0] || ''] }],
      gender: (patient.gender || 'unknown').toLowerCase(),
      birthDate: patient.age ? `${new Date().getFullYear() - patient.age}-01-01` : undefined,
      telecom: [{ system: 'phone', value: patient.phone || '9876543210' }]
    }
  };

  // 2. Clinical Composition Resource
  const compositionResource = {
    fullUrl: `urn:uuid:comp-${Date.now()}`,
    resource: {
      resourceType: 'Composition',
      status: 'final',
      type: {
        coding: [{ system: 'http://snomed.info/sct', code: '371531000', display: 'Clinical report / Ayurvedic OPD Intake' }],
        text: 'MediKiosk Clinical History & Ayurvedic Case-Taking Summary'
      },
      subject: { reference: patientRef, display: patient.name },
      date: timestamp,
      title: 'Multimodal Digital Clinical History & Pariksha Summary',
      section: [
        {
          title: 'Chief Complaint & History of Present Illness (SOCRATES)',
          text: {
            status: 'generated',
            div: `<div><p><b>Complaint:</b> ${intakeData.complaintLabel || 'Not specified'}</p><p><b>Details:</b> ${JSON.stringify(intakeData.answers || {})}</p></div>`
          }
        },
        {
          title: 'Ayurvedic Pariksha & Constitutional Assessment (Dashavidha / Ashtavidha)',
          text: {
            status: 'generated',
            div: `<div><p><b>Prakriti:</b> ${parikshaData?.prakritiResult?.dominant || 'N/A'}</p><p><b>Agni:</b> ${parikshaData?.agni || 'N/A'}</p><p><b>Koshtha:</b> ${parikshaData?.koshtha || 'N/A'}</p></div>`
          }
        },
        {
          title: 'Digitized Documents & Past Medical History',
          text: {
            status: 'generated',
            div: `<div><p>Digitized Documents: ${(ocrDocuments || []).length} attached.</p></div>`
          }
        }
      ]
    }
  };

  // 3. DPDP Act Consent Resource
  const consentResource = {
    fullUrl: `urn:uuid:consent-${Date.now()}`,
    resource: {
      resourceType: 'Consent',
      status: 'active',
      scope: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/consentscope', code: 'patient-privacy' }] },
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'INFA' }] }],
      patient: { reference: patientRef },
      dateTime: timestamp,
      policyRule: { text: 'Digital Personal Data Protection (DPDP) Act 2023 & ABDM Health Data Consent Framework' }
    }
  };

  return {
    resourceType: 'Bundle',
    id: bundleId,
    type: 'document',
    timestamp,
    entry: [
      patientResource,
      compositionResource,
      consentResource
    ]
  };
}
