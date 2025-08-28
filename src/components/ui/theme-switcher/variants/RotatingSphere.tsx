'use client';

import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import './RotatingSphere.scss';

export interface RotatingSphereProps {
  defaultTheme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RotatingSphere: React.FC<RotatingSphereProps> = ({
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
      navigator.vibrate([50, 30, 50]);
    }
    
    toggleTheme();
    onThemeChange?.(newTheme);
    
    setTimeout(() => setIsAnimating(false), 800);
  }, [theme, isAnimating, toggleTheme, onThemeChange]);

  return (
    <button
      type="button"
      className={`rotating-sphere rotating-sphere--${size} ${isAnimating ? 'rotating-sphere--animating' : ''} ${className}`}
      onClick={handleToggle}
      disabled={isAnimating}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      aria-checked={theme === 'dark'}
      role="switch"
      data-theme={theme}
    >
      <div className="rotating-sphere__container">
        <div className="rotating-sphere__orbit">
          {/* Sun */}
          <div className={`rotating-sphere__celestial rotating-sphere__sun ${theme === 'light' ? 'rotating-sphere__celestial--active' : ''}`}>
            <div className="rotating-sphere__sun-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            </div>
            <div className="rotating-sphere__sun-rays">
              <div className="rotating-sphere__ray rotating-sphere__ray--1"></div>
              <div className="rotating-sphere__ray rotating-sphere__ray--2"></div>
              <div className="rotating-sphere__ray rotating-sphere__ray--3"></div>
              <div className="rotating-sphere__ray rotating-sphere__ray--4"></div>
              <div className="rotating-sphere__ray rotating-sphere__ray--5"></div>
              <div className="rotating-sphere__ray rotating-sphere__ray--6"></div>
              <div className="rotating-sphere__ray rotating-sphere__ray--7"></div>
              <div className="rotating-sphere__ray rotating-sphere__ray--8"></div>
            </div>
          </div>
          
          {/* Moon */}
          <div className={`rotating-sphere__celestial rotating-sphere__moon ${theme === 'dark' ? 'rotating-sphere__celestial--active' : ''}`}>
            <div className="rotating-sphere__moon-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </div>
            <div className="rotating-sphere__moon-craters">
              <div className="rotating-sphere__crater rotating-sphere__crater--1"></div>
              <div className="rotating-sphere__crater rotating-sphere__crater--2"></div>
              <div className="rotating-sphere__crater rotating-sphere__crater--3"></div>
            </div>
          </div>
          
          {/* Stars background */}
          <div className="rotating-sphere__stars">
            <div className="rotating-sphere__star rotating-sphere__star--1"></div>
            <div className="rotating-sphere__star rotating-sphere__star--2"></div>
            <div className="rotating-sphere__star rotating-sphere__star--3"></div>
            <div className="rotating-sphere__star rotating-sphere__star--4"></div>
            <div className="rotating-sphere__star rotating-sphere__star--5"></div>
            <div className="rotating-sphere__star rotating-sphere__star--6"></div>
          </div>
        </div>
        
        {/* Atmosphere effect */}
        <div className="rotating-sphere__atmosphere"></div>
        
        {/* Rotation indicator */}
        <div className="rotating-sphere__indicator">
          <div className="rotating-sphere__indicator-dot"></div>
        </div>
      </div>
      
      <span className="visually-hidden">
        Toggle between light and dark theme. Current theme is {theme}.
      </span>
    </button>
  );
};

export default RotatingSphere;
