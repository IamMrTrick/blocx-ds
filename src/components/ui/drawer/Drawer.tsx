'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import './Drawer.scss';

type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
type DrawerSize = 's' | 'm' | 'l' | 'xl' | 'fullscreen';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  size?: DrawerSize;
  swipeToClose?: boolean;
  dismissible?: boolean;
  backdrop?: boolean;
  trapFocus?: boolean;
  className?: string;
  backdropClassName?: string;
  panelClassName?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

function bem(block: string, modifiers: Array<string | false | undefined>) {
  const base = block;
  const mods = modifiers.filter(Boolean).map(mod => `${base}--${mod}`);
  return [base, ...mods].join(' ');
}

function useLockBodyScroll(active: boolean) {
  useLayoutEffect(() => {
    if (!active) return;
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = originalOverflow;
    };
  }, [active]);
}

function useFocusTrap(containerRef: React.RefObject<HTMLElement>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ].join(',');

    const getFocusable = () => Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors))
      .filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1 && !el.hasAttribute('inert'));

    const focusables = getFocusable();
    const toFocus = focusables[0] || container;
    toFocus?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const list = getFocusable();
      if (list.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, active]);
}

// Map default bottom-sheet heights by size (must mirror Drawer.scss)
const BOTTOM_SHEET_BASE_HEIGHT_VH: Record<Exclude<DrawerSize, 'fullscreen'>, number> = {
  s: 55,
  m: 65,
  l: 75,
  xl: 88,
};

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  side = 'right',
  size = 'm',
  swipeToClose = true,
  dismissible = true,
  backdrop = true,
  trapFocus = false,
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Bottom-sheet behavior flags
  const isBottomSheet = side === 'bottom' && size !== 'fullscreen';
  const maxSheetHeightVh = 90; // requested max height
  const baseSheetHeightVh = useMemo(() => {
    if (!isBottomSheet) return 0;
    return BOTTOM_SHEET_BASE_HEIGHT_VH[size as Exclude<DrawerSize, 'fullscreen'>] ?? 65;
  }, [isBottomSheet, size]);

  // State for expansion and scroll gating
  const [isExpandedSheet, setIsExpandedSheet] = useState(false);
  const [sheetScrollState, setSheetScrollState] = useState<'locked' | 'free'>(isBottomSheet ? 'locked' : 'free');
  const [inlinePanelHeightVh, setInlinePanelHeightVh] = useState<number | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPointRef = useRef<number>(0);
  const dragDeltaRef = useRef<number>(0); // positive == closing direction (down for bottom)
  const isActiveDragRef = useRef<boolean>(false);
  const lastMoveTsRef = useRef<number>(0);
  const lastMoveDeltaRef = useRef<number>(0);
  const startedOnScrollableRef = useRef<boolean>(false);

  // Create portal root
  useEffect(() => {
    let root = document.getElementById('drawer-root');
    if (!root) {
      root = document.createElement('div');
      root.setAttribute('id', 'drawer-root');
      document.body.appendChild(root);
    }
    portalRef.current = root as HTMLElement;
  }, []);

  // ESC to close
  useEffect(() => {
    if (!open || !dismissible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, dismissible, onClose]);

  // Lock body scroll while open
  useLockBodyScroll(open);
  // Focus trap
  useFocusTrap(containerRef as React.RefObject<HTMLElement>, open && trapFocus);

  // Reset state when opening/closing
  useEffect(() => {
    if (open) {
      setIsExpandedSheet(false);
      setSheetScrollState(isBottomSheet ? 'locked' : 'free');
      setInlinePanelHeightVh(isBottomSheet ? baseSheetHeightVh : null);
      dragDeltaRef.current = 0;
      isActiveDragRef.current = false;
      setIsDragging(false);
    } else {
      setInlinePanelHeightVh(null);
      setIsExpandedSheet(false);
      setSheetScrollState('free');
    }
  }, [open, isBottomSheet, baseSheetHeightVh]);

  // Helpers
  const axis = side === 'left' || side === 'right' ? 'x' : 'y';

  const getBodyScrollableEl = useCallback((): HTMLElement | null => {
    const panel = panelRef.current;
    if (!panel) return null;
    return panel.querySelector('.drawer__body') as HTMLElement | null;
  }, []);

  const pxToVh = useCallback((px: number) => {
    const vhUnit = window.innerHeight / 100;
    return px / vhUnit;
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeToClose) return;
    if (e.button !== 0) return; // only primary
    const panel = panelRef.current;
    if (!panel) return;

    // Capture to keep events on Android
    try { panel.setPointerCapture?.(e.pointerId); } catch {}

    dragStartPointRef.current = axis === 'x' ? e.clientX : e.clientY;
    dragDeltaRef.current = 0;
    lastMoveTsRef.current = e.timeStamp;
    lastMoveDeltaRef.current = 0;

    // Determine if started on scrollable area and can scroll
    const body = getBodyScrollableEl();
    const startedOnBody = !!body && body.contains(e.target as Node);
    const bodyScrollTop = startedOnBody && body ? body.scrollTop : 0;
    startedOnScrollableRef.current = startedOnBody && bodyScrollTop > 0 && isBottomSheet && isExpandedSheet;

    isActiveDragRef.current = !startedOnScrollableRef.current;
    setIsDragging(isActiveDragRef.current);
  }, [axis, swipeToClose, getBodyScrollableEl, isBottomSheet, isExpandedSheet]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeToClose) return;
    const panel = panelRef.current;
    if (!panel) return;

    const start = dragStartPointRef.current;
    const currentPoint = axis === 'x' ? e.clientX : e.clientY;
    const delta = (currentPoint - start) * (axis === 'x' ? (side === 'right' ? 1 : -1) : (side === 'bottom' ? 1 : -1));
    // Now, positive delta means moving toward closing direction regardless of side
    dragDeltaRef.current = delta;

    // Decide to intercept from scroll if user drags toward close and scroll is at top
    if (!isActiveDragRef.current && startedOnScrollableRef.current) {
      const body = getBodyScrollableEl();
      const canIntercept = body && body.scrollTop <= 0 && delta > 0; // pulling down to close
      if (canIntercept) {
        isActiveDragRef.current = true;
        setIsDragging(true);
        // Lock internal scroll while dragging
        setSheetScrollState('locked');
      } else {
        return; // let it scroll
      }
    }

    if (isActiveDragRef.current) {
      // Prevent default scroll while dragging for Android consistency
      if (typeof e.preventDefault === 'function') e.preventDefault();
      lastMoveDeltaRef.current = delta;
      lastMoveTsRef.current = e.timeStamp;

      // Handle bottom-sheet specific expansion logic
      if (isBottomSheet) {
        // delta > 0 => moving down to close; delta < 0 => moving up (expand)
        if (!isExpandedSheet && delta < 0) {
          // Stretch height up to 90vh
          const growVh = pxToVh(Math.abs(delta));
          const nextVh = Math.min(maxSheetHeightVh, baseSheetHeightVh + growVh);
          setInlinePanelHeightVh(nextVh);
          setSheetScrollState(nextVh >= maxSheetHeightVh ? 'free' : 'locked');
        } else if (isExpandedSheet && delta < 0) {
          // Wrong direction while expanded (pushing up more) -> show subtle stretch via scale in render
        } else if (isExpandedSheet && delta > 0) {
          // Pulling down from expanded -> candidate to collapse/close. Keep height at max, we translate visually via style
        }
      }

      // Trigger re-render via state change flag
      setIsDragging(true);
    }
  }, [axis, side, swipeToClose, isBottomSheet, isExpandedSheet, baseSheetHeightVh, pxToVh, maxSheetHeightVh, getBodyScrollableEl]);

  const onPointerUp = useCallback(() => {
    if (!swipeToClose) return;
    const delta = dragDeltaRef.current;

    // Decide outcome based on state and delta
    if (isBottomSheet) {
      if (!isExpandedSheet) {
        // We were collapsed and possibly expanded by dragging up
        const grownByVh = (inlinePanelHeightVh ?? baseSheetHeightVh) - baseSheetHeightVh;
        const expandedEnough = (baseSheetHeightVh + grownByVh) >= (baseSheetHeightVh + (maxSheetHeightVh - baseSheetHeightVh) * 0.35);
        if (delta < 0 && expandedEnough) {
          setIsExpandedSheet(true);
          setInlinePanelHeightVh(maxSheetHeightVh);
          setSheetScrollState('free');
        } else {
          // Snap back to base height
          setIsExpandedSheet(false);
          setInlinePanelHeightVh(baseSheetHeightVh);
          setSheetScrollState('locked');
        }
      } else {
        // Expanded state: dragging down
        const closeThresholdPx = Math.max(40, window.innerHeight * 0.12);
        const collapseThresholdPx = Math.max(24, window.innerHeight * 0.06);
        if (delta > closeThresholdPx) {
          onClose();
        } else if (delta > collapseThresholdPx) {
          // Collapse back to base height and lock scroll
          setIsExpandedSheet(false);
          setInlinePanelHeightVh(baseSheetHeightVh);
          setSheetScrollState('locked');
        } else {
          // Stay expanded
          setIsExpandedSheet(true);
          setInlinePanelHeightVh(maxSheetHeightVh);
          setSheetScrollState('free');
        }
      }
    } else {
      // Non-bottom sheets: simple close threshold
      const panel = panelRef.current;
      const panelLen = panel ? (axis === 'x' ? panel.offsetWidth : panel.offsetHeight) : 300;
      const shouldClose = delta > panelLen * 0.25;
      if (shouldClose) onClose();
    }

    // Reset drag state
    dragDeltaRef.current = 0;
    isActiveDragRef.current = false;
    setIsDragging(false);
  }, [axis, swipeToClose, isBottomSheet, isExpandedSheet, inlinePanelHeightVh, baseSheetHeightVh, maxSheetHeightVh, onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dismissible) return;
    if (e.target === e.currentTarget) onClose();
  }, [dismissible, onClose]);

  if (!portalRef.current) return null;

  const blockClass = bem('drawer', [
    open && 'open',
    `side-${side}`,
    size === 'fullscreen' ? 'fullscreen' : `size-${size}`,
  ]);

  // Compute dynamic transform and scale while dragging
  const delta = dragDeltaRef.current;
  let transform = '';
  let scaleTransform = '';

  if (isDragging) {
    if (axis === 'y') {
      // Bottom or Top
      const signedDelta = delta * (side === 'bottom' ? 1 : -1); // positive when moving away from open position
      if (signedDelta >= 0) {
        transform = `translate3d(0, ${signedDelta}px, 0)`;
      } else {
        // Wrong-direction stretch feedback using scale
        const stretch = Math.min(Math.abs(signedDelta) / 200, 0.04);
        scaleTransform = ` scale(${1 + stretch})`;
        transform = 'translate3d(0, 0, 0)';
      }
    } else {
      // Left or Right
      const signedDelta = delta * (side === 'right' ? 1 : -1);
      if (signedDelta >= 0) {
        transform = `translate3d(${signedDelta}px, 0, 0)`;
      } else {
        const stretch = Math.min(Math.abs(signedDelta) / 200, 0.04);
        scaleTransform = ` scale(${1 + stretch})`;
        transform = 'translate3d(0, 0, 0)';
      }
    }
  }

  const panelInlineStyle: React.CSSProperties = {};
  if (transform) panelInlineStyle.transform = transform + scaleTransform;
  if (isBottomSheet) {
    const hVh = inlinePanelHeightVh ?? baseSheetHeightVh;
    panelInlineStyle.height = `${hVh}vh`;
    panelInlineStyle.touchAction = (sheetScrollState === 'free' ? 'pan-y' : 'none') as React.CSSProperties["touchAction"];
  }

  const container = (
    <div ref={containerRef} className={[blockClass, className].filter(Boolean).join(' ')} role="presentation">
      {backdrop && (
        <div className={["drawer__backdrop", backdropClassName].filter(Boolean).join(' ')} onClick={handleBackdropClick} />
      )}
      <div
        ref={panelRef}
        className={["drawer__panel", panelClassName].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : ariaLabelledby || `${id}-title`}
        aria-describedby={ariaDescribedby || `${id}-description`}
        data-dragging={isDragging ? 'true' : undefined}
        data-sheet={isBottomSheet ? 'true' : undefined}
        data-sheet-scroll={isBottomSheet ? sheetScrollState : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={panelInlineStyle}
      >
        {/* Drag indicator slot - optional; style controlled by SCSS */}
        <div className="drawer__drag-indicator" data-side={side} aria-hidden>
          <div className="drawer__drag-progress" />
        </div>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(container, portalRef.current);
};

export type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ className, ...props }) => (
  <div className={["drawer__header", className].filter(Boolean).join(' ')} {...props} />
);

export type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement>;
export const DrawerBody: React.FC<DrawerBodyProps> = ({ className, ...props }) => (
  <div className={["drawer__body", className].filter(Boolean).join(' ')} {...props} />
);

export type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement>;
export const DrawerFooter: React.FC<DrawerFooterProps> = ({ className, ...props }) => (
  <div className={["drawer__footer", className].filter(Boolean).join(' ')} {...props} />
);

export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
export const DrawerTitle: React.FC<DrawerTitleProps> = ({ className, as: Tag = 'h2', id, ...props }) => (
  <Tag id={id} className={["drawer__title", className].filter(Boolean).join(' ')} {...props} />
);

export interface DrawerDescriptionProps extends React.HTMLAttributes<HTMLElement> { as?: 'p' | 'div' | 'span' }
export const DrawerDescription: React.FC<DrawerDescriptionProps> = ({ className, as: Tag = 'p', id, ...props }) => (
  <Tag id={id} className={["drawer__description", className].filter(Boolean).join(' ')} {...props} />
);

export default Drawer;

