'use client';

import { useState } from 'react';
import { HowToPlayModal } from './HowToPlayModal';
import { useLanguage } from '@/lib/i18n';

export function HowToPlayLanguageBar() {
  const { t, lang, setLang } = useLanguage();
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  return (
    <>
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-3 text-sm font-body text-muted">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="hover:text-text transition-colors"
          >
            {t('howToPlay')}
          </button>
          <span className="select-none">|</span>
          <button
            onClick={() => setShowLangPicker((v) => !v)}
            className="hover:text-text transition-colors"
          >
            {t('selectLanguage')}
          </button>
        </div>

        {showLangPicker && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => { setLang('en'); setShowLangPicker(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border font-body text-sm transition-all ${
                lang === 'en'
                  ? 'border-accent text-text bg-card'
                  : 'border-border text-muted hover:text-text hover:border-muted bg-card'
              }`}
            >
              <span>🇺🇸</span> English
            </button>
            <button
              onClick={() => { setLang('he'); setShowLangPicker(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border font-body text-sm transition-all ${
                lang === 'he'
                  ? 'border-accent text-text bg-card'
                  : 'border-border text-muted hover:text-text hover:border-muted bg-card'
              }`}
            >
              <span>🇮🇱</span> עברית
            </button>
          </div>
        )}
      </div>
    </>
  );
}
