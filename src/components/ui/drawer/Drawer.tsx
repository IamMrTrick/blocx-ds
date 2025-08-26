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
  /** Optional: enable header-dock step before full close (top/bottom only) */
  dockHeaderOnClose?: boolean;
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

// Rewritten drag hook: robust incremental axis drag with optional height expansion and elastic scaling
function useDrawerDrag(
  handleRef: React.RefObject<HTMLElement> | React.MutableRefObject<HTMLElement>,
  side: DrawerSide,
  active: boolean,
  onClose: () => void,
  expandOptions?: {
    enabled: boolean;
    getMinHeightPx: () => number;
    getMaxHeightPx: () => number;
    onUpdateHeight: (heightPx: number) => void;
    getHeaderDockHeightPx?: () => number;
    onDockHeader?: () => void;
    onUndockHeader?: () => void;
  }
) {
  const [state, setState] = useState({
    isDragging: false,
    offset: 0,
    progress: 0,
    wrongDirectionScale: 1,
  });

  const ref = useRef({
    startPoint: 0,
    lastPoint: 0,
    lastTime: 0,
    heightAtStart: 0,
    velocities: [] as number[],
    committed: false,
    axis: 'y' as 'x' | 'y',
    appliedShrink: 0,
    appliedTranslate: 0,
    startedInsideBody: false,
  });

  useEffect(() => {
    if (!active) return;
    const el = handleRef.current;
    if (!el) return;

    const CLOSE_THRESHOLD = 0.4; // 40% of travel
    const VELOCITY_THRESHOLD = 0.5; // px/ms projected into close direction
    const MAX_WRONG_STRETCH = 0.02; // 2%

    const axisPoint = (e: PointerEvent | TouchEvent) => {
      const p = 'touches' in e ? e.touches[0] : e;
      return (side === 'left' || side === 'right') ? p.clientX : p.clientY;
    };

    const axisSize = () => {
      const r = el.getBoundingClientRect();
      return (side === 'left' || side === 'right') ? r.width : r.height;
    };

    const sideSign = () => {
      switch (side) {
        case 'left': return -1; // moving left closes
        case 'right': return 1; // moving right closes
        case 'top': return -1; // moving up closes
        case 'bottom': return 1; // moving down closes
      }
    };

    function onDown(e: PointerEvent | TouchEvent) {
      const target = e.target as HTMLElement;
      // Ignore interactive elements so clicks work normally
      if (target.closest('button, a, [role="button"], input, select, textarea') || target.isContentEditable) return;
      const p = axisPoint(e);
      const rect = el.getBoundingClientRect();
      ref.current = {
        startPoint: p,
        lastPoint: p,
        lastTime: Date.now(),
        heightAtStart: rect.height,
        velocities: [],
        committed: false,
        axis: (side === 'left' || side === 'right') ? 'x' : 'y',
        appliedShrink: 0,
        appliedTranslate: 0,
        startedInsideBody: !!target.closest('.drawer__body'),
      };
      // Do not mark dragging until commit; preserve click/scroll behavior
      setState(s => ({ ...s, isDragging: false }));
      // Do not capture yet; capture only when drag commits to allow native scrolls
    }

    function onMove(e: PointerEvent | TouchEvent) {
      if (!ref.current.startPoint) return;
      const p = axisPoint(e);
      const now = Date.now();
      const dt = Math.max(1, now - ref.current.lastTime);
      const rawDelta = p - ref.current.lastPoint;
      // Deadzone and axis gating with direction policy
      const MOVEMENT_DEADZONE = 6; // px
      const sign = sideSign();
      const projectedVelocity = (rawDelta / dt) * sign; // px/ms
      ref.current.velocities.push(projectedVelocity);
      if (ref.current.velocities.length > 6) ref.current.velocities.shift();

      const totalClose = (p - ref.current.startPoint) * sign; // >0 means closing
      const maxDist = Math.max(1, axisSize());

      let offset = 0;
      let progress = 0;
      let scale = 1;

      const incClose = Math.max(0, rawDelta * sign);
      const incOpen = Math.max(0, -rawDelta * sign);

      if (!ref.current.committed) {
        const moved = Math.abs(p - ref.current.startPoint);
        if (moved < MOVEMENT_DEADZONE) {
          // Allow native scroll until commit
          return;
        }
        // Decide whether to commit based on direction and expansion state
        let canCommit = false;
        const bodyEl = el.querySelector('.drawer__body') as HTMLElement | null;
        const currentH = el.getBoundingClientRect().height;
        const isExpandSide = (side === 'top' || side === 'bottom');
        const expandEnabled = !!expandOptions?.enabled && isExpandSide;
        const maxH = expandEnabled ? expandOptions!.getMaxHeightPx() : 0;
        const atMax = expandEnabled ? currentH >= maxH - 1 : false;
        const atTop = bodyEl ? bodyEl.scrollTop <= 0 : true;
        const atBottom = bodyEl ? (bodyEl.scrollTop + bodyEl.clientHeight >= bodyEl.scrollHeight - 1) : true;

        if (incClose > 0) {
          if (expandEnabled) {
            if (atMax) {
              // Fully expanded: only commit if body cannot scroll further down
              canCommit = bodyEl ? atBottom : true;
            } else {
              canCommit = true; // shrink/translate
            }
          } else {
            canCommit = true; // non-expand sides: translate to close
          }
        } else if (incOpen > 0) {
          if (expandEnabled) {
            if (!atMax) {
              canCommit = true; // expand height instead of scroll
            } else {
              // At max: only commit if body cannot scroll up
              canCommit = bodyEl ? atTop : true;
            }
          } else {
            // side drawers do not expand; only elastic. Keep scroll native.
            canCommit = false;
          }
        }
        if (!canCommit) {
          return; // keep native scroll/pass-through
        }
        ref.current.committed = true;
        if ('setPointerCapture' in el && 'pointerId' in e) {
          try { el.setPointerCapture((e as PointerEvent).pointerId); } catch {}
        }
      }

      if (incClose > 0) {
        // Closing
        if ((side === 'top' || side === 'bottom') && expandOptions?.enabled) {
          const currentH = el.getBoundingClientRect().height;
          const minH = expandOptions.getMinHeightPx();
          const shrinkCapacity = Math.max(0, currentH - minH);
          const shrinkBy = Math.min(incClose, shrinkCapacity);
          if (shrinkBy > 0) {
            expandOptions.onUpdateHeight(currentH - shrinkBy);
            ref.current.appliedShrink += shrinkBy;
          }
          const remaining = incClose - shrinkBy;
          if (remaining > 0) {
            ref.current.appliedTranslate += remaining;
          }
        } else {
          ref.current.appliedTranslate += incClose;
        }
        offset = ref.current.appliedTranslate;
        progress = Math.min(offset / maxDist, 1.2);
        // subtle elastic scale based on per-frame effort
        const effort = Math.abs(rawDelta);
        scale = 1 + Math.min(effort / 400, MAX_WRONG_STRETCH);
      } else {
        // Wrong/open direction (reverse movement)
        let remainingOpen = incOpen;
        // 1) First unwind any applied translate so movement tracks finger exactly
        if (ref.current.appliedTranslate > 0) {
          const reduce = Math.min(remainingOpen, ref.current.appliedTranslate);
          ref.current.appliedTranslate -= reduce;
          remainingOpen -= reduce;
        }

        if ((side === 'top' || side === 'bottom') && expandOptions?.enabled) {
          // 2) Then grow height toward max with any leftover open distance
          const currentH = el.getBoundingClientRect().height;
          const maxH = expandOptions.getMaxHeightPx();
          const growCapacity = Math.max(0, maxH - currentH);
          const growBy = Math.min(remainingOpen, growCapacity);
          if (growBy > 0) {
            expandOptions.onUpdateHeight(currentH + growBy);
            ref.current.appliedShrink = Math.max(0, ref.current.appliedShrink - growBy);
            remainingOpen -= growBy;
          }
        }

        // 3) Any extra open distance becomes elastic over-drag scale only
        if (remainingOpen > 0) {
          scale = 1 + Math.min(remainingOpen / (maxDist * 0.1), 1) * 0.015;
        } else {
          // subtle scale even when just reversing translate for tactile feel
          scale = 1 + Math.min(incOpen / (maxDist * 0.1), 1) * 0.012;
        }

        offset = ref.current.appliedTranslate;
        progress = Math.min(offset / maxDist, 1.2);
      }

      // Prevent default only after drag is committed, so internal scroll works before commit
      e.preventDefault();
      setState({ isDragging: true, offset, progress, wrongDirectionScale: scale });
      ref.current.lastPoint = p;
      ref.current.lastTime = now;
    }

    function onUp() {
      if (!ref.current.startPoint) return;
      const sign = sideSign();
      const totalClose = (ref.current.lastPoint - ref.current.startPoint) * sign;
      const maxDist = Math.max(1, axisSize());
      const prog = Math.max(0, totalClose) / maxDist;
      const maxVel = ref.current.velocities.length
        ? Math.max(0, ...ref.current.velocities)
        : 0;

      let shouldClose = prog >= CLOSE_THRESHOLD || (maxVel >= VELOCITY_THRESHOLD && prog >= 0.02);
      if (side === 'top' || side === 'bottom') {
        const isExpand = !!expandOptions?.enabled;
        const minH = isExpand ? expandOptions!.getMinHeightPx() : 0;
        const maxH = isExpand ? expandOptions!.getMaxHeightPx() : 0;
        const startedAtFull = isExpand ? Math.abs(ref.current.heightAtStart - maxH) <= 1 : false;

        if (isExpand && startedAtFull) {
          // Two-step from FULL: first pull must snap to compact unless pull is almost full travel
          const baseDist = Math.max(1, ref.current.heightAtStart);
          const fromFullProg = Math.max(0, totalClose) / baseDist;
          const CLOSE_FROM_FULL_THRESHOLD = 0.9; // must pull ~90% to close directly from full
          if (fromFullProg >= CLOSE_FROM_FULL_THRESHOLD) {
            shouldClose = true;
          } else {
            shouldClose = false;
            const currentH = el.getBoundingClientRect().height;
            if (Math.abs(currentH - minH) > 1) {
              expandOptions!.onUpdateHeight(minH);
            }
          }
        } else {
          // Normal rule: half viewport strong close
          const half = (typeof window !== 'undefined') ? window.innerHeight * 0.5 : 0;
          if (totalClose >= half) shouldClose = true;
          // If not closing, snap to nearest compact/full when expand is enabled
          if (!shouldClose && isExpand) {
            const currentH = el.getBoundingClientRect().height;
            const midpoint = minH + (maxH - minH) * 0.5;
            const target = currentH >= midpoint ? maxH : minH;
            if (Math.abs(currentH - target) > 1) {
              expandOptions!.onUpdateHeight(target);
            }
          }
        }
      }

      if (shouldClose) onClose();

      setState({ isDragging: false, offset: 0, progress: 0, wrongDirectionScale: 1 });
      ref.current = { startPoint: 0, lastPoint: 0, lastTime: 0, heightAtStart: 0, velocities: [], committed: false, axis: (side === 'left' || side === 'right') ? 'x' : 'y', appliedShrink: 0, appliedTranslate: 0, startedInsideBody: false };
    }

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('touchstart', onDown, { passive: false });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onUp);
    el.addEventListener('touchcancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('touchstart', onDown);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onUp);
      el.removeEventListener('touchcancel', onUp);
    };
  }, [handleRef, side, active, onClose, expandOptions?.enabled]);

  return state;
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
  maxExpandedHeight = 'calc(100% - 32px)',
  expandWithWheel = true,
  dockHeaderOnClose = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  children,
}) => {
  // removed CSS var sync helper
  const id = useId();
  const portalRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerDockHeightRef = useRef<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [expandedHeightPx, setExpandedHeightPx] = useState<number | null>(null);
  const baseHeightPxRef = useRef<number>(0);
  const [isHeaderDocked, setIsHeaderDocked] = useState(false);

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
          setIsHeaderDocked(false);
          void panel.getBoundingClientRect();
        }
        raf2 = requestAnimationFrame(() => {
          setIsAnimating(true);
          isFirstMountRef.current = false;
          // capture base height once visible
          try {
            const rect = panelRef.current?.getBoundingClientRect();
            baseHeightPxRef.current = rect?.height || 0;
            const headerEl = panelRef.current?.querySelector('.drawer__header') as HTMLElement | null;
            if (headerEl && rect) {
              const hRect = headerEl.getBoundingClientRect();
              headerDockHeightRef.current = Math.max(0, Math.round(hRect.bottom - rect.top));
            } else {
              headerDockHeightRef.current = 0;
            }
          } catch { baseHeightPxRef.current = 0; headerDockHeightRef.current = 0; }
        });
      });
      return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 400);
      // Ensure height resets for next open
      setExpandedHeightPx(null);
      setIsHeaderDocked(false);
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
  // Target "compact" height when expanded: use min(size preset, base height)
  const getTargetCompactHeight = useCallback(() => {
    // derive from current size classes: s=55vh, m=65vh, l=75vh, xl=88vh per SCSS
    const vh = ((): number => {
      switch (size) {
        case 's': return 55;
        case 'm': return 65;
        case 'l': return 75;
        case 'xl': return 88;
        default: return 65;
      }
    })();
    const winH = typeof window !== 'undefined' ? window.innerHeight : 0;
    const presetPx = Math.round(winH * (vh / 100));
    const base = baseHeightPxRef.current || presetPx;
    return Math.min(presetPx, base);
  }, [size]);
  const getMaxHeightPx = useCallback(() => {
    if (typeof maxExpandedHeight === 'number') return maxExpandedHeight;
    if (typeof window === 'undefined') return baseHeightPxRef.current || 0;
    if (typeof maxExpandedHeight === 'string') {
      const str = maxExpandedHeight.replace(/\s+/g, '');
      if (str.endsWith('vh')) {
        const n = parseFloat(str);
        return Math.round((window.innerHeight * n) / 100);
      }
      if (str.endsWith('px')) {
        return Math.round(parseFloat(str));
      }
      // Support calc(100% - 32px)
      const m = str.match(/^calc\(100%-(\d+(?:\.\d+)?)px\)$/i);
      if (m) {
        const px = parseFloat(m[1]);
        return Math.max(0, Math.round(window.innerHeight - px));
      }
    }
    return window.innerHeight;
  }, [maxExpandedHeight]);

  const getMinHeightPx = useCallback(() => {
    // compact height is our min when expansion is used
    return getTargetCompactHeight();
  }, [getTargetCompactHeight]);

  const dragState = useDrawerDrag(
    panelRef as React.RefObject<HTMLElement>,
    side,
    shouldRender && swipeToClose,
    onClose,
    expansionEnabled ? {
      enabled: true,
      getMinHeightPx,
      getMaxHeightPx,
      onUpdateHeight: (h) => setExpandedHeightPx(h),
      getHeaderDockHeightPx: dockHeaderOnClose ? () => headerDockHeightRef.current : undefined,
      onDockHeader: dockHeaderOnClose ? () => setIsHeaderDocked(true) : undefined,
      onUndockHeader: dockHeaderOnClose ? () => setIsHeaderDocked(false) : undefined,
    } : undefined
  );

  if (!portalRef.current || !shouldRender) return null;

  const block = bem('drawer', [
    'mounted',
    isAnimating && 'open',
    isHeaderDocked && 'docked',
    `side-${side}`,
    size === 'fullscreen' ? 'fullscreen' : `size-${size}`,
  ]);

  // Apply advanced drag transforms with elastic scale and progress feedback
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
      {(backdrop && !(side === 'top' || side === 'bottom') ? true : backdrop && !isHeaderDocked) && (
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
        style={{ ...dragStyle, height: expansionEnabled && ((isHeaderDocked && headerDockHeightRef.current) || expandedHeightPx) ? `${(isHeaderDocked ? headerDockHeightRef.current : expandedHeightPx) ?? ''}px` : undefined }}
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
        {(
          // Always show handle for top/bottom; for left/right show only while dragging
          (side === 'top' || side === 'bottom') || (dragState.isDragging && dragState.progress > 0)
        ) && (
          <div className="drawer__drag-indicator" data-side={side}>
            <div 
              className="drawer__drag-progress" 
              style={{ 
                '--progress': `${Math.min(dragState.progress * 100, 100)}%`,
                '--resistance': 1 - Math.min(Math.max(dragState.progress - 1, 0), 0.2) 
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


