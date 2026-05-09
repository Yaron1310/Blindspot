import fs from 'fs';
import path from 'path';

let _words: string[] | null = null;
let _superWords: Record<string, string[]> | null = null;

export function getWords(): string[] {
  if (!_words) {
    const filePath = path.join(process.cwd(), 'public', 'words.json');
    _words = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as string[];
  }
  return _words;
}

export function getSuperWords(): Record<string, string[]> {
  if (!_superWords) {
    const filePath = path.join(process.cwd(), 'public', 'super_words.json');
    _superWords = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, string[]>;
  }
  return _superWords;
}
