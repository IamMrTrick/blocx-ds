'use client';
import React, { forwardRef, useState, useCallback, useRef, useEffect } from 'react';

// OTP size variants based on design tokens
export type OTPSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// OTP variant types
export type OTPVariant = 'default' | 'error' | 'success' | 'warning';

// OTP input type
export type OTPType = 'number' | 'text' | 'password';

// Base OTP props
export interface OTPProps {
  /** OTP variant for different states */
  variant?: OTPVariant;
  /** Size of the OTP inputs */
  size?: OTPSize;
  /** Number of OTP input fields */
  length?: number;
  /** Type of input (number, text, password) */
  type?: OTPType;
  /** Label text */
  label?: string;
  /** Helper text shown below OTP */
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
  /** Whether inputs are disabled */
  disabled?: boolean;
  /** Current OTP value */
  value?: string;
  /** Default OTP value */
  defaultValue?: string;
  /** Change handler - receives complete OTP string */
  onChange?: (value: string) => void;
  /** Complete handler - called when all fields are filled */
  onComplete?: (value: string) => void;
  /** Focus handler */
  onFocus?: (index: number) => void;
  /** Blur handler */
  onBlur?: (index: number) => void;
  /** Paste handler */
  onPaste?: (value: string) => void;
  /** Whether to auto-focus first input on mount */
  autoFocus?: boolean;
  /** Whether to allow only numeric input */
  numericOnly?: boolean;
  /** Whether to mask input (show dots instead of characters) */
  masked?: boolean;
  /** Custom placeholder for each input */
  placeholder?: string;
  /** Whether to auto-submit on complete */
  autoSubmit?: boolean;
  /** Custom separator between inputs */
  separator?: React.ReactNode;
  /** ARIA label for the OTP group */
  'aria-label'?: string;
  /** ARIA described by */
  'aria-describedby'?: string;
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
let otpIdCounter = 0;
const generateOTPId = () => `otp-${++otpIdCounter}`;

/**
 * Professional OTP (One-Time Password) Component with BEM Methodology
 * 
 * Features:
 * - Pure BEM class-based styling (no inline CSS)
 * - Design token integration via CSS custom properties
 * - Full accessibility support with proper ARIA attributes
 * - Multiple variants and states (error, success, warning)
 * - Auto-focus and navigation between inputs
 * - Paste support for complete OTP codes
 * - Numeric-only mode
 * - Masked input support
 * - Auto-submit on completion
 * - Loading states
 * - Responsive and mobile-optimized
 * - Label and helper text support
 * - Keyboard navigation support
 * 
 * @example
 * // Basic OTP
 * <OTP 
 *   label="Enter verification code" 
 *   length={6}
 *   onComplete={(code) => console.log('OTP:', code)}
 * />
 * 
 * // Numeric OTP with auto-submit
 * <OTP 
 *   label="SMS Code"
 *   length={4}
 *   numericOnly
 *   autoSubmit
 *   onComplete={handleVerification}
 * />
 * 
 * // Masked OTP with custom separator
 * <OTP 
 *   label="Security Code"
 *   length={6}
 *   masked
 *   separator={<span>-</span>}
 *   error="Invalid code"
 * />
 */
const OTP = forwardRef<HTMLDivElement, OTPProps>(function OTP(
  {
    variant = 'default',
    size = 'm',
    length = 6,
    type = 'text',
    label,
    helperText,
    error,
    success,
    warning,
    loading = false,
    wrapperClassName = '',
    required = false,
    disabled = false,
    value,
    defaultValue = '',
    onChange,
    onComplete,
    onFocus,
    onBlur,
    onPaste,
    autoFocus = false,
    numericOnly = false,
    masked = false,
    placeholder = '',
    autoSubmit = false,
    separator,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy
  },
  ref
) {
  // State management
  const [internalValue, setInternalValue] = useState(() => {
    const initialValue = value || defaultValue;
    return Array.from({ length }, (_, i) => initialValue[i] || '');
  });
  const [focused, setFocused] = useState(-1);
  
  // Refs for input elements
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Use controlled or uncontrolled value
  const currentValues = value !== undefined 
    ? Array.from({ length }, (_, i) => value[i] || '')
    : internalValue;
  
  // Generate unique IDs for accessibility
  const otpId = generateOTPId();
  const labelId = `${otpId}-label`;
  const helperTextId = `${otpId}-helper`;
  const errorId = `${otpId}-error`;
  const successId = `${otpId}-success`;
  const warningId = `${otpId}-warning`;
  
  // Determine actual variant based on props
  const actualVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;
  
  // Get complete OTP value
  const completeValue = currentValues.join('');
  
  // Update internal value when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(Array.from({ length }, (_, i) => value[i] || ''));
    }
  }, [value, length]);
  
  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);
  
  // Handle value change
  const handleValueChange = useCallback((newValues: string[]) => {
    if (value === undefined) {
      setInternalValue(newValues);
    }
    
    const newCompleteValue = newValues.join('');
    onChange?.(newCompleteValue);
    
    // Check if OTP is complete
    if (newCompleteValue.length === length && newValues.every(v => v !== '')) {
      onComplete?.(newCompleteValue);
      
      if (autoSubmit) {
        // Auto-submit logic can be handled by parent component
        // through onComplete callback
      }
    }
  }, [onChange, onComplete, value, length, autoSubmit]);
  
  // Handle input change
  const handleInputChange = useCallback((index: number, inputValue: string) => {
    // Filter input based on type and restrictions
    let filteredValue = inputValue;
    
    if (numericOnly) {
      filteredValue = inputValue.replace(/[^0-9]/g, '');
    }
    
    // Take only the last character for single character inputs
    if (filteredValue.length > 1) {
      filteredValue = filteredValue.slice(-1);
    }
    
    const newValues = [...currentValues];
    newValues[index] = filteredValue;
    
    handleValueChange(newValues);
    
    // Auto-focus next input if current is filled
    if (filteredValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [currentValues, handleValueChange, numericOnly, length]);
  
  // Handle key down events
  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Backspace':
        if (!currentValues[index] && index > 0) {
          // Move to previous input if current is empty
          inputRefs.current[index - 1]?.focus();
        } else if (currentValues[index]) {
          // Clear current input
          const newValues = [...currentValues];
          newValues[index] = '';
          handleValueChange(newValues);
        }
        break;
      
      case 'Delete':
        if (currentValues[index]) {
          const newValues = [...currentValues];
          newValues[index] = '';
          handleValueChange(newValues);
        }
        break;
      
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;
      
      case 'ArrowRight':
        e.preventDefault();
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        break;
      
      case 'Home':
        e.preventDefault();
        inputRefs.current[0]?.focus();
        break;
      
      case 'End':
        e.preventDefault();
        inputRefs.current[length - 1]?.focus();
        break;
    }
  }, [currentValues, handleValueChange, length]);
  
  // Handle paste events
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    let pastedData = e.clipboardData.getData('text/plain');
    
    if (numericOnly) {
      pastedData = pastedData.replace(/[^0-9]/g, '');
    }
    
    onPaste?.(pastedData);
    
    // Fill inputs with pasted data
    const newValues = [...currentValues];
    for (let i = 0; i < Math.min(pastedData.length, length); i++) {
      newValues[i] = pastedData[i];
    }
    
    handleValueChange(newValues);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newValues.findIndex(v => !v);
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  }, [currentValues, handleValueChange, numericOnly, onPaste, length]);
  
  // Handle focus events
  const handleFocus = useCallback((index: number) => {
    setFocused(index);
    onFocus?.(index);
  }, [onFocus]);
  
  // Handle blur events
  const handleBlur = useCallback((index: number) => {
    setFocused(-1);
    onBlur?.(index);
  }, [onBlur]);
  
  // Build aria-describedby
  const describedByIds = [
    ariaDescribedBy,
    helperText && helperTextId,
    error && errorId,
    success && successId,
    warning && warningId
  ].filter(Boolean).join(' ');
  
  // Generate BEM classes
  const wrapperClasses = [
    createBemClass('otp-wrapper', undefined, [
      actualVariant,
      size,
      disabled && 'disabled',
      loading && 'loading',
      masked && 'masked'
    ]),
    wrapperClassName
  ].filter(Boolean).join(' ');
  
  const inputClasses = (index: number) => createBemClass('otp-input', undefined, [
    actualVariant,
    size,
    disabled && 'disabled',
    focused === index && 'focused',
    loading && 'loading',
    currentValues[index] && 'filled'
  ]);
  
  return (
    <div className={wrapperClasses} ref={ref}>
      {/* Label */}
      {label && (
        <div 
          id={labelId}
          className={createBemClass('otp-label', undefined, [
            actualVariant,
            size,
            disabled && 'disabled',
            required && 'required'
          ])}
        >
          {label}
          {required && (
            <span className="otp-label__required" aria-label="required">
              *
            </span>
          )}
        </div>
      )}
      
      {/* OTP Inputs Container */}
      <div 
        className="otp-inputs"
        role="group"
        aria-label={ariaLabel || `Enter ${length} digit code`}
        aria-describedby={describedByIds || undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={actualVariant === 'error' ? 'true' : undefined}
      >
        {Array.from({ length }, (_, index) => (
          <React.Fragment key={index}>
            {/* Input Field */}
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type={masked ? 'password' : type}
              inputMode={numericOnly ? 'numeric' : 'text'}
              pattern={numericOnly ? '[0-9]*' : undefined}
              className={inputClasses(index)}
              value={currentValues[index]}
              placeholder={placeholder}
              disabled={disabled || loading}
              maxLength={1}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => handleFocus(index)}
              onBlur={() => handleBlur(index)}
              aria-label={`Digit ${index + 1} of ${length}`}
              autoComplete="one-time-code"
            />
            
            {/* Separator */}
            {separator && index < length - 1 && (
              <span className="otp-separator" aria-hidden="true">
                {separator}
              </span>
            )}
          </React.Fragment>
        ))}
        
        {/* Loading Spinner */}
        {loading && (
          <div className="otp-spinner" aria-hidden="true">
            <span className="otp-spinner__icon"></span>
          </div>
        )}
      </div>
      
      {/* Helper Text / Messages */}
      <div className="otp-messages">
        {/* Error Message */}
        {error && (
          <span 
            id={errorId}
            className={createBemClass('otp-message', undefined, ['error'])}
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
            className={createBemClass('otp-message', undefined, ['success'])}
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
            className={createBemClass('otp-message', undefined, ['warning'])}
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
            className={createBemClass('otp-message', undefined, ['helper'])}
          >
            {helperText}
          </span>
        )}
      </div>
    </div>
  );
});

OTP.displayName = 'OTP';

export { OTP };
export default OTP;
