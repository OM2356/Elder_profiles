import React, { useState } from 'react';
import { LogIn, User, ShieldCheck, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface LoginModalProps {
  isOpen: boolean;
  language: Language;
  onLogin: (participantId: string) => Promise<void>;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  language,
  onLogin,
  onClose,
  isEmbedded = false,
}) => {
  const [selectedId, setSelectedId] = useState('senior_learner_1');
  const [customId, setCustomId] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen && !isEmbedded) return null;

  const t = TRANSLATIONS[language];

  const presetProfiles = [
    {
      id: 'senior_learner_1',
      title: 'Senior Learner 1',
      subtitle: 'Primary account (Wi-Fi & smartphone practice)',
      avatar: '👵',
    },
    {
      id: 'senior_learner_2',
      title: 'Senior Learner 2',
      subtitle: 'Secondary account (WhatsApp & scam safety)',
      avatar: '👴',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalId = useCustom ? customId.trim() : selectedId;
    if (!finalId) return;

    setIsSubmitting(true);
    try {
      await onLogin(finalId);
      if (onClose) onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className={`bg-white rounded-3xl ${isEmbedded ? 'border border-slate-200 shadow-sm p-6 md:p-8' : 'max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200'} space-y-6`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <LogIn className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t.login}
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              {t.chooseLearner}
            </p>
          </div>
        </div>

        {onClose && !isEmbedded && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3 text-emerald-900 text-xs md:text-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.unauthorizedChatDesc}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Preset profiles selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {t.chooseLearner}:
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {presetProfiles.map((p) => {
              const isSelected = !useCustom && selectedId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(p.id);
                    setUseCustom(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-3xl shrink-0">{p.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <span>{p.title}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{p.subtitle}</div>
                  </div>
                </button>
              );
            })}

            {/* Custom Learner ID option */}
            <button
              type="button"
              onClick={() => setUseCustom(true)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                useCustom
                  ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <span>Custom Learner ID / Name</span>
                  {useCustom && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  Enter your unique name or identifier
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Custom Input Field if selected */}
        {useCustom && (
          <div className="pt-1 animate-fade-in">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Learner Identifier:
            </label>
            <input
              type="text"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder={t.customLearnerPlaceholder}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              autoFocus
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || (useCustom && !customId.trim())}
            className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 text-white font-bold text-base md:text-lg flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>{isSubmitting ? 'Starting Session...' : t.startNewSession}</span>
          </button>
        </div>
      </form>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      {content}
    </div>
  );
};
