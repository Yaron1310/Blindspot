'use client';

import type { RoomState } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { TallyBars } from '@/components/ui/TallyBars';
import { Scoreboard } from '@/components/ui/Scoreboard';

interface ResultScreenProps {
  result: (RoomState['result'] & { tally: Record<string, number> }) | null;
  scores: Record<string, number>;
  isHost: boolean;
  playerName: string;
  onNewRound: () => void;
  onCloseRoom: () => void;
  loading?: boolean;
}

export function ResultScreen({ result, scores, isHost, onNewRound, onCloseRoom, loading }: ResultScreenProps) {
  if (!result) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-muted font-body">Loading result...</p>
      </div>
    );
  }

  const crewWins = result.correct;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Win Banner */}
        <div
          className={`rounded-[14px] border-2 p-6 text-center space-y-2 ${
            crewWins
              ? 'bg-green-950 border-green'
              : 'bg-red-950 border-accent'
          }`}
        >
          <div className="text-4xl">{crewWins ? '🎉' : '🕵️'}</div>
          <h1 className={`font-heading text-5xl ${crewWins ? 'text-green' : 'text-accent'}`}>
            {crewWins ? 'CREW WINS!' : 'IMPOSTER WINS!'}
          </h1>
          <p className="font-body text-text text-sm mt-1">
            The imposter was <span className="font-bold">{result.imposter}</span>
          </p>

          {result.mode === 'super' ? (
            <div className="mt-3 space-y-1">
              <p className="text-xs text-muted font-body">Category: <span className="text-text">{result.category}</span></p>
              <p className="text-xs text-muted font-body">
                Crew word: <span className="text-green font-bold">{result.word}</span>
              </p>
              <p className="text-xs text-muted font-body">
                Imposter word: <span className="text-accent font-bold">{result.imposterWord}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm font-body text-muted mt-2">
              The word was <span className="text-text font-bold">{result.word}</span>
            </p>
          )}

          {!result.correct && (
            <p className="text-xs text-muted font-body mt-1">
              {result.accused} was accused instead
            </p>
          )}
        </div>

        {/* Vote Tally */}
        <div className="bg-card border border-border rounded-[14px] p-6 space-y-3">
          <h2 className="font-heading text-xl text-text">VOTE TALLY</h2>
          <TallyBars tally={result.tally} />
        </div>

        {/* Scoreboard */}
        <div className="bg-card border border-border rounded-[14px] p-6 space-y-3">
          <h2 className="font-heading text-xl text-text">SCOREBOARD</h2>
          <Scoreboard scores={scores} />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {isHost ? (
            <>
              <Button
                onClick={onNewRound}
                disabled={loading}
                variant="gold"
                className="w-full text-lg py-4"
              >
                {loading ? 'Loading...' : '▶ New Round'}
              </Button>
              <Button
                onClick={onCloseRoom}
                disabled={loading}
                variant="danger"
                className="w-full"
              >
                Close Room
              </Button>
            </>
          ) : (
            <p className="text-center text-muted font-body text-sm">
              Waiting for the host to start a new round...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
