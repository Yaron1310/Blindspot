import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import type { RoomState } from '@/lib/types';

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
      return NextResponse.json({ ok: true }); // already gone
    }

    // Remove from active players or standby
    delete room.players[name];
    room.standby = room.standby.filter((n) => n !== name);

    const remainingPlayers = Object.keys(room.players);

    // No players left — delete the room entirely
    if (remainingPlayers.length === 0) {
      await redis.del(`room:${roomId}`);
      await redis.srem('rooms:index', roomId);
      return NextResponse.json({ ok: true });
    }

    // Host left — transfer to next player alphabetically
    if (room.host === name) {
      room.host = remainingPlayers.sort()[0];
    }

    room.updatedAt = Date.now();
    await redis.set(`room:${roomId}`, room, { ex: TTL });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/rooms/[roomId]/leave error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
