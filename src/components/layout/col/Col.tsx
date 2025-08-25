import React from 'react';
import './Col.scss';

export interface ColProps {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full';
  offset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  order?: number;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full';
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full';
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full';
  xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const Col: React.FC<ColProps> = ({
  children,
  className = '',
  span = 'auto',
  offset = 0,
  order,
  sm,
  md,
  lg,
  xl,
  align,
}) => {
  const colClasses = [
    'col',
    // Handle span prop
    span !== 'auto' && span !== 'full' && typeof span === 'number' && `col--${span}`,
    span === 'full' && 'col--12',
    // Handle responsive props
    sm && sm !== 'auto' && sm !== 'full' && `col--sm-${sm}`,
    sm === 'full' && 'col--sm-12',
    md && md !== 'auto' && md !== 'full' && `col--md-${md}`,
    md === 'full' && 'col--md-12',
    lg && lg !== 'auto' && lg !== 'full' && `col--lg-${lg}`,
    lg === 'full' && 'col--lg-12',
    xl && xl !== 'auto' && xl !== 'full' && `col--xl-${xl}`,
    xl === 'full' && 'col--xl-12',
    // Handle offset and order
    offset > 0 && `col--offset-${offset}`,
    order !== undefined && `col--order-${order}`,
    // Handle alignment
    align && `col--align-${align}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={colClasses}>
      {children}
    </div>
  );
};

export default Col;
