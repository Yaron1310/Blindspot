import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import type { RoomState, Gamezone } from '@/lib/types';
import { buildRoundState } from '@/lib/game-logic';

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;
    const body = await request.json() as { name: string; force?: boolean };
    const { name, force } = body;

    const room = await redis.get<RoomState>(`room:${roomId}`);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.host !== name) {
      return NextResponse.json({ error: 'Only the host can start the round' }, { status: 403 });
    }

    const allPlayerNames = Object.keys(room.players);

    if (force) {
      for (const pName of allPlayerNames) {
        if (!room.players[pName].ready) {
          room.standby.push(pName);
          delete room.players[pName];
        }
      }
    }

    const playerNames = Object.keys(room.players);
    const allReady = playerNames.every((p) => room.players[p].ready);

    if (!allReady && !force) {
      return NextResponse.json({ error: 'Not all players are ready' }, { status: 409 });
    }

    if (playerNames.length < 2) {
      return NextResponse.json({ error: 'Need at least 2 players to start' }, { status: 409 });
    }

    // Load gamezone categories if this room was created from a gamezone
    let gamezoneCategories: Record<string, string[]> | undefined;
    if (room.ownerUsername && room.gamezoneId) {
      const userId = await redis.get<string>(`user:username:${room.ownerUsername}`);
      if (userId) {
        const gamezones = await redis.get<Gamezone[]>(`user:${userId}:gamezones`) ?? [];
        const gz = gamezones.find((g) => g.id === room.gamezoneId);
        if (gz) {
          gamezoneCategories = Object.fromEntries(
            gz.categories
              .filter((c) => c.words.length >= 2)
              .map((c) => [c.name, c.words])
          );
        }
      }
    }

    buildRoundState(room, gamezoneCategories);

    await redis.set(`room:${roomId}`, room, { ex: 7200 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/rooms/[roomId]/start error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
