'use client';
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import './SimpleThemeSwitcher.scss';

export interface SimpleThemeSwitcherProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const SimpleThemeSwitcher: React.FC<SimpleThemeSwitcherProps> = ({
  className = '',
  size = 'md',
  showLabels = false,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`simple-theme-switcher simple-theme-switcher--${size} ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      aria-checked={theme === 'dark'}
      role="switch"
      data-theme={theme}
    >
      {/* Track */}
      <div className="simple-theme-switcher__track">
        {/* Thumb */}
        <div className={`simple-theme-switcher__thumb ${theme === 'dark' ? 'simple-theme-switcher__thumb--dark' : ''}`}>
          {/* Sun Icon */}
          <svg
            className={`simple-theme-switcher__icon simple-theme-switcher__icon--sun ${theme === 'light' ? 'simple-theme-switcher__icon--active' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41" />
          </svg>
          
          {/* Moon Icon */}
          <svg
            className={`simple-theme-switcher__icon simple-theme-switcher__icon--moon ${theme === 'dark' ? 'simple-theme-switcher__icon--active' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>
      </div>
      
      {/* Screen reader text */}
      <span className="visually-hidden">
        Current theme is {theme}. Click to switch to {theme === 'light' ? 'dark' : 'light'} theme.
      </span>
    </button>
  );
};

export default SimpleThemeSwitcher;
