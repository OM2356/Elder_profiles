import React from 'react';
import { LogOut, ShieldAlert, X } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  participantId: string;
  language: Language;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  participantId,
  language,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  // Friendly display name for default learner IDs
  const displayName =
    participantId === 'senior_learner_1'
      ? 'Senior Learner 1'
      : participantId === 'senior_learner_2'
      ? 'Senior Learner 2'
      : participantId || 'Learner';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <LogOut className="w-7 h-7" />
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h2 id="logout-modal-title" className="text-2xl font-bold text-slate-900">
            {t.confirmLogoutTitle}
          </h2>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-2.5 text-amber-900 text-sm font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {t.activeSession}: <strong>{displayName}</strong>
            </span>
          </div>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            {t.confirmLogoutDesc}
          </p>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs md:text-sm text-slate-700">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Session token invalidated on the server</span>
            </div>
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Participant ID reset and local cache purged</span>
            </div>
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Unauthorized access to chat history blocked</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-4 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-base md:text-lg flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>{t.logoutConfirmButton}</span>
          </button>
          <button
            onClick={onCancel}
            className="py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base md:text-lg transition-colors cursor-pointer"
          >
            {t.logoutCancelButton}
          </button>
        </div>
      </div>
    </div>
  );
};
