/**
 * Prakriti Diet Plan & Clinical Summary Printable Document Generator
 * 100% Ink-Friendly Monochrome (Black & White) Hospital Layout
 * Standard format for All India Institute of Ayurveda (AIIA) / Ministry of Ayush
 */

export function printPrakritiDietPlan({
  patientName = 'Patient',
  tokenNumber = 'T-104',
  abhaId = '91-8765-4321-0987',
  prakritiResult,
  currentLang = 'hi'
}) {
  const isHi = currentLang === 'hi';
  const k = prakritiResult?.knowledge || {};

  const printWindow = window.open('', '_blank', 'width=850,height=1100');
  if (!printWindow) {
    alert(isHi ? 'कृपया पॉप-अप विंडो की अनुमति दें।' : 'Please allow popups to print the Diet Plan.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const html = `
    <!DOCTYPE html>
    <html lang="${currentLang}">
    <head>
      <meta charset="utf-8">
      <title>AIIA Ayush OPD Token & Prakriti Diet Plan - ${tokenNumber}</title>
      <style>
        @page { 
          size: A4 portrait; 
          margin: 12mm 15mm; 
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #000000;
          background: #ffffff;
          line-height: 1.4;
          margin: 0;
          padding: 10px;
          font-size: 11pt;
        }
        
        /* Monochromatic Ink-Friendly Header */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #000000;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        .emblem-wrap {
          width: 65px;
          text-align: left;
        }
        .emblem { 
          height: 58px; 
          filter: grayscale(100%) contrast(150%);
        }
        .title-group { 
          text-align: center; 
          flex: 1; 
          padding: 0 10px;
        }
        .title-group h1 { 
          margin: 0; 
          font-size: 15pt; 
          font-weight: 900; 
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .title-group h2 { 
          margin: 2px 0; 
          font-size: 11.5pt; 
          font-weight: 700; 
        }
        .title-group p { 
          margin: 0; 
          font-size: 9pt; 
          font-weight: 500; 
        }
        
        .token-header-box {
          border: 1.5px solid #000000;
          padding: 6px 10px;
          text-align: center;
          min-width: 100px;
        }
        .token-header-box .label {
          font-size: 8pt;
          font-weight: 700;
          text-transform: uppercase;
        }
        .token-header-box .val {
          font-size: 14pt;
          font-weight: 900;
          font-family: "Courier New", Courier, monospace;
        }

        /* Patient Demographics Table */
        .meta-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 14px;
          border: 1px solid #000000;
        }
        .meta-table td {
          padding: 5px 8px;
          font-size: 9.5pt;
          border: 1px solid #000000;
          vertical-align: middle;
        }
        .meta-table td.label {
          font-weight: 700;
          width: 18%;
          background: #fafafa;
        }

        /* Prakriti Constitutional Assessment Section */
        .prakriti-box {
          border: 1.5px solid #000000;
          padding: 10px 14px;
          margin-bottom: 14px;
        }
        .prakriti-title-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          border-bottom: 1px solid #000000;
          padding-bottom: 6px;
          margin-bottom: 8px;
        }
        .prakriti-main-title {
          font-size: 13pt;
          font-weight: 900;
          text-transform: uppercase;
        }
        .dosha-scores {
          display: flex;
          gap: 10px;
          font-size: 9.5pt;
          font-weight: 700;
        }
        .dosha-tag {
          border: 1px solid #000000;
          padding: 2px 8px;
          font-family: monospace;
        }
        .prakriti-qualities {
          font-size: 9.5pt;
          line-height: 1.4;
        }

        /* Section Headings */
        .section-heading {
          font-size: 11pt;
          font-weight: 900;
          text-transform: uppercase;
          border-bottom: 1.5px solid #000000;
          padding-bottom: 3px;
          margin-top: 14px;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        /* 2-Column Diet Grid */
        .diet-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 14px;
          border: 1.5px solid #000000;
        }
        .diet-table th {
          border: 1px solid #000000;
          padding: 6px 10px;
          font-size: 10pt;
          font-weight: 900;
          text-align: left;
          background: #f5f5f5;
          text-transform: uppercase;
        }
        .diet-table td {
          border: 1px solid #000000;
          padding: 8px 10px;
          font-size: 9.5pt;
          vertical-align: top;
          width: 50%;
          line-height: 1.45;
        }

        /* Lifestyle & Herbs Boxes */
        .content-box {
          border: 1px solid #000000;
          padding: 8px 12px;
          font-size: 9.5pt;
          line-height: 1.45;
          margin-bottom: 12px;
        }

        .herbs-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }
        .herb-item {
          border: 1px solid #000000;
          padding: 2px 8px;
          font-size: 9pt;
          font-weight: 700;
        }

        /* Signature and Footer */
        .footer-signatures {
          margin-top: 26px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 8px;
        }
        .sig-block {
          text-align: center;
          width: 220px;
        }
        .sig-line {
          border-top: 1px solid #000000;
          margin-top: 40px;
          padding-top: 4px;
          font-size: 9pt;
          font-weight: 700;
        }

        .doc-footer {
          margin-top: 18px;
          border-top: 1px dashed #000000;
          padding-top: 6px;
          display: flex;
          justify-content: space-between;
          font-size: 8pt;
          color: #222222;
        }

        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
        <div class="emblem-wrap">
          <img src="/Emblem_of_India.svg" class="emblem" alt="Emblem of India" />
        </div>
        <div class="title-group">
          <h1>अखिल भारतीय आयुर्वेद संस्थान</h1>
          <h2>ALL INDIA INSTITUTE OF AYURVEDA (AIIA)</h2>
          <p>Ministry of Ayush, Government of India • New Delhi - 110076</p>
          <p style="font-weight: bold; margin-top: 2px; text-decoration: underline;">
            ${isHi ? 'आयुर्वेदिक प्रकृति परीक्षण एवं व्यक्तिगत आहार-विहार तालिका' : 'CLINICAL PRAKRITI ASSESSMENT & INDIVIDUALIZED DIET CHART'}
          </p>
        </div>
        <div class="token-header-box">
          <div class="label">${isHi ? 'टोकन संख्या' : 'TOKEN NO.'}</div>
          <div class="val">${tokenNumber}</div>
        </div>
      </div>

      <!-- Patient Demographics -->
      <table class="meta-table">
        <tr>
          <td class="label">${isHi ? 'मरीज का नाम:' : 'Patient Name:'}</td>
          <td><b>${patientName}</b></td>
          <td class="label">${isHi ? 'आभा संख्या:' : 'ABHA ID:'}</td>
          <td><span style="font-family: monospace; font-weight: bold;">${abhaId}</span></td>
        </tr>
        <tr>
          <td class="label">${isHi ? 'परामर्श कक्ष:' : 'OPD Room:'}</td>
          <td><b>Room 12 (Kayachikitsa)</b></td>
          <td class="label">${isHi ? 'दिनांक व समय:' : 'Date & Time:'}</td>
          <td>${currentDate}, ${currentTime}</td>
        </tr>
      </table>

      <!-- Prakriti Constitutional Summary -->
      <div class="prakriti-box">
        <div class="prakriti-title-row">
          <div class="prakriti-main-title">
            ${isHi ? 'आयुर्वेदिक प्रकृति (Constitutional Type):' : 'Ayurvedic Prakriti:'}
            <u>${isHi ? (k.nameHi || prakritiResult?.dominantHi || 'पित्त-वात') : (k.nameEn || prakritiResult?.dominant || 'Pitta-Vata')}</u>
          </div>
          <div class="dosha-scores">
            <span class="dosha-tag">V: ${prakritiResult?.vataPct || 0}%</span>
            <span class="dosha-tag">P: ${prakritiResult?.pittaPct || 0}%</span>
            <span class="dosha-tag">K: ${prakritiResult?.kaphaPct || 0}%</span>
          </div>
        </div>
        <div class="prakriti-qualities">
          <b>${isHi ? 'प्रमुख महाभूत व गुण:' : 'Elemental Dominance & Qualities:'}</b> 
          ${isHi ? k.elementHi : k.elementEn} • ${isHi ? k.primaryQualityHi : k.primaryQualityEn}
        </div>
      </div>

      <!-- Diet Guidance -->
      <div class="section-heading">
        1. ${isHi ? 'व्यक्तिगत आहार मार्गदर्शन (Personalized Ahara / Diet Guidance)' : 'Personalized Ayurvedic Diet Guidance (Pathya-Apathya)'}
      </div>

      <table class="diet-table">
        <thead>
          <tr>
            <th>[✓] ${isHi ? 'पथ्य आहार (सेवन योग्य / Recommended)' : 'Wholesome Foods (Pathya to Consume)'}</th>
            <th>[✕] ${isHi ? 'अपथ्य आहार (परहेज योग्य / Restricted)' : 'Incompatible Foods (Apathya to Avoid)'}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${isHi ? k.toConsumeHi : k.toConsumeEn}</td>
            <td>${isHi ? k.toAvoidHi : k.toAvoidEn}</td>
          </tr>
        </tbody>
      </table>

      <!-- Lifestyle & Daily Routine -->
      <div class="section-heading">
        2. ${isHi ? 'दिनचर्या एवं जीवनशैली (Vihara / Daily Lifestyle Routine)' : 'Lifestyle Routine & Daily Regimen (Vihara)'}
      </div>
      <div class="content-box">
        ${isHi ? k.lifestyleHi : k.lifestyleEn}
      </div>

      <!-- Herbs (if present) -->
      ${k.herbs && k.herbs.length > 0 ? `
        <div class="section-heading">
          3. ${isHi ? 'अनुकूल आयुर्वेदिक औषधियां एवं जड़ी-बूटियां' : 'Beneficial Ayurvedic Herbs & Rasayanas'}
        </div>
        <div class="content-box">
          <div class="herbs-wrap">
            ${k.herbs.map(h => `<span class="herb-item">${h}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Clinical Signatures -->
      <div class="footer-signatures">
        <div class="sig-block">
          <div class="sig-line">
            ${isHi ? 'मरीज / अभिभावक के हस्ताक्षर' : "Patient / Guardian's Signature"}
          </div>
        </div>
        <div class="sig-block">
          <div class="sig-line">
            ${isHi ? 'परामर्शदाता वैद्य / चिकित्सा अधिकारी' : 'Consulting Vaidya / Medical Officer'}<br>
            <span style="font-size: 8pt; font-weight: normal;">Kayachikitsa OPD Room 12, AIIA</span>
          </div>
        </div>
      </div>

      <!-- Document Footer -->
      <div class="doc-footer">
        <div>OmniGate MediKiosk • AIIA Terminal #04 • ABDM M3 Compliant</div>
        <div>Monochrome Ink-Friendly Clinical Record • Generated on ${currentDate} ${currentTime}</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Hospital-Grade Professional E-Prescription Document Generator
 * AIIA / Ministry of Ayush & ABDM M3 Compliant
 */
export function printDoctorPrescription({
  patient = {},
  doctor = {
    name: 'Dr. Rajesh Sharma, MD (Ayu), PhD',
    regNo: 'DBCP/AYU/2018/8842',
    designation: 'Senior Consultant Physician & Head of Kayachikitsa',
    hospital: 'All India Institute of Ayurveda (AIIA), New Delhi'
  },
  diagnosis = '',
  icdCode = 'NAMASTE-AYU-842',
  prakriti = 'Pitta-Vata (पित्त-वात)',
  vitals = { bp: '124/82 mmHg', pulse: '76 bpm', spo2: '98%' },
  medications = [],
  panchakarmaOrders = [],
  dietRecommendations = '',
  yogaTherapy = '',
  lifestyleAdvice = '',
  followUpDate = 'After 14 Days (14 दिन बाद)',
  currentLang = 'en'
}) {
  const isHi = currentLang === 'hi';
  const printWindow = window.open('', '_blank', 'width=900,height=1150');
  if (!printWindow) {
    alert(isHi ? 'कृपया प्रिंट के लिए पॉप-अप विंडो की अनुमति दें।' : 'Please allow popups to print the E-Prescription.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const rxId = 'RX-AIIA-' + Math.floor(100000 + Math.random() * 900000);

  const ayurMeds = medications.filter(m => m.system !== 'allopathic');
  const alloMeds = medications.filter(m => m.system === 'allopathic');

  let ayurRows = '';
  ayurMeds.forEach((m, i) => {
    ayurRows += `
      <tr>
        <td style="text-align:center;"><b>${i + 1}</b></td>
        <td>
          <b>${m.drugName || m.name}</b>
          ${m.kalpana ? `<span style="font-size: 7.5pt; color: #E2861E; display: block; font-weight: bold;">(${m.kalpana})</span>` : ''}
          ${m.classicalText ? `<span style="font-size: 7pt; color: #64748B; font-style: italic;">Ref: ${m.classicalText}</span>` : ''}
        </td>
        <td>${m.dose || '1 Vati (250mg)'}</td>
        <td>${m.sevanaKala || m.frequency || 'Pragbhakta (Before food)'}</td>
        <td>${m.anupana || 'Lukewarm water'}</td>
        <td>${m.duration || '14 Days'}</td>
      </tr>
    `;
  });

  let alloRows = '';
  alloMeds.forEach((m, i) => {
    alloRows += `
      <tr>
        <td style="text-align:center;"><b>${i + 1}</b></td>
        <td>
          <b>${m.drugName || m.name}</b>
          ${m.brandName ? `<span style="font-size: 7.5pt; color: #1E40AF; display: block; font-weight: bold;">(${m.brandName})</span>` : ''}
          ${m.composition1 ? `<span style="font-size: 7pt; color: #64748B;">${m.composition1}</span>` : ''}
        </td>
        <td>${m.dose || '40mg'}</td>
        <td>${m.frequency || 'OD'}</td>
        <td>${m.instructions || (m.timing ? m.timing.join(', ') : 'After meals')}</td>
        <td>${m.duration || '14 Days'}</td>
      </tr>
    `;
  });

  const html = `
    <!DOCTYPE html>
    <html lang="${currentLang}">
    <head>
      <meta charset="utf-8">
      <title>E-Prescription - ${patient.name || 'Patient'} - ${rxId}</title>
      <style>
        @page { size: A4 portrait; margin: 10mm 12mm; }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          color: #0F172A;
          background: #ffffff;
          line-height: 1.35;
          margin: 0;
          padding: 12px;
          font-size: 9.5pt;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2.5px solid #0B4C8C;
          padding-bottom: 8px;
          margin-bottom: 10px;
        }
        .emblem { height: 55px; }
        .inst-title { text-align: center; flex: 1; padding: 0 10px; }
        .inst-title h1 { margin: 0; font-size: 13pt; font-weight: 900; color: #0B4C8C; letter-spacing: 0.5px; text-transform: uppercase; }
        .inst-title h2 { margin: 2px 0; font-size: 10pt; font-weight: 700; color: #E2861E; }
        .inst-title p { margin: 0; font-size: 8pt; color: #475569; font-weight: 600; }
        .rx-badge {
          border: 2px solid #0B4C8C;
          background: #F8FAFC;
          padding: 6px 10px;
          text-align: center;
          border-radius: 6px;
        }
        .rx-badge .num { font-size: 11pt; font-weight: 900; font-family: monospace; color: #0B4C8C; }
        .rx-badge .sub { font-size: 7.5pt; font-weight: 700; color: #64748B; text-transform: uppercase; }

        .meta-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1fr 1.8fr;
          gap: 6px;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          padding: 8px 10px;
          margin-bottom: 8px;
          background: #F8FAFC;
          font-size: 8.5pt;
        }
        .meta-item b { color: #0F172A; }
        .meta-item span { color: #64748B; }

        .vitals-bar {
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          border-radius: 6px;
          padding: 5px 10px;
          font-size: 8.5pt;
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-weight: 600;
          color: #1E40AF;
        }

        .sec-title {
          font-size: 9.5pt;
          font-weight: 900;
          color: #0B4C8C;
          border-bottom: 1.5px solid #CBD5E1;
          padding-bottom: 3px;
          margin-top: 10px;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        table.rx-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8px;
          font-size: 8.5pt;
        }
        table.rx-table th {
          background: #0B4C8C;
          color: #ffffff;
          font-weight: 700;
          text-align: left;
          padding: 4px 8px;
          font-size: 8pt;
        }
        table.rx-table td {
          border: 1px solid #E2E8F0;
          padding: 4px 8px;
          vertical-align: top;
        }
        table.rx-table tr:nth-child(even) { background: #F8FAFC; }

        .info-box {
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 8.5pt;
          margin-bottom: 6px;
          background: #ffffff;
        }

        .footer-sig {
          margin-top: 15px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1.5px solid #CBD5E1;
          padding-top: 8px;
          font-size: 8pt;
        }
        .qr-placeholder {
          width: 65px;
          height: 65px;
          border: 1px solid #0B4C8C;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 6.5pt;
          text-align: center;
          background: #F0FDF4;
          color: #15803D;
          font-weight: bold;
        }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="/Emblem_of_India.svg" class="emblem" alt="Emblem of India" />
        <div class="inst-title">
          <h1>All India Institute of Ayurveda (AIIA)</h1>
          <h2>अखिल भारतीय आयुर्वेद संस्थान • Ministry of Ayush, Govt. of India</h2>
          <p>National Center of Excellence • ABDM M3 Integrated Hospital Electronic Prescription</p>
        </div>
        <div class="rx-badge">
          <div class="num">${rxId}</div>
          <div class="sub">Date: ${currentDate}</div>
        </div>
      </div>

      <div class="meta-grid">
        <div class="meta-item"><span>Patient Name:</span> <b>${patient.name || 'N/A'}</b></div>
        <div class="meta-item"><span>HHID:</span> <b>${patient.hhid || 'T-102'}</b></div>
        <div class="meta-item"><span>Age / Gender:</span> <b>${patient.age || '42'}Y / ${patient.gender || 'M'}</b></div>
        <div class="meta-item"><span>ABHA ID:</span> <b>${patient.abhaId || '91-8842-1092-4412'}</b></div>
      </div>

      <div class="vitals-bar">
        <span>BP: <b>${vitals.bp || '120/80 mmHg'}</b></span>
        <span>Pulse: <b>${vitals.pulse || '74 bpm'}</b></span>
        <span>SpO2: <b>${vitals.spo2 || '99%'}</b></span>
        <span>Prakriti: <b>${prakriti}</b></span>
        <span>Allergies: <b style="color:#DC2626;">${patient.allergies || 'NKDA (None Known)'}</b></span>
      </div>

      <div class="sec-title">
        <span>PROVISIONAL / CLINICAL DIAGNOSIS (रोग निदान)</span>
        <span style="font-size: 7.5pt; color: #64748B;">ICD-11 / NAMASTE: ${icdCode}</span>
      </div>
      <div class="info-box" style="font-weight: 700; color: #0F172A;">
        ${diagnosis || 'Amlapitta (Hyperacidity / GERD) with Pitta-Vata vitiation'}
      </div>

      ${ayurMeds.length > 0 ? `
        <div class="sec-title">
          <span>🌿 AYURVEDIC FORMULATIONS & CHIKITSA (आयुष योग एवं औषध)</span>
          <span style="font-size: 7.5pt; color: #E2861E;">Classical Samhita Standards</span>
        </div>
        <table class="rx-table">
          <thead>
            <tr>
              <th style="width: 5%; text-align:center;">#</th>
              <th style="width: 32%;">Formulation / Kalpana (औषध नाम)</th>
              <th style="width: 15%;">Dose (मात्रा)</th>
              <th style="width: 20%;">Aushadha Sevana Kala (सेवन काल)</th>
              <th style="width: 18%;">Anupana (अनुपान)</th>
              <th style="width: 10%;">Duration</th>
            </tr>
          </thead>
          <tbody>${ayurRows}</tbody>
        </table>
      ` : ''}

      ${alloMeds.length > 0 ? `
        <div class="sec-title">
          <span>💊 MODERN ALLOPATHIC MEDICATIONS (एलोपैथिक औषध)</span>
          <span style="font-size: 7.5pt; color: #1E40AF;">RxNorm / CDSS Verified</span>
        </div>
        <table class="rx-table">
          <thead>
            <tr>
              <th style="width: 5%; text-align:center;">#</th>
              <th style="width: 35%;">Drug & Brand Name</th>
              <th style="width: 15%;">Strength</th>
              <th style="width: 15%;">Frequency</th>
              <th style="width: 18%;">Timing & Instructions</th>
              <th style="width: 12%;">Duration</th>
            </tr>
          </thead>
          <tbody>${alloRows}</tbody>
        </table>
      ` : ''}

      ${panchakarmaOrders && panchakarmaOrders.length > 0 ? `
        <div class="sec-title"><span>🧘 PANCHAKARMA & PROCEDURAL THERAPY (पंचकर्म निर्देश)</span></div>
        <div class="info-box">
          ${panchakarmaOrders.map(p => `• <b>${p.name || p.procedure}</b>: ${p.duration || '7 sittings'} (Oil: ${p.taila || 'Mahanarayana Taila'})`).join('<br/>')}
        </div>
      ` : ''}

      ${dietRecommendations ? `
        <div class="sec-title"><span>🥗 PATHYA & APATHYA (आहार एवं जीवनशैली निर्देश)</span></div>
        <div class="info-box" style="background:#FFFDF7;">${dietRecommendations}</div>
      ` : ''}

      ${yogaTherapy ? `
        <div class="sec-title"><span>🧘 YOGA & PHYSICAL THERAPY (योग एवं प्राणायाम)</span></div>
        <div class="info-box" style="background:#F0FDF4;">${yogaTherapy}</div>
      ` : ''}

      <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:8pt; background:#F8FAFC; border:1px dashed #CBD5E1; padding:5px 8px; border-radius:6px;">
        <span>Follow-up Review: <b>${followUpDate}</b></span>
        <span>Emergency / SOS: <b>Visit 24x7 Casualty or call 14477</b></span>
      </div>

      <div class="footer-sig">
        <div style="display: flex; gap: 8px; align-items: center;">
          <div class="qr-placeholder">ABDM<br/>VERIFIED<br/>QR CODE</div>
          <div style="font-size: 7pt; color: #64748B;">
            Electronically generated & signed via Ayush Hospital HIS Workstation.<br/>
            Digitally certified under IT Act 2000 & ABDM Interoperability Standards.
          </div>
        </div>

        <div style="text-align: right;">
          <div style="font-family: monospace; font-size: 10pt; color: #0B4C8C; font-weight: bold; margin-bottom: 2px;">
            Dr. Rajesh Sharma
          </div>
          <b>${doctor.name}</b><br/>
          <span style="color: #475569;">Reg No: ${doctor.regNo}</span><br/>
          <span style="font-size: 7pt; color: #64748B;">${doctor.designation}</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 12px;" class="no-print">
        <button onclick="window.print()" style="background: #0B4C8C; color: white; border: none; padding: 7px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
          🖨️ Print Prescription
        </button>
      </div>

      <script>
        window.onload = function() { setTimeout(function() { window.print(); }, 400); };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

export default {
  printPrakritiDietPlan,
  printDoctorPrescription
};

