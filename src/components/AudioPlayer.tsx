import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface AudioPlayerProps {
  text: string;
  language: Language;
  speechRate?: number;
}

const SPEECH_VOICE_LANG: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  text,
  language,
  speechRate = 0.85,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    // Reset state on text or language change
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, language]);

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown asterisks and symbols for smoother speech synthesis
    const cleanText = text
      .replace(/[*#_~`>]/g, '')
      .replace(/\[Doc:[^\]]+\]/g, '')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.lang = SPEECH_VOICE_LANG[language] || 'en-IN';

    // Find a matching voice if available in browser
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) =>
      v.lang.toLowerCase().startsWith(language === 'hi' ? 'hi' : language === 'mr' ? 'mr' : 'en')
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    setIsPlaying(true);
    setIsPaused(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  if (!('speechSynthesis' in window)) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1.5 bg-slate-200/80 rounded-xl p-1 text-slate-700">
      {!isPlaying && !isPaused && (
        <button
          onClick={handlePlay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold transition-colors shadow-2xs"
          title={t.listenAloud}
          aria-label={t.listenAloud}
        >
          <Volume2 className="w-4 h-4" />
          <span>{t.listenAloud}</span>
        </button>
      )}

      {isPlaying && (
        <>
          <button
            onClick={handlePause}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors"
            title="Pause voice"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
          <button
            onClick={handleStop}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors animate-pulse"
            title={t.stopAudio}
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>{t.stopAudio}</span>
          </button>
        </>
      )}

      {isPaused && (
        <>
          <button
            onClick={handlePlay}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
            title="Resume voice"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>
          <button
            onClick={handleStop}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-600 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            title={t.stopAudio}
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>{t.stopAudio}</span>
          </button>
        </>
      )}
    </div>
  );
};
