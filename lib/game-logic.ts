import { getWords, getSuperWords } from './words';

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
 * If all categories used, reset and pick from full list.
 */
export function pickCategory(usedCategories: string[], lastCategory: string): string {
  const superWords = getSuperWords();
  const allCategories = Object.keys(superWords).filter(
    (cat) => superWords[cat].length >= 2
  );
  let available = allCategories.filter(
    (c) => !usedCategories.includes(c) && c !== lastCategory
  );
  if (available.length === 0) {
    available = allCategories.filter((c) => c !== lastCategory);
    if (available.length === 0) available = allCategories;
  }
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Pick two distinct words from the given category.
 * Returns [crewWord, imposterWord].
 */
export function pickTwoWordsFromCategory(category: string): [string, string] {
  const superWords = getSuperWords();
  const words = superWords[category];
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
