'use client';

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
type DrawerSize = 's' | 'm' | 'l' | 'xl' | 'fullscreen';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  size?: DrawerSize;
  dismissible?: boolean;
  swipeToClose?: boolean;
  backdrop?: boolean;
  trapFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  className?: string;
  backdropClassName?: string;
  panelClassName?: string;
  /**
   * When side is top or bottom, allow expanding the panel height up to maxExpandedHeight
   * using drag (wrong-direction) and wheel/scroll before inner content starts to scroll.
   */
  expandToFull?: boolean;
  /** Max expanded height (e.g. '100vh' or a number in px). Default: '100vh' */
  maxExpandedHeight?: number | string;
  /** If true, wheel/trackpad scroll will expand first (only for top/bottom). Default: true */
  expandWithWheel?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  children: React.ReactNode;
}

const bem = (block: string, modifiers: Array<string | false | undefined>) => {
  const base = block;
  const mods = modifiers.filter(Boolean).map(m => `${base}--${m}`);
  return [base, ...mods].join(' ');
};

type FocusableRef = React.RefObject<HTMLElement> | React.MutableRefObject<HTMLElement>;

function useLockBodyScroll(active: boolean) {
  useLayoutEffect(() => {
    if (!active) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prev; };
  }, [active]);
}

function useFocusTrap(containerRef: FocusableRef, active: boolean, initialFocusRef?: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current as HTMLElement | null;
    if (!container) return;

    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const getFocusable = () => Array.from(container.querySelectorAll<HTMLElement>(selectors))
      .filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1 && !el.hasAttribute('inert'));

    const focusables = getFocusable();
    const toFocus = initialFocusRef?.current || focusables[0] || container;
    toFocus?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const list = getFocusable();
      if (list.length === 0) {
        e.preventDefault();
        container?.focus();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener('keydown', onKeyDown);
    return () => container.removeEventListener('keydown', onKeyDown);
  }, [containerRef, active, initialFocusRef]);
}

// Advanced drag physics with momentum, resistance, and visual feedback
function useAdvancedDrag(
  handleRef: React.RefObject<HTMLElement> | React.MutableRefObject<HTMLElement>,
  side: DrawerSide,
  active: boolean,
  onClose: () => void,
  expandOptions?: {
    enabled: boolean;
    getMinHeightPx: () => number;
    getMaxHeightPx: () => number;
    onUpdateHeight: (heightPx: number) => void;
  }
) {
  const [dragState, setDragState] = useState({
    isDragging: false,
    offset: 0,
    velocity: 0,
    progress: 0,
    resistance: 1,
    wrongDirectionScale: 1
  });

  const dragData = useRef({
    startPoint: 0,
    lastPoint: 0,
    lastTime: 0,
    velocityHistory: [] as number[]
  });
  const shrinkAppliedPxRef = useRef(0);
  const translateAppliedPxRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const el = handleRef.current;
    if (!el) return;

    const CLOSE_THRESHOLD = 0.4; // 40% drag to close
    const VELOCITY_THRESHOLD = 0.5; // Fast swipe threshold
    const MAX_RESISTANCE_ZONE = 0.2; // 20% over-drag with resistance

    function getPoint(e: PointerEvent | TouchEvent) {
      const point = 'touches' in e ? e.touches[0] : e;
      return side === 'left' || side === 'right' ? point.clientX : point.clientY;
    }

    function getMaxDragDistance() {
      const rect = el.getBoundingClientRect();
      return side === 'left' || side === 'right' ? rect.width : rect.height;
    }

    function calculateResistance(progress: number) {
      if (progress <= 1) return 1;
      // Apply exponential resistance for over-drag
      const overDrag = progress - 1;
      return Math.max(0.1, 1 - (overDrag / MAX_RESISTANCE_ZONE) * 0.9);
    }

    let startHeightPx = 0;

    function onPointerStart(e: PointerEvent | TouchEvent) {
      // Only block text inputs to avoid fighting with caret/selection; allow dragging on buttons/links
      const target = e.target as HTMLElement;
      if (target.closest('input, select, textarea') || target.isContentEditable) {
        return; // Let native text inputs handle the gesture
      }
      
      const point = getPoint(e);
      dragData.current = {
        startPoint: point,
        lastPoint: point,
        lastTime: Date.now(),
        velocityHistory: []
      };
      
      setDragState(prev => ({ ...prev, isDragging: true }));
      // capture starting height for potential expansion (top/bottom)
      try {
        const rect = el.getBoundingClientRect();
        startHeightPx = rect.height;
      } catch {
        startHeightPx = 0;
      }
      shrinkAppliedPxRef.current = 0;
      translateAppliedPxRef.current = 0;
      
      if ('setPointerCapture' in el && 'pointerId' in e) {
        el.setPointerCapture((e as PointerEvent).pointerId);
      }
    }

    function onPointerMove(e: PointerEvent | TouchEvent) {
      if (!dragData.current.startPoint) return;
      const point = getPoint(e);
      const now = Date.now();
      const timeDelta = now - dragData.current.lastTime;
      
      if (timeDelta > 0) {
        const pointDelta = point - dragData.current.lastPoint;
        const rawVelocity = pointDelta / timeDelta; // px/ms
        // Project velocity into the drawer close direction
        const directionalVelocity = (() => {
          switch (side) {
            case 'left': return -rawVelocity;   // left closes when moving left (negative Y), invert
            case 'right': return rawVelocity;   // right closes when moving right
            case 'top': return -rawVelocity;    // top closes when moving up
            case 'bottom': return rawVelocity;  // bottom closes when moving down
          }
        })();

        // Keep velocity history for momentum calculation (directional)
        dragData.current.velocityHistory.push(directionalVelocity);
        if (dragData.current.velocityHistory.length > 5) {
          dragData.current.velocityHistory.shift();
        }
      }

      const totalDelta = point - dragData.current.startPoint;
      const maxDistance = getMaxDragDistance();
      
      // Calculate natural drag direction
      let naturalDelta: number;
      switch (side) {
        case 'left': naturalDelta = -totalDelta; break;
        case 'right': naturalDelta = totalDelta; break;
        case 'top': naturalDelta = -totalDelta; break;
        case 'bottom': naturalDelta = totalDelta; break;
      }

      // Handle both correct and wrong direction drags using incremental deltas
      let adjustedOffset: number = 0;
      let progress: number = 0;
      let resistance: number = 1;
      let scaleFactorLocal: number = 1;
      
      // We will prevent default when we actually consume the gesture
      let shouldPreventDefault = false;

      // Incremental delta in the close direction for this frame
      const incrementalCloseDelta = (() => {
        const pointDelta = point - dragData.current.lastPoint;
        switch (side) {
          case 'left': return -pointDelta;   // moving left closes
          case 'right': return pointDelta;   // moving right closes
          case 'top': return -pointDelta;    // moving up closes
          case 'bottom': return pointDelta;  // moving down closes
        }
      })();

      if (incrementalCloseDelta > 0) {
        // Closing direction
        if (expandOptions?.enabled && (side === 'top' || side === 'bottom')) {
          const viewportH = typeof window !== 'undefined' ? window.innerHeight : 0;
          const halfH = Math.max(0, Math.round(viewportH * 0.5));
          const currentH = el.getBoundingClientRect().height;
          const shrinkCapacity = Math.max(0, currentH - halfH);
          const appliedShrink = Math.min(incrementalCloseDelta, shrinkCapacity);
          if (appliedShrink > 0) {
            expandOptions.onUpdateHeight(currentH - appliedShrink);
            shrinkAppliedPxRef.current += appliedShrink;
            shouldPreventDefault = true;
          }
          const remaining = incrementalCloseDelta - appliedShrink;
          if (remaining > 0) {
            translateAppliedPxRef.current += remaining;
            const rawProgress = translateAppliedPxRef.current / Math.max(1, maxDistance);
            resistance = calculateResistance(rawProgress);
            adjustedOffset = translateAppliedPxRef.current * resistance;
            progress = Math.min(rawProgress, 1 + MAX_RESISTANCE_ZONE);
            shouldPreventDefault = true;
          } else {
            resistance = 1;
            adjustedOffset = translateAppliedPxRef.current;
            progress = translateAppliedPxRef.current / Math.max(1, maxDistance);
          }
          // subtle stretch proportional to per-frame effort
          const magnitudePx = Math.abs(point - dragData.current.lastPoint);
          scaleFactorLocal = 1 + Math.min(magnitudePx / 400, 0.02);
        } else {
          translateAppliedPxRef.current += incrementalCloseDelta;
          const rawProgress = translateAppliedPxRef.current / Math.max(1, maxDistance);
          resistance = calculateResistance(rawProgress);
          adjustedOffset = translateAppliedPxRef.current * resistance;
          progress = Math.min(rawProgress, 1 + MAX_RESISTANCE_ZONE);
          shouldPreventDefault = true;
          const magnitudePx = Math.abs(point - dragData.current.lastPoint);
          scaleFactorLocal = 1 + Math.min(magnitudePx / 400, 0.02);
        }
      } else if (incrementalCloseDelta < 0) {
        // Wrong direction (expanding/opening more)
        const wrongStep = Math.abs(incrementalCloseDelta);
        const canExpand = expandOptions?.enabled && (side === 'top' || side === 'bottom');
        if (canExpand) {
          const minH = expandOptions!.getMinHeightPx();
          const maxH = expandOptions!.getMaxHeightPx();
          const currentH = el.getBoundingClientRect().height;
          const unclamped = currentH + wrongStep;
          const nextH = Math.max(minH, Math.min(unclamped, maxH));
          expandOptions!.onUpdateHeight(nextH);
          adjustedOffset = translateAppliedPxRef.current;
          progress = translateAppliedPxRef.current / Math.max(1, maxDistance);
          if (nextH >= maxH - 0.5) {
            const overDrag = Math.max(0, unclamped - maxH);
            const maxWrongDrag = maxDistance * 0.1;
            const wrongProgress = Math.min(overDrag / Math.max(1, maxWrongDrag), 1);
            scaleFactorLocal = 1 + (wrongProgress * 0.015);
          } else {
            // Apply subtle stretch while expanding even before max height
            const maxWrongDrag = maxDistance * 0.1;
            const wrongProgress = Math.min(wrongStep / Math.max(1, maxWrongDrag), 1);
            scaleFactorLocal = 1 + (wrongProgress * 0.012);
          }
          shouldPreventDefault = true;
        } else {
          // Subtle scale feedback
          const maxWrongDrag = maxDistance * 0.1;
          const wrongProgress = Math.min(wrongStep / Math.max(1, maxWrongDrag), 1);
          const scaleAmount = 1 + (wrongProgress * 0.015);
          adjustedOffset = translateAppliedPxRef.current;
          progress = translateAppliedPxRef.current / Math.max(1, maxDistance);
          scaleFactorLocal = scaleAmount;
          shouldPreventDefault = true;
        }
      } else {
        // No movement on this frame; keep previous state-derived values
        adjustedOffset = translateAppliedPxRef.current;
        progress = translateAppliedPxRef.current / Math.max(1, maxDistance);
        resistance = 1;
        scaleFactorLocal = 1;
      }

      if (shouldPreventDefault) {
        e.preventDefault();
      }

      setDragState({
        isDragging: true,
        offset: adjustedOffset,
        velocity: dragData.current.velocityHistory.slice(-1)[0] || 0, // directional last velocity
        progress,
        resistance,
        wrongDirectionScale: scaleFactorLocal
      });

      dragData.current.lastPoint = point;
      dragData.current.lastTime = now;
    }

    function onPointerEnd() {
      if (!dragData.current.startPoint) return;

      const { velocityHistory } = dragData.current;
      // Use the maximum directional velocity over the last few samples
      const maxDirectionalVelocity = velocityHistory.length > 0
        ? Math.max(0, ...velocityHistory)
        : 0;

      // Compute overall closing-direction drag distance in pixels
      const totalDelta = dragData.current.lastPoint - dragData.current.startPoint;
      let naturalDeltaAtEnd = 0;
      switch (side) {
        case 'left': naturalDeltaAtEnd = -totalDelta; break;
        case 'right': naturalDeltaAtEnd = totalDelta; break;
        case 'top': naturalDeltaAtEnd = -totalDelta; break;
        case 'bottom': naturalDeltaAtEnd = totalDelta; break;
      }

      // Only close if:
      // - Drag progressed sufficiently in the close direction, OR
      // - Velocity in the close direction is high enough and user moved at least a tiny bit in that direction
      const MIN_PROGRESS_FOR_VELOCITY_CLOSE = 0.02;
      let shouldClose = (dragState.progress >= CLOSE_THRESHOLD) 
        || (maxDirectionalVelocity >= VELOCITY_THRESHOLD && dragState.progress >= MIN_PROGRESS_FOR_VELOCITY_CLOSE);

      // Additional rule for top/bottom: if user dragged more than half the viewport in close direction, close
      if (expandOptions?.enabled && (side === 'top' || side === 'bottom')) {
        const viewportH = typeof window !== 'undefined' ? window.innerHeight : 0;
        const halfViewport = viewportH * 0.5;
        if (naturalDeltaAtEnd >= halfViewport) {
          shouldClose = true;
        }
      }

      if (shouldClose) {
        onClose();
      }

      // Reset drag state accumulators
      setDragState({
        isDragging: false,
        offset: 0,
        velocity: 0,
        progress: 0,
        resistance: 1,
        wrongDirectionScale: 1
      });

      dragData.current = {
        startPoint: 0,
        lastPoint: 0,
        lastTime: 0,
        velocityHistory: []
      };
      shrinkAppliedPxRef.current = 0;
      translateAppliedPxRef.current = 0;
    }

    // Support both pointer and touch events directly on panel
    el.addEventListener('pointerdown', onPointerStart);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerEnd);
    el.addEventListener('pointercancel', onPointerEnd);
    
    el.addEventListener('touchstart', onPointerStart, { passive: false });
    el.addEventListener('touchmove', onPointerMove, { passive: false });
    el.addEventListener('touchend', onPointerEnd);
    el.addEventListener('touchcancel', onPointerEnd);

    return () => {
      el.removeEventListener('pointerdown', onPointerStart);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerEnd);
      el.removeEventListener('pointercancel', onPointerEnd);
      
      el.removeEventListener('touchstart', onPointerStart);
      el.removeEventListener('touchmove', onPointerMove);
      el.removeEventListener('touchend', onPointerEnd);
      el.removeEventListener('touchcancel', onPointerEnd);
    };
  }, [handleRef, side, active, onClose, dragState.progress, expandOptions]);

  return dragState;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  side = 'left',
  size = 'm',
  dismissible = true,
  swipeToClose = true,
  backdrop = true,
  trapFocus = true,
  initialFocusRef,
  className,
  backdropClassName,
  panelClassName,
  expandToFull = true,
  maxExpandedHeight = '100vh',
  expandWithWheel = true,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  children,
}) => {
  const hasFiniteNumber = (n: unknown): n is number => typeof n === 'number' && isFinite(n);
  const id = useId();
  const portalRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [expandedHeightPx, setExpandedHeightPx] = useState<number | null>(null);
  const baseHeightPxRef = useRef<number>(0);

  // Handle opening/closing animations with safe initial mount
  const isFirstMountRef = useRef(true);
  useEffect(() => {
    if (open) {
      setShouldRender(true);
      let raf1 = 0; let raf2 = 0;
      raf1 = requestAnimationFrame(() => {
        // Force layout so initial transform is applied
        const panel = panelRef.current;
        if (panel) {
          // Reset inline transform so CSS side transform takes effect for new side
          panel.style.transform = '';
          // Reset any expanded height inline style
          setExpandedHeightPx(null);
          void panel.getBoundingClientRect();
        }
        raf2 = requestAnimationFrame(() => {
          setIsAnimating(true);
          isFirstMountRef.current = false;
          // capture base height once visible
          try {
            const rect = panelRef.current?.getBoundingClientRect();
            baseHeightPxRef.current = rect?.height || 0;
          } catch { baseHeightPxRef.current = 0; }
        });
      });
      return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // create portal mount
  useEffect(() => {
    let root = document.getElementById('drawer-root');
    if (!root) {
      root = document.createElement('div');
      root.setAttribute('id', 'drawer-root');
      document.body.appendChild(root);
    }
    portalRef.current = root as HTMLElement;
  }, []);

  // esc to close
  useEffect(() => {
    if (!open || !dismissible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, dismissible, onClose]);

  useLockBodyScroll(shouldRender);
  // Always call the hook; enable/disable via flag to satisfy hooks rule
  useFocusTrap(panelRef as React.RefObject<HTMLElement>, shouldRender && trapFocus, initialFocusRef);

  // Temporarily disable browser pull-to-refresh/overscroll while drawer is open
  useEffect(() => {
    if (!shouldRender) return;
    const htmlStyle = document.documentElement.style;
    const bodyStyle = document.body.style;
    const prevHtml = htmlStyle.getPropertyValue('overscroll-behavior');
    const prevHtmlY = htmlStyle.getPropertyValue('overscroll-behavior-y');
    const prevBody = bodyStyle.getPropertyValue('overscroll-behavior');
    const prevBodyY = bodyStyle.getPropertyValue('overscroll-behavior-y');
    htmlStyle.setProperty('overscroll-behavior', 'none');
    htmlStyle.setProperty('overscroll-behavior-y', 'none');
    bodyStyle.setProperty('overscroll-behavior', 'none');
    bodyStyle.setProperty('overscroll-behavior-y', 'none');
    return () => {
      if (prevHtml) htmlStyle.setProperty('overscroll-behavior', prevHtml);
      else htmlStyle.removeProperty('overscroll-behavior');
      if (prevHtmlY) htmlStyle.setProperty('overscroll-behavior-y', prevHtmlY);
      else htmlStyle.removeProperty('overscroll-behavior-y');
      if (prevBody) bodyStyle.setProperty('overscroll-behavior', prevBody);
      else bodyStyle.removeProperty('overscroll-behavior');
      if (prevBodyY) bodyStyle.setProperty('overscroll-behavior-y', prevBodyY);
      else bodyStyle.removeProperty('overscroll-behavior-y');
    };
  }, [shouldRender]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dismissible) return;
    if (e.target === e.currentTarget) onClose();
  }, [dismissible, onClose]);

  // Compute expansion availability and bounds (only for top/bottom)
  const expansionEnabled = expandToFull && (side === 'top' || side === 'bottom');
  const getMaxHeightPx = useCallback(() => {
    if (typeof maxExpandedHeight === 'number') return maxExpandedHeight;
    if (typeof window === 'undefined') return baseHeightPxRef.current || 0;
    if (typeof maxExpandedHeight === 'string') {
      if (maxExpandedHeight.endsWith('vh')) {
        const n = parseFloat(maxExpandedHeight);
        return Math.round((window.innerHeight * n) / 100);
      }
      if (maxExpandedHeight.endsWith('px')) {
        return Math.round(parseFloat(maxExpandedHeight));
      }
    }
    return window.innerHeight;
  }, [maxExpandedHeight]);

  const getMinHeightPx = useCallback(() => {
    return baseHeightPxRef.current || (panelRef.current?.getBoundingClientRect().height ?? 0);
  }, []);

  const dragState = useAdvancedDrag(
    panelRef as React.RefObject<HTMLElement>,
    side,
    shouldRender && swipeToClose,
    onClose,
    expansionEnabled ? {
      enabled: true,
      getMinHeightPx,
      getMaxHeightPx,
      onUpdateHeight: (h) => setExpandedHeightPx(h)
    } : undefined
  );

  if (!portalRef.current || !shouldRender) return null;

  const block = bem('drawer', [
    'mounted',
    isAnimating && 'open',
    `side-${side}`,
    size === 'fullscreen' ? 'fullscreen' : `size-${size}`,
  ]);

  // Apply advanced drag transforms with resistance and progress feedback
  const dragStyle: React.CSSProperties = dragState.isDragging ? {
    transform: (() => {
      const translatePart = (() => {
        if (dragState.offset === 0) return '';
        switch (side) {
          case 'left': return `translate3d(${-dragState.offset}px, 0, 0)`;
          case 'right': return `translate3d(${dragState.offset}px, 0, 0)`;
          case 'top': return `translate3d(0, ${-dragState.offset}px, 0)`;
          case 'bottom': return `translate3d(0, ${dragState.offset}px, 0)`;
        }
      })();

      // iOS-like stretch effect (always available when wrongDirectionScale > 1 or over-drag)
      const hasWrongScale = dragState.wrongDirectionScale > 1.001;
      const hasOverDrag = dragState.progress > 1; // over-drag beyond full travel

      let scaleValue: number | undefined;
      if (hasWrongScale && hasOverDrag) {
        // Combine by taking the larger for noticeable feedback
        const extra = Math.min(Math.max(dragState.progress - 1, 0), 0.2);
        const overScale = 1 + extra * 0.075;
        scaleValue = Math.max(dragState.wrongDirectionScale, overScale);
      } else if (hasWrongScale) {
        scaleValue = dragState.wrongDirectionScale; // up to ~1.02
      } else if (hasOverDrag) {
        const extra = Math.min(Math.max(dragState.progress - 1, 0), 0.2); // 0..0.2
        scaleValue = 1 + extra * 0.075; // max ~1.015
      }

      // Also feed CSS variables so initial mount/open transitions include scaling without JS inline transform fights
      const scalePart = typeof scaleValue === 'number' ? (() => {
        switch (side) {
          case 'left':
          case 'right':
            return ` scaleX(${scaleValue})`;
          case 'top':
          case 'bottom':
            return ` scaleY(${scaleValue})`;
        }
      })() : '';

      return `${translatePart}${scalePart}`.trim();
    })(),
    transformOrigin: (() => {
      switch (side) {
        case 'left': return 'left center';
        case 'right': return 'right center';
        case 'top': return 'center top';
        case 'bottom': return 'center bottom';
      }
    })(),
    transition: 'none', // Disable transitions during drag
    opacity: 1, // Keep content fully visible during drag
    willChange: 'transform, opacity', // Optimize for animations
    // keep CSS vars in sync for pure-CSS transitions
    ...(side === 'left' || side === 'right'
      ? { ['--drawer-scale-x' as any]: hasFiniteNumber(dragState.wrongDirectionScale) ? String(dragState.wrongDirectionScale) : '1' }
      : { ['--drawer-scale-y' as any]: hasFiniteNumber(dragState.wrongDirectionScale) ? String(dragState.wrongDirectionScale) : '1' }),
  } : {
    willChange: 'auto' // Reset when not dragging
  };

  // Backdrop opacity based on drag progress
  const backdropStyle: React.CSSProperties = dragState.isDragging ? {
    opacity: Math.max(0.1, 1 - dragState.progress * 0.9),
    transition: 'none'
  } : {};

  const content = (
    <div className={[block, className].filter(Boolean).join(' ')} role="presentation">
      {backdrop && (
        <div 
          className={["drawer__backdrop", backdropClassName].filter(Boolean).join(' ')} 
          onClick={handleBackdropClick}
          style={backdropStyle}
        />
      )}
      <div
        ref={panelRef}
        className={["drawer__panel", panelClassName].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : ariaLabelledby || `${id}-title`}
        aria-describedby={ariaDescribedby || `${id}-description`}
        tabIndex={-1}
        style={{ ...dragStyle, height: expansionEnabled && expandedHeightPx ? `${expandedHeightPx}px` : undefined }}
        onWheelCapture={(e) => {
          if (!expansionEnabled || !expandWithWheel) return;
          const panel = panelRef.current;
          if (!panel) return;
          const currentRect = panel.getBoundingClientRect();
          const minH = getMinHeightPx();
          const maxH = getMaxHeightPx();
          let dir: 1 | -1 | 0 = 0;
          if (side === 'bottom') {
            // Scroll up expands
            dir = e.deltaY < 0 ? 1 : -1;
          } else if (side === 'top') {
            // Scroll down expands
            dir = e.deltaY > 0 ? 1 : -1;
          }
          if (dir === 1) {
            // Try to expand
            const delta = Math.min(Math.abs(e.deltaY), 120); // clamp per tick
            const nextH = Math.max(minH, Math.min((expandedHeightPx ?? currentRect.height) + delta, maxH));
            if (nextH > currentRect.height + 0.5) {
              e.preventDefault();
              e.stopPropagation();
              setExpandedHeightPx(nextH);
            }
          } else if (dir === -1) {
            // Shrink back down only until min (optional)
            const delta = Math.min(Math.abs(e.deltaY), 120);
            const nextH = Math.max(minH, Math.min((expandedHeightPx ?? currentRect.height) - delta, maxH));
            if (nextH < currentRect.height - 0.5) {
              e.preventDefault();
              e.stopPropagation();
              setExpandedHeightPx(nextH);
            }
          }
        }}
        data-drag-progress={dragState.progress}
        data-dragging={dragState.isDragging}
      >
        {dragState.isDragging && dragState.progress > 0 && (
          <div className="drawer__drag-indicator" data-side={side}>
            <div 
              className="drawer__drag-progress" 
              style={{ 
                '--progress': `${Math.min(dragState.progress * 100, 100)}%`,
                '--resistance': dragState.resistance 
              } as React.CSSProperties}
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, portalRef.current);
};

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ className, ...props }) => (
  <div className={["drawer__header", className].filter(Boolean).join(' ')} {...props} />
);

export interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
export const DrawerBody: React.FC<DrawerBodyProps> = ({ className, ...props }) => (
  <div className={["drawer__body", className].filter(Boolean).join(' ')} {...props} />
);

export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
export const DrawerFooter: React.FC<DrawerFooterProps> = ({ className, ...props }) => (
  <div className={["drawer__footer", className].filter(Boolean).join(' ')} {...props} />
);

export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
export const DrawerTitle: React.FC<DrawerTitleProps> = ({ className, as: Tag = 'h2', id, ...props }) => (
  <Tag id={id} className={["drawer__title", className].filter(Boolean).join(' ')} {...props} />
);

export interface DrawerDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> { as?: 'p' | 'div' | 'span' }
export const DrawerDescription: React.FC<DrawerDescriptionProps> = ({ className, as: Tag = 'p', id, ...props }) => (
  <Tag id={id} className={["drawer__description", className].filter(Boolean).join(' ')} {...props} />
);

export default Drawer;


