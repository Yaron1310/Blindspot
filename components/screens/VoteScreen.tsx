'use client';

import { Spinner } from '@/components/ui/Spinner';

interface VoteScreenProps {
  players: Record<string, { ready: boolean; turn: number }>;
  myName: string;
  myRole: 'word' | 'imposter' | '';
  mode: 'imposter' | 'super';
  hasVoted: boolean;
  votes: Record<string, string>;
  onVote: (target: string) => void;
  loading?: boolean;
}

export function VoteScreen({ players, myName, myRole, mode, hasVoted, votes, onVote, loading }: VoteScreenProps) {
  const playerNames = Object.keys(players);
  const isClassicImposter = mode === 'imposter' && myRole === 'imposter';

  // Classic imposter waiting screen
  if (isClassicImposter) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="text-6xl">🕵️</div>
          <h1 className="font-heading text-4xl text-accent">YOU ARE THE IMPOSTER</h1>
          <p className="text-muted font-body">Waiting for all players to vote...</p>
          <div className="flex justify-center">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  // After voting — waiting for others
  if (hasVoted) {
    const votedFor = votes[myName];
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <h1 className="font-heading text-4xl text-text">VOTE CAST</h1>
          {votedFor && (
            <p className="text-muted font-body">
              You voted for <span className="text-text font-bold">{votedFor}</span>
            </p>
          )}
          <p className="text-muted font-body">Waiting for others...</p>
          <div className="flex justify-center">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  const title = mode === 'super' ? 'Who has the different word?' : 'Who is the imposter?';

  // Build candidate list
  // Super mode: "Me" first (gold), then everyone else
  // Classic mode: everyone except self
  let candidates: string[] = [];
  if (mode === 'super') {
    candidates = [myName, ...playerNames.filter((n) => n !== myName)];
  } else {
    candidates = playerNames.filter((n) => n !== myName);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl text-text">{title}</h1>
          <p className="text-muted font-body text-sm">Tap a player to cast your vote</p>
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
                {isMe ? '👤 Me' : name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
