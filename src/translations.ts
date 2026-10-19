import { Language } from './types';

export const TRANSLATIONS: Record<
  Language,
  {
    appTitle: string;
    appSubtitle: string;
    badge: string;
    tabHome: string;
    tabChat: string;
    tabGuides: string;
    tabAgents: string;
    tabProgress: string;
    tabDashboard: string;
    textSize: string;
    normal: string;
    large: string;
    extraLarge: string;
    languageSelect: string;
    safetyBanner: string;
    safetyBannerBold: string;
    welcomeHeading: string;
    welcomeSubheading: string;
    askPlaceholder: string;
    sendButton: string;
    newChat: string;
    startLearning: string;
    listening: string;
    voiceSpeakPrompt: string;
    voiceCancel: string;
    voiceSubmit: string;
    voiceUnavailable: string;
    suggestedHeading: string;
    explainSimply: string;
    repeatInstructions: string;
    listenAloud: string;
    stopAudio: string;
    didHelp: string;
    good: string;
    okay: string;
    notGood: string;
    feedbackRecorded: string;
    verifiedBadge: string;
    partiallyGroundedBadge: string;
    safetyOverrideBadge: string;
    generalGuidanceBadge: string;
    sourcesUsed: string;
    preferences: string;
    savePreferences: string;
    clearHistory: string;
    exportData: string;
    footerText: string;
    logout: string;
    login: string;
    activeSession: string;
    confirmLogoutTitle: string;
    confirmLogoutDesc: string;
    logoutConfirmButton: string;
    logoutCancelButton: string;
    loggedOutTitle: string;
    loggedOutDesc: string;
    startNewSession: string;
    chooseLearner: string;
    customLearnerPlaceholder: string;
    unauthorizedChatTitle: string;
    unauthorizedChatDesc: string;
  }
> = {
  en: {
    appTitle: 'Buddy',
    appSubtitle: 'Patient AI Educational Assistant for Older Adults',
    badge: 'Educational AI Tutor',
    tabHome: 'Home & Welcome',
    tabChat: 'AI Chat',
    tabGuides: 'Learning Topics',
    tabAgents: 'Specialist Agents & Safety',
    tabProgress: 'My Progress',
    tabDashboard: 'Admin Dashboard',
    textSize: 'Text Size',
    normal: 'A',
    large: 'A+',
    extraLarge: 'A++',
    languageSelect: 'Language',
    safetyBanner:
      'Buddy will never ask for your passwords, OTP codes, PINs, or bank details. Our Safety Agent actively checks your queries to protect you against scams.',
    safetyBannerBold: 'Digital Safety Promise:',
    welcomeHeading: 'Welcome! What would you like to learn today?',
    welcomeSubheading:
      'Type your question below or click a suggested topic. You can also use voice to speak your question.',
    askPlaceholder: 'Ask Buddy anything (e.g., How do I connect to Wi-Fi?)',
    sendButton: 'Send Question',
    newChat: 'New Chat',
    startLearning: 'Start Learning with Buddy',
    listening: 'Listening... Please speak clearly into your microphone',
    voiceSpeakPrompt: 'Speak your question now...',
    voiceCancel: 'Cancel Voice',
    voiceSubmit: 'Use Spoken Words',
    voiceUnavailable: 'Speech recognition is not supported in this browser. Please type your question.',
    suggestedHeading: 'Frequently Asked Questions (Tap to Ask):',
    explainSimply: 'Explain More Simply',
    repeatInstructions: 'Repeat Instructions',
    listenAloud: 'Listen Aloud',
    stopAudio: 'Stop Voice',
    didHelp: 'Did this answer help you?',
    good: '😊 Good',
    okay: '😐 Okay',
    notGood: '🙁 Not Good',
    feedbackRecorded: 'Feedback recorded! Thank you for helping Buddy improve.',
    verifiedBadge: 'Verified with Educational Guides',
    partiallyGroundedBadge: 'Partially Verified',
    safetyOverrideBadge: 'Emergency Safety Protocol',
    generalGuidanceBadge: 'Safe General Guidance',
    sourcesUsed: 'Verified Educational Sources:',
    preferences: 'My Preferences',
    savePreferences: 'Save Preferences',
    clearHistory: 'Clear History',
    exportData: 'Export Research Data (JSON)',
    footerText: 'Buddy — Patient AI Companion & Learning Tutor for Older Adults',
    logout: 'Log Out',
    login: 'Sign In / Start Session',
    activeSession: 'Active Learner',
    confirmLogoutTitle: 'Confirm Secure Logout',
    confirmLogoutDesc:
      'Are you sure you want to end your session? This will safely close your conversation state, reset your learner ID, and protect your private chat history.',
    logoutConfirmButton: 'Yes, End Session & Log Out',
    logoutCancelButton: 'Stay in Session',
    loggedOutTitle: 'Session Ended & History Secured',
    loggedOutDesc:
      'You have been logged out securely. Your chat messages have been cleared from this screen and protected from unauthorized access.',
    startNewSession: 'Start Learner Session',
    chooseLearner: 'Select Learner Profile',
    customLearnerPlaceholder: 'Enter custom Learner ID or name',
    unauthorizedChatTitle: 'Sign In Required for Chat',
    unauthorizedChatDesc:
      'To protect your privacy and ensure your interactions remain private, please start or select a learner profile before chatting.',
  },
  hi: {
    appTitle: 'बडी (Buddy)',
    appSubtitle: 'वरिष्ठ नागरिकों के लिए धैर्यवान AI शैक्षिक सहायक',
    badge: 'शैक्षिक AI ट्यूटर',
    tabHome: 'मुख्य पृष्ठ',
    tabChat: 'बडी से बातचीत करें',
    tabGuides: 'सीखने के विषय',
    tabAgents: 'विशेषज्ञ एजेंट और सुरक्षा',
    tabProgress: 'मेरी प्रगति',
    tabDashboard: 'एडमिन डैशबोर्ड',
    textSize: 'अक्षर का आकार',
    normal: 'क',
    large: 'क+',
    extraLarge: 'क++',
    languageSelect: 'भाषा',
    safetyBanner:
      'बडी आपसे कभी भी पासवर्ड, OTP कोड, PIN या बैंक विवरण नहीं मांगेगा। हमारा सुरक्षा एजेंट आपको धोखाधड़ी से बचाने के लिए निरंतर कार्य करता है।',
    safetyBannerBold: 'डिजिटल सुरक्षा प्रतिज्ञा:',
    welcomeHeading: 'नमस्ते! आज आप क्या सीखना चाहते हैं?',
    welcomeSubheading:
      'नीचे अपना प्रश्न लिखें या नीचे दिए गए किसी विषय पर टैप करें। आप बोलकर भी प्रश्न पूछ सकते हैं।',
    askPlaceholder: 'बडी से कुछ भी पूछें (जैसे: वाई-फाई कैसे चालू करें?)',
    sendButton: 'प्रश्न भेजें',
    newChat: 'नई बातचीत',
    startLearning: 'सीखना शुरू करें',
    listening: 'सुन रहे हैं... कृपया स्पष्ट बोलें',
    voiceSpeakPrompt: 'अपना प्रश्न बोलें...',
    voiceCancel: 'आवाज रद्द करें',
    voiceSubmit: 'बोले गए शब्द इस्तेमाल करें',
    voiceUnavailable: 'इस ब्राउज़र में आवाज पहचान उपलब्ध नहीं है। कृपया लिखकर पूछें।',
    suggestedHeading: 'अक्सर पूछे जाने वाले प्रश्न (पूछने के लिए टैप करें):',
    explainSimply: 'और सरल शब्दों में समझाएं',
    repeatInstructions: 'निर्देश दोबारा दोहराएं',
    listenAloud: 'आवाज में सुनें',
    stopAudio: 'आवाज रोकें',
    didHelp: 'क्या यह उत्तर आपके लिए मददगार रहा?',
    good: '😊 अच्छा',
    okay: '😐 ठीक',
    notGood: '🙁 अच्छा नहीं',
    feedbackRecorded: 'आपकी राय दर्ज कर ली गई है! बडी को बेहतर बनाने के लिए धन्यवाद।',
    verifiedBadge: 'शैक्षिक मार्गदर्शिका द्वारा सत्यापित',
    partiallyGroundedBadge: 'आंशिक सत्यापित',
    safetyOverrideBadge: 'आपातकालीन सुरक्षा प्रोटोकॉल',
    generalGuidanceBadge: 'सुरक्षित सामान्य मार्गदर्शन',
    sourcesUsed: 'सत्यापित शैक्षिक स्रोत:',
    preferences: 'मेरी प्राथमिकताएं',
    savePreferences: 'प्राथमिकताएं सहेजें',
    clearHistory: 'इतिहास साफ़ करें',
    exportData: 'शोध डेटा निर्यात करें (JSON)',
    footerText: 'बडी — वरिष्ठ नागरिकों के लिए धैर्यवान AI डिजिटल साथी',
    logout: 'लॉग आउट',
    login: 'साइन इन / सत्र शुरू करें',
    activeSession: 'सक्रिय शिक्षार्थी',
    confirmLogoutTitle: 'सुरक्षित लॉग आउट की पुष्टि करें',
    confirmLogoutDesc:
      'क्या आप वाकई सत्र समाप्त करना चाहते हैं? इससे आपकी बातचीत सुरक्षित रूप से बंद हो जाएगी, शिक्षार्थी आईडी रीसेट होगी और आपका चैट इतिहास सुरक्षित रहेगा।',
    logoutConfirmButton: 'हाँ, सत्र समाप्त करें और लॉग आउट करें',
    logoutCancelButton: 'सत्र में बने रहें',
    loggedOutTitle: 'सत्र समाप्त व चैट सुरक्षित',
    loggedOutDesc:
      'आप सुरक्षित रूप से लॉग आउट हो चुके हैं। आपकी गोपनीयता की रक्षा के लिए आपकी बातचीत और इनपुट हटा दिए गए हैं।',
    startNewSession: 'शिक्षार्थी सत्र शुरू करें',
    chooseLearner: 'शिक्षार्थी प्रोफ़ाइल चुनें',
    customLearnerPlaceholder: 'शिक्षार्थी आईडी या नाम लिखें',
    unauthorizedChatTitle: 'चैट के लिए साइन इन आवश्यक है',
    unauthorizedChatDesc:
      'अपनी बातचीत और प्रगति को निजी और सुरक्षित रखने के लिए, कृपया बडी से बातचीत करने से पहले साइन इन करें।',
  },
  mr: {
    appTitle: 'बडी (Buddy)',
    appSubtitle: 'ज्येष्ठ नागरिकांसाठी मार्गदर्शक AI शैक्षणिक मित्र',
    badge: 'शैक्षणिक AI ट्यूटर',
    tabHome: 'मुख्य पान',
    tabChat: 'बडीशी संवाद साधा',
    tabGuides: 'शिकण्याचे विषय',
    tabAgents: 'विशेषज्ञ एजंट आणि सुरक्षितता',
    tabProgress: 'माझी प्रगती',
    tabDashboard: 'प्रशासक डॅशबोर्ड',
    textSize: 'अक्षरांचा आकार',
    normal: 'अ',
    large: 'अ+',
    extraLarge: 'अ++',
    languageSelect: 'भाषा',
    safetyBanner:
      'बडी तुमच्याकडे कधीही पासवर्ड, OTP कोड, PIN किंवा बँकेचे तपशील मागणार नाही. आमचा सुरक्षा एजंट फसवणुकीपासून तुमचे रक्षण करतो.',
    safetyBannerBold: 'डिजिटल सुरक्षेचे वचन:',
    welcomeHeading: 'नमस्कार! आज तुम्हाला काय शिकायला आवडेल?',
    welcomeSubheading:
      'खाली तुमचा प्रश्न टाईप करा किंवा सुचवलेल्या विषयावर टॅप करा. तुम्ही आवाजाद्वारेही बोलून विचारू शकता.',
    askPlaceholder: 'बडीला काहीही विचारा (उदा. वाय-फाय कसे कनेक्ट करावे?)',
    sendButton: 'प्रश्न विचारा',
    newChat: 'नवीन संवाद',
    startLearning: 'आता शिकायला सुरुवात करा',
    listening: 'ऐकत आहे... कृपया स्पष्ट बोला',
    voiceSpeakPrompt: 'तुमचा प्रश्न बोला...',
    voiceCancel: 'आवाज रद्द करा',
    voiceSubmit: 'बोललेले शब्द वापरा',
    voiceUnavailable: 'या ब्राउझरमध्ये व्हॉइस इनपुट समर्थित नाही. कृपया टाईप करा.',
    suggestedHeading: 'वारंवार विचारले जाणारे प्रश्न (विचारण्यासाठी टॅप करा):',
    explainSimply: 'आणखी सोप्या भाषेत सांगा',
    repeatInstructions: 'सूचना पुन्हा सांगा',
    listenAloud: 'आवाजात ऐका',
    stopAudio: 'आवाज थांबवा',
    didHelp: 'या उत्तराने तुम्हाला मदत झाली का?',
    good: '😊 छान',
    okay: '😐 ठीक',
    notGood: '🙁 समाधानकारक नाही',
    feedbackRecorded: 'तुमचे मत नोंदवले गेले! बडीला अधिक उपयुक्त बनवण्यासाठी धन्यवाद.',
    verifiedBadge: 'शैक्षणिक मार्गदर्शकाद्वारे सत्यापित',
    partiallyGroundedBadge: 'अंशतः सत्यापित',
    safetyOverrideBadge: 'तातडीचा सुरक्षा प्रोटोकॉल',
    generalGuidanceBadge: 'सुरक्षित सामान्य मार्गदर्शन',
    sourcesUsed: 'सत्यापित शैक्षणिक संदर्भ:',
    preferences: 'माझ्या पसंती',
    savePreferences: 'पसंती जतन करा',
    clearHistory: 'इतिहास पुसून टाका',
    exportData: 'संशोधन डेटा डाऊनलोड करा (JSON)',
    footerText: 'बडी — ज्येष्ठ नागरिकांसाठी मार्गदर्शक व धीर देणारा AI मित्र',
    logout: 'बाहेर पडा (Log Out)',
    login: 'साइन इन / सत्र सुरू करा',
    activeSession: 'सक्रिय शिकणारा',
    confirmLogoutTitle: 'सुरक्षित लॉग आउटची खात्री करा',
    confirmLogoutDesc:
      'तुम्हाला नक्की सत्र समाप्त करायचे आहे का? यामुळे तुमचे संभाषण सुरक्षितपणे बंद होईल, शिकणारा आयडी रीसेट होईल आणि तुमची खासगी माहिती सुरक्षित राहील.',
    logoutConfirmButton: 'होय, सत्र संपवा आणि बाहेर पडा',
    logoutCancelButton: 'सत्रातच रहा',
    loggedOutTitle: 'सत्र समाप्त व चॅट सुरक्षित',
    loggedOutDesc:
      'तुम्ही सुरक्षितपणे बाहेर पडला आहात. तुमच्या गोपनीयतेसाठी तुमचे संभाषण स्क्रीनवरून काढून टाकले गेले आहे.',
    startNewSession: 'शिकण्याचे सत्र सुरू करा',
    chooseLearner: 'शिकणाऱ्याचे प्रोफाइल निवडा',
    customLearnerPlaceholder: 'आयडी किंवा नाव टाका',
    unauthorizedChatTitle: 'संवादासाठी साइन इन आवश्यक',
    unauthorizedChatDesc:
      'तुमची गोपनीयता आणि माहिती सुरक्षित ठेवण्यासाठी, कृपया बडीशी संवाद साधण्यापूर्वी सत्र सुरू करा.',
  },
};
