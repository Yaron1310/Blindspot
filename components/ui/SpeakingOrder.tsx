interface SpeakingOrderProps {
  turnOrder: Record<string, number>;
  myName: string;
  myTurn: number;
}

export function SpeakingOrder({ turnOrder, myName, myTurn }: SpeakingOrderProps) {
  const sorted = Object.entries(turnOrder).sort((a, b) => a[1] - b[1]);

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-heading text-xl text-text tracking-wide">SPEAKING ORDER</h3>
        {myTurn > 0 && (
          <p className="text-sm text-muted font-body mt-1">You speak turn {myTurn}</p>
        )}
      </div>
      <div className="space-y-2">
        {sorted.map(([name, turn]) => {
          const isMe = name === myName;
          return (
            <div
              key={name}
              className={`flex items-center gap-3 rounded-[14px] px-4 py-2 ${
                isMe ? 'bg-yellow-950 border border-gold' : 'bg-surface border border-border'
              }`}
            >
              <span
                className={`font-heading text-lg w-6 text-center ${
                  isMe ? 'text-gold' : 'text-muted'
                }`}
              >
                {turn}
              </span>
              <span
                className={`font-body ${isMe ? 'text-gold font-bold' : 'text-text'}`}
              >
                {name}
                {isMe && ' (you)'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
