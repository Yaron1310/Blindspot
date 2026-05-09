interface TallyBarsProps {
  tally: Record<string, number>;
}

export function TallyBars({ tally }: TallyBarsProps) {
  const entries = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const maxVotes = entries.length > 0 ? Math.max(...entries.map(([, v]) => v)) : 1;

  if (entries.length === 0) {
    return <p className="text-muted font-body text-sm">No votes cast</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map(([name, votes]) => {
        const pct = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
        return (
          <div key={name} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-body text-text text-sm">{name}</span>
              <span className="font-body text-muted text-sm">{votes} vote{votes !== 1 ? 's' : ''}</span>
            </div>
            <div className="w-full bg-surface rounded-full h-3 border border-border">
              <div
                className="h-3 rounded-full bg-accent transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
