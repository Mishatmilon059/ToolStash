import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', size = 'md', children, ...props }) {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-dark disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-neon-cyan text-bg-dark hover:bg-cyan-400 hover:shadow-glow-cyan',
        secondary: 'bg-bg-card border border-white/10 text-text-primary hover:bg-bg-hover hover:border-neon-purple',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/5',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
}
