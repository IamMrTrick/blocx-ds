'use client';
import React, { forwardRef, useState, useCallback, useId } from 'react';

// Input size variants based on design tokens
export type InputSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// Input variant types
export type InputVariant = 'default' | 'error' | 'success' | 'warning';

// Input types
export type InputType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'url' 
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local';

// Base input props
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Input variant for different states */
  variant?: InputVariant;
  /** Size of the input */
  size?: InputSize;
  /** Input type */
  type?: InputType;
  /** Label text */
  label?: string;
  /** Helper text shown below input */
  helperText?: string;
  /** Error message - when provided, variant becomes 'error' */
  error?: string;
  /** Success message - when provided, variant becomes 'success' */
  success?: string;
  /** Warning message - when provided, variant becomes 'warning' */
  warning?: string;
  /** Whether the input takes full width */
  fullWidth?: boolean;
  /** Icon to show at the start of input */
  startIcon?: React.ReactNode;
  /** Icon to show at the end of input */
  endIcon?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Whether to show character count */
  showCharCount?: boolean;
  /** Maximum character length */
  maxLength?: number;
  /** Custom wrapper class name */
  wrapperClassName?: string;
  /** Whether label is required (shows asterisk) */
  required?: boolean;
}

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



/**
 * Professional Input Component with BEM Methodology
 * 
 * Features:
 * - Pure BEM class-based styling (no inline CSS)
 * - Design token integration via CSS custom properties
 * - Full accessibility support with proper ARIA attributes
 * - Multiple variants and states (error, success, warning)
 * - Icon support with flexible positioning
 * - Character counting functionality
 * - Loading states
 * - Responsive and mobile-optimized
 * - Label and helper text support
 * 
 * @example
 * // Basic input
 * <Input 
 *   label="Email" 
 *   type="email" 
 *   placeholder="Enter your email"
 * />
 * 
 * // Input with icons and validation
 * <Input 
 *   label="Password"
 *   type="password"
 *   startIcon={<Icon name="lock" />}
 *   error="Password must be at least 8 characters"
 *   required
 * />
 * 
 * // Input with character count
 * <Input 
 *   label="Bio"
 *   maxLength={160}
 *   showCharCount
 *   helperText="Tell us about yourself"
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = 'default',
    size = 'm',
    type = 'text',
    label,
    helperText,
    error,
    success,
    warning,
    fullWidth = false,
    startIcon,
    endIcon,
    loading = false,
    showCharCount = false,
    maxLength,
    wrapperClassName = '',
    required = false,
    disabled = false,
    className = '',
    id,
    value,
    defaultValue,
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
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  
  // Use controlled or uncontrolled value
  const currentValue = value !== undefined ? value : internalValue;
  const currentLength = String(currentValue || '').length;
  
  // Determine if input has value (filled state)
  const hasValue = Boolean(currentValue && String(currentValue).length > 0);
  
  // Generate unique IDs for accessibility using React's useId
  const reactId = useId();
  const inputId = id || `input-${reactId}`;
  const labelId = `${inputId}-label`;
  const helperTextId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const successId = `${inputId}-success`;
  const warningId = `${inputId}-warning`;
  const charCountId = `${inputId}-char-count`;
  
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
    if (value === undefined) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  }, [onChange, value]);
  
  // Build aria-describedby
  const describedByIds = [
    ariaDescribedBy,
    helperText && helperTextId,
    error && errorId,
    success && successId,
    warning && warningId,
    showCharCount && maxLength && charCountId
  ].filter(Boolean).join(' ');
  
  // Generate CSS classes with template strings
  const wrapperClasses = [
    'input-wrapper',
    actualVariant && `input-wrapper--${actualVariant}`,
    size && `input-wrapper--${size}`,
    fullWidth && 'input-wrapper--full-width',
    disabled && 'input-wrapper--disabled',
    focused && 'input-wrapper--focused',
    loading && 'input-wrapper--loading',
    hasValue && 'input-wrapper--filled',
    !!(startIcon || endIcon) && 'input-wrapper--has-icon',
    !!startIcon && 'input-wrapper--has-start-icon',
    !!endIcon && 'input-wrapper--has-end-icon',
    wrapperClassName
  ].filter(Boolean).join(' ');
  
  const inputClasses = [
    'input',
    actualVariant && `input--${actualVariant}`,
    size && `input--${size}`,
    fullWidth && 'input--full-width',
    disabled && 'input--disabled',
    focused && 'input--focused',
    loading && 'input--loading',
    className
  ].filter(Boolean).join(' ');
  
  const fieldClasses = [
    'input-field',
    actualVariant && `input-field--${actualVariant}`,
    size && `input-field--${size}`,
    disabled && 'input-field--disabled',
    focused && 'input-field--focused',
    loading && 'input-field--loading',
    hasValue && 'input-field--filled'
  ].filter(Boolean).join(' ');
  
  return (
    <div className={wrapperClasses}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          id={labelId}
          className={createBemClass('input-label', undefined, [
            actualVariant,
            size,
            disabled && 'disabled',
            required && 'required'
          ])}
        >
          {label}
          {required && (
            <span className="input-label__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      {/* Input Field Container */}
      <div className={fieldClasses}>
        {/* Start Icon */}
        {startIcon && (
          <span className="input-field__start-icon" aria-hidden="true">
            {startIcon}
          </span>
        )}
        
        {/* Input Element */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClasses}
          disabled={disabled || loading}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          aria-invalid={actualVariant === 'error' ? 'true' : undefined}
          aria-describedby={describedByIds || undefined}
          aria-labelledby={label ? labelId : undefined}
          {...props}
        />
        
        {/* Loading Spinner */}
        {loading && (
          <span className="input-field__spinner" aria-hidden="true">
            <span className="input-field__spinner-icon"></span>
          </span>
        )}
        
        {/* End Icon */}
        {endIcon && !loading && (
          <span className="input-field__end-icon" aria-hidden="true">
            {endIcon}
          </span>
        )}
      </div>
      
      {/* Helper Text / Messages */}
      <div className="input-messages">
        {/* Error Message */}
        {error && (
          <span 
            id={errorId}
            className={createBemClass('input-message', undefined, ['error'])}
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
            className={createBemClass('input-message', undefined, ['success'])}
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
            className={createBemClass('input-message', undefined, ['warning'])}
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
            className={createBemClass('input-message', undefined, ['helper'])}
          >
            {helperText}
          </span>
        )}
        
        {/* Character Count */}
        {showCharCount && maxLength && (
          <span 
            id={charCountId}
            className={createBemClass('input-char-count', undefined, [
              currentLength > maxLength && 'over-limit'
            ])}
            aria-live="polite"
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
export default Input;
