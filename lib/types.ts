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
      role: 'word' | 'agent' | '';
      turn: number;
    };
  };
  standby: string[];
  word: string;
  agentWord: string;
  category: string;
  agent: string;
  lastAgent: string;
  lastWord: string;
  usedWords: string[];
  usedCategories: string[];
  votes: { [voterName: string]: string };
  scores: { [name: string]: number };
  result: {
    accused: string;
    correct: boolean;
    agent: string;
    word: string;
    agentWord: string;
    category: string;
    mode: 'classic' | 'super';
  } | null;
  turnOrder: { [name: string]: number };
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
  myRole: 'word' | 'agent' | '';
  myWord: string;
  myTurn: number;
  isStandby: boolean;
  agent: string;
  scores: { [name: string]: number };
  votes: { [voterName: string]: string };
  category: string;
  result: (RoomState['result'] & { tally: Record<string, number> }) | null;
  turnOrder: { [name: string]: number };
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
