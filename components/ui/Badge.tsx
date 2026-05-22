interface BadgeProps {
  variant: 'classic' | 'super' | 'ready' | 'waiting' | 'host' | 'you';
  children: React.ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  const styles = {
    classic: 'bg-red-900 text-accent border border-accent',
    super: 'bg-purple-900 text-purple border border-purple',
    ready: 'bg-green-900 text-green border border-green',
    waiting: 'bg-surface text-muted border border-border',
    host: 'bg-yellow-900 text-gold border border-gold',
    you: 'bg-blue-900 text-blue-300 border border-blue-700',
  };
  return (
    <span className={`px-1.5 py-0 rounded text-xs font-body ${styles[variant]}`}>{children}</span>
  );
}
