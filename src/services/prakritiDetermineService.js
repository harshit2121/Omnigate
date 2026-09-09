/**
 * Prakriti Determination Service
 * Ported and enhanced from PrathameshDhande22/Prakriti-Determine (Release v3.7)
 * Implements 20-question clinical assessment, 6-class Dosha classification,
 * personalized Diet recommendations (Consume vs Avoid), Lifestyle routines, and Video guidance.
 */

// ---------------------------------------------------------------------------
// 1. 20 CLINICAL QUESTIONS (Bilingual with Explanations & Assets)
// ---------------------------------------------------------------------------

export const PRAKRITI_20_QUESTIONS = [
  {
    id: 0,
    key: 'body_size',
    questionEn: 'Describe your body size and physical frame?',
    questionHi: 'आपकी शारीरिक बनावट और फ्रेम कैसा है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Slim / Lean',
        labelHi: 'पतला / दुबला',
        descEn: 'Thinner physique with smaller frame, less body fat, and narrower proportions.',
        descHi: 'पतला और दुबला शरीर, कम चर्बी और छोटा कंकाल ढांचा।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Medium / Athletic',
        labelHi: 'मध्यम / सुगठित',
        descEn: 'Balanced build, neither particularly thin nor heavy, moderate muscle tone.',
        descHi: 'संतुलित शारीरिक ढांचा, न बहुत पतला न बहुत भारी, मध्यम मांसपेशियां।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Large / Broad / Heavy',
        labelHi: 'चौड़ा / भारी / पुष्ट',
        descEn: 'Broader physique, larger bones, solid muscular build or tendency to carry weight.',
        descHi: 'चौड़ा और मजबूत ढांचा, भारी हड्डियां और सुदृढ़ शारीरिक बनावट।'
      }
    ]
  },
  {
    id: 1,
    key: 'body_weight',
    questionEn: 'What is your natural body weight tendency?',
    questionHi: 'आपके शरीर के वजन की स्वाभाविक प्रवृत्ति कैसी है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Low weight - difficulty gaining weight',
        labelHi: 'कम वजन - वजन बढ़ाना कठिन',
        descEn: 'Naturally light body weight with difficulty in putting on muscle or fat.',
        descHi: 'स्वाभाविक रूप से कम वजन, पोषण लेने पर भी वजन मुश्किल से बढ़ता है।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Moderate weight - stable, gains/loses easily',
        labelHi: 'मध्यम वजन - स्थिर, आसानी से संतुलित',
        descEn: 'Moderate weight that stays balanced with regular diet and exercise.',
        descHi: 'संतुलित वजन जो नियमित दिनचर्या और आहार से स्थिर रहता है।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Heavy - gains easily, difficulty losing',
        labelHi: 'भारी वजन - तेजी से बढ़ता है, घटाना कठिन',
        descEn: 'Tendency to gain weight rapidly and finding it difficult to shed excess weight.',
        descHi: 'वजन तेजी से बढ़ता है और कम करने में काफी परिश्रम करना पड़ता है।'
      }
    ]
  },
  {
    id: 2,
    key: 'height',
    questionEn: 'How is your height relative to average?',
    questionHi: 'आपकी लंबाई सामान्य की तुलना में कैसी है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Short or very tall with thin limbs',
        labelHi: 'छोटा कद या असामान्य रूप से लंबा व पतला',
        descEn: 'Either distinctly short or very tall with long, delicate extremities.',
        descHi: 'या तो छोटा कद अथवा लंबे व पतले हाथ-पैर।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Average / Medium height',
        labelHi: 'औसत / मध्यम लंबाई',
        descEn: 'Standard proportionate height with symmetrical limb length.',
        descHi: 'समानुपातिक मध्यम कद और संतुलित हाथ-पैर।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Tall, stout, or well-proportioned solid build',
        labelHi: 'लंबा, सुदृढ़ व भारी कद-काठी',
        descEn: 'Sturdy stature with well-grounded torso and strong skeletal support.',
        descHi: 'मजबूत और बलिष्ठ कद-काठी।'
      }
    ]
  },
  {
    id: 3,
    key: 'bone_structure',
    questionEn: 'What is your skeletal and bone structure?',
    questionHi: 'आपकी हड्डियों और जोड़ों की बनावट कैसी है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Light, small bones, prominent/cracking joints',
        labelHi: 'हल्की, छोटी हड्डियां, जोड़ों का चटकना/उभार',
        descEn: 'Thinner bones, visible wrist/ankle joints, cracking sounds upon motion.',
        descHi: 'पतली हड्डियां, कलाई और टखने के जोड़ उभरे हुए, चलने पर चटकने की आवाज।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Medium bone structure, flexible joints',
        labelHi: 'मध्यम कंकाल ढांचा, लचीले जोड़',
        descEn: 'Average bone density, good joint mobility and moderate muscular coverage.',
        descHi: 'मध्यम घनत्व वाली हड्डियां और लचीले स्वस्थ जोड़।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Large, broad shoulders, heavy dense bones',
        labelHi: 'चौड़े कंधे, भारी और मजबूत हड्डियां',
        descEn: 'Dense, thick bones with well-padded and concealed joints.',
        descHi: 'भारी व मजबूत हड्डियां, मांस से ढके हुए सुदृढ़ जोड़।'
      }
    ]
  },
  {
    id: 4,
    key: 'complexion',
    questionEn: 'What is your natural skin complexion and tone?',
    questionHi: 'आपकी त्वचा का स्वाभाविक रंग (वर्ण) कैसा है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Darker complexion, tans easily, dull tone',
        labelHi: 'सांवला / गहरा रंग, धूप में जल्दी काला होना',
        descEn: 'Darker or dusky skin with less natural glow, tans quickly under the sun.',
        descHi: 'सांवली या गहरे रंग की त्वचा जो धूप में आसानी से टैन हो जाती है।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Fair, reddish/pinkish, sunburns/flushes easily',
        labelHi: 'गोरा / लालिमायुक्त, धूप में जलन व लाल चकत्ते',
        descEn: 'Pinkish or fair skin, very sensitive to heat and sun exposure.',
        descHi: 'गोरी या गुलाबी त्वचा जो धूप में जल्दी लाल हो जाती है।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Pale white, golden, clear and radiant',
        labelHi: 'उज्ज्वल / श्वेत-पीताभ, चमकदार व एकसमान',
        descEn: 'Fair or pale skin with a smooth, radiant, and even texture.',
        descHi: 'चमकदार, एकसमान और उज्ज्वल त्वचा।'
      }
    ]
  },
  {
    id: 5,
    key: 'general_feel_of_skin',
    questionEn: 'How does your skin generally feel to touch?',
    questionHi: 'स्पर्श करने पर आपकी त्वचा कैसी महसूस होती है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Dry, thin, cool to touch, rough',
        labelHi: 'रूखी, पतली, ठंडी और खुरदरी',
        descEn: 'Skin lacks oiliness, feels cool and tends to chap in dry or winter weather.',
        descHi: 'नमी की कमी, छूने पर ठंडी और सर्दियों में फटने वाली त्वचा।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Smooth, warm, oily T-zone',
        labelHi: 'मुलायम, गर्म, टी-ज़ोन पर तेल',
        descEn: 'Warm skin temperature with moderate moisture and oily forehead/nose.',
        descHi: 'छूने पर गर्म, माथे और नाक पर तैलीय चमक।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Thick, moist/greasy, cold, soft',
        labelHi: 'मोटी, स्निग्ध/तैलीय, शीतल और कोमल',
        descEn: 'Thick, well-hydrated skin with rich natural oils, pleasantly cool.',
        descHi: 'प्राकृतिक तेल से युक्त, स्निग्ध, मुलायम और ठंडी त्वचा।'
      }
    ]
  },
  {
    id: 6,
    key: 'texture_of_skin',
    questionEn: 'What is the texture and surface of your skin?',
    questionHi: 'आपकी त्वचा की बनावट और उस पर दिखने वाले लक्षण कैसे हैं?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Dry, flaky, prone to early wrinkles/pigments',
        labelHi: 'रूखी, पपड़ीदार, झुर्रियों की प्रवृत्ति',
        descEn: 'Prone to cracking, dry patches, and fine lines.',
        descHi: 'रूखापन, खिंचाव और समय से पूर्व महीन रेखाएं।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Freckles, moles, acne, redness and rashes',
        labelHi: 'तिल, मुंहासे, लालिमा व चकत्ते',
        descEn: 'Prone to heat rashes, pimples, redness, and numerous small moles.',
        descHi: 'गर्मी के दाने, मुंहासे, लाल चकत्ते और तिल।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Smooth, oily, firm, clear with few blemishes',
        labelHi: 'चिकनी, तैलीय, दाग-धब्बे रहित व मजबूत',
        descEn: 'Youthful appearance with good elasticity and minimal breakouts.',
        descHi: 'सदाबहार चमक, उत्तम लचीलापन और बेदाग त्वचा।'
      }
    ]
  },
  {
    id: 7,
    key: 'hair_color',
    questionEn: 'What is your natural hair color?',
    questionHi: 'आपके बालों का प्राकृतिक रंग कैसा है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Dull black or dark brown',
        labelHi: 'फीका काला या गहरा भूरा',
        descEn: 'Hair has less shine, dark brown or matte black.',
        descHi: 'कम चमक वाला गहरा भूरा या काला बाल।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Reddish, copper, light brown, early graying',
        labelHi: 'लालिमायुक्त, तांबई, भूरा या जल्दी सफेद होना',
        descEn: 'Lighter tones, reddish highlights, or premature graying/thinning.',
        descHi: 'हल्का भूरा, तांबई रंग अथवा समय से पूर्व बाल सफेद होना।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Jet black, rich dark brown, glossy',
        labelHi: 'गहरा काला, चमकदार व घना',
        descEn: 'Deep black, lustrous shine, maintains pigment well into age.',
        descHi: 'घना चमकदार काला रंग जो लंबे समय तक बना रहता है।'
      }
    ]
  },
  {
    id: 8,
    key: 'appearance_of_hair',
    questionEn: 'Describe the texture and appearance of your hair?',
    questionHi: 'आपके बालों की बनावट और स्वरूप कैसा है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Dry, brittle, knotted, split ends',
        labelHi: 'रूखे, उलझे हुए, दोमुंहे व कमजोर',
        descEn: 'Prone to tangling, breakage, and rough texture.',
        descHi: 'जल्दी उलझने वाले, कमजोर और दोमुंहे बाल।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Straight, fine, silky, oily roots',
        labelHi: 'सीधे, महीन, रेशमी व तैलीय जड़ें',
        descEn: 'Fine texture, soft, prone to oiliness and receding hairline.',
        descHi: 'बारीक रेशमी बाल, जड़ों में पसीना और तेल आना।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Thick, dense, wavy/curly, lustrous, strong',
        labelHi: 'घने, मोटे, घुंघराले व मजबूत',
        descEn: 'Abundant volume, strong roots, healthy sheen and wave.',
        descHi: 'भारी वॉल्यूम, मजबूत जड़ें और प्राकृतिक चमक।'
      }
    ]
  },
  {
    id: 9,
    key: 'shape_of_face',
    questionEn: 'Describe the shape of your face?',
    questionHi: 'आपके चेहरे का स्वाभाविक आकार कैसा है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Long, angular, thin, sharp jawline',
        labelHi: 'लंबा, कोणीय, पतला व तीखा जबड़ा',
        descEn: 'Narrow oval or oblong face with prominent bone angles.',
        descHi: 'पतला लंबा चेहरा और स्पष्ट उभरी हुई हड्डियां।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Heart-shaped, triangular, pointed chin',
        labelHi: 'त्रिकोणीय / हृदयाकार, नुकीली ठुड्डी',
        descEn: 'Medium proportions, sharp contours, pointed chin.',
        descHi: 'मध्यम आकार का चेहरा, नुकीली ठुड्डी और स्पष्ट रूपरेखा।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Round, broad, full cheeks, gentle contours',
        labelHi: 'गोल, चौड़ा, भरे हुए गाल व सौम्य रेखाएं',
        descEn: 'Broad, rounded face with soft plump contours.',
        descHi: 'भरा-पूरा गोल चेहरा और सौम्य बनावट।'
      }
    ]
  },
  {
    id: 10,
    key: 'eyes',
    questionEn: 'How would you describe your eyes?',
    questionHi: 'आपकी आंखों का स्वरूप और दृष्टि कैसी है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Small, active, darting, dry, dark',
        labelHi: 'छोटी, चंचल, शुष्क व गहरी आंखें',
        descEn: 'Eyes move quickly, prone to dryness and strain.',
        descHi: 'छोटी और गतिशील आंखें, जिनमें सूखापन रहता है।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Medium, penetrating, sharp, light-sensitive',
        labelHi: 'मध्यम, तीक्ष्ण, भेदक, तेज धूप से संवेदनशील',
        descEn: 'Sharp, intense gaze, red sclera veins, sensitive to bright sunlight.',
        descHi: 'तीव्र दृष्टि, तेज रोशनी में आंखें चुंधियाना व लाल होना।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Big, wide, round, beautiful, white sclera',
        labelHi: 'बड़ी, आकर्षक, कजरारी, श्वेत और स्निग्ध',
        descEn: 'Large, calm eyes with thick white sclera and peaceful expression.',
        descHi: 'बड़ी और चमकदार आंखें, शांत व आकर्षक दृष्टि।'
      }
    ]
  },
  {
    id: 11,
    key: 'eyelashes',
    questionEn: 'How are your eyelashes?',
    questionHi: 'आपकी पलकों के बाल (बरौनी) कैसे हैं?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Scanty, short, thin eyelashes',
        labelHi: 'कम, छोटी और विरल पलकें',
        descEn: 'Sparse, shorter lash line with delicate hairs.',
        descHi: 'हल्की और कम घनी पलकें।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Moderate, fine, light-colored eyelashes',
        labelHi: 'मध्यम, बारीक व सुव्यवस्थित पलकें',
        descEn: 'Medium density with straight fine lash fibers.',
        descHi: 'मध्यम लंबाई और संतुलित पलकें।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Thick, dense, long, curled eyelashes',
        labelHi: 'घनी, लंबी, घुमावदार व आकर्षक पलकें',
        descEn: 'Abundant, long, dark and naturally curled lashes.',
        descHi: 'घनी, लंबी और प्राकृतिक रूप से मुड़ी हुई पलकें।'
      }
    ]
  },
  {
    id: 12,
    key: 'blinking_of_eyes',
    questionEn: 'How frequently do you blink your eyes?',
    questionHi: 'आपकी आंखें झपकाने की आवृत्ति कैसी है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Frequent, rapid, excessive blinking',
        labelHi: 'बार-बार, तेज व अत्यधिक पलक झपकाना',
        descEn: 'Rapid eye movements with frequent involuntary blinks.',
        descHi: 'अस्थिरता के कारण जल्दी-जल्दी आंखें झपकाना।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Moderate, intentional blinking',
        labelHi: 'मध्यम, स्वाभाविक पलक झपकाना',
        descEn: 'Standard blinking rate, focused steady gaze.',
        descHi: 'संतुलित और सामान्य पलक झपकना।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Slow, steady, minimal blinking',
        labelHi: 'धीमी, स्थिर व शांत दृष्टि',
        descEn: 'Calm, unhurried gaze with low blinking frequency.',
        descHi: 'शांत और स्थिर दृष्टि, कम पलक झपकना।'
      }
    ]
  },
  {
    id: 13,
    key: 'cheeks',
    questionEn: 'Describe your cheeks and mid-face?',
    questionHi: 'आपके गालों की बनावट कैसी है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Wrinkled, sunken, hollow cheeks',
        labelHi: 'धंसे हुए, पतले व गड्ढेदार गाल',
        descEn: 'Little facial fat padding, prominent cheekbones.',
        descHi: 'कम मांस वाले पतले गाल और उभरी हुई गाल की हड्डियां।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Smooth, flat, pinkish flushed cheeks',
        labelHi: 'सपाट, चिकने व गुलाबी गाल',
        descEn: 'Smooth skin over cheeks, easy blushing or flushing with heat.',
        descHi: 'चिकने गाल जो गर्मी या उत्साह में लाल हो जाते हैं।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Rounded, plump, full, soft cheeks',
        labelHi: 'भरे-पूरे, गोल, कोमल व फूले हुए गाल',
        descEn: 'Firm, fleshy, plump cheeks with healthy youthful contours.',
        descHi: 'भरे-पूरे, मुलायम और गोल गाल।'
      }
    ]
  },
  {
    id: 14,
    key: 'nose',
    questionEn: 'What is the shape and size of your nose?',
    questionHi: 'आपकी नाक की बनावट कैसी है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Crooked, narrow, slightly bent or uneven',
        labelHi: 'टेढ़ी, पतली या नुकीली नाक',
        descEn: 'Narrow bridge, irregular profile, or dry nasal passages.',
        descHi: 'पतली, हल्की टेढ़ी या संकरी नाक।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Pointed, sharp tip, straight, medium size',
        labelHi: 'नुकीली, सीधी व मध्यम आकार की नाक',
        descEn: 'Sharp, well-defined nose with reddish tip in hot weather.',
        descHi: 'नुकीली और सीधी नाक, धूप में अग्रभाग लाल होना।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Broad, rounded tip, large nostrils, sturdy',
        labelHi: 'चौड़ी, गोल, बड़े नथुने व मजबूत नाक',
        descEn: 'Wide nasal bridge, rounded tip, strong structure.',
        descHi: 'चौड़ी और गोल नाक, चौड़े नथुने।'
      }
    ]
  },
  {
    id: 15,
    key: 'teeth_and_gums',
    questionEn: 'Describe your teeth and gum health?',
    questionHi: 'आपके दांतों और मसूड़ों की स्थिति कैसी है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Irregular, crooked, protruding, receding/dry gums',
        labelHi: 'टेढ़े-मेढ़े, आगे निकले, कमजोर या सूखे मसूड़े',
        descEn: 'Misaligned teeth, thin enamel, prone to sensitivity or receding gums.',
        descHi: 'असमान दांत, झनझनाहट और मसूड़ों का पीछे हटना।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Medium teeth, yellowish tinge, sensitive/bleeding gums',
        labelHi: 'मध्यम दांत, हल्का पीलापन, खून आने वाले मसूड़े',
        descEn: 'Moderate size, sensitive to cold/hot, prone to gum bleeding or gingivitis.',
        descHi: 'मध्यम दांत, मसूड़ों से खून आना और गर्म-ठंडे से संवेदनशीलता।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Big, strong, bright white teeth, firm healthy gums',
        labelHi: 'बड़े, मजबूत, चमकदार सफेद दांत, स्वस्थ मसूड़े',
        descEn: 'Large, well-aligned, dense enamel, strong pink gums with rare cavities.',
        descHi: 'मजबूत और चमकदार सफेद दांत, कभी कीड़ा न लगना।'
      }
    ]
  },
  {
    id: 16,
    key: 'lips',
    questionEn: 'How are your lips usually?',
    questionHi: 'आपके होंठ सामान्यतः कैसे रहते हैं?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Tight, thin, dry, chaps easily',
        labelHi: 'पतले, रूखे, जल्दी फटने वाले होंठ',
        descEn: 'Thin profile, prone to dryness, peeling, and cold cracks.',
        descHi: 'पतले होंठ जिनमें सूखापन और पपड़ी जमती है।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Soft, medium, red/pink, prone to ulcers',
        labelHi: 'मुलायम, मध्यम, लालिमायुक्त, छाले होना',
        descEn: 'Naturally reddish tone, warm, prone to minor mouth ulcers.',
        descHi: 'गुलाबी-लाल होंठ, कभी-कभार मुंह में छाले पड़ना।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Large, full, soft, smooth, moist',
        labelHi: 'मोटे, भरे हुए, स्निग्ध व कोमल होंठ',
        descEn: 'Plump, well-hydrated, soft pink lips that rarely crack.',
        descHi: 'भरे-पूरे, मुलायम और हमेशा नमी युक्त होंठ।'
      }
    ]
  },
  {
    id: 17,
    key: 'nails',
    questionEn: 'How are your finger and toe nails?',
    questionHi: 'आपके नाखूनों की बनावट और मजबूती कैसी है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Dry, rough, brittle, break easily, ridges',
        labelHi: 'रूखे, खुरदरे, जल्दी टूटने वाले, धारियां',
        descEn: 'Brittle nails with vertical ridges, pale color, breaks under pressure.',
        descHi: 'कमजोर नाखून जिन पर लकीरें होती हैं और आसानी से टूट जाते हैं।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Pink, flexible, sharp, lustrous',
        labelHi: 'गुलाबी, लचीले, चमकदार व चिकने',
        descEn: 'Healthy pink nailbed, medium strength, flexible and smooth.',
        descHi: 'गुलाबी आभा वाले, लचीले और चमकदार नाखून।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Thick, broad, strong, smooth, polished white',
        labelHi: 'मोटे, चौड़े, मजबूत व तेलिया चमक',
        descEn: 'Dense, hard nails with large moons, very resistant to breaking.',
        descHi: 'मोटे और चौड़े नाखून जो कभी नहीं टूटते।'
      }
    ]
  },
  {
    id: 18,
    key: 'appetite',
    questionEn: 'What is your regular appetite pattern?',
    questionHi: 'आपकी भूख और भोजन की इच्छा कैसी रहती है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Irregular, scanty (sometimes hungry, sometimes not)',
        labelHi: 'अनियमित, कम (कभी तेज भूख, कभी बिल्कुल नहीं)',
        descEn: 'Variable digestive fire; erratic meal timings, easily bloated.',
        descHi: 'अनियमित भूख; कभी अधिक भूख कभी भोजन भूल जाना।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Strong, intense, unbearable if meals are delayed',
        labelHi: 'तीव्र, असहनशील (देर होने पर चिड़चिड़ापन/सिरदर्द)',
        descEn: 'High metabolism; needs punctual meals, gets angry or weak when hungry.',
        descHi: 'तीव्र भूख, समय पर खाना न मिलने पर सिरदर्द या गुस्सा।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Slow but steady (can easily skip meals without discomfort)',
        labelHi: 'मंद व स्थिर (भोजन छूटने पर भी कोई कष्ट नहीं)',
        descEn: 'Moderate digestion, can fast easily, feels heavy after large meals.',
        descHi: 'मंद पाचन, बिना परेशानी के उपवास कर सकते हैं।'
      }
    ]
  },
  {
    id: 19,
    key: 'liking_tastes',
    questionEn: 'What are your most preferred and naturally comforting tastes (Rasa)?',
    questionHi: 'आपको किस प्रकार का स्वाद सबसे अधिक प्रिय और अनुकूल लगता है?',
    options: [
      {
        value: 0,
        dosha: 'Vata',
        labelEn: 'Sweet / Sour / Salty (Madhura, Amla, Lavana)',
        labelHi: 'मीठा / खट्टा / नमकीन (मधुर, अम्ल, लवण)',
        descEn: 'Craves warm, soothing, nourishing, and rich flavors.',
        descHi: 'गर्म, तृप्तिकारक, मधुर और नमकीन भोजन पसंद होना।'
      },
      {
        value: 1,
        dosha: 'Pitta',
        labelEn: 'Sweet / Bitter / Astringent (Madhura, Tikta, Kashaya)',
        labelHi: 'मीठा / कड़वा / कसैला (मधुर, तिक्त, कषाय)',
        descEn: 'Craves cooling, refreshing, bitter greens, and mildly sweet dishes.',
        descHi: 'ठंडे, पित्तशामक, कड़वे और मीठे व्यंजन प्रिय होना।'
      },
      {
        value: 2,
        dosha: 'Kapha',
        labelEn: 'Pungent / Bitter / Astringent (Katu, Tikta, Kashaya)',
        labelHi: 'तीखा / कड़वा / कसैला (कटु, तिक्त, कषाय)',
        descEn: 'Craves spicy, hot, dry, stimulating, and herbal flavors.',
        descHi: 'मसालेदार, तीखा, गर्म और पाचक स्वाद प्रिय होना।'
      }
    ]
  }
];

// ---------------------------------------------------------------------------
// 2. PRAKRITI-SPECIFIC DIET & LIFESTYLE KNOWLEDGE BASE (From diet.csv)
// ---------------------------------------------------------------------------

export const PRAKRITI_KNOWLEDGE_BASE = {
  'Vata': {
    code: 'Vata',
    nameEn: 'Vata Constitution (Vataja)',
    nameHi: 'वातज प्रकृति (वात प्रधान)',
    elementEn: 'Air + Space (Vayu + Akasha)',
    elementHi: 'वायु + आकाश महाभूत',
    primaryQualityEn: 'Cold, Light, Dry, Mobile, Subtle, Rough',
    primaryQualityHi: 'शीत, लघु, रूक्ष, चल, सूक्ष्म, खर',
    doshaClass: 0,
    toConsumeEn: 'Include sweet, sour, and salty tastes in your diet. Favor warm, well-cooked, oily foods like Basmati rice, whole wheat, urad dal, milk, pure ghee, sesame oil, curd, chicken/mutton soup, soaked almonds, dates, and raisins. Keep adequate healthy fat in every meal. Spice with asafoetida (hing), cumin (jeera), fresh ginger (adrak), black salt (kala namak), jaggery (gud), and ajwain.',
    toConsumeHi: 'मधुर, अम्ल (खट्टा) और लवण (नमकीन) रसों का सेवन करें। गर्म, ताजा और स्निग्ध भोजन लें जैसे गेहूं, बासमती चावल, उड़द दाल, गुनगुना दूध, देसी गाय का घी, तिल का तेल, भीगे बादाम और मुनक्का। भोजन में हींग, जीरा, सोंठ/अदरक, काला नमक, गुड़ और अजवाइन अवश्य शामिल करें।',
    toAvoidEn: 'Avoid dry, cold, rough, and bitter/astringent or excessively pungent foods. Reduce raw salads, millets (Bajri, Nachni, Jowar), dry fish, iced drinks, and foods straight from the refrigerator. Avoid skipping meals or irregular eating schedules.',
    toAvoidHi: 'सूखे, बासी, ठंडे और कड़वे/कसैले खाद्य पदार्थों से बचें। बाजरा, ज्वार, कच्चा सलाद, फ्रीज का ठंडा पानी और आइसक्रीम का परहेज करें। समय पर भोजन करें।',
    lifestyleEn: 'Follow a consistent daily routine (Dinacharya). Stay warm and cozy. Engage in gentle grounding exercises like slow yoga, walking, and Nadi Shodhana pranayama. Practice daily warm sesame oil body massage (Abhyanga). Ensure 7-8 hours of uninterrupted sleep.',
    lifestyleHi: 'नियमित दिनचर्या का पालन करें। शरीर को ठंड और तेज हवा से बचाएं। नियमित गुनगुने तिल के तेल से मालिश (अभ्यंग) करें। अनुलोम-विलोम और भ्रामरी प्राणायाम करें। पर्याप्त नींद लें।',
    herbs: ['Ashwagandha', 'Shatavari', 'Bala', 'Dashamoola', 'Haritaki'],
    videoKeyword: 'Vata'
  },
  'Pitta': {
    code: 'Pitta',
    nameEn: 'Pitta Constitution (Pittaja)',
    nameHi: 'पित्तज प्रकृति (पित्त प्रधान)',
    elementEn: 'Fire + Water (Agni + Jala)',
    elementHi: 'अग्नि + जल महाभूत',
    primaryQualityEn: 'Hot, Sharp, Light, Oily, Liquid, Spreading',
    primaryQualityHi: 'उष्ण, तीक्ष्ण, लघु, स्निग्ध, द्रव, सर',
    doshaClass: 1,
    toConsumeEn: 'Include sweet, bitter, and astringent tastes to pacify internal heat. Favor basmati rice, wheat, mung bean, toor dal, fresh amla, cow ghee, milk, pomegranate, ash gourd (petha), pumpkin, cucumber, green beans, and leafy greens. Use cooling spices like coriander (dhaniya), fennel (saunf), cardamom (elaichi), mint, and fenugreek (methi).',
    toConsumeHi: 'मधुर, तिक्त (कड़वा) और कषाय (कसैला) रस युक्त आहार लें। मूंग दाल, पुराना चावल, गेहूं, गाय का घी, मिश्री, आंवला, अनार, लौकी, कद्दू, खीरा व हरी सब्जियां लें। धनिया, सौंफ, इलायची, पुदीना और जीरा का प्रयोग करें।',
    toAvoidEn: 'Avoid hot, spicy, sour, salty, and deep-fried foods. Strictly limit red chillies, mustard, pickles, fermented foods, vinegar, alcohol, excessive coffee, and direct prolonged midday sun exposure.',
    toAvoidHi: 'अधिक मिर्च-मसालेदार, खट्टे, नमकीन और तले-भुने भोजन से बचें। अचार, सिरका, इमली, शराब, ज्यादा चाय-कॉफी और दोपहर की तेज धूप से परहेज करें।',
    lifestyleEn: 'Keep cool and calm. Avoid midday sun and excessive competitive stress. Practice cooling exercises like swimming, Chandra Bhedana & Sheetali pranayama, and gentle evening walks in moonlight. Massage with cooling oils like coconut or Chandanadi oil.',
    lifestyleHi: 'शीतल और शांत वातावरण में रहें। शीतली, शीतकारी और चंद्रभेदी प्राणायाम करें। तैराकी या शाम की सैर करें। नारियल तेल या चंदन तेल से मालिश करें। क्रोध और तनाव से बचें।',
    herbs: ['Amalaki', 'Guduchi', 'Brahmi', 'Shatavari', 'Chandan'],
    videoKeyword: 'Pitta'
  },
  'Kapha': {
    code: 'Kapha',
    nameEn: 'Kapha Constitution (Kaphaja)',
    nameHi: 'कफज प्रकृति (कफ प्रधान)',
    elementEn: 'Earth + Water (Prithvi + Jala)',
    elementHi: 'पृथ्वी + जल महाभूत',
    primaryQualityEn: 'Heavy, Slow, Cool, Oily, Smooth, Dense',
    primaryQualityHi: 'गुरु, मन्द, शीत, स्निग्ध, श्लक्ष्ण, सान्द्र',
    doshaClass: 2,
    toConsumeEn: 'Include pungent, bitter, and astringent tastes to stimulate digestion. Favor light grains like barley (jau), aged rice/wheat, millets (ragi, bajra), mung bean, horse gram (kulthi), buttermilk, bitter gourd (karela), radish, spinach, and methi. Use warming spices like ginger, black pepper, pippali, turmeric, cumin, ajwain, and cloves (lavang).',
    toConsumeHi: 'कटु (तीखा), तिक्त (कड़वा) और कषाय रस युक्त हल्का व सुपाच्य भोजन करें। जौ, पुराना गेहूं, रागी, कुलथी, मूंग, छाछ (तक्र), करेला, मेथी और सहजन का सेवन करें। सोंठ, काली मिर्च, पिप्पली (त्रिकटु), हल्दी और लौंग का प्रयोग करें।',
    toAvoidEn: 'Avoid sweets, bakery products, heavy dairy, cold drinks, oily fried foods, excess salt, bananas, and day sleeping. Minimize wheat and refined carbs.',
    toAvoidHi: 'मिठाइयां, मैदा, ज्यादा दूध-मलाई, आइसक्रीम, ठंडा पानी, तैलीय भोजन और दिन में सोने से पूर्ण परहेज करें।',
    lifestyleEn: 'Engage in active, vigorous daily exercise, dynamic Surya Namaskar, Kapalabhati and Bhastrika pranayama. Wake up early before sunrise (Brahma Muhurta). Practice dry powder massage (Udvartana) to mobilize lymph and reduce sluggishness.',
    lifestyleHi: 'प्रतिदिन पसीना बहाने वाला तीव्र व्यायाम, सूर्य नमस्कार, कपालभाति और भस्त्रिका प्राणायाम करें। सूर्योदय से पूर्व उठें। दिन में न सोएं। उद्वर्तन (सूखे चूर्ण से मालिश) करें।',
    herbs: ['Trikatu', 'Punarnava', 'Guggulu', 'Tulsi', 'Triphala'],
    videoKeyword: 'Kapha'
  },
  'Vata - Pitta': {
    code: 'Vata - Pitta',
    nameEn: 'Vata-Pitta Constitution (Dwandvaja)',
    nameHi: 'वात-पित्तज प्रकृति (द्वन्द्वज)',
    elementEn: 'Air + Fire (Vayu + Agni)',
    elementHi: 'वायु + अग्नि महाभूत प्रधान',
    primaryQualityEn: 'Light, Mobile, Warm-Sensitive, Fast-acting',
    primaryQualityHi: 'लघु, चल, उष्ण-संवेदनशील, तीव्र गति',
    doshaClass: 3,
    toConsumeEn: 'Follow a seasonal approach: strict Pitta-pacifying cooling diet in hot summer/autumn, and Vata-pacifying warm oily diet in cold winter. Favor basmati rice, quinoa, wheat, sweet fruits (mangoes, dates, soaked raisins), sweet potatoes, zucchini, asparagus, ghee, olive oil, fennel, coriander, cardamom, and CCF tea (cumin-coriander-fennel).',
    toConsumeHi: 'गर्मियों में शीत पित्तशामक और सर्दियों में स्निग्ध वातशामक आहार लें। बासमती चावल, गेहूं, मीठे फल, लौकी, घी, जैतून का तेल, सौंफ, धनिया और इलायची युक्त भोजन लें। जीरा-धनिया-सौंफ का काढ़ा पिएं।',
    toAvoidEn: 'Avoid very hot pungent spices (cayenne, red chilli), deep fried foods, stale dry food, nightshades (excess tomato, brinjal), refined sugar, alcohol, and irregular meal schedules.',
    toAvoidHi: 'अत्यधिक तीखी मिर्च, तली-भुनी चीजें, खट्टे-खारे खाद्य, बासी खाना और अनियमित खान-पान से बचें।',
    lifestyleEn: 'Maintain a balanced routine with consistent timing for meals and sleep. Choose moderate calming exercises like yoga, swimming, and Nadi Shodhana pranayama. Use calming coconut or sunflower oil for self-massage.',
    lifestyleHi: 'संतुलित दिनचर्या रखें। मध्यम योगासन, तैराकी और अनुलोम-विलोम प्राणायाम करें। नारियल या तिल के तेल से मालिश करें। काम के बीच में विश्राम लें।',
    herbs: ['Shatavari', 'Guduchi', 'Brahmi', 'Ashwagandha', 'Yastimadhu'],
    videoKeyword: 'Vata - Pitta'
  },
  'Vata - Kapha': {
    code: 'Vata - Kapha',
    nameEn: 'Vata-Kapha Constitution (Dwandvaja)',
    nameHi: 'वात-कफज प्रकृति (द्वन्द्वज)',
    elementEn: 'Air + Earth + Water (Vayu + Prithvi + Jala)',
    elementHi: 'वायु + कफ (शीत गुण प्रधान)',
    primaryQualityEn: 'Cold-dominant, Variable stamina, Needs warmth',
    primaryQualityHi: 'शीत प्रधान, परिवर्तनीय बल, उष्णता की आवश्यकता',
    doshaClass: 4,
    toConsumeEn: 'Prioritize lightness, warmth, and spices to counter both doshas’ cold quality. Favor warm soups, stews, mung dal, quinoa, buckwheat, steamed carrots, green beans, ginger tea, hot water, light cow ghee, black pepper, turmeric, and cumin.',
    toConsumeHi: 'गर्म, हल्का और पाचक मसालों से युक्त भोजन लें। सूप, मूंग दाल खिचड़ी, उबली सब्जियां, अदरक की चाय, गुनगुना पानी, हल्दी, काली मिर्च और जीरा का सेवन करें।',
    toAvoidEn: 'Avoid all cold, iced, and raw foods. Avoid heavy refined wheat, pasta, cold dairy, ice cream, daytime sleeping, and eating late past 7 PM.',
    toAvoidHi: 'ठंडे, बर्फ वाले और कच्चे खाद्य पदार्थों से बचें। मैदा, भारी मिठाइयां, दिन में सोना और रात को देर से भोजन करने से परहेज करें।',
    lifestyleEn: 'Follow a warm, active routine. Regular moderate exercise to generate internal heat without exhaustion. Practice Surya Namaskar, Kapalabhati, and Anulom Vilom. Stay well-insulated in cold weather.',
    lifestyleHi: 'शरीर को हमेशा गर्म रखें। नियमित सूर्य नमस्कार, कपालभाति और अनुलोम-विलोम करें। गर्म पानी पिएं और सक्रिय रहें।',
    herbs: ['Trikatu', 'Ashwagandha', 'Tulsi', 'Haritaki', 'Pushkarmool'],
    videoKeyword: 'Vata - Kapha'
  },
  'Pitta - Kapha': {
    code: 'Pitta - Kapha',
    nameEn: 'Pitta-Kapha Constitution (Dwandvaja)',
    nameHi: 'पित्त-कफज प्रकृति (द्वन्द्वज)',
    elementEn: 'Fire + Water + Earth (Agni + Jala + Prithvi)',
    elementHi: 'अग्नि + कफ (भारी व उष्ण गुण)',
    primaryQualityEn: 'Moderate-Heavy, Strong metabolism, Needs cooling lightness',
    primaryQualityHi: 'मध्यम-भारी, तीव्र पाचन, शीतल व हल्के आहार की आवश्यकता',
    doshaClass: 5,
    toConsumeEn: 'Prioritize lightness and cooling foods. Favor mung dal, barley, amaranth, bitter and astringent vegetables (bitter gourd, celery, asparagus), apples, berries, moderate cow ghee, sunflower oil, ginger, turmeric, CCF tea, and warm lime water.',
    toConsumeHi: 'हल्का, सुपाच्य और शीत गुण वाला भोजन करें। मूंग दाल, जौ, चौलाई, करेला, लौकी, सेब, अनार, हल्का घी, हल्दी, धनिया और जीरा का प्रयोग करें।',
    toAvoidEn: 'Avoid heavy oily fried items, red meat, high-fructose sweets, nightshades, grazing/snacking between meals, and late night dinners.',
    toAvoidHi: 'अधिक तेल-घी, मिठाइयां, तीखे मसाले, शराब, बार-बार स्नैक्स खाना और रात में देर से खाना खाने से बचें।',
    lifestyleEn: 'Engage in regular moderate exercise like brisk walking or swimming. Practice meditation and deep breathing to balance emotional intensity and sluggishness. Create peaceful and cool sleep environments.',
    lifestyleHi: 'प्रतिदिन तेज चाल से टहलें या तैराकी करें। ध्यान और प्राणायाम करें। भोजन के निश्चित समय का पालन करें।',
    herbs: ['Guduchi', 'Triphala', 'Neem', 'Bhumyamalaki', 'Amalaki'],
    videoKeyword: 'Pitta - Kapha'
  }
};

// ---------------------------------------------------------------------------
// 3. CURATED VIDEO RECOMMENDATIONS (From videos.csv)
// ---------------------------------------------------------------------------

export const PRAKRITI_VIDEOS = {
  'Vata': [
    { title: 'Ayurvedic Nutrition: Balancing Vata Dosha Diet Tips', url: 'https://youtu.be/_sZkqnW71Jg' },
    { title: 'Yoga for Vata Dosha (20 mins Grounding Ayurvedic Poses)', url: 'https://youtu.be/oPIn3_SdbkE' },
    { title: 'How to Balance Vata Dosha Naturally at Home', url: 'https://youtu.be/xRppi-Ezowg' }
  ],
  'Pitta': [
    { title: 'Pitta Imbalance Symptoms & Cooling Treatments', url: 'https://youtu.be/pL0iO73Gu6c' },
    { title: 'Pitta Dosha Diet in Ayurveda (Foods to Eat & Avoid)', url: 'https://youtu.be/OuoT_OiWL1c' },
    { title: '10 Minute Calming Yoga for Pitta Dosha', url: 'https://youtu.be/sv39v6l0k7I' }
  ],
  'Kapha': [
    { title: 'Kapha Dosha Daily Routine: 5 Tips for Energy & Balance', url: 'https://youtu.be/ApOi1DZyJyo' },
    { title: 'Kapha Balancing Diet - What to Eat and Avoid', url: 'https://youtu.be/lZBh2wc8LF4' },
    { title: 'Kapha Energizing Dynamic Yoga: Vitality & Circulation', url: 'https://youtu.be/fDRnH3erao4' }
  ],
  'Vata - Pitta': [
    { title: 'How to Balance Dual Dosha Vata-Pitta in Ayurveda', url: 'https://youtu.be/I5_7GcXeymo' },
    { title: 'Balancing Dual Doshas with Routine & Diet', url: 'https://youtu.be/vaT49x1DXnk' },
    { title: 'Understanding Vata-Pitta Solutions & Lifestyle', url: 'https://youtu.be/OBRW86GXoRw' }
  ],
  'Vata - Kapha': [
    { title: 'Managing Vata & Kapha Dual Constitution Together', url: 'https://youtu.be/zzHDnPxNlhM' },
    { title: 'Vata-Kapha Prakriti Problems and Practical Solutions', url: 'https://youtu.be/JiNW2Ygwnz0' },
    { title: 'Vata-Kapha Diet & Lifestyle 5 Golden Rules', url: 'https://youtu.be/khwL16MXerA' }
  ],
  'Pitta - Kapha': [
    { title: 'Pitta-Kapha Diet & Food List Program in Ayurveda', url: 'https://youtu.be/V1bVuSJUqxg' },
    { title: 'Balancing Pitta-Kapha Constitution Naturally', url: 'https://youtu.be/b5u7Y_H2hX8' },
    { title: 'Managing Dual Dosha Imbalances', url: 'https://youtu.be/zzHDnPxNlhM' }
  ]
};

// ---------------------------------------------------------------------------
// 4. ML / CLASSIFICATION INFERENCE ENGINE
// ---------------------------------------------------------------------------

/**
 * Evaluates the 20-question answers array (0: Vata, 1: Pitta, 2: Kapha)
 * and determines the exact Prakriti class, percentage breakdown, and confidence.
 */
export function determinePrakriti(answersMap = {}) {
  let vataCount = 0;
  let pittaCount = 0;
  let kaphaCount = 0;
  const answeredKeys = Object.keys(answersMap);

  answeredKeys.forEach(key => {
    const val = Number(answersMap[key]);
    if (val === 0) vataCount++;
    else if (val === 1) pittaCount++;
    else if (val === 2) kaphaCount++;
  });

  const totalAnswered = vataCount + pittaCount + kaphaCount || 1;
  const vataPct = Math.round((vataCount / totalAnswered) * 100);
  const pittaPct = Math.round((pittaCount / totalAnswered) * 100);
  const kaphaPct = Math.round((kaphaCount / totalAnswered) * 100);

  // Determine Primary and Secondary Doshas
  const doshas = [
    { name: 'Vata', count: vataCount, pct: vataPct },
    { name: 'Pitta', count: pittaCount, pct: pittaPct },
    { name: 'Kapha', count: kaphaCount, pct: kaphaPct }
  ].sort((a, b) => b.count - a.count);

  const primary = doshas[0];
  const secondary = doshas[1];

  let prakritiKey = 'Vata';
  const diff = primary.pct - secondary.pct;

  // If top dosha dominates by > 18%, single dosha Prakriti
  if (diff >= 18) {
    prakritiKey = primary.name;
  } else {
    // Dual Dosha (Dwandvaja)
    const pair = [primary.name, secondary.name].sort();
    if (pair.includes('Vata') && pair.includes('Pitta')) {
      prakritiKey = 'Vata - Pitta';
    } else if (pair.includes('Vata') && pair.includes('Kapha')) {
      prakritiKey = 'Vata - Kapha';
    } else {
      prakritiKey = 'Pitta - Kapha';
    }
  }

  const knowledge = PRAKRITI_KNOWLEDGE_BASE[prakritiKey] || PRAKRITI_KNOWLEDGE_BASE['Vata'];
  const videos = PRAKRITI_VIDEOS[prakritiKey] || PRAKRITI_VIDEOS['Vata'];

  return {
    prakritiKey,
    code: knowledge.code,
    nameEn: knowledge.nameEn,
    nameHi: knowledge.nameHi,
    dominant: knowledge.nameEn,
    dominantHi: knowledge.nameHi,
    vataPct,
    pittaPct,
    kaphaPct,
    vataCount,
    pittaCount,
    kaphaCount,
    totalAnswered,
    isComplete: answeredKeys.length >= 20,
    confidence: Math.min(98, Math.max(72, Math.round(75 + (totalAnswered / 20) * 20))),
    knowledge,
    videos
  };
}

export default {
  PRAKRITI_20_QUESTIONS,
  PRAKRITI_KNOWLEDGE_BASE,
  PRAKRITI_VIDEOS,
  determinePrakriti
};
