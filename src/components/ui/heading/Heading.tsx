import React from 'react';
import './Heading.scss';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
export type HeadingAlign = 'left' | 'center' | 'right';
export type HeadingTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';

export interface HeadingProps {
  children: React.ReactNode;
  level?: HeadingLevel;
  size?: HeadingSize;
  weight?: HeadingWeight;
  align?: HeadingAlign;
  transform?: HeadingTransform;
  className?: string;
  color?: string;
  italic?: boolean;
  underline?: boolean;
  ellipsis?: boolean;
  noWrap?: boolean;
  id?: string;
  'data-testid'?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  size,
  weight = 'semibold',
  align,
  transform,
  className = '',
  color,
  italic = false,
  underline = false,
  ellipsis = false,
  noWrap = false,
  id,
  'data-testid': dataTestId,
  ...props
}) => {
  // If size is not provided, use the level as the size
  const headingSize = size || `h${level}` as HeadingSize;
  
  // Create the appropriate heading element
  const Element = `h${level}` as keyof React.JSX.IntrinsicElements;
  
  const baseClass = 'heading';
  
  const classes = [
    baseClass,
    `${baseClass}--size-${headingSize}`,
    `${baseClass}--weight-${weight}`,
    align && `text-${align}`,
    transform && `text-${transform}`,
    italic && 'font-italic',
    underline && 'text-underline',
    ellipsis && 'text-ellipsis',
    noWrap && 'whitespace-nowrap',
    className
  ].filter(Boolean).join(' ');

  const style = color ? { color } : undefined;

  return (
    <Element
      className={classes}
      style={style}
      id={id}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </Element>
  );
};

export default Heading;
