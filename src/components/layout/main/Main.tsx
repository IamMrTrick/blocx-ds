import React from 'react';
import './Main.scss';

export interface MainProps {
  children: React.ReactNode;
  className?: string;
  as?: 'main' | 'div' | 'section';
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'fluid';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  withHeader?: boolean;
  withFooter?: boolean;
  withSidebar?: boolean;
  centered?: boolean;
  id?: string;
}

export const Main: React.FC<MainProps> = ({
  children,
  className = '',
  as: Component = 'main',
  width = 'lg',
  padding = 'md',
  withHeader = false,
  withFooter = false,
  withSidebar = false,
  centered = false,
  id,
}) => {
  const mainClasses = [
    'main',
    `main--${width}`,
    padding !== 'none' && `main--padding-${padding}`,
    withHeader && 'main--with-header',
    withSidebar && 'main--with-sidebar',
    centered && 'main--centered',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={mainClasses} id={id}>
      {children}
    </Component>
  );
};

export default Main;
