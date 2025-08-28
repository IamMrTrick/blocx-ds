'use client';

import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import './SlidingCard.scss';

export interface SlidingCardProps {
  defaultTheme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SlidingCard: React.FC<SlidingCardProps> = ({
  onThemeChange,
  size = 'md',
  className = '',
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle theme toggle
  const handleToggle = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }
    
    toggleTheme();
    onThemeChange?.(newTheme);
    
    setTimeout(() => setIsAnimating(false), 500);
  }, [theme, isAnimating, toggleTheme, onThemeChange]);

  return (
    <button
      type="button"
      className={`sliding-card sliding-card--${size} ${isAnimating ? 'sliding-card--animating' : ''} ${className}`}
      onClick={handleToggle}
      disabled={isAnimating}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      aria-checked={theme === 'dark'}
      role="switch"
      data-theme={theme}
    >
      <div className="sliding-card__container">
        {/* Light Side */}
        <div className={`sliding-card__side sliding-card__side--light ${theme === 'light' ? 'sliding-card__side--active' : ''}`}>
          <div className="sliding-card__content">
            <svg className="sliding-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <span className="sliding-card__label">Light</span>
          </div>
          <div className="sliding-card__bg-elements">
            <div className="sliding-card__ray sliding-card__ray--1"></div>
            <div className="sliding-card__ray sliding-card__ray--2"></div>
            <div className="sliding-card__ray sliding-card__ray--3"></div>
            <div className="sliding-card__ray sliding-card__ray--4"></div>
          </div>
        </div>
        
        {/* Dark Side */}
        <div className={`sliding-card__side sliding-card__side--dark ${theme === 'dark' ? 'sliding-card__side--active' : ''}`}>
          <div className="sliding-card__content">
            <svg className="sliding-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span className="sliding-card__label">Dark</span>
          </div>
          <div className="sliding-card__bg-elements">
            <div className="sliding-card__star sliding-card__star--1"></div>
            <div className="sliding-card__star sliding-card__star--2"></div>
            <div className="sliding-card__star sliding-card__star--3"></div>
            <div className="sliding-card__star sliding-card__star--4"></div>
            <div className="sliding-card__star sliding-card__star--5"></div>
          </div>
        </div>
        
        {/* Sliding indicator */}
        <div className={`sliding-card__indicator ${theme === 'dark' ? 'sliding-card__indicator--dark' : ''}`}></div>
      </div>
      
      <span className="visually-hidden">
        Toggle between light and dark theme. Current theme is {theme}.
      </span>
    </button>
  );
};

export default SlidingCard;
