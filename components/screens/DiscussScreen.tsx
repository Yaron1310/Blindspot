'use client';

import { Button } from '@/components/ui/Button';
import { SpeakingOrder } from '@/components/ui/SpeakingOrder';
import { useLanguage } from '@/lib/i18n';

interface DiscussScreenProps {
  mode: 'classic' | 'super';
  turnOrder: Record<string, number>;
  myName: string;
  myTurn: number;
  onStartVoting: () => void;
}

export function DiscussScreen({ mode, turnOrder, myName, myTurn, onStartVoting }: DiscussScreenProps) {
  const { t } = useLanguage();
  const hint = mode === 'classic' ? t('classicHint') : t('superHint');

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-4xl text-text">{t('discussion')}</h1>
          <p className="text-muted font-body text-sm max-w-sm mx-auto">{hint}</p>
        </div>
        {Object.keys(turnOrder).length > 0 && (
          <div className="bg-card border border-border rounded-[14px] p-6">
            <SpeakingOrder turnOrder={turnOrder} myName={myName} myTurn={myTurn} />
          </div>
        )}
        <Button onClick={onStartVoting} className="w-full text-lg py-4" variant="primary">
          {t('startVoting')}
        </Button>
      </div>
    </div>
  );
}
