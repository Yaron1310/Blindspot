import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import type { RoomState } from '@/lib/types';
import {
  pickWord,
  pickCategory,
  pickTwoWordsFromCategory,
  pickImposter,
  assignTurnOrder,
} from '@/lib/game-logic';

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
      return NextResponse.json({ error: 'Only the host can start the round' }, { status: 403 });
    }

    const playerNames = Object.keys(room.players);
    const allReady = playerNames.every((p) => room.players[p].ready);
    if (!allReady) {
      return NextResponse.json({ error: 'Not all players are ready' }, { status: 409 });
    }

    if (playerNames.length < 2) {
      return NextResponse.json({ error: 'Need at least 2 players' }, { status: 409 });
    }

    // Pick word / category based on mode
    let word = '';
    let imposterWord = '';
    let category = '';

    if (room.mode === 'imposter') {
      word = pickWord(room.usedWords, room.lastWord);
      // Track used words (cap at last 10)
      const newUsed = [...room.usedWords, word].slice(-10);
      room.usedWords = newUsed;
      room.lastWord = word;
    } else {
      category = pickCategory(room.usedCategories, room.category);
      const [crewWord, impWord] = pickTwoWordsFromCategory(category);
      word = crewWord;
      imposterWord = impWord;
      const newUsed = [...room.usedCategories, category].slice(-10);
      room.usedCategories = newUsed;
    }

    // Pick imposter
    const imposterName = pickImposter(playerNames, room.lastImposter);

    // Assign turn order
    const turnOrder = assignTurnOrder(playerNames);

    // Assign roles and turns to players
    for (const pName of playerNames) {
      room.players[pName].role = pName === imposterName ? 'imposter' : 'word';
      room.players[pName].turn = turnOrder[pName];
      room.players[pName].ready = false;
    }

    room.word = word;
    room.imposterWord = imposterWord;
    room.category = category;
    room.imposter = imposterName;
    room.lastImposter = imposterName;
    room.votes = {};
    room.result = null;
    room.turnOrder = turnOrder;
    room.phase = 'reveal';
    room.round = room.round + 1;
    room.updatedAt = Date.now();

    await redis.set(`room:${roomId}`, room, { ex: 86400 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/rooms/[roomId]/start error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
