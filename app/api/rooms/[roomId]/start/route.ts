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
      // Move non-ready players to standby
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

    // Pick word / category based on mode
    let word = '';
    let imposterWord = '';
    let category = '';

    if (room.mode === 'imposter') {
      word = pickWord(room.usedWords, room.lastWord);
      room.usedWords = [...room.usedWords, word].slice(-10);
      room.lastWord = word;
    } else {
      category = pickCategory(room.usedCategories, room.category);
      const [crewWord, impWord] = pickTwoWordsFromCategory(category);
      word = crewWord;
      imposterWord = impWord;
      room.usedCategories = [...room.usedCategories, category].slice(-10);
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
    room.readyStartedAt = 0;
    room.updatedAt = Date.now();

    await redis.set(`room:${roomId}`, room, { ex: 7200 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/rooms/[roomId]/start error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
