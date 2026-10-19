import React from 'react';
import { X, Settings, RotateCcw, Check, Shield } from 'lucide-react';
import { FontSizeLevel, Language, SimplicityLevel, UserPreferences } from '../types';
import { TRANSLATIONS } from '../translations';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (prefs: Partial<UserPreferences>) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSave,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[preferences.language];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Settings className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-slate-900">{t.preferences}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setting 1: Language */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
            {t.languageSelect}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी (Hindi)' },
              { code: 'mr', label: 'मराठी (Marathi)' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSave({ language: lang.code as Language })}
                className={`py-2 px-2 rounded-xl border text-xs md:text-sm font-semibold transition-all text-center ${
                  preferences.language === lang.code
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Setting 2: Font Size */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
            {t.textSize}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { level: 'normal', label: 'Normal (16px)' },
              { level: 'large', label: 'Large (19px)' },
              { level: 'xlarge', label: 'Extra Large (22px)' },
            ].map((item) => (
              <button
                key={item.level}
                onClick={() => onSave({ font_size: item.level as FontSizeLevel })}
                className={`py-2 px-2 rounded-xl border text-xs md:text-sm font-semibold transition-all text-center ${
                  preferences.font_size === item.level
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Setting 3: Simplicity Level */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
            Explanation Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSave({ simplicity_level: 'standard' })}
              className={`p-3 rounded-xl border text-left text-xs md:text-sm font-semibold transition-all ${
                preferences.simplicity_level === 'standard'
                  ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-200'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold">Standard Buddy</div>
              <div className="text-2xs text-slate-500 font-normal mt-0.5">
                Friendly, balanced step-by-step answers
              </div>
            </button>

            <button
              onClick={() => onSave({ simplicity_level: 'ultra_simple' })}
              className={`p-3 rounded-xl border text-left text-xs md:text-sm font-semibold transition-all ${
                preferences.simplicity_level === 'ultra_simple'
                  ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-200'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold">Ultra-Simple</div>
              <div className="text-2xs text-slate-500 font-normal mt-0.5">
                Shortest sentences, high contrast steps
              </div>
            </button>
          </div>
        </div>

        {/* Setting 4: Voice Speech Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Voice Reading Speed
            </label>
            <span className="text-xs font-mono font-bold text-blue-700">
              {preferences.speech_rate}x
            </span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.1"
            step="0.05"
            value={preferences.speech_rate}
            onChange={(e) => onSave({ speech_rate: parseFloat(e.target.value) })}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-2xs text-slate-400">
            <span>0.7x (Very Slow)</span>
            <span>0.85x (Recommended for Seniors)</span>
            <span>1.1x (Faster)</span>
          </div>
        </div>

        {/* Privacy Consent Option */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Privacy Safeguard:</strong> Personal passwords or bank details are never accepted or stored. Your preferences adapt your learning experience locally.
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() =>
              onSave({
                language: 'en',
                font_size: 'large',
                simplicity_level: 'standard',
                speech_rate: 0.85,
              })
            }
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
