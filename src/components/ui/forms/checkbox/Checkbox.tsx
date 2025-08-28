'use client';
import React, { forwardRef, useState, useCallback, useId } from 'react';

// Checkbox size variants based on design tokens
export type CheckboxSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// Checkbox variant types
export type CheckboxVariant = 'default' | 'error' | 'success' | 'warning';

// Base checkbox props
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Checkbox variant for different states */
  variant?: CheckboxVariant;
  /** Size of the checkbox */
  size?: CheckboxSize;
  /** Label text */
  label?: string;
  /** Helper text shown below checkbox */
  helperText?: string;
  /** Error message - when provided, variant becomes 'error' */
  error?: string;
  /** Success message - when provided, variant becomes 'success' */
  success?: string;
  /** Warning message - when provided, variant becomes 'warning' */
  warning?: string;
  /** Loading state */
  loading?: boolean;
  /** Custom wrapper class name */
  wrapperClassName?: string;
  /** Whether label is required (shows asterisk) */
  required?: boolean;
  /** Indeterminate state */
  indeterminate?: boolean;
  /** Custom icon for checked state */
  checkedIcon?: React.ReactNode;
  /** Custom icon for indeterminate state */
  indeterminateIcon?: React.ReactNode;
}



// Generate unique ID for accessibility


// Default check icon (SVG)
const DefaultCheckIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="checkbox-icon__check"
  >
    <path
      d="M10 3L4.5 8.5L2 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Default indeterminate icon (SVG)
const DefaultIndeterminateIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="checkbox-icon__indeterminate"
  >
    <path
      d="M3 6H9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Professional Checkbox Component with BEM Methodology
 * 
 * Features:
 * - Pure BEM class-based styling (no inline CSS)
 * - Design token integration via CSS custom properties
 * - Full accessibility support with proper ARIA attributes
 * - Multiple variants and states (error, success, warning)
 * - Indeterminate state support
 * - Custom icons support
 * - Loading states
 * - Responsive and mobile-optimized
 * - Label and helper text support
 * - Keyboard navigation support
 * 
 * @example
 * // Basic checkbox
 * <Checkbox 
 *   label="Accept terms and conditions" 
 *   required
 * />
 * 
 * // Checkbox with validation
 * <Checkbox 
 *   label="Subscribe to newsletter"
 *   helperText="You can unsubscribe at any time"
 *   error="Please accept to continue"
 * />
 * 
 * // Indeterminate checkbox
 * <Checkbox 
 *   label="Select all items"
 *   indeterminate={true}
 *   size="l"
 * />
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    variant = 'default',
    size = 'm',
    label,
    helperText,
    error,
    success,
    warning,
    loading = false,
    wrapperClassName = '',
    required = false,
    disabled = false,
    indeterminate = false,
    checkedIcon,
    indeterminateIcon,
    className = '',
    id,
    checked,
    defaultChecked,
    onChange,
    onFocus,
    onBlur,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref
) {
  // State management
  const [focused, setFocused] = useState(false);
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  
  // Use controlled or uncontrolled value
  const isChecked = checked !== undefined ? checked : internalChecked;
  
  // Generate unique IDs for accessibility using React's useId
  const reactId = useId();
  const checkboxId = id || `checkbox-${reactId}`;
  const labelId = `${checkboxId}-label`;
  const helperTextId = `${checkboxId}-helper`;
  const errorId = `${checkboxId}-error`;
  const successId = `${checkboxId}-success`;
  const warningId = `${checkboxId}-warning`;
  
  // Determine actual variant based on props
  const actualVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;
  
  // Handle focus events
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  }, [onFocus]);
  
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  }, [onBlur]);
  
  // Handle change events
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (checked === undefined) {
      setInternalChecked(e.target.checked);
    }
    onChange?.(e);
  }, [onChange, checked]);
  
  // Build aria-describedby
  const describedByIds = [
    ariaDescribedBy,
    helperText && helperTextId,
    error && errorId,
    success && successId,
    warning && warningId
  ].filter(Boolean).join(' ');
  
  // Generate CSS classes with template strings
  const wrapperClasses = [
    'checkbox-wrapper',
    actualVariant && `checkbox-wrapper--${actualVariant}`,
    size && `checkbox-wrapper--${size}`,
    disabled && 'checkbox-wrapper--disabled',
    focused && 'checkbox-wrapper--focused',
    loading && 'checkbox-wrapper--loading',
    isChecked && 'checkbox-wrapper--checked',
    indeterminate && 'checkbox-wrapper--indeterminate',
    wrapperClassName
  ].filter(Boolean).join(' ');
  
  const checkboxClasses = [
    'checkbox',
    actualVariant && `checkbox--${actualVariant}`,
    size && `checkbox--${size}`,
    disabled && 'checkbox--disabled',
    focused && 'checkbox--focused',
    loading && 'checkbox--loading',
    isChecked && 'checkbox--checked',
    indeterminate && 'checkbox--indeterminate',
    className
  ].filter(Boolean).join(' ');
  
  const controlClasses = [
    'checkbox-control',
    actualVariant && `checkbox-control--${actualVariant}`,
    size && `checkbox-control--${size}`,
    disabled && 'checkbox-control--disabled',
    focused && 'checkbox-control--focused',
    loading && 'checkbox-control--loading',
    isChecked && 'checkbox-control--checked',
    indeterminate && 'checkbox-control--indeterminate'
  ].filter(Boolean).join(' ');
  
  return (
    <div className={wrapperClasses}>
      {/* Checkbox Control */}
      <div className="checkbox-field">
        <div className={controlClasses}>
          {/* Hidden Input */}
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={checkboxClasses}
            disabled={disabled || loading}
            checked={isChecked}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={actualVariant === 'error' ? 'true' : undefined}
            aria-describedby={describedByIds || undefined}
            aria-labelledby={label ? labelId : undefined}
            {...props}
          />
          
          {/* Visual Checkbox */}
          <div className="checkbox-control__box">
            {/* Loading Spinner */}
            {loading && (
              <span className="checkbox-control__spinner" aria-hidden="true">
                <span className="checkbox-control__spinner-icon"></span>
              </span>
            )}
            
            {/* Check/Indeterminate Icon */}
            {!loading && (isChecked || indeterminate) && (
              <span className="checkbox-control__icon" aria-hidden="true">
                {indeterminate 
                  ? (indeterminateIcon || <DefaultIndeterminateIcon />)
                  : (checkedIcon || <DefaultCheckIcon />)
                }
              </span>
            )}
          </div>
        </div>
        
        {/* Label */}
        {label && (
          <label 
            htmlFor={checkboxId}
            id={labelId}
            className={[
              'checkbox-label',
              actualVariant && `checkbox-label--${actualVariant}`,
              size && `checkbox-label--${size}`,
              disabled && 'checkbox-label--disabled',
              required && 'checkbox-label--required'
            ].filter(Boolean).join(' ')}
          >
            {label}
            {required && (
              <span className="checkbox-label__required" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
      </div>
      
      {/* Helper Text / Messages */}
      <div className="checkbox-messages">
        {/* Error Message */}
        {error && (
          <span 
            id={errorId}
            className="checkbox-message checkbox-message--error"
            role="alert"
            aria-live="polite"
          >
            {error}
          </span>
        )}
        
        {/* Success Message */}
        {success && !error && (
          <span 
            id={successId}
            className="checkbox-message checkbox-message--success"
            role="status"
            aria-live="polite"
          >
            {success}
          </span>
        )}
        
        {/* Warning Message */}
        {warning && !error && !success && (
          <span 
            id={warningId}
            className="checkbox-message checkbox-message--warning"
            role="alert"
            aria-live="polite"
          >
            {warning}
          </span>
        )}
        
        {/* Helper Text */}
        {helperText && !error && !success && !warning && (
          <span 
            id={helperTextId}
            className="checkbox-message checkbox-message--helper"
          >
            {helperText}
          </span>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
export default Checkbox;
