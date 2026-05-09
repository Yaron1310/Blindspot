import { useState, useEffect } from 'react';

export function usePlayerName() {
  const [name, setNameState] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('playerName') || '';
    setNameState(stored);
  }, []);

  const setName = (n: string) => {
    sessionStorage.setItem('playerName', n);
    setNameState(n);
  };

  return { name, setName };
}
