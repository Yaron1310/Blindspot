import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import type { RoomState, Gamezone } from '@/lib/types';
import { buildRoundState } from '@/lib/game-logic';

const TTL = 3600;

async function loadGamezoneCategories(room: RoomState): Promise<Record<string, string[]> | undefined> {
  if (!room.ownerUsername || !room.gamezoneId) return undefined;
  const userId = await redis.get<string>(`user:username:${room.ownerUsername}`);
  if (!userId) return undefined;
  const gamezones = await redis.get<Gamezone[]>(`user:${userId}:gamezones`) ?? [];
  const gz = gamezones.find((g) => g.id === room.gamezoneId);
  if (!gz) return undefined;
  const categories = Object.fromEntries(
    gz.categories
      .filter((c) => c.words.length >= 2)
      .map((c) => [c.name, c.words])
  );
  return Object.keys(categories).length > 0 ? categories : undefined;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;
    const body = await request.json() as { name: string };
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const room = await redis.get<RoomState>(`room:${roomId}`);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (!room.players[name]) {
      return NextResponse.json({ error: 'Player not in room' }, { status: 403 });
    }

    room.players[name].ready = true;

    const playerNames = Object.keys(room.players);
    const readyCount = playerNames.filter((p) => room.players[p].ready).length;
    const allReady = playerNames.length >= 2 && playerNames.every((p) => room.players[p].ready);
    const maxPlayersReached = room.maxPlayers > 0 && readyCount >= room.maxPlayers && playerNames.length >= 2;
    const shouldStart = maxPlayersReached || allReady;

    if (shouldStart) {
      const gamezoneCategories = await loadGamezoneCategories(room);
      buildRoundState(room, gamezoneCategories);
    } else {
      room.updatedAt = Date.now();
    }

    await redis.set(`room:${roomId}`, room, { ex: TTL });

    return NextResponse.json({ ok: true, started: shouldStart });
  } catch (err) {
    console.error('POST /api/rooms/[roomId]/ready error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
