'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { PlayerStateView } from '@/lib/types';
import { LobbyScreen } from '@/components/screens/LobbyScreen';
import { RevealScreen } from '@/components/screens/RevealScreen';
import { DiscussScreen } from '@/components/screens/DiscussScreen';
import { VoteScreen } from '@/components/screens/VoteScreen';
import { ResultScreen } from '@/components/screens/ResultScreen';
import { Spinner } from '@/components/ui/Spinner';

type ClientPhase = 'lobby' | 'reveal' | 'discuss' | 'vote' | 'result';

interface GameContainerProps {
  roomId: string;
  playerName: string;
  state: PlayerStateView;
  onRefetch: () => void;
}

function BackButton({ label = '← Leave', onClick }: { label?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 text-muted hover:text-text transition-colors font-body text-sm flex items-center gap-1 z-10"
    >
      {label}
    </button>
  );
}

export function GameContainer({ roomId, playerName, state, onRefetch }: GameContainerProps) {
  const router = useRouter();
  const [clientPhase, setClientPhase] = useState<ClientPhase>('lobby');
  const [loading, setLoading] = useState(false);
  const prevServerPhase = useRef<string>('');

  // Sync client phase with server phase changes
  useEffect(() => {
    const serverPhase = state.phase;

    if (serverPhase !== prevServerPhase.current) {
      prevServerPhase.current = serverPhase;

      if (serverPhase === 'lobby') {
        setClientPhase('lobby');
      } else if (serverPhase === 'reveal' && clientPhase === 'lobby') {
        setClientPhase('reveal');
      } else if (serverPhase === 'result') {
        setClientPhase('result');
      }
    }
  }, [state.phase, clientPhase]);

  const apiCall = async (endpoint: string, body: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rooms/${roomId}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error(`${endpoint} error:`, err);
      }
      onRefetch();
    } catch (err) {
      console.error(`${endpoint} network error:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleReady = () => apiCall('ready', { name: playerName });
  const handleStart = () => apiCall('start', { name: playerName });
  const handleForceStart = () => apiCall('start', { name: playerName, force: true });
  const handleVote = (target: string) => apiCall('vote', { voter: playerName, target });
  const handleNewRound = () => apiCall('next-round', { name: playerName });
  const handleCloseRoom = async () => {
    await apiCall('delete', { name: playerName });
    router.push('/rooms');
  };
  const handleLeave = () => router.push('/rooms');

  const isHost = state.host === playerName;
  const hasVoted = state.votes[playerName] !== undefined;

  // Standby screen — player joined mid-round
  if (state.isStandby) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative">
        <BackButton onClick={handleLeave} />
        <div className="w-full max-w-md text-center space-y-6">
          <div className="text-5xl">⏳</div>
          <h1 className="font-heading text-4xl text-text">ROUND IN PROGRESS</h1>
          <p className="text-muted font-body">
            A round is currently underway. You&apos;ll automatically join when it ends.
          </p>
          <div className="flex justify-center">
            <Spinner />
          </div>
          <p className="text-xs text-muted font-body">{state.roomName}</p>
        </div>
      </div>
    );
  }

  if (clientPhase === 'lobby') {
    return (
      <LobbyScreen
        state={state}
        playerName={playerName}
        onReady={handleReady}
        onStart={handleStart}
        onForceStart={handleForceStart}
        onLeave={handleLeave}
        loading={loading}
      />
    );
  }

  if (clientPhase === 'reveal') {
    return (
      <div className="relative">
        <BackButton onClick={handleLeave} />
        <RevealScreen
          myRole={state.myRole}
          myWord={state.myWord}
          myTurn={state.myTurn}
          turnOrder={state.turnOrder}
          category={state.category}
          mode={state.mode}
          onContinue={() => setClientPhase('discuss')}
        />
      </div>
    );
  }

  if (clientPhase === 'discuss') {
    return (
      <div className="relative">
        <BackButton onClick={handleLeave} />
        <DiscussScreen
          mode={state.mode}
          turnOrder={state.turnOrder}
          myName={playerName}
          myTurn={state.myTurn}
          onStartVoting={() => setClientPhase('vote')}
        />
      </div>
    );
  }

  if (clientPhase === 'vote') {
    return (
      <div className="relative">
        <BackButton onClick={handleLeave} />
        <VoteScreen
          players={state.players}
          myName={playerName}
          myRole={state.myRole}
          mode={state.mode}
          hasVoted={hasVoted}
          votes={state.votes}
          onVote={handleVote}
          loading={loading}
        />
      </div>
    );
  }

  if (clientPhase === 'result') {
    return (
      <ResultScreen
        result={state.result}
        scores={state.scores}
        isHost={isHost}
        playerName={playerName}
        onNewRound={handleNewRound}
        onCloseRoom={handleCloseRoom}
        loading={loading}
      />
    );
  }

  return null;
}
