'use client';

import { Button } from '@/components/ui/Button';
import { SpeakingOrder } from '@/components/ui/SpeakingOrder';
import { useLanguage } from '@/lib/i18n';

interface RevealScreenProps {
  myRole: 'word' | 'spy' | '';
  myWord: string;
  myTurn: number;
  turnOrder: Record<string, number>;
  category: string;
  mode: 'classic' | 'super';
  onContinue: () => void;
}

export function RevealScreen({ myRole, myWord, myTurn, turnOrder, category, mode, onContinue }: RevealScreenProps) {
  const { t } = useLanguage();
  const isClassicSpy = mode === 'classic' && myRole === 'spy';
  const isSuper = mode === 'super';

  let cardBg = '';
  let cardBorder = '';
  let cardLabel = '';
  let cardWord = '';
  let labelColor = '';
  let wordColor = '';

  if (isSuper) {
    cardBg = 'bg-purple-950';
    cardBorder = 'border-purple';
    cardLabel = t('yourWordLabel');
    cardWord = myWord;
    labelColor = 'text-purple';
    wordColor = 'text-text';
  } else if (isClassicSpy) {
    cardBg = 'bg-red-950';
    cardBorder = 'border-accent';
    cardLabel = t('yourRole');
    cardWord = t('spyRole');
    labelColor = 'text-accent';
    wordColor = 'text-accent';
  } else {
    cardBg = 'bg-green-950';
    cardBorder = 'border-green';
    cardLabel = t('secretWord');
    cardWord = myWord;
    labelColor = 'text-green';
    wordColor = 'text-text';
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 pt-4">
        <div className={`${cardBg} border-2 ${cardBorder} rounded-[14px] p-8 text-center space-y-4`}>
          <p className={`font-heading text-sm tracking-widest ${labelColor}`}>{cardLabel}</p>
          {isClassicSpy && <div className="text-6xl mb-2">🕵️</div>}
          <p className={`font-heading text-5xl tracking-wide leading-tight ${wordColor}`}>{cardWord}</p>
          {isSuper && category && (
            <div className={`inline-block px-3 py-1 rounded-full border ${cardBorder} ${labelColor} text-xs font-body mt-2`}>
              {t('categoryLabel', { name: category })}
            </div>
          )}
          {isClassicSpy && (
            <p className="text-muted font-body text-sm mt-2">{t('blendIn')}</p>
          )}
        </div>

        <Button onClick={onContinue} className="w-full text-lg py-4" variant="secondary">
          {t('seenRole')}
        </Button>

        {Object.keys(turnOrder).length > 0 && (
          <div className="bg-card border border-border rounded-[14px] p-6">
            <SpeakingOrder turnOrder={turnOrder} myName={''} myTurn={myTurn} />
          </div>
        )}
      </div>
    </div>
  );
}
