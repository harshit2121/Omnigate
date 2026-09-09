/**
 * AI Dynamic Clinical Question & SOCRATES Symptom Engine
 * Fetches dynamic, adaptive medical questions based on selected department and complaint.
 * 100% Online Keyless Public AI with fast multi-model fallbacks.
 */

class DynamicClinicalAiService {
  /**
   * Generates dynamic questions in real-time for any department/symptom.
   * @param {string} departmentId - e.g. 'dermatology', 'cardiology', 'orthopedics', 'neurology', etc.
   * @param {object} complaint - e.g. { id: 'skin_allergy', label: 'Skin Rash / Itching', hi: 'त्वचा पर खुजली / चकत्ते' }
   * @param {string} currentLang - 'hi' | 'en'
   * @returns {Promise<Array>} Array of customized SOCRATES clinical questions
   */
  async generateQuestionsForComplaint(departmentId, complaint, currentLang = 'hi') {
    const symptomName = complaint.label || 'Symptom';
    const symptomHi = complaint.hi || 'लक्षण';

    const systemPrompt = `You are an expert Chief Medical Officer and Clinical AI at a Hospital & Ayush OPD Kiosk.
Create exactly 5 comprehensive, highly tailored SOCRATES clinical intake questions with separate English and Hindi options for:
Department: "${departmentId}"
Chief Complaint: "${symptomName}" (${symptomHi})

The questions must cover:
1. Exact anatomical site/location of the symptom
2. Onset timing, triggers, or duration
3. Character, sensation, or visual appearance
4. Associated clinical warning signs / accompanying symptoms (isMulti: true)
5. Severity rating / impact on daily life

Return ONLY a valid JSON array of objects. No explanation or markdown text.
Format schema:
[
  {
    "id": "site",
    "field": "site",
    "textEn": "Where is the primary site of your symptom?",
    "textHi": "शरीर में इस लक्षण का मुख्य स्थान कौन सा है?",
    "optionsEn": [
      "Localized to specific area",
      "Upper body & Head",
      "Lower body & Limbs",
      "Spread across whole body"
    ],
    "optionsHi": [
      "निश्चित स्थान पर",
      "ऊपरी शरीर व सिर में",
      "निचले शरीर व हाथ-पैर में",
      "पूरे शरीर में फैला हुआ"
    ],
    "isMulti": false
  }
]`;

    // 1. Primary Free Online AI Gateway (Pollinations.ai Keyless Serverless Engine)
    try {
      const response = await fetch('https://text.pollinations.ai/openai/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Generate 5 structured SOCRATES clinical intake questions with optionsEn and optionsHi for Department: ${departmentId}, Complaint: ${symptomName} (${symptomHi}).` }
          ],
          temperature: 0.1
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length >= 4) {
            return this._normalizeQuestionOptions(parsed);
          }
        }
      }
    } catch (err) {
      console.warn('Pollinations primary AI endpoint error, trying fallback:', err);
    }

    // Fallback: Dynamic Universal Synthesizer with clean separate English and Hindi options
    return this._synthesizeGenericSocratesQuestions(departmentId, symptomName, symptomHi);
  }

  _normalizeQuestionOptions(questions) {
    return questions.map(q => {
      const optionsEn = q.optionsEn || q.options?.map(opt => this._extractLangString(opt, 'en')) || [];
      const optionsHi = q.optionsHi || q.options?.map(opt => this._extractLangString(opt, 'hi')) || [];
      return {
        ...q,
        optionsEn,
        optionsHi,
        options: optionsEn // default
      };
    });
  }

  _extractLangString(str, lang) {
    if (typeof str !== 'string') return str;
    const match = str.match(/(.*?)\s*\((.*?)\)/);
    if (match) {
      return lang === 'hi' ? match[2].trim() : match[1].trim();
    }
    return str;
  }

  /**
   * Universal dynamic SOCRATES question generator with distinct English and Hindi options.
   */
  _synthesizeGenericSocratesQuestions(departmentId, symptomName, symptomHi) {
    const deptTitle = departmentId.replace(/_/g, ' ').toUpperCase();

    return [
      {
        id: 'site',
        field: 'site',
        textEn: `Where is the primary location of your ${symptomName.toLowerCase()}?`,
        textHi: `शरीर में ${symptomHi} का मुख्य स्थान कौन सा है?`,
        optionsEn: [
          `Localized to specific ${deptTitle} region`,
          'Upper body & Head region',
          'Lower body & Limbs',
          'Generalized throughout the whole body'
        ],
        optionsHi: [
          'विशेष स्थान पर सीमित',
          'ऊपरी शरीर व सिर में',
          'निचले शरीर व हाथ-पैर में',
          'पूरे शरीर में फैला हुआ'
        ],
        isMulti: false
      },
      {
        id: 'onset',
        field: 'onset',
        textEn: `How and when did this ${symptomName.toLowerCase()} begin?`,
        textHi: `यह समस्या कब और कैसे शुरू हुई?`,
        optionsEn: [
          'Acute onset within the last 24–48 hours',
          'Developing gradually over 1 to 2 weeks',
          'Recurring episodes over several months',
          'Triggered after specific food, exertion or weather'
        ],
        optionsHi: [
          'अचानक पिछले 24-48 घंटों में',
          '1 से 2 सप्ताह से धीरे-धीरे',
          'महीनों से रुक-रुक कर',
          'विशेष खान-पान, श्रम या मौसम के बाद'
        ],
        isMulti: false
      },
      {
        id: 'character',
        field: 'character',
        textEn: `How would you describe the feeling and nature of this symptom?`,
        textHi: `इस तकलीफ का प्रकार और अहसास कैसा है?`,
        optionsEn: [
          'Sharp, burning, or stabbing sensation',
          'Dull continuous aching heaviness',
          'Spasmodic / fluctuating in waves',
          'Stiffness, itching, or physical restriction'
        ],
        optionsHi: [
          'तीखा, जलन या चुभन जैसा अहसास',
          'लगातार धीमा भारीपन व दर्द',
          'लहरों में आने-जाने वाला दर्द',
          'जकड़न, खुजली या चलने-फिरने में रुकावट'
        ],
        isMulti: false
      },
      {
        id: 'associated',
        field: 'associatedSymptoms',
        textEn: `Which accompanying signs or symptoms are you also experiencing?`,
        textHi: `साथ में इनमें से कौन से अन्य लक्षण भी महसूस हो रहे हैं?`,
        optionsEn: [
          'Fever, chills, or elevated temperature',
          'Severe fatigue, weakness, or body ache',
          'Sleep, appetite, or digestion disturbance',
          'Swelling, redness, or visible irritation',
          'None of the above'
        ],
        optionsHi: [
          'बुखार या कपकंपी',
          'अत्यधिक थकान व कमजोरी',
          'नींद या भूख में रुकावट',
          'सूजन या लाली',
          'इनमें से कोई नहीं'
        ],
        isMulti: true
      },
      {
        id: 'severity',
        field: 'severityScore',
        textEn: `How severe is this symptom on a scale of 1 to 10?`,
        textHi: `1 से 10 के पैमाने पर इस समस्या की तीव्रता कितनी है?`,
        optionsEn: [
          'Mild (1 - 3) — Normal daily activity',
          'Moderate (4 - 6) — Disrupting routine work',
          'Severe (7 - 8) — Requires rest & medication',
          'Critical / Unbearable (9 - 10) — Immediate care needed'
        ],
        optionsHi: [
          'हल्की (1 - 3) — सामान्य दिनचर्या जारी',
          'मध्यम (4 - 6) — कामकाज में परेशानी',
          'गंभीर (7 - 8) — आराम व दवा आवश्यक',
          'असहनीय (9 - 10) — तत्काल डॉक्टर की जरूरत'
        ],
        isMulti: false
      }
    ];
  }
}

export const dynamicClinicalAiService = new DynamicClinicalAiService();
export default dynamicClinicalAiService;
