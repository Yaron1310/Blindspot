'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GameContainer } from '@/components/GameContainer';
import { Spinner } from '@/components/ui/Spinner';

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [playerName, setPlayerName] = useState('');
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('playerName') || '';
    if (!stored) { router.push('/'); return; }
    setPlayerName(stored);
  }, [router]);

  const joinRoom = useCallback(async (name: string) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (res.status === 404) { router.push('/rooms'); return; }
      if (!res.ok) { setJoinError(data.error ?? 'Failed to join room'); return; }
      setJoined(true);
    } catch {
      setJoinError('Network error. Please try again.');
    }
  }, [roomId, router]);

  useEffect(() => {
    if (playerName && !joined) joinRoom(playerName);
  }, [playerName, joined, joinRoom]);

  if (joinError) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-accent font-body">{joinError}</p>
          <button onClick={() => router.push('/rooms')} className="text-muted hover:text-text font-body text-sm transition-colors">
            ← Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  if (!joined || !playerName) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-muted font-body text-sm">Joining room...</p>
        </div>
      </div>
    );
  }

  return <GameContainer roomId={roomId} playerName={playerName} />;
}
