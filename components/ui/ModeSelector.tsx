interface ModeSelectorProps {
  value: 'classic' | 'super';
  onChange: (v: 'classic' | 'super') => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onChange('classic')}
        className={`flex-1 p-4 rounded-[14px] border-2 transition-all text-left ${
          value === 'classic' ? 'border-accent bg-red-950' : 'border-border bg-card'
        }`}
      >
        <div className="text-2xl mb-1">🕵️</div>
        <div className="font-heading text-lg text-text">CLASSIC</div>
        <div className="text-xs text-muted font-body">One player has no word</div>
      </button>
      <button
        onClick={() => onChange('super')}
        className={`flex-1 p-4 rounded-[14px] border-2 transition-all text-left ${
          value === 'super' ? 'border-purple bg-purple-950' : 'border-border bg-card'
        }`}
      >
        <div className="text-2xl mb-1">🦹</div>
        <div className="font-heading text-lg text-text">SUPER</div>
        <div className="text-xs text-muted font-body">Nobody knows</div>
      </button>
    </div>
  );
}
