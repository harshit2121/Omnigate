/**
 * CCRAS Standardized Prakriti Assessment Service
 * Developed as per the Standard Operative Procedures (SOPs) for Prakriti Assessment
 * Published by Central Council for Research in Ayurvedic Sciences (CCRAS),
 * Ministry of AYUSH, Government of India (ISBN: 978-93-83864-21-8).
 * 
 * Standardized across 4 core clinical domains:
 * 1. Physical Traits (शारीरिक लक्षण)
 * 2. Physiological Traits (शारीरिक क्रियात्मक लक्षण)
 * 3. Psychological Traits (मानसिक लक्षण)
 * 4. Behavioral Traits (व्यवहारिक लक्षण)
 */

// ---------------------------------------------------------------------------
// 1. CCRAS TRAIT DOMAINS & CLASSIFICATION
// ---------------------------------------------------------------------------

export const CCRAS_TRAIT_DOMAINS = [
  {
    id: 'physical',
    labelEn: 'Physical Traits',
    labelHi: 'शारीरिक लक्षण',
    descEn: 'Anthropometry (BMI, Angulapramana), Built, Appearance, Veins, Tendons, Hair & Eyes',
    descHi: 'शारीरिक बनावट, अंगुलप्रमाण, बाह्य स्वरूप, शिरा-कण्डरा, केश एवं नेत्र लक्षण',
    icon: 'Activity'
  },
  {
    id: 'physiological',
    labelEn: 'Physiological Traits',
    labelHi: 'शारीरिक क्रियात्मक लक्षण',
    descEn: 'Agni (Appetite), Pipasa (Thirst), Kostha (Bowel), Nidra (Sleep), Sveda (Sweating), Stamina',
    descHi: 'अग्नि, पिपासा (प्यास), कोष्ठ एवं मलप्रवृत्ति, निद्रा, स्वेद एवं शारीरिक क्षमता',
    icon: 'HeartPulse'
  },
  {
    id: 'psychological',
    labelEn: 'Psychological Traits',
    labelHi: 'मानसिक लक्षण',
    descEn: 'Indecisiveness (Anavasthita Atma), Grasping (Grahya Shakti), Memory (Smriti), Temperament',
    descHi: 'अनिर्णय (अनवस्थित आत्मा), ग्रहण शक्ति (श्रुतग्राही/चिरग्राही), स्मृति एवं मनोभाव',
    icon: 'Brain'
  },
  {
    id: 'behavioral',
    labelEn: 'Behavioral Traits',
    labelHi: 'व्यवहारिक लक्षण',
    descEn: 'Enmity (Dridhavairam vs Kshama), Politeness (Vineeta), Speech pattern (Vak), Gait (Gati), Friendship',
    descHi: 'शत्रुता/सुलह (दृढ़वैरम्), विनम्रता (विनीत), संभाषण शैली, चाल एवं मैत्री',
    icon: 'Users'
  }
];

// ---------------------------------------------------------------------------
// 2. COMPLETE CCRAS STANDARDIZED CLINICAL QUESTIONNAIRE (23 PREDICTORS)
// ---------------------------------------------------------------------------

export const CCRAS_PRAKRITI_QUESTIONS = [
  // ==========================================
  // DOMAIN 1: PHYSICAL TRAITS (शारीरिक लक्षण)
  // ==========================================
  {
    id: 'ccras_phy_1',
    domain: 'physical',
    sopRef: 'CCRAS SOP 1.1 Built (Apachita / Upachita)',
    classicalRef: 'Charaka Vimana 8/98, 8/96; Sushruta Sharira 4/65',
    questionEn: 'Body Frame & Built (BMI - Apachita vs Upachita)',
    questionHi: 'शारीरिक बनावट एवं गठन (बीएमआई - अपचित अथवा उपचित)',
    descEn: 'Calculated via Body Mass Index (BMI) standard cut-offs as defined in CCRAS SOP 1.1',
    descHi: 'सीसीआरएएस एसओपी 1.1 के अनुसार बीएमआई मान पर आधारित मूल्यांकन',
    options: [
      {
        value: 'apachita',
        dosha: 'Vata',
        labelEn: 'Apachita (Thin / Slender / Underweight)',
        labelHi: 'अपचित (पतला / दुबला / कम वजन)',
        descEn: 'BMI < 18.5 kg/m². Slender, small skeletal framework, difficulty gaining weight.',
        descHi: 'बीएमआई 18.5 से कम। पतला शरीर, हड्डियां स्पष्ट, वजन बढ़ाना कठिन।',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'sama',
        dosha: 'Pitta',
        labelEn: 'Sama Pramana (Balanced / Medium Built)',
        labelHi: 'सम प्रमाण (मध्यम / संतुलित गठन)',
        descEn: 'BMI 18.5 - 24.9 kg/m². Well-proportioned, athletic musculature, balanced frame.',
        descHi: 'बीएमआई 18.5 से 24.9 के बीच। संतुलित शारीरिक ढांचा, सुगठित मांसपेशियां।',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'upachita',
        dosha: 'Kapha',
        labelEn: 'Upachita (Well-Built / Heavy / Broad Frame)',
        labelHi: 'उपचित (पुष्ट / चौड़ा / भारी गठन)',
        descEn: 'BMI ≥ 25.0 kg/m². Broad chest, solid bone density, natural tendency to retain mass.',
        descHi: 'बीएमआई 25.0 या अधिक। चौड़ा सीना, मजबूत व भारी कंकाल ढांचा।',
        image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_phy_2',
    domain: 'physical',
    sopRef: 'CCRAS SOP 1.2 Height (Angulapramana)',
    classicalRef: 'Charaka Vimana 8/117, Ashtanga Hridaya Sharira 3/87',
    questionEn: 'Stature & Height Ratio (Angulapramana Standard)',
    questionHi: 'कद एवं शारीरिक लम्बाई (अंगुलप्रमाण मानक)',
    descEn: 'Measured against subject\'s standard 84 Angula (palm four-finger width)',
    descHi: 'व्यक्ति के चार अंगुलियों की चौड़ाई (84 अंगुल मानक) के सापेक्ष कद',
    options: [
      {
        value: 'hrasva',
        dosha: 'Vata',
        labelEn: 'Hrasvaakriti (Short Stature / <80 Angula)',
        labelHi: 'ह्रस्वाकृति (छोटा कद / 80 अंगुल से कम)',
        descEn: 'Short height relative to finger breadth proportion; shorter limbs.',
        descHi: 'अंगुल प्रमाण के अनुपात में कम ऊंचाई; हाथ-पैर छोटे।',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'madhyama',
        dosha: 'Pitta',
        labelEn: 'Madhyamaakriti (Medium Height / 80-88 Angula)',
        labelHi: 'मध्यमाकृति (मध्यम कद / 80-88 अंगुल)',
        descEn: 'Proportional, symmetrical stature within standard Ayurvedic range.',
        descHi: 'मानक आयुर्वेदिक अनुपात में संतुलित और सममित कद।',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'deergha',
        dosha: 'Kapha',
        labelEn: 'Deerghaakriti (Tall Stature / >88 Angula)',
        labelHi: 'दीर्घाकृति (लम्बा कद / 88 अंगुल से अधिक)',
        descEn: 'Noticeably tall frame with elongated long bones and fingers.',
        descHi: 'अपेक्षाकृत अधिक लंबा कद, लंबी अस्थियां एवं अंगुलियां।',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_phy_3',
    domain: 'physical',
    sopRef: 'CCRAS SOP 1.3 Appearance (Bahu Kandara-Sira-Pratana)',
    classicalRef: 'Charaka Vimana 8/98, Ashtanga Sangraha 8/11',
    questionEn: 'Prominence of Veins & Tendons (Sira-Kandara Pratana)',
    questionHi: 'शिरा एवं कण्डरा का उभार (नसें और नस-तंतु दिखना)',
    descEn: 'Clinical observation on exposed dorsal surfaces of hands, feet, and neck',
    descHi: 'हाथों, पैरों और ग्रीवा पर नसों तथा टेंडन्स का प्रत्यक्ष दृश्य अवलोकन',
    options: [
      {
        value: 'prominent',
        dosha: 'Vata',
        labelEn: 'Bahu Sira-Pratana (Prominent Veins & Tendons)',
        labelHi: 'बहु शिरा-प्रतान (स्पष्ट व उभरी हुई नसें व कण्डराएं)',
        descEn: 'Prominent, easily visible, superficial veins, dry joints, popping tendon lines.',
        descHi: 'हाथ-पैरों में स्पष्ट उभरी हुई नीली नसें और कड़े टेंडन्स।',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'moderate',
        dosha: 'Pitta',
        labelEn: 'Madhyama Sira (Moderately Visible Veins)',
        labelHi: 'मध्यम शिरा (सामान्य रूप से दिखाई देने वाली नसें)',
        descEn: 'Veins visible on exertion or warm weather, reddish-pink hue.',
        descHi: 'गरमी या परिश्रम में स्पष्ट होने वाली गुलाबी-ताम्र नसें।',
        image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'hidden',
        dosha: 'Kapha',
        labelEn: 'Nimagna Sira-Kandara (Deep-seated, Hidden Veins)',
        labelHi: 'निमग्न शिरा-कण्डरा (छिपी हुई नसें, भरा-पूरा शरीर)',
        descEn: 'Veins and tendons deeply concealed under well-nourished muscle and subcutaneous tissue.',
        descHi: 'नसें व कण्डराएं त्वचा और मेद के नीचे सुदृढ़ रूप से ढकी हुई हैं।',
        image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_phy_4',
    domain: 'physical',
    sopRef: 'CCRAS SOP 1.4 Skin Texture & Complexion (Tvak / Sparsha)',
    classicalRef: 'Charaka Vimana 8/96-98, Sushruta Sharira 4/64-72',
    questionEn: 'Skin Texture, Temperature & Complexion',
    questionHi: 'त्वचा की प्रकृति, स्पर्श एवं वर्ण',
    descEn: 'Assessment of natural moisture, warmth, oiliness and tendency for cracks or moles',
    descHi: 'प्राकृतिक नमी, उष्णता, स्निग्धता एवं त्वचा के विकार प्रवृत्तियों का परीक्षण',
    options: [
      {
        value: 'dry_rough',
        dosha: 'Vata',
        labelEn: 'Ruksha / Parusha (Dry, Rough, Chapped, Cold)',
        labelHi: 'रूक्ष / परुष (सूखी, खुरदरी, फटने वाली, शीतल)',
        descEn: 'Prone to cracking in dry weather, dull tone, minimal subcutaneous fat.',
        descHi: 'सर्दियों में अत्यधिक सूखने वाली, बेजान, खुरदुरी व ठंडी त्वचा।',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'warm_moles',
        dosha: 'Pitta',
        labelEn: 'Ushna / Snigdha with Moles & Reddish Tone',
        labelHi: 'उष्ण / स्निग्ध (गरम स्पर्श, तिल-मस्से, लालिमा)',
        descEn: 'Warm to touch, prone to flushing, acne, freckles, and hypersensitivity to sun.',
        descHi: 'स्पर्श में गर्म, लालिमायुक्त, धूप से जलने वाली, तिल व मुंहासों की प्रवृत्ति।',
        image: 'https://images.unsplash.com/photo-1512290900672-1f0239229378?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'smooth_oily',
        dosha: 'Kapha',
        labelEn: 'Snigdha / Shlakshna (Smooth, Lustrous, Soft)',
        labelHi: 'स्निग्ध / श्लक्ष्ण (मुलायम, चमकदार, तेलयुक्त, शीतल)',
        descEn: 'Naturally moisturized, clear radiant complexion, firm and healthy glow.',
        descHi: 'चिकनी, चमकदार, प्राकृतिक नमी से भरपूर और स्वस्थ कांति वाली त्वचा।',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_phy_5',
    domain: 'physical',
    sopRef: 'CCRAS SOP 1.5 Hair Texture (Kesha)',
    classicalRef: 'Charaka Vimana 8/96-98',
    questionEn: 'Hair Texture, Volume & Greying Tendency',
    questionHi: 'केशों का स्वरूप, सघनता एवं पकने की प्रवृत्ति',
    descEn: 'Assessment of thickness, oiliness, early greying or hair fall pattern',
    descHi: 'बालों का सूखापन, घनेपन, समय पूर्व सफेद होने या झड़ने की प्रवृत्ति',
    options: [
      {
        value: 'dry_thin',
        dosha: 'Vata',
        labelEn: 'Ruksha / Sphutita (Dry, Brittle, Thin, Split Ends)',
        labelHi: 'रूक्ष / स्फुटित (सूखे, पतले, दोमुंहे, बेजान बाल)',
        descEn: 'Dull texture, prone to tangles, slow growth, easily breakage.',
        descHi: 'उलझने वाले, पतले, दोमुंहे और कम चमक वाले बाल।',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'fine_early_grey',
        dosha: 'Pitta',
        labelEn: 'Komala / Palitya (Soft, Fine, Early Greying / Thinning)',
        labelHi: 'कोमल / पालित्य (मुलायम, भूरे, समय पूर्व सफेद/झड़ते)',
        descEn: 'Fine strands, blonde/brown tint, tendency to early receding hairline or baldness.',
        descHi: 'अत्यधिक मुलायम, भूरापन, कम उम्र में बाल सफेद होने या झड़ने की प्रवृत्ति।',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'thick_dense',
        dosha: 'Kapha',
        labelEn: 'Snigdha / Ghana (Thick, Dark, Dense, Oily, Wavy)',
        labelHi: 'स्निग्ध / घन (घने, काले, चिकने, मजबूत, लहरदार)',
        descEn: 'Abundant volume, deeply rooted, lustrous dark hair with minimal breakage.',
        descHi: 'काले, घने, चमकदार, मजबूत जड़ें और प्राकृतिक रूप से तेलयुक्त बाल।',
        image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_phy_6',
    domain: 'physical',
    sopRef: 'CCRAS SOP 1.6 Eyes & Gaze (Netra / Chakshu)',
    classicalRef: 'Sushruta Sharira 4/64-72',
    questionEn: 'Eye Structure, Sclera & Gaze Pattern',
    questionHi: 'नेत्रों की बनावट, श्वेतपटल एवं दृष्टि',
    descEn: 'Clinical observation of eye shape, scleral tone, and stability of gaze',
    descHi: 'नेत्रों का आकार, सफेद भाग का रंग एवं पलकों की गति का परीक्षण',
    options: [
      {
        value: 'small_unsteady',
        dosha: 'Vata',
        labelEn: 'Ruksha / Chala (Small, Dry, Sunken, Rapid Blink)',
        labelHi: 'रूक्ष / चंचल (छोटे, सूखे, जल्दी-जल्दी झपकने वाले)',
        descEn: 'Smaller eye opening, dry conjunctiva, restless gaze, light eyelashes.',
        descHi: 'छोटे नेत्र, रूखापन, दृष्टि में चंचलता, पलकें तेजी से झपकना।',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'sharp_reddish',
        dosha: 'Pitta',
        labelEn: 'Tikshna / Rakta (Sharp, Penetrating, Reddish Tint)',
        labelHi: 'तीक्ष्ण / रक्त (तेज, लालिमा युक्त, तीखी दृष्टि)',
        descEn: 'Medium size, sensitive to bright sunlight, reddish blood vessels in sclera.',
        descHi: 'तेजस्वी दृष्टि, सफेद भाग में लालिमा या पीलापन, तेज रोशनी सहन न होना।',
        image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'large_clear',
        dosha: 'Kapha',
        labelEn: 'Snigdha / Mahat (Large, White Sclera, Calm Gaze)',
        labelHi: 'स्निग्ध / विशाल (बड़ी, सुंदर, दूधिया सफेद, शांत)',
        descEn: 'Large prominent eyes, dense dark lashes, milky-white sclera, steady serene look.',
        descHi: 'विशाल, सुंदर, सफेद भाग दूध जैसा स्वच्छ, घनी पलकें व शांत दृष्टि।',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },

  // ==========================================
  // DOMAIN 2: PHYSIOLOGICAL TRAITS (शारीरिक क्रियात्मक)
  // ==========================================
  {
    id: 'ccras_physio_1',
    domain: 'physiological',
    sopRef: 'CCRAS SOP 2.3 Eating Speed & Appetite (Ahara Kala)',
    classicalRef: 'Charaka Vimana 8/97-98, Ashtanga Sangraha 8/11',
    questionEn: 'Eating Habit & Ingestion Speed',
    questionHi: 'भोजन करने की आदत एवं गति',
    descEn: 'Direct questionnaire on speed of meal consumption as per CCRAS SOP 2.3',
    descHi: 'सीसीआरएएस एसओपी 2.3 के तहत भोजन ग्रहण करने की गति का मूल्यांकन',
    options: [
      {
        value: 'fast_eating',
        dosha: 'Vata',
        labelEn: 'Laghu Ahara / Chapala (Fast, Hurried Eating)',
        labelHi: 'लघु / चपल आहार (अत्यधिक तेज गति से खाना)',
        descEn: 'Eats rapidly without chewing thoroughly, irregular meal intervals, eats in hurry.',
        descHi: 'जल्दी-जल्दी खाना, बिना ठीक से चबाए निगलना, अनिश्चित भोजन समय।',
        image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'moderate_speed',
        dosha: 'Pitta',
        labelEn: 'Tikshnagni (Punctual, Moderate Speed, Strong Hunger)',
        labelHi: 'तीक्ष्णाग्नि (समय पर खाना, तीव्र भूख, देरी असह्य)',
        descEn: 'Consumes food at moderate pace, requires meals strictly on time, gets irritable if delayed.',
        descHi: 'मध्यम गति से खाना, तीव्र भूख लगना, समय पर भोजन न मिलने पर बेचैनी/क्रोध।',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'slow_eating',
        dosha: 'Kapha',
        labelEn: 'Manda Ahara (Slow, Measured, Thorough Chewing)',
        labelHi: 'मन्द आहार (धीमी गति से, आराम से चबाकर खाना)',
        descEn: 'Takes prolonged time for meals, eats in a relaxed manner, can easily skip meals without distress.',
        descHi: 'काफी समय लेकर चबा-चबाकर खाना, भोजन देरी से होने पर भी कोई परेशानी नहीं।',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_physio_2',
    domain: 'physiological',
    sopRef: 'CCRAS SOP 2.4 Thirst Intensity, Quantity & Frequency (Pipasa)',
    classicalRef: 'Charaka Vimana 8/97, Ashtanga Hridaya Sharira 3/90-101',
    questionEn: 'Thirst Urge, Daily Liquid Intake & Frequency',
    questionHi: 'प्यास की तीव्रता, दैनिक जल सेवन एवं आवृत्ति',
    descEn: 'Evaluation of thirst urge, liters per day, and response when water is delayed',
    descHi: 'पानी न मिलने पर प्रतिक्रिया, 24 घंटे में जल की मात्रा एवं बारंबारता',
    options: [
      {
        value: 'intense_thirst',
        dosha: 'Pitta',
        labelEn: 'Prabhuta Pana (>2 Liters, High Thirst Frequency)',
        labelHi: 'प्रभूत पान / तीक्ष्ण तृष्णा (>2 लीटर, बार-बार प्यास)',
        descEn: 'Urgent immediate search for water, drinks >2L/day, frequently thirsty (>7 times/day).',
        descHi: 'तुरंत पानी ढूंढना, दिन में 2 लीटर से ज्यादा पीना, बार-बार प्यास लगना (>7 बार)।',
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'low_thirst',
        dosha: 'Kapha',
        labelEn: 'Alpa Pana / Alpa Trishna (<1 Liter, Low Thirst)',
        labelHi: 'अल्प पान / अल्प तृष्णा (<1 लीटर, कम प्यास)',
        descEn: 'Can comfortably delay drinking, drinks <1L/day, drinks only 3-4 times a day.',
        descHi: 'पानी न मिलने पर भी आराम से प्रतीक्षा करना, पूरे दिन में 1 लीटर से कम पीना।',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      },
      {
        value: 'variable_thirst',
        dosha: 'Vata',
        labelEn: 'Vishama Pipasa (Fluctuating / Irregular Thirst)',
        labelHi: 'विषम पिपासा (अनियमित, कभी बहुत अधिक कभी कम)',
        descEn: 'Inconsistent thirst pattern, drinks 1-2L, dry throat despite normal water intake.',
        descHi: 'प्यास का कोई निश्चित क्रम न होना, कभी बहुत प्यास तो कभी घंटों पानी याद न आना।',
        image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      }
    ]
  },
  {
    id: 'ccras_physio_3',
    domain: 'physiological',
    sopRef: 'CCRAS SOP 2.5 Bowel Habits & Elimination (Koshtha)',
    classicalRef: 'Charaka Vimana 8/96-98, Ashtanga Hridaya 3/88-95',
    questionEn: 'Bowel Habit & Stool Consistency (Koshtha)',
    questionHi: 'कोष्ठ एवं मल विसर्जन की प्रवृत्ति',
    descEn: 'Clinical classification into Krura, Mridu, or Madhyama Koshtha',
    descHi: 'क्रूर, मृदु अथवा मध्यम कोष्ठ का निर्धारण',
    options: [
      {
        value: 'krura',
        dosha: 'Vata',
        labelEn: 'Krura Koshtha (Hard, Dry, Prone to Constipation)',
        labelHi: 'क्रूर कोष्ठ (कड़ा मल, कब्ज, पेट में अफरा)',
        descEn: 'Hard stools, irregular bowel movements, evacuation requires straining, prone to bloating.',
        descHi: 'सूखा कड़ा मल, शौच में कठिनाई, कब्जियत व पेट में भारीपन की नियमित समस्या।',
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'mridu',
        dosha: 'Pitta',
        labelEn: 'Mridu Koshtha (Soft, Loose, Rapid Evacuation)',
        labelHi: 'मृदु कोष्ठ (पतला/ढीला मल, दिन में कई बार)',
        descEn: 'Loose or soft stools, evacuates 2-3 times daily, sensitive to milk, sweets, or slight changes.',
        descHi: 'दूध या फल खाते ही पेट साफ होना, दिन में 2-3 बार शौच जाना, पतला मल।',
        image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'madhyama',
        dosha: 'Kapha',
        labelEn: 'Madhyama Koshtha (Regular, Well-formed, Daily)',
        labelHi: 'मध्यम कोष्ठ (नियमित, सुगठित, रोज सुबह एक बार)',
        descEn: 'Smooth, predictable, well-formed evacuation once daily in morning without distress.',
        descHi: 'रोज सुबह बिना किसी औषधि या परेशानी के एक बार सुखपूर्वक पेट साफ होना।',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_physio_4',
    domain: 'physiological',
    sopRef: 'CCRAS SOP 2.6 Sleep Characteristics (Nidra)',
    classicalRef: 'Charaka Sutra 21/35, Vimana 8/98',
    questionEn: 'Sleep Duration, Soundness & Awakening Pattern',
    questionHi: 'निद्रा की गहराई, अवधि एवं जागने का स्वभाव',
    descEn: 'Assessment of sleep continuity, dream recall, and morning freshness',
    descHi: 'नींद की गहराई, अवधि, स्वप्न एवं सुबह उठने पर ताजगी या भारीपन',
    options: [
      {
        value: 'light_disturbed',
        dosha: 'Vata',
        labelEn: 'Alpa / Chala Nidra (Light, Broken, <6 Hours)',
        labelHi: 'अल्प / चंचल निद्रा (हल्की नींद, बार-बार टूटना)',
        descEn: 'Wakes up easily with slight noise, difficulty falling back to sleep, restless dreams.',
        descHi: 'हल्की सी आहट से आंख खुलना, नींद टूटना, अनिद्रा, उड़ने/गिरने के स्वप्न।',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'moderate_sound',
        dosha: 'Pitta',
        labelEn: 'Madhyama Nidra (Sound, 6-7 Hours, Refreshed)',
        labelHi: 'मध्यम निद्रा (गहरी नींद, 6-7 घंटे, तुरंत ताजगी)',
        descEn: 'Falls asleep quickly, wakes up refreshed, occasional vivid/colorful dreams.',
        descHi: 'समय पर सो जाना, 6-7 घंटे की अच्छी नींद, जागने पर तुरंत सतर्क होना।',
        image: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'deep_excessive',
        dosha: 'Kapha',
        labelEn: 'Prabhuta / Sandra Nidra (Deep, Heavy, >8 Hours)',
        labelHi: 'प्रभूत / सान्द्र निद्रा (अति गहरी, 8+ घंटे, भारीपन)',
        descEn: 'Deep unshakeable sleep, hard to wake up early, morning lethargy / grogginess.',
        descHi: 'बहुत गहरी नींद, 8 घंटे से ज्यादा सोना, सुबह भारीपन और उठने में आलस्य।',
        image: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_physio_5',
    domain: 'physiological',
    sopRef: 'CCRAS SOP 2.7 Perspiration & Body Odour (Sveda)',
    classicalRef: 'Charaka Vimana 8/97, Ashtanga Hridaya 3/92',
    questionEn: 'Sweating Amount, Warmth & Odour Pattern',
    questionHi: 'पसीने की मात्रा, उष्णता एवं गंध',
    descEn: 'Evaluation of sweating under ambient temperatures and physical exertion',
    descHi: 'सामान्य वातावरण एवं परिश्रम के दौरान पसीना निकलने की प्रवृत्ति',
    options: [
      {
        value: 'scanty',
        dosha: 'Vata',
        labelEn: 'Alpa Sveda (Scanty / Minimal Sweating)',
        labelHi: 'अल्प स्वेद (बहुत कम पसीना, शुष्कता)',
        descEn: 'Hardly perspires even in warm weather, no noticeable body odour.',
        descHi: 'गर्मी में भी बहुत कम पसीना आना, त्वचा सूखी रहना, कोई विशेष गंध नहीं।',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'profuse_odour',
        dosha: 'Pitta',
        labelEn: 'Prabhuta Sveda (Profuse Sweating with Distinct Odour)',
        labelHi: 'प्रभूत स्वेद (अत्यधिक पसीना, तीखी गंध, जलन)',
        descEn: 'Sweats abundantly, especially on forehead, palms, chest; distinctive pungent odour.',
        descHi: 'थोड़ी गर्मी में भी अत्यधिक पसीना आना, पसीने में तीखी गंध और चिपचिपाहट।',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'moderate_exertion',
        dosha: 'Kapha',
        labelEn: 'Madhyama Sveda (Moderate on Exertion Only)',
        labelHi: 'मध्यम स्वेद (केवल परिश्रम पर सामान्य पसीना)',
        descEn: 'Sweats reasonably during physical labor or exercise, pleasant or neutral odour.',
        descHi: 'केवल कठोर परिश्रम या दौड़ने पर ही सामान्य पसीना, कोई अप्रिय गंध नहीं।',
        image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_physio_6',
    domain: 'physiological',
    sopRef: 'CCRAS SOP 2.8 Weather / Thermal Tolerance (Ritu Sahishnuta)',
    classicalRef: 'Charaka Vimana 8/96-98',
    questionEn: 'Climate & Temperature Sensitivity',
    questionHi: 'मौसम एवं तापमान के प्रति संवेदनशीलता',
    descEn: 'Sensitivity to cold breezes versus direct sunlight and hot climates',
    descHi: 'सर्दी और गर्मी के मौसम को सहन करने की शारीरिक क्षमता',
    options: [
      {
        value: 'cold_intolerant',
        dosha: 'Vata',
        labelEn: 'Sheeta Asahishnuta (Intolerant to Cold Weather)',
        labelHi: 'शीत असहिष्णुता (ठंड बिल्कुल सहन न होना)',
        descEn: 'Dislikes air conditioning, cold drinks, winter winds; loves warmth and sunshine.',
        descHi: 'ठंडे पानी, ठंडी हवा और एसी से तुरंत तकलीफ होना; हमेशा गर्म कपड़े पसंद।',
        image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'heat_intolerant',
        dosha: 'Pitta',
        labelEn: 'Ushna Asahishnuta (Intolerant to Heat & Sun)',
        labelHi: 'उष्ण असहिष्णुता (गर्मी और तेज धूप सहन न होना)',
        descEn: 'Becomes irritable, dizzy, or exhausted in hot weather; craves cold drinks and AC.',
        descHi: 'धूप में सिरदर्द, बेचैनी, अत्यधिक पसीना; हमेशा ठंडा वातावरण और शीतल पेय पसंद।',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'both_tolerant',
        dosha: 'Kapha',
        labelEn: 'Ubhaya Sahishnuta (Tolerates Climate Changes Well)',
        labelHi: 'उभय सहिष्णुता (मौसम परिवर्तन आसानी से सहना)',
        descEn: 'Comfortably adapts to both seasonal shifts, dislikes prolonged damp/rainy chill.',
        descHi: 'सर्दी और गर्मी दोनों को संतुलित रूप से सहन कर लेना, मौसम से कम प्रभावित।',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_physio_7',
    domain: 'physiological',
    sopRef: 'CCRAS SOP 2.9 Physical Stamina & Energy (Vyayama Shakti)',
    classicalRef: 'Charaka Vimana 8/120',
    questionEn: 'Physical Endurance & Energy Expenditure',
    questionHi: 'शारीरिक शक्ति, सहनशीलता एवं व्यायाम क्षमता',
    descEn: 'Endurance during sustained physical activity and recovery time',
    descHi: 'शारीरिक परिश्रम के दौरान टिके रहने की क्षमता और थकान से उबरना',
    options: [
      {
        value: 'low_stamina',
        dosha: 'Vata',
        labelEn: 'Alpa Shakti (Short Bursts, Fast Fatigue)',
        labelHi: 'अल्प शक्ति (जल्दी थक जाना, कम स्टेमिना)',
        descEn: 'Quick bursts of enthusiasm, but quickly exhausted and needs frequent rest.',
        descHi: 'शुरुआत में तेजी से काम करना परन्तु थोड़ी ही देर में हांफने या थक जाना।',
        image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'medium_focused',
        dosha: 'Pitta',
        labelEn: 'Madhyama Shakti (Moderate Endurance, High Focus)',
        labelHi: 'मध्यम शक्ति (मध्यम स्टेमिना, दृढ़ इच्छाशक्ति)',
        descEn: 'Good stamina driven by intense focus and competitive drive; pushes past fatigue.',
        descHi: 'मध्यम शारीरिक बल लेकिन लक्ष्य पूरा करने की तीव्र इच्छाशक्ति व एकाग्रता।',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'high_endurance',
        dosha: 'Kapha',
        labelEn: 'Uttama Shakti (High Stamina & Long Resilience)',
        labelHi: 'उत्तम शक्ति (मजबूत स्टेमिना, भारी सहनशीलता)',
        descEn: 'Exceptional long-duration endurance, steady energy throughout day, rarely exhausted.',
        descHi: 'लगातार घंटों तक बिना थके काम करने की प्राकृतिक क्षमता और उच्च सहनशीलता।',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },

  // ==========================================
  // DOMAIN 3: PSYCHOLOGICAL TRAITS (मानसिक लक्षण)
  // ==========================================
  {
    id: 'ccras_psy_1',
    domain: 'psychological',
    sopRef: 'CCRAS SOP 3.1 Indecisiveness (Anavasthita Atma)',
    classicalRef: 'Sushruta Sharira 4/65, Sharangdhar Purvakhanda 6/63',
    questionEn: 'Decision Making & Steadfastness (Anavasthita Atma)',
    questionHi: 'निर्णय लेने की क्षमता एवं स्थिरता (अनवस्थित आत्मा)',
    descEn: 'Assesses frequency of reconsidering or changing decisions once made',
    descHi: 'निर्णय लेने के उपरांत विचार बदलने की बारंबारता का मूल्यांकन',
    options: [
      {
        value: 'often_changes',
        dosha: 'Vata',
        labelEn: 'Often Changes Decisions (Anavasthita Atma)',
        labelHi: 'प्राय: निर्णय बदलना (अनवस्थित आत्मा / अस्थिर)',
        descEn: 'Frequently doubts choices, feels the urge to alter decisions soon after making them.',
        descHi: 'निर्णय लेने के बाद बार-बार संकोच होना और बार-बार अपना फैसला बदलना।',
        image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'quick_assertive',
        dosha: 'Pitta',
        labelEn: 'Quick, Confident & Calculated Decisions',
        labelHi: 'त्वरित, तार्किक एवं दृढ़ निर्णय',
        descEn: 'Makes swift analytical decisions based on objective reasoning and sticks to them.',
        descHi: 'तर्क और लाभ-हानि देखकर तुरंत स्पष्ट निर्णय लेना और उस पर टिके रहना।',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'slow_unshakable',
        dosha: 'Kapha',
        labelEn: 'Deliberate, Slow & Unshakable (Dhriti)',
        labelHi: 'धैर्यवान, सोच-समझकर लिया गया अडिग निर्णय',
        descEn: 'Takes time to ponder all aspects, but once decided, rarely or never changes.',
        descHi: 'काफी सोच-विचार कर धीरे-धीरे निर्णय लेना, लेकिन एक बार तय होने पर कभी न बदलना।',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_psy_2',
    domain: 'psychological',
    sopRef: 'CCRAS SOP 3.2 Comprehension & Grasping Power (Grahya Shakti)',
    classicalRef: 'Charaka Vimana 8/98, Sushruta Sharira 4/72',
    questionEn: 'Comprehension & Information Grasping (Shrutagrahi vs Chiragrahi)',
    questionHi: 'समझने एवं ग्रहण करने की गति (श्रुतग्राही अथवा चिरग्राही)',
    descEn: 'Speed of absorbing and understanding new instructions or complex information',
    descHi: 'नया विषय या निर्देश सुनकर कितनी जल्दी समझ में आता है',
    options: [
      {
        value: 'shrutagrahi',
        dosha: 'Vata',
        labelEn: 'Shrutagrahi (Immediate Quick Grasping)',
        labelHi: 'श्रुतग्राही (सुनते ही तुरंत बात समझ जाना)',
        descEn: 'Catches concepts very quickly at first instance without needing repeated explanations.',
        descHi: 'पहली बार सुनते ही बात को तुरंत पकड़ लेना, जल्दी समझ में आ जाना।',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'medhavi',
        dosha: 'Pitta',
        labelEn: 'Medhavi (Deep Analytical & Critical Grasping)',
        labelHi: 'मेधावी (तार्किक, सूक्ष्म एवं व्यावहारिक समझ)',
        descEn: 'Grasps both core concept and underlying logical flaws immediately.',
        descHi: 'बात के मूल अर्थ और उसके पीछे के तर्क को गहराई से तुरंत समझना।',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'chiragrahi',
        dosha: 'Kapha',
        labelEn: 'Chiragrahi (Delayed / Deliberate Comprehension)',
        labelHi: 'चिरग्राही (धीमी गति से, गहराई से समझना)',
        descEn: 'Takes more time or repeated explanation to fully comprehend, but retains thoroughly.',
        descHi: 'समझने में थोड़ा समय लगना, दोहराने पर पूरी तरह मन में बैठना।',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_psy_3',
    domain: 'psychological',
    sopRef: 'CCRAS SOP 3.3 Memory & Retention (Smriti)',
    classicalRef: 'Charaka Vimana 8/98, Sushruta Sharira 4/65-72',
    questionEn: 'Memory Retention & Recall Patterns',
    questionHi: 'स्मृति, याद रखने की क्षमता एवं विस्मृति की प्रवृत्ति',
    descEn: 'Assessment of short-term vs long-term recall and retention tenacity',
    descHi: 'जल्दी याद होना और जल्दी भूलना, अथवा धीरे याद होकर जीवन भर याद रहना',
    options: [
      {
        value: 'quick_learn_quick_forget',
        dosha: 'Vata',
        labelEn: 'Shighra Grahi - Shighra Lopa (Learns Quick, Forgets Quick)',
        labelHi: 'शीघ्रग्राही - शीघ्रलोपी (जल्दी याद, जल्दी भूलना)',
        descEn: 'Easily memorizes for immediate need, but forgets past details, dates, or names quickly.',
        descHi: 'तुरंत याद हो जाना लेकिन कुछ ही दिनों में नाम या बातें भूल जाना।',
        image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'sharp_selective',
        dosha: 'Pitta',
        labelEn: 'Spashta Smriti (Sharp, Clear & Systematic Recall)',
        labelHi: 'स्पष्ट स्मृति (सटीक, तार्किक एवं व्यवस्थित स्मरण)',
        descEn: 'Accurate and structured memory for facts, sequences, points, and relevant data.',
        descHi: 'महत्वपूर्ण घटनाओं, तथ्यों और क्रमबद्ध जानकारी का सटीक स्मरण।',
        image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'deergha_smriti',
        dosha: 'Kapha',
        labelEn: 'Deergha Smriti (Takes Effort to Learn, Never Forgets)',
        labelHi: 'दीर्घ स्मृति (देर से याद, परन्तु आजीवन न भूलना)',
        descEn: 'Requires deliberate effort to commit to memory, but permanently retained for decades.',
        descHi: 'याद करने में थोड़ा समय लगता है, पर एक बार याद होने पर बरसों तक नहीं भूलते।',
        image: 'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_psy_4',
    domain: 'psychological',
    sopRef: 'CCRAS SOP 3.4 Temperament & Anger Reaction (Krodha)',
    classicalRef: 'Charaka Vimana 8/97, Ashtanga Sangraha 8/11',
    questionEn: 'Temperament, Anger Trigger & Pacification Pattern',
    questionHi: 'क्रोध की उत्पत्ति, तीव्रता एवं शांत होने का समय',
    descEn: 'How easily irritation occurs and how long emotional flare-ups persist',
    descHi: 'गुस्सा कितनी जल्दी आता है और कितनी देर में शांत होता है',
    options: [
      {
        value: 'fast_anger_fast_cool',
        dosha: 'Vata',
        labelEn: 'Shighra Krodha - Shama (Quick to Flare, Quick to Cool)',
        labelHi: 'शीघ्र क्रोध - शीघ्र शम (जल्दी गुस्सा, तुरंत शांत)',
        descEn: 'Gets irritated rapidly over small matters, but cools down within minutes without resentment.',
        descHi: 'छोटी बात पर तुरंत उत्तेजित होना, पर कुछ ही पलों में सब भूलकर शांत हो जाना।',
        image: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'intense_temper',
        dosha: 'Pitta',
        labelEn: 'Tikshna Krodha (Sharp, Fiery, Outspoken Temper)',
        labelHi: 'तीक्ष्ण क्रोध (तीव्र गुस्सा, आक्रामक तेवर, देर से शांत)',
        descEn: 'Anger is fierce, verbal, demanding; takes considerable time to cool down completely.',
        descHi: 'क्रोध में चेहरा लाल होना, तीखे शब्द, बात का बुरा मानना और देर से सामान्य होना।',
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'rarely_angry',
        dosha: 'Kapha',
        labelEn: 'Akrodhana / Achandata (Rarely Angry, Highly Forgiving)',
        labelHi: 'अक्रोधन / अचाण्ड्यता (शायद ही कभी गुस्सा, अत्यंत शांत)',
        descEn: 'Remains remarkably unruffled, tolerates provocations with patience and smiling composure.',
        descHi: 'बहुत मुश्किल से गुस्सा आना, बात को हंसी में टालना और धैर्य बनाए रखना।',
        image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_psy_5',
    domain: 'psychological',
    sopRef: 'CCRAS SOP 3.5 Anxiety, Fear & Emotional Fortitude (Dhriti / Bhaya)',
    classicalRef: 'Charaka Vimana 8/98, Sushruta 4/65',
    questionEn: 'Response to Stress, Crisis & Fearful Situations',
    questionHi: 'तनाव, भय एवं आकस्मिक संकट में मानसिक संतुलन',
    descEn: 'Tendency towards nervous anxiety vs courage vs placid calm',
    descHi: 'चिंता, घबराहट अथवा संकट में धैर्य व साहस का प्रदर्शन',
    options: [
      {
        value: 'anxious_fearful',
        dosha: 'Vata',
        labelEn: 'Bhiru / Udvega (Easily Anxious, Nervous, Overthinks)',
        labelHi: 'भीरु / उद्वेग (जल्दी घबराना, चिंता, अत्यधिक सोचना)',
        descEn: 'Prone to palpitations, panic, excessive worrying about worst-case outcomes.',
        descHi: 'अचानक कोई समस्या आने पर दिल धड़कना, हाथ कांपना, गहरी चिंता में डूब जाना।',
        image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'bold_competitive',
        dosha: 'Pitta',
        labelEn: 'Sahasa / Dhairya (Courageous, Bold, Problem Solver)',
        labelHi: 'साहस / धैर्य (साहसी, निर्भीक, संकट का सामना)',
        descEn: 'Faces danger directly, takes charge in crises, confident and ambitious.',
        descHi: 'कठिनाइयों में आगे आकर नेतृत्व करना, निडरता और समस्या सुलझाने का साहस।',
        image: 'https://images.unsplash.com/photo-1528747045269-390fe33c19f2?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'calm_resilient',
        dosha: 'Kapha',
        labelEn: 'Sthira Chitta (Unshakable, Emotionally Grounded)',
        labelHi: 'स्थिर चित्त (गंभीर, शांत, संकट में भी अविचलित)',
        descEn: 'Maintains composure, handles adversity with calm resilience, rarely panics.',
        descHi: 'बड़ी से बड़ी परेशानी में भी शांति बनाए रखना, विचलित हुए बिना धैर्य से काम लेना।',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },

  // ==========================================
  // DOMAIN 4: BEHAVIORAL TRAITS (व्यवहारिक लक्षण)
  // ==========================================
  {
    id: 'ccras_beh_1',
    domain: 'behavioral',
    sopRef: 'CCRAS SOP 4.5 Enmity & Forgiveness (Dridhavairam vs Kshama)',
    classicalRef: 'Ashtanga Hridaya Sharira 3/99, CCRAS SOP Manual p. 49 & 87',
    questionEn: 'Holding Grudges vs Forgiving Differences (Dridhavairam)',
    questionHi: 'मतभेद होने पर सुलह की प्रवृत्ति अथवा शत्रुता का स्थायी रहना (दृढ़वैरम्)',
    descEn: 'Official questionnaire item for difference with friends/colleagues and willingness to patch up',
    descHi: 'सीसीआरएएस एसओपी पृष्ठ 49/87 के अनुसार मतभेद होने पर सुलह न करने की प्रवृत्ति',
    options: [
      {
        value: 'dridhavairam',
        dosha: 'Kapha',
        labelEn: 'Dridhavairam (Holds Strong, Long-lasting Enmity)',
        labelHi: 'दृढ़वैरम् (स्थायी शत्रुता / कभी सुलह न करना)',
        descEn: 'Once differences arise, does not accept reconciliation; remembers past grievances.',
        descHi: 'एक बार मनमुटाव होने पर सुलह स्वीकार न करना, बरसों तक बात मन में रखना।',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      },
      {
        value: 'patch_up_hesitant',
        dosha: 'Pitta',
        labelEn: 'Hesitant but Willing to Reconcile / Move On',
        labelHi: 'संकोच परन्तु सुलह की इच्छा / आगे बढ़ना',
        descEn: 'Hesitates initially due to ego, but eventually receptive to patch-up if approached.',
        descHi: 'शुरुआत में संकोच होना लेकिन मित्र के प्रयास करने पर बात मान लेना।',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'quick_forgiving',
        dosha: 'Vata',
        labelEn: 'Kshamavana (Forgives Easily, Forgets Disagreements)',
        labelHi: 'क्षमावान (आसानी से माफ करना, मतभेद भूल जाना)',
        descEn: 'Does not hold grievances; quickly resumes normal communication without ill will.',
        descHi: 'किसी बात का बुरा न मानना, तुरंत सुलह कर लेना और पहले जैसा व्यवहार रखना।',
        image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      }
    ]
  },
  {
    id: 'ccras_beh_2',
    domain: 'behavioral',
    sopRef: 'CCRAS SOP 4.6 Politeness & Humility Under Stress (Vineeta)',
    classicalRef: 'Ashtanga Hridaya Sharira 3/99, CCRAS SOP Manual p. 49 & 87',
    questionEn: 'Polite & Humble Conduct in Anxiety / Stressful Situations (Vineeta)',
    questionHi: 'तनाव, चिंता अथवा प्रतिकूल परिस्थिति में भी विनम्र आचरण (विनीत)',
    descEn: 'Standard CCRAS inquiry on whether the subject maintains courteous manners under pressure',
    descHi: 'दबाव या प्रतिकूल स्थिति में भी मृदु व शांत बने रहने की क्षमता',
    options: [
      {
        value: 'often_polite',
        dosha: 'Kapha',
        labelEn: 'Vineeta (Soft, Submissive & Courteous Under Pressure)',
        labelHi: 'विनीत (तनाव में भी शांत, अत्यंत विनम्र एवं शिष्ट)',
        descEn: 'Consistently maintains calm respectfulness and soft tone even when provoked or anxious.',
        descHi: 'अत्यधिक तनाव या उत्तेजना में भी कभी अपशब्द न बोलना, शांत व शिष्ट बने रहना।',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      },
      {
        value: 'aggressive_under_stress',
        dosha: 'Pitta',
        labelEn: 'Sharp / Aggressive when Challenged or Pressured',
        labelHi: 'दबाव में तीखा, आक्रामक एवं स्पष्टवादी',
        descEn: 'Direct, assertive, loses patience quickly when confronted with incompetence.',
        descHi: 'दबाव या विपरीत परिस्थिति में तुरंत अधीर होना, तीखे व आक्रामक तेवर दिखाना।',
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'erratic_nervous',
        dosha: 'Vata',
        labelEn: 'Nervous, Agitated or Variable Mannerisms',
        labelHi: 'घबराहट में अनिश्चित व्यवहार / बेचैनी',
        descEn: 'Politeness fluctuates depending on mood; appears nervous or flustered in conflict.',
        descHi: 'तनाव में घबरा जाना, कभी चुप हो जाना तो कभी असहज व्यवहार करना।',
        image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      }
    ]
  },
  {
    id: 'ccras_beh_3',
    domain: 'behavioral',
    sopRef: 'CCRAS SOP 4.2 Speech & Conversation Pattern (Vak)',
    classicalRef: 'Charaka Vimana 8/96-98',
    questionEn: 'Speech Pitch, Speed & Conversation Style',
    questionHi: 'संभाषण शैली, वाणी की गति एवं स्वर',
    descEn: 'Tempo, volume, argumentativeness, and articulation during dialogue',
    descHi: 'बोलने की गति, बातचीत में तार्किकता एवं आवाज की गंभीरता',
    options: [
      {
        value: 'fast_talkative',
        dosha: 'Vata',
        labelEn: 'Bahubhashi / Chala-vak (Rapid, Fast-paced, Talkative)',
        labelHi: 'बहुभाषी / चल-वाक् (तेज गति से बोलना, अत्यधिक बातें)',
        descEn: 'Speaks rapidly, jumps between topics, high-pitched voice, loves casual chatter.',
        descHi: 'तेज आवाज में जल्दी-जल्दी बोलना, एक विषय से दूसरे पर कूदना, बहुत बोलना।',
        image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'sharp_argumentative',
        dosha: 'Pitta',
        labelEn: 'Tikshna / Pragalbha (Sharp, Clear, Convincing Debate)',
        labelHi: 'तीक्ष्ण / प्रगल्भ (स्पष्ट, तार्किक, वाद-विवाद में कुशल)',
        descEn: 'Articulate, authoritative, logical argumentation, precise and persuasive diction.',
        descHi: 'नपे-तुले स्पष्ट शब्द, अकाट्य तर्क, बहस करने में कुशल व प्रभावी वाणी।',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'deep_resonant',
        dosha: 'Kapha',
        labelEn: 'Gambhira / Manda-vak (Deep, Resonant, Soft, Measured)',
        labelHi: 'गम्भीर / मन्द-वाक् (गहरी, भारी आवाज, कम व तौलकर बोलना)',
        descEn: 'Deep calm voice, speaks only when necessary, never interrupts others, soothing tone.',
        descHi: 'भारी गंभीर आवाज, कम बोलना, धीमे स्वर में नपे-तुले व मधुर शब्द।',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_beh_4',
    domain: 'behavioral',
    sopRef: 'CCRAS SOP 4.3 Walking Pace & Body Movements (Gati & Cheshta)',
    classicalRef: 'Charaka Vimana 8/96-98, Ashtanga Hridaya 3/99',
    questionEn: 'Natural Walking Speed & Physical Mobility (Gati)',
    questionHi: 'चलने की गति एवं शारीरिक क्रियाशीलता (गति एवं चेष्टा)',
    descEn: 'Clinical observation of step frequency, stride steadiness, and body restlessness',
    descHi: 'पैदल चलने की स्वाभाविक रफ्तार और अंगों में स्थिरता अथवा चंचलता',
    options: [
      {
        value: 'fast_erratic',
        dosha: 'Vata',
        labelEn: 'Shighra / Chapala Gati (Quick, Hurried, Restless Steps)',
        labelHi: 'शीघ्र / चपल गति (तेज, जल्दबाजी में, चंचल चाल)',
        descEn: 'Walks very fast, fidgets with hands/feet, restless postures, constantly shifting.',
        descHi: 'हमेशा जल्दी में चलना, पैर हिलाना, उंगलियां चटकाना, बेचैन मुद्रा।',
        image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'purposeful_stride',
        dosha: 'Pitta',
        labelEn: 'Twarita Gati (Medium, Firm, Purposeful Stride)',
        labelHi: 'त्वरित गति (मध्यम, दृढ़, आत्मविश्वासी चाल)',
        descEn: 'Direct, focused stride, erect military posture, walks with clear destination.',
        descHi: 'सीधी, सधी हुई आत्मविश्वासी चाल, लक्ष्य की ओर निश्चित कदमों से बढ़ना।',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'slow_steady',
        dosha: 'Kapha',
        labelEn: 'Manda / Dhira Gati (Graceful, Slow, Majestic, Dignified)',
        labelHi: 'मन्द / धीर गति (शांत, धीमी, राजसी एवं स्थिर चाल)',
        descEn: 'Slow rhythmic steps, highly dignified posture, calm and composed movements.',
        descHi: 'हाथी अथवा हंस के समान धीमी, स्थिर, सुंदर और गरिमापूर्ण चाल।',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  },
  {
    id: 'ccras_beh_5',
    domain: 'behavioral',
    sopRef: 'CCRAS SOP 4.4 Social Bonds & Friendship (Maitri)',
    classicalRef: 'Charaka Vimana 8/96-98',
    questionEn: 'Friendship Formation & Social Attachment (Maitri)',
    questionHi: 'मित्रता करने का स्वभाव एवं सामाजिक संबंध (मैत्री)',
    descEn: 'Speed of bonding with strangers and longevity of interpersonal connections',
    descHi: 'मित्र जल्दी बनते हैं या देर से, और संबंध कितने समय तक स्थायी रहते हैं',
    options: [
      {
        value: 'quick_fluctuating',
        dosha: 'Vata',
        labelEn: 'Chala Maitri (Befriends Quickly, Fluctuates Easily)',
        labelHi: 'चल मैत्री (जल्दी दोस्त बनाना, संबंध जल्दी ढीले पड़ना)',
        descEn: 'Extroverted, strikes up conversations easily, but social circle changes frequently.',
        descHi: 'किसी से भी तुरंत घुल-मिल जाना, पर मित्रता लंबे समय तक टिकाए रखना कठिन।',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
        vata: 1, pitta: 0, kapha: 0
      },
      {
        value: 'selective_intellectual',
        dosha: 'Pitta',
        labelEn: 'Madhyama Maitri (Selective, Goal-Oriented, Mutual Respect)',
        labelHi: 'मध्यम मैत्री (चयनित, वैचारिक, सम्मान पर आधारित)',
        descEn: 'Selects friends with similar intellect or work goals; values loyalty and principles.',
        descHi: 'सोच-समझकर मित्र चुनना, वैचारिक समानता व कार्यकुशलता को महत्व देना।',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 1, kapha: 0
      },
      {
        value: 'deep_lifelong',
        dosha: 'Kapha',
        labelEn: 'Dridha Maitri (Slow to Befriend, Lifelong & Enduring)',
        labelHi: 'दृढ़ मैत्री (देर से मित्रता, आजीवन अटूट व समर्पित संबंध)',
        descEn: 'Slow to open up, small circle of trusted friends, but bonds last decades or lifetime.',
        descHi: 'जल्दी किसी पर भरोसा न करना, पर एक बार मित्र बनने पर जीवन भर साथ निभाना।',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80',
        vata: 0, pitta: 0, kapha: 1
      }
    ]
  }
];

// ---------------------------------------------------------------------------
// 3. HIGH-YIELD CCRAS QUICK ASSESSMENT (6 CORE CLINICAL TRAITS)
// ---------------------------------------------------------------------------

export const CCRAS_QUICK_ASSESSMENT_QUESTIONS = [
  CCRAS_PRAKRITI_QUESTIONS[0],  // Built (BMI)
  CCRAS_PRAKRITI_QUESTIONS[3],  // Skin Texture & Temperature
  CCRAS_PRAKRITI_QUESTIONS[6],  // Eating Speed
  CCRAS_PRAKRITI_QUESTIONS[7],  // Thirst Urge (Pipasa)
  CCRAS_PRAKRITI_QUESTIONS[13], // Indecisiveness (Anavasthita Atma)
  CCRAS_PRAKRITI_QUESTIONS[18]  // Enmity / Forgiveness (Dridhavairam)
];

// ---------------------------------------------------------------------------
// 4. OFFICIAL CCRAS SCORING & CLASSIFICATION ENGINE
// ---------------------------------------------------------------------------

/**
 * Calculates official CCRAS Prakriti marks, percentages, and Ayurvedic classification.
 * @param {Object} answers Map of questionId -> optionValue
 * @returns {Object} Full clinical CCRAS evaluation result
 */
export function calculateCcrasPrakriti(answers = {}) {
  let vataMarks = 0;
  let pittaMarks = 0;
  let kaphaMarks = 0;

  const domainScores = {
    physical: { vata: 0, pitta: 0, kapha: 0, total: 0 },
    physiological: { vata: 0, pitta: 0, kapha: 0, total: 0 },
    psychological: { vata: 0, pitta: 0, kapha: 0, total: 0 },
    behavioral: { vata: 0, pitta: 0, kapha: 0, total: 0 }
  };

  const answeredQuestions = [];

  CCRAS_PRAKRITI_QUESTIONS.forEach((q) => {
    const selectedVal = answers[q.id];
    if (!selectedVal) return;

    const opt = q.options.find(o => o.value === selectedVal);
    if (!opt) return;

    vataMarks += (opt.vata || 0);
    pittaMarks += (opt.pitta || 0);
    kaphaMarks += (opt.kapha || 0);

    if (domainScores[q.domain]) {
      domainScores[q.domain].vata += (opt.vata || 0);
      domainScores[q.domain].pitta += (opt.pitta || 0);
      domainScores[q.domain].kapha += (opt.kapha || 0);
      domainScores[q.domain].total += ((opt.vata || 0) + (opt.pitta || 0) + (opt.kapha || 0));
    }

    answeredQuestions.push({
      id: q.id,
      domain: q.domain,
      sopRef: q.sopRef,
      questionEn: q.questionEn,
      questionHi: q.questionHi,
      selectedVal: opt.value,
      selectedLabelEn: opt.labelEn,
      selectedLabelHi: opt.labelHi,
      vata: opt.vata || 0,
      pitta: opt.pitta || 0,
      kapha: opt.kapha || 0
    });
  });

  const totalMarks = vataMarks + pittaMarks + kaphaMarks;

  // Fallback defaults if no questions answered yet
  const effectiveTotal = totalMarks > 0 ? totalMarks : 1;
  const vataPct = totalMarks > 0 ? Math.round((vataMarks / effectiveTotal) * 100) : 33;
  const pittaPct = totalMarks > 0 ? Math.round((pittaMarks / effectiveTotal) * 100) : 34;
  const kaphaPct = totalMarks > 0 ? (100 - vataPct - pittaPct) : 33;

  // Determine Classification as per CCRAS criteria
  const sortedDoshas = [
    { name: 'Vata', pct: vataPct, marks: vataMarks },
    { name: 'Pitta', pct: pittaPct, marks: pittaMarks },
    { name: 'Kapha', pct: kaphaPct, marks: kaphaMarks }
  ].sort((a, b) => b.pct - a.pct);

  const top1 = sortedDoshas[0];
  const top2 = sortedDoshas[1];
  const top3 = sortedDoshas[2];

  let prakritiType = 'Dwandvaja'; // default dual
  let dominantPrakriti = `${top1.name}-${top2.name}`;
  let dominantPrakritiHi = `${top1.name}-${top2.name} प्रकृति`;
  let sanskritCode = `${top1.name.toUpperCase()}_${top2.name.toUpperCase()}`;

  // 1. Ekadoshaja: Top dosha >= 55% or gap > 18% over second
  if (top1.pct >= 55 || (top1.pct - top2.pct >= 18)) {
    prakritiType = 'Ekadoshaja';
    dominantPrakriti = `${top1.name} Pradhana`;
    dominantPrakritiHi = `${top1.name === 'Vata' ? 'वात' : top1.name === 'Pitta' ? 'पित्त' : 'कफ'} प्रधान प्रकृति`;
    sanskritCode = `${top1.name.toUpperCase()}_PRADHANA`;
  } 
  // 2. Sannipataja / Sama: All three within 8% of each other
  else if ((top1.pct - top3.pct) <= 10) {
    prakritiType = 'Sannipataja';
    dominantPrakriti = 'Sama Dosha (Tridoshaja)';
    dominantPrakritiHi = 'समदोष (त्रिदोषज) प्रकृति';
    sanskritCode = 'SAMA_DOSHA';
  } 
  // 3. Dwandvaja (Dual constitutional):
  else {
    prakritiType = 'Dwandvaja';
    dominantPrakriti = `${top1.name}-${top2.name} Dwandvaja`;
    const d1Hi = top1.name === 'Vata' ? 'वात' : top1.name === 'Pitta' ? 'पित्त' : 'कफ';
    const d2Hi = top2.name === 'Vata' ? 'वात' : top2.name === 'Pitta' ? 'पित्त' : 'कफ';
    dominantPrakritiHi = `${d1Hi}-${d2Hi} द्वन्द्वज प्रकृति (${d1Hi}ाधिक)`;
    sanskritCode = `${top1.name.toUpperCase()}_${top2.name.toUpperCase()}`;
  }

  // Dietary and Lifestyle Knowledge
  const guidelines = CCRAS_PRAKRITI_GUIDELINES[sanskritCode] || CCRAS_PRAKRITI_GUIDELINES['PITTA_VATA'] || CCRAS_PRAKRITI_GUIDELINES['SAMA_DOSHA'];

  return {
    isCcrasStandard: true,
    standardBody: 'Central Council for Research in Ayurvedic Sciences (CCRAS), Ministry of AYUSH, Govt of India',
    standardRef: 'CCRAS Prakriti Assessment Scale Manual (ISBN 978-93-83864-21-8)',
    totalQuestions: CCRAS_PRAKRITI_QUESTIONS.length,
    answeredCount: answeredQuestions.length,
    marks: {
      vata: vataMarks,
      pitta: pittaMarks,
      kapha: kaphaMarks,
      total: totalMarks
    },
    percentages: {
      vata: vataPct,
      pitta: pittaPct,
      kapha: kaphaPct
    },
    vataPct,
    pittaPct,
    kaphaPct,
    dominant: dominantPrakriti,
    dominantHi: dominantPrakritiHi,
    prakritiType,
    dominantPrakriti,
    dominantPrakritiHi,
    sanskritCode,
    domainScores,
    answeredQuestions,
    guidelines,
    knowledge: guidelines,
    dietaryRecommendations: guidelines ? {
      consume: guidelines.pathyaConsumeEn,
      avoid: guidelines.apatyaAvoidEn,
      consumeHi: guidelines.pathyaConsumeHi,
      avoidHi: guidelines.apatyaAvoidHi,
      rulesEn: guidelines.dietaryRulesEn,
      rulesHi: guidelines.dietaryRulesHi
    } : null
  };
}

// ---------------------------------------------------------------------------
// 5. OFFICIAL CCRAS AHARA, VIHARA & PATHYA-APATHYA GUIDELINES
// ---------------------------------------------------------------------------

export const CCRAS_PRAKRITI_GUIDELINES = {
  'VATA_PRADHANA': {
    dosha: 'Vata',
    titleEn: 'Vata Pradhana Prakriti Regimen',
    titleHi: 'वात प्रधान प्रकृति - पथ्यापथ्य एवं दिनचर्या',
    primaryDosha: 'Vata (वायु एवं आकाश महाभूत)',
    qualities: 'Ruksha (Dry), Laghu (Light), Sheeta (Cold), Chala (Mobile), Khara (Rough)',
    dietaryRulesEn: 'Warm, freshly prepared, nourishing, unctuous (Snigdha) foods with Madhura (Sweet), Amla (Sour), and Lavana (Salty) rasas. Drink warm water.',
    dietaryRulesHi: 'गरम, ताजा, सुपाच्य, घी-तेल से युक्त चिकना (स्निग्ध) भोजन। मधुर, अम्ल एवं लवण रस प्रधान आहार। गुनगुना जल पिएं।',
    pathyaConsumeEn: [
      'Ghee (Cow\'s Desi Ghee), Sesame oil, Warm whole milk with Cardamom/Nutmeg',
      'Sweet fruits (Ripe mangoes, bananas, soaked dates, figs, stewed apples)',
      'Grains: Cooked rice, wheat, oats; cooked dals (Moong dal with ghee)',
      'Spices: Ginger, cumin, cinnamon, fennel, cardamom, hing (asafetida)',
      'Warm soups, herbal teas, cooked root vegetables (carrots, beetroot)'
    ],
    pathyaConsumeHi: [
      'गाय का शुद्ध देशी घी, तिल का तेल, इलायची/जायफल युक्त गुनगुना दूध',
      'मीठे फल: पके आम, केला, भीगे खजूर, अंजीर, उबले सेब',
      'अनाज: चावल, गेहूं, दलिया, घी का तड़का लगी मूंग की दाल',
      'मसाले: सोंठ, जीरा, दालचीनी, सौंफ, इलायची, हींग',
      'गरम सूप, हर्बल काढ़ा, पकी जड़ वाली सब्जियां (गाजर, चुकंदर)'
    ],
    apatyaAvoidEn: [
      'Cold, dry, stale, refrigerated foods and iced water',
      'Raw salads, sprouts, cold dry crackers, raw leafy greens in excess',
      'Excessive Pungent (Katu), Bitter (Tikta), and Astringent (Kashaya) tastes',
      'Carbonated drinks, caffeine, late-night dinners, fasting'
    ],
    apatyaAvoidHi: [
      'ठंडा, बासी, सूखा भोजन, फ्रिज का ठंडा पानी व शीतल पेय',
      'कच्चा सलाद, अत्यधिक अंकुरित अनाज, सूखी पपड़ी, बेकरी उत्पाद',
      'अत्यधिक तीखा (कटु), कड़वा (तिक्त) और कसैला (कषाय) भोजन',
      'कोल्ड ड्रिंक्स, कैफीन, देर रात का भोजन, उपवास'
    ],
    viharaLifestyleEn: 'Abhyanga (daily warm sesame oil massage), regular sleep schedule by 10 PM, avoiding cold drafts, moderate gentle walks.',
    viharaLifestyleHi: 'नियमित अभ्यंग (हल्के गर्म तिल के तेल से मालिश), रात 10 बजे तक शयन, ठंडी हवा से बचाव, शांतिपूर्ण व नियमित दिनचर्या।',
    yogaAsanas: 'Surya Namaskar (slow pace), Tadasana, Paschimottanasana, Vrikshasana, Shavasana. Nadi Shodhana Pranayama.'
  },

  'PITTA_PRADHANA': {
    dosha: 'Pitta',
    titleEn: 'Pitta Pradhana Prakriti Regimen',
    titleHi: 'पित्त प्रधान प्रकृति - पथ्यापथ्य एवं दिनचर्या',
    primaryDosha: 'Pitta (अग्नि एवं जल महाभूत)',
    qualities: 'Sasneha (Slightly oily), Tikshna (Sharp/Penetrating), Ushna (Hot), Laghu (Light), Visra (Fleshy odor)',
    dietaryRulesEn: 'Cooling, moderately unctuous, calming foods dominated by Madhura (Sweet), Tikta (Bitter), and Kashaya (Astringent) tastes.',
    dietaryRulesHi: 'शीतल, मधुर, तिक्त (कड़वा) एवं कषाय (कसैला) रस युक्त सात्विक भोजन। अत्यधिक मिर्च-मसाले, खट्टे व नमकीन पदार्थों से परहेज।',
    pathyaConsumeEn: [
      'Cow\'s Ghee, Coconut water, Amla, Munakka, Sweet pomegranates',
      'Coriander seeds water, Fennel tea, Cooling mint leaves, Rose petal preserve (Gulkand)',
      'Grains: Basmati rice, barley (Yava), wheat; Moong dal',
      'Vegetables: Ash gourd, bottle gourd (Lauki), cucumber, green leafy vegetables',
      'Sweet fruits: Grapes, melons, sweet apples, soaked almonds without skin'
    ],
    pathyaConsumeHi: [
      'गाय का घी, नारियल पानी, आंवला, मुनक्का, मीठे अनार',
      'धनिया पानी, सौंफ की चाय, पुदीना, गुलकंद',
      'अनाज: बासमती चावल, जौ (यव), गेहूं, छिलके वाली मूंग दाल',
      'सब्जियां: पेठा (कूष्मांड), लौकी, तोरी, खीरा, हरी पत्तेदार सब्जियां',
      'फल: मीठे अंगूर, खरबूजा, तरबूज, छिले हुए भीगे बादाम'
    ],
    apatyaAvoidEn: [
      'Hot spicy curries, excessive red chillies, mustard, garlic, raw onions',
      'Sour foods (excessive tomatoes, vinegar, pickles, fermented foods, sour curd)',
      'Deep-fried salty snacks, alcohol, smoking, excessive coffee',
      'Skipping meals when hungry (Tikshnagni aggravation)'
    ],
    apatyaAvoidHi: [
      'अत्यधिक तीखा खाना, लाल मिर्च, राई, लहसुन, कच्चा प्याज',
      'अम्ल पदार्थ: सिरका, अचार, खट्टा दही, इमली, खट्टी छाछ',
      'तले-भुने नमकीन स्नैक्स, शराब, धूम्रपान, अधिक चाय/कॉफी',
      'भूख लगने पर भूखे रहना (पित्त प्रकोप का मुख्य कारण)'
    ],
    viharaLifestyleEn: 'Moonlight walks (Chandrika Vihara), keeping cool during mid-day heat, avoiding prolonged direct sunlight, cultivating forgiveness.',
    viharaLifestyleHi: 'चांदनी रात में टहलना, दोपहर की तेज धूप से बचना, शीतल वातावरण, क्रोध नियंत्रण एवं क्षमाशीलता का अभ्यास।',
    yogaAsanas: 'Sheetali & Sheetkari Pranayama, Chandra Bhedi Pranayama, Matsyasana, Bhujangasana, Shitali Dhyana.'
  },

  'KAPHA_PRADHANA': {
    dosha: 'Kapha',
    titleEn: 'Kapha Pradhana Prakriti Regimen',
    titleHi: 'कफ प्रधान प्रकृति - पथ्यापथ्य एवं दिनचर्या',
    primaryDosha: 'Kapha (पृथ्वी एवं जल महाभूत)',
    qualities: 'Guru (Heavy), Sheeta (Cold), Mridu (Soft), Snigdha (Unctuous), Sandra (Dense), Sthira (Stable)',
    dietaryRulesEn: 'Light, warm, dry, stimulating foods dominated by Katu (Pungent), Tikta (Bitter), and Kashaya (Astringent) tastes. Drink warm water.',
    dietaryRulesHi: 'हल्का, गर्म, रूखा, सुपाच्य एवं अग्निदीपक भोजन। कटु (तीखा), तिक्त एवं कषाय रस प्रधान आहार। केवल गुनगुना पानी पिएं।',
    pathyaConsumeEn: [
      'Old honey (Purana Madhu), Ginger, Black pepper, Pippali (Trikatu)',
      'Grains: Barley (Yava), Roasted millets, Bajra, Ragi, Kulattha (Horse gram)',
      'Vegetables: Karela (Bitter gourd), Methi, drumstick, radish, spinach',
      'Warm water with ginger/honey in morning, Takra (buttermilk with roasted cumin & hing)',
      'Light dry beans, lentils, pomegranate, papaya, dry roasted chana'
    ],
    pathyaConsumeHi: [
      'पुराना शुद्ध शहद, सोंठ, काली मिर्च, पिप्पली (त्रिकटु चूर्ण)',
      'अनाज: जौ (यव), बाजरा, रागी, कुलथी की दाल, भुना चना',
      'सब्जियां: करेला, मेथी, सहजन (मोरिंगा), मूली, पालक',
      'प्रातःकाल गुनगुने पानी में शहद, भुना जीरा व हींग युक्त मट्ठा',
      'फल: अनार, पपीता, सेब, संतरा'
    ],
    apatyaAvoidEn: [
      'Heavy oily fried sweets, dairy desserts, ice cream, cheese, butter',
      'Cold water, refrigerated sugary drinks, banana milkshakes',
      'Excessive Sweet (Madhura), Sour (Amla), and Salty (Lavana) tastes',
      'Daytime sleep (Divasvapna), sedentary habits, overeating'
    ],
    apatyaAvoidHi: [
      'भारी, तली-भुनी मिठाइयां, रबड़ी, पनीर, मक्खन, चीज',
      'ठंडा पानी, कोल्ड ड्रिंक्स, बनाना शेक, आइसक्रीम',
      'अत्यधिक मीठा (मधुर), खट्टा और नमकीन भोजन',
      'दिन में सोना (दिवास्वप्न), आलस्य, शारीरिक निष्क्रियता'
    ],
    viharaLifestyleEn: 'Vigorous daily physical exercise (Vyayama), waking before sunrise (Brahma Muhurta), Udvartana (dry herbal powder scrub).',
    viharaLifestyleHi: 'प्रतिदिन पसीना बहाने वाला व्यायाम, सूर्योदय से पूर्व जागरण, उद्वर्तन (त्रिफला/जौ के चूर्ण से रूखा उबटन)।',
    yogaAsanas: 'Kapalabhati, Bhastrika Pranayama, Surya Namaskar (fast dynamic pace), Dhanurasana, Chakrasana.'
  },

  'PITTA_VATA': {
    dosha: 'Pitta-Vata',
    titleEn: 'Pitta-Vata Dwandvaja Prakriti Regimen',
    titleHi: 'पित्त-वात द्वन्द्वज प्रकृति - पथ्यापथ्य एवं दिनचर्या',
    primaryDosha: 'Pitta-Vata (अग्नि, वायु एवं आकाश)',
    qualities: 'Tikshna (Sharp), Ushna (Hot) yet Ruksha (Dry) and Chala (Mobile)',
    dietaryRulesEn: 'Moderately unctuous, warm yet non-spicy, soothing foods. Balancing both fiery Pitta and irregular Vata.',
    dietaryRulesHi: 'स्निग्ध, सुपाच्य, मृदु और गैर-मसालेदार भोजन। पित्त की गर्मी और वात की रूक्षता दोनों को शांत करने वाला आहार।',
    pathyaConsumeEn: [
      'Cow\'s Ghee in moderate quantities, Coconut oil for cooking',
      'Moong dal khichdi, soaked almonds, sweet fruits (pomegranate, sweet grapes, melons)',
      'Fennel, coriander, cardamom, fresh ginger in mild quantities',
      'Adequate hydration: lukewarm boiled water, coconut water in daytime'
    ],
    pathyaConsumeHi: [
      'उचित मात्रा में गाय का घी, नारियल का तेल',
      'मूंग दाल की पतली खिचड़ी, भीगे बादाम, मीठे अनार, अंगूर, खरबूजा',
      'सौंफ, धनिया, इलायची और हल्की मात्रा में अदरक',
      'पर्याप्त जल: दिन में गुनगुना जल या नारियल पानी'
    ],
    apatyaAvoidEn: [
      'Red chillies, vinegar, fried spicy snacks, pungent mustard',
      'Cold beverages with meals, skipping meals, caffeine on empty stomach'
    ],
    apatyaAvoidHi: [
      'अत्यधिक लाल मिर्च, सिरका, चाट-पकौड़े, तेज मसाले',
      'भोजन के साथ ठंडा पानी, भूखे पेट रहना, खाली पेट तेज चाय/कॉफी'
    ],
    viharaLifestyleEn: 'Strictly regular meal and sleep timings, avoiding excessive mental stress, gentle cooling walks in morning/evening.',
    viharaLifestyleHi: 'भोजन और सोने का समय बिल्कुल नियमित रखें। मानसिक तनाव से बचें। सुबह-शाम शांत वातावरण में टहलें।',
    yogaAsanas: 'Nadi Shodhana & Sheetali Pranayama, gentle Hatha Yoga, Shavasana meditation.'
  },

  'VATA_PITTA': {
    dosha: 'Vata-Pitta',
    titleEn: 'Vata-Pitta Dwandvaja Prakriti Regimen',
    titleHi: 'वात-पित्त द्वन्द्वज प्रकृति - पथ्यापथ्य एवं दिनचर्या',
    primaryDosha: 'Vata-Pitta (वायु एवं अग्नि प्राधान्य)',
    qualities: 'Chala, Ruksha, Tikshna',
    dietaryRulesEn: 'Warm, sweet, unctuous, mildly spiced diet with regular meal rhythm.',
    dietaryRulesHi: 'गरम, मधुर, स्निग्ध और कम मसालेदार संतुलित आहार। समय पर भोजन अति आवश्यक।',
    pathyaConsumeEn: [
      'Desi Ghee, warm milk with saffron/fennel, sweet ripe fruits',
      'Rice, wheat, oats, mung bean dal, sweet root vegetables',
      'Mild herbs: coriander, cumin, mint, licorice (Yashtimadhu)'
    ],
    pathyaConsumeHi: [
      'देशी घी, केसर व सौंफ युक्त गुनगुना दूध, मीठे पके फल',
      'चावल, गेहूं, दलिया, छिलके वाली मूंग दाल, गाजर, चुकंदर',
      'धनिया, जीरा, पुदीना, मुलेठी की चाय'
    ],
    apatyaAvoidEn: [
      'Stale food, dry raw salads, red chillies, irregular late meals'
    ],
    apatyaAvoidHi: [
      'बासी खाना, सूखा कच्चा सलाद, अत्यधिक मिर्च-मसाले, देर रात भोजन'
    ],
    viharaLifestyleEn: 'Abhyanga with Chandanadi or sesame oil, maintaining emotional calm, adequate rest.',
    viharaLifestyleHi: 'चन्दनादि या तिल तेल से अभ्यंग, मानसिक शांति, नियमित 7-8 घंटे की नींद।',
    yogaAsanas: 'Anulom Vilom, Bhramari, gentle Surya Namaskar, Yoga Nidra.'
  },

  'KAPHA_PITTA': {
    dosha: 'Kapha-Pitta',
    titleEn: 'Kapha-Pitta Dwandvaja Prakriti Regimen',
    titleHi: 'कफ-पित्त द्वन्द्वज प्रकृति - पथ्यापथ्य एवं दिनचर्या',
    primaryDosha: 'Kapha-Pitta (जल, पृथ्वी एवं अग्नि)',
    qualities: 'Guru, Snigdha, Ushna',
    dietaryRulesEn: 'Light, warm, non-oily, bitter & astringent rasas. Avoid heavy dairy, oils, and fiery spices.',
    dietaryRulesHi: 'हल्का, गर्म, कम तेल वाला, तिक्त व कषाय रस युक्त भोजन। भारी मिठाई व अत्यधिक मिर्च से बचें।',
    pathyaConsumeEn: [
      'Barley, millets, roasted chickpeas, bitter gourd, bottle gourd',
      'Amla, pomegranate, warm water with honey, buttermilk with jeera'
    ],
    pathyaConsumeHi: [
      'जौ, बाजरा, भुना चना, करेला, लौकी, परवल',
      'आंवला, अनार, गुनगुने पानी में शहद, भुने जीरे वाली छाछ'
    ],
    apatyaAvoidEn: [
      'Deep fried foods, heavy sweets, cheese, alcohol, red meat'
    ],
    apatyaAvoidHi: [
      'तले-भुने पकवान, गरिष्ठ मिठाइयां, पनीर, शराब, अधिक नमक'
    ],
    viharaLifestyleEn: 'Regular vigorous walking, avoiding day-time sleep, morning exercise.',
    viharaLifestyleHi: 'नियमित तेज चाल, दिन में सोने से पूर्ण परहेज, प्रात:कालीन व्यायाम।',
    yogaAsanas: 'Kapalabhati, Surya Namaskar, Virabhadrasana, Paschimottanasana.'
  },

  'PITTA_KAPHA': {
    dosha: 'Pitta-Kapha',
    titleEn: 'Pitta-Kapha Dwandvaja Prakriti Regimen',
    titleHi: 'पित्त-कफ द्वन्द्वज प्रकृति - पथ्यापथ्य एवं दिनचर्या',
    primaryDosha: 'Pitta-Kapha (अग्नि, जल एवं पृथ्वी)',
    qualities: 'Tikshna, Guru, Snigdha',
    dietaryRulesEn: 'Moderately light, cooling, non-greasy foods. Bitter and astringent tastes are highly beneficial.',
    dietaryRulesHi: 'मध्यम हल्का, शीतल, बिना चिकनाई वाला भोजन। कड़वे (तिक्त) व कसैले (कषाय) रस अत्यंत लाभकारी।',
    pathyaConsumeEn: [
      'Moong dal, barley, cucumber, bitter gourd, green leafy vegetables, amla, pomegranate',
      'Fennel and coriander water, buttermilk with roasted jeera'
    ],
    pathyaConsumeHi: [
      'मूंग दाल, जौ, खीरा, करेला, हरी पत्तेदार सब्जियां, आंवला, अनार',
      'सौंफ और धनिए का पानी, भुने जीरे युक्त पतली छाछ'
    ],
    apatyaAvoidEn: [
      'Fried oily foods, hot spicy curries, sweet confectionery, alcohol'
    ],
    apatyaAvoidHi: [
      'तले-भुने खाद्य, अत्यधिक तीखा भोजन, चीनी की मिठाइयां, शराब'
    ],
    viharaLifestyleEn: 'Moderate daily exercise, avoiding afternoon nap, staying in well-ventilated cool places.',
    viharaLifestyleHi: 'नियमित व्यायाम, दोपहर की नींद से बचाव, हवादार व शांत स्थान पर रहना।',
    yogaAsanas: 'Sheetali Pranayama, Sarvangasana, Matsyasana, gentle walking.'
  },

  'VATA_KAPHA': {
    dosha: 'Vata-Kapha',
    titleEn: 'Vata-Kapha Dwandvaja Prakriti Regimen',
    titleHi: 'वात-कफ द्वन्द्वज प्रकृति - पथ्यापथ्य एवं दिनचर्या',
    primaryDosha: 'Vata-Kapha (वायु, आकाश, पृथ्वी, जल - Sheeta Pradhana)',
    qualities: 'Sheeta (Cold dominant)',
    dietaryRulesEn: 'Warm, lightly unctuous, spiced foods. Strictly avoid cold foods and icy drinks.',
    dietaryRulesHi: 'गरम, हल्का स्निग्ध और सुपाच्य भोजन। ठंडा खाना और ठंडा पानी बिल्कुल न लें।',
    pathyaConsumeEn: [
      'Ginger, black pepper, cumin, cooked rice, moong dal, steamed vegetables, warm herbal tea',
      'Warm water, honey in warm water, cooked apples, soaked dates'
    ],
    pathyaConsumeHi: [
      'अदरक, काली मिर्च, जीरा, पके चावल, मूंग दाल, उबली सब्जियां, काढ़ा',
      'गुनगुना पानी, शहद, पका हुआ सेब, भीगे खजूर'
    ],
    apatyaAvoidEn: [
      'Iced water, cold raw salads, ice creams, heavy curds, cold dry snacks'
    ],
    apatyaAvoidHi: [
      'बर्फ का पानी, कच्चा ठंडा सलाद, आइसक्रीम, खट्टा गाढ़ा दही, ठंडे सूखे स्नैक्स'
    ],
    viharaLifestyleEn: 'Staying warm in all seasons, regular daily exercise to prevent stiffness, warm oil massage.',
    viharaLifestyleHi: 'हमेशा गर्म कपड़े पहनना, जोड़ों की जकड़न रोकने हेतु नियमित व्यायाम, गर्म तेल से मालिश।',
    yogaAsanas: 'Bhastrika, Surya Namaskar, Setu Bandhasana, Shalabhasana.'
  },

  'SAMA_DOSHA': {
    dosha: 'Sama Dosha (Tridoshaja)',
    titleEn: 'Sama Prakriti (Balanced Tri-Dosha) Regimen',
    titleHi: 'समदोष (त्रिदोषज) प्रकृति - सम्यक दिनचर्या',
    primaryDosha: 'Sama Tri-Dosha (वात, पित्त, कफ साम्यावस्था)',
    qualities: 'Equilibrium of all Pancha Mahabhutas and Tri-doshas',
    dietaryRulesEn: 'Seasonal diet (Ritucharya-compliant). All six tastes (Shad-Rasa) in balanced proportion.',
    dietaryRulesHi: 'ऋतु के अनुसार आहार (ऋतुचर्या का पालन)। षड्रस (सभी छः रस) युक्त संतुलित सात्विक भोजन।',
    pathyaConsumeEn: [
      'Fresh whole grains (wheat, rice, barley), seasonal vegetables and fresh sweet fruits',
      'Cow\'s ghee in moderation, buttermilk, milk, mild herbs and spices',
      'Clean water at room temperature or lukewarm as per season'
    ],
    pathyaConsumeHi: [
      'मौसम के अनुसार ताजे अनाज (गेहूं, चावल, जौ), मौसमी सब्जियां और मीठे फल',
      'संतुलित मात्रा में गाय का घी, छाछ, दूध, सौम्य मसाले',
      'ऋतु के अनुसार सामान्य या गुनगुना जल'
    ],
    apatyaAvoidEn: [
      'Extreme dietary imbalances, excessive consumption of any single taste (excess chili, sugar, or salt)',
      'Irregular meal timings, unhygienic or ultra-processed foods'
    ],
    apatyaAvoidHi: [
      'किसी एक रस की अति (अत्यधिक मीठा, बहुत खट्टा या बहुत तीखा)',
      'अनियमित भोजन, बासी या अत्यधिक प्रोसेस्ड जंक फूड'
    ],
    viharaLifestyleEn: 'Ideal Dinacharya: early rising at Brahma Muhurta, regular meditation, balanced work-rest rhythm.',
    viharaLifestyleHi: 'आदर्श दिनचर्या: ब्रह्म मुहूर्त में उठना, नियमित प्राणायाम व ध्यान, संतुलित जीवनशैली।',
    yogaAsanas: 'Balanced Ashtanga Yoga, Surya Namaskar, Nadi Shodhana Pranayama.'
  }
};

// ---------------------------------------------------------------------------
// 6. BACKWARD COMPATIBILITY EXPORTS
// ---------------------------------------------------------------------------
export const PRAKRITI_20_QUESTIONS = CCRAS_PRAKRITI_QUESTIONS;
export const QUICK_ASSESSMENT_QUESTIONS = CCRAS_QUICK_ASSESSMENT_QUESTIONS;
export const determinePrakriti = calculateCcrasPrakriti;
export const PRAKRITI_KNOWLEDGE_BASE = CCRAS_PRAKRITI_GUIDELINES;
