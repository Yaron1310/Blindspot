'use client';

import { useRouter } from 'next/navigation';
import type { PlayerStateView } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PlayerList } from '@/components/ui/PlayerList';

interface LobbyScreenProps {
  state: PlayerStateView;
  playerName: string;
  onReady: () => void;
  onStart: () => void;
  onLeave: () => void;
  loading?: boolean;
}

export function LobbyScreen({ state, playerName, onReady, onStart, onLeave, loading }: LobbyScreenProps) {
  const router = useRouter();
  const isHost = state.host === playerName;
  const myPlayer = state.players[playerName];
  const isReady = myPlayer?.ready ?? false;
  const playerNames = Object.keys(state.players);
  const allReady = playerNames.length > 0 && playerNames.every((p) => state.players[p].ready);
  const waitingCount = playerNames.filter((p) => !state.players[p].ready).length;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { onLeave(); router.push('/rooms'); }}
            className="text-muted hover:text-text transition-colors font-body text-sm flex items-center gap-1"
          >
            ← Rooms
          </button>
        </div>

        {/* Room info card */}
        <div className="bg-card border border-border rounded-[14px] p-6 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="font-heading text-3xl text-text leading-none">{state.roomName}</h1>
              <p className="text-xs text-muted font-body mt-1">Room ID: {state.roomId}</p>
            </div>
            <Badge variant={state.mode === 'super' ? 'super' : 'imposter'}>
              {state.mode === 'super' ? 'Super Imposter' : 'Classic'}
            </Badge>
          </div>
          {state.round > 0 && (
            <p className="text-sm text-muted font-body">Round {state.round}</p>
          )}
        </div>

        {/* Player list */}
        <div className="bg-card border border-border rounded-[14px] p-6 space-y-4">
          <h2 className="font-heading text-xl text-text">PLAYERS ({playerNames.length})</h2>
          <PlayerList players={state.players} host={state.host} myName={playerName} />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {!isReady && (
            <Button
              onClick={onReady}
              disabled={loading}
              className="w-full text-lg py-4"
              variant="primary"
            >
              {loading ? 'Loading...' : "I'm Ready ✓"}
            </Button>
          )}

          {isHost && allReady && playerNames.length >= 2 && (
            <Button
              onClick={onStart}
              disabled={loading}
              className="w-full text-lg py-4"
              variant="gold"
            >
              {loading ? 'Starting...' : '🚀 Start Round'}
            </Button>
          )}

          {/* Status message */}
          <p className="text-center text-sm text-muted font-body">
            {!allReady && waitingCount > 0
              ? `Waiting for ${waitingCount} player${waitingCount !== 1 ? 's' : ''}...`
              : allReady && !isHost
              ? 'Waiting for host to start...'
              : allReady && isHost && playerNames.length < 2
              ? 'Need at least 2 players to start'
              : allReady && isHost
              ? 'Everyone is ready!'
              : ''}
          </p>
        </div>

        {/* Scoreboard (if scores exist) */}
        {state.round > 0 && Object.keys(state.scores).length > 0 && (
          <div className="bg-card border border-border rounded-[14px] p-6 space-y-3">
            <h2 className="font-heading text-xl text-text">SCORES</h2>
            <div className="space-y-2">
              {Object.entries(state.scores)
                .sort((a, b) => b[1] - a[1])
                .map(([name, score]) => (
                  <div key={name} className="flex justify-between items-center">
                    <span className="font-body text-text text-sm">{name}</span>
                    <span className="font-heading text-gold">{score}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
