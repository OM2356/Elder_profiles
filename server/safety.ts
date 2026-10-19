export interface SafetyCheckResult {
  isSafe: boolean;
  riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH_RISK_SCAM' | 'PROMPT_INJECTION';
  category?: 'SCAM_ALERT' | 'CREDENTIAL_THEFT' | 'PROMPT_INJECTION' | 'MALICIOUS_APP' | 'GENERAL';
  flaggedKeywords: string[];
  safeGuidance?: string;
  sanitizedQuery: string;
}

// Dangerous scam and credential indicators targeting seniors
const SCAM_PATTERNS = [
  /\b(otp|one[- ]time[- ]password)\b/i,
  /\b(cvv|cvv2|card security code)\b/i,
  /\b(atm[- ]pin|upi[- ]pin|mpin|transaction pin)\b/i,
  /\b(net[- ]banking password|bank password)\b/i,
  /\b(bank account number|account number and password)\b/i,
  /\b(anydesk|teamviewer|quicksupport|rustdesk)\b/i,
  /\b(lottery won|prize money|refund claimed|kyc suspended|electricity disconnect)\b/i,
  /\b(send money to verify|wire money)\b/i,
  /\b(aadhaar card otp|pan card linking otp)\b/i,
];

// Prompt injection keywords attempting to hijack the AI instructions
const PROMPT_INJECTION_PATTERNS = [
  /\bignore (all|previous|prior) (instructions|directions|prompts)\b/i,
  /\bsystem prompt\b/i,
  /\byou are now (a|an) (unrestricted|jailbroken|evil)\b/i,
  /\boverride (safety|security|rules)\b/i,
  /\bdeveloper mode\b/i,
  /\bdisregard (safety|system)\b/i,
];

// Multilingual emergency safety guidance
const EMERGENCY_SAFETY_GUIDANCE = {
  en: `🚨 CRITICAL SAFETY WARNING FOR YOUR PROTECTION:

1. NEVER share your OTP, PIN, password, or CVV with ANYONE, even if they claim to work for your bank, government, or electricity company.
2. Official banks will NEVER call you to ask for your password or OTP.
3. NEVER install apps like AnyDesk, TeamViewer, or QuickSupport on someone's request over the phone.
4. If you have already shared details, IMMEDIATELY call your bank's official number on the back of your card to freeze your account.
5. In India, call the National Cyber Crime Helpline at 1930 or visit cybercrime.gov.in.`,

  hi: `🚨 आपकी सुरक्षा के लिए अत्यंत महत्वपूर्ण चेतावनी:

1. कभी भी अपना OTP, PIN, पासवर्ड या CVV किसी के साथ साझा न करें, भले ही वे बैंक अधिकारी होने का दावा करें।
2. बैंक कभी भी फोन पर पासवर्ड या OTP नहीं मांगते हैं।
3. किसी अज्ञात व्यक्ति के कहने पर AnyDesk या TeamViewer जैसे ऐप कभी डाउनलोड न करें।
4. यदि आपने कोई जानकारी साझा कर दी है, तो तुरंत अपने बैंक के आधिकारिक नंबर पर कॉल करके अपना कार्ड ब्लॉक करवाएं।
5. राष्ट्रीय साइबर क्राइम हेल्पलाइन नंबर 1930 पर कॉल करें।`,

  mr: `🚨 आपल्या सुरक्षिततेसाठी अत्यंत महत्त्वाची चेतावणी:

1. तुमचा OTP, PIN, पासवर्ड किंवा CVV कोणाशीही शेअर करू नका, मग त्यांनी बँकेचे अधिकारी असल्याचा दावा केला तरीही.
2. बँक कधीही फोनवर पासवर्ड किंवा OTP मागत नाही.
3. अनोळखी व्यक्तीच्या सांगण्यावरून AnyDesk किंवा TeamViewer सारखे अॅप्स कधीही इन्स्टॉल करू नका.
4. जर तुम्ही चुकून माहिती शेअर केली असेल, तर ताबडतोब आपल्या बँकेशी संपर्क साधून खातं/कार्ड ब्लॉक करा.
5. सायबर क्राईम हेल्पलाइन 1930 वर तात्काळ तक्रार नोंदवा.`
};

export function processSafetyAndPrompt(input: string, language: 'en' | 'hi' | 'mr' = 'en'): SafetyCheckResult {
  const normalized = input.trim();
  const lower = normalized.toLowerCase();
  const flaggedKeywords: string[] = [];

  // Check 1: Prompt Injection
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(lower)) {
      flaggedKeywords.push(pattern.source);
      return {
        isSafe: false,
        riskLevel: 'PROMPT_INJECTION',
        category: 'PROMPT_INJECTION',
        flaggedKeywords,
        safeGuidance:
          language === 'hi'
            ? 'क्षमा करें, सुरक्षा कारणों से इस निर्देश का पालन नहीं किया जा सकता। कृपया डिजिटल सहायता संबंधी प्रश्न पूछें।'
            : language === 'mr'
            ? 'माफ करा, सुरक्षेच्या कारणास्तव या सूचनेचे पालन केले जाऊ शकत नाही. कृपया तंत्रज्ञान मदतीसाठी प्रश्न विचारा.'
            : 'For safety and security reasons, system override commands are restricted. Please ask everyday technology questions.',
        sanitizedQuery: 'Help with everyday technology',
      };
    }
  }

  // Check 2: Scam and Credential Extraction Detection
  for (const pattern of SCAM_PATTERNS) {
    if (pattern.test(lower)) {
      const match = lower.match(pattern);
      if (match) flaggedKeywords.push(match[0]);
    }
  }

  if (flaggedKeywords.length > 0) {
    return {
      isSafe: false,
      riskLevel: 'HIGH_RISK_SCAM',
      category: 'CREDENTIAL_THEFT',
      flaggedKeywords,
      safeGuidance: EMERGENCY_SAFETY_GUIDANCE[language] || EMERGENCY_SAFETY_GUIDANCE.en,
      sanitizedQuery: normalized.replace(/[^\w\s?.,!]/gi, ' ').trim(),
    };
  }

  // Sanitize input: Strip harmful escape characters, limit length to 500 chars
  const sanitizedQuery = normalized
    .slice(0, 500)
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .trim();

  return {
    isSafe: true,
    riskLevel: 'SAFE',
    flaggedKeywords: [],
    sanitizedQuery,
  };
}
