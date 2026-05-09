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

    // Reject duplicate votes
    if (room.votes[voter] !== undefined) {
      return NextResponse.json({ error: 'Already voted' }, { status: 409 });
    }

    // Classic mode: imposter cannot vote
    if (room.mode === 'imposter' && room.players[voter].role === 'imposter') {
      return NextResponse.json({ error: 'Imposter cannot vote in classic mode' }, { status: 403 });
    }

    // Classic mode: cannot vote for self
    if (room.mode === 'imposter' && voter === target) {
      return NextResponse.json({ error: 'Cannot vote for yourself' }, { status: 400 });
    }

    room.votes[voter] = target;

    const playerCount = Object.keys(room.players).length;
    const needed = requiredVotes(room.mode, playerCount);
    const voteCount = Object.keys(room.votes).length;

    if (voteCount >= needed) {
      // All required votes received — compute result
      const tally = tallyVotes(room.votes);
      const accused = getAccused(tally);
      const correct = accused === room.imposter;

      if (room.mode === 'super') {
        // Super mode: every player who voted for the imposter gets +1 (each for themselves)
        for (const [voter, target] of Object.entries(room.votes)) {
          if (target === room.imposter) {
            room.scores[voter] = (room.scores[voter] ?? 0) + 1;
          }
        }
      } else if (correct) {
        // Classic — crew wins: each crew member gets +1
        for (const [pName, pData] of Object.entries(room.players)) {
          if (pData.role !== 'imposter') {
            room.scores[pName] = (room.scores[pName] ?? 0) + 1;
          }
        }
      } else {
        // Classic — imposter wins: imposter gets +2
        room.scores[room.imposter] = (room.scores[room.imposter] ?? 0) + 2;
      }

      room.result = {
        accused,
        correct,
        imposter: room.imposter,
        word: room.word,
        imposterWord: room.imposterWord,
        category: room.category,
        mode: room.mode,
      };
      room.phase = 'result';
    }

    room.updatedAt = Date.now();
    await redis.set(`room:${roomId}`, room, { ex: 86400 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/rooms/[roomId]/vote error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
