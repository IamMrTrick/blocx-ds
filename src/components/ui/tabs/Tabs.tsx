'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { IconName } from '../icon';
import { Icon } from '../icon';
import './Tabs.scss';

type TabsOrientation = 'horizontal' | 'vertical';
type TabsVariant = 'underline' | 'contained' | 'pill';

interface TabsContextValue {
  value: string | null;
  setValue: (next: string) => void;
  orientation: TabsOrientation;
  registerTab: (id: string, ref: HTMLButtonElement | null, disabled: boolean) => void;
  unregisterTab: (id: string) => void;
  focusNext: (currentId: string) => void;
  focusPrev: (currentId: string) => void;
  focusFirst: () => void;
  focusLast: () => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (next: string) => void;
  orientation?: TabsOrientation;
  variant?: TabsVariant;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  defaultValue,
  onChange,
  orientation = 'horizontal',
  variant = 'underline',
  id,
  className = '',
  children
}) => {
  const isControlled = typeof value === 'string';
  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultValue ?? null);
  const current = isControlled ? (value ?? null) : uncontrolled;

  const itemOrderRef = useRef<string[]>([]);
  const itemRefs = useRef<Record<string, { ref: HTMLButtonElement | null; disabled: boolean }>>({});

  const setValue = useCallback((next: string) => {
    if (isControlled) {
      onChange?.(next);
    } else {
      setUncontrolled(next);
      onChange?.(next);
    }
  }, [isControlled, onChange]);

  const registerTab = useCallback((id: string, ref: HTMLButtonElement | null, disabled: boolean) => {
    if (!itemOrderRef.current.includes(id)) {
      itemOrderRef.current.push(id);
    }
    itemRefs.current[id] = { ref, disabled };
  }, []);

  const unregisterTab = useCallback((id: string) => {
    itemOrderRef.current = itemOrderRef.current.filter(x => x !== id);
    delete itemRefs.current[id];
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
      const id = order[i];
      const info = itemRefs.current[id];
      if (info && !info.disabled && info.ref) {
        info.ref.focus();
        break;
      }
    }
  }, []);

  const focusLast = useCallback(() => {
    const order = itemOrderRef.current;
    for (let i = order.length - 1; i >= 0; i--) {
      const id = order[i];
      const info = itemRefs.current[id];
      if (info && !info.disabled && info.ref) {
        info.ref.focus();
        break;
      }
    }
  }, []);

  const valueMemo = useMemo<TabsContextValue>(() => ({
    value: current,
    setValue,
    orientation,
    registerTab,
    unregisterTab,
    focusNext,
    focusPrev,
    focusFirst,
    focusLast,
  }), [current, setValue, orientation, registerTab, unregisterTab, focusNext, focusPrev, focusFirst, focusLast]);

  const classes = useMemo(() => [
    'tabs',
    orientation === 'vertical' && 'tabs--vertical',
    `tabs--${variant}`,
    className
  ].filter(Boolean).join(' '), [orientation, variant, className]);

  return (
    <div className={classes} id={id} data-orientation={orientation}>
      <TabsContext.Provider value={valueMemo}>
        {children}
      </TabsContext.Provider>
    </div>
  );
};

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  ariaLabel?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ ariaLabel, className = '', children, ...rest }) => {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={["tabs__list", className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
};

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tabId: string;
  icon?: IconName | string;
  iconPosition?: 'start' | 'end';
  'aria-label'?: string; // Required if icon-only
}

export const Tab: React.FC<TabProps> = ({
  tabId,
  icon,
  iconPosition = 'start',
  children,
  className = '',
  disabled = false,
  ...rest
}) => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tab must be used within Tabs');
  const { value, setValue, orientation, registerTab, unregisterTab, focusNext, focusPrev, focusFirst, focusLast } = ctx;

  const selected = value === tabId;
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    registerTab(tabId, ref.current, disabled);
    return () => unregisterTab(tabId);
  }, [tabId, disabled, registerTab, unregisterTab]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const isHorizontal = orientation === 'horizontal';
    switch (e.key) {
      case 'ArrowRight':
        if (isHorizontal) { e.preventDefault(); focusNext(tabId); }
        break;
      case 'ArrowLeft':
        if (isHorizontal) { e.preventDefault(); focusPrev(tabId); }
        break;
      case 'ArrowDown':
        if (!isHorizontal) { e.preventDefault(); focusNext(tabId); }
        break;
      case 'ArrowUp':
        if (!isHorizontal) { e.preventDefault(); focusPrev(tabId); }
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
        if (!disabled) setValue(tabId);
        break;
      default:
        break;
    }
  }, [orientation, tabId, disabled, focusNext, focusPrev, focusFirst, focusLast, setValue]);

  const classes = [
    'tabs__tab',
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <span className="tabs__icon" aria-hidden="true">
        <Icon name={icon as IconName} size="md" color="inherit" />
      </span>
    );
  };

  return (
    <button
      ref={ref}
      role="tab"
      id={`${tabId}-tab`}
      aria-controls={`${tabId}-panel`}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      tabIndex={selected ? 0 : -1}
      className={classes}
      onKeyDown={onKeyDown}
      onClick={() => !disabled && setValue(tabId)}
      {...rest}
    >
      {icon && iconPosition === 'start' && renderIcon()}
      <span className="tabs__label">{children}</span>
      {icon && iconPosition === 'end' && renderIcon()}
    </button>
  );
};

export interface TabsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  tabId: string;
  children: React.ReactNode;
}

export const TabsPanel: React.FC<TabsPanelProps> = ({ tabId, className = '', children, ...rest }) => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsPanel must be used within Tabs');
  const { value } = ctx;
  const selected = value === tabId;
  return (
    <div
      role="tabpanel"
      id={`${tabId}-panel`}
      aria-labelledby={`${tabId}-tab`}
      hidden={!selected}
      className={["tabs__panel", className].filter(Boolean).join(' ')}
      {...rest}
    >
      {selected ? children : null}
    </div>
  );
};

Tabs.displayName = 'Tabs';
Tab.displayName = 'Tab';
TabsList.displayName = 'TabsList';
TabsPanel.displayName = 'TabsPanel';

export default Tabs;


