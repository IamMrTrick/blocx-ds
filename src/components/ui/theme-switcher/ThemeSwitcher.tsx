'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/contexts/ThemeContext';
import './ThemeSwitcher.scss';

export interface ThemeSwitcherProps {
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
  onThemeChange,
  size = 'md',
  showLabels = true,
  className = '',
  compact = false,
  animationStyle = 'smooth',
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const switcherRef = useRef<HTMLButtonElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    toggleTheme();
    onThemeChange?.(newTheme);
    
    // Reset animation states
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      setIsPressed(false);
    }, 300);
  }, [theme, isAnimating, toggleTheme, onThemeChange]);

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
      aria-checked={theme === 'dark'}
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
      <span id="theme-switcher-description" className="visually-hidden">
        Toggle between light and dark theme. Current theme is {theme}.
      </span>
    </button>
  );
};

export default ThemeSwitcher;
