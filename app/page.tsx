'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HowToPlayModal } from '@/components/ui/HowToPlayModal';
import { useLanguage, type Lang } from '@/lib/i18n';

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'he', label: '🇮🇱 עברית' },
];

export default function LandingPage() {
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const [showPlayModal, setShowPlayModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('playerName') || '';
    if (stored) setName(stored);
    if (new URLSearchParams(window.location.search).get('play') === '1') {
      setShowPlayModal(true);
    }
  }, []);

  const handlePlay = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError(t('nameRequired')); return; }
    if (trimmed.length > 24) { setError(t('nameTooLong')); return; }
    sessionStorage.setItem('playerName', trimmed);
    router.push('/rooms');
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo */}
        <div className="space-y-3">
          <div className="text-7xl">🕵️</div>
          <h1 className="font-heading text-6xl text-text tracking-wider">{t('appName')}</h1>
          <p className="text-muted font-body text-sm">{t('tagline')}</p>
        </div>

        {/* Buttons */}
        {!showPlayModal ? (
          <div className="space-y-3">
            <button
              onClick={() => setShowPlayModal(true)}
              className="w-full bg-accent hover:bg-red-600 text-white font-body font-medium py-4 rounded-[14px] transition-all text-lg"
            >
              {t('playRandom')}
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-card hover:bg-border border border-border text-text font-body font-medium py-4 rounded-[14px] transition-all text-sm"
            >
              {t('loginSignup')}
            </button>
            <button
              onClick={() => setShowHowToPlay(true)}
              className="w-full text-muted hover:text-text font-body text-sm py-2 transition-colors"
            >
              {t('howToPlay')}
            </button>

            {/* Language selector */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="text-xs text-muted font-body">{t('selectLanguage')}:</span>
              <div className="flex gap-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-3 py-1.5 rounded-[10px] text-sm font-body transition-all border ${
                      lang === l.code
                        ? 'bg-accent border-accent text-white'
                        : 'bg-card border-border text-muted hover:text-text hover:border-accent'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="block text-xs text-muted font-body uppercase tracking-widest">
                {t('yourName')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
                placeholder={t('namePlaceholder')}
                maxLength={24}
                autoFocus
                className="w-full bg-card border border-border rounded-[14px] px-4 py-3 text-text font-body placeholder-muted focus:outline-none focus:border-accent transition-colors"
              />
              {error && <p className="text-accent text-xs font-body">{error}</p>}
              <p className="text-xs text-muted font-body text-right">{name.length}/24</p>
            </div>
            <button
              onClick={handlePlay}
              disabled={!name.trim()}
              className="w-full bg-accent hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-medium py-4 rounded-[14px] transition-all text-lg"
            >
              {t('continue')}
            </button>
            <button
              onClick={() => { setShowPlayModal(false); setError(''); }}
              className="w-full text-muted font-body text-sm py-2 hover:text-text transition-colors"
            >
              {t('back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
