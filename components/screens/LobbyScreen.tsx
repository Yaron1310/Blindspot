'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PlayerStateView } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PlayerList } from '@/components/ui/PlayerList';

const KICK_SECONDS = 30;
const FORCE_START_SECONDS = 20;

interface LobbyScreenProps {
  state: PlayerStateView;
  playerName: string;
  onReady: () => void;
  onForceStart: () => void;
  onLeave: () => void;
  loading?: boolean;
}

export function LobbyScreen({ state, playerName, onReady, onForceStart, onLeave, loading }: LobbyScreenProps) {
  const isHost = state.host === playerName;
  const myPlayer = state.players[playerName];
  const isReady = myPlayer?.ready ?? false;
  const playerNames = Object.keys(state.players);
  const allReady = playerNames.length > 0 && playerNames.every((p) => state.players[p].ready);
  const waitingCount = playerNames.filter((p) => !state.players[p].ready).length;
  const readyCount = playerNames.length - waitingCount;

  // Personal 30s kick countdown — starts on mount, stops when ready pressed
  const [kickSecondsLeft, setKickSecondsLeft] = useState(KICK_SECONDS);
  const [kickFired, setKickFired] = useState(false);

  useEffect(() => {
    if (isReady || kickFired) return;
    if (kickSecondsLeft <= 0) {
      setKickFired(true);
      onLeave();
      return;
    }
    const id = setTimeout(() => setKickSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [kickSecondsLeft, isReady, kickFired, onLeave]);

  // Group 20s force-start countdown — starts when first player presses ready
  const computeForceLeft = useCallback(() => {
    if (!state.readyStartedAt) return null;
    const elapsed = Math.floor((Date.now() - state.readyStartedAt) / 1000);
    return Math.max(0, FORCE_START_SECONDS - elapsed);
  }, [state.readyStartedAt]);

  const [forceSecondsLeft, setForceSecondsLeft] = useState<number | null>(null);
  const [forceStartFired, setForceStartFired] = useState(false);

  useEffect(() => {
    if (!state.readyStartedAt) { setForceSecondsLeft(null); setForceStartFired(false); return; }
    const tick = () => setForceSecondsLeft(computeForceLeft());
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [state.readyStartedAt, computeForceLeft]);

  useEffect(() => {
    if (isHost && forceSecondsLeft === 0 && !forceStartFired && readyCount >= 2) {
      setForceStartFired(true);
      onForceStart();
    }
  }, [isHost, forceSecondsLeft, forceStartFired, readyCount, onForceStart]);

  const showForceCountdown = forceSecondsLeft !== null && !allReady;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={onLeave} className="text-muted hover:text-text transition-colors font-body text-sm flex items-center gap-1">
            ← Rooms
          </button>
        </div>

        {/* Room info */}
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
          {state.round > 0 && <p className="text-sm text-muted font-body">Round {state.round}</p>}
        </div>

        {/* Player list */}
        <div className="bg-card border border-border rounded-[14px] p-6 space-y-4">
          <h2 className="font-heading text-xl text-text">PLAYERS ({playerNames.length})</h2>
          <PlayerList players={state.players} host={state.host} myName={playerName} />
        </div>

        {/* Personal kick timer — only shown before ready */}
        {!isReady && (
          <div className={`rounded-[14px] border p-4 text-center ${kickSecondsLeft <= 10 ? 'border-accent bg-red-950' : 'border-border bg-card'}`}>
            <p className="text-muted font-body text-xs mb-1">Press ready or you&apos;ll be removed in</p>
            <p className={`font-heading text-4xl ${kickSecondsLeft <= 10 ? 'text-accent' : 'text-text'}`}>
              {kickSecondsLeft}s
            </p>
          </div>
        )}

        {/* Group force-start countdown — shown after someone presses ready */}
        {showForceCountdown && (
          <div className={`rounded-[14px] border p-4 text-center ${forceSecondsLeft !== null && forceSecondsLeft <= 5 ? 'border-accent bg-red-950' : 'border-border bg-card'}`}>
            <p className="text-muted font-body text-xs mb-1">Game starts automatically in</p>
            <p className={`font-heading text-4xl ${forceSecondsLeft !== null && forceSecondsLeft <= 5 ? 'text-accent' : 'text-gold'}`}>
              {forceSecondsLeft}s
            </p>
            <p className="text-muted font-body text-xs mt-1">Players not ready will be skipped</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {!isReady && (
            <Button onClick={onReady} disabled={loading} className="w-full text-lg py-4" variant="primary">
              {loading ? 'Loading...' : "I'm Ready ✓"}
            </Button>
          )}

          <p className="text-center text-sm text-muted font-body">
            {allReady
              ? 'Starting game...'
              : !isReady
              ? `${waitingCount} player${waitingCount !== 1 ? 's' : ''} not ready`
              : `Waiting for ${waitingCount} player${waitingCount !== 1 ? 's' : ''}...`}
          </p>
        </div>

        {/* Scoreboard */}
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
