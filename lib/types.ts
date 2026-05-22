export interface RoomState {
  roomId: string;
  roomName: string;
  host: string;
  mode: 'classic' | 'super';
  phase: 'lobby' | 'reveal' | 'result';
  round: number;
  players: {
    [name: string]: {
      ready: boolean;
      role: 'word' | 'spy' | '';
      turn: number;
    };
  };
  standby: string[];
  word: string;
  spyWord: string;
  category: string;
  spy: string;
  lastSpy: string;
  lastWord: string;
  usedWords: string[];
  usedCategories: string[];
  votes: { [voterName: string]: string };
  scores: { [name: string]: number };
  result: {
    accused: string;
    correct: boolean;
    spy: string;
    word: string;
    spyWord: string;
    category: string;
    mode: 'classic' | 'super';
  } | null;
  turnOrder: { [name: string]: number };
  maxPlayers: number;
  readyStartedAt: number;
  updatedAt: number;
  ownerUsername?: string;
  gamezoneId?: string;
}

export interface PlayerStateView {
  roomId: string;
  roomName: string;
  host: string;
  mode: 'classic' | 'super';
  phase: 'lobby' | 'reveal' | 'result';
  round: number;
  players: {
    [name: string]: {
      ready: boolean;
      turn: number;
    };
  };
  myRole: 'word' | 'spy' | '';
  myWord: string;
  myTurn: number;
  isStandby: boolean;
  spy: string;
  scores: { [name: string]: number };
  votes: { [voterName: string]: string };
  category: string;
  result: (RoomState['result'] & { tally: Record<string, number> }) | null;
  turnOrder: { [name: string]: number };
  maxPlayers: number;
  readyStartedAt: number;
  ownerUsername?: string;
}

export interface GamezoneCategory {
  id: string;
  name: string;
  words: string[];
}

export interface Gamezone {
  id: string;
  userId: string;
  name: string;
  categories: GamezoneCategory[];
  createdAt: number;
}

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}
