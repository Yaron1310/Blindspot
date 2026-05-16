'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Gamezone } from '@/lib/types';

interface PublicProfile {
  username: string;
  gamezones: Gamezone[];
}

export default function UserPage() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Modal state
  const [modalGz, setModalGz] = useState<Gamezone | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [nameError, setNameError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('playerName') || '';
    if (stored) setPlayerName(stored);
  }, []);

  useEffect(() => {
    fetch(`/api/users/${params.username}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => { if (data) setProfile(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.username]);

  const handleCreateRoom = async () => {
    const trimmed = playerName.trim();
    if (!trimmed) { setNameError('Please enter your name'); return; }
    if (trimmed.length > 24) { setNameError('Name must be 24 characters or fewer'); return; }
    if (!modalGz) return;

    setNameError('');
    setCreating(true);
    sessionStorage.setItem('playerName', trimmed);

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: `${profile!.username}'s ${modalGz.name}`,
          hostName: trimmed,
          mode: 'super',
          ownerUsername: profile!.username,
          gamezoneId: modalGz.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/rooms/${data.roomId}`);
      } else {
        setNameError(data.error ?? 'Failed to create room');
      }
    } catch {
      setNameError('Something went wrong.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <p className="text-muted font-body">Loading...</p>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <p className="font-heading text-4xl text-text">404</p>
        <p className="text-muted font-body">User not found</p>
        <Link href="/" className="text-accent font-body text-sm hover:underline">← Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-muted hover:text-text font-body text-sm transition-colors">← Home</Link>
        </div>

        <div className="space-y-1">
          <div className="text-4xl">🕵️</div>
          <h1 className="font-heading text-4xl text-text">@{profile!.username}</h1>
          <p className="text-muted font-body text-sm">Gamezones</p>
        </div>

        {profile!.gamezones.length === 0 ? (
          <div className="bg-card border border-border rounded-[14px] p-8 text-center">
            <p className="text-muted font-body text-sm">No gamezones published yet.</p>
          </div>
        ) : (
          profile!.gamezones.map((gz) => (
            <div key={gz.id} className="bg-card border border-border rounded-[14px] p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-heading text-2xl text-text">{gz.name}</p>
                  <p className="text-muted font-body text-xs mt-1">
                    {gz.categories.length} {gz.categories.length === 1 ? 'category' : 'categories'}
                  </p>
                </div>
                <button
                  onClick={() => { setModalGz(gz); setNameError(''); }}
                  className="bg-accent hover:bg-red-600 text-white font-body font-medium px-4 py-2 rounded-[14px] transition-all text-sm"
                >
                  Create Room
                </button>
              </div>
              {gz.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {gz.categories.map((cat) => (
                    <span key={cat.id} className="bg-bg border border-border rounded-[8px] px-3 py-1 text-xs text-muted font-body">
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create room modal */}
      {modalGz && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setModalGz(null)}>
          <div className="bg-card border border-border rounded-[14px] p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-heading text-2xl text-text">JOIN AS</h2>
            <p className="text-muted font-body text-sm">Playing: <strong className="text-text">{modalGz.name}</strong></p>

            <div className="space-y-2">
              <label className="block text-xs text-muted font-body uppercase tracking-widest">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => { setPlayerName(e.target.value); setNameError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreateRoom(); }}
                placeholder="Enter your name..."
                maxLength={24}
                autoFocus
                className="w-full bg-bg border border-border rounded-[14px] px-4 py-3 text-text font-body placeholder-muted focus:outline-none focus:border-accent transition-colors"
              />
              {nameError && <p className="text-accent text-xs font-body">{nameError}</p>}
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={creating}
              className="w-full bg-accent hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-medium py-4 rounded-[14px] transition-all text-lg"
            >
              {creating ? 'Creating...' : 'Create Room →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
