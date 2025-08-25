'use client';

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

type ModalSize = 's' | 'm' | 'l' | 'xl' | 'fullscreen';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  scrollable?: boolean;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
  disableBackdropClose?: boolean;
  disableEscClose?: boolean;
  className?: string;
  backdropClassName?: string;
  dialogClassName?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

// Utility to compose BEM classes
const bem = (block: string, modifiers: Array<string | false | undefined>) => {
  const base = block;
  const mods = modifiers.filter(Boolean).map(mod => `${base}--${mod}`);
  return [base, ...mods].join(' ');
};

// Focus trap inside the dialog while open
function useFocusTrap(containerRef: React.RefObject<HTMLElement>, active: boolean, initialFocusRef?: React.RefObject<HTMLElement>) {
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
    const toFocus = initialFocusRef?.current || focusables[0] || container;
    if (toFocus) toFocus.focus();

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
  }, [containerRef, active, initialFocusRef]);
}

// Prevent background scroll while modal open
function useLockBodyScroll(active: boolean) {
  useLayoutEffect(() => {
    if (!active) return;
    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = original; };
  }, [active]);
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = 'm',
  scrollable = false,
  children,
  initialFocusRef,
  disableBackdropClose = false,
  disableEscClose = false,
  className,
  backdropClassName,
  dialogClassName,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}) => {
  const id = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const portalElementRef = useRef<HTMLElement | null>(null);

  // Create portal root if missing
  useEffect(() => {
    let root = document.getElementById('modal-root');
    if (!root) {
      root = document.createElement('div');
      root.setAttribute('id', 'modal-root');
      document.body.appendChild(root);
    }
    portalElementRef.current = root as HTMLElement;
  }, []);

  // ESC to close
  useEffect(() => {
    if (!open || disableEscClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, disableEscClose, onClose]);

  // Focus trap and lock scroll
  useFocusTrap(dialogRef as React.RefObject<HTMLElement>, open, initialFocusRef);
  useLockBodyScroll(open);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disableBackdropClose) return;
    if (e.target === e.currentTarget) onClose();
  }, [disableBackdropClose, onClose]);

  if (!portalElementRef.current) return null;

  const blockClass = bem('modal', [
    open && 'open',
    scrollable && 'scrollable',
    size === 'fullscreen' ? 'fullscreen' : `size-${size}`,
  ]);

  const container = (
    <div className={[blockClass, className].filter(Boolean).join(' ')} role="presentation">
      <div className={["modal__backdrop", backdropClassName].filter(Boolean).join(' ')} onClick={handleBackdropClick} />
      <div
        ref={dialogRef}
        className={["modal__dialog", dialogClassName].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : ariaLabelledby || `${id}-title`}
        aria-describedby={ariaDescribedby || `${id}-description`}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(container, portalElementRef.current);
};

export type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export const ModalHeader: React.FC<ModalHeaderProps> = ({ className, ...props }) => (
  <div className={["modal__header", className].filter(Boolean).join(' ')} {...props} />
);

export type ModalBodyProps = React.HTMLAttributes<HTMLDivElement>;
export const ModalBody: React.FC<ModalBodyProps> = ({ className, ...props }) => (
  <div className={["modal__body", className].filter(Boolean).join(' ')} {...props} />
);

export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;
export const ModalFooter: React.FC<ModalFooterProps> = ({ className, ...props }) => (
  <div className={["modal__footer", className].filter(Boolean).join(' ')} {...props} />
);

export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { as?: keyof React.JSX.IntrinsicElements }
export const ModalTitle: React.FC<ModalTitleProps> = ({ className, as: Tag = 'h2', id, ...props }) => (
  <Tag id={id} className={["modal__title", className].filter(Boolean).join(' ')} {...props as any /* eslint-disable-line @typescript-eslint/no-explicit-any */} />
);

export interface ModalDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> { as?: keyof React.JSX.IntrinsicElements }
export const ModalDescription: React.FC<ModalDescriptionProps> = ({ className, as: Tag = 'p', id, ...props }) => (
  <Tag id={id} className={["modal__description", className].filter(Boolean).join(' ')} {...props as any /* eslint-disable-line @typescript-eslint/no-explicit-any */} />
);

export interface ModalCloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { label?: string }
export const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({ className, label = 'Close', ...props }) => (
  <button type="button" className={["modal__close", className].filter(Boolean).join(' ')} aria-label={label} {...props} />
);

export default Modal;


