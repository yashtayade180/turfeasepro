import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-soft hover:shadow-medium',
        secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-soft hover:shadow-medium',
        outline: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-primary-500',
        ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-primary-500',
        accent: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 shadow-soft hover:shadow-medium',
        danger: 'bg-error text-white hover:bg-red-600 focus:ring-error shadow-soft hover:shadow-medium',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'as'>,
    VariantProps<typeof buttonVariants> {
  as?: React.ElementType;
  loading?: boolean;
  icon?: React.ReactNode;
  to?: string;
  href?: string;
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, icon, children, disabled, as: Component = 'button', to, ...props }, ref) => {
    const computedRef = (ref as React.Ref<HTMLElement>) || undefined;
    
    // If it's a Link component, pass the to prop
    const finalProps = Component === 'a' || (typeof Component === 'function' && Component.name?.includes('Link')) 
      ? { ...props, to, href: to }
      : props;
    
    return (
      <Component
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={computedRef}
        disabled={disabled || loading}
        {...finalProps}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !loading && <span className="mr-2">{icon}</span>}
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };