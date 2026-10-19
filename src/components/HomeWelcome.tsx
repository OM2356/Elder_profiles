import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Wifi,
  MessageSquare,
  Video,
  ShieldAlert,
  CreditCard,
  ZoomIn,
  Heart,
  Volume2,
  CheckCircle,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface HomeWelcomeProps {
  language: Language;
  onStartLearning: () => void;
  onSelectTopic: (topicTitle: string) => void;
}

export const HomeWelcome: React.FC<HomeWelcomeProps> = ({
  language,
  onStartLearning,
  onSelectTopic,
}) => {
  const t = TRANSLATIONS[language];

  const features = [
    {
      title: '100% Patient & Friendly',
      desc: 'No rush, no confusing jargon. Buddy explains everything slowly, one step at a time.',
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50',
    },
    {
      title: 'Scam & OTP Protection',
      desc: 'Our Safety Agent alerts you if anyone asks for banking passwords, OTPs, or suspicious apps.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      title: 'Speak or Type Your Questions',
      desc: 'You can tap the microphone to speak naturally or type. Buddy can also read answers aloud.',
      icon: <Volume2 className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
    },
  ];

  const quickTopics = [
    {
      title: 'Smartphone Basics',
      desc: 'Touch screen, home buttons, and gestures.',
      icon: <Smartphone className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Internet & Wi-Fi',
      desc: 'Connecting to your home wireless network.',
      icon: <Wifi className="w-5 h-5 text-blue-600" />,
    },
    {
      title: 'WhatsApp & Messaging',
      desc: 'Voice notes, photos, and messages with family.',
      icon: <MessageSquare className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: 'Video Calling',
      desc: 'Face-to-face video calls to see your grandkids.',
      icon: <Video className="w-5 h-5 text-purple-600" />,
    },
    {
      title: 'Online Fraud Awareness',
      desc: 'Protecting against fake calls, OTPs, and scams.',
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
    },
    {
      title: 'Digital Payments & UPI',
      desc: 'Never enter PIN to receive money; safe payments.',
      icon: <CreditCard className="w-5 h-5 text-amber-600" />,
    },
    {
      title: 'Accessibility Settings',
      desc: 'Make text bigger, clearer, and easier to read.',
      icon: <ZoomIn className="w-5 h-5 text-teal-600" />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs md:text-sm font-semibold border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI-Powered Educational Tutor for Older Adults</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Hello! I am Buddy, your patient tech assistant.
          </h1>

          <p className="text-base md:text-xl text-blue-100 leading-relaxed font-normal">
            Technology should connect you, never confuse you. Ask any question about your phone, tablet, or apps, and I will explain it in simple, step-by-step instructions.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartLearning}
              className="px-8 py-4 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-black text-base md:text-lg flex items-center gap-2.5 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <span>{t.startLearning}</span>
              <ArrowRight className="w-5 h-5 text-blue-600" />
            </button>

            <span className="text-xs md:text-sm text-blue-200">
              ✓ Free & Private • ✓ Available in English, हिन्दी & मराठी
            </span>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-start gap-4"
          >
            <div className={`p-3 rounded-2xl ${feat.bg} shrink-0`}>{feat.icon}</div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{feat.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 7 Core Learning Topics Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">What would you like to learn today?</h2>
            <p className="text-sm text-slate-500">
              Tap any topic to practice with Buddy in simple numbered steps.
            </p>
          </div>
          <button
            onClick={onStartLearning}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Open AI Chat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTopics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => onSelectTopic(topic.title)}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all text-left group flex items-start gap-3.5 shadow-2xs"
            >
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 group-hover:border-blue-200 shrink-0">
                {topic.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{topic.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
