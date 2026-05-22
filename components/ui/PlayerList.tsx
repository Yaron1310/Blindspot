import { Badge } from './Badge';

interface PlayerListProps {
  players: Record<string, { ready: boolean; turn: number }>;
  host: string;
  myName: string;
}

function PlayerRow({ name, player, host, myName }: { name: string; player: { ready: boolean; turn: number }; host: string; myName: string }) {
  return (
    <div className="flex items-center justify-between bg-surface border border-border rounded-[14px] px-4 py-2">
      <span className="font-body text-text font-medium text-sm truncate">{name}</span>
      <div className="flex items-center gap-1 shrink-0">
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
}

export function PlayerList({ players, host, myName }: PlayerListProps) {
  const playerNames = Object.keys(players);
  const half = Math.ceil(playerNames.length / 2);
  const leftCol = playerNames.slice(0, half);
  const rightCol = playerNames.slice(half);

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-2">
        {leftCol.map((name) => (
          <PlayerRow key={name} name={name} player={players[name]} host={host} myName={myName} />
        ))}
      </div>
      <div className="space-y-2">
        {rightCol.map((name) => (
          <PlayerRow key={name} name={name} player={players[name]} host={host} myName={myName} />
        ))}
      </div>
    </div>
  );
}
