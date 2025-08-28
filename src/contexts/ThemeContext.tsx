'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'dark',
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  // Apply theme to document
  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      // Add transition class for smooth color changes
      root.classList.add('theme-transitioning');
      
      if (newTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
      
      // Set the theme key
      localStorage.setItem('theme', newTheme);
      
      // Remove transition class after animation completes
      setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 300);
    }
  }, []);

  // Set theme with localStorage sync
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      const initializeTheme = () => {
        try {
          // Check for saved theme first
          const savedTheme = localStorage.getItem('theme') as Theme;
          
          // If no saved theme, check system preference
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          
          const initialTheme = savedTheme || systemTheme;
          
          setThemeState(initialTheme);
          applyTheme(initialTheme);
          setIsInitialized(true);
        } catch (error) {
          console.warn('Failed to initialize theme:', error);
          setThemeState(defaultTheme);
          applyTheme(defaultTheme);
          setIsInitialized(true);
        }
      };
      
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(initializeTheme);
    }
  }, [isInitialized, defaultTheme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Only update if no theme is saved in localStorage
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
          const systemTheme = e.matches ? 'dark' : 'light';
          setTheme(systemTheme);
        }
      };
      
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, [isInitialized, setTheme]);

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
