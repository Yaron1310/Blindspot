import { getWords, getSuperWords } from './words';
import type { RoomState } from './types';

/**
 * Runs all round-start logic on a room and returns the updated room.
 * Mutates usedWords/usedCategories in place then returns the room.
 * Pass gamezoneCategories when the room has a gamezoneId to use custom words.
 */
export function buildRoundState(room: RoomState, gamezoneCategories?: Record<string, string[]>): RoomState {
  const playerNames = Object.keys(room.players);

  let word = '';
  let imposterWord = '';
  let category = '';

  if (room.mode === 'imposter') {
    word = pickWord(room.usedWords, room.lastWord);
    room.usedWords = [...room.usedWords, word].slice(-10);
    room.lastWord = word;
  } else if (gamezoneCategories && Object.keys(gamezoneCategories).length > 0) {
    category = pickCategory(room.usedCategories, room.category, gamezoneCategories);
    const [crewWord, impWord] = pickTwoWordsFromCategory(category, gamezoneCategories);
    word = crewWord;
    imposterWord = impWord;
    room.usedCategories = [...room.usedCategories, category].slice(-10);
  } else {
    category = pickCategory(room.usedCategories, room.category);
    const [crewWord, impWord] = pickTwoWordsFromCategory(category);
    word = crewWord;
    imposterWord = impWord;
    room.usedCategories = [...room.usedCategories, category].slice(-10);
  }

  const imposterName = pickImposter(playerNames, room.lastImposter);
  const turnOrder = assignTurnOrder(playerNames);

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

  return room;
}

/**
 * Pick a word not in usedWords and not equal to lastWord.
 * If all words are used, reset and pick from full list.
 */
export function pickWord(usedWords: string[], lastWord: string): string {
  const all = getWords();
  let available = all.filter((w) => !usedWords.includes(w) && w !== lastWord);
  if (available.length === 0) {
    // Reset used words, still avoid lastWord
    available = all.filter((w) => w !== lastWord);
    if (available.length === 0) available = all;
  }
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Pick a category not in usedCategories.
 * Pass customWords to draw from a gamezone instead of the built-in super_words.json.
 */
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

/**
 * Pick two distinct words from the given category.
 * Pass customWords to draw from a gamezone instead of the built-in super_words.json.
 */
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

/**
 * Pick an imposter from playerNames, not the same as lastImposter (unless only 1 player).
 */
export function pickImposter(playerNames: string[], lastImposter: string): string {
  let available = playerNames.filter((p) => p !== lastImposter);
  if (available.length === 0) available = playerNames;
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Randomly shuffle playerNames and assign turn numbers 1..N.
 */
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

/**
 * Count votes per target.
 */
export function tallyVotes(votes: Record<string, string>): Record<string, number> {
  const tally: Record<string, number> = {};
  for (const target of Object.values(votes)) {
    tally[target] = (tally[target] ?? 0) + 1;
  }
  return tally;
}

/**
 * Return the player with the most votes. Tie-break: first alphabetically.
 */
export function getAccused(tally: Record<string, number>): string {
  const entries = Object.entries(tally);
  if (entries.length === 0) return '';
  entries.sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });
  return entries[0][0];
}

/**
 * Required number of votes before results are tallied.
 * Classic: N-1 (everyone except the imposter)
 * Super: N (everyone including the imposter)
 */
export function requiredVotes(mode: 'imposter' | 'super', playerCount: number): number {
  return mode === 'imposter' ? playerCount - 1 : playerCount;
}
