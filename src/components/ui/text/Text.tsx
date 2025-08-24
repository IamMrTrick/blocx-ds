import React from 'react';
import './Text.scss';

export type TextSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
export type TextElement = 'p' | 'span' | 'div' | 'small' | 'strong' | 'em' | 'mark' | 'code';

export interface TextProps {
  children: React.ReactNode;
  size?: TextSize;
  weight?: TextWeight;
  align?: TextAlign;
  transform?: TextTransform;
  as?: TextElement;
  className?: string;
  color?: string;
  italic?: boolean;
  underline?: boolean;
  lineThrough?: boolean;
  ellipsis?: boolean;
  noWrap?: boolean;
  breakWords?: boolean;
  selectable?: boolean;
  id?: string;
  'data-testid'?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  size = 'md',
  weight = 'normal',
  align,
  transform,
  as: Element = 'p',
  className = '',
  color,
  italic = false,
  underline = false,
  lineThrough = false,
  ellipsis = false,
  noWrap = false,
  breakWords = false,
  selectable = true,
  id,
  'data-testid': dataTestId,
  ...props
}) => {
  const baseClass = 'text';
  
  const classes = [
    baseClass,
    `${baseClass}--size-${size}`,
    `${baseClass}--weight-${weight}`,
    align && `text-${align}`,
    transform && `text-${transform}`,
    italic && 'font-italic',
    underline && 'text-underline',
    lineThrough && 'text-line-through',
    ellipsis && 'text-ellipsis',
    noWrap && 'whitespace-nowrap',
    breakWords && 'break-words',
    !selectable && 'select-none',
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

export default Text;
