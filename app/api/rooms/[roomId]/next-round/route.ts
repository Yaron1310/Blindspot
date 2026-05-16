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

    const room = await redis.get<RoomState>(`room:${roomId}`);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.host !== name) {
      return NextResponse.json({ error: 'Only the host can start a new round' }, { status: 403 });
    }

    // Reset existing players
    for (const pName of Object.keys(room.players)) {
      room.players[pName].ready = false;
      room.players[pName].role = '';
      room.players[pName].turn = 0;
    }

    // Move standby players into active players
    for (const pName of room.standby) {
      if (!room.players[pName]) {
        room.players[pName] = { ready: false, role: '', turn: 0 };
      }
      if (room.scores[pName] === undefined) {
        room.scores[pName] = 0;
      }
    }
    room.standby = [];

    room.phase = 'lobby';
    room.word = '';
    room.agentWord = '';
    room.category = '';
    room.agent = '';
    room.votes = {};
    room.result = null;
    room.turnOrder = {};
    room.readyStartedAt = 0;
    room.updatedAt = Date.now();

    await redis.set(`room:${roomId}`, room, { ex: 7200 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/rooms/[roomId]/next-round error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
