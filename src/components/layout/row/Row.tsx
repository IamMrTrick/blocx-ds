import React from 'react';
import './Row.scss';

export interface RowProps {
  children: React.ReactNode;
  className?: string;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  gutter?: boolean;
  noGutters?: boolean;
  fluid?: boolean;
}

export const Row: React.FC<RowProps> = ({
  children,
  className = '',
  justify = 'start',
  align = 'stretch',
  direction = 'row',
  wrap = 'wrap',
  gap = 'none',
  gutter = true,
  noGutters = false,
  fluid = false,
}) => {
  const rowClasses = [
    'row',
    justify !== 'start' && `row--justify-${justify}`,
    align !== 'stretch' && `row--align-${align}`,
    direction !== 'row' && `row--${direction}`,
    wrap !== 'wrap' && `row--${wrap}`,
    gap !== 'none' && `row--gap-${gap}`,
    gutter && !noGutters && 'row--gutter',
    noGutters && 'row--no-gutters',
    fluid && 'row--fluid',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={rowClasses}>
      {children}
    </div>
  );
};

export default Row;
