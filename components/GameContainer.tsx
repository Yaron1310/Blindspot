'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { PlayerStateView } from '@/lib/types';
import { LobbyScreen } from '@/components/screens/LobbyScreen';
import { RevealScreen } from '@/components/screens/RevealScreen';
import { DiscussScreen } from '@/components/screens/DiscussScreen';
import { VoteScreen } from '@/components/screens/VoteScreen';
import { ResultScreen } from '@/components/screens/ResultScreen';

type ClientPhase = 'lobby' | 'reveal' | 'discuss' | 'vote' | 'result';

interface GameContainerProps {
  roomId: string;
  playerName: string;
  state: PlayerStateView;
  onRefetch: () => void;
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
  const handleVote = (target: string) => apiCall('vote', { voter: playerName, target });
  const handleNewRound = () => apiCall('next-round', { name: playerName });
  const handleCloseRoom = async () => {
    await apiCall('delete', { name: playerName });
    router.push('/rooms');
  };
  const handleLeave = () => {
    // Non-host leaves: just navigate away (room stays until host deletes)
    router.push('/rooms');
  };

  const isHost = state.host === playerName;
  const hasVoted = state.votes[playerName] !== undefined;

  if (clientPhase === 'lobby') {
    return (
      <LobbyScreen
        state={state}
        playerName={playerName}
        onReady={handleReady}
        onStart={handleStart}
        onLeave={handleLeave}
        loading={loading}
      />
    );
  }

  if (clientPhase === 'reveal') {
    return (
      <RevealScreen
        myRole={state.myRole}
        myWord={state.myWord}
        myTurn={state.myTurn}
        turnOrder={state.turnOrder}
        category={state.category}
        mode={state.mode}
        onContinue={() => setClientPhase('discuss')}
      />
    );
  }

  if (clientPhase === 'discuss') {
    return (
      <DiscussScreen
        mode={state.mode}
        turnOrder={state.turnOrder}
        myName={playerName}
        myTurn={state.myTurn}
        onStartVoting={() => setClientPhase('vote')}
      />
    );
  }

  if (clientPhase === 'vote') {
    return (
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
