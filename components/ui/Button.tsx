interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'danger';
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-accent hover:bg-red-600 text-white',
    secondary: 'bg-card border border-border hover:border-accent text-text',
    gold: 'bg-gold hover:bg-yellow-400 text-black font-bold',
    danger: 'bg-red-900 hover:bg-red-800 border border-red-700 text-red-300',
  };
  return (
    <button
      className={`px-6 py-3 rounded-[14px] font-body font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
