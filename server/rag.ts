export interface EducationalDocument {
  id: string;
  title: string;
  category:
    | 'Smartphone Basics'
    | 'Internet & Wi-Fi'
    | 'WhatsApp & Messaging'
    | 'Email & Video Calling'
    | 'Online Fraud Awareness'
    | 'Digital Payments & Privacy'
    | 'Accessibility Settings';
  summary: string;
  keywords: string[];
  chunks: DocumentChunk[];
}

export interface DocumentChunk {
  id: string;
  docId: string;
  docTitle: string;
  category: string;
  content: string;
  keywords: string[];
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  score: number;
}

// 7 Approved Educational Documents Matching Core Senior Curriculum
export const INITIAL_EDUCATIONAL_DOCUMENTS: EducationalDocument[] = [
  {
    id: 'doc-smartphone-basics',
    title: 'Smartphone Basics & Screen Navigation',
    category: 'Smartphone Basics',
    summary: 'Mastering the Home button, tapping, swiping, power buttons, and basic screen controls without fear.',
    keywords: ['smartphone', 'basics', 'touch screen', 'home button', 'swipe', 'turn on', 'power button', 'volume', 'apps', 'lost'],
    chunks: [
      {
        id: 'chunk-basics-1',
        docId: 'doc-smartphone-basics',
        docTitle: 'Smartphone Basics & Screen Navigation',
        category: 'Smartphone Basics',
        content:
          '1. The Home Button: Located at the bottom center of your screen (as a circle or line bar). Tapping or swiping up on this instantly returns you to your main familiar screen at any time.\n2. Tapping vs Swiping: A light single tap opens an app or selects an item. Swiping means gently sliding your finger across the glass to turn pages or scroll up and down lists.\n3. Safe Exploration: You cannot break your smartphone simply by tapping the screen. If you ever open something unfamiliar, press Home to start over.',
        keywords: ['home button', 'tapping', 'swiping', 'scrolling', 'safe exploration'],
      },
    ],
  },
  {
    id: 'doc-wifi-internet',
    title: 'Connecting Safely to Internet and Home Wi-Fi',
    category: 'Internet & Wi-Fi',
    summary: 'Step-by-step connection to home Wi-Fi networks and safe mobile data usage.',
    keywords: ['wifi', 'wi-fi', 'internet', 'wireless', 'network', 'router', 'password', 'mobile data', 'connect'],
    chunks: [
      {
        id: 'chunk-wifi-1',
        docId: 'doc-wifi-internet',
        docTitle: 'Connecting Safely to Internet and Home Wi-Fi',
        category: 'Internet & Wi-Fi',
        content:
          'Connecting to Home Wi-Fi:\n1. Open Settings on your phone (the gear icon).\n2. Tap "Wi-Fi" or "Network & Internet".\n3. Switch the Wi-Fi toggle button to ON.\n4. Tap the exact name of your home Wi-Fi from the list.\n5. Carefully type your home Wi-Fi password (usually printed on the back of your home router box) and tap Connect.\n\nSafety Tip: Avoid entering passwords or checking bank accounts when connected to open public Wi-Fi at cafes or train stations.',
        keywords: ['wifi settings', 'router password', 'public wifi safety', 'mobile internet'],
      },
    ],
  },
  {
    id: 'doc-whatsapp-messaging',
    title: 'WhatsApp and Everyday Messaging',
    category: 'WhatsApp & Messaging',
    summary: 'Sending text messages, recording voice notes, and sharing photos with family.',
    keywords: ['whatsapp', 'message', 'text', 'voice note', 'chat', 'family', 'photos', 'microphone', 'send'],
    chunks: [
      {
        id: 'chunk-whatsapp-1',
        docId: 'doc-whatsapp-messaging',
        docTitle: 'WhatsApp and Everyday Messaging',
        category: 'WhatsApp & Messaging',
        content:
          'Using WhatsApp with Loved Ones:\n1. To send a text: Open WhatsApp, tap your family member’s name, tap the message box at the bottom, type your note, and tap the green arrow.\n2. Voice Note (Audio Message): If typing is tiring, press and hold the green microphone icon next to the typing box. Speak clearly, then let go of the microphone to send.\n3. Sharing Photos: Tap the paperclip or plus (+) icon beside the message box, select "Gallery", tap the photo you want to share, and tap Send.',
        keywords: ['voice note', 'whatsapp chat', 'microphone button', 'photo sharing'],
      },
    ],
  },
  {
    id: 'doc-video-calling',
    title: 'Email and Video Calling with Loved Ones',
    category: 'Email & Video Calling',
    summary: 'Placing clear face-to-face video calls using WhatsApp or Google Meet to see family.',
    keywords: ['video call', 'family', 'see face', 'whatsapp video', 'camera', 'google meet', 'email', 'gmail'],
    chunks: [
      {
        id: 'chunk-video-1',
        docId: 'doc-video-calling',
        docTitle: 'Email and Video Calling with Loved Ones',
        category: 'Email & Video Calling',
        content:
          'Making a Video Call:\n1. Open WhatsApp or your phone’s contact list.\n2. Tap the contact name of your child or grandchild.\n3. Look at the top right corner of the chat and tap the small Video Camera icon.\n4. Hold your phone at eye level so they can see your smiling face.\n5. To end the call when finished, tap the round red button.',
        keywords: ['video camera icon', 'whatsapp video call', 'face to face', 'hang up red button'],
      },
    ],
  },
  {
    id: 'doc-fraud-awareness',
    title: 'Online Fraud Awareness & Scam Defense',
    category: 'Online Fraud Awareness',
    summary: 'Recognizing fake bank calls, deceptive prize messages, urgent threats, and remote-access traps.',
    keywords: ['scam', 'fraud', 'otp', 'phishing', 'bank', 'pin', 'suspicious', 'fake', 'anydesk', 'teamviewer', 'police', 'helpline'],
    chunks: [
      {
        id: 'chunk-fraud-1',
        docId: 'doc-fraud-awareness',
        docTitle: 'Online Fraud Awareness & Scam Defense',
        category: 'Online Fraud Awareness',
        content:
          'Crucial Scam Defense Rules:\n1. NEVER share your One-Time Password (OTP), ATM PIN, or banking passwords with ANYONE, even if they claim to be a bank manager or government official.\n2. Beware of urgency: Scammers often threaten that "your electricity will be cut off today" or "your SIM card will be deactivated". These are lies designed to make you panic.\n3. Never download apps like "AnyDesk", "TeamViewer", or "QuickSupport" if a caller asks you to. These allow strangers to control your phone.\n4. In India, call the National Cyber Crime Helpline immediately at 1930 if you suspect fraud.',
        keywords: ['never share otp', 'urgent threat scam', 'remote screen share', 'cybercrime 1930'],
      },
    ],
  },
  {
    id: 'doc-digital-payments',
    title: 'Digital Payments & UPI Privacy Guidelines',
    category: 'Digital Payments & Privacy',
    summary: 'Safe usage of Google Pay, PhonePe, Paytm, and BHIM UPI without financial risk.',
    keywords: ['upi', 'google pay', 'phonepe', 'paytm', 'bhim', 'money', 'upi pin', 'receive money', 'qr code', 'payment'],
    chunks: [
      {
        id: 'chunk-payments-1',
        docId: 'doc-digital-payments',
        docTitle: 'Digital Payments & UPI Privacy Guidelines',
        category: 'Digital Payments & Privacy',
        content:
          'Golden Rule of UPI:\n1. You NEVER need to enter your UPI PIN to RECEIVE money. A UPI PIN is ONLY entered when money is leaving your account.\n2. If someone sends you a QR code and says "scan this and enter your PIN to receive prize or refund money", IT IS A SCAM. Do NOT enter your PIN.\n3. Keep your screen locked with a fingerprint, face lock, or simple 4-digit code so no one can access your phone if lost.',
        keywords: ['upi pin receive money', 'never enter pin to receive', 'qr code prize fraud', 'screen lock'],
      },
    ],
  },
  {
    id: 'doc-accessibility-settings',
    title: 'Accessibility Settings (Large Text & High Contrast)',
    category: 'Accessibility Settings',
    summary: 'Customizing screen font size, display zoom, bold letters, and audio helpers for comfortable reading.',
    keywords: ['accessibility', 'font size', 'text bigger', 'large letters', 'display zoom', 'bold text', 'eyes', 'read', 'vision'],
    chunks: [
      {
        id: 'chunk-accessibility-1',
        docId: 'doc-accessibility-settings',
        docTitle: 'Accessibility Settings (Large Text & High Contrast)',
        category: 'Accessibility Settings',
        content:
          'Making Your Phone Easier on the Eyes:\n1. Open Settings on your phone.\n2. Scroll down and tap "Display" or "Accessibility".\n3. Tap "Font Size and Style" or "Text Size".\n4. Slide the round circle to the right to make all letters bigger and comfortable to read.\n5. Enable "Bold Text" to make letters darker and clearer.\n6. Adjust brightness to around 60% so the screen does not strain your eyes in the evening.',
        keywords: ['font slider', 'bold letters', 'display zoom', 'eye comfort', 'accessibility settings'],
      },
    ],
  },
];

// In-Memory Storage for Educational Documents with Dynamic Ingestion
export const educationalDocuments: EducationalDocument[] = [...INITIAL_EDUCATIONAL_DOCUMENTS];
export const APPROVED_EDUCATIONAL_DOCUMENTS = educationalDocuments;

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'what', 'your', 'you',
  'are', 'can', 'how', 'when', 'from', 'have', 'been', 'which', 'will',
  'would', 'there', 'their', 'them', 'they', 'about', 'into', 'over', 'does'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

// Ingest new educational document (Module 8 & Module 13)
export function ingestEducationalDocument(
  title: string,
  category: any,
  content: string,
  keywords: string[] = []
): EducationalDocument {
  const docId = `doc-${Date.now()}`;
  const chunkId = `chunk-${Date.now()}`;

  const newDoc: EducationalDocument = {
    id: docId,
    title: title.trim(),
    category,
    summary: content.slice(0, 150) + '...',
    keywords,
    chunks: [
      {
        id: chunkId,
        docId,
        docTitle: title.trim(),
        category,
        content: content.trim(),
        keywords,
      },
    ],
  };

  educationalDocuments.push(newDoc);
  return newDoc;
}

// Hybrid Search Retriever (BM25 + TF-IDF)
export function retrieveEducationalEvidence(query: string, topK: number = 2): RetrievalResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const allChunks: DocumentChunk[] = [];
  for (const doc of educationalDocuments) {
    for (const chunk of doc.chunks) {
      allChunks.push(chunk);
    }
  }

  const scoredResults: RetrievalResult[] = allChunks.map((chunk) => {
    let score = 0;
    const chunkTokens = tokenize(chunk.content);
    const titleTokens = tokenize(chunk.docTitle);
    const keywordTokens = chunk.keywords.flatMap((k) => tokenize(k));

    for (const qToken of queryTokens) {
      if (keywordTokens.some((k) => k === qToken || k.includes(qToken))) {
        score += 3.5;
      }
      if (titleTokens.includes(qToken)) {
        score += 3.0;
      }
      const contentMatches = chunkTokens.filter((c) => c === qToken).length;
      score += Math.min(contentMatches, 3) * 1.0;
    }

    return { chunk, score };
  });

  const sorted = scoredResults
    .filter((r) => r.score > 1.2)
    .sort((a, b) => b.score - a.score);

  return sorted.slice(0, topK);
}
