import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import type { RoomState } from '@/lib/types';
import { tallyVotes, getAccused, requiredVotes } from '@/lib/game-logic';

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;
    const body = await request.json() as { voter: string; target: string };
    const { voter, target } = body;

    if (!voter || !target) {
      return NextResponse.json({ error: 'voter and target are required' }, { status: 400 });
    }

    const room = await redis.get<RoomState>(`room:${roomId}`);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.phase !== 'reveal') {
      return NextResponse.json({ error: 'Not in voting phase' }, { status: 409 });
    }

    if (!room.players[voter]) {
      return NextResponse.json({ error: 'Voter is not in this room' }, { status: 403 });
    }

    if (room.votes[voter] !== undefined) {
      return NextResponse.json({ error: 'Already voted' }, { status: 409 });
    }

    // Classic mode: spy cannot vote (they don't know the word)
    if (room.mode === 'classic' && room.players[voter].role === 'spy') {
      return NextResponse.json({ error: 'Spy cannot vote in classic mode' }, { status: 403 });
    }

    // Classic mode: cannot vote for self
    if (room.mode === 'classic' && voter === target) {
      return NextResponse.json({ error: 'Cannot vote for yourself' }, { status: 400 });
    }

    room.votes[voter] = target;

    const playerCount = Object.keys(room.players).length;
    const needed = requiredVotes(room.mode, playerCount);
    const voteCount = Object.keys(room.votes).length;

    if (voteCount >= needed) {
      const tally = tallyVotes(room.votes);
      const accused = getAccused(tally);
      const correct = accused === room.spy;

      // Each player who correctly voted for the spy gets +1 point
      for (const [v, t] of Object.entries(room.votes)) {
        if (t === room.spy) {
          room.scores[v] = (room.scores[v] ?? 0) + 1;
        }
      }

      room.result = {
        accused,
        correct,
        spy: room.spy,
        word: room.word,
        spyWord: room.spyWord,
        category: room.category,
        mode: room.mode,
      };
      room.phase = 'result';
    }

    room.updatedAt = Date.now();
    await redis.set(`room:${roomId}`, room, { ex: 3600 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/rooms/[roomId]/vote error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
