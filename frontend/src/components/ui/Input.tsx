import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const inputVariants = cva(
  'flex w-full rounded-xl border px-4 py-3 text-base placeholder:text-neutral-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 bg-white focus:border-primary-500 focus:ring-primary-500',
        filled: 'border-neutral-200 bg-neutral-50 focus:border-primary-500 focus:ring-primary-500 focus:bg-white',
        outlined: 'border-neutral-400 bg-transparent focus:border-primary-500 focus:ring-primary-500',
        error: 'border-error bg-white focus:border-error focus:ring-error',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, error, helperText, startIcon, endIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {startIcon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              inputVariants({ variant: error ? 'error' : variant, size, className }),
              startIcon && 'pl-10',
              endIcon && 'pr-10'
            )}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {endIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn('mt-2 text-sm', error ? 'text-error' : 'text-neutral-600')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };