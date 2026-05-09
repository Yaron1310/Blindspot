import { useState, useEffect, useRef } from 'react';
import type { PlayerStateView } from '@/lib/types';

export function useGameState(roomId: string, playerName: string) {
  const [state, setState] = useState<PlayerStateView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchState = async () => {
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
  };

  useEffect(() => {
    if (!roomId || !playerName) return;
    fetchState();
    intervalRef.current = setInterval(fetchState, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, playerName]);

  return { state, error, refetch: fetchState };
}
