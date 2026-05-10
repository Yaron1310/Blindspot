import { useState, useEffect, useCallback } from 'react';
import type { PlayerStateView } from '@/lib/types';

export function useGameState(roomId: string, playerName: string, interval: number | null) {
  const [state, setState] = useState<PlayerStateView | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    if (!roomId || !playerName) return;
    try {
      const res = await fetch(
        `/api/rooms/${roomId}/state?name=${encodeURIComponent(playerName)}`
      );
      if (!res.ok) {
        if (res.status === 404) setError('Room not found');
        return;
      }
      const data: PlayerStateView = await res.json();
      setState(data);
      setError(null);
    } catch {
      // network error — silently retry on next tick
    }
  }, [roomId, playerName]);

  // Always fetch once on mount / when identity changes
  useEffect(() => {
    if (roomId && playerName) fetchState();
  }, [roomId, playerName, fetchState]);

  // Background polling — only active when interval is set
  useEffect(() => {
    if (!roomId || !playerName || interval === null) return;
    const id = setInterval(fetchState, interval);
    return () => clearInterval(id);
  }, [roomId, playerName, interval, fetchState]);

  return { state, error, refetch: fetchState };
}
