'use client';

import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/lib/i18n';

interface VoteScreenProps {
  players: Record<string, { ready: boolean; turn: number }>;
  myName: string;
  myRole: 'word' | 'spy' | '';
  mode: 'classic' | 'super';
  hasVoted: boolean;
  votes: Record<string, string>;
  onVote: (target: string) => void;
  loading?: boolean;
}

export function VoteScreen({ players, myName, myRole, mode, hasVoted, votes, onVote, loading }: VoteScreenProps) {
  const { t } = useLanguage();
  const playerNames = Object.keys(players);
  const isClassicSpy = mode === 'classic' && myRole === 'spy';

  if (isClassicSpy) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6 pt-4">
          <div className="text-6xl">🕵️</div>
          <h1 className="font-heading text-4xl text-accent">{t('youAreTheSpy')}</h1>
          <p className="text-muted font-body">{t('waitingToVote')}</p>
          <div className="flex justify-center"><Spinner /></div>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    const votedFor = votes[myName];
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6 pt-4">
          <h1 className="font-heading text-4xl text-text">{t('voteCast')}</h1>
          {votedFor && (
            <p className="text-muted font-body">
              {t('youVotedFor', { name: votedFor })}
            </p>
          )}
          <p className="text-muted font-body">{t('waitingForOthers')}</p>
          <div className="flex justify-center"><Spinner /></div>
        </div>
      </div>
    );
  }

  const title = mode === 'super' ? t('whoDifferentWord') : t('whoIsTheSpy');

  let candidates: string[] = [];
  if (mode === 'super') {
    candidates = [myName, ...playerNames.filter((n) => n !== myName)];
  } else {
    candidates = playerNames.filter((n) => n !== myName);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 pt-4">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl text-text">{title}</h1>
          <p className="text-muted font-body text-sm">{t('tapToVote')}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {candidates.map((name) => {
            const isMe = name === myName;
            return (
              <button
                key={name}
                onClick={() => !loading && onVote(name)}
                disabled={loading}
                className={`p-4 rounded-[14px] border-2 transition-all font-body font-medium text-center
                  ${isMe
                    ? 'border-gold bg-yellow-950 text-gold hover:bg-yellow-900'
                    : 'border-border bg-card text-text hover:border-accent hover:bg-red-950'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isMe ? t('meOption') : name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
