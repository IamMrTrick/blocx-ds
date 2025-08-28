'use client';

import React, { useState, useEffect, useCallback } from 'react';
import './MorphingToggle.scss';

export interface MorphingToggleProps {
  defaultTheme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MorphingToggle: React.FC<MorphingToggleProps> = ({
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
      }, 600);
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
      navigator.vibrate(30);
    }
    
    setTheme(newTheme);
    applyTheme(newTheme);
    onThemeChange?.(newTheme);
    
    setTimeout(() => setIsAnimating(false), 600);
  }, [theme, isAnimating, applyTheme, onThemeChange]);

  return (
    <button
      type="button"
      className={`morphing-toggle morphing-toggle--${size} ${isAnimating ? 'morphing-toggle--animating' : ''} ${className}`}
      onClick={handleToggle}
      disabled={isAnimating}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      aria-pressed={theme === 'dark'}
      role="switch"
      data-theme={theme}
    >
      <div className="morphing-toggle__track">
        <div className={`morphing-toggle__thumb ${theme === 'dark' ? 'morphing-toggle__thumb--dark' : ''}`}>
          {/* Sun Icon */}
          <svg 
            className={`morphing-toggle__icon morphing-toggle__icon--sun ${theme === 'light' ? 'morphing-toggle__icon--active' : ''}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          
          {/* Moon Icon */}
          <svg 
            className={`morphing-toggle__icon morphing-toggle__icon--moon ${theme === 'dark' ? 'morphing-toggle__icon--active' : ''}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </div>
        
        {/* Background morphing elements */}
        <div className="morphing-toggle__bg">
          <div className="morphing-toggle__stars">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="morphing-toggle__clouds">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      
      <span className="sr-only">
        Toggle between light and dark theme. Current theme is {theme}.
      </span>
    </button>
  );
};

export default MorphingToggle;
