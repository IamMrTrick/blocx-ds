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
  onClose: () => void
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

    function onPointerStart(e: PointerEvent | TouchEvent) {
      // Only start drag if not clicking on interactive elements
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea, [role="button"]')) {
        return; // Allow normal click behavior
      }
      
      const point = getPoint(e);
      dragData.current = {
        startPoint: point,
        lastPoint: point,
        lastTime: Date.now(),
        velocityHistory: []
      };
      
      setDragState(prev => ({ ...prev, isDragging: true }));
      
      if ('setPointerCapture' in el && 'pointerId' in e) {
        el.setPointerCapture((e as PointerEvent).pointerId);
      }
    }

    function onPointerMove(e: PointerEvent | TouchEvent) {
      if (!dragData.current.startPoint) return;
      
      e.preventDefault();
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

      // Handle both correct and wrong direction drags
      let adjustedOffset: number;
      let progress: number;
      let resistance: number;
      
      if (naturalDelta >= 0) {
        // Correct direction - normal drag behavior
        const rawProgress = naturalDelta / maxDistance;
        resistance = calculateResistance(rawProgress);
        adjustedOffset = naturalDelta * resistance;
        progress = Math.min(rawProgress, 1 + MAX_RESISTANCE_ZONE);
      } else {
        // Wrong direction - use subtle scale feedback instead of movement
        const wrongDirectionDelta = Math.abs(naturalDelta);
        const maxWrongDrag = maxDistance * 0.1; // Max 10% for scale calculation
        const wrongProgress = Math.min(wrongDirectionDelta / maxWrongDrag, 1);
        
        // Calculate scale factor (slightly expand in the drag axis)
        const scaleAmount = 1 + (wrongProgress * 0.015); // Max 1.5% expansion
        
        adjustedOffset = 0; // No movement for wrong direction
        progress = 0; // No closing progress for wrong direction
        resistance = scaleAmount;
      }

      setDragState({
        isDragging: true,
        offset: adjustedOffset,
        velocity: dragData.current.velocityHistory.slice(-1)[0] || 0, // directional last velocity
        progress,
        resistance,
        wrongDirectionScale: resistance
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

      // Only close if:
      // - Drag progressed sufficiently in the close direction, OR
      // - Velocity in the close direction is high enough and user moved at least a tiny bit in that direction
      const MIN_PROGRESS_FOR_VELOCITY_CLOSE = 0.02;
      const shouldClose = (dragState.progress >= CLOSE_THRESHOLD) 
        || (maxDirectionalVelocity >= VELOCITY_THRESHOLD && dragState.progress >= MIN_PROGRESS_FOR_VELOCITY_CLOSE);

      if (shouldClose) {
        onClose();
      }

      // Reset drag state
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
  }, [handleRef, side, active, onClose, dragState.progress]);

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
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  children,
}) => {
  const id = useId();
  const portalRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

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
          void panel.getBoundingClientRect();
        }
        raf2 = requestAnimationFrame(() => {
          setIsAnimating(true);
          isFirstMountRef.current = false;
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

  const dragState = useAdvancedDrag(panelRef as React.RefObject<HTMLElement>, side, shouldRender && swipeToClose, onClose);

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

      // iOS-like stretch effect
      const shouldScaleWrong = dragState.progress === 0 && dragState.wrongDirectionScale > 1.001;
      const shouldScaleOver = dragState.progress > 1; // over-drag beyond full travel

      let scaleValue: number | undefined;
      if (shouldScaleWrong) {
        scaleValue = dragState.wrongDirectionScale; // up to ~1.015
      } else if (shouldScaleOver) {
        const extra = Math.min(Math.max(dragState.progress - 1, 0), 0.2); // 0..0.2
        scaleValue = 1 + extra * 0.075; // max ~1.015
      }

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
        style={dragStyle}
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


