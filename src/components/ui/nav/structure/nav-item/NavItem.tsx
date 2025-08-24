'use client';
import React, { forwardRef } from 'react';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import './NavItem.scss';

export interface NavItemProps {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  as?: 'a' | 'button' | 'div';
  variant?: 'default' | 'ghost' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  badge?: string | number;
  badgeVariant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  external?: boolean;
  target?: string;
  rel?: string;
  onClick?: (event: React.MouseEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  'aria-label'?: string;
  'aria-current'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  role?: string;
  tabIndex?: number;
}

export const NavItem = forwardRef<
  HTMLAnchorElement | HTMLButtonElement | HTMLDivElement,
  NavItemProps
>(({
  children,
  className = '',
  href,
  as,
  variant = 'default',
  size = 'md',
  active = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  badge,
  badgeVariant = 'default',
  external = false,
  target,
  rel,
  onClick,
  onKeyDown,
  'aria-label': ariaLabel,
  'aria-current': ariaCurrent,
  'aria-expanded': ariaExpanded,
  'aria-haspopup': ariaHaspopup,
  role,
  tabIndex,
  ...rest
}, ref) => {
  // Determine the component type
  const Component = as || (href ? 'a' : 'button');
  
  // Handle click events
  const handleClick = (event: React.MouseEvent) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled || loading) {
      return;
    }
    
    // Handle Enter and Space for button-like behavior
    if (Component !== 'a' && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick?.(event as any);
    }
    
    onKeyDown?.(event);
  };

  // Build class names
  const navItemClasses = [
    'nav-item',
    `nav-item--${variant}`,
    `nav-item--${size}`,
    active && 'nav-item--active',
    disabled && 'nav-item--disabled',
    loading && 'nav-item--loading',
    external && 'nav-item--external',
    icon && `nav-item--icon-${iconPosition}`,
    className
  ].filter(Boolean).join(' ');

  // Build props for the component
  const componentProps: any = {
    className: navItemClasses,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    'aria-label': ariaLabel,
    'aria-current': active ? (ariaCurrent || 'page') : undefined,
    'aria-expanded': ariaExpanded,
    'aria-haspopup': ariaHaspopup,
    'aria-disabled': disabled,
    role,
    tabIndex: disabled ? -1 : tabIndex,
    ref,
    ...rest
  };

  // Add href-specific props for links
  if (Component === 'a' && href) {
    componentProps.href = href;
    componentProps.target = external ? '_blank' : target;
    componentProps.rel = external ? 'noopener noreferrer' : rel;
  }

  // Add button-specific props
  if (Component === 'button') {
    componentProps.type = 'button';
    componentProps.disabled = disabled || loading;
  }

  return (
    <Component {...componentProps}>
      {/* Loading spinner */}
      {loading && (
        <Icon 
          name="loader" 
          className="nav-item__spinner" 
          aria-hidden="true"
        />
      )}

      {/* Left icon */}
      {icon && iconPosition === 'left' && !loading && (
        <Icon 
          name={icon} 
          className="nav-item__icon nav-item__icon--left"
          aria-hidden="true"
        />
      )}

      {/* Content */}
      {children && (
        <span className="nav-item__content">
          {children}
        </span>
      )}

      {/* Right icon */}
      {icon && iconPosition === 'right' && !loading && (
        <Icon 
          name={icon} 
          className="nav-item__icon nav-item__icon--right"
          aria-hidden="true"
        />
      )}

      {/* External link icon */}
      {external && (
        <Icon 
          name="external-link" 
          className="nav-item__external-icon"
          aria-hidden="true"
        />
      )}

      {/* Badge */}
      {badge && (
        <Badge 
          variant={badgeVariant}
          size="sm"
          className="nav-item__badge"
        >
          {badge}
        </Badge>
      )}

      {/* Shine effect overlay */}
      <span className="nav-item__shine" aria-hidden="true" />
    </Component>
  );
});

NavItem.displayName = 'NavItem';

export default NavItem;
