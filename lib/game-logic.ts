import { getWords, getSuperWords } from './words';
import type { RoomState } from './types';

export function buildRoundState(room: RoomState, gamezoneCategories?: Record<string, string[]>): RoomState {
  const playerNames = Object.keys(room.players);

  let word = '';
  let agentWord = '';
  let category = '';

  if (room.mode === 'classic') {
    word = pickWord(room.usedWords, room.lastWord);
    room.usedWords = [...room.usedWords, word].slice(-10);
    room.lastWord = word;
  } else if (gamezoneCategories && Object.keys(gamezoneCategories).length > 0) {
    category = pickCategory(room.usedCategories, room.category, gamezoneCategories);
    const [crewWord, agWord] = pickTwoWordsFromCategory(category, gamezoneCategories);
    word = crewWord;
    agentWord = agWord;
    room.usedCategories = [...room.usedCategories, category].slice(-10);
  } else {
    category = pickCategory(room.usedCategories, room.category);
    const [crewWord, agWord] = pickTwoWordsFromCategory(category);
    word = crewWord;
    agentWord = agWord;
    room.usedCategories = [...room.usedCategories, category].slice(-10);
  }

  const agentName = pickAgent(playerNames, room.lastAgent);
  const turnOrder = assignTurnOrder(playerNames);

  for (const pName of playerNames) {
    room.players[pName].role = pName === agentName ? 'agent' : 'word';
    room.players[pName].turn = turnOrder[pName];
    room.players[pName].ready = false;
  }

  room.word = word;
  room.agentWord = agentWord;
  room.category = category;
  room.agent = agentName;
  room.lastAgent = agentName;
  room.votes = {};
  room.result = null;
  room.turnOrder = turnOrder;
  room.phase = 'reveal';
  room.round = room.round + 1;
  room.readyStartedAt = 0;
  room.updatedAt = Date.now();

  return room;
}

export function pickWord(usedWords: string[], lastWord: string): string {
  const all = getWords();
  let available = all.filter((w) => !usedWords.includes(w) && w !== lastWord);
  if (available.length === 0) {
    available = all.filter((w) => w !== lastWord);
    if (available.length === 0) available = all;
  }
  return available[Math.floor(Math.random() * available.length)];
}

export function pickCategory(usedCategories: string[], lastCategory: string, customWords?: Record<string, string[]>): string {
  const wordMap = customWords ?? getSuperWords();
  const allCategories = Object.keys(wordMap).filter((cat) => wordMap[cat].length >= 2);
  let available = allCategories.filter((c) => !usedCategories.includes(c) && c !== lastCategory);
  if (available.length === 0) {
    available = allCategories.filter((c) => c !== lastCategory);
    if (available.length === 0) available = allCategories;
  }
  return available[Math.floor(Math.random() * available.length)];
}

export function pickTwoWordsFromCategory(category: string, customWords?: Record<string, string[]>): [string, string] {
  const wordMap = customWords ?? getSuperWords();
  const words = wordMap[category];
  if (!words || words.length < 2) {
    throw new Error(`Category "${category}" does not have at least 2 words`);
  }
  const idx1 = Math.floor(Math.random() * words.length);
  let idx2 = Math.floor(Math.random() * (words.length - 1));
  if (idx2 >= idx1) idx2++;
  return [words[idx1], words[idx2]];
}

export function pickAgent(playerNames: string[], lastAgent: string): string {
  let available = playerNames.filter((p) => p !== lastAgent);
  if (available.length === 0) available = playerNames;
  return available[Math.floor(Math.random() * available.length)];
}

export function assignTurnOrder(playerNames: string[]): Record<string, number> {
  const shuffled = [...playerNames];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const order: Record<string, number> = {};
  shuffled.forEach((name, idx) => {
    order[name] = idx + 1;
  });
  return order;
}

export function tallyVotes(votes: Record<string, string>): Record<string, number> {
  const tally: Record<string, number> = {};
  for (const target of Object.values(votes)) {
    tally[target] = (tally[target] ?? 0) + 1;
  }
  return tally;
}

export function getAccused(tally: Record<string, number>): string {
  const entries = Object.entries(tally);
  if (entries.length === 0) return '';
  entries.sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });
  return entries[0][0];
}

export function requiredVotes(mode: 'classic' | 'super', playerCount: number): number {
  return mode === 'classic' ? playerCount - 1 : playerCount;
}
