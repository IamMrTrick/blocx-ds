'use client';
import React, { forwardRef, cloneElement, isValidElement } from 'react';

// Button size variants based on design tokens
export type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// Button variant types
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'ghost'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-warning'
  | 'outline-error';

// Base props for regular buttons
interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  loadingText?: string;
}

// Props for regular button with children
interface RegularButtonProps extends BaseButtonProps {
  children: React.ReactNode;
  iconOnly?: false;
  'aria-label'?: string;
}

// Props for icon-only button (aria-label is mandatory)
interface IconOnlyButtonProps extends BaseButtonProps {
  children?: React.ReactNode;
  iconOnly: true;
  'aria-label': string; // Mandatory for icon-only buttons
}

// Union type for all button props
export type ButtonProps = RegularButtonProps | IconOnlyButtonProps;

// Helper function to generate BEM classes


// Map button sizes to appropriate icon sizes
const getIconSizeForButton = (buttonSize: ButtonSize): string => {
  const sizeMap: Record<ButtonSize, string> = {
    'xs': 'xs',   // 10px icon for xs button
    's': 'sm',    // 12px icon for s button  
    'm': 'md',    // 14px icon for m button
    'l': 'lg',    // 16px icon for l button
    'xl': 'xl',   // 18px icon for xl button
  };
  
  return sizeMap[buttonSize] || 'md';
};

// Helper function to automatically set icon sizes based on button size
const processChildren = (children: React.ReactNode, buttonSize: ButtonSize): React.ReactNode => {
  const iconSize = getIconSizeForButton(buttonSize);
  
  return React.Children.map(children, (child) => {
    // Check if child is a React element and looks like an Icon component
    if (isValidElement(child) && child.type && 
        (typeof child.type === 'function' || typeof child.type === 'object') &&
        ((child.type as unknown as { displayName?: string }).displayName === 'Icon')) {
      
      // Type assertion for Icon props
      const iconProps = child.props as { size?: string; color?: string } & Record<string, unknown>;
      
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
 * Professional Button Component with BEM Methodology
 * 
 * Features:
 * - Pure BEM class-based styling (no inline CSS)
 * - Design token integration via CSS custom properties
 * - Full accessibility support with mandatory aria-label for icon-only buttons
 * - Loading states with proper semantics
 * - Automatic icon sizing based on button size
 * - Icon support with flexible positioning
 * - Responsive and mobile-optimized
 * 
 * @example
 * // ✅ Icon size automatically matches button size
 * <Button size="xs">
 *   <Icon name="plus" /> Add  // Icon will be 'xs' size
 * </Button>
 * 
 * <Button size="l">
 *   <Icon name="download" /> Download  // Icon will be 'lg' size
 * </Button>
 * 
 * // ✅ Manual icon size override still works
 * <Button size="m">
 *   <Icon name="star" size="h4" /> Special  // Icon will be 'h4' size
 * </Button>
 * 
 * // ✅ Icon-only button with automatic sizing
 * <Button iconOnly aria-label="Delete item" size="xl">
 *   <Icon name="trash" />  // Icon will be 'xl' size
 * </Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { 
    variant = 'primary',
    size = 'm',
    className = '',
    children,
    iconOnly = false,
    loading = false,
    fullWidth = false,
    disabled = false,
    loadingText = 'Loading...',
    ...props 
  },
  ref
) {
  // Validate icon-only buttons have aria-label
  if (process.env.NODE_ENV === 'development') {
    if (iconOnly && !props['aria-label']) {
      console.error(
        'Button: Icon-only buttons must have an aria-label for accessibility. ' +
        'Please provide an aria-label prop to describe what the button does.'
      );
    }
  }
  
  // Process children to automatically set icon sizes
  const processedChildren = processChildren(children, size);
  
  // Generate CSS classes with template strings
  const buttonClasses = [
    'btn',
    variant && `btn--${variant}`,
    size && `btn--${size}`,
    iconOnly && 'btn--icon-only',
    loading && 'btn--loading',
    fullWidth && 'btn--full-width',
    disabled && 'btn--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : undefined}
      aria-live={loading ? 'polite' : undefined}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" role="status" aria-label={loadingText}>
          <span className="btn__spinner-icon"></span>
        </span>
      )}
      
      {!loading && processedChildren && (
        <span className="btn__content">{processedChildren}</span>
      )}
      
      {loading && !iconOnly && (
        <span className="btn__content">{loadingText}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export default Button;