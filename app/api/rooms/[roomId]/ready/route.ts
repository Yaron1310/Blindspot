import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import type { RoomState } from '@/lib/types';
import { buildRoundState } from '@/lib/game-logic';

const TTL = 7200;

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
    const allReady = playerNames.length >= 2 && playerNames.every((p) => room.players[p].ready);

    if (allReady) {
      // Auto-start the round immediately
      buildRoundState(room);
    } else {
      room.updatedAt = Date.now();
    }

    await redis.set(`room:${roomId}`, room, { ex: TTL });

    return NextResponse.json({ ok: true, started: allReady });
  } catch (err) {
    console.error('POST /api/rooms/[roomId]/ready error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
