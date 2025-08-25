'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ToastData, ToastPosition } from './types';
import { ToastItem } from './ToastItem';

interface ToastContainerProps {
  toasts: ToastData[];
  position: ToastPosition;
  removeToast: (id: string) => void;
  visibleToasts: number;
}

export function ToastContainer({ toasts, position, removeToast, visibleToasts }: ToastContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create container if it doesn't exist
    let container = document.getElementById('toast-container') as HTMLDivElement;
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    containerRef.current = container;
  }, []);

  if (!containerRef.current || toasts.length === 0) {
    return null;
  }

  const getPositionClasses = (pos: ToastPosition): string => {
    const baseClasses = 'toast-container';
    switch (pos) {
      case 'top-left':
        return `${baseClasses} toast-container--top-left`;
      case 'top-center':
        return `${baseClasses} toast-container--top-center`;
      case 'top-right':
        return `${baseClasses} toast-container--top-right`;
      case 'bottom-left':
        return `${baseClasses} toast-container--bottom-left`;
      case 'bottom-center':
        return `${baseClasses} toast-container--bottom-center`;
      case 'bottom-right':
        return `${baseClasses} toast-container--bottom-right`;
      default:
        return `${baseClasses} toast-container--top-right`;
    }
  };

  // Show only visible toasts, hide the rest
  // Keep original order for proper stacking (newest first)
  const visibleToastList = toasts.slice(0, visibleToasts);
  const hiddenCount = Math.max(0, toasts.length - visibleToasts);

  return createPortal(
    <div className={getPositionClasses(position)} aria-live="polite" aria-label="Notifications">
      {/* Hidden toasts counter */}
      {hiddenCount > 0 && (
        <div className="toast-hidden-counter">
          +{hiddenCount} more
        </div>
      )}
      
      {/* Visible toasts */}
      {visibleToastList.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
          removeToast={removeToast}
          isVisible={index < visibleToasts}
          position={position}
        />
      ))}
    </div>,
    containerRef.current
  );
}
