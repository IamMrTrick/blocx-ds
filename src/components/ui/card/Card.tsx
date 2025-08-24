'use client';
import React, { forwardRef } from 'react';
import './Card.scss';

export type CardPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'article' | 'section' | 'div' | 'li';
  padding?: CardPadding;
  shadow?: CardShadow;
  bordered?: boolean;
  hoverable?: boolean;
  clickable?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

const createBemClass = (
  block: string,
  element?: string,
  modifiers?: (string | boolean | undefined)[]
): string => {
  let className = block;

  if (element) {
    className += `__${element}`;
  }

  if (modifiers && modifiers.length > 0) {
    const validModifiers = modifiers
      .filter(Boolean)
      .map(mod => (typeof mod === 'string' ? mod : ''))
      .filter(Boolean);

    if (validModifiers.length > 0) {
      const baseClass = element ? `${block}__${element}` : block;
      className += ` ${validModifiers.map(mod => `${baseClass}--${mod}`).join(' ')}`;
    }
  }

  return className;
};

const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    as: Component = 'article',
    padding = 'md',
    shadow = 'none',
    bordered = true,
    hoverable = false,
    clickable = false,
    fullWidth = false,
    className = '',
    children,
    ...props
  },
  ref
) {
  const cardClasses = [
    createBemClass('card', undefined, [
      padding !== 'none' && `padding-${padding}`,
      shadow !== 'none' && `shadow-${shadow}`,
      bordered && 'bordered',
      hoverable && 'hoverable',
      clickable && 'clickable',
      fullWidth && 'full-width',
    ]),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Accessibility for clickable, non-interactive elements
  const accessibilityProps: Partial<React.HTMLAttributes<HTMLElement>> = {};
  if (clickable && Component !== 'a' && Component !== 'button') {
    accessibilityProps.role = 'button';
    accessibilityProps.tabIndex = 0 as any;
  }

  return (
    <Component ref={ref as any} className={cardClasses} {...accessibilityProps} {...props}>
      <div className="card__content">{children}</div>
    </Component>
  );
});

Card.displayName = 'Card';

export { Card };
export default Card;


