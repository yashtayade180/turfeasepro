import React from 'react';
import { cn } from '../../utils/cn';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  fluid?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', fluid = false, ...props }, ref) => {
    const sizeClasses = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto px-4 sm:px-6 lg:px-8',
          !fluid && sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = 'Container';

export { Container };