import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={twMerge(
                    'w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-text-primary placeholder-text-muted transition-all duration-200 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
