export interface ExplanationOptions {
  simplicityLevel: 'standard' | 'ultra_simple';
  language: 'en' | 'hi' | 'mr';
}

// Multilingual translations for core technology concepts for elderly learners
export const SENIOR_GLOSSARY: Record<string, { en: string; hi: string; mr: string }> = {
  wifi: {
    en: 'Wi-Fi (wireless home internet connection)',
    hi: 'वाई-फाई (घर का बिना तार वाला इंटरनेट)',
    mr: 'वाय-फाय (घरातील बिनतारी इंटरनेट)',
  },
  settings: {
    en: 'Settings (the gear icon where you control your phone options)',
    hi: 'सेटिंग्स (गियर/पहिए जैसा निशान जहां से फोन कंट्रोल होता है)',
    mr: 'सेटिंग्ज (गिअर चिन्हासह फोनचे पर्याय नियंत्रित करण्याची जागा)',
  },
  otp: {
    en: 'OTP (One-Time Password secret code sent via SMS)',
    hi: 'OTP (वन-टाइम पासवर्ड - गुप्त 6 अंकों का कोड)',
    mr: 'OTP (वन-टाइम पासवर्ड - मेसेजद्वारे येणारा गुप्त कोड)',
  },
  app: {
    en: 'App (a phone program like WhatsApp, Camera, or YouTube)',
    hi: 'ऐप (फोन का प्रोग्राम जैसे व्हाट्सएप या कैमरा)',
    mr: 'अॅप (व्हॉट्सअॅप किंवा कॅमेरासारखा फोनमधील प्रोग्राम)',
  },
};

// Formats answer according to elderly accessibility standards
export function formatSeniorExplanation(
  rawAnswer: string,
  options: ExplanationOptions = { simplicityLevel: 'standard', language: 'en' }
): string {
  let cleaned = rawAnswer.trim();

  // If ultra_simple is requested, reduce sentence complexity and emphasize numbered steps
  if (options.simplicityLevel === 'ultra_simple') {
    const lines = cleaned.split('\n').filter((l) => l.trim().length > 0);
    const simplifiedLines: string[] = [];

    for (const line of lines) {
      // Keep numbered steps, headers, and essential tips
      if (/^\d+\./.test(line.trim()) || line.includes(':') || line.length < 80) {
        simplifiedLines.push(line.trim());
      } else {
        // Break long compound sentences into shorter chunks
        const shortSentences = line.split(/[.,;]\s+/);
        for (const s of shortSentences) {
          if (s.trim().length > 10) {
            simplifiedLines.push(s.trim() + '.');
          }
        }
      }
    }

    cleaned = simplifiedLines.join('\n\n');
  }

  return cleaned;
}

// Generates an even simpler version with everyday analogies
export function generateSimplifiedAlternative(
  originalAnswer: string,
  language: 'en' | 'hi' | 'mr' = 'en'
): string {
  if (language === 'hi') {
    return (
      'आइए इसे और भी आसान शब्दों में समझते हैं:\n\n' +
      '1. चिंता न करें, धीरे-धीरे एक-एक कदम उठाएं।\n' +
      '2. अपने फोन की मुख्य स्क्रीन (होम स्क्रीन) पर जाएं।\n' +
      '3. सेटिंग्स (Settings) वाले पहिए के निशान को छूएं।\n' +
      '4. यदि कोई कदम समझ न आए, तो फोन का होम बटन दबाकर वापस आ सकते हैं।\n\n' +
      'क्या आप चाहते हैं कि मैं इसे और छोटे हिस्से में बताऊं?'
    );
  }

  if (language === 'mr') {
    return (
      'चला हे अधिक सोप्या भाषेत समजून घेऊया:\n\n' +
      '1. काळजी करू नका, आपण हळूहळू एक-एक पायरी शिकू.\n' +
      '2. आपल्या फोनच्या मुख्य स्क्रीनवर (होम स्क्रीन) जा.\n' +
      '3. सेटिंग्स (Settings) चे गिअर चिन्ह शोधा आणि त्यावर टॅप करा.\n' +
      '4. जर अडचण आली तर खालचे होम बटण दाबून परत स्क्रीनवर येऊ शकता.\n\n' +
      'मी आणखी सोपे करून सांगू का?'
    );
  }

  return (
    "Let's break this down into the simplest possible steps:\n\n" +
    '1. Take your time—you cannot break your phone by tapping buttons.\n' +
    '2. Go to your phone’s Main Screen.\n' +
    '3. Look for the "Settings" icon (it looks like a small grey mechanical gear).\n' +
    '4. Follow one number at a time without rushing.\n\n' +
    'Would you like me to walk through step 1 together with you?'
  );
}

// Generates repeated instruction recap
export function generateInstructionRecap(
  originalAnswer: string,
  language: 'en' | 'hi' | 'mr' = 'en'
): string {
  if (language === 'hi') {
    return `पुनरावृत्ति (निर्देश):\n\n${originalAnswer}\n\n(आप जब चाहें 'आवाज सुनें' बटन दबाकर इसे सुन भी सकते हैं।)`;
  }
  if (language === 'mr') {
    return `पुनरावृत्ती (सूचना):\n\n${originalAnswer}\n\n(तुम्ही हवं तेव्हा 'ऐका' बटण दाबून हे ऐकू शकता.)`;
  }
  return `Instruction Recap:\n\n${originalAnswer}\n\n(You can also tap the "Listen" button at any time to hear this spoken aloud.)`;
}
