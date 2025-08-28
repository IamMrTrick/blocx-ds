'use client';
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import './ThemeSwitcher.scss';

export interface ThemeSwitcherProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'toggle' | 'pill';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  size = 'md',
  variant = 'button',
  onThemeChange,
}) => {
  const { theme, toggleTheme } = useTheme();

  const handleClick = () => {
    toggleTheme();
    onThemeChange?.(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      type="button"
      className={`theme-switcher theme-switcher--${variant} theme-switcher--${size} ${className}`}
      onClick={handleClick}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      data-theme={theme}
    >
      {variant === 'pill' ? (
        <div className="theme-switcher__track">
          <div className={`theme-switcher__thumb ${theme === 'dark' ? 'theme-switcher__thumb--dark' : ''}`}>
            <svg 
              className={`theme-switcher__icon ${theme === 'light' ? 'theme-switcher__icon--active' : ''}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41"/>
            </svg>
            <svg 
              className={`theme-switcher__icon ${theme === 'dark' ? 'theme-switcher__icon--active' : ''}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </div>
        </div>
      ) : variant === 'toggle' ? (
        <div className="theme-switcher__track">
          <div className={`theme-switcher__thumb ${theme === 'dark' ? 'theme-switcher__thumb--dark' : ''}`}></div>
        </div>
      ) : (
        <>
          <svg 
            className={`theme-switcher__icon ${theme === 'light' ? 'theme-switcher__icon--active' : ''}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41"/>
          </svg>
          <svg 
            className={`theme-switcher__icon ${theme === 'dark' ? 'theme-switcher__icon--active' : ''}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </>
      )}
    </button>
  );
};

export default ThemeSwitcher;
