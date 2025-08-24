import React from 'react';
import './Aside.scss';

export interface AsideProps {
  children: React.ReactNode;
  className?: string;
  position?: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg' | 'xl';
  sticky?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

export const Aside: React.FC<AsideProps> = ({
  children,
  className = '',
  position = 'left',
  width = 'md',
  sticky = false,
  collapsible = false,
  collapsed = false,
  onToggle,
}) => {
  const asideClasses = [
    'aside',
    `aside--${position}`,
    `aside--${width}`,
    sticky && 'aside--sticky',
    collapsible && 'aside--collapsible',
    collapsed && 'aside--collapsed',
    className
  ].filter(Boolean).join(' ');

  return (
    <aside className={asideClasses}>
      {collapsible && (
        <button 
          className="aside__toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          <span className="aside__toggle-icon"></span>
        </button>
      )}
      <div className="aside__content">
        {children}
      </div>
    </aside>
  );
};

export default Aside;
