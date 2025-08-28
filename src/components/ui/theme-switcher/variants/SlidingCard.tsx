'use client';

import React, { useState, useEffect, useCallback } from 'react';
import './SlidingCard.scss';

export interface SlidingCardProps {
  defaultTheme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SlidingCard: React.FC<SlidingCardProps> = ({
  defaultTheme = 'light',
  onThemeChange,
  size = 'md',
  className = '',
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme);
  const [isAnimating, setIsAnimating] = useState(false);

  // Apply theme to document and localStorage
  const applyTheme = useCallback((newTheme: 'light' | 'dark') => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      root.classList.add('theme-transitioning');
      
      if (newTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
      
      localStorage.setItem('theme', newTheme);
      
      setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 500);
    }
  }, []);

  // Initialize theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initializeTheme = () => {
        try {
          const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          const initialTheme = savedTheme || systemTheme;
          
          if (initialTheme !== theme) {
            setTheme(initialTheme);
            applyTheme(initialTheme);
          }
        } catch (error) {
          console.warn('Failed to initialize theme:', error);
        }
      };
      
      requestAnimationFrame(initializeTheme);
    }
  }, [theme, applyTheme]);

  // Handle theme toggle
  const handleToggle = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }
    
    setTheme(newTheme);
    applyTheme(newTheme);
    onThemeChange?.(newTheme);
    
    setTimeout(() => setIsAnimating(false), 500);
  }, [theme, isAnimating, applyTheme, onThemeChange]);

  return (
    <button
      type="button"
      className={`sliding-card sliding-card--${size} ${isAnimating ? 'sliding-card--animating' : ''} ${className}`}
      onClick={handleToggle}
      disabled={isAnimating}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      aria-pressed={theme === 'dark'}
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
      
      <span className="sr-only">
        Toggle between light and dark theme. Current theme is {theme}.
      </span>
    </button>
  );
};

export default SlidingCard;
