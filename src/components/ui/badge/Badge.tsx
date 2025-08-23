'use client';
import React, { forwardRef, cloneElement, isValidElement } from 'react';

// Badge size variants based on design tokens
export type BadgeSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// Badge variant types
export type BadgeVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'info'
  | 'neutral'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-warning'
  | 'outline-error'
  | 'outline-info'
  | 'outline-neutral';

// Badge shape variants
export type BadgeShape = 'pill' | 'rounded' | 'square';

// Base props for badges
interface BaseBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  removable?: boolean;
  onRemove?: () => void;
}

// Props for regular badge with children
interface RegularBadgeProps extends BaseBadgeProps {
  children: React.ReactNode;
  iconOnly?: false;
  'aria-label'?: string;
}

// Props for icon-only badge (aria-label is mandatory)
interface IconOnlyBadgeProps extends BaseBadgeProps {
  children?: React.ReactNode;
  iconOnly: true;
  'aria-label': string; // Mandatory for icon-only badges
}

// Union type for all badge props
export type BadgeProps = RegularBadgeProps | IconOnlyBadgeProps;

// Helper function to generate BEM classes
const createBemClass = (
  block: string,
  element?: string,
  modifiers?: (string | boolean | undefined)[]
): string => {
  let className = block;
  
  if (element) {
    className += `__${element}`;
  }
  
  if (modifiers && modifiers.length > 0) {
    const validModifiers = modifiers
      .filter(Boolean)
      .map(mod => typeof mod === 'string' ? mod : '')
      .filter(Boolean);
    
    if (validModifiers.length > 0) {
      const baseClass = element ? `${block}__${element}` : block;
      className += ` ${validModifiers.map(mod => `${baseClass}--${mod}`).join(' ')}`;
    }
  }
  
  return className;
};

// Map badge sizes to appropriate icon sizes
const getIconSizeForBadge = (badgeSize: BadgeSize): string => {
  const sizeMap: Record<BadgeSize, string> = {
    'xs': 'xs',   // 10px icon for xs badge
    's': 'sm',    // 12px icon for s badge  
    'm': 'md',    // 14px icon for m badge
    'l': 'lg',    // 16px icon for l badge
    'xl': 'xl',   // 18px icon for xl badge
  };
  
  return sizeMap[badgeSize] || 'md';
};

// Helper function to automatically set icon sizes based on badge size
const processChildren = (children: React.ReactNode, badgeSize: BadgeSize): React.ReactNode => {
  const iconSize = getIconSizeForBadge(badgeSize);
  
  return React.Children.map(children, (child) => {
    // Check if child is a React element and looks like an Icon component
    if (isValidElement(child) && child.type && 
        (typeof child.type === 'function' || typeof child.type === 'object') &&
        (child.type as any).displayName === 'Icon') {
      
      // Type assertion for Icon props
      const iconProps = child.props as any;
      
      // Clone the Icon element with automatic size if not already specified
      return cloneElement(child, {
        size: iconProps.size || iconSize,
        color: iconProps.color || 'inherit',
        ...iconProps
      });
    }
    
    return child;
  });
};

/**
 * Professional Badge Component with BEM Methodology
 * 
 * Features:
 * - Pure BEM class-based styling (no inline CSS)
 * - Design token integration via CSS custom properties
 * - Full accessibility support with mandatory aria-label for icon-only badges
 * - Removable badges with proper semantics
 * - Automatic icon sizing based on badge size
 * - Icon support with flexible positioning
 * - Multiple shape variants (pill, rounded, square)
 * - Responsive and mobile-optimized
 * 
 * @example
 * // ✅ Icon size automatically matches badge size
 * <Badge size="xs">
 *   <Icon name="star" /> Featured  // Icon will be 'xs' size
 * </Badge>
 * 
 * <Badge size="l" variant="success">
 *   <Icon name="check" /> Verified  // Icon will be 'lg' size
 * </Badge>
 * 
 * // ✅ Manual icon size override still works
 * <Badge size="m">
 *   <Icon name="warning" size="h4" /> Alert  // Icon will be 'h4' size
 * </Badge>
 * 
 * // ✅ Icon-only badge with automatic sizing
 * <Badge iconOnly aria-label="New notification" size="xl" variant="error">
 *   <Icon name="bell" />  // Icon will be 'xl' size
 * </Badge>
 * 
 * // ✅ Removable badge
 * <Badge removable onRemove={() => console.log('removed')}>
 *   Tag Name
 * </Badge>
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { 
    variant = 'primary',
    size = 'm',
    shape = 'pill',
    className = '',
    children,
    iconOnly = false,
    removable = false,
    onRemove,
    ...props 
  },
  ref
) {
  // Validate icon-only badges have aria-label
  if (process.env.NODE_ENV === 'development') {
    if (iconOnly && !props['aria-label']) {
      console.error(
        'Badge: Icon-only badges must have an aria-label for accessibility. ' +
        'Please provide an aria-label prop to describe what the badge represents.'
      );
    }
  }
  
  // Process children to automatically set icon sizes
  const processedChildren = processChildren(children, size);
  
  // Generate BEM classes
  const badgeClasses = [
    // BEM base class with modifiers
    createBemClass('badge', undefined, [
      variant,
      size,
      shape,
      iconOnly && 'icon-only',
      removable && 'removable'
    ]),
    
    // Custom className
    className
  ].filter(Boolean).join(' ');

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <span
      ref={ref}
      className={badgeClasses}
      {...props}
    >
      {processedChildren && (
        <span className="badge__content">{processedChildren}</span>
      )}
      
      {removable && (
        <button
          type="button"
          className="badge__remove"
          onClick={handleRemove}
          aria-label="Remove badge"
        >
          <span className="badge__remove-icon">×</span>
        </button>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';

export { Badge };
export default Badge;
