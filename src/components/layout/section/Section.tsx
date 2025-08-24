import React from 'react';
import './Section.scss';

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article' | 'header' | 'footer' | 'main' | 'aside' | 'nav';
  variant?: 'default' | 'hero' | 'content' | 'cta' | 'footer' | 'feature' | 'testimonial';
  width?: 'full' | 'fluid';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'surface' | 'surface-secondary' | 'primary' | 'secondary';
  centered?: boolean;
  fullHeight?: boolean;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  as: Component = 'section',
  variant = 'default',
  width,
  padding = 'md',
  background = 'transparent',
  centered = false,
  fullHeight = false,
  id,
}) => {
  const sectionClasses = [
    'section',
    `section--${variant}`,
    width && `section--${width}`,
    padding !== 'none' && `section--padding-${padding}`,
    background !== 'transparent' && `section--bg-${background}`,
    centered && 'section--centered',
    fullHeight && 'section--full-height',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={sectionClasses} id={id}>
      <div className="section__container">
        {children}
      </div>
    </Component>
  );
};

export default Section;
