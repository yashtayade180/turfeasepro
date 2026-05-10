import React from 'react';
import { cn } from '../../utils/cn';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  sm?: 1 | 2 | 3 | 4 | 6 | 12;
  lg?: 1 | 2 | 3 | 4 | 6 | 12;
  xl?: 1 | 2 | 3 | 4 | 6 | 12;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 'md', responsive = true, sm, lg, xl, ...props }, ref) => {
    const gapClasses = {
      sm: 'gap-2 sm:gap-3',
      md: 'gap-3 sm:gap-4',
      lg: 'gap-4 sm:gap-6',
      xl: 'gap-6 sm:gap-8',
    };

    let gridClasses = 'grid';
    
    // Build responsive grid classes
    if (sm || lg || xl) {
      // Custom responsive breakpoints
      gridClasses += ` grid-cols-${cols}`;
      if (sm) gridClasses += ` sm:grid-cols-${sm}`;
      if (lg) gridClasses += ` lg:grid-cols-${lg}`;
      if (xl) gridClasses += ` xl:grid-cols-${xl}`;
    } else if (responsive) {
      // Default responsive patterns
      const responsiveMap: { [key: number]: string } = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
        12: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12',
      };
      gridClasses += ` ${responsiveMap[cols]}`;
    } else {
      // Fixed columns
      gridClasses += ` grid-cols-${cols}`;
    }

    return (
      <div
        ref={ref}
        className={cn(gridClasses, gapClasses[gap], className)}
        {...props}
      />
    );
  }
);

Grid.displayName = 'Grid';

export { Grid };