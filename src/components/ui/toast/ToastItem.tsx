'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ToastData, ToastPosition } from './types';
import { Button } from '../button';

interface ToastItemProps {
  toast: ToastData;
  index: number;
  removeToast: (id: string) => void;
  isVisible: boolean;
  position: ToastPosition;
  heights: { [key: string]: number };
  setHeight: (id: string, height: number) => void;
  expanded: boolean;
  calculatedOffset: number; // Pre-calculated offset based on actual heights
}

export function ToastItem({ 
  toast, 
  index, 
  removeToast, 
  setHeight,
  expanded,
  calculatedOffset
}: ToastItemProps) {
  const [mounted, setMounted] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDirection, setDragDirection] = useState(0); // Track final drag direction
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  // const [forceUpdate, setForceUpdate] = useState(0); // For forcing re-renders when needed
  // const [stackingComplete, setStackingComplete] = useState(false); // For smooth stacking animation

  const toastRef = useRef<HTMLLIElement>(null);
  // const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<number>(100);
  const startTimeRef = useRef<number>(Date.now());

  // Memoize constants to prevent recalculation
  const dismissible = useMemo(() => toast.dismissible !== false, [toast.dismissible]);
  const toastType = useMemo(() => toast.type || 'default', [toast.type]);
  
  // Use the pre-calculated offset - CSS handles direction via column-reverse
  // const offset = calculatedOffset;

  // Simple Sonner-style mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple stacking completion
  // useEffect(() => {
  //   if (!mounted) return;

  //   const timer = setTimeout(() => {
  //     setStackingComplete(true);
  //   }, 10); // Immediate stacking like Sonner

  //   return () => clearTimeout(timer);
  // }, [mounted]);

  // Initialize progress and start time
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      setProgress(100);
      progressRef.current = 100;
      startTimeRef.current = Date.now();
    }
  }, [toast.duration]);

  const handleRemove = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDragDirection(0); // Reset direction for normal removal
    setRemoving(true);
    // Remove with smooth animation
    setTimeout(() => {
      removeToast(toast.id);
    }, 100);
  }, [removeToast, toast.id]);

  // Enhanced close button handler with smooth animation
  const handleCloseClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use handleRemove for smooth animation
    handleRemove();
  }, [handleRemove]);

  // Optimized progress animation with memory efficiency
  useEffect(() => {
    if (!toast.duration || toast.duration <= 0 || isPaused || removing || isDragging) return;

    let animationId: number;
    let isActive = true; // Flag to prevent memory leaks

    const animate = () => {
      if (!isActive) return; // Early exit if component unmounted

      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, toast.duration! - elapsed);
      const newProgress = (remaining / toast.duration!) * 100;
      
      progressRef.current = newProgress;
      
      // Only update state if significant change to reduce re-renders
      if (Math.abs(newProgress - progress) > 0.5 || remaining <= 0) {
        setProgress(newProgress);
      }

      if (remaining > 0 && !isPaused && !removing && !isDragging && isActive) {
        animationId = requestAnimationFrame(animate);
      } else if (remaining <= 0 && isActive) {
        handleRemove();
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      isActive = false; // Prevent further execution
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [toast.duration, isPaused, removing, isDragging, handleRemove, progress]);

  // Pause/resume on hover
  const handleMouseEnter = useCallback(() => {
    if (toast.duration && toast.duration > 0) {
      setIsPaused(true);
    }
  }, [toast.duration]);

  const handleMouseLeave = useCallback(() => {
    if (toast.duration && toast.duration > 0) {
      setIsPaused(false);
      startTimeRef.current = Date.now() - (toast.duration * (1 - progressRef.current / 100));
    }
  }, [toast.duration]);

  // Optimized height calculation with ResizeObserver
  useEffect(() => {
    const element = toastRef.current;
    if (!element) return;

    // Use ResizeObserver for better performance than getBoundingClientRect
    let resizeObserver: ResizeObserver | null = null;
    
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setHeight(toast.id, entry.contentRect.height);
        }
      });
      resizeObserver.observe(element);
    } else {
      // Fallback for browsers without ResizeObserver
      const height = element.getBoundingClientRect().height;
      setHeight(toast.id, height);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [setHeight, toast.id]);

  // Drag handlers - Support both pointer and touch events
  const handleDragStart = useCallback((clientX: number, pointerId?: number) => {
    if (!dismissible) return;
    
    setIsDragging(true);
    setDragStartX(clientX);
    setIsPaused(true); // Pause progress during drag
    
    if (toastRef.current && pointerId !== undefined) {
      toastRef.current.setPointerCapture(pointerId);
    }
  }, [dismissible]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - dragStartX;
    setDragX(deltaX);
    
    // Auto-dismiss if dragged far enough
    if (Math.abs(deltaX) > 100) {
      setDragDirection(deltaX); // Store final direction
      setRemoving(true);
      setIsDragging(false);
      
      // Remove quickly so other toasts move up smoothly
      setTimeout(() => removeToast(toast.id), 150);
    }
  }, [isDragging, dragStartX, removeToast, toast.id]);

  const handleDragEnd = useCallback((pointerId?: number) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setIsPaused(false); // Resume progress after drag
    
    if (Math.abs(dragX) < 100) {
      setDragX(0); // Snap back
      // Resume timer from where it left off
      if (toast.duration && toast.duration > 0) {
        startTimeRef.current = Date.now() - (toast.duration * (1 - progressRef.current / 100));
      }
    }
    
    if (toastRef.current && pointerId !== undefined) {
      toastRef.current.releasePointerCapture(pointerId);
    }
  }, [isDragging, dragX, toast.duration]);

  // Pointer Events - exclude close button
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Don't start drag if clicking on close button
    if ((e.target as HTMLElement).closest('.toast__close-container')) {
      console.log('🚫 Ignoring pointer down on close button area');
      return;
    }
    
    e.preventDefault();
    handleDragStart(e.clientX, e.pointerId);
  }, [handleDragStart]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    handleDragMove(e.clientX);
  }, [handleDragMove]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    handleDragEnd(e.pointerId);
  }, [handleDragEnd]);

  // Touch Events for mobile - exclude close button
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Don't start drag if touching close button
    if ((e.target as HTMLElement).closest('.toast__close-container')) {
      console.log('🚫 Ignoring touch start on close button area');
      return;
    }
    
    const touch = e.touches[0];
    if (touch) {
      handleDragStart(touch.clientX);
    }
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleDragMove(touch.clientX);
    }
  }, [handleDragMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleDragEnd();
  }, [handleDragEnd]);

  // Memoize toast icon to prevent recreating SVG on every render
  const getToastIcon = useMemo(() => {
    const ToastIcon = (type: ToastData['type']) => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.25 5.625L7.5 14.375L3.75 10.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 6.25V10.625M10 14.375H10.0083M18.125 10C18.125 14.4873 14.4873 18.125 10 18.125C5.51269 18.125 1.875 14.4873 1.875 10C1.875 5.51269 5.51269 1.875 10 1.875C14.4873 1.875 18.125 5.51269 18.125 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'info':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 9.375V14.375M10 6.25H10.0083M18.125 10C18.125 14.4873 14.4873 18.125 10 18.125C5.51269 18.125 1.875 14.4873 1.875 10C1.875 5.51269 5.51269 1.875 10 1.875C14.4873 1.875 18.125 5.51269 18.125 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'loading':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="toast__spinner">
            <path d="M10 1.875C14.4873 1.875 18.125 5.51269 18.125 10C18.125 14.4873 14.4873 18.125 10 18.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
    };
    ToastIcon.displayName = 'ToastIcon';
    return ToastIcon;
  }, []); // Empty dependency array since icons are static

  // Calculate transform and opacity based on drag and stacking
  const transform = useMemo(() => {
    let translateX = dragX;
    let translateY = calculatedOffset;
    let scale = 1;
    let opacity = 1;

    // Handle bottom positions with reversed coordinate system
    // const isBottomPosition = position.includes('bottom');

    // Drag effects
    if (isDragging && dragX !== 0) {
      const absX = Math.abs(dragX);
      scale = Math.max(0.95, 1 - absX * 0.0005);
      opacity = Math.max(0.3, 1 - absX * 0.006);
    }

    // Compact stacking effects for tight card layout
    if (index > 0 && !expanded) {
      // Perfect step scaling - smooth and visible progression
      scale = Math.max(0.9, 1 - index * 0.04); // Gentle scale reduction 
      opacity = Math.max(0.6, 1 - index * 0.15); // Gradual opacity reduction
      
      // Ensure third toast stays visible but clearly stacked
      if (index === 2) {
        scale = 0.92; // Slightly more visible
        opacity = 0.7; // More visible opacity
      }
    }

    // Removing animation
    if (removing) {
      if (dragDirection !== 0) {
        // Exit in the direction of drag with momentum
        const direction = dragDirection > 0 ? 1 : -1;
        translateX = direction * 500; // Slide out in drag direction
        translateY = Math.abs(dragDirection) * 0.2; // Add slight vertical movement for natural feel
      } else {
        // Normal removal (timeout or click) - slide up and fade
        translateY = -100;
      }
      opacity = 0;
      scale = 0.8;
    }

    const finalZIndex = 1000 - index; // Proper z-index - index 0 (newest) gets highest z-index
    

    
    return {
      transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
      opacity,
      zIndex: finalZIndex,
      // Use individual transition properties instead of shorthand to avoid conflicts
      transitionProperty: removing ? 'all' : 'transform, opacity, box-shadow',
      transitionDuration: removing 
        ? (dragDirection !== 0 ? '0.25s' : '0.2s')
        : isDragging 
          ? '0s' 
          : '0.2s',
      transitionTimingFunction: removing
        ? (dragDirection !== 0 ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'cubic-bezier(0.4, 0.0, 1, 1)')
        : isDragging
          ? 'ease'
          : 'cubic-bezier(0.32, 0.72, 0, 1)', // Sonner's signature easing
      transitionDelay: '0ms' // Always immediate for Sonner-style smoothness
    };
  }, [dragX, calculatedOffset, isDragging, index, expanded, removing, dragDirection]);

  // Simplified toast classes with action detection
  const toastClasses = useMemo(() => {
    const hasActions = !!(toast.action || toast.actions?.primary || toast.actions?.secondary);
    
    return [
      'toast',
      `toast--${toastType}`,
      mounted && 'toast--mounted',
      removing && 'toast--removing',
      isDragging && 'toast--dragging',
      index > 0 && 'toast--stacked',
      hasActions && 'toast--has-actions' // Add class for CSS targeting
    ].filter(Boolean).join(' ');
  }, [toastType, mounted, removing, isDragging, index, toast.action, toast.actions]);

  return (
    <li
      ref={toastRef}
      className={toastClasses}
      style={transform}
      onPointerDown={dismissible ? handlePointerDown : undefined}
      onPointerMove={dismissible ? handlePointerMove : undefined}
      onPointerUp={dismissible ? handlePointerUp : undefined}
      onTouchStart={dismissible ? handleTouchStart : undefined}
      onTouchMove={dismissible ? handleTouchMove : undefined}
      onTouchEnd={dismissible ? handleTouchEnd : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-toast-id={toast.id}
      data-index={index}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="toast__content">
        {getToastIcon(toastType) && (
          <div className="toast__icon">
            {getToastIcon(toastType)}
          </div>
        )}

        <div className="toast__text">
          {toast.title && (
            <div className="toast__title">{toast.title}</div>
          )}
          {toast.description && (
            <div className="toast__description">{toast.description}</div>
          )}
          {/* Enhanced Actions with Button Components */}
          {(toast.action || toast.actions) && (
            <div className="toast__actions">
              {/* Legacy single action support */}
              {toast.action && (
                <Button
                  variant={toast.action.variant || 'ghost'}
                  size={toast.action.size || 's'}
                  onClick={toast.action.onClick}
                  className="toast__action-button"
                >
                  {toast.action.label}
                </Button>
              )}
              
              {/* New multiple actions support */}
              {toast.actions?.primary && (
                <Button
                  variant={toast.actions.primary.variant || 'primary'}
                  size={toast.actions.primary.size || 's'}
                  onClick={toast.actions.primary.onClick}
                  className="toast__action-button toast__action-button--primary"
                >
                  {toast.actions.primary.label}
                </Button>
              )}
              
              {toast.actions?.secondary && (
                <Button
                  variant={toast.actions.secondary.variant || 'ghost'}
                  size={toast.actions.secondary.size || 's'}
                  onClick={toast.actions.secondary.onClick}
                  className="toast__action-button toast__action-button--secondary"
                >
                  {toast.actions.secondary.label}
                </Button>
              )}
            </div>
          )}
        </div>

        {dismissible && (
          <div className="toast__close-container">
            {/* Progress Ring Background (separate from button) */}
            {(toast.duration && toast.duration > 0 && progress >= 10 && progress < 100 && !removing && !isDragging) ? (
              <svg 
                className="toast__progress-ring" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24"
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  pointerEvents: 'none'
                }}
              >
                <circle
                  className="toast__progress-ring-bg"
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  strokeWidth="2"
                />
                <circle
                  className="toast__progress-ring-progress"
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={62.83}
                  strokeDashoffset={62.83 * (100 - progress) / 100}
                  transform="rotate(-90 12 12)"
                  style={{
                    transition: 'none'
                  }}
                />
              </svg>
            ) : null}
            
            {/* Clean Close Button */}
            <button
              className="toast__close"
              onClick={handleCloseClick}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCloseClick(e);
              }}
              type="button"
              aria-label="Close notification"

            >
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none"
              >
                <path 
                  d="M9 3L3 9M3 3L9 9" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

ToastItem.displayName = 'ToastItem';