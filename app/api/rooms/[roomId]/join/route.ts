import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import type { RoomState } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;
    const body = await request.json() as { name: string };
    const { name } = body;

    if (!name || name.trim().length === 0 || name.length > 24) {
      return NextResponse.json({ error: 'Name must be 1-24 characters' }, { status: 400 });
    }

    const room = await redis.get<RoomState>(`room:${roomId}`);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const trimmedName = name.trim();

    // Already an active player
    if (room.players[trimmedName]) {
      return NextResponse.json({ ok: true, host: room.host, mode: room.mode, standby: false });
    }

    // Already in standby
    if (room.standby.includes(trimmedName)) {
      return NextResponse.json({ ok: true, host: room.host, mode: room.mode, standby: true });
    }

    if (room.phase !== 'lobby') {
      // Round in progress — put in standby
      room.standby.push(trimmedName);
      if (room.scores[trimmedName] === undefined) {
        room.scores[trimmedName] = 0;
      }
      room.updatedAt = Date.now();
      await redis.set(`room:${roomId}`, room, { ex: 86400 });
      return NextResponse.json({ ok: true, host: room.host, mode: room.mode, standby: true });
    }

    room.players[trimmedName] = { ready: false, role: '', turn: 0 };
    if (room.scores[trimmedName] === undefined) {
      room.scores[trimmedName] = 0;
    }
    room.updatedAt = Date.now();

    await redis.set(`room:${roomId}`, room, { ex: 86400 });

    return NextResponse.json({ ok: true, host: room.host, mode: room.mode, standby: false });
  } catch (err) {
    console.error('POST /api/rooms/[roomId]/join error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
