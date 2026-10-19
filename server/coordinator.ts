import { GoogleGenAI } from '@google/genai';
import { processSafetyAndPrompt, SafetyCheckResult } from './safety';
import { retrieveEducationalEvidence, RetrievalResult } from './rag';
import { verifyAnswerAgainstEvidence, VerificationReport } from './verification';
import { formatSeniorExplanation } from './explanation';
import { Database, InteractionRecord } from './db';

// Gemini SDK Client Initialization on Server
const apiKey = process.env.GEMINI_API_KEY?.trim() || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

export interface CoordinatorRequest {
  question: string;
  participantId?: string;
  inputModality?: 'text' | 'voice';
  language?: 'en' | 'hi' | 'mr';
  simplicityLevel?: 'standard' | 'ultra_simple';
}

export interface CoordinatorResponse {
  interaction: InteractionRecord;
  agentName: string;
  answer: string;
  verification: VerificationReport;
  safety: SafetyCheckResult;
}

// Multi-Agent Specialist Knowledge & Fallback Responses (7 Specialized Agents)
export const SPECIALIST_AGENTS = {
  safety: {
    name: 'Safety Agent',
    description: 'Identifies scam, fraud, and credential risks to protect older adults.',
    en: "Let's keep your information completely safe.\n\n1. Never share your OTP, PIN, password, or CVV with anyone.\n2. Avoid clicking suspicious links inside text messages or emails.\n3. Never install remote-access apps (AnyDesk, TeamViewer) on a stranger's request.\n4. Call your bank using only the official phone number printed on the back of your card.\n5. In India, call the National Cyber Crime Helpline at 1930 if you suspect fraud.",
    hi: "आइए अपनी जानकारी को पूरी तरह सुरक्षित रखें:\n\n1. कभी भी अपना OTP, PIN या पासवर्ड किसी से शेयर न करें।\n2. अनजान मैसेज में आए लिंक पर क्लिक न करें।\n3. फोन पर किसी के कहने पर AnyDesk या TeamViewer जैसे ऐप डाउनलोड न करें।\n4. बैंक से जुड़ी समस्या के लिए सिर्फ कार्ड के पीछे लिखे नंबर पर कॉल करें।\n5. साइबर धोखाधड़ी होने पर तुरंत 1930 पर कॉल करें।",
    mr: "आपली माहिती पूर्णपणे सुरक्षित ठेवूया:\n\n1. तुमचा OTP, PIN किंवा पासवर्ड कोणालाही सांगू नका.\n2. मेसेजमधील संशयास्पद लिंकवर कधीही क्लिक करू नका.\n3. अनोळखी व्यक्तीच्या सांगण्यावरून कोणताही अॅप इन्स्टॉल करू नका.\n4. बँकेच्या अधिकृत नंबरसाठी कार्डाच्या मागील क्रमांकावर संपर्क साधा.\n5. फसवणूक झाल्यास लगेच 1930 वर संपर्क साधा.",
  },
  communication: {
    name: 'Communication Agent',
    description: 'Teaches messaging (WhatsApp), phone calls, email, and video calls.',
    en: "Staying connected with family is wonderful!\n\n1. To make a video call: Open WhatsApp, tap your family member’s name, and tap the Video Camera icon at the top right.\n2. To send a voice message: Hold down the green microphone icon next to the typing area, speak, and let go to send.\n3. To share a photo: Tap the paperclip icon, select Photos, and choose your picture.",
    hi: "परिवार से जुड़े रहना बहुत आसान है!\n\n1. वीडियो कॉल के लिए: व्हाट्सएप खोलें, अपने परिजन के नाम पर टैप करें और ऊपर दाईं ओर वीडियो कैमरा आइकन छुएं।\n2. बोलकर संदेश भेजने के लिए: हरे रंग के माइक बटन को दबाकर रखें, बोलें और छोड़ दें।\n3. फोटो भेजने के लिए: पेपरक्लिप आइकन पर टैप करके फोटो चुनें।",
    mr: "कुटुंबाशी जोडलेले राहणे खूप सोपे आहे!\n\n1. व्हिडिओ कॉलसाठी: व्हॉट्सअॅप उघडा, व्यक्तीच्या नावावर टॅप करा आणि वरील व्हिडिओ कॅमेरा चिन्हावर टॅप करा.\n2. व्हॉइस मेसेजसाठी: हिरवे माइक चिन्ह दाबून बोला आणि सोडून द्या.\n3. फोटो पाठवण्यासाठी: पेपरक्लिप चिन्हावर टॅप करून फोटो निवडा.",
  },
  accessibility: {
    name: 'Accessibility Agent',
    description: 'Configures large fonts, high contrast, screen magnification, and display zoom.',
    en: "Let's make your screen easy and comfortable for your eyes:\n\n1. Open Settings on your phone.\n2. Tap 'Display' or 'Accessibility'.\n3. Tap 'Font Size' or 'Text Size'.\n4. Drag the round slider to the right to make words larger and easier to read.\n5. Turn on 'Bold Text' to make words darker and clearer.",
    hi: "आइए स्क्रीन को आपकी आंखों के लिए आरामदायक बनाएं:\n\n1. फोन की 'सेटिंग्स' (Settings) खोलें।\n2. 'Display' या 'Accessibility' पर टैप करें।\n3. 'Font Size' चुनें और नीले गोले को दाईं ओर खिसकाएं।\n4. अक्षरों को अधिक गहरा करने के लिए 'Bold Text' चालू करें।",
    mr: "चला स्क्रीन तुमच्या डोळ्यांसाठी आरामदायी करूया:\n\n1. फोनची 'Settings' उघडा.\n2. 'Display' किंवा 'Accessibility' वर टॅप करा.\n3. 'Font Size' निवडून स्लाइडर उजवीकडे सरकवा.\n4. अक्षरे ठळक करण्यासाठी 'Bold Text' चालू करा.",
  },
  support: {
    name: 'Support Agent',
    description: 'Offers patient, calm reassurance when technology feels overwhelming.',
    en: "That is completely okay! We will learn slowly, one step at a time.\n\nTell me what you see on your screen right now, and I will guide you through the next simple step.\n\nRemember: You cannot break your phone by tapping the screen. Take a deep breath—I am right here with you.",
    hi: "यह बिल्कुल सामान्य है! हम धीरे-धीरे, एक-एक कदम करके सीखेंगे।\n\nमुझे बताएं कि अभी आपके फोन पर क्या दिख रहा है। मैं आपकी पूरी मदद करूंगा।\n\nचिंता मत कीजिए—स्क्रीन छूने से फोन खराब नहीं होता। मैं आपके साथ हूं।",
    mr: "काळजी करू नका! तंत्रज्ञान नवीन वाटू शकतं, पण आपण हळूहळू शिकूया.\n\nसध्या तुमच्या स्क्रीनवर काय दिसत आहे ते मला सांगा. मी तुम्हाला पुढची सोपी पायरी समजावून सांगेन.\n\nस्क्रीनवर टॅप केल्याने फोन बिघडत नाही, त्यामुळे धीर धरा.",
  },
  feedback: {
    name: 'Feedback Agent',
    description: 'Explains feedback ratings and helps refine Buddy’s teaching quality.',
    en: "Thank you for helping Buddy improve!\n\n• Good (😊): The answer was clear and helped you.\n• Okay (😐): The answer helped a little, or could be simpler.\n• Not Good (🙁): The answer was confusing or did not help.\n\nPlease choose the rating below that best matches your experience.",
    hi: "बडी को बेहतर बनाने में मदद के लिए धन्यवाद!\n\n• अच्छा (Good 😊): उत्तर स्पष्ट और मददगार रहा।\n• ठीक (Okay 😐): थोड़ा समझ आया, लेकिन और सरल हो सकता था।\n• अच्छा नहीं (Not Good 🙁): उत्तर समझ नहीं आया।\n\nकृपया नीचे दिए गए बटनों में से अपनी रेटिंग चुनें।",
    mr: "बडीला अधिक उपयुक्त बनवण्यासाठी धन्यवाद!\n\n• छान (Good 😊): उत्तर समजले आणि मदत झाली.\n• ठीक (Okay 😐): थोडी मदत झाली, पण अधिक सोपे हवे होते.\n• समाधानकारक नाही (Not Good 🙁): मदत झाली नाही.\n\nकृपया खालील बटणांमधून आपले मत नोंदवा.",
  },
  learning: {
    name: 'Learning Agent',
    description: 'Explains everyday technology and smartphone basics with clear numbered steps.',
    en: "I am happy to guide you step by step!\n\nPlease tell me what device you are using (such as an Android phone or an iPhone) and what you want to learn. I will explain it in simple, calm words without technical jargon.",
    hi: "मैं आपको कदम-दर-कदम सिखाने के लिए तैयार हूं!\n\nकृपया बताएं कि आप कौन सा फोन इस्तेमाल कर रहे हैं (जैसे Android या iPhone) और आप क्या सीखना चाहते हैं। मैं बहुत आसान शब्दों में समझाऊंगा।",
    mr: "मी तुम्हाला टप्प्याटप्प्याने मार्गदर्शन करतो!\n\nतुम्ही कोणता फोन वापरत आहात (Android की iPhone) आणि तुम्हाला काय शिकायचे आहे ते सांगा. मी अगदी सोप्या शब्दांत समजावून सांगेन.",
  },
};

// Coordinator Agent Selection Logic
export function selectSpecialistAgent(sanitizedQuery: string): string {
  const qLower = sanitizedQuery.toLowerCase();

  // Safety Agent triggers
  const safetyKeywords = [
    'otp', 'password', 'pin', 'bank', 'scam', 'fraud', 'suspicious', 'upi',
    'cvv', 'card', 'hacker', 'phishing', 'threat', 'anydesk', 'teamviewer', 'पिन', 'पासवर्ड', 'फसवणूक'
  ];
  if (safetyKeywords.some((w) => qLower.includes(w))) {
    return 'Safety Agent';
  }

  // Communication Agent triggers
  const commKeywords = [
    'whatsapp', 'video call', 'message', 'voice note', 'email', 'gmail', 'call',
    'photos', 'gallery', 'camera', 'send image', 'व्हॉट्सअॅप', 'कॉल', 'मेसेज'
  ];
  if (commKeywords.some((w) => qLower.includes(w))) {
    return 'Communication Agent';
  }

  // Accessibility Agent triggers
  const accessKeywords = [
    'font size', 'text bigger', 'large text', 'magnify', 'display zoom', 'bold text',
    'eyes', 'vision', 'read', 'volume', 'loud', 'अक्षर', 'मोठे', 'फॉन्ट'
  ];
  if (accessKeywords.some((w) => qLower.includes(w))) {
    return 'Accessibility Agent';
  }

  // Support Agent triggers
  const supportKeywords = [
    'confused', 'worried', 'afraid', 'cannot understand', "don't understand",
    'scared', 'panic', 'stuck', 'lost', 'help me', 'भीती', 'गोंधळ', 'डर', 'घबरा'
  ];
  if (supportKeywords.some((w) => qLower.includes(w))) {
    return 'Support Agent';
  }

  // Feedback Agent triggers
  const feedbackKeywords = ['feedback', 'rating', 'rate answer', 'अभिप्राय', 'सुझाव'];
  if (feedbackKeywords.some((w) => qLower.includes(w))) {
    return 'Feedback Agent';
  }

  // Default: Learning Agent
  return 'Learning Agent';
}

export async function coordinateAndAnswer(
  req: CoordinatorRequest
): Promise<CoordinatorResponse> {
  const startTime = Date.now();
  const participantId = req.participantId || 'senior_learner_1';
  const language = req.language || 'en';
  const inputModality = req.inputModality || 'text';
  const simplicityLevel = req.simplicityLevel || 'standard';

  // 1. Safety and Prompt Processing
  const safety = processSafetyAndPrompt(req.question, language);

  let agentName = 'Learning Agent';
  let generatedAnswer = '';
  let retrievedChunks: RetrievalResult[] = [];

  if (!safety.isSafe) {
    // High-risk prompt or scam attempt: Override with Safety Agent
    agentName = 'Safety Agent';
    generatedAnswer = safety.safeGuidance || SPECIALIST_AGENTS.safety[language];
  } else {
    // 2. Multi-Agent Coordinator Intent Routing
    agentName = selectSpecialistAgent(safety.sanitizedQuery);

    // 3. Educational RAG Retrieval
    retrievedChunks = retrieveEducationalEvidence(safety.sanitizedQuery, 2);

    // 4. Gemini Answer Generation Grounded in Evidence
    if (ai) {
      try {
        const evidenceContext =
          retrievedChunks.length > 0
            ? retrievedChunks
                .map((r, i) => `[Doc ${i + 1}: ${r.chunk.docTitle}]\n${r.chunk.content}`)
                .join('\n\n')
            : 'No direct educational document match. Provide safe, encouraging, step-by-step general guidance.';

        const languageInstructions =
          language === 'hi'
            ? 'Respond completely in simple, respectful Hindi (हिन्दी), using polite language for older adults (आप, कीजिए).'
            : language === 'mr'
            ? 'Respond completely in simple, respectful Marathi (मराठी), using polite language for older adults (तुम्ही, करा).'
            : 'Respond in clear, simple English without technical jargon.';

        const systemPrompt = `You are Buddy, a patient, kind AI educational tutor designed specifically for older adults.

Key Educational Guidelines:
- Language: ${languageInstructions}
- Simplicity Level: ${simplicityLevel === 'ultra_simple' ? 'Extra simple, very short sentences, numbered 1-2-3 steps only.' : 'Clear, friendly, short numbered steps with warm encouragement.'}
- Specialist Agent Selected: ${agentName}
- Grounding: Answer strictly using the verified educational evidence when available. Do NOT fabricate instructions or invent device features.
- Safety: NEVER ask for passwords, PINs, OTPs, or bank account details. Do not claim to access the user's phone directly.
- Format:
  1. Start with a direct, warm 1-sentence answer.
  2. Provide 3 to 5 short numbered steps.
  3. Include a comforting closing note asking if they would like to practice step 1 together.

Verified Educational Evidence:
${evidenceContext}

User's Question:
"${safety.sanitizedQuery}"`;

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 3500)
        );

        const response: any = await Promise.race([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: systemPrompt,
          }),
          timeoutPromise,
        ]);

        if (response && response.text && response.text.trim()) {
          generatedAnswer = response.text.trim();
        }
      } catch (err) {
        console.warn('Gemini generateContent fallback:', err);
      }
    }

    // Built-in specialist agent fallback if Gemini is offline or unavailable
    if (!generatedAnswer) {
      if (retrievedChunks.length > 0) {
        const topChunk = retrievedChunks[0].chunk;
        generatedAnswer = `${topChunk.docTitle}:\n\n${topChunk.content}\n\n(Tip: Take your time. Would you like me to explain any step more simply?)`;
      } else {
        if (agentName === 'Safety Agent') {
          generatedAnswer = SPECIALIST_AGENTS.safety[language];
        } else if (agentName === 'Communication Agent') {
          generatedAnswer = SPECIALIST_AGENTS.communication[language];
        } else if (agentName === 'Accessibility Agent') {
          generatedAnswer = SPECIALIST_AGENTS.accessibility[language];
        } else if (agentName === 'Support Agent') {
          generatedAnswer = SPECIALIST_AGENTS.support[language];
        } else if (agentName === 'Feedback Agent') {
          generatedAnswer = SPECIALIST_AGENTS.feedback[language];
        } else {
          generatedAnswer = SPECIALIST_AGENTS.learning[language];
        }
      }
    }
  }

  // 5. Verification Agent Stage
  const verification = verifyAnswerAgainstEvidence(
    generatedAnswer,
    retrievedChunks,
    !safety.isSafe
  );

  // 6. Simple Explanation Engine Formatting
  const finalAnswer = formatSeniorExplanation(generatedAnswer, {
    simplicityLevel,
    language,
  });

  const responseTimeMs = Date.now() - startTime;

  // 7. Save to Database
  const interaction = Database.saveInteraction({
    participant_id: participantId,
    input_modality: inputModality,
    language,
    agent_used: agentName,
    question: safety.sanitizedQuery,
    answer: finalAnswer,
    sources_retrieved: verification.citedSources,
    verification_status: verification.status,
    confidence_score: verification.confidenceScore,
    response_time_ms: responseTimeMs,
  });

  return {
    interaction,
    agentName,
    answer: finalAnswer,
    verification,
    safety,
  };
}
