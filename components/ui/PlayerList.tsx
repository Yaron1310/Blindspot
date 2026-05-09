import { Badge } from './Badge';

interface PlayerListProps {
  players: Record<string, { ready: boolean; turn: number }>;
  host: string;
  myName: string;
}

export function PlayerList({ players, host, myName }: PlayerListProps) {
  const playerNames = Object.keys(players);

  return (
    <div className="space-y-2">
      {playerNames.map((name) => {
        const player = players[name];
        return (
          <div
            key={name}
            className="flex items-center justify-between bg-surface border border-border rounded-[14px] px-4 py-3"
          >
            <span className="font-body text-text font-medium">{name}</span>
            <div className="flex items-center gap-2">
              {name === myName && <Badge variant="you">YOU</Badge>}
              {name === host && <Badge variant="host">HOST</Badge>}
              {player.ready ? (
                <Badge variant="ready">Ready</Badge>
              ) : (
                <Badge variant="waiting">Waiting</Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
