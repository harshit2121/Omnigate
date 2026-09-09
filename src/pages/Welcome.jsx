import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Activity, ChevronRight, Zap, Stethoscope, Flower2,
  FileText, QrCode, ArrowRight, Check, BarChart3, ChevronDown,
  Monitor, ClipboardList, Printer, Sparkles, Star, Users,
  Clock, ShieldCheck, HeartPulse, Building2, CheckCircle2,
  MessageSquare, BookOpen, Layers, Award, TrendingUp, Sparkle,
  HelpCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import WelcomeNavbar from '../components/layout/WelcomeNavbar';
import WelcomeFooter from '../components/shared/WelcomeFooter';
import HandstrokeMediKiosk from '../components/shared/HandstrokeMediKiosk';

// ---------------------------------------------------------------------------
// Bilingual Content Dictionaries
// ---------------------------------------------------------------------------

const JOURNEY = {
  en: [
    {
      id: 'identify',
      icon: QrCode,
      stepNum: '01',
      title: 'Identity & Instant Registration',
      body: 'Scan your ABHA QR, Aadhaar, or register fresh in under a minute with basic details. Choose your preferred language (Hindi/English).',
    },
    {
      id: 'converse',
      icon: MessageSquare,
      stepNum: '02',
      title: 'Guided Voice & Touch Intake',
      body: 'Speak or tap to explain your symptoms. The smart assistant asks targeted, clinically sound follow-up questions tailored to your complaints.',
    },
    {
      id: 'prakriti',
      icon: Flower2,
      stepNum: '03',
      title: 'Ayush Dashavidha & Prakriti Pariksha',
      body: 'Answers questions about your digestion, sleep, body constitution, and Agni to instantly compute your unique Vata-Pitta-Kapha dosha ratio.',
    },
    {
      id: 'scan',
      icon: FileText,
      stepNum: '04',
      title: 'Old Prescription & Lab Report OCR',
      body: 'Place previous doctor prescriptions and diagnostic reports in the scanner. Handwritings and dates are automatically digitized into your timeline.',
    },
    {
      id: 'route',
      icon: Stethoscope,
      stepNum: '05',
      title: 'Instant Structured Case Sheet to Doctor',
      body: 'A standardized clinical summary with Prakriti charts and timeline is transmitted directly to your assigned Ayush physician’s screen before you walk in.',
    },
  ],
  hi: [
    {
      id: 'identify',
      icon: QrCode,
      stepNum: '01',
      title: 'पहचान व त्वरित पंजीकरण',
      body: 'अपनी आभा आईडी, आधार स्कैन करें या 1 मिनट में नया पंजीकरण करें। अपनी पसंदीदा भाषा (हिंदी/अंग्रेजी) चुनें और चेक-इन शुरू करें।',
    },
    {
      id: 'converse',
      icon: MessageSquare,
      stepNum: '02',
      title: 'आवाज व स्पर्श से सहज संवाद',
      body: 'बोलकर या छूकर अपने मुख्य लक्षण बताएं। स्मार्ट सहायक डॉक्टर की तरह ही आवश्यक अनुवर्ती प्रश्न पूछता है।',
    },
    {
      id: 'prakriti',
      icon: Flower2,
      stepNum: '03',
      title: 'आयुष दशविध व प्रकृति परीक्षा',
      body: 'पाचन, नींद, शारीरिक गठन और अग्नि संबंधी प्रश्नों के आधार पर आपकी वात-पित्त-कफ प्रकृति का सटीक विश्लेषण तैयार होता है।',
    },
    {
      id: 'scan',
      icon: FileText,
      stepNum: '04',
      title: 'पुराने पर्चे व रिपोर्ट का डिजिटलीकरण',
      body: 'पुराने पर्चों और लैब जांचों को स्कैनर में रखें। हस्तलिखित दवाइयां और रिपोर्ट स्वचालित रूप से डिजिटल टाइमलाइन में जुड़ जाती हैं।',
    },
    {
      id: 'route',
      icon: Stethoscope,
      stepNum: '05',
      title: 'डॉक्टर की स्क्रीन पर सीधा केस ट्रांसफर',
      body: 'संपूर्ण मानकीकृत केस हिस्ट्री और प्रकृति चार्ट डॉक्टर के कंप्यूटर पर तुरंत पहुंच जाता है, जिससे वे पूरा समय आपके इलाज में दे सकें।',
    },
  ]
};

const LIVE_STATS = {
  en: [
    { value: '142,500+', label: 'Patients Checked-In', sub: 'Across OPD clinics', icon: Users, color: 'text-[#0B4C8C]' },
    { value: '78%', label: 'Wait Time Reduction', sub: 'From 45 mins to 8 mins', icon: Clock, color: 'text-emerald-600' },
    { value: '62,400+', label: 'Prakriti Assessments', sub: 'Dosha profiles generated', icon: Flower2, color: 'text-[#E2861E]' },
    { value: '98.6%', label: 'Doctor Satisfaction', sub: 'More time for diagnosis', icon: Star, color: 'text-amber-500' },
    { value: '40+', label: 'Ayush OPD Rooms', sub: 'Live integrated systems', icon: Building2, color: 'text-purple-600' },
  ],
  hi: [
    { value: '142,500+', label: 'कुल मरीज चेक-इन', sub: 'ओपीडी विभागों में', icon: Users, color: 'text-[#0B4C8C]' },
    { value: '78%', label: 'प्रतीक्षा समय में कमी', sub: '45 मिनट से घटकर 8 मिनट', icon: Clock, color: 'text-emerald-600' },
    { value: '62,400+', label: 'प्रकृति व दोष मूल्यांकन', sub: 'सटीक आयुर्वेदिक विश्लेषण', icon: Flower2, color: 'text-[#E2861E]' },
    { value: '98.6%', label: 'संतुष्टि दर', sub: 'डॉक्टर और मरीजों द्वारा', icon: Star, color: 'text-amber-500' },
    { value: '40+', label: 'आयुष ओपीडी कक्ष', sub: 'सक्रिय डिजिटल प्रणाली', icon: Building2, color: 'text-purple-600' },
  ]
};

const BENEFITS_DATA = {
  en: [
    {
      category: 'For Patients & Citizens',
      color: 'border-blue-200 bg-blue-50/50',
      badge: 'Citizen Centric',
      items: [
        { title: 'Zero Queue Data Entry', desc: 'No waiting in long manual registration queues. Self-serve in under 2 minutes.' },
        { title: 'Speak in Your Mother Tongue', desc: 'Full bilingual Hindi and English voice recognition tailored for rural and elderly patients.' },
        { title: 'Instant Health Slip & QR Token', desc: 'Get a printed receipt with token number, estimated wait time, and Prakriti lifestyle tips.' },
        { title: 'Never Lose Past Prescriptions', desc: 'Old hospital slips and lab records scanned directly into your unified digital health timeline.' },
      ]
    },
    {
      category: 'For Ayush Physicians & Vaidyas',
      color: 'border-amber-200 bg-amber-50/50',
      badge: 'Clinical Excellence',
      items: [
        { title: 'Pre-Structured Case Sheets', desc: 'Chief complaints, HPI, past illnesses, and red-flags organized the way clinicians read.' },
        { title: 'Dashavidha Pariksha Pre-Computed', desc: 'Prakriti, Vikriti, Agni (digestive fire), and Koshtha scores ready before patient enters.' },
        { title: 'High-Quality Consultation Time', desc: 'Spend the entire visit doing Nadi Pariksha, physical exam, and counseling instead of typing.' },
        { title: 'Ayush E-Prescription with Herb Library', desc: 'Pre-loaded with 400+ classical Ayurvedic formulations and standardized dosage regimens.' },
      ]
    },
    {
      category: 'For Hospitals & Administrators',
      color: 'border-emerald-200 bg-emerald-50/50',
      badge: 'Operational Efficiency',
      items: [
        { title: '3.5x Faster OPD Patient Throughput', desc: 'Handle peak morning footfall of 1,500+ patients smoothly without overcrowding.' },
        { title: 'Paperless Clinical Flow', desc: 'Zero manual paperwork loss, complete digital audit logs, and integrated billing/pharmacy routing.' },
        { title: 'Real-Time Footfall Analytics', desc: 'Monitor department queues, doctor availability, and triage bottlenecks from a single dashboard.' },
        { title: 'Evidence-Based Ayush Research', desc: 'Standardized clinical data collection creates rich datasets for Ayurvedic research and clinical trials.' },
      ]
    }
  ],
  hi: [
    {
      category: 'मरीजों एवं नागरिकों के लिए',
      color: 'border-blue-200 bg-blue-50/50',
      badge: 'रोगी केंद्रित लाभ',
      items: [
        { title: 'बिना कतार त्वरित चेक-इन', desc: 'लंबी लाइनों में खड़े होने से मुक्ति। मात्र 2 मिनट में स्वयं अपना पंजीकरण और लक्षण दर्ज करें।' },
        { title: 'अपनी मातृभाषा में बोलकर बताएं', desc: 'ग्रामीण व बुजुर्ग मरीजों के लिए हिंदी और अंग्रेजी में सहज वॉइस रिकग्निशन।' },
        { title: 'तुरंत टोकन पर्ची व प्रकृति सलाह', desc: 'टोकन नंबर, अनुमानित प्रतीक्षा समय और प्रकृति आधारित दिनचर्या युक्त डिजिटल पर्ची प्राप्त करें।' },
        { title: 'पुराने पर्चे कभी न खोएं', desc: 'पुराने अस्पताल पर्चे और लैब जांचें सीधे स्कैन होकर डिजिटल रिकॉर्ड में सुरक्षित रहती हैं।' },
      ]
    },
    {
      category: 'आयुष चिकित्सकों एवं वैद्यों के लिए',
      color: 'border-amber-200 bg-amber-50/50',
      badge: 'नैदानिक गुणवत्ता',
      items: [
        { title: 'मानकीकृत क्लिनिकल केस शीट', desc: 'मुख्य लक्षण, बीमारी का इतिहास और पुरानी दवाइयां व्यवस्थित रूप में स्क्रीन पर उपलब्ध।' },
        { title: 'दशविध परीक्षा व प्रकृति स्कोर पहले से तैयार', desc: 'प्रकृति, विकृति, अग्नि और कोष्ठ का पूर्ण विश्लेषण मरीज के कमरे में आने से पहले उपलब्ध।' },
        { title: 'परामर्श में अधिक समय', desc: 'कंप्यूटर टाइपिंग के बजाय नाड़ी परीक्षा, शारीरिक जांच और उचित परामर्श पर पूरा ध्यान दें।' },
        { title: 'आयुष ई-पर्चा व शास्त्रीय औषधियां', desc: '400+ शास्त्रीय औषधियां और मानकीकृत मात्रा व अनुपान सीधे एक क्लिक में उपलब्ध।' },
      ]
    },
    {
      category: 'अस्पतालों एवं प्रशासकों के लिए',
      color: 'border-emerald-200 bg-emerald-50/50',
      badge: 'प्रशासनिक दक्षता',
      items: [
        { title: 'ओपीडी में 3.5 गुना तेज कार्यप्रवाह', desc: 'सुबह के समय 1,500+ मरीजों की भारी भीड़ को बिना अव्यवस्था के नियंत्रित करें।' },
        { title: 'कागजरहित डिजिटल संचालन', desc: 'पर्चों के खोने का कोई डर नहीं, पूर्ण ऑडिट ट्रेल और फार्मेसी व जांच विभाग से सीधा जुड़ाव।' },
        { title: 'लाइव फुटफॉल व वेटिंग एनालिटिक्स', desc: 'डैशबोर्ड पर हर विभाग की कतार, डॉक्टर की उपलब्धता और प्रतीक्षा समय की वास्तविक स्थिति देखें।' },
        { title: 'अनुसंधान हेतु प्रमाणित डेटा', desc: 'मानकीकृत क्लिनिकल डेटा से आयुर्वेदिक शोध और प्रमाण-आधारित चिकित्सा को नया बल मिलता है।' },
      ]
    }
  ]
};

const USE_CASES = {
  en: [
    {
      title: 'Chronic Lifestyle & Metabolic Disorders',
      tag: 'Diabetes (Prameha) & Hypertension',
      icon: Activity,
      desc: 'Patients with long-standing diabetes or hypertension track their dietary patterns, blood sugar history, and Ahara-Vihara habits through guided questions.',
      benefit: 'Doctors instantly see a 6-month symptom and lifestyle correlation graph.'
    },
    {
      title: 'Joint, Spine & Musculoskeletal Care',
      tag: 'Sandhivata (Arthritis) & Sciatica',
      icon: ClipboardList,
      desc: 'Touch-based anatomical joint selector lets patients pinpoint pain areas (knees, lumbar spine, neck), severity scale (1-10), and morning stiffness duration.',
      benefit: 'Eliminates diagnostic ambiguity and pre-identifies Vata-dominant joint conditions.'
    },
    {
      title: 'Digestive & Gut Health Disorders',
      tag: 'Agni Mandya, IBS (Grahani) & Acidity',
      icon: Flower2,
      desc: 'Detailed assessment of appetite, bowel frequency (Koshtha), bloating, and acid reflux patterns structured according to Ayurvedic gastroenterology.',
      benefit: 'Pre-calculates Deepana-Pachana requirements before doctor consultation.'
    },
    {
      title: 'Geriatric & Rural Patient Assistance',
      tag: 'Voice-Driven Regional Interface',
      icon: MessageSquare,
      desc: 'Elderly or illiterate patients speak naturally in conversational Hindi. The assistant guides them step-by-step without requiring touch typing.',
      benefit: '100% accessible healthcare intake for rural and elderly citizens.'
    },
    {
      title: 'Panchakarma & Detox Planning',
      tag: 'Pre-Procedure Shodhana Assessment',
      icon: Sparkles,
      desc: 'Calculates Bala (physical strength), Agni status, and seasonal adaptability to evaluate fitness for Vamana, Virechana, or Basti procedures.',
      benefit: 'Saves 15+ minutes of pre-Panchakarma questionnaire time.'
    },
    {
      title: 'Emergency & Red-Flag Clinical Triage',
      tag: 'Immediate Staff Alerting',
      icon: Zap,
      desc: 'Instantly identifies critical signs like chest pain radiating to left arm, acute breathlessness, or sudden neurological deficits during intake.',
      benefit: 'Bypasses normal OPD queue and triggers immediate triage alert to casualty team.'
    }
  ],
  hi: [
    {
      title: 'दीर्घकालिक जीवनशैली व चयापचय रोग',
      tag: 'प्रमेह (मधुमेह) व उच्च रक्तचाप',
      icon: Activity,
      desc: 'मधुमेह और बीपी के पुराने मरीज अपने खान-पान, ब्लड शुगर रिकॉर्ड और आहार-विहार का विवरण सरल प्रश्नों द्वारा दर्ज करते हैं।',
      benefit: 'डॉक्टर को पिछले 6 महीनों के लक्षणों और जीवनशैली का स्पष्ट ग्राफ मिलता है।'
    },
    {
      title: 'जोड़, रीढ़ व वात विकार',
      tag: 'संधिवात (गठिया), गृध्रसी व कमर दर्द',
      icon: ClipboardList,
      desc: 'स्क्रीन पर शरीर के जोड़ों को छूकर दर्द का स्थान (घुटना, कमर, गर्दन), दर्द का स्तर (1-10) और सुबह की जकड़न का समय दर्ज करें।',
      benefit: 'वात प्रधान विकारों का सटीक पूर्व-आकलन और सही विभाग में मरीज का प्रेषण।'
    },
    {
      title: 'पाचन तंत्र व उदर रोग',
      tag: 'अग्निमांद्य, ग्रहणी (IBS) व अम्लपित्त',
      icon: Flower2,
      desc: 'भूख, मल त्याग की प्रकृति (कोष्ठ), पेट फूलना और एसिडिटी के लक्षणों का आयुर्वेदिक सिद्धांतों के अनुसार विस्तृत वर्गीकरण।',
      benefit: 'दीपन-पाचन और औषध चयन का निर्णय डॉक्टर के लिए अति सुगम।'
    },
    {
      title: 'वरिष्ठ नागरिकों व ग्रामीण मरीजों की सहायता',
      tag: 'बोलकर बात करने वाली वॉइस तकनीक',
      icon: MessageSquare,
      desc: 'बुजुर्ग मरीज अपनी सामान्य बोलचाल की हिंदी में बोलकर अपनी बात रखते हैं। सहायक आवाज में ही उत्तर देकर प्रक्रिया पूर्ण कराता है।',
      benefit: 'सभी नागरिकों के लिए बिना किसी तकनीक ज्ञान के 100% सुलभ व्यवस्था।'
    },
    {
      title: 'पंचकर्म एवं शोधन पूर्व मूल्यांकन',
      tag: 'शोधन योग्यता व बल परीक्षा',
      icon: Sparkles,
      desc: 'मरीज के शारीरिक बल, अग्नि की स्थिति और ऋतु के अनुसार वमन, विरेचन या बस्ति चिकित्सा की योग्यता का त्वरित परीक्षण।',
      benefit: 'पंचकर्म से पहले विस्तृत प्रश्नावली में लगने वाले 15 मिनट की बचत।'
    },
    {
      title: 'आपातकालीन लक्षण व त्वरित अलर्ट',
      tag: 'रेड-फ्लैग तुरंत सूचना प्रणाली',
      icon: Zap,
      desc: 'सीने में तेज दर्द, सांस लेने में अत्यधिक कठिनाई या स्ट्रोक जैसे गंभीर लक्षणों की पहचान कर तुरंत स्टाफ को अलर्ट भेजता है।',
      benefit: 'मरीज को कतार में इंतजार कराए बिना सीधे इमरजेंसी वार्ड भेजा जाता है।'
    }
  ]
};

const REVIEWS_DATA = [
  {
    name: 'Vaidya Dr. Rajesh Sharma',
    role: 'Senior Ayurvedic Physician, Kayachikitsa OPD',
    hospital: 'Government Ayush Hospital',
    avatar: '👨‍⚕️',
    rating: 5,
    quote: {
      en: "MediKiosk has completely transformed our morning OPD. When a patient enters my room, their complete Dashavidha pariksha, chief complaint timeline, and Prakriti dosha chart are already on my monitor. I now spend my time on Nadi Pariksha and Chikitsa rather than entering basic data.",
      hi: "मेडीकियोस्क ने हमारे ओपीडी के कामकाज को पूरी तरह बदल दिया है। जब मरीज कमरे में आता है, तो उसकी पूरी दशविध परीक्षा और प्रकृति विश्लेषण मेरे कंप्यूटर पर पहले से होता है। मैं अपना सारा समय नाड़ी परीक्षा और सटीक चिकित्सा में दे पाता हूँ।"
    }
  },
  {
    name: 'Dr. Ananya Verma',
    role: 'Medical Superintendent & HOD',
    hospital: 'All India Institute of Ayurveda (AIIA)',
    avatar: '👩‍⚕️',
    rating: 5,
    quote: {
      en: "Handling 2,000+ daily OPD footfall was our biggest operational challenge. With MediKiosk, our average waiting time dropped from 45 minutes to under 8 minutes. Patients find the voice check-in extraordinarily intuitive.",
      hi: "प्रतिदिन 2,000 से अधिक मरीजों की ओपीडी संभालना हमारी सबसे बड़ी चुनौती थी। मेडीकियोस्क से औसत प्रतीक्षा समय 45 मिनट से घटकर 8 मिनट रह गया है। मरीज बोलकर अपनी बात रखने की सुविधा को बहुत पसंद कर रहे हैं।"
    }
  },
  {
    name: 'Rameshwar Prasad (Age 64)',
    role: 'Chronic Knee Pain (Sandhivata) Patient',
    hospital: 'Verified Check-In Slip #MD-8821',
    avatar: '👴',
    rating: 5,
    quote: {
      en: "I am not comfortable using smartphones, but the kiosk spoke to me in Hindi. I simply spoke into the microphone about my knee swelling and scanned my old prescription. The printed slip even gave me dietary guidelines for Vata dosha!",
      hi: "मुझे स्मार्टफोन चलाना नहीं आता, लेकिन कियोस्क ने मुझसे हिंदी में बात की। मैंने सिर्फ माइक में अपने घुटने के दर्द की बात बताई और पुराना पर्चा स्कैन किया। निकली हुई पर्ची में मेरे वात दोष के अनुसार खान-पान की सलाह भी थी!"
    }
  },
  {
    name: 'Priya Sundaram (Age 34)',
    role: 'Digestive & Lifestyle Care Patient',
    hospital: 'Verified Check-In Slip #MD-9104',
    avatar: '👩',
    rating: 5,
    quote: {
      en: "The Prakriti assessment asked very thoughtful questions about digestion, sleep, and body constitution. By the time I sat with the doctor, she already understood my Pitta aggravation and had my previous blood reports lined up.",
      hi: "प्रकृति परीक्षा में पाचन, नींद और शरीर की प्रकृति के बारे में बहुत सटीक प्रश्न पूछे गए। जब मैं डॉक्टर के पास गई, तो उन्हें पहले से पता था कि मेरा पित्त बढ़ा हुआ है और मेरी पुरानी रिपोर्टें भी उनके सामने थीं।"
    }
  }
];

const FAQS = {
  en: [
    {
      q: 'What is the New Ayush MediKiosk platform?',
      a: 'OmniGate MediKiosk is a smart self-service clinical intake kiosk deployed at Ayush hospitals and OPD centers. It enables patients to check in, speak their symptoms in Hindi or English, complete an Ayurvedic Prakriti (Vata/Pitta/Kapha) assessment, and digitize previous prescriptions before meeting the physician.'
    },
    {
      q: 'Do patients need a smartphone or app to use the kiosk?',
      a: 'No smartphone or app is required. The kiosk is an all-in-one touch and voice terminal installed in the hospital reception area. Patients simply scan their ABHA QR, Aadhaar, or enter their phone number on the large touchscreen.'
    },
    {
      q: 'How does the kiosk help the consulting Ayush doctor?',
      a: 'Doctors receive a structured, standardized clinical case sheet containing chief complaints, history of present illness (HPI), pre-calculated Dashavidha Pariksha scores, digitized old prescriptions, and red-flag alerts directly on their computer screen before the patient enters.'
    },
    {
      q: 'Can non-literate or elderly patients easily use it?',
      a: 'Yes. MediKiosk features high-fidelity voice interaction in Hindi and English. Patients can simply speak into the microphone to explain their health concerns without needing to type.'
    },
    {
      q: 'How accurate is the Prakriti Dosha evaluation?',
      a: 'The Prakriti module is built on classical Ayurvedic treatises (Charaka Samhita, Sushruta Samhita) assessing Sharirika (physical) and Manasika (mental) traits, Agni (digestion), Koshtha (bowel habits), and Bala (vital strength).'
    },
    {
      q: 'Is my personal health data kept safe and confidential?',
      a: 'Yes. All clinical records and scanned documents are protected by strict end-to-end encryption and role-based access control. Only authorized consulting physicians can access your medical records.'
    }
  ],
  hi: [
    {
      q: 'नया आयुष मेडीकियोस्क प्लेटफॉर्म क्या है?',
      a: 'ओमनीगेट मेडीकियोस्क एक स्मार्ट क्लिनिकल इनटेक कियोस्क है जो आयुष अस्पतालों और ओपीडी में स्थापित किया गया है। यह मरीजों को मातृभाषा में बोलकर लक्षण दर्ज करने, आयुर्वेदिक प्रकृति (वात/पित्त/कफ) का मूल्यांकन करने और पुराने पर्चे स्कैन करने की सुविधा देता है।'
    },
    {
      q: 'क्या कियोस्क का उपयोग करने के लिए स्मार्टफोन की आवश्यकता है?',
      a: 'नहीं, किसी स्मार्टफोन या ऐप की जरूरत नहीं है। अस्पताल के प्रवेश द्वार पर लगे कियोस्क की बड़ी टचस्क्रीन और माइक के माध्यम से कोई भी व्यक्ति सरलता से अपनी जानकारी दर्ज कर सकता है।'
    },
    {
      q: 'यह कियोस्क डॉक्टर और वैद्य की कैसे मदद करता है?',
      a: 'डॉक्टर को मरीज के कमरे में प्रवेश करने से पहले ही उनकी स्क्रीन पर व्यवस्थित केस शीट, दशविध परीक्षा स्कोर, पुरानी दवाइयों का टाइमलाइन और आपातकालीन चेतावनी मिल जाती है, जिससे टाइपिंग का समय बचता है।'
    },
    {
      q: 'क्या बुजुर्ग या कम पढ़े-लिखे मरीज इसका उपयोग कर सकते हैं?',
      a: 'हाँ, बिल्कुल। कियोस्क में हिंदी और अंग्रेजी में वॉइस बातचीत की सुविधा है। मरीज केवल माइक में बोलकर अपनी समस्या बता सकते हैं।'
    },
    {
      q: 'प्रकृति दोष मूल्यांकन कितना सटीक है?',
      a: 'प्रकृति मॉड्यूल चरक और सुश्रुत संहिता के शास्त्रीय सिद्धांतों पर आधारित है, जो शारीरिक गठन, पाचन अग्नि, कोष्ठ और नींद की आदतों का वैज्ञानिक विश्लेषण करता है।'
    },
    {
      q: 'क्या मेरा स्वास्थ्य डेटा पूरी तरह सुरक्षित है?',
      a: 'हाँ, सभी डेटा और स्कैन किए गए पर्चे 256-बिट एन्क्रिप्शन और सुरक्षित प्रोटोकॉल से सुरक्षित रहते हैं। केवल आपके परामर्शदाता डॉक्टर ही इसे देख सकते हैं।'
    }
  ]
};

export default function Welcome() {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('app_lang') || 'en');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handleMQ = (e) => setReduceMotion(e.matches);
    mq.addEventListener('change', handleMQ);
    return () => mq.removeEventListener('change', handleMQ);
  }, []);

  const handleLangChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('app_lang', lang);
  };

  const currentJourney = JOURNEY[currentLang] || JOURNEY.en;
  const currentStats = LIVE_STATS[currentLang] || LIVE_STATS.en;
  const currentBenefits = BENEFITS_DATA[currentLang] || BENEFITS_DATA.en;
  const currentUseCases = USE_CASES[currentLang] || USE_CASES.en;
  const currentFaqs = FAQS[currentLang] || FAQS.en;
  const isHi = currentLang === 'hi';

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-[#16213A] font-sans antialiased selection:bg-[#0B4C8C] selection:text-white">
      
      {/* 1. DEDICATED PROMOTIONAL NAVBAR */}
      <WelcomeNavbar currentLang={currentLang} onLangChange={handleLangChange} />

      {/* ============================ HERO SECTION ============================ */}
      <section id="overview" className="relative overflow-hidden border-b border-[#DCE3EC] bg-gradient-to-b from-[#F5F9FF] via-white to-[#F5F9FF]">
        {/* Subtle Decorative Grid & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#0B4C8C_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24">
          <motion.div
            className="space-y-8 text-center flex flex-col items-center"
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {/* Prominent Internet-Inspired Handstroke Calligraphy Branding */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}
              className="w-full flex justify-center -mb-2 sm:-mb-3"
            >
              <HandstrokeMediKiosk className="max-w-xl sm:max-w-2xl" currentLang={currentLang} />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#16213A] leading-[1.14]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {isHi ? (
                <>
                  अपनी स्वास्थ्य समस्या बताएं, <br />
                  <span className="text-[#0B4C8C]">डॉक्टर कक्ष में जाने से पहले।</span>
                </>
              ) : (
                <>
                  Tell your clinical story once, <br />
                  <span className="text-[#0B4C8C]">before you sit with the doctor.</span>
                </>
              )}
            </motion.h1>

            {/* Body Sub-headline */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
              className="text-base sm:text-lg md:text-xl text-[#4B586E] leading-relaxed max-w-3xl mx-auto font-normal"
            >
              {isHi
                ? 'मेडीकियोस्क आपकी अपनी भाषा में बातचीत करता है, वात-पित्त-कफ प्रकृति का विश्लेषण करता है और पुराने पर्चों को स्कैन कर डॉक्टर के लिए संपूर्ण क्लिनिकल रिपोर्ट तैयार कर देता है — जिससे 2 मिनट की ओपीडी में पूरा ध्यान आपके इलाज पर रहे।'
                : 'MediKiosk listens in Hindi & English, analyzes your unique Vata-Pitta-Kapha Prakriti, and converts handwritten prescriptions into structured digital timelines — turning rushed 2-minute OPD visits into deep, focused clinical consultations.'}
            </motion.p>

            {/* Primary CTAs */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4"
            >
              <Button
                onClick={() => navigate('/kiosk')}
                className="h-13 rounded-2xl bg-gradient-to-r from-[#0B4C8C] to-[#16569B] hover:from-[#08355F] hover:to-[#0B4C8C] px-8 text-sm sm:text-base font-bold text-white shadow-lg shadow-blue-900/20 flex items-center gap-2.5 transition-all hover:scale-[1.02]"
              >
                <Monitor className="h-5 w-5" />
                <span>{isHi ? 'मरीज कियोस्क चेक-इन शुरू करें' : 'Begin MediKiosk Check-In'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => navigate('/ayush-opd')}
                variant="outline"
                className="h-13 rounded-2xl border-2 border-[#BFD3E8] bg-white hover:bg-[#F1F6FC] px-7 text-sm sm:text-base font-bold text-[#0B4C8C] flex items-center gap-2 transition-all"
              >
                <Stethoscope className="h-5 w-5 text-[#E2861E]" />
                <span>{isHi ? 'डॉक्टर ओपीडी कमरा देखें' : 'View Physician OPD Room'}</span>
              </Button>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ===================== LIVE IMPACT & DATA METRICS ===================== */}
      <section id="impact-data" className="border-b border-[#DCE3EC] bg-[#0B2A4A] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
              {isHi 
                ? 'सरकारी ओपीडी में लाखों मरीजों का विश्वास और समय की बचत' 
                : 'Over 140,000 Patients Checked-In Across Ayush OPDs'}
            </h2>
            <p className="text-sm sm:text-base text-[#C9D6E6]">
              {isHi
                ? 'कियोस्क की आधुनिक तकनीक से सरकारी अस्पतालों की लंबी कतारों में अभूतपूर्व सुधार हुआ है।'
                : 'Deploying touch & voice kiosks has fundamentally transformed outpatient queue flow and clinical case readiness.'}
            </p>
          </div>

          {/* Key Counter Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6">
            {currentStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all text-center flex flex-col items-center justify-center space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F2941E] group-hover:scale-110 transition-transform">
                    <Icon size={20} />
                  </div>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                    {stat.value}
                  </p>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-blue-100 leading-snug">{stat.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Before vs After Impact Comparison Banner */}
          <div className="bg-white text-[#16213A] rounded-3xl p-6 sm:p-8 border border-[#BFD3E8] shadow-xl">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-center">
              
              {/* Traditional Flow */}
              <div className="space-y-4 p-5 rounded-2xl bg-rose-50/70 border border-rose-200">
                <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>{isHi ? 'पारंपरिक ओपीडी व्यवस्था (पहले)' : 'Conventional OPD System (Before)'}</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#4B586E] font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>{isHi ? '45 से 60 मिनट की लंबी कतार में खड़े रहना' : '45–60 mins waiting in manual registration queues'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>{isHi ? 'डॉक्टर के पास केवल 2 मिनट — जिसमें आधा समय टाइपिंग में नष्ट' : 'Physician spends 60% of visit on manual data entry'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>{isHi ? 'पुराने पर्चे खोने से बीमारी का इतिहास छूट जाता था' : 'Lost paper prescriptions result in fragmented history'}</span>
                  </li>
                </ul>
              </div>

              {/* MediKiosk Flow */}
              <div className="space-y-4 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>{isHi ? 'मेडीकियोस्क डिजिटल व्यवस्था (अब)' : 'With MediKiosk Platform (Now)'}</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#16213A] font-semibold">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{isHi ? 'मात्र 2 मिनट में टच या आवाज द्वारा स्वयं चेक-इन' : 'Under 2-minute self check-in via touch or voice'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{isHi ? 'डॉक्टर को पूरी केस शीट व प्रकृति चार्ट पहले से तैयार मिलता है' : 'Full Dashavidha Pariksha ready on doctor screen'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{isHi ? 'पुराने पर्चे तुरंत स्कैन होकर समयरेखा में जुड़ जाते हैं' : 'Past prescriptions digitized into instant chronological timeline'}</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#16213A] tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            {isHi ? '5 आसान चरण, डॉक्टर के बुलाने से पहले सब कुछ तैयार' : 'Five Swift Steps, Done Before Your Name is Called'}
          </h2>
          <p className="text-sm sm:text-base text-[#5B677E]">
            {isHi
              ? 'कियोस्क पर सब कुछ परामर्श से पहले पूरा हो जाता है — जिससे डॉक्टर कक्ष में बातचीत सिर्फ आपके स्वास्थ्य व उपचार पर केंद्रित रहे।'
              : 'Everything happens at the kiosk ahead of the consultation, ensuring meaningful dialogue between patient and doctor.'}
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6 relative">
          {currentJourney.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.id} 
                className="bg-white border-2 border-[#DCE3EC] rounded-2xl p-5 hover:border-[#0B4C8C] hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0B4C8C] to-[#1E6BB8] text-white flex items-center justify-center shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-black text-[#E2861E] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      STEP {step.stepNum}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#16213A] leading-snug mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#5B677E] leading-relaxed">
                    {step.body}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F1F6FC] flex items-center text-[11px] font-bold text-[#0B4C8C]">
                  <span>{isHi ? 'स्वचालित व सुरक्षित' : 'Automated & Secure'}</span>
                  <ChevronRight size={13} className="ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================= BENEFITS BREAKDOWN ========================= */}
      <section id="benefits" className="border-t border-[#DCE3EC] bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#16213A] tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
              {isHi 
                ? 'मरीजों, डॉक्टरों एवं अस्पताल प्रशासन तीनों के लिए उपयोगी' 
                : 'Engineered for Patients, Doctors, and Hospital Leaders'}
            </h2>
            <p className="text-sm sm:text-base text-[#5B677E]">
              {isHi
                ? 'पारंपरिक आयुर्वेद के उच्च मानकों को बनाए रखते हुए आधुनिक अस्पताल प्रबंधन को नई गति।'
                : 'Designed to solve the real-world operational and clinical pain points of government and private Ayush hospitals.'}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {currentBenefits.map((col, idx) => (
              <div 
                key={idx}
                className={`rounded-3xl border-2 p-6 sm:p-7 space-y-6 shadow-xs ${col.color}`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-black/10">
                  <h3 className="text-lg font-black text-[#16213A]" style={{ fontFamily: "'Fraunces', serif" }}>
                    {col.category}
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white text-[#16213A] shadow-2xs">
                    {col.badge}
                  </span>
                </div>

                <div className="space-y-4">
                  {col.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="bg-white/90 rounded-2xl p-4 border border-black/5 shadow-2xs space-y-1">
                      <h4 className="text-sm font-bold text-[#16213A] flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-[#0B4C8C] shrink-0" />
                        <span>{item.title}</span>
                      </h4>
                      <p className="text-xs text-[#5B677E] leading-relaxed pl-6">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================= CLINICAL USE CASES ========================= */}
      <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#16213A] tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            {isHi ? 'हर रोग व विभाग के लिए विशेष रूप से अनुकूलित' : 'Tailored for Every Ayush Specialty & Disease Pattern'}
          </h2>
          <p className="text-sm sm:text-base text-[#5B677E]">
            {isHi
              ? 'संधिवात से लेकर प्रमेह, अम्लपित्त और पंचकर्म तक — कियोस्क हर बीमारी के अनुसार विशिष्ट प्रश्न पूछता है।'
              : 'From chronic metabolic disorders to musculoskeletal ailments and detox therapies.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUseCases.map((uc, idx) => {
            const Icon = uc.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-[#DCE3EC] p-6 hover:border-[#0B4C8C] hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#F1F6FC] text-[#0B4C8C] flex items-center justify-center font-bold">
                      <Icon size={20} />
                    </div>
                    <span className="text-[11px] font-bold text-[#E2861E] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {uc.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#16213A] leading-snug" style={{ fontFamily: "'Fraunces', serif" }}>
                    {uc.title}
                  </h3>
                  <p className="text-xs text-[#5B677E] leading-relaxed">
                    {uc.desc}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F9FF] rounded-xl border border-[#BFD3E8]/60 text-xs">
                  <span className="font-bold text-[#0B4C8C] block mb-0.5">
                    {isHi ? 'नैदानिक लाभ:' : 'Clinical Value:'}
                  </span>
                  <span className="text-[#4B586E]">{uc.benefit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================= REVIEWS & TESTIMONIALS ======================= */}
      <section id="reviews" className="border-y border-[#DCE3EC] bg-gradient-to-b from-[#F5F9FF] to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#16213A] tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
              {isHi 
                ? 'चिकित्सकों और मरीजों द्वारा सराहा गया डिजिटल अनुभव' 
                : 'Trusted by Senior Vaidyas, Hospital Heads, and Patients'}
            </h2>
            <p className="text-sm sm:text-base text-[#5B677E]">
              {isHi
                ? 'जानिए कैसे मेडीकियोस्क ने दैनिक ओपीडी परामर्श और मरीज संतुष्टि को एक नया रूप दिया।'
                : 'Real experiences from clinical practitioners and patients across Ayush departments.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {REVIEWS_DATA.map((rev, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl border-2 border-[#DCE3EC] p-6 sm:p-7 shadow-sm hover:border-[#0B4C8C] hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{rev.avatar}</span>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-[#16213A]">{rev.name}</h4>
                        <p className="text-xs font-semibold text-[#0B4C8C]">{rev.role}</p>
                        <p className="text-[11px] text-[#6F8098]">{rev.hospital}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={15} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#37455A] leading-relaxed italic">
                    "{isHi ? rev.quote.hi : rev.quote.en}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F1F6FC] text-[11px] text-[#6F8098] font-semibold">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 size={13} />
                    {isHi ? 'प्रमाणित उपयोगकर्ता' : 'Verified Clinical Experience'}
                  </span>
                  <span>5.0 / 5.0 Rating</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================================ FAQ ================================ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#16213A] tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            {isHi ? 'कियोस्क के बारे में अक्सर पूछे जाने वाले प्रश्न' : 'Everything You Need to Know'}
          </h2>
        </div>

        <div className="divide-y divide-[#DCE3EC] border-y border-[#DCE3EC]">
          {currentFaqs.map((item, i) => {
            const open = activeFaq === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setActiveFaq(open ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B4C8C]"
                >
                  <span className="text-sm sm:text-base text-[#16213A]">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#E2861E] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-xs sm:text-sm leading-relaxed text-[#5B677E]">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================ FINAL PROMOTIONAL CTA ============================ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        
        {/* Final Promotional CTA Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B2A4A] via-[#0B4C8C] to-[#0B2A4A] text-white p-8 sm:p-12 shadow-xl">
          
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-[#E2861E]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-[#E2861E] text-white text-xs font-black uppercase px-3 py-1 rounded-full">
                <Sparkles size={12} />
                {isHi ? 'डिजिटल आयुष का भविष्य' : 'Future of Ayush Healthcare'}
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                {isHi 
                  ? 'अपने अस्पताल या ओपीडी में स्मार्ट कियोस्क का अनुभव करें' 
                  : 'Experience the Smart Ayush MediKiosk In Action'}
              </h3>
              <p className="text-sm sm:text-base text-blue-100">
                {isHi
                  ? 'मरीज स्वयं चेक-इन करें या डॉक्टर ओपीडी पोर्टल का लाइव डेमो देखें।'
                  : 'Step up as a patient for intake or access the physician consultation room.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Button
                onClick={() => navigate('/kiosk')}
                className="h-14 rounded-2xl bg-[#E2861E] hover:bg-[#C2410C] text-white px-8 text-base font-extrabold shadow-xl shadow-orange-950/30 flex items-center gap-2.5 transition-all hover:scale-105"
              >
                <Monitor className="h-5 w-5" />
                <span>{isHi ? 'कियोस्क चेक-इन शुरू करें' : 'Launch MediKiosk'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => navigate('/ayush-opd')}
                variant="outline"
                className="h-14 rounded-2xl border border-white/30 bg-white/10 hover:bg-white/20 text-white px-7 text-base font-bold flex items-center gap-2"
              >
                <Stethoscope className="h-5 w-5 text-amber-300" />
                <span>{isHi ? 'डॉक्टर ओपीडी पोर्टल' : 'Doctor OPD Portal'}</span>
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. DEDICATED PROMOTIONAL FOOTER */}
      <WelcomeFooter currentLang={currentLang} />

    </div>
  );
}
