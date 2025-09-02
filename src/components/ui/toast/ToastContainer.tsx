'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ToastData, ToastPosition } from './types';
import { ToastItem } from './ToastItem';

interface ToastContainerProps {
  toasts: ToastData[];
  position: ToastPosition;
  removeToast: (id: string) => void;
  visibleToasts: number;
  expand?: boolean;
}

// Global container cache to avoid repeated DOM operations
let globalToastContainer: HTMLDivElement | null = null;
let containerUsageCount = 0;

// Cleanup global container when no longer needed
const cleanupGlobalContainer = () => {
  if (globalToastContainer && containerUsageCount <= 0) {
    try {
      document.body.removeChild(globalToastContainer);
    } catch {
      // Container may have already been removed
    }
    globalToastContainer = null;
  }
};

export function ToastContainer({ toasts, position, removeToast, visibleToasts, expand = false }: ToastContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [heights, setHeights] = useState<{ [key: string]: number }>({});
  const [expanded, setExpanded] = useState(expand);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);



  const setHeight = useCallback((id: string, height: number) => {
    setHeights(prev => ({ ...prev, [id]: height }));
  }, []);

  // Optimized container creation with global caching and usage tracking
  useEffect(() => {
    containerUsageCount++;
    
    if (!globalToastContainer) {
      globalToastContainer = document.getElementById('toast-container') as HTMLDivElement;
      if (!globalToastContainer) {
        globalToastContainer = document.createElement('div');
        globalToastContainer.id = 'toast-container';
        globalToastContainer.className = 'toast-container';
        // Add data attribute for action-aware spacing
        globalToastContainer.setAttribute('data-has-action-toasts', 'false');
        document.body.appendChild(globalToastContainer);
      }
    }
    containerRef.current = globalToastContainer;

    // Update container data attribute based on current toasts
    const hasActionToasts = toasts.some(toast => 
      toast.action || toast.actions?.primary || toast.actions?.secondary
    );
    if (globalToastContainer) {
      globalToastContainer.setAttribute('data-has-action-toasts', hasActionToasts.toString());
    }

    return () => {
      containerUsageCount--;
      // Schedule cleanup for next tick to allow other components to mount
      setTimeout(cleanupGlobalContainer, 0);
    };
  }, [toasts]);

  // Optimized heights cleanup with memory pressure handling
  const currentToastIds = useMemo(() => new Set(toasts.map(t => t.id)), [toasts]);
  
  useEffect(() => {
    setHeights(prev => {
      const heightKeys = Object.keys(prev);
      const hasRemovedToasts = heightKeys.some(id => !currentToastIds.has(id));
      
      if (!hasRemovedToasts) return prev;
      
      const newHeights: { [key: string]: number } = {};
      heightKeys.forEach(id => {
        if (currentToastIds.has(id)) {
          newHeights[id] = prev[id];
        }
      });
      
      // Memory pressure handling - if too many heights are cached, clear old ones
      const heightCount = Object.keys(newHeights).length;
      if (heightCount > 50) { // Prevent memory accumulation
        console.warn('Toast heights cache is large, clearing older entries');
        const recentIds = Array.from(currentToastIds).slice(0, 20);
        const cleanedHeights: { [key: string]: number } = {};
        recentIds.forEach(id => {
          if (newHeights[id] !== undefined) {
            cleanedHeights[id] = newHeights[id];
          }
        });
        return cleanedHeights;
      }
      
      return newHeights;
    });
  }, [currentToastIds]);

  // CRITICAL: All hooks MUST be called before any early returns to maintain hook order!
  
  // Memoize position classes to prevent string concatenation
  const positionClasses = useMemo(() => 
    `toast-container toast-container--${position}`, [position]
  );

  // Memoize visible toast list - take latest toasts (Sonner style)
  const visibleToastList = useMemo(() => {
    const latestToasts = toasts.slice(-visibleToasts);
    // Always keep newest first for proper stacking (Sonner style)
    return latestToasts.reverse(); 
  }, [toasts, visibleToasts]);

  // Optimized mouse event handlers with proper cleanup and debouncing
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Only expand on hover if device supports hover
    if (window.matchMedia('(hover: hover)').matches) {
      hoverTimeoutRef.current = setTimeout(() => setExpanded(true), 50);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (window.matchMedia('(hover: hover)').matches) {
      hoverTimeoutRef.current = setTimeout(() => setExpanded(expand), 50);
    }
  }, [expand]);

  // Cleanup hover timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Early return AFTER all hooks are called
  if (!containerRef.current) {
    return null;
  }
  
  // Only render if we have toasts
  if (toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div
      className={positionClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Notifications"
    >
      <ol className="toast-list">
        {visibleToastList.map((toast, mapIndex) => {
          // Always use mapIndex directly - newest toast has index 0 (biggest), oldest has highest index (smallest)
          const index = mapIndex;
          
          // Calculate cumulative offset - newer toasts (lower index) push older ones down/back
          let cumulativeOffset = 0;
          const isBottomPosition = position.includes('bottom');
          
          for (let i = 0; i < index; i++) {
            const prevToast = visibleToastList[i];
            const prevHeight = heights[prevToast.id] || 64;
            
            if (expanded) {
              const spacing = prevHeight + 16; // Full height + gap when expanded
              cumulativeOffset += isBottomPosition ? -spacing : spacing; // Negative for bottom (upward)
            } else {
              // Perfect step visibility - show meaningful portion of each toast
              const visiblePortion = Math.max(20, prevHeight * 0.3);
              cumulativeOffset += isBottomPosition ? -visiblePortion : visiblePortion; // Negative for bottom
            }
          }
          

          
          return (
            <ToastItem
              key={toast.id}
              toast={toast}
              index={index}
              removeToast={removeToast}
              isVisible={index < visibleToasts}
              position={position}
              heights={heights}
              setHeight={setHeight}
              expanded={expanded}
              calculatedOffset={cumulativeOffset} // Pass the calculated offset
            />
          );
        })}
      </ol>
    </div>,
    containerRef.current
  );

}