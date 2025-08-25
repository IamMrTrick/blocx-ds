'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ToastData, ToastPosition } from './types';

interface ToastItemProps {
  toast: ToastData;
  index: number;
  removeToast: (id: string) => void;
  isVisible: boolean;
  position: ToastPosition;
}

export function ToastItem({ toast, index, removeToast, isVisible, position }: ToastItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(100);
  const startTimeRef = useRef<number>(Date.now());
  const animationRef = useRef<number | null>(null);

  const handleRemove = useCallback(() => {
    if (isRemoving) return;
    setIsRemoving(true);
    
    // Add exit animation class immediately
    if (toastRef.current) {
      toastRef.current.classList.add('toast--removing');
    }
    
    // Remove after animation completes - give more time to fully disappear
    setTimeout(() => {
      removeToast(toast.id);
    }, 350);
  }, [isRemoving, removeToast, toast.id]);

  // Progress bar animation
  useEffect(() => {
    if (!toast.duration || toast.duration <= 0 || isPaused || isRemoving) return;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, (toast.duration || 0) - elapsed);
      const newProgress = (remaining / (toast.duration || 1)) * 100;
      
      progressRef.current = newProgress;
      setProgress(newProgress);

      if (remaining > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Smooth exit in the same direction as its container
        setIsRemoving(true);
        if (toastRef.current) {
          toastRef.current.classList.add('toast--removing');
        }
        // delay a bit to render class then remove
        setTimeout(() => removeToast(toast.id), 280);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [toast.duration, isPaused, isRemoving, handleRemove]);

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

  // Drag to dismiss (X-axis only) - Support both pointer and touch
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragExitTarget, setDragExitTarget] = useState<number | null>(null);



  const handleDragStart = useCallback((clientX: number) => {
    if (!toast.dismissible) return;
    // reset any previous exit target if reusing component in edge cases
    setDragExitTarget(null);
    setDragStart(clientX);
    setIsDragging(true);
  }, [toast.dismissible]);

  const handleDragMove = useCallback((clientX: number) => {
    if (dragStart === null || !toast.dismissible) return;
    
    const deltaX = clientX - dragStart;
    setDragOffset(deltaX);
  }, [dragStart, toast.dismissible]);

  const handleDragEnd = useCallback((clientX: number) => {
    if (dragStart === null || !toast.dismissible) return;
    
    const deltaX = clientX - dragStart;
    const absDistance = Math.abs(deltaX);
    
    // Dismiss if dragged more than 100px horizontally
    if (absDistance > 100) {
      // Continue from current drag position and slide out in the same direction
      setIsRemoving(true);
      setIsDragging(false);
      const width = toastRef.current?.offsetWidth ?? 400;
      const target = (deltaX > 0 ? 1 : -1) * (width + 120);
      setDragExitTarget(target);
      // remove after transition completes
      window.setTimeout(() => {
        removeToast(toast.id);
      }, 280);
    } else {
      // Snap back to original position
      setDragOffset(0);
    }
    
    setDragStart(null);
    setIsDragging(false);
  }, [dragStart, toast.dismissible, removeToast, toast.id]);

  // Pointer Events
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
    if (toastRef.current) {
      toastRef.current.setPointerCapture(e.pointerId);
    }
  }, [handleDragStart]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleDragMove(e.clientX);
  }, [isDragging, handleDragMove]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleDragEnd(e.clientX);
    if (toastRef.current) {
      toastRef.current.releasePointerCapture(e.pointerId);
    }
  }, [isDragging, handleDragEnd]);

  // Touch Events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleDragStart(touch.clientX);
    }
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleDragMove(touch.clientX);
    }
  }, [isDragging, handleDragMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.changedTouches[0];
    if (touch) {
      handleDragEnd(touch.clientX);
    }
  }, [isDragging, handleDragEnd]);

  const getToastIcon = (type: ToastData['type']) => {
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

  const toastClasses = [
    'toast',
    `toast--${toast.type}`,
    isRemoving && dragExitTarget === null && 'toast--removing',
    dragExitTarget !== null && 'toast--drag-exit',
    !isVisible && 'toast--hidden',
    index > 0 && 'toast--stacked'
  ].filter(Boolean).join(' ');

  // Calculate opacity based on drag distance
  const dragOpacity = dragOffset !== 0 ? Math.max(0.3, 1 - Math.abs(dragOffset) / 200) : 1;

  const toastStyle: React.CSSProperties = {
    ...(dragOffset !== 0 && {
      transform: `translateX(${dragOffset}px)`,
      opacity: dragOpacity,
      transition: 'none'
    }),
    ...(dragStart !== null && {
      transition: 'none'
    }),
    ...(dragExitTarget !== null && {
      transform: `translateX(${dragExitTarget}px)`,
      opacity: 0,
      transition: 'transform 0.25s cubic-bezier(0.4, 0, 1, 1), opacity 0.25s cubic-bezier(0.4, 0, 1, 1)'
    })
  };

  return (
    <div
      ref={toastRef}
      className={toastClasses}
      style={toastStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-dragging={isDragging}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="toast__progress">
          <div 
            className="toast__progress-bar"
            style={{ 
              width: `${progress}%`,
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="toast__content">
        {/* Icon */}
        {getToastIcon(toast.type) && (
          <div className="toast__icon">
            {getToastIcon(toast.type)}
          </div>
        )}

        {/* Text content */}
        <div className="toast__text">
          {toast.title && (
            <div className="toast__title">{toast.title}</div>
          )}
          {toast.description && (
            <div className="toast__description">{toast.description}</div>
          )}
          {toast.action && (
            <button
              className="toast__action"
              onClick={toast.action.onClick}
              type="button"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        {toast.dismissible && (
          <button
            className="toast__close"
            onClick={handleRemove}
            type="button"
            aria-label="Close notification"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
