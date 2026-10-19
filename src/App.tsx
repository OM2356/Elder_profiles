import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ShieldCheck,
  BookOpen,
  BarChart3,
  Send,
  RefreshCw,
  Settings,
  HelpCircle,
  CheckCircle2,
  Smile,
  Meh,
  Frown,
  RotateCcw,
  Sparkle,
  GraduationCap,
  ShieldAlert,
  HeartHandshake,
  MessageSquareQuote,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  PhoneCall,
  Sliders,
  Award,
  Home,
  Plus,
  LogOut,
  LogIn,
  Lock,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import {
  InteractionRecord,
  Language,
  FontSizeLevel,
  SimplicityLevel,
  UserPreferences,
  ResearchSummary,
  EducationalGuide,
  TopicProgressRecord,
} from './types';
import { TRANSLATIONS } from './translations';
import { VoiceInput } from './components/VoiceInput';
import { AudioPlayer } from './components/AudioPlayer';
import { GuidesSearch } from './components/GuidesSearch';
import { AdminDashboard } from './components/AdminDashboard';
import { PreferencesModal } from './components/PreferencesModal';
import { ProgressDashboard } from './components/ProgressDashboard';
import { HomeWelcome } from './components/HomeWelcome';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [interactions, setInteractions] = useState<InteractionRecord[]>([]);
  const [adminInteractions, setAdminInteractions] = useState<InteractionRecord[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'guides' | 'agents' | 'progress' | 'dashboard'>('home');
  const [summaryData, setSummaryData] = useState<ResearchSummary | null>(null);
  const [guides, setGuides] = useState<EducationalGuide[]>([]);
  const [topicProgress, setTopicProgress] = useState<TopicProgressRecord[]>([]);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({});

  // Session & Authentication State
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [logoutNotification, setLogoutNotification] = useState<string | null>(null);

  // Adaptation & Preferences State
  const [participantId, setParticipantId] = useState('senior_learner_1');
  const [language, setLanguage] = useState<Language>('en');
  const [fontSizeLevel, setFontSizeLevel] = useState<FontSizeLevel>('large');
  const [simplicityLevel, setSimplicityLevel] = useState<SimplicityLevel>('standard');
  const [speechRate, setSpeechRate] = useState<number>(0.85);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  // Multilingual suggestions for seniors
  const suggestedQuestionsByLang: Record<Language, { text: string; agent: string }[]> = {
    en: [
      { text: 'How do I connect to Wi-Fi at home?', agent: 'Learning Agent' },
      { text: 'How do I make text bigger on my phone?', agent: 'Accessibility Agent' },
      { text: 'Someone asked for my bank OTP. Should I share it?', agent: 'Safety Agent' },
      { text: 'How do I make a video call to my family?', agent: 'Communication Agent' },
      { text: 'I am confused and worried about clicking buttons', agent: 'Support Agent' },
      { text: 'How do I send a voice message on WhatsApp?', agent: 'Communication Agent' },
    ],
    hi: [
      { text: 'घर पर वाई-फाई कैसे चालू और कनेक्ट करें?', agent: 'Learning Agent' },
      { text: 'फोन पर अक्षरों का आकार बड़ा कैसे करें?', agent: 'Accessibility Agent' },
      { text: 'किसी ने बैंक OTP मांगा है, क्या मुझे देना चाहिए?', agent: 'Safety Agent' },
      { text: 'परिवार के साथ वीडियो कॉल कैसे करें?', agent: 'Communication Agent' },
      { text: 'मुझे फोन चलाने में डर और उलझन हो रही है', agent: 'Support Agent' },
      { text: 'व्हाट्सएप पर बोलकर मैसेज कैसे भेजें?', agent: 'Communication Agent' },
    ],
    mr: [
      { text: 'घरी वाय-फाय कसे कनेक्ट करावे?', agent: 'Learning Agent' },
      { text: 'मोबाईलमधील अक्षरे मोठी कशी करायची?', agent: 'Accessibility Agent' },
      { text: 'एका व्यक्तीने बँकेचा OTP मागितला आहे, देऊ का?', agent: 'Safety Agent' },
      { text: 'व्हॉट्सअॅपवर व्हिडिओ कॉल कसा करायचा?', agent: 'Communication Agent' },
      { text: 'मला फोन वापरताना भीती आणि गोंधळ वाटतोय', agent: 'Support Agent' },
      { text: 'व्हॉट्सअॅपवर बोलून मेसेज कसा पाठवायचा?', agent: 'Communication Agent' },
    ],
  };

  // Fetch session-protected learner interactions
  const loadInteractions = async (overrideToken?: string) => {
    const activeToken = overrideToken || sessionToken;
    if (!activeToken) {
      setInteractions([]);
      return;
    }

    try {
      const res = await fetch('/api/interactions', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInteractions(data.interactions || []);
      } else if (res.status === 401) {
        // Session invalid or expired - protect chat history
        setInteractions([]);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Failed to load interactions:', err);
    }
  };

  // Fetch research interactions for protected admin dashboard
  const loadAdminInteractions = async () => {
    try {
      const res = await fetch('/api/interactions?admin=true', {
        headers: { 'x-admin-key': 'buddy-research-admin' },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminInteractions(data.interactions || []);
      }
    } catch (err) {
      console.error('Failed to load admin interactions:', err);
    }
  };

  const loadSummary = async () => {
    try {
      const res = await fetch('/api/summary');
      if (res.ok) {
        const data = await res.json();
        setSummaryData(data);
      }
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  };

  const loadGuides = async () => {
    try {
      const res = await fetch('/api/topics');
      if (res.ok) {
        const data = await res.json();
        setGuides(data.topics || []);
      }
    } catch (err) {
      console.error('Failed to load guides:', err);
    }
  };

  const loadProgress = async (targetId?: string, overrideToken?: string) => {
    const activeId = targetId || participantId;
    const activeToken = overrideToken || sessionToken;

    if (!activeId || !activeToken) {
      setTopicProgress([]);
      return;
    }

    try {
      const res = await fetch(`/api/progress/${activeId}`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTopicProgress(data.progress || []);
      }
    } catch (err) {
      console.error('Failed to load progress:', err);
    }
  };

  const loadPreferences = async (targetId?: string) => {
    const activeId = targetId || participantId;
    if (!activeId) return;

    try {
      const res = await fetch(`/api/preferences/${activeId}`);
      if (res.ok) {
        const data = await res.json();
        const p: UserPreferences = data.preferences;
        if (p) {
          setLanguage(p.language || 'en');
          setFontSizeLevel(p.font_size || 'large');
          setSimplicityLevel(p.simplicity_level || 'standard');
          setSpeechRate(p.speech_rate || 0.85);
        }
      }
    } catch (err) {
      console.error('Failed to load preferences:', err);
    }
  };

  // Secure Session Initialization
  useEffect(() => {
    const initSession = async () => {
      const wasLoggedOut = localStorage.getItem('buddy_logged_out') === 'true';
      const storedToken = localStorage.getItem('buddy_session_token');
      const storedId = localStorage.getItem('buddy_participant_id');

      if (!wasLoggedOut && storedToken) {
        try {
          const res = await fetch('/api/session/status', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.authenticated) {
              setSessionToken(storedToken);
              setParticipantId(data.participantId || storedId || 'senior_learner_1');
              setIsAuthenticated(true);
              loadInteractions(storedToken);
              loadProgress(data.participantId || storedId, storedToken);
              loadPreferences(data.participantId || storedId);
              return;
            }
          }
        } catch {
          // Token expired or invalid
        }
      }

      // Default safe initial session for first-time onboarding (if not explicitly logged out)
      if (!wasLoggedOut) {
        try {
          const res = await fetch('/api/session/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participantId: 'senior_learner_1' }),
          });
          if (res.ok) {
            const data = await res.json();
            setSessionToken(data.sessionToken);
            setParticipantId(data.participantId);
            setIsAuthenticated(true);
            localStorage.setItem('buddy_session_token', data.sessionToken);
            localStorage.setItem('buddy_participant_id', data.participantId);
            loadInteractions(data.sessionToken);
            loadProgress(data.participantId, data.sessionToken);
            loadPreferences(data.participantId);
            return;
          }
        } catch (e) {
          console.error('Failed to auto-start initial session:', e);
        }
      }

      // In logged-out state: strictly reset all session and chat states
      setIsAuthenticated(false);
      setSessionToken(null);
      setParticipantId('');
      setInteractions([]);
      setTopicProgress([]);
    };

    initSession();
    loadSummary();
    loadGuides();
    loadAdminInteractions();
  }, []);

  // Secure Logout Sequence
  const handleLogout = async () => {
    setIsLogoutConfirmOpen(false);

    try {
      if (sessionToken) {
        await fetch('/api/session/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // 1. Wipe browser persistent storage
      localStorage.setItem('buddy_logged_out', 'true');
      localStorage.removeItem('buddy_session_token');
      localStorage.removeItem('buddy_participant_id');
      sessionStorage.clear();

      // 2. Clear all sensitive state & reset participantId
      setSessionToken(null);
      setIsAuthenticated(false);
      setParticipantId('');
      setInteractions([]);
      setInputText('');
      setTopicProgress([]);

      // 3. Show reassuring notification for older adults
      setLogoutNotification(t.loggedOutDesc);
    }
  };

  // Secure Login / Session Start
  const handleLogin = async (newParticipantId: string) => {
    try {
      const res = await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: newParticipantId }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.removeItem('buddy_logged_out');
        localStorage.setItem('buddy_session_token', data.sessionToken);
        localStorage.setItem('buddy_participant_id', data.participantId);

        setSessionToken(data.sessionToken);
        setParticipantId(data.participantId);
        setIsAuthenticated(true);
        setLogoutNotification(null);
        setIsLoginModalOpen(false);

        // Load new learner's personalized preferences
        if (data.preferences) {
          setLanguage(data.preferences.language || 'en');
          setFontSizeLevel(data.preferences.font_size || 'large');
          setSimplicityLevel(data.preferences.simplicity_level || 'standard');
          setSpeechRate(data.preferences.speech_rate || 0.85);
        }

        // Securely fetch learner's interactions and progress
        await loadInteractions(data.sessionToken);
        await loadProgress(data.participantId, data.sessionToken);
      }
    } catch (err) {
      console.error('Failed to start learner session:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [interactions, activeTab, isLoading]);

  // Handle Save Preferences (Adaptation System)
  const handleSavePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = {
      participantId,
      language: newPrefs.language ?? language,
      fontSize: newPrefs.font_size ?? fontSizeLevel,
      simplicityLevel: newPrefs.simplicity_level ?? simplicityLevel,
      speechRate: newPrefs.speech_rate ?? speechRate,
      consentHistoryRetention: true,
    };

    if (newPrefs.language) setLanguage(newPrefs.language);
    if (newPrefs.font_size) setFontSizeLevel(newPrefs.font_size);
    if (newPrefs.simplicity_level) setSimplicityLevel(newPrefs.simplicity_level);
    if (newPrefs.speech_rate) setSpeechRate(newPrefs.speech_rate);

    try {
      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  };

  // Submit Question to Full Workflow Pipeline
  const handleSendMessage = async (customQuestion?: string, modality: 'text' | 'voice' = 'text') => {
    const questionToSend = customQuestion || inputText;
    if (!questionToSend.trim() || isLoading) return;

    if (!isAuthenticated || !sessionToken) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsLoading(true);
    setInputText('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          question: questionToSend,
          inputModality: modality,
          language,
          simplicityLevel,
        }),
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        setSessionToken(null);
        setInteractions([]);
        setIsLoginModalOpen(true);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setInteractions((prev) => [data.interaction, ...prev.filter((i) => i.id !== data.interaction.id)]);
        loadSummary();

        // Mark associated topic progress if matched
        if (data.verification?.citedSources?.length > 0) {
          const matchedDocTitle = data.verification.citedSources[0];
          const matchedGuide = guides.find((g) => g.title === matchedDocTitle);
          if (matchedGuide) {
            await fetch('/api/progress', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionToken}`,
              },
              body: JSON.stringify({
                participantId,
                topicId: matchedGuide.id,
                topicTitle: matchedGuide.title,
                completed: true,
              }),
            });
            loadProgress();
          }
        }
      }
    } catch (err) {
      console.error('Failed to send question:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start new clean chat session
  const handleNewChat = () => {
    setInputText('');
    setInteractions([]);
  };

  // Simplify an existing answer
  const handleSimplifyAnswer = async (interactionId: number, currentAnswer: string) => {
    try {
      const res = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: currentAnswer, language }),
      });
      if (res.ok) {
        const data = await res.json();
        setInteractions((prev) =>
          prev.map((i) =>
            i.id === interactionId
              ? {
                  ...i,
                  answer: `${i.answer}\n\n---\n🔍 ${t.explainSimply}:\n${data.simplified}`,
                }
              : i
          )
        );
      }
    } catch (err) {
      console.error('Failed to simplify:', err);
    }
  };

  // Repeat instruction recap
  const handleRepeatAnswer = async (interactionId: number, currentAnswer: string) => {
    try {
      const res = await fetch('/api/repeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: currentAnswer, language }),
      });
      if (res.ok) {
        const data = await res.json();
        setInteractions((prev) =>
          prev.map((i) =>
            i.id === interactionId
              ? {
                  ...i,
                  answer: `${i.answer}\n\n---\n🔁 ${t.repeatInstructions}:\n${data.repeated}`,
                }
              : i
          )
        );
      }
    } catch (err) {
      console.error('Failed to repeat:', err);
    }
  };

  // Submit Feedback Rating
  const handleFeedback = async (
    interactionId: number,
    rating: 'Good' | 'Okay' | 'Not good',
    notes?: string
  ) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interactionId, rating, notes }),
      });

      if (res.ok) {
        setInteractions((prev) =>
          prev.map((item) =>
            item.id === interactionId ? { ...item, feedback: rating, feedback_notes: notes } : item
          )
        );
        loadSummary();

        // If user felt the answer was 'Not good', adapt by switching to ultra_simple
        if (rating === 'Not good' && simplicityLevel !== 'ultra_simple') {
          handleSavePreferences({ simplicity_level: 'ultra_simple' });
        }
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  // Reset database
  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all interaction history and telemetry?')) {
      await fetch('/api/reset', { method: 'POST' });
      await loadInteractions();
      await loadAdminInteractions();
      await loadSummary();
      await loadProgress();
    }
  };

  // Agent Badge
  const renderAgentBadge = (agentName: string) => {
    switch (agentName) {
      case 'Safety Agent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            Safety Agent (Scam Protection)
          </span>
        );
      case 'Communication Agent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <PhoneCall className="w-4 h-4 text-indigo-600" />
            Communication Agent (WhatsApp & Video)
          </span>
        );
      case 'Accessibility Agent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-teal-100 text-teal-800 border border-teal-200">
            <Sliders className="w-4 h-4 text-teal-600" />
            Accessibility Agent (Screen & Fonts)
          </span>
        );
      case 'Support Agent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <HeartHandshake className="w-4 h-4 text-purple-600" />
            Support Agent (Patient Reassurance)
          </span>
        );
      case 'Feedback Agent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <MessageSquareQuote className="w-4 h-4 text-amber-600" />
            Feedback Agent (Rating Guide)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Learning Agent (Everyday Tech)
          </span>
        );
    }
  };

  // Verification Badge
  const renderVerificationBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {t.verifiedBadge}
          </span>
        );
      case 'PARTIALLY_GROUNDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
            {t.partiallyGroundedBadge}
          </span>
        );
      case 'SAFETY_OVERRIDE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            {t.safetyOverrideBadge}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            {t.generalGuidanceBadge}
          </span>
        );
    }
  };

  const fontClass =
    fontSizeLevel === 'xlarge'
      ? 'text-xl md:text-2xl leading-relaxed'
      : fontSizeLevel === 'large'
      ? 'text-lg md:text-xl leading-relaxed'
      : 'text-base md:text-lg leading-normal';

  const currentPreferences: UserPreferences = {
    participant_id: participantId,
    language,
    font_size: fontSizeLevel,
    simplicity_level: simplicityLevel,
    speech_rate: speechRate,
    consent_history_retention: true,
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Accessibility & Language Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  {t.appTitle}
                </h1>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                  {t.badge}
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-500 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Accessibility Controls: Language, Font Sizing, Settings */}
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => handleSavePreferences({ language: 'en' })}
                className={`px-2.5 py-1 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => handleSavePreferences({ language: 'hi' })}
                className={`px-2.5 py-1 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  language === 'hi'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleSavePreferences({ language: 'mr' })}
                className={`px-2.5 py-1 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  language === 'mr'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="मराठी मध्ये बदला"
              >
                मराठी
              </button>
            </div>

            {/* Font Sizing Controls */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => handleSavePreferences({ font_size: 'normal' })}
                className={`px-2.5 py-1 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  fontSizeLevel === 'normal'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Normal text size (16px)"
              >
                {t.normal}
              </button>
              <button
                onClick={() => handleSavePreferences({ font_size: 'large' })}
                className={`px-2.5 py-1 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  fontSizeLevel === 'large'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Large text size (19px)"
              >
                {t.large}
              </button>
              <button
                onClick={() => handleSavePreferences({ font_size: 'xlarge' })}
                className={`px-2.5 py-1 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  fontSizeLevel === 'xlarge'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Extra large text size (22px)"
              >
                {t.extraLarge}
              </button>
            </div>

            {/* Preferences Modal Trigger */}
            <button
              onClick={() => setIsPreferencesOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title={t.preferences}
            >
              <Settings className="w-5 h-5 text-slate-600" />
            </button>

            {/* Learner Session & Secure Logout Controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 md:gap-2">
                {/* Active Learner Badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs md:text-sm font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Active Session" />
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate max-w-[120px]">
                    {participantId === 'senior_learner_1'
                      ? 'Learner 1'
                      : participantId === 'senior_learner_2'
                      ? 'Learner 2'
                      : participantId}
                  </span>
                </div>

                {/* Secure Log Out Button */}
                <button
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  className="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>{t.logout}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3 py-2 rounded-xl border border-blue-600 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title={t.login}
              >
                <LogIn className="w-4 h-4" />
                <span>{t.login}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs (root > header > nav) */}
        <div
          key={`nav-${activeTab}`}
          role="navigation"
          aria-label="Tabs navigation"
          className="max-w-6xl mx-auto px-4 flex gap-2 border-t border-slate-100 overflow-x-auto transition-all duration-300 ease-in-out animate-fade-in"
        >
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-3 text-sm md:text-base font-semibold border-b-2 flex items-center gap-1.5 transition-all duration-300 ease-in-out whitespace-nowrap ${
              activeTab === 'home'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4 text-blue-600" />
            {t.tabHome}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-3 text-sm md:text-base font-semibold border-b-2 flex items-center gap-1.5 transition-all duration-300 ease-in-out whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            {t.tabChat}
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-3.5 py-3 text-sm md:text-base font-semibold border-b-2 flex items-center gap-1.5 transition-all duration-300 ease-in-out whitespace-nowrap ${
              activeTab === 'guides'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            {t.tabGuides}
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-3.5 py-3 text-sm md:text-base font-semibold border-b-2 flex items-center gap-1.5 transition-all duration-300 ease-in-out whitespace-nowrap ${
              activeTab === 'progress'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            {t.tabProgress}
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3.5 py-3 text-sm md:text-base font-semibold border-b-2 flex items-center gap-1.5 transition-all duration-300 ease-in-out whitespace-nowrap ${
              activeTab === 'agents'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            {t.tabAgents}
          </button>
          <button
            onClick={() => {
              setActiveTab('dashboard');
              loadSummary();
              loadAdminInteractions();
            }}
            className={`px-3.5 py-3 text-sm md:text-base font-semibold border-b-2 flex items-center gap-1.5 transition-all duration-300 ease-in-out whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-purple-600" />
            {t.tabDashboard}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main
        key={`content-${activeTab}`}
        className="max-w-6xl mx-auto w-full px-4 py-5 flex-1 flex flex-col transition-all duration-300 ease-in-out animate-fade-in"
      >
        {/* Reassuring Logout Confirmation Banner */}
        {logoutNotification && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-blue-950 text-sm animate-fade-in shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 text-sm md:text-base">{t.loggedOutTitle}</h4>
                <p className="text-xs md:text-sm text-blue-800 leading-relaxed">{logoutNotification}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setLogoutNotification(null);
                  setIsLoginModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm transition-colors cursor-pointer"
              >
                {t.login}
              </button>
              <button
                onClick={() => setLogoutNotification(null)}
                className="p-1.5 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-100 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Safety Disclaimer Banner */}
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3 text-emerald-950 text-xs md:text-sm">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="flex-1 leading-relaxed">
            <strong>{t.safetyBannerBold}</strong> {t.safetyBanner}
          </p>
        </div>

        {/* TAB 0: Home / Welcome */}
        {activeTab === 'home' && (
          <HomeWelcome
            language={language}
            onStartLearning={() => setActiveTab('chat')}
            onSelectTopic={(title) => {
              setActiveTab('chat');
              handleSendMessage(title, 'text');
            }}
          />
        )}

        {/* TAB 1: Chat with Buddy (Protected Pipeline) */}
        {activeTab === 'chat' && (
          !isAuthenticated ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6">
              <div className="max-w-md w-full space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {t.unauthorizedChatTitle}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {t.unauthorizedChatDesc}
                  </p>
                </div>

                <LoginModal
                  isOpen={true}
                  language={language}
                  onLogin={handleLogin}
                  isEmbedded={true}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[550px]">
              {/* Top Toolbar: New Chat Button & Clear */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Active Session ({interactions.length} messages)
                </span>

              <button
                onClick={handleNewChat}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Start a new chat conversation"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.newChat}</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
              {interactions.length === 0 ? (
                <div className="text-center py-12 text-slate-500 max-w-lg mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                    {t.welcomeHeading}
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base">
                    {t.welcomeSubheading}
                  </p>
                </div>
              ) : (
                interactions.map((msg) => (
                  <div key={msg.id} className="space-y-4">
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="max-w-2xl bg-blue-600 text-white rounded-3xl rounded-tr-none px-5 py-3.5 shadow-xs">
                        <div className="text-xs text-blue-200 font-medium mb-1">
                          You ({msg.input_modality === 'voice' ? '🎤 Voice' : '⌨️ Text'})
                        </div>
                        <p className={`${fontClass} font-semibold`}>{msg.question}</p>
                      </div>
                    </div>

                    {/* Buddy Assistant Response */}
                    <div className="flex justify-start">
                      <div className="max-w-2xl w-full bg-slate-50 border border-slate-200 rounded-3xl rounded-tl-none p-5 md:p-6 shadow-xs space-y-4">
                        {/* Header: Specialist Agent & Verification Status & Audio */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                          <div className="flex items-center gap-2 flex-wrap">
                            {renderAgentBadge(msg.agent_used)}
                            {renderVerificationBadge(msg.verification_status)}
                          </div>

                          {/* Text to Speech Audio Player with Senior Rate */}
                          <AudioPlayer
                            text={msg.answer}
                            language={msg.language}
                            speechRate={speechRate}
                          />
                        </div>

                        {/* Verified Sources Accordion if available */}
                        {msg.sources_retrieved && msg.sources_retrieved.length > 0 && (
                          <div className="bg-white rounded-xl border border-slate-200 p-2.5 text-xs">
                            <button
                              onClick={() =>
                                setExpandedSources((prev) => ({
                                  ...prev,
                                  [msg.id]: !prev[msg.id],
                                }))
                              }
                              className="w-full flex items-center justify-between font-semibold text-slate-700 hover:text-blue-700"
                            >
                              <span className="flex items-center gap-1.5">
                                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                                {t.sourcesUsed} ({msg.sources_retrieved.length})
                              </span>
                              {expandedSources[msg.id] ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>

                            {expandedSources[msg.id] && (
                              <div className="mt-2 pt-2 border-t border-slate-100 space-y-1 text-slate-600">
                                {msg.sources_retrieved.map((src, i) => (
                                  <div key={i} className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>{src}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Formatted Answer Body */}
                        <div
                          className={`${fontClass} text-slate-800 whitespace-pre-line leading-relaxed font-normal`}
                        >
                          {msg.answer}
                        </div>

                        {/* Repeat & Simplify Action Buttons */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <button
                            onClick={() => handleSimplifyAnswer(msg.id, msg.answer)}
                            className="px-3.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5"
                            title="Make this explanation even simpler"
                          >
                            <Sparkle className="w-3.5 h-3.5 text-blue-600" />
                            <span>{t.explainSimply}</span>
                          </button>

                          <button
                            onClick={() => handleRepeatAnswer(msg.id, msg.answer)}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5"
                            title="Recap and repeat instructions"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                            <span>{t.repeatInstructions}</span>
                          </button>
                        </div>

                        {/* Feedback Rating Buttons (Good, Okay, Not Good) */}
                        <div className="pt-3 border-t border-slate-200 space-y-2">
                          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                            <span>{t.didHelp}</span>
                            {msg.feedback && (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                {msg.feedback}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => handleFeedback(msg.id, 'Good')}
                              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border text-sm font-bold transition-all ${
                                msg.feedback === 'Good'
                                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300 shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-800'
                              }`}
                            >
                              <Smile className="w-4 h-4 text-emerald-600" />
                              <span>{t.good}</span>
                            </button>

                            <button
                              onClick={() => handleFeedback(msg.id, 'Okay')}
                              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border text-sm font-bold transition-all ${
                                msg.feedback === 'Okay'
                                  ? 'bg-amber-100 border-amber-400 text-amber-800 ring-2 ring-amber-300 shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-800'
                              }`}
                            >
                              <Meh className="w-4 h-4 text-amber-600" />
                              <span>{t.okay}</span>
                            </button>

                            <button
                              onClick={() => handleFeedback(msg.id, 'Not good')}
                              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border text-sm font-bold transition-all ${
                                msg.feedback === 'Not good'
                                  ? 'bg-rose-100 border-rose-400 text-rose-800 ring-2 ring-rose-300 shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-800'
                              }`}
                            >
                              <Frown className="w-4 h-4 text-rose-600" />
                              <span>{t.notGood}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 border border-slate-200 rounded-3xl rounded-tl-none p-4 md:p-5 flex items-center gap-3 text-slate-700">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600 shrink-0" />
                    <span className="text-sm md:text-base font-semibold">
                      Buddy is retrieving educational documents, checking safety, and formulating verified steps...
                    </span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Frequent Suggestions in current language */}
            <div className="p-3 md:px-6 bg-slate-50 border-t border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                {t.suggestedHeading}
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestionsByLang[language].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q.text, 'text')}
                    disabled={isLoading}
                    className="text-xs md:text-sm bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-800 px-3.5 py-1.5 rounded-full border border-slate-200 transition-colors shadow-2xs text-left"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar with Voice & Keyboard Pipeline */}
            <div className="p-3 md:p-5 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputText, 'text');
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Input Button */}
                <VoiceInput
                  language={language}
                  onTranscriptionComplete={(transcript) => handleSendMessage(transcript, 'voice')}
                  disabled={isLoading}
                />

                {/* Text Field */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.askPlaceholder}
                  disabled={isLoading}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-base md:text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
                  aria-label={t.askPlaceholder}
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-xs transition-colors text-base"
                >
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">{t.sendButton}</span>
                </button>
              </form>
            </div>
          </div>
        )
      )}

        {/* TAB 2: Quick Learning Guides with Local Search */}
        {activeTab === 'guides' && (
          <GuidesSearch
            guides={guides}
            language={language}
            onAskAboutGuide={(title) => {
              setActiveTab('chat');
              handleSendMessage(title, 'text');
            }}
          />
        )}

        {/* TAB 3: My Learning Progress */}
        {activeTab === 'progress' && (
          !isAuthenticated ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                Sign In Required to View Progress
              </h3>
              <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                To protect your privacy and load your personalized achievements, please start or select a learner session.
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base flex items-center gap-2 mx-auto cursor-pointer shadow-xs transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span>{t.login}</span>
              </button>
            </div>
          ) : (
            <ProgressDashboard
              participantId={participantId}
              interactions={interactions}
              progress={topicProgress}
              guides={guides}
              onPracticeTopic={(title) => {
                setActiveTab('chat');
                handleSendMessage(title, 'text');
              }}
            />
          )
        )}

        {/* TAB 4: The 7 Specialist Agents & Safety Architecture */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
                Buddy AI Multi-Agent Architecture (7 Specialist Agents)
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Buddy coordinates 7 specialized agents. The Coordinator analyzes user queries, selects the appropriate agent(s), retrieves grounded educational documents, verifies claims, and simplifies steps.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* 1. Learning Agent */}
                <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-600 text-white rounded-xl shadow-xs">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Learning Agent</h3>
                      <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                        Everyday Technology
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">
                    Explains everyday technology (Wi-Fi, apps, camera, battery, touch navigation) using simple numbered steps.
                  </p>
                </div>

                {/* 2. Safety Agent */}
                <div className="p-6 rounded-2xl border border-red-200 bg-red-50/50 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-600 text-white rounded-xl shadow-xs">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Safety Agent</h3>
                      <span className="text-xs font-semibold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                        Scam & Fraud Defense
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">
                    Intercepts sensitive queries (OTP, PIN, passwords, bank accounts, UPI fraud, AnyDesk) and provides urgent safety protocols.
                  </p>
                </div>

                {/* 3. Communication Agent */}
                <div className="p-6 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-xs">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Communication Agent</h3>
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                        WhatsApp & Video Calls
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">
                    Guides seniors through sending voice messages, texting family, sharing photos, and making face-to-face video calls.
                  </p>
                </div>

                {/* 4. Accessibility Agent */}
                <div className="p-6 rounded-2xl border border-teal-200 bg-teal-50/50 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-600 text-white rounded-xl shadow-xs">
                      <Sliders className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Accessibility Agent</h3>
                      <span className="text-xs font-semibold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
                        Screen & Vision Settings
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">
                    Helps adjust device font sizes, display zoom, bold text, volume levels, and high-contrast settings for comfortable use.
                  </p>
                </div>

                {/* 5. Support Agent */}
                <div className="p-6 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-600 text-white rounded-xl shadow-xs">
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Support Agent</h3>
                      <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                        Patient Encouragement
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">
                    Provides calming reassurance when users feel afraid or confused, breaking tasks down into bite-sized steps.
                  </p>
                </div>

                {/* 6. Verification Agent */}
                <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Verification Agent</h3>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Fact & Citation Checker
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">
                    Checks generated responses against retrieved educational evidence, validating sources and calculating confidence scores.
                  </p>
                </div>

                {/* 7. Feedback Agent */}
                <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-600 text-white rounded-xl shadow-xs">
                      <MessageSquareQuote className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Feedback Agent</h3>
                      <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        Rating & Continuous Adaptation
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">
                    Monitors user satisfaction ratings (Good, Okay, Not Good) and informs the Adaptation System to simplify future lessons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Protected Research & Admin Dashboard */}
        {activeTab === 'dashboard' && (
          <AdminDashboard
            summary={summaryData}
            interactions={adminInteractions}
            onRefresh={() => {
              loadSummary();
              loadAdminInteractions();
            }}
            onClearData={handleClearData}
            onDocumentIngested={() => {
              loadGuides();
              loadSummary();
            }}
          />
        )}
      </main>

      {/* Preferences Modal (Adaptation System) */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={currentPreferences}
        onSave={handleSavePreferences}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        participantId={participantId}
        language={language}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />

      {/* Login & Session Start Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        language={language}
        onLogin={handleLogin}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-center text-xs text-slate-500">
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
}
