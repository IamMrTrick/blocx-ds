'use client';
import React, { useEffect, useState, forwardRef } from 'react';
import type { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

// Use all available icons from lucide-react
export type IconName = keyof typeof dynamicIconImports;

// Icon aliases for common icon names (optional)
const iconAliases: Partial<Record<string, IconName>> = {
  'trash': 'trash-2',
  'share': 'share-2',
  'alert': 'alert-circle',
  'help': 'help-circle',
  'eye-off': 'eye-off',
  'cart': 'shopping-cart',
  'credit-card': 'credit-card',
  'external-link': 'external-link',
  'arrow-left': 'arrow-left',
  'arrow-right': 'arrow-right',
  'arrow-up': 'arrow-up',
  'arrow-down': 'arrow-down',
  'refresh': 'refresh-cw',
  'more-horizontal': 'more-horizontal',
  'more-vertical': 'more-vertical',
  'bell-off': 'bell-off',
  'wifi-off': 'wifi-off',
  'volume': 'volume-2',
  'volume-off': 'volume-x',
  'stop': 'square',
  'skip-back': 'skip-back',
  'skip-forward': 'skip-forward',
};

// Icon size variants based on typography tokens
export type IconSize = 
  | 'xxs'    // 8px  - matches --text-xxs-size
  | 'xs'     // 10px - matches --text-xs-size  
  | 'sm'     // 12px - matches --text-sm-size
  | 'md'     // 14px - matches --text-md-size
  | 'lg'     // 16px - matches --text-lg-size
  | 'xl'     // 18px - matches --text-xl-size
  | 'h6'     // 18px - matches --heading-06-size
  | 'h5'     // 20px - matches --heading-05-size
  | 'h4'     // 24px - matches --heading-04-size
  | 'h3'     // 28px - matches --heading-03-size
  | 'h2'     // 36px - matches --heading-02-size
  | 'h1';    // 48px - matches --heading-01-size

// Icon color variants based on design tokens
export type IconColor =
  | 'primary'    // --icon-primary
  | 'secondary'  // --icon-secondary
  | 'tertiary'   // --icon-tertiary
  | 'disabled'   // --icon-disabled
  | 'accent'     // --icon-accent
  | 'success'    // --icon-success
  | 'warning'    // --icon-warning
  | 'error'      // --icon-error
  | 'info'       // --icon-info
  | 'inherit';   // currentColor

export interface IconProps extends Omit<LucideProps, 'ref' | 'size' | 'color'> {
  name: IconName | string; // Allow using alias names
  size?: IconSize | number | string; // Token-based sizes or custom
  color?: IconColor | string; // Token-based colors or custom
  fallback?: React.ReactNode; // Display during loading
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}



/**
 * Optimized Icon component with Dynamic Loading & Design Tokens
 * Features:
 * - Dynamic Loading (only needed icons are loaded)
 * - Ultra-light initial bundle
 * - Full TypeScript support
 * - Design token integration for consistent sizing & colors
 * - Alias names for ease of use
 * - Complete Accessibility
 * - Preloading capability
 * - Automatic 'icon' class application with default size and color
 * - Direct CSS token integration (no hardcoded values)
 * 
 * @example
 * // Simple usage with defaults (generates: class="icon icon-lg icon-inherit")
 * <Icon name="star" />
 * 
 * // Custom size and color via utility classes
 * <Icon name="heart" size="h4" color="primary" />
 * // Generates: class="icon icon-h4 icon-primary"
 * 
 * // Typography-based sizing
 * <Icon name="settings" size="md" color="secondary" />
 * // Generates: class="icon icon-md icon-secondary"
 * 
 * // Additional classes can still be added
 * <Icon name="user" size="lg" color="accent" className="custom-class" />
 * // Generates: class="icon icon-lg icon-accent custom-class"
 */
const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { 
    name, 
    fallback = null, 
    'aria-label': ariaLabel, 
    'aria-hidden': ariaHidden,
    size = 'lg', // Default to text-lg (16px)
    color = 'inherit', // Default to currentColor via token
    strokeWidth = 2,
    className,
    ...props 
  },
  ref
) {
  const [IconComponent, setIconComponent] = useState<React.ComponentType<LucideProps> | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    
    // Check alias names
    const resolvedName = iconAliases[name as string] ?? (name as IconName);
    
    // Check if icon exists
    if (!dynamicIconImports[resolvedName]) {
      console.warn(`Icon "${name}" (resolved: "${resolvedName}") not found in lucide-react`);
      if (mounted) setError(true);
      return;
    }

    // Load icon dynamically
    dynamicIconImports[resolvedName]()
      .then((iconModule) => {
        if (mounted) {
          setIconComponent(() => iconModule.default);
          setError(false);
        }
      })
      .catch((err) => {
        console.error(`Failed to load icon "${name}":`, err);
        if (mounted) {
          setError(true);
          setIconComponent(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, [name]);

  // Setup accessibility
  const hidden = ariaHidden ?? (ariaLabel ? undefined : true);

  // Show fallback during loading or error
  if (!IconComponent || error) {
    return <>{fallback}</>;
  }

  // Build utility classes from props
  const sizeClass = `icon-${size}`;
  const colorClass = `icon-${color}`;
  
  // Always include base 'icon' class, size and color utilities, then add any additional classes
  const iconClasses = [
    'icon',
    sizeClass,
    colorClass,
    className
  ].filter(Boolean).join(' ');
  
  // Always use utility classes - no inline styles needed
  const mergedStyle = props.style;

  return (
    <IconComponent
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      aria-hidden={hidden}
      size={undefined} // Let CSS utilities handle sizing
      color={undefined} // Let CSS utilities handle coloring
      strokeWidth={strokeWidth}
      className={iconClasses}
      style={mergedStyle}
      {...props}
    />
  );
});

/**
 * Helper function to preload icons
 * Usage: preloadIcon('search') - for warm-up
 */
export const preloadIcon = (name: IconName | string): void => {
  const resolvedName = iconAliases[name as string] ?? (name as IconName);
  if (dynamicIconImports[resolvedName]) {
    dynamicIconImports[resolvedName]().catch(() => {
      // Ignore errors, this is just for preloading
    });
  }
};

// Add display name for debugging
Icon.displayName = 'Icon';

// Exports
export { Icon };
export default Icon;
