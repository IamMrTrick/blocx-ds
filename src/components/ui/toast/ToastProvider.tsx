'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { ToastData, ToastOptions, ToastContextType, ToastPosition, ToastState } from './types';
import { ToastContainer } from './ToastContainer';
import { setToastFunctions } from './toast';

const ToastContext = createContext<ToastContextType | null>(null);

type ToastAction = 
  | { type: 'ADD_TOAST'; toast: ToastData }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'REMOVE_ALL' }
  | { type: 'UPDATE_HEIGHT'; height: number };

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, 5) // Max 5 toasts
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.id)
      };
    case 'REMOVE_ALL':
      return {
        ...state,
        toasts: []
      };
    case 'UPDATE_HEIGHT':
      return {
        ...state,
        height: action.height
      };
    default:
      return state;
  }
};

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  duration?: number;
  visibleToasts?: number;
}

export function ToastProvider({ 
  children, 
  position = 'top-right',
  duration = 4000,
  visibleToasts = 5 
}: ToastProviderProps) {
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: [],
    height: 0,
    position
  });

  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    dispatch({ type: 'REMOVE_TOAST', id });
  }, []);

  const addToast = useCallback((options: ToastOptions): string => {
    const id = options.id || Math.random().toString(36).substr(2, 9);
    
    const toast: ToastData = {
      id,
      type: options.type || 'default',
      title: options.title,
      description: options.description,
      action: options.action,
      duration: options.duration ?? duration,
      dismissible: options.dismissible ?? true,
      important: options.important ?? false,
      createdAt: Date.now()
    };

    dispatch({ type: 'ADD_TOAST', toast });

    // Auto remove toast after duration (unless duration is 0 for persistent)
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        removeToast(id);
      }, toast.duration);
      
      timersRef.current.set(id, timer);
    }

    return id;
  }, [duration, removeToast]);

  const removeAll = useCallback(() => {
    // Clear all timers
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();
    dispatch({ type: 'REMOVE_ALL' });
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.toasts.length > 0) {
        const latestToast = state.toasts[0];
        if (latestToast.dismissible) {
          removeToast(latestToast.id);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [state.toasts, removeToast]);

  const contextValue: ToastContextType = {
    toasts: state.toasts,
    addToast,
    removeToast,
    removeAll,
    position
  };

  // Set global toast functions
  useEffect(() => {
    setToastFunctions(addToast, removeToast, removeAll);
  }, [addToast, removeToast, removeAll]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer 
        toasts={state.toasts}
        position={position}
        removeToast={removeToast}
        visibleToasts={visibleToasts}
      />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}