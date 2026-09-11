-- ==============================================================================
-- OMNIGATE AYUSH HOSPITAL - OPTIONAL SAMPLE SEED SCRIPT
-- Run this in your Supabase SQL Editor ONLY if you want to populate 5 authentic demo cases.
-- ==============================================================================

-- 1. Insert Sample Patient 1 (Sunita Sharma - Urdhwaga Amlapitta)
WITH p1 AS (
    INSERT INTO patients (uhid, abha_id, name, age, gender, phone, category, pmjay_status, prakriti_dominant)
    VALUES ('AIIA-2026-98412', '91-8472-1092-4820', 'Sunita Sharma', 52, 'Female', '+91 98765 43210', 'Priority (Severe Pitta Vidaha)', 'AB-PMJAY Golden Card Verified', 'Pitta-Vata')
    RETURNING id, uhid, name
)
INSERT INTO opd_queue (
    token, patient_id, patient_uhid, patient_name, cr_no, department, room_no, status, red_flag,
    vitals, chief_complaint, duration, site, onset, severity_vas, associated_symptoms,
    triggers_ahara, triggers_vihara, triggers_manasika, kiosk_inquiries
)
SELECT 
    'AYU-101', p1.id, p1.uhid, p1.name, '2026/AIIA/10482', 'Kaumarbhritya / Kayachikitsa', '12', 'WAITING', false,
    '{"bp": "124/82", "pulse": 76, "spo2": 98, "temperature": 98.4, "bmi": 23.4, "weight": 62, "height": 163}'::jsonb,
    'Urdhwaga Amlapitta (छाती व पेट में तीव्र जलन, खट्टी डकारें)', '6 Months', 'Epigastrium & Retrosternal', 'Gradual', 7,
    '["Hrit-Kantha Daha (Heartburn)", "Tikta-Amlodgara (Sour Eructation)", "Utklesha (Nausea)", "Aruchi (Anorexia)"]'::jsonb,
    '["अत्यधिक मिर्च-मसालेदार व तला हुआ भोजन", "खट्टा व फर्मेंटेड खाद्य", "चाय व कॉफ़ी का अत्यधिक सेवन"]'::jsonb,
    '["देर रात तक जागना (रात्रि-जागरण)", "भोजन के तुरंत बाद शयन (दिवास्वप्न)", "अनियमित भोजन समय"]'::jsonb,
    '["मानसिक तनाव व चिंता (Chinta)", "क्रोध (Krodha)"]'::jsonb,
    '[
        {
            "questionHi": "क्या आपकी समस्या का संबंध विशेष प्रकार के आहार, जैसे अत्यधिक तीखा, खट्टा, तला हुआ भोजन या चाय/कॉफ़ी के सेवन से है?",
            "questionEn": "Is your condition aggravated by specific dietary items such as excessively spicy, sour, fried foods, or tea/coffee?",
            "patientAnswer": "हाँ, बहुत अधिक — विशेष रूप से मिर्च-मसालेदार व खट्टा भोजन खाने पर जलन बहुत बढ़ जाती है।",
            "clinicalReason": "To identify Pitta-prakopaka Ahara which directly vitiates Agni and leads to Vidaha in Amlapitta."
        },
        {
            "questionHi": "क्या आपको भोजन के पचने या अपच (अजीर्ण) का अहसास होता है, और क्या यह समस्या मानसिक तनाव या चिंता के समय बढ़ जाती है?",
            "questionEn": "Do you experience a sense of indigestion (Ajeerna), and does this condition worsen during periods of mental stress or anxiety?",
            "patientAnswer": "हाँ, मानसिक तनाव व चिंता में अपच और सीने में जलन और बढ़ जाती है।",
            "clinicalReason": "To evaluate the involvement of Manasika hetus (Krodha, Chinta) and assess Mandagni vs Tikshnagni fluctuations."
        },
        {
            "questionHi": "क्या आपको रात में जागने की आदत है या आपका भोजन करने का समय अनियमित रहता है?",
            "questionEn": "Do you have a habit of staying awake late at night (Ratri-jagarana) or do you have irregular meal timings?",
            "patientAnswer": "हाँ, अक्सर देर रात तक जागती हूँ और भोजन का समय अनियमित रहता है।",
            "clinicalReason": "Pinpoints primary Viharaja Hetu (Ratri Jagarana & Vishamashana) inducing Pitta surge."
        }
    ]'::jsonb
FROM p1;

-- 2. Insert Sample Patient 2 (Ramchandra Verma - Sandhigata Vata)
WITH p2 AS (
    INSERT INTO patients (uhid, abha_id, name, age, gender, phone, category, pmjay_status, prakriti_dominant)
    VALUES ('AIIA-2026-98413', '91-3829-5729-1829', 'Ramchandra Verma', 64, 'Male', '+91 94123 45678', 'Routine (Vata Shoola)', 'Senior Citizen (BPL)', 'Vata-Kapha')
    RETURNING id, uhid, name
)
INSERT INTO opd_queue (
    token, patient_id, patient_uhid, patient_name, cr_no, department, room_no, status, red_flag,
    vitals, chief_complaint, duration, site, onset, severity_vas, associated_symptoms,
    triggers_ahara, triggers_vihara, triggers_manasika, kiosk_inquiries
)
SELECT 
    'AYU-102', p2.id, p2.uhid, p2.name, '2026/AIIA/10483', 'Shalya / Shalakya / Kayachikitsa', '12', 'WAITING', false,
    '{"bp": "138/88", "pulse": 72, "spo2": 97, "temperature": 98.2, "bmi": 26.1, "weight": 74, "height": 168}'::jsonb,
    'Janu Sandhigata Vata (दोनों घुटनों में तीव्र दर्द व जकड़न, चलने में कठिनाई)', '2 Years', 'Bilateral Knee Joints', 'Insidious', 8,
    '["Sandhishoola (Joint Pain)", "Sandhishotha (Mild Swelling)", "Stambha (Morning Stiffness)", "Sandhisphutana (Crepitus)"]'::jsonb,
    '["रूखा व सूखा भोजन (Rooksha Ahara)", "चने व बेसन की वस्तुओं का अत्यधिक सेवन", "ठंडा व बासी भोजन"]'::jsonb,
    '["अत्यधिक पैदल चलना व सीढ़ियाँ चढ़ना", "शीत ऋतु व ठंडी हवा का प्रत्यक्ष संपर्क", "व्यायाम का अभाव"]'::jsonb,
    '["वार्धक्य जन्य चिंता ও अनिद्रा"]'::jsonb,
    '[
        {
            "questionHi": "क्या सुबह सोकर उठने पर या ठंड के मौसम में घुटनों की जकड़न और दर्द अधिक तीव्र हो जाता है?",
            "questionEn": "Is knee stiffness and pain more severe upon waking up in the morning or during cold weather?",
            "patientAnswer": "हाँ, सुबह उठने पर और ठंड के मौसम में घुटनों की जकड़न और दर्द बहुत ज्यादा बढ़ जाता है।",
            "clinicalReason": "Confirms Sheetaguna-induced Vata aggravation and Shleshaka Kapha depletion in joints."
        },
        {
            "questionHi": "क्या घुटने मोड़ते या चलते समय जोड़ों से कट-कट की आवाज (Crepitus) सुनाई देती है?",
            "questionEn": "Do you notice a clicking or cracking sound (Crepitus) in your joints while walking or flexing knees?",
            "patientAnswer": "हाँ, सीढ़ियाँ चढ़ते व घुटने मोड़ते समय स्पष्ट कट-कट की आवाज आती है।",
            "clinicalReason": "Indicates Asthidhatu Kshaya and loss of Shleshaka Kapha lubrication."
        },
        {
            "questionHi": "क्या आपको कब्ज (विबन्ध) या पेट में भारीपन व गैस की समस्या रहती है?",
            "questionEn": "Do you frequently experience constipation or abdominal bloating and flatulence?",
            "patientAnswer": "हाँ, अक्सर पेट साफ नहीं होता और गैस बनती है।",
            "clinicalReason": "Identifies Apana Vata Dushti which is intimately linked with systemic Vataja disorders."
        }
    ]'::jsonb
FROM p2;
