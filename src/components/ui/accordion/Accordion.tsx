'use client';
import React, { createContext, useCallback, useContext, useId, useMemo, useRef, useState, useEffect } from 'react';
import type { IconName } from '../icon';
import { Icon } from '../icon';
import './Accordion.scss';

type AccordionVariant = 'contained' | 'outline' | 'ghost';

interface AccordionContextValue {
  openIds: Set<string>;
  toggleItem: (id: string) => void;
  isItemOpen: (id: string) => boolean;
  allowMultiple: boolean;
  registerItem: (id: string, ref: HTMLButtonElement | null, disabled: boolean) => void;
  unregisterItem: (id: string) => void;
  focusNext: (currentId: string) => void;
  focusPrev: (currentId: string) => void;
  focusFirst: () => void;
  focusLast: () => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  children: React.ReactNode;
  variant?: AccordionVariant;
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  openItems?: string[];
  onChange?: (openIds: string[]) => void;
  className?: string;
  id?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  variant = 'contained',
  allowMultiple = true,
  defaultOpenItems,
  openItems,
  onChange,
  className = '',
  id,
}) => {
  const isControlled = Array.isArray(openItems);
  const [uncontrolledOpen, setUncontrolledOpen] = useState<Set<string>>(
    () => new Set(defaultOpenItems ?? [])
  );

  const openSet = useMemo(() => new Set(isControlled ? openItems : Array.from(uncontrolledOpen)), [isControlled, openItems, uncontrolledOpen]);

  const itemOrderRef = useRef<string[]>([]);
  const itemRefs = useRef<Record<string, { ref: HTMLButtonElement | null; disabled: boolean }>>({});

  const setOpen = useCallback((next: Set<string>) => {
    if (isControlled) {
      onChange?.(Array.from(next));
    } else {
      setUncontrolledOpen(new Set(next));
      onChange?.(Array.from(next));
    }
  }, [isControlled, onChange]);

  const toggleItem = useCallback((idToToggle: string) => {
    const next = new Set(openSet);
    if (next.has(idToToggle)) {
      next.delete(idToToggle);
    } else {
      if (!allowMultiple) {
        next.clear();
      }
      next.add(idToToggle);
    }
    setOpen(next);
  }, [openSet, allowMultiple, setOpen]);

  const isItemOpen = useCallback((checkId: string) => openSet.has(checkId), [openSet]);

  const registerItem = useCallback((itemId: string, ref: HTMLButtonElement | null, disabled: boolean) => {
    if (!itemOrderRef.current.includes(itemId)) {
      itemOrderRef.current.push(itemId);
    }
    itemRefs.current[itemId] = { ref, disabled };
  }, []);

  const unregisterItem = useCallback((itemId: string) => {
    itemOrderRef.current = itemOrderRef.current.filter(id => id !== itemId);
    delete itemRefs.current[itemId];
  }, []);

  const focusNext = useCallback((currentId: string) => {
    const order = itemOrderRef.current;
    const currentIndex = order.indexOf(currentId);
    for (let i = 1; i <= order.length; i++) {
      const nextIndex = (currentIndex + i) % order.length;
      const nextId = order[nextIndex];
      const info = itemRefs.current[nextId];
      if (info && !info.disabled && info.ref) {
        info.ref.focus();
        break;
      }
    }
  }, []);

  const focusPrev = useCallback((currentId: string) => {
    const order = itemOrderRef.current;
    const currentIndex = order.indexOf(currentId);
    for (let i = 1; i <= order.length; i++) {
      const prevIndex = (currentIndex - i + order.length) % order.length;
      const prevId = order[prevIndex];
      const info = itemRefs.current[prevId];
      if (info && !info.disabled && info.ref) {
        info.ref.focus();
        break;
      }
    }
  }, []);

  const focusFirst = useCallback(() => {
    const order = itemOrderRef.current;
    for (let i = 0; i < order.length; i++) {
      const idAt = order[i];
      const info = itemRefs.current[idAt];
      if (info && !info.disabled && info.ref) {
        info.ref.focus();
        break;
      }
    }
  }, []);

  const focusLast = useCallback(() => {
    const order = itemOrderRef.current;
    for (let i = order.length - 1; i >= 0; i--) {
      const idAt = order[i];
      const info = itemRefs.current[idAt];
      if (info && !info.disabled && info.ref) {
        info.ref.focus();
        break;
      }
    }
  }, []);

  const value = useMemo<AccordionContextValue>(() => ({
    openIds: openSet,
    toggleItem,
    isItemOpen,
    allowMultiple,
    registerItem,
    unregisterItem,
    focusNext,
    focusPrev,
    focusFirst,
    focusLast,
  }), [openSet, toggleItem, isItemOpen, allowMultiple, registerItem, unregisterItem, focusNext, focusPrev, focusFirst, focusLast]);

  const classes = useMemo(() => [
    'accordion',
    `accordion--${variant}`,
    className
  ].filter(Boolean).join(' '), [variant, className]);

  return (
    <div className={classes} id={id} data-allow-multiple={allowMultiple ? 'true' : 'false'}>
      <AccordionContext.Provider value={value}>
        {children}
      </AccordionContext.Provider>
    </div>
  );
};

export interface AccordionItemProps {
  itemId: string;
  title: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: IconName | string;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  itemId,
  title,
  children,
  disabled = false,
  icon = 'chevron-down',
  className = ''
}) => {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error('AccordionItem must be used within Accordion');
  }
  const { isItemOpen, toggleItem, registerItem, unregisterItem, focusNext, focusPrev, focusFirst, focusLast } = ctx;

  const open = isItemOpen(itemId);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const ids = useMemo(() => {
    return {
      triggerId: `${itemId}-trigger`,
      panelId: `${itemId}-panel`,
    } as const;
  }, [itemId]);

  useEffect(() => {
    registerItem(itemId, triggerRef.current, disabled);
    return () => unregisterItem(itemId);
  }, [itemId, disabled, registerItem, unregisterItem]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusNext(itemId);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusPrev(itemId);
        break;
      case 'Home':
        e.preventDefault();
        focusFirst();
        break;
      case 'End':
        e.preventDefault();
        focusLast();
        break;
      case 'Enter':
      case ' ': // Space
        e.preventDefault();
        if (!disabled) toggleItem(itemId);
        break;
      default:
        break;
    }
  }, [disabled, itemId, focusNext, focusPrev, focusFirst, focusLast, toggleItem]);

  const itemClasses = [
    'accordion__item',
    open && 'accordion__item--open',
    disabled && 'accordion__item--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={itemClasses} data-state={open ? 'open' : 'closed'}>
      <h3 className="accordion__header">
        <button
          ref={triggerRef}
          id={ids.triggerId}
          className="accordion__trigger"
          type="button"
          aria-expanded={open}
          aria-controls={ids.panelId}
          aria-disabled={disabled || undefined}
          onClick={() => !disabled && toggleItem(itemId)}
          onKeyDown={onKeyDown}
        >
          <span className="accordion__title">{title}</span>
          <span className="accordion__icon" aria-hidden="true">
            <Icon name={icon} size="lg" color="inherit" />
          </span>
        </button>
      </h3>
      <div
        id={ids.panelId}
        role="region"
        aria-labelledby={ids.triggerId}
        aria-hidden={!open}
        className="accordion__panel"
      >
        <div className="accordion__panel-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';

export default Accordion;


