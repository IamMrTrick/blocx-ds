'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ToastData, ToastOptions, ToastContextType, ToastPosition, ToastState } from './types';
import { ToastContainer } from './ToastContainer';
import { setToastFunctions } from './toast';

const ToastContext = createContext<ToastContextType | null>(null);

// Optimized ID generation - faster than Math.random()
let toastIdCounter = 0;
const generateToastId = (): string => `toast-${++toastIdCounter}-${Date.now().toString(36)}`;

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
        toasts: [...state.toasts, action.toast] // Add to end (bottom) like Sonner
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
  expand?: boolean;
}

export function ToastProvider({ 
  children, 
  position = 'top-right',
  duration = 4000,
  visibleToasts = 3,
  expand = false
}: ToastProviderProps) {
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: [],
    height: 0,
    position
  });
  const [currentPosition, setCurrentPosition] = useState<ToastPosition>(position);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id });
  }, []);

  const addToast = useCallback((options: ToastOptions): string => {
    const id = options.id || generateToastId();
    
    const toast: ToastData = {
      id,
      type: options.type || 'default',
      title: options.title,
      description: options.description,
      action: options.action, // Legacy support
      actions: options.actions, // New multiple actions support
      duration: options.duration ?? duration,
      dismissible: options.dismissible ?? true,
      important: options.important ?? false,
      createdAt: Date.now()
    };

    dispatch({ type: 'ADD_TOAST', toast });


    return id;
  }, [duration]);

  const removeAll = useCallback(() => {
    dispatch({ type: 'REMOVE_ALL' });
  }, []);
  
  // Use ref to avoid re-subscribing to keydown event
  const toastsRef = useRef<ToastData[]>([]);
  toastsRef.current = state.toasts;

  // Optimized escape key handler - single event listener
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && toastsRef.current.length > 0) {
        const latestToast = toastsRef.current[0];
        if (latestToast.dismissible) {
          removeToast(latestToast.id);
        }
      }
    };

    document.addEventListener('keydown', handleEscape, { passive: true });
    return () => document.removeEventListener('keydown', handleEscape);
  }, [removeToast]); // Only re-subscribe when removeToast changes



  // Memoize context value to prevent unnecessary re-renders
  const contextValue: ToastContextType = useMemo(() => ({
    toasts: state.toasts,
    addToast,
    removeToast,
    removeAll,
    position: currentPosition,
    setPosition: setCurrentPosition
  }), [state.toasts, addToast, removeToast, removeAll, currentPosition]);

  // Set global toast functions - restored to useEffect (side effects should not be in useMemo)
  useEffect(() => {
    setToastFunctions(addToast, removeToast, removeAll);
  }, [addToast, removeToast, removeAll]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer 
        toasts={state.toasts}
        position={currentPosition}
        removeToast={removeToast}
        visibleToasts={visibleToasts}
        expand={expand}
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