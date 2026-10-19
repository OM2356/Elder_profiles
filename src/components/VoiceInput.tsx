import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Check, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface VoiceInputProps {
  language: Language;
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

// Map app language to BCP 47 language code for SpeechRecognition
const SPEECH_LANG_MAP: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

export const VoiceInput: React.FC<VoiceInputProps> = ({
  language,
  onTranscriptionComplete,
  disabled = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    setErrorMsg(null);
    setInterimTranscript('');
    setFinalTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg(t.voiceUnavailable);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = SPEECH_LANG_MAP[language];

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentFinal += event.results[i][0].transcript + ' ';
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentFinal) {
          setFinalTranscript((prev) => (prev + ' ' + currentFinal).trim());
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access was blocked. Please allow microphone permission in your browser.');
        } else if (event.error === 'no-speech') {
          // Normal timeout if user was quiet
        } else {
          setErrorMsg(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not start voice recognition');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const cancelVoice = () => {
    stopListening();
    setFinalTranscript('');
    setInterimTranscript('');
    setErrorMsg(null);
  };

  const submitTranscript = () => {
    const textToSubmit = (finalTranscript + ' ' + interimTranscript).trim();
    if (textToSubmit) {
      onTranscriptionComplete(textToSubmit);
      cancelVoice();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      {/* Microphone Trigger Button */}
      {!isListening && !finalTranscript && (
        <button
          type="button"
          onClick={startListening}
          disabled={disabled}
          className="p-3 md:px-4 rounded-xl border border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-700 font-semibold flex items-center gap-2 shadow-2xs transition-colors disabled:opacity-50"
          title="Click to speak your question"
          aria-label="Click to speak your question"
        >
          <Mic className="w-5 h-5 text-blue-600" />
          <span className="hidden sm:inline text-sm">Speak</span>
        </button>
      )}

      {/* Active Listening Modal / Banner */}
      {(isListening || finalTranscript) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            {/* Header & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg md:text-xl">
                    {isListening ? t.listening : 'Review Your Spoken Question'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Language: {language === 'hi' ? 'हिन्दी (Hindi)' : language === 'mr' ? 'मराठी (Marathi)' : 'English'}
                  </p>
                </div>
              </div>

              <button
                onClick={cancelVoice}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
                title={t.voiceCancel}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Editable Transcript Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                What you said (You can edit this before sending):
              </label>
              <textarea
                value={finalTranscript + (interimTranscript ? ' ' + interimTranscript : '')}
                onChange={(e) => setFinalTranscript(e.target.value)}
                placeholder={t.voiceSpeakPrompt}
                rows={3}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-base md:text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* Privacy Guarantee Note */}
            <p className="text-xs text-slate-500 leading-relaxed">
              🔒 <strong>Privacy Assurance:</strong> Audio is processed privately by your browser and is never recorded or stored on our servers.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={cancelVoice}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors"
              >
                {t.voiceCancel}
              </button>

              {isListening ? (
                <button
                  type="button"
                  onClick={stopListening}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm flex items-center gap-2 transition-colors shadow-xs"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Done Speaking</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startListening}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Mic className="w-4 h-4 text-blue-600" />
                  <span>Speak Again</span>
                </button>
              )}

              <button
                type="button"
                onClick={submitTranscript}
                disabled={!(finalTranscript || interimTranscript).trim()}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm md:text-base flex items-center gap-2 shadow-sm transition-colors"
              >
                <Check className="w-5 h-5" />
                <span>{t.voiceSubmit}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
