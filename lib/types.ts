export interface RoomState {
  roomId: string;
  roomName: string;
  host: string;
  mode: 'imposter' | 'super';
  phase: 'lobby' | 'reveal' | 'result';
  round: number;
  players: {
    [name: string]: {
      ready: boolean;
      role: 'word' | 'imposter' | '';
      turn: number;
    };
  };
  word: string;
  imposterWord: string;
  category: string;
  imposter: string;
  lastImposter: string;
  lastWord: string;
  usedWords: string[];
  usedCategories: string[];
  votes: { [voterName: string]: string };
  scores: { [name: string]: number };
  result: {
    accused: string;
    correct: boolean;
    imposter: string;
    word: string;
    imposterWord: string;
    category: string;
    mode: 'imposter' | 'super';
  } | null;
  turnOrder: { [name: string]: number };
  updatedAt: number;
}

export interface PlayerStateView {
  roomId: string;
  roomName: string;
  host: string;
  mode: 'imposter' | 'super';
  phase: 'lobby' | 'reveal' | 'result';
  round: number;
  players: {
    [name: string]: {
      ready: boolean;
      turn: number;
    };
  };
  myRole: 'word' | 'imposter' | '';
  myWord: string;
  myTurn: number;
  imposter: string;
  scores: { [name: string]: number };
  votes: { [voterName: string]: string };
  category: string;
  result: (RoomState['result'] & { tally: Record<string, number> }) | null;
  turnOrder: { [name: string]: number };
}
