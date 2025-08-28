'use client';

import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import './MinimalistPill.scss';

export interface MinimalistPillProps {
  defaultTheme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabels?: boolean;
}

export const MinimalistPill: React.FC<MinimalistPillProps> = ({
  onThemeChange,
  size = 'md',
  className = '',
  showLabels = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle theme toggle
  const handleToggle = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
    
    toggleTheme();
    onThemeChange?.(newTheme);
    
    setTimeout(() => setIsAnimating(false), 400);
  }, [theme, isAnimating, toggleTheme, onThemeChange]);

  return (
    <button
      type="button"
      className={`minimalist-pill minimalist-pill--${size} ${isAnimating ? 'minimalist-pill--animating' : ''} ${showLabels ? 'minimalist-pill--with-labels' : ''} ${className}`}
      onClick={handleToggle}
      disabled={isAnimating}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      aria-checked={theme === 'dark'}
      role="switch"
      data-theme={theme}
    >
      <div className="minimalist-pill__track">
        <div className={`minimalist-pill__thumb ${theme === 'dark' ? 'minimalist-pill__thumb--dark' : ''}`}>
          <div className="minimalist-pill__icon-container">
            {/* Light Icon */}
            <svg 
              className={`minimalist-pill__icon minimalist-pill__icon--light ${theme === 'light' ? 'minimalist-pill__icon--active' : ''}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41"/>
            </svg>
            
            {/* Dark Icon */}
            <svg 
              className={`minimalist-pill__icon minimalist-pill__icon--dark ${theme === 'dark' ? 'minimalist-pill__icon--active' : ''}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </div>
        </div>
        
        {/* Gradient overlay */}
        <div className="minimalist-pill__gradient"></div>
      </div>
      
      {showLabels && (
        <div className="minimalist-pill__labels">
          <span className={`minimalist-pill__label ${theme === 'light' ? 'minimalist-pill__label--active' : ''}`}>
            Light
          </span>
          <span className={`minimalist-pill__label ${theme === 'dark' ? 'minimalist-pill__label--active' : ''}`}>
            Dark
          </span>
        </div>
      )}
      
      <span className="visually-hidden">
        Toggle between light and dark theme. Current theme is {theme}.
      </span>
    </button>
  );
};

export default MinimalistPill;
