// Authentic AYUSH OPD Patient Intake Datasets
// Patient Data: Populated from Registration, MediKiosk Self-Intake & ABHA.
// Doctor's Clinical Entries (Ashtavidha Pariksha, Confirmed Diagnosis, Prescriptions, Panchakarma)
// start UNRECORDED / EMPTY, allowing the physician to actively examine, diagnose, and prescribe with Nidan AI assistance.

export const OPD_DEMO_CASES = [
  // ─── CASE 1: SUNITA SHARMA (AYU-101) ───
  {
    id: 'case-ayu-101',
    token: 'AYU-101',
    crNo: '2026/AIIA/10482',
    uhid: 'UHID-2026-90412',
    timestamp: new Date().toISOString(),
    waitTime: '12m ago',
    triageLevel: 'Priority (Severe Pitta Vidaha)',
    status: 'WAITING_OPD',
    patient: {
      name: 'Sunita Sharma',
      age: 52,
      gender: 'Female',
      hhid: 'HH-2026-912',
      abhaId: '91-8472-1092-4820',
      phone: '9811223344',
      bloodGroup: 'B +ve',
      category: 'Ayushman Bharat (PM-JAY)',
      occupation: 'School Teacher (Sedentary / High Stress)'
    },
    // Patient Self-Reported Intake
    intake: {
      complaintId: 'digestive_issues',
      complaintLabel: 'Urdhwaga Amlapitta (छाती व पेट में तीव्र जलन, खट्टी डकारें)',
      duration: '6 Months (Chronic with acute flare-ups)',
      site: 'Epigastrium & Retrosternal (आमाशय व हृद्-कण्ठ)',
      severityVas: '7 / 10',
      onset: 'Gradual onset after irregular meal timings and spicy fried diet',
      associatedSymptoms: ['Sour Belching (खट्टी डकारें)', 'Heartburn (सीने में जलन)', 'Nausea (जी मिचलाना)', 'Headache (सिरदर्द)'],
      reportedTriggers: {
        aharaja: ['Ati Katu-Amla-Lavana (मिर्च-मसालेदार, खट्टा भोजन)', 'Adhyashana (बिना पचे दोबारा भोजन करना)', 'Tea/Coffee on empty stomach'],
        viharaja: ['Ratri Jagarana (देर रात 1 बजे तक जागना)', 'Divaswapna (दोपहर में भोजनोपरांत सोना)'],
        manasika: ['Krodha & Chinta (क्रोध व कार्य का मानसिक तनाव)']
      },
      // Nidan AI MediKiosk Targeted Inquiries & Patient Recorded Responses
      kioskInquiries: [
        {
          id: 'inq_1',
          questionHi: 'क्या आपकी समस्या का संबंध विशेष प्रकार के आहार, जैसे अत्यधिक तीखा, खट्टा, तला हुआ भोजन या चाय/कॉफ़ी के सेवन से है?',
          questionEn: 'Is your condition aggravated by specific dietary items such as excessively spicy, sour, fried foods, or tea/coffee?',
          patientAnswer: 'हाँ, बहुत अधिक — विशेषकर मिर्च-मसालेदार, खट्टा भोजन या खाली पेट चाय पीने पर छाती व गले में तीव्र जलन होने लगती है।',
          clinicalReason: 'To identify Pitta-prakopaka Ahara which directly vitiates Agni and leads to Vidaha in Amlapitta.',
          answeredAtKiosk: true
        },
        {
          id: 'inq_2',
          questionHi: 'क्या आपको भोजन के पचने या अपच (अजीर्ण) का अहसास होता है, और क्या यह समस्या मानसिक तनाव या चिंता के समय बढ़ जाती है?',
          questionEn: 'Do you experience a sense of indigestion (Ajeerna), and does this condition worsen during periods of mental stress or anxiety?',
          patientAnswer: 'हाँ, स्कूल के काम के तनाव व चिंता में खट्टी डकारें, अपच और सीने में जलन बहुत अधिक बढ़ जाती है।',
          clinicalReason: 'To evaluate the involvement of Manasika hetus (Krodha, Chinta, Bhaya) and assess Mandagni vs Tikshnagni fluctuations in Pitta-Vata prakriti.',
          answeredAtKiosk: true
        },
        {
          id: 'inq_3',
          questionHi: 'क्या आपको रात में जागने की आदत है या आपका भोजन करने का समय अनियमित रहता है?',
          questionEn: 'Do you have a habit of staying awake late at night (Ratri-jagarana) or do you have irregular meal timings?',
          patientAnswer: 'हाँ, अक्सर रात 1-2 बजे तक जागती हूँ और दोपहर के भोजन का समय भी निश्चित नहीं रहता।',
          clinicalReason: 'Pinpoints primary Viharaja Hetu (Ratri Jagarana & Vishamashana) inducing Pitta surge.',
          answeredAtKiosk: true
        }
      ],
      currentMedications: ['Pantoprazole 40mg (OD)', 'Telmisartan 40mg (OD)'],
      knownAllergies: ['None Known (NKDA)'],
      kioskPrakritiResult: {
        dominant: 'Pitta-Vata (पित्त-वातज)',
        scores: { vata: 35, pitta: 55, kapha: 10 }
      }
    },
    // Doctor's Rogi Pariksha starts UNRECORDED — Doctor examines the patient
    rogiPariksha: {
      lakshana: {
        chiefComplaint: 'Urdhwaga Amlapitta (छाती व पेट में तीव्र जलन, खट्टी डकारें)',
        duration: '6 Months',
        onset: 'Gradual onset with dietary irregularities',
        site: 'Amashaya & Hrid-Kantha (Epigastrium radiating retrosternally)',
        severityVas: '7 / 10',
        associated: ['Sour Belching', 'Heartburn', 'Nausea', 'Pitta Headache']
      },
      ashtavidha: {
        nadi: '', // Doctor records with Nadi pariksha
        jihva: '', // Doctor examines tongue
        mala: '',
        mutra: '',
        shabda: '',
        sparsha: '',
        druk: '',
        akriti: ''
      },
      dashavidha: {
        prakriti: { dominant: 'Pitta-Vata (पित्त-वातज)', scores: { vata: 35, pitta: 55, kapha: 10 } },
        vikriti: { dominant: 'Pitta Vriddhi (पित्त प्रकोप)', delta: '+10% Pitta surge' },
        sara: { overall: 'Madhyama Sara', weakDhatus: ['Rakta', 'Rasa'] },
        samhanana: 'Madhyama',
        pramana: 'Sama Pramana (BMI 24.4)',
        satmya: 'Madhyama',
        satva: 'Madhyama',
        aharaShakti: { agni: 'Tikshnagni (तीक्ष्णाग्नि)', abhyavaharana: 'Madhyama', jarana: 'Tivra' },
        vyayamaShakti: { grade: 'Madhyama', shodhanaEligible: true, rationale: 'Adequate Bala for Mridu Shodhana (Virechana)' },
        vaya: 'Madhyama (52 Years)'
      }
    },
    rogaPariksha: {
      diagnosticCodes: {
        namasteCode: 'AYU-AML-01',
        namasteTerm: 'Urdhwaga Amlapitta (अम्लपित्त)',
        icd11Code: 'MD12.0',
        icd11Term: 'Hyperchlorhydria / Gastroesophageal Reflux'
      },
      samprapti: {
        dosha: 'Pachaka Pitta, Samana & Apana Vata',
        dushya: 'Rasa, Rakta, Amashaya Majja',
        srotas: 'Annavaha, Purishavaha',
        srotodushtiPrakara: 'Atipravritti & Sanga',
        udbhavasthana: 'Amashaya (Stomach)',
        vyakthasthana: 'Hrid-Kantha, Kostha',
        rogamarga: 'Abhyantara Rogamarga',
        sadhyaAsadhyata: 'Sukhasadhya (Easily Curable)'
      }
    },
    // Doctor's Treatment Plan: Prescriptions start EMPTY, with AI suggested protocol ready
    chikitsaPlan: {
      sutra: 'अम्लपित्ते तु वमनं विरेको वा प्रयोजयेत्। शमनं दीपनं चैव तिक्त-मधुर-भेषजैः॥',
      nidanaParivarjana: [
        'Strictly stop all deep-fried snacks, pickles, red chilli, and sour curds.',
        'Eliminate tea or coffee on an empty stomach; stop late-night snacking.',
        'Avoid sleeping immediately after daytime meals.'
      ],
      ahara: {
        favorableRasa: ['Tikta (तिक्त)', 'Madhura (मधुर)', 'Kashaya (कषाय)'],
        unfavorableRasa: ['Katu (कटु)', 'Amla (अम्ल)', 'Lavana (लवण)'],
        prescribedDiet: 'Mudga Yusha (Green moong soup), Dadima (Pomegranate), Godugdha (Boiled cow milk with cardamom), Purana Shali (Aged rice), Patola, Draksha.',
        restrictedDiet: 'Fermented batter, tomato, tamarind, vinegar, garlic, mustard, raw onion, carbonated beverages.'
      },
      vihara: {
        dinacharya: 'Wake up before sunrise, self-massage head with Chandanadi Taila, sip lukewarm water.',
        ritucharya: 'Avoid direct noon sun exposure, take lukewarm baths.',
        yogaPranayama: 'Shitali Pranayama (10 min), Sitkari Pranayama, Vajrasana for 15 min post-meal, Shashankasana.'
      },
      // Nidan AI Suggested Regimen (Ready to be applied by Doctor in 1 click)
      suggestedProtocol: {
        protocolTitle: 'Amlapitta Shamak Standard AIIA Regimen',
        medications: [
          { id: 1, name: 'Sutshekhar Ras (Gold / Plain)', kalpana: 'Vati', dose: '250 mg', frequency: 'BD (Twice Daily)', kaala: 'Pragbhakta (Before Meals)', anupana: 'Godugdha or Amalaki Swarasa', duration: '21 Days', purpose: 'Deepana-Pachana & Pitta Shamak' },
          { id: 2, name: 'Avipattikar Churna', kalpana: 'Churna', dose: '5 grams', frequency: 'HS (Bedtime)', kaala: 'Nishikala (Night)', anupana: 'Ushnodaka (Lukewarm Water)', duration: '21 Days', purpose: 'Pitta Anulomana & mild laxative' },
          { id: 3, name: 'Kamadudha Rasa (Moti Yukta)', kalpana: 'Pishti', dose: '250 mg', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Pure Cow Ghee or Water', duration: '21 Days', purpose: 'Heals gastric mucosal lining' }
        ],
        panchakarma: {
          protocolName: 'Mridu Virechana Karma (पित्त विरेचन)',
          purvakarma: 'Deepana-Pachana with Trikatu Churna + graduated Snehana with Tikta Ghrita.',
          pradhanakarma: 'Virechana with Eranda Taila (30ml) + Triphala Kwatha (100ml) on Day 7.',
          paschatkarma: 'Samsarjana Krama for 3 days (Peya -> Vilepi -> Yusha).'
        }
      }
    },
    // Prescriptions start EMPTY — Doctor prescribes during consultation
    prescriptions: [],
    panchakarmaOrders: [],
    assessment: { confirmedDiagnosis: null }
  },

  // ─── CASE 2: RAMCHANDRA VERMA (AYU-102) ───
  {
    id: 'case-ayu-102',
    token: 'AYU-102',
    crNo: '2026/AIIA/10483',
    uhid: 'UHID-2026-90413',
    timestamp: new Date().toISOString(),
    waitTime: '18m ago',
    triageLevel: 'Routine (Vata Shoola)',
    status: 'WAITING_OPD',
    patient: {
      name: 'Ramchandra Verma',
      age: 64,
      gender: 'Male',
      hhid: 'HH-2026-913',
      abhaId: '91-3829-5729-1029',
      phone: '9811334455',
      bloodGroup: 'O +ve',
      category: 'Senior Citizen (BPL)',
      occupation: 'Retired Clerk'
    },
    intake: {
      complaintId: 'joint_pain',
      complaintLabel: 'Janu Sandhigata Vata (दोनों घुटनों में तीव्र दर्द, अकड़न व कट-कट की आवाज)',
      duration: '1.5 Years',
      site: 'Bilateral Knee Joints (जानु संधि)',
      severityVas: '6 / 10',
      onset: 'Insidious onset, bilateral knee joints with crepitus on squatting',
      associatedSymptoms: ['Joint Crepitus (कट-कट आवाज)', 'Morning Stiffness (सुबह अकड़न)', 'Difficulty Climbing Stairs (सीढ़ी चढ़ने में असमर्थ)'],
      reportedTriggers: {
        aharaja: ['Ati Rooksha Ahara (सूखा चना, मुरमुरा, ठंडा पानी)', 'Inadequate nutrient and fat intake'],
        viharaja: ['Excessive walking on hard surfaces', 'Cold AC breeze', 'Sitting cross-legged on floor'],
        manasika: ['Worry over mobility loss']
      },
      // Nidan AI MediKiosk Targeted Inquiries & Patient Recorded Responses
      kioskInquiries: [
        {
          id: 'inq_1',
          questionHi: 'क्या घुटनों का दर्द व जकड़न सुबह सोकर उठने पर अथवा ठंडे मौसम में अधिक रहता है?',
          questionEn: 'Is knee pain and stiffness worse in the early morning upon waking or in cold weather?',
          patientAnswer: 'हाँ, सुबह उठते समय पैर सीधे करने में तीव्र जकड़न (Stambha) और ठंड के मौसम में असहनीय दर्द होता है।',
          clinicalReason: 'Identifies Sheeta & Chala guna of Prakupita Vata affecting Sandhis (Joints).',
          answeredAtKiosk: true
        },
        {
          id: 'inq_2',
          questionHi: 'क्या चलने-फिरने या सीढ़ियां चढ़ते समय घुटने के जोड़ों में से चटकने या रगड़ (Crepitus) की आवाज आती है?',
          questionEn: 'Do you experience cracking or grinding sounds (Crepitus / Sandhisphutana) while walking or climbing stairs?',
          patientAnswer: 'हाँ, घुटनों को मोड़ने और सीढ़ियां चढ़ते समय स्पष्ट चटकने की आवाज (Sandhisphutana) आती है।',
          clinicalReason: 'Confirms Shleshaka Kapha Kshaya and Asthi-Sandhi friction pathognomonic of Sandhigata Vata.',
          answeredAtKiosk: true
        },
        {
          id: 'inq_3',
          questionHi: 'क्या पेट में गैस, पेट फूलना अथवा पुरानी कब्ज (बद्धकोष्ठता) की शिकायत रहती है?',
          questionEn: 'Do you suffer from flatulence, bloating, or chronic constipation?',
          patientAnswer: 'हाँ, पिछले कई महीनों से मल कड़ा रहता है और पेट में भारीपन व गैस भरी रहती है।',
          clinicalReason: 'Evaluates Pakwashayagata Vata & Apana Vayu dushti as the root trigger of systemic Vata aggravation.',
          answeredAtKiosk: true
        }
      ],
      currentMedications: ['Paracetamol 650mg SOS', 'Calcium 500mg'],
      knownAllergies: ['None Known (NKDA)'],
      kioskPrakritiResult: {
        dominant: 'Vata-Kapha (वात-कफज)',
        scores: { vata: 60, pitta: 15, kapha: 25 }
      }
    },
    rogiPariksha: {
      lakshana: {
        chiefComplaint: 'Janu Sandhigata Vata (दोनों घुटनों में तीव्र दर्द, अकड़न व कट-कट की आवाज)',
        duration: '1.5 Years',
        onset: 'Insidious onset, worse in winter',
        site: 'Bilateral Janu Sandhi',
        severityVas: '6 / 10',
        associated: ['Sandhi Sphutana', 'Stambha', 'Gati Sangha']
      },
      ashtavidha: {
        nadi: '',
        jihva: '',
        mala: '',
        mutra: '',
        shabda: '',
        sparsha: '',
        druk: '',
        akriti: ''
      },
      dashavidha: {
        prakriti: { dominant: 'Vata-Kapha (वात-कफज)', scores: { vata: 60, pitta: 15, kapha: 25 } },
        vikriti: { dominant: 'Vata Vriddhi (अस्थि-मज्जागत वात प्रकोप)', delta: '+10% Vata surge' },
        sara: { overall: 'Avara Sara', weakDhatus: ['Asthi', 'Majja', 'Mamsa'] },
        samhanana: 'Hina-Madhyama',
        pramana: 'Krisha (BMI 21.2)',
        satmya: 'Madhyama',
        satva: 'Pravara',
        aharaShakti: { agni: 'Vishamagni (विषमाग्नि)', abhyavaharana: 'Avara', jarana: 'Visham' },
        vyayamaShakti: { grade: 'Avara', shodhanaEligible: false, rationale: 'Vriddhavastha & Dhatu Kshaya contraindicate strong Shodhana. Indicated for Basti & Sthanika only.' },
        vaya: 'Vriddhavastha (64 Years)'
      }
    },
    rogaPariksha: {
      diagnosticCodes: {
        namasteCode: 'AYU-VAT-04',
        namasteTerm: 'Sandhigata Vata (संधिगत वात)',
        icd11Code: 'FA00.Z',
        icd11Term: 'Osteoarthritis of knee, unspecified'
      },
      samprapti: {
        dosha: 'Vyana Vata & Shleshaka Kapha Kshaya',
        dushya: 'Asthi Dhatu, Majja Dhatu, Sandhi Snayu',
        srotas: 'Asthivaha, Majjavaha',
        srotodushtiPrakara: 'Sanga & Khavaigunya',
        udbhavasthana: 'Pakwashaya',
        vyakthasthana: 'Janu Sandhi',
        rogamarga: 'Madhyama Rogamarga',
        sadhyaAsadhyata: 'Yapya (Manageable with periodic lubrication)'
      }
    },
    chikitsaPlan: {
      sutra: 'वातव्याधौ शमनेन बस्त्या च तैलनिषेवणेन। स्नेहन-स्वेदनं च जानुसंधौ विशेषतः॥',
      nidanaParivarjana: [
        'Avoid climbing stairs repeatedly and sitting cross-legged on the floor.',
        'Strictly eliminate dry snacks (Kurmura, papad), cold refrigerated drinks, and raw sprouts.',
        'Avoid exposure to direct cold air conditioning or cold baths.'
      ],
      ahara: {
        favorableRasa: ['Madhura (मधुर)', 'Amla (अम्ल)', 'Lavana (लवण)'],
        unfavorableRasa: ['Katu (कटु)', 'Tikta (तिक्त)', 'Kashaya (कषाय)'],
        prescribedDiet: 'Warm milk with Go-Ghrita and Ashwagandha, Sesame (Tila) laddoo, Garlic milk (Lasuna Ksheerapaka), Warm Moong-Rice Khichdi with 2 tsp ghee.',
        restrictedDiet: 'Dry bread, toast, dry chickpeas, bitter gourd, raw salads, cold water.'
      },
      vihara: {
        dinacharya: 'Daily Abhyanga on knees with Mahanarayana Taila followed by hot water fomentation. Wear knee warmers.',
        ritucharya: 'Hemanta-Shishira care: Keep body warm, wear woolen clothes, avoid morning dew.',
        yogaPranayama: 'Sukshma Vyayama for knee joints, Pawanmuktasana series, Nadi Shodhana Pranayama (15 min daily).'
      },
      suggestedProtocol: {
        protocolTitle: 'Sandhigata Vata Vata-Shamak Protocol',
        medications: [
          { id: 10, name: 'Yogaraj Guggulu', kalpana: 'Vati', dose: '500 mg (2 Vati)', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Dashamoola Kwatha or Lukewarm Water', duration: '30 Days', purpose: 'Pacifies Vata in Asthi-Majja' },
          { id: 11, name: 'Dashamoola Kwatha Pravahi', kalpana: 'Kwatha', dose: '20 ml + equal water', frequency: 'BD (Twice Daily)', kaala: 'Pragbhakta (Before Meals)', anupana: 'Lukewarm Water', duration: '30 Days', purpose: 'Potent Shothahara & Vedanasthapana' },
          { id: 12, name: 'Ashwagandhadhyarishta', kalpana: 'Arishta', dose: '15 ml + 15 ml water', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Water', duration: '30 Days', purpose: 'Balyam, Rasayana & Dhatu strengthener' }
        ],
        panchakarma: {
          protocolName: 'Janu Basti & Matra Basti (जानु बस्ति)',
          purvakarma: 'Sthanika Abhyanga on knees with Ksheerabala Taila 101.',
          pradhanakarma: 'Janu Basti with warm Mahanarayana Taila (35 min daily for 7 days) + Matra Basti (60 ml for 8 days).',
          paschatkarma: 'Rest with knee elevated for 30 minutes; avoid bare feet walking.'
        }
      }
    },
    prescriptions: [],
    panchakarmaOrders: [],
    assessment: { confirmedDiagnosis: null }
  },

  // ─── CASE 3: RAJESH K. PATEL (AYU-103) ───
  {
    id: 'case-ayu-103',
    token: 'AYU-103',
    crNo: '2026/AIIA/10484',
    uhid: 'UHID-2026-90414',
    timestamp: new Date().toISOString(),
    waitTime: '25m ago',
    triageLevel: 'Routine (Prameha Screening)',
    status: 'WAITING_OPD',
    patient: {
      name: 'Rajesh K. Patel',
      age: 46,
      gender: 'Male',
      hhid: 'HH-2026-914',
      abhaId: '91-4512-8923-3490',
      phone: '9822445566',
      bloodGroup: 'A +ve',
      category: 'General',
      occupation: 'IT Manager (Desk Job, 10 hrs sedentary)'
    },
    intake: {
      complaintId: 'diabetes_metabolic',
      complaintLabel: 'Kaphaja Prameha (अत्यधिक मूत्रत्याग, आलस्य, मुँह में मीठापन व थकान)',
      duration: '4 Months',
      site: 'Mutravaha Srotas & Medo Dhatu',
      severityVas: '4 / 10',
      onset: 'Gradual weight gain (+8kg in 1 yr), excessive urination at night',
      associatedSymptoms: ['Polyuria (बार-बार पेशाब)', 'Turbid Urine (मैला मूत्र)', 'Sweet Taste in Mouth (मुँह मीठा रहना)', 'Lethargy (आलस्य)'],
      reportedTriggers: {
        aharaja: ['Excess sweets, sugar, curd at night, heavy dairy'],
        viharaja: ['Daytime sleeping after lunch', 'Sedentary desk job > 10 hours', 'Complete lack of exercise'],
        manasika: ['Sensory over-indulgence, inertia']
      },
      // Nidan AI MediKiosk Targeted Inquiries & Patient Recorded Responses
      kioskInquiries: [
        {
          id: 'inq_1',
          questionHi: 'क्या आपको बार-बार और अधिक मात्रा में पेशाब (प्रभूत-आविल मूत्रता) आता है, विशेषकर रात के समय?',
          questionEn: 'Do you experience frequent and profuse urination (Prabhuta-Avila Mutrata), especially at night?',
          patientAnswer: 'हाँ, दिन में 7-8 बार और रात में 3-4 बार उठकर पेशाब जाना पड़ता है, पेशाब हल्का मैला (Turbid) दिखता है।',
          clinicalReason: 'Pathognomonic hallmark of Prameha (Prabhuta Mutrata & Avila Mutrata due to Kleda & Meda involvement).',
          answeredAtKiosk: true
        },
        {
          id: 'inq_2',
          questionHi: 'क्या हथेलियों और पैरों के तलवों में सुन्नपन, झनझनाहट या जलन (करा-पाद दाह / सुप्तता) रहती है?',
          questionEn: 'Do you feel burning sensation, numbness, or tingling in palms and soles (Kara-Pada Daha / Suptata)?',
          patientAnswer: 'हाँ, दोनों पैरों के तलवों में लगातार झनझनाहट और हल्की जलन बनी रहती है।',
          clinicalReason: 'Evaluates peripheral neuropathic involvement (Prameha Purvarupa / Upadrava).',
          answeredAtKiosk: true
        },
        {
          id: 'inq_3',
          questionHi: 'क्या दिन में सोने (दिवास्वप्न) तथा बैठे रहने वाली जीवनशैली (अव्यायाम/आस्यासुखम्) की आदत है?',
          questionEn: 'Do you have a habit of daytime sleeping (Divaswapna) and a sedentary lifestyle (Asyasukhama)?',
          patientAnswer: 'हाँ, दुकान पर दिनभर 10 घंटे लगातार बैठना होता है और दोपहर में खाना खाकर 1 घंटा सोने की आदत है।',
          clinicalReason: 'Identifies classical Medo-Dhatu vitiating Aetiology: Asyasukhama & Divaswapna inducing Kaphaja Prameha.',
          answeredAtKiosk: true
        }
      ],
      currentMedications: ['Metformin 500mg OD'],
      knownAllergies: ['None Known (NKDA)'],
      kioskPrakritiResult: {
        dominant: 'Kapha-Pitta (कफ-पित्तज)',
        scores: { vata: 20, pitta: 35, kapha: 45 }
      }
    },
    rogiPariksha: {
      lakshana: {
        chiefComplaint: 'Kaphaja Prameha (अत्यधिक मूत्रत्याग, आलस्य, मुँह में मीठापन व थकान)',
        duration: '4 Months',
        onset: 'Gradual metabolic decline',
        site: 'Mutravaha Srotas & Medo Dhatu',
        severityVas: '4 / 10',
        associated: ['Prabhoota Mutrata', 'Avila Mutrata', 'Kara-Pada Daha', 'Asya Madhurya']
      },
      ashtavidha: {
        nadi: '',
        jihva: '',
        mala: '',
        mutra: '',
        shabda: '',
        sparsha: '',
        druk: '',
        akriti: ''
      },
      dashavidha: {
        prakriti: { dominant: 'Kapha-Pitta (कफ-पित्तज)', scores: { vata: 20, pitta: 35, kapha: 45 } },
        vikriti: { dominant: 'Kaphaja-Medovriddhi (कफ-मेद प्रकोप)', delta: '+15% Kapha surge' },
        sara: { overall: 'Meda Sara', weakDhatus: ['Meda', 'Mamsa'] },
        samhanana: 'Sithila (Loose muscle tone)',
        pramana: 'Ati-Sthula (BMI 28.6)',
        satmya: 'Pravara',
        satva: 'Madhyama',
        aharaShakti: { agni: 'Mandagni (मन्दाग्नि)', abhyavaharana: 'Pravara', jarana: 'Manda' },
        vyayamaShakti: { grade: 'Pravara', shodhanaEligible: true, rationale: 'Robust built and high Medo-Kapha accumulation indicate high eligibility for Vamana and Lekhana Basti.' },
        vaya: 'Madhyama (46 Years)'
      }
    },
    rogaPariksha: {
      diagnosticCodes: {
        namasteCode: 'AYU-PRA-01',
        namasteTerm: 'Kaphaja Prameha (प्रमेह / मधुमेह पूर्ववृत्त)',
        icd11Code: '5A11',
        icd11Term: 'Type 2 Diabetes mellitus / Impaired Glucose Tolerance'
      },
      samprapti: {
        dosha: 'Kledaka Kapha & Samana Vata',
        dushya: 'Meda, Kleda, Mamsa, Majja, Ojas',
        srotas: 'Medovaha, Mutravaha',
        srotodushtiPrakara: 'Atipravritti & Sanga',
        udbhavasthana: 'Amashaya',
        vyakthasthana: 'Basti (Bladder) & Sarva Sharira',
        rogamarga: 'Abhyantara & Bahya',
        sadhyaAsadhyata: 'Krichrasadhya'
      }
    },
    chikitsaPlan: {
      sutra: 'स्थूलः प्रमेही बलवान् विशोध्यः। कफ-मेदोहरं च दीपनं लेखनं च शमनम्॥',
      nidanaParivarjana: [
        'Completely eliminate direct sugars, sweets, jaggery, bakery items, and sodas.',
        'Stop daytime sleeping (Divaswapna) immediately.',
        'Replace white polished rice and refined flour with aged barley and millets.'
      ],
      ahara: {
        favorableRasa: ['Tikta (तिक्त)', 'Katu (कटु)', 'Kashaya (कषाय)'],
        unfavorableRasa: ['Madhura (मधुर)', 'Amla (अम्ल)', 'Lavana (लवण)'],
        prescribedDiet: 'Yava Roti (Barley bread), Mudga (Green gram), Methi, Karela, Patola, Triphala water, Roasted chana.',
        restrictedDiet: 'White rice, potatoes, sweet fruits, full cream milk, cheese, paneer, fried snacks.'
      },
      vihara: {
        dinacharya: 'Wake up at 5:30 AM. Perform Udvartana (dry powder massage) before bath.',
        ritucharya: 'Favor dry warm environments; avoid Kapha-aggravating dampness.',
        yogaPranayama: 'Kapalabhati (15 min daily), Surya Namaskar (12 cycles), 5 km daily walking.'
      },
      suggestedProtocol: {
        protocolTitle: 'Prameha-Hara Lekhana Regimen',
        medications: [
          { id: 20, name: 'Nisha-Amalaki Churna', kalpana: 'Churna', dose: '3 grams', frequency: 'BD (Twice Daily)', kaala: 'Pragbhakta (Before Meals)', anupana: 'Lukewarm Water or Honey (1/2 tsp)', duration: '45 Days', purpose: 'Potent anti-hyperglycemic' },
          { id: 21, name: 'Chandraprabha Vati', kalpana: 'Vati', dose: '500 mg (2 Vati)', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Lukewarm Water', duration: '45 Days', purpose: 'Rejuvenates Mutravaha Srotas' },
          { id: 22, name: 'Asanadi Kwatha', kalpana: 'Kwatha', dose: '25 ml + equal water', frequency: 'BD (Twice Daily)', kaala: 'Pragbhakta (Before Meals)', anupana: 'Water', duration: '45 Days', purpose: 'Classical Medo-hara & Lekhana' }
        ],
        panchakarma: {
          protocolName: 'Vamana Karma followed by Lekhana Basti',
          purvakarma: 'Deepana-Pachana with Chitrakadi Vati + Snehana with Mahatiktaka Ghrita.',
          pradhanakarma: 'Vamana Karma with Madanaphala Yoga on Day 7.',
          paschatkarma: 'Samsarjana Krama for 5 days followed by Lekhana Basti course.'
        }
      }
    },
    prescriptions: [],
    panchakarmaOrders: [],
    assessment: { confirmedDiagnosis: null }
  },

  // ─── CASE 4: ANANYA IYER (AYU-104) ───
  {
    id: 'case-ayu-104',
    token: 'AYU-104',
    crNo: '2026/AIIA/10485',
    uhid: 'UHID-2026-90415',
    timestamp: new Date().toISOString(),
    waitTime: '30m ago',
    triageLevel: 'Urgent (Respiratory Wheezing)',
    status: 'WAITING_OPD',
    patient: {
      name: 'Ananya Iyer',
      age: 29,
      gender: 'Female',
      hhid: 'HH-2026-915',
      abhaId: '91-9823-4710-2391',
      phone: '9844556677',
      bloodGroup: 'AB +ve',
      category: 'General',
      occupation: 'Graphic Designer'
    },
    intake: {
      complaintId: 'respiratory_issues',
      complaintLabel: 'Tamaka Shwasa (सांस फूलना, छाती में घबराहट, सूखी-कफयुक्त खांसी व रात में बेचैनी)',
      duration: '8 Months',
      site: 'Chest & Airway (उरः व प्राणवह स्रोतस)',
      severityVas: '7 / 10',
      onset: 'Triggered by dust, cold drinks, and humidity',
      associatedSymptoms: ['Audible Wheezing (सांस में सीटी जैसी आवाज)', 'Night Dyspnea (रात में सांस फूलना)', 'Relief Sitting Up (बैठने पर ही आराम)', 'Cough (खांसी)'],
      reportedTriggers: {
        aharaja: ['Cold refrigerated drinks, ice cream, curd at night, cheese'],
        viharaja: ['Dust, room fresheners, mosquito coils, direct cold AC'],
        manasika: ['Panic during breathlessness']
      },
      // Nidan AI MediKiosk Targeted Inquiries & Patient Recorded Responses
      kioskInquiries: [
        {
          id: 'inq_1',
          questionHi: 'क्या साँस फूलने या खाँसी का वेग देर रात या तड़के (प्रातः 3-4 बजे) अथवा बादल छाने पर बढ़ता है?',
          questionEn: 'Does breathlessness worsen late at night, early morning (3-4 AM), or in cloudy/humid weather?',
          patientAnswer: 'हाँ, रात के 3 बजे के आसपास तेज खाँसी उठती है और सीने में भारी जकड़न से साँस फूलने लगती है।',
          clinicalReason: 'Confirms classical Vata-Kapha paroxysm timing in Pranavaha Srotas (Nishakale Tamaka Shwasa).',
          answeredAtKiosk: true
        },
        {
          id: 'inq_2',
          questionHi: 'क्या खाँसी के साथ थोड़ा कफ (ष्ठीवन) बाहर निकलने पर साँस लेने में कुछ देर के लिए आराम मिलता है?',
          questionEn: 'Do you feel temporary relief in breathing once a small quantity of phlegm is expectorated?',
          patientAnswer: 'हाँ, बहुत खाँसने के बाद जब गाढ़ा कफ निकलता है तो सीने में थोड़ा सुकून मिलता है।',
          clinicalReason: 'Classical pathognomonic symptom: "प्रमुह्यति कासते च श्लेष्मण्यपकृष्टे सुखं लभते" (Charaka).',
          answeredAtKiosk: true
        },
        {
          id: 'inq_3',
          questionHi: 'क्या लेटने पर साँस फूलना अधिक बढ़ जाता है और बैठकर आगे झुकने पर राहत मिलती है?',
          questionEn: 'Does breathlessness worsen on lying flat, and do you feel better sitting upright and leaning forward?',
          patientAnswer: 'हाँ, बिस्तर पर लेट नहीं पाती, बैठकर आगे की तरफ झुकने पर ही साँस आ पाती है।',
          clinicalReason: 'Confirms Orthopnea & Tamaka Shwasa postural relief mechanism (Asino Labhate Saukhyam).',
          answeredAtKiosk: true
        }
      ],
      currentMedications: ['Salbutamol Inhaler SOS'],
      knownAllergies: ['Dust & Pollen'],
      kioskPrakritiResult: {
        dominant: 'Vata-Kapha (वात-कफज)',
        scores: { vata: 50, pitta: 15, kapha: 35 }
      }
    },
    rogiPariksha: {
      lakshana: {
        chiefComplaint: 'Tamaka Shwasa (सांस फूलना, छाती में घबराहट, सूखी-कफयुक्त खांसी व रात में बेचैनी)',
        duration: '8 Months',
        onset: 'Triggered by cold & dust',
        site: 'Uras & Pranavaha Srotas',
        severityVas: '7 / 10',
        associated: ['Ghurghuraka', 'Kasa', 'Asino Labhate Soukhyam', 'Nidranasha']
      },
      ashtavidha: {
        nadi: '',
        jihva: '',
        mala: '',
        mutra: '',
        shabda: '',
        sparsha: '',
        druk: '',
        akriti: ''
      },
      dashavidha: {
        prakriti: { dominant: 'Vata-Kapha (वात-कफज)', scores: { vata: 50, pitta: 15, kapha: 35 } },
        vikriti: { dominant: 'Prana-Vata Pratilomata (प्राण-वात प्रतीलोमता)', delta: '+15% Vata in Prana Srotas' },
        sara: { overall: 'Madhyama Sara', weakDhatus: ['Rasa', 'Mamsa'] },
        samhanana: 'Madhyama',
        pramana: 'Sama Pramana (BMI 22.1)',
        satmya: 'Madhyama',
        satva: 'Madhyama',
        aharaShakti: { agni: 'Mandagni (मन्दाग्नि)', abhyavaharana: 'Avara', jarana: 'Manda' },
        vyayamaShakti: { grade: 'Avara', shodhanaEligible: false, rationale: 'Active acute bronchospasm contraindicates immediate Shodhana. Deepana-Pachana and Shamana required first.' },
        vaya: 'Yuva (29 Years)'
      }
    },
    rogaPariksha: {
      diagnosticCodes: {
        namasteCode: 'AYU-RES-02',
        namasteTerm: 'Tamaka Shwasa (तमक श्वास)',
        icd11Code: 'CA23.0',
        icd11Term: 'Allergic Asthma / Bronchial Asthma'
      },
      samprapti: {
        dosha: 'Prana Vata & Kledaka Kapha',
        dushya: 'Rasa Dhatu, Pranavaha Srotas',
        srotas: 'Pranavaha, Annavaha, Udakavaha',
        srotodushtiPrakara: 'Sanga & Vimargagamana',
        udbhavasthana: 'Amashaya & Hridaya',
        vyakthasthana: 'Phupphusa (Lungs)',
        rogamarga: 'Abhyantara Rogamarga',
        sadhyaAsadhyata: 'Krichrasadhya (Yapya in acute phase)'
      }
    },
    chikitsaPlan: {
      sutra: 'वातघ्नैरौषधैः कफघ्नैश्च तमके समुपक्रमेत्। स्वेदनं चोष्णमन्नं च वातानुकूलनम्॥',
      nidanaParivarjana: [
        'Strictly avoid cold foods, refrigerated water, ice cream, curd, and bananas.',
        'Eliminate exposure to room fresheners, incense sticks, mosquito repellents, and dust.',
        'Avoid sleeping under direct fan or air conditioner vents.'
      ],
      ahara: {
        favorableRasa: ['Katu (कटु)', 'Ushna Guna (उष्ण)', 'Lavana (लवण)'],
        unfavorableRasa: ['Sheeta (शीत)', 'Guru (गुरु)', 'Madhura (मधुर)'],
        prescribedDiet: 'Warm Kulattha Yusha (Horsegram soup), Shunthi-Siddha Jala (Boiled ginger water), Garlic infused soup, Purana Shali, Pippali with honey.',
        restrictedDiet: 'Milk, cheese, cold drinks, curd, heavy fried foods, raw salads.'
      },
      vihara: {
        dinacharya: 'Chest Abhyanga with warm sesame oil + rock salt followed by steam fomentation.',
        ritucharya: 'Cover chest and neck with a scarf when outdoors in winter or rains.',
        yogaPranayama: 'Anulom Vilom (15 min), Bhastrika (mild 5 min), Ujjayi, Matsyasana, Bhujangasana.'
      },
      suggestedProtocol: {
        protocolTitle: 'Tamaka Shwasa Bronchodilator Regimen',
        medications: [
          { id: 30, name: 'Shwasakasa Chintamani Rasa', kalpana: 'Rasaushadhi', dose: '125 mg', frequency: 'BD (Twice Daily)', kaala: 'Pragbhakta (Before Meals)', anupana: 'Fresh Ginger Juice + Honey', duration: '30 Days', purpose: 'Potent bronchodilator & dissolves thick phlegm' },
          { id: 31, name: 'Kanakasava', kalpana: 'Asava', dose: '15 ml + equal warm water', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Warm Water', duration: '30 Days', purpose: 'Relieves bronchial spasm' },
          { id: 32, name: 'Talisadi Churna', kalpana: 'Churna', dose: '3 grams', frequency: 'TDS (Three times daily)', kaala: 'Muhurmuhuh (Frequent small doses)', anupana: 'Honey (Madhu)', duration: '30 Days', purpose: 'Deepana-Pachana & liquefies mucus' }
        ],
        panchakarma: {
          protocolName: 'Uras-Swedana & Sadyo Vamana (उरो-स्वेदन)',
          purvakarma: 'Sthanika Abhyanga on chest/back with Saindhavadi Taila + steam.',
          pradhanakarma: 'In stable remission: Sadyo Vamana with Yashtimadhu Phanta.',
          paschatkarma: 'Dhoomapana with Haridra varti + warm rice soup with Pippali.'
        }
      }
    },
    prescriptions: [],
    panchakarmaOrders: [],
    assessment: { confirmedDiagnosis: null }
  },

  // ─── CASE 5: DEVENDRA JOSHI (AYU-105) ───
  {
    id: 'case-ayu-105',
    token: 'AYU-105',
    crNo: '2026/AIIA/10486',
    uhid: 'UHID-2026-90416',
    timestamp: new Date().toISOString(),
    waitTime: '38m ago',
    triageLevel: 'Routine (Digestive Malabsorption)',
    status: 'WAITING_OPD',
    patient: {
      name: 'Devendra Joshi',
      age: 58,
      gender: 'Male',
      hhid: 'HH-2026-916',
      abhaId: '91-3719-2819-0192',
      phone: '9833221100',
      bloodGroup: 'B -ve',
      category: 'General',
      occupation: 'Bank Manager'
    },
    intake: {
      complaintId: 'ibs_malabsorption',
      complaintLabel: 'Grahani Roga (भोजन के तुरंत बाद शौच, पेट में मरोड़ व कभी दस्त कभी कब्ज)',
      duration: '1 Year',
      site: 'Grahani & Pakwashaya (आंतें व पक्वाशय)',
      severityVas: '5 / 10',
      onset: 'Triggered post severe gastroenteritis 1 year ago, worse with office stress',
      associatedSymptoms: ['Alternating Stool (कभी दस्त कभी कब्ज)', 'Post-Meal Urgency (भोजनोपरांत तुरंत शौच)', 'Abdominal Cramping (पेट में मरोड़)', 'Gurgling Sounds (पेट में गुड़गुड़ाहट)'],
      reportedTriggers: {
        aharaja: ['Eating at irregular hours', 'Heavy restaurant food', 'Raw salads and dairy'],
        viharaja: ['Suppressing natural urge to defecate during meetings', 'Divaswapna', 'Workplace stress'],
        manasika: ['Severe anxiety of urgency during commute']
      },
      // Nidan AI MediKiosk Targeted Inquiries & Patient Recorded Responses
      kioskInquiries: [
        {
          id: 'inq_1',
          questionHi: 'क्या भोजन करने के तुरंत बाद शौच (शौचवेग) जाने की तीव्र इच्छा होती है?',
          questionEn: 'Do you feel an urgent impulse to pass stools immediately after consuming meals?',
          patientAnswer: 'हाँ, सुबह नाश्ता या दोपहर का खाना खाते ही पेट में मरोड़ उठती है और तुरंत टॉयलेट जाना पड़ता है।',
          clinicalReason: 'Hallmark of Grahani Agnimandya & exaggerated gastrocolic reflex (Muhurbaddham Muhurdravam).',
          answeredAtKiosk: true
        },
        {
          id: 'inq_2',
          questionHi: 'क्या मल कभी कड़ा (बध्द) और कभी बिल्कुल पतला या झागदार (द्रव/साम) आता है?',
          questionEn: 'Does stool consistency alternate between hard/constipated and loose/mucous (Muhur Baddham Muhur Dravam)?',
          patientAnswer: 'हाँ, कभी 2 दिन कड़ा मल आता है और कभी अचानक बिना पचे झागदार पतला दस्त होने लगता है।',
          clinicalReason: 'Classical clinical triad of Grahani: "मुहुर्बद्धं मुहुर्द्रवं मुहुर्मुहुः पुरीषं त्यजति"।',
          answeredAtKiosk: true
        },
        {
          id: 'inq_3',
          questionHi: 'क्या भोजन में चिकनाई (तेल-घी) या भारी भोजन लेने पर पेट में अत्यधिक गुड़गुड़ाहट (आटोप) व भारीपन होता है?',
          questionEn: 'Does greasy/heavy food trigger excessive rumbling (Atopa) and abdominal distension?',
          patientAnswer: 'हाँ, थोड़ा सा भी घी या तेल खाने पर पेट फूल जाता है और गुड़गुड़ की तेज आवाजें आती हैं।',
          clinicalReason: 'Indicates severe Pachakagni and Samana Vata impairment unable to digest Guru & Snigdha gunas.',
          answeredAtKiosk: true
        }
      ],
      currentMedications: ['Mebeverine 135mg SOS', 'Probiotics'],
      knownAllergies: ['Lactose Intolerance'],
      kioskPrakritiResult: {
        dominant: 'Vata-Pitta (वात-पित्तज)',
        scores: { vata: 55, pitta: 35, kapha: 10 }
      }
    },
    rogiPariksha: {
      lakshana: {
        chiefComplaint: 'Grahani Roga (भोजन के तुरंत बाद शौच, पेट में मरोड़ व कभी दस्त कभी कब्ज)',
        duration: '1 Year',
        onset: 'Post-infectious with chronic anxiety',
        site: 'Grahani & Pakwashaya',
        severityVas: '5 / 10',
        associated: ['Muhurbaddham Muhurdravam', 'Atoopa', 'Vistambha', 'Karshya']
      },
      ashtavidha: {
        nadi: '',
        jihva: '',
        mala: '',
        mutra: '',
        shabda: '',
        sparsha: '',
        druk: '',
        akriti: ''
      },
      dashavidha: {
        prakriti: { dominant: 'Vata-Pitta (वात-पित्तज)', scores: { vata: 55, pitta: 35, kapha: 10 } },
        vikriti: { dominant: 'Samana Vata & Pachaka Pitta Dushti', delta: '+15% Vata & Ama' },
        sara: { overall: 'Avara Sara', weakDhatus: ['Rasa', 'Rakta', 'Mamsa'] },
        samhanana: 'Avara',
        pramana: 'Krisha (BMI 19.8)',
        satmya: 'Avara',
        satva: 'Avara',
        aharaShakti: { agni: 'Agnimandya / Vishamagni (अग्निमांद्य)', abhyavaharana: 'Avara', jarana: 'Krichra' },
        vyayamaShakti: { grade: 'Avara', shodhanaEligible: false, rationale: 'Marked Agnimandya and Dhatu Kshaya strictly contraindicate Vamana/Virechana. Indicated for Deepana-Pachana and Takra Prayoga only.' },
        vaya: 'Madhyama-Vriddha (58 Years)'
      }
    },
    rogaPariksha: {
      diagnosticCodes: {
        namasteCode: 'AYU-DIG-03',
        namasteTerm: 'Grahani Roga (ग्रहणी दोष)',
        icd11Code: 'DD91.0',
        icd11Term: 'Irritable bowel syndrome / Malabsorption'
      },
      samprapti: {
        dosha: 'Samana Vata, Pachaka Pitta, Kledaka Kapha Kshaya',
        dushya: 'Anna Rasa, Purisha, Grahani Nadi',
        srotas: 'Annavaha, Purishavaha',
        srotodushtiPrakara: 'Atipravritti & Vimargagamana',
        udbhavasthana: 'Amashaya & Grahani',
        vyakthasthana: 'Pakwashaya',
        rogamarga: 'Abhyantara Rogamarga',
        sadhyaAsadhyata: 'Krichrasadhya (Curable with strict Takra Kalpa)'
      }
    },
    chikitsaPlan: {
      sutra: 'ग्रहणीदोषे दीपनं पाचनं चैव तक्रप्रयोगः परमौषधम्। लङ्घनं चाल्पभोजनं च स्तम्भनम्॥',
      nidanaParivarjana: [
        'Strictly stop all direct whole milk, oily sweets, deep fried snacks, and raw salads.',
        'Never suppress natural defecation or flatus urges (Vegadharana).',
        'Avoid eating when anxious, upset, or in a rush.'
      ],
      ahara: {
        favorableRasa: ['Kashaya (कषाय)', 'Tikta (तिक्त)', 'Deepana Katu (दीपन कटु)'],
        unfavorableRasa: ['Madhura (मधुर)', 'Guru (गुरु)', 'Snigdha (स्निग्ध)'],
        prescribedDiet: 'Takra Prayoga (churned buttermilk with roasted cumin and dry ginger), Bilva Avaleha, Mudga Yusha, Manda, Pomegranate.',
        restrictedDiet: 'Milk, cheese, curd, bakery bread, oily snacks, cabbage, cauliflower, cold water.'
      },
      vihara: {
        dinacharya: 'Sip warm ginger water throughout the day. Rest 15 minutes in left lateral position (Vamakukshi) post-meal.',
        ritucharya: 'Protect digestive fire against damp humid air.',
        yogaPranayama: 'Vajrasana (10 min post-meal), Pavanamuktasana, Nadi Shodhana (15 min morning).'
      },
      suggestedProtocol: {
        protocolTitle: 'Grahani Deepana-Stambhana Protocol',
        medications: [
          { id: 40, name: 'Kutajghan Vati', kalpana: 'Vati', dose: '500 mg (2 Vati)', frequency: 'BD (Twice Daily)', kaala: 'Pragbhakta (Before Meals)', anupana: 'Fresh Buttermilk or Warm Water', duration: '30 Days', purpose: 'Potent Stambhana & Grahi (binds stool)' },
          { id: 41, name: 'Bilvadi Leha', kalpana: 'Avaleha', dose: '5 grams', frequency: 'BD (Twice Daily)', kaala: 'Adhobhakta (After Meals)', anupana: 'Lukewarm Water', duration: '30 Days', purpose: 'Strengthens Grahani mucosal integrity' },
          { id: 42, name: 'Chitrakadi Vati', kalpana: 'Vati', dose: '250 mg (1 Vati)', frequency: 'BD (Twice Daily)', kaala: 'Samabhakta (With Meals)', anupana: 'Warm Water', duration: '21 Days', purpose: 'Ignites Jatharagni & digests stubborn Ama' }
        ],
        panchakarma: {
          protocolName: 'Takra Kalpa & Piccha Basti (तक्र कल्प)',
          purvakarma: 'Langhana and Deepana-Pachana with Shadanga Paniya.',
          pradhanakarma: 'Takra Kalpa (graduated buttermilk therapy for 14 days) + Piccha Basti in chronic ulceration.',
          paschatkarma: 'Gradual re-introduction of light rice soup (Peya) followed by Moong soup.'
        }
      }
    },
    prescriptions: [],
    panchakarmaOrders: [],
    assessment: { confirmedDiagnosis: null }
  }
];
