'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '@/components/ui/icon';
import './ThemeSwitcher.scss';

export interface ThemeSwitcherProps {
  /** Initial theme - defaults to 'light' */
  defaultTheme?: 'light' | 'dark';
  /** Callback when theme changes */
  onThemeChange?: (theme: 'light' | 'dark') => void;
  /** Size of the switcher */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show theme labels */
  showLabels?: boolean;
  /** Custom class name */
  className?: string;
  /** Compact mode for header usage */
  compact?: boolean;
  /** Animation style */
  animationStyle?: 'smooth' | 'bounce' | 'slide' | 'flip';
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  defaultTheme = 'light',
  onThemeChange,
  size = 'md',
  showLabels = true,
  className = '',
  compact = false,
  animationStyle = 'smooth',
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const switcherRef = useRef<HTMLButtonElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Apply theme to document and localStorage with smooth transition
  const applyTheme = useCallback((newTheme: 'light' | 'dark') => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      // Add transition class for smooth color changes
      root.classList.add('theme-transitioning');
      
      if (newTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
      
      localStorage.setItem('theme', newTheme);
      
      // Remove transition class after animation completes
      setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 300);
    }
  }, []);

  // Initialize theme from localStorage or system preference with performance optimization
  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      // Use requestAnimationFrame for better performance
      const initializeTheme = () => {
        try {
          const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          const initialTheme = savedTheme || systemTheme;
          
          // Only update if different from current theme
          if (initialTheme !== theme) {
            setTheme(initialTheme);
            applyTheme(initialTheme);
          }
        } catch (error) {
          console.warn('Failed to initialize theme:', error);
          // Fallback to default theme
          setTheme(defaultTheme);
        }
      };
      
      requestAnimationFrame(initializeTheme);
    }
  }, [theme, defaultTheme, applyTheme]);

  // Handle theme toggle with enhanced animations
  const handleThemeToggle = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsPressed(true);
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Trigger theme change with animation
    setTheme(newTheme);
    applyTheme(newTheme);
    onThemeChange?.(newTheme);
    
    // Reset animation states
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      setIsPressed(false);
    }, 300);
  }, [theme, isAnimating, applyTheme, onThemeChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Handle system theme change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
          const newTheme = e.matches ? 'dark' : 'light';
          setTheme(newTheme);
          applyTheme(newTheme);
          onThemeChange?.(newTheme);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [onThemeChange]);

  return (
    <button
      ref={switcherRef}
      type="button"
      className={`theme-switcher theme-switcher--${size} ${compact ? 'theme-switcher--compact' : ''} theme-switcher--${animationStyle} ${isAnimating ? 'theme-switcher--animating' : ''} ${isHovered ? 'theme-switcher--hovered' : ''} ${isPressed ? 'theme-switcher--pressed' : ''} ${className}`}
      onClick={handleThemeToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleThemeToggle();
        }
      }}
      disabled={isAnimating}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      aria-pressed={theme === 'dark'}
      aria-describedby="theme-switcher-description"
      title={`Current theme: ${theme}. Click to switch to ${theme === 'light' ? 'dark' : 'light'}`}
      data-theme={theme}
      role="switch"
    >
      <div className="theme-switcher__container">
        {/* Light Theme Icon */}
        <div className={`theme-switcher__icon theme-switcher__icon--light ${theme === 'light' ? 'theme-switcher__icon--active' : ''}`}>
          <Icon name="sun" size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
        </div>
        
        {/* Dark Theme Icon */}
        <div className={`theme-switcher__icon theme-switcher__icon--dark ${theme === 'dark' ? 'theme-switcher__icon--active' : ''}`}>
          <Icon name="moon" size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
        </div>
        
        {/* Sliding Toggle */}
        <div className={`theme-switcher__toggle ${theme === 'dark' ? 'theme-switcher__toggle--dark' : ''}`} />
      </div>
      
      {/* Labels */}
      {showLabels && (
        <div className="theme-switcher__labels">
          <span className={`theme-switcher__label theme-switcher__label--light ${theme === 'light' ? 'theme-switcher__label--active' : ''}`}>
            Light
          </span>
          <span className={`theme-switcher__label theme-switcher__label--dark ${theme === 'dark' ? 'theme-switcher__label--active' : ''}`}>
            Dark
          </span>
        </div>
      )}
      
      {/* Hidden description for screen readers */}
      <span id="theme-switcher-description" className="sr-only">
        Toggle between light and dark theme. Current theme is {theme}.
      </span>
    </button>
  );
};

export default ThemeSwitcher;
