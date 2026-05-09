interface ScoreboardProps {
  scores: Record<string, number>;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function Scoreboard({ scores }: ScoreboardProps) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-2">
      {sorted.map(([name, score], index) => (
        <div
          key={name}
          className="flex items-center justify-between bg-surface border border-border rounded-[14px] px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl w-8 text-center">
              {index < 3 ? MEDALS[index] : <span className="text-muted font-body text-sm">{index + 1}</span>}
            </span>
            <span className="font-body text-text">{name}</span>
          </div>
          <span className="font-heading text-gold text-xl">{score}</span>
        </div>
      ))}
    </div>
  );
}
