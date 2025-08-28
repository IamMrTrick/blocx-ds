'use client';
import React, { forwardRef, useState, useCallback, useRef, useEffect, useId } from 'react';

// TextArea size variants based on design tokens
export type TextAreaSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// TextArea variant types
export type TextAreaVariant = 'default' | 'error' | 'success' | 'warning';

// TextArea resize options
export type TextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both';

// Base textarea props
export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** TextArea variant for different states */
  variant?: TextAreaVariant;
  /** Size of the textarea */
  size?: TextAreaSize;
  /** Label text */
  label?: string;
  /** Helper text shown below textarea */
  helperText?: string;
  /** Error message - when provided, variant becomes 'error' */
  error?: string;
  /** Success message - when provided, variant becomes 'success' */
  success?: string;
  /** Warning message - when provided, variant becomes 'warning' */
  warning?: string;
  /** Whether the textarea takes full width */
  fullWidth?: boolean;
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
  /** Resize behavior */
  resize?: TextAreaResize;
  /** Auto-resize based on content */
  autoResize?: boolean;
  /** Minimum rows when auto-resizing */
  minRows?: number;
  /** Maximum rows when auto-resizing */
  maxRows?: number;
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

// Generate unique ID for accessibility


/**
 * Professional TextArea Component with BEM Methodology
 * 
 * Features:
 * - Pure BEM class-based styling (no inline CSS)
 * - Design token integration via CSS custom properties
 * - Full accessibility support with proper ARIA attributes
 * - Multiple variants and states (error, success, warning)
 * - Auto-resize functionality
 * - Character counting functionality
 * - Loading states
 * - Responsive and mobile-optimized
 * - Label and helper text support
 * - Flexible resize options
 * 
 * @example
 * // Basic textarea
 * <TextArea 
 *   label="Description" 
 *   placeholder="Enter description"
 *   rows={4}
 * />
 * 
 * // Auto-resizing textarea with validation
 * <TextArea 
 *   label="Comments"
 *   autoResize
 *   minRows={3}
 *   maxRows={8}
 *   error="Comments are required"
 *   required
 * />
 * 
 * // Textarea with character count
 * <TextArea 
 *   label="Bio"
 *   maxLength={500}
 *   showCharCount
 *   helperText="Tell us about yourself"
 * />
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    variant = 'default',
    size = 'm',
    label,
    helperText,
    error,
    success,
    warning,
    fullWidth = false,
    loading = false,
    showCharCount = false,
    maxLength,
    wrapperClassName = '',
    required = false,
    disabled = false,
    resize = 'vertical',
    autoResize = false,
    minRows = 3,
    maxRows = 10,
    rows = 4,
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Use controlled or uncontrolled value
  const currentValue = value !== undefined ? value : internalValue;
  const currentLength = String(currentValue || '').length;
  
  // Generate unique IDs for accessibility using React's useId
  const reactId = useId();
  const textareaId = id || `textarea-${reactId}`;
  const labelId = `${textareaId}-label`;
  const helperTextId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;
  const successId = `${textareaId}-success`;
  const warningId = `${textareaId}-warning`;
  const charCountId = `${textareaId}-char-count`;
  
  // Determine actual variant based on props
  const actualVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;
  
  // Auto-resize functionality
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current || (ref as React.RefObject<HTMLTextAreaElement>)?.current;
    if (!textarea || !autoResize) return;
    
    // Reset height to calculate scroll height
    textarea.style.height = 'auto';
    
    // Calculate line height
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseInt(computedStyle.lineHeight);
    
    // Calculate min and max heights
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;
    
    // Set new height within bounds
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [autoResize, minRows, maxRows, ref]);
  
  // Handle focus events
  const handleFocus = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(e);
  }, [onFocus]);
  
  const handleBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(e);
  }, [onBlur]);
  
  // Handle change events
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
    
    // Adjust height after content change
    if (autoResize) {
      requestAnimationFrame(adjustHeight);
    }
  }, [onChange, value, autoResize, adjustHeight]);
  
  // Auto-resize on mount and value changes
  useEffect(() => {
    if (autoResize) {
      adjustHeight();
    }
  }, [adjustHeight, currentValue, autoResize]);
  
  // Build aria-describedby
  const describedByIds = [
    ariaDescribedBy,
    helperText && helperTextId,
    error && errorId,
    success && successId,
    warning && warningId,
    showCharCount && maxLength && charCountId
  ].filter(Boolean).join(' ');
  
  // Generate BEM classes
  const wrapperClasses = [
    createBemClass('textarea-wrapper', undefined, [
      actualVariant,
      size,
      fullWidth && 'full-width',
      disabled && 'disabled',
      focused && 'focused',
      loading && 'loading',
      autoResize && 'auto-resize'
    ]),
    wrapperClassName
  ].filter(Boolean).join(' ');
  
  const textareaClasses = [
    createBemClass('textarea', undefined, [
      actualVariant,
      size,
      fullWidth && 'full-width',
      disabled && 'disabled',
      focused && 'focused',
      loading && 'loading',
      resize,
      autoResize && 'auto-resize'
    ]),
    className
  ].filter(Boolean).join(' ');
  
  const fieldClasses = createBemClass('textarea-field', undefined, [
    actualVariant,
    size,
    disabled && 'disabled',
    focused && 'focused',
    loading && 'loading'
  ]);
  
  return (
    <div className={wrapperClasses}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={textareaId}
          id={labelId}
          className={createBemClass('textarea-label', undefined, [
            actualVariant,
            size,
            disabled && 'disabled',
            required && 'required'
          ])}
        >
          {label}
          {required && (
            <span className="textarea-label__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      {/* TextArea Field Container */}
      <div className={fieldClasses}>
        {/* TextArea Element */}
        <textarea
          ref={(node) => {
            // Handle both forwarded ref and internal ref
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            textareaRef.current = node;
          }}
          id={textareaId}
          className={textareaClasses}
          disabled={disabled || loading}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          rows={autoResize ? minRows : rows}
          aria-invalid={actualVariant === 'error' ? 'true' : undefined}
          aria-describedby={describedByIds || undefined}
          aria-labelledby={label ? labelId : undefined}
          style={{
            resize: autoResize ? 'none' : resize
          }}
          {...props}
        />
        
        {/* Loading Spinner */}
        {loading && (
          <span className="textarea-field__spinner" aria-hidden="true">
            <span className="textarea-field__spinner-icon"></span>
          </span>
        )}
      </div>
      
      {/* Helper Text / Messages */}
      <div className="textarea-messages">
        {/* Error Message */}
        {error && (
          <span 
            id={errorId}
            className={createBemClass('textarea-message', undefined, ['error'])}
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
            className={createBemClass('textarea-message', undefined, ['success'])}
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
            className={createBemClass('textarea-message', undefined, ['warning'])}
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
            className={createBemClass('textarea-message', undefined, ['helper'])}
          >
            {helperText}
          </span>
        )}
        
        {/* Character Count */}
        {showCharCount && maxLength && (
          <span 
            id={charCountId}
            className={createBemClass('textarea-char-count', undefined, [
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

TextArea.displayName = 'TextArea';

export { TextArea };
export default TextArea;
